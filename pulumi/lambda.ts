import * as archive from '@pulumi/archive'
import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import * as sqs from './sqs'
import { stackVars } from './vars'

const lambdaRole = new aws.iam.Role('lambdaRole', {
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Principal: {
          Service: 'lambda.amazonaws.com',
        },
        Effect: 'Allow',
        Sid: '',
      },
    ],
  },
})

const lambdaSqsPolicy = new aws.iam.Policy('lambdaSQSSendMessagePolicy', {
  policy: sqs.defaultProdQueue.arn.apply(queueArn =>
    JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'sqs:GetQueueAttributes',
            'sqs:GetQueueUrl',
            'sqs:SendMessage',
            'sqs:ReceiveMessage',
            'sqs:ChangeMessageVisibility',
            'sqs:DeleteMessage',
          ],
          Resource: queueArn,
        },
      ],
    }),
  ),
})

new aws.iam.RolePolicyAttachment('lambdaRolePolicyAttachment', {
  role: lambdaRole.name,
  policyArn: lambdaSqsPolicy.arn,
})

new aws.iam.RolePolicyAttachment('lambdaRoleAttachment', {
  role: lambdaRole,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
})

const lambdaFile = archive.getFile({
  type: 'zip',
  sourceFile: 'dummy_lambda/index.js',
  outputPath: 'dummy_lambda.zip',
})

const lambdaEnv = {
  SENTRY_DSN: stackVars.prod.SENTRY_DSN,
  FRONTEND_URL: stackVars.prod.FRONTEND_URL,
  DOMAIN_NAME: process.env.DOMAIN_NAME!,
  API_PREFIX: '/prod',
  QUEUE_URL: sqs.defaultProdQueue.url,
  PADDLE_ENVIRONMENT: 'sandbox',
  PADDLE_API_KEY: stackVars.prod.PADDLE_API_KEY,
  PADDLE_WEBHOOK_SECRET: stackVars.prod.PADDLE_WEBHOOK_SECRET,
  JWT_SECRET: stackVars.prod.JWT_SECRET,
  GOOGLE_CLIENT_ID: stackVars.prod.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: stackVars.prod.GOOGLE_CLIENT_SECRET,
  POSTMARK_API_TOKEN: stackVars.prod.POSTMARK_API_TOKEN,
  DATABASE_URL: stackVars.prod.DATABASE_URL,
}

export const apiLambda = new aws.lambda.Function(
  'api',
  {
    code: lambdaFile.then(l => new pulumi.asset.FileArchive(l.outputPath)),
    name: 'api',
    role: lambdaRole.arn,
    // Since the function is bundled through webpack, we have to call index.index
    // to get the entrypoint module
    handler: 'index.index.webHandler',
    runtime: aws.lambda.Runtime.NodeJS22dX,
    environment: {
      variables: lambdaEnv,
    },
    timeout: 60,
  },
  {
    // Need to ignore this because we'll be deploying
    // the lambda function outside of the pulumi infrastructure
    ignoreChanges: ['sourceCodeHash', 'code'],
  },
)

new aws.cloudwatch.LogGroup('apiLambdaLogGroup', {
  name: pulumi.interpolate`/aws/lambda/${apiLambda.name}`,
  retentionInDays: 30,
})

export const workerLambda = new aws.lambda.Function(
  'worker',
  {
    code: lambdaFile.then(l => new pulumi.asset.FileArchive(l.outputPath)),
    name: 'worker',
    role: lambdaRole.arn,
    // Since the function is bundled through webpack, we have to call index.index
    // to get the entrypoint module
    handler: 'index.index.workerHandler',
    runtime: aws.lambda.Runtime.NodeJS18dX,
    environment: {
      variables: lambdaEnv,
    },
    timeout: 60 * 5, // 5 minutes
  },
  {
    // Need to ignore this because we'll be deploying
    // the lambda function outside of the pulumi infrastructure
    ignoreChanges: ['sourceCodeHash', 'code'],
  },
)

new aws.cloudwatch.LogGroup('workerLambdaLogGroup', {
  name: pulumi.interpolate`/aws/lambda/${workerLambda.name}`,
  retentionInDays: 30,
})

new aws.lambda.EventSourceMapping('prodDefaultQueueMapping', {
  eventSourceArn: sqs.defaultProdQueue.arn,
  functionName: workerLambda.arn,
  batchSize: 10,
})
