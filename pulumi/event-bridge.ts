import * as aws from '@pulumi/aws'

import * as sqs from './sqs'

// Create an IAM role that allows the scheduler to send messages to the SQS queue
const schedulerRole = new aws.iam.Role('schedulerRole', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: 'scheduler.amazonaws.com',
  }),
})

// Attach the necessary policy to the role
new aws.iam.RolePolicy('schedulerSqsPolicy', {
  role: schedulerRole.id,
  policy: sqs.defaultProdQueue.arn.apply(arn =>
    JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: 'sqs:SendMessage',
          Resource: arn,
        },
      ],
    }),
  ),
})

// Create a scheduler that sends a message to the SQS queue
new aws.scheduler.Schedule('helloHourlyCron', {
  description: 'Hourly hello job',
  scheduleExpression: 'cron(0 * * * ? *)', // Run every hour
  flexibleTimeWindow: {
    mode: 'OFF',
  },
  target: {
    arn: sqs.defaultProdQueue.arn,
    roleArn: schedulerRole.arn,
    input: JSON.stringify({
      type: 'hello-job',
    }),
  },
})
