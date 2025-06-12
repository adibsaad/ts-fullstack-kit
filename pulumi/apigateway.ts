import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import * as lambda from './lambda'

export const api = new aws.apigatewayv2.Api('api', {
  protocolType: 'HTTP',
  name: 'api',
  routeSelectionExpression: '$request.method $request.path',
})

new aws.lambda.Permission(
  'lambdaPermission',
  {
    action: 'lambda:InvokeFunction',
    principal: 'apigateway.amazonaws.com',
    function: lambda.apiLambda,
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
  },
  { dependsOn: [api, lambda.apiLambda] },
)

const makeStage = ({
  stageName,
  lambdaInvokeArn,
}: {
  stageName: string
  lambdaInvokeArn: pulumi.Input<string>
}) => {
  const logGroup = new aws.cloudwatch.LogGroup(`${stageName}LogGroup`, {
    name: pulumi.interpolate`/aws/api-gateway/${api.name}/${stageName}`,
    retentionInDays: 30,
  })

  const integration = new aws.apigatewayv2.Integration(
    `${stageName}Integration`,
    {
      apiId: api.id,
      integrationType: 'AWS_PROXY',
      integrationUri: lambdaInvokeArn,
      integrationMethod: 'POST',
    },
  )

  const route = new aws.apigatewayv2.Route(`${stageName}Route`, {
    apiId: api.id,
    routeKey: `ANY /${stageName}/{proxy+}`,
    target: pulumi.interpolate`integrations/${integration.id}`,
  })

  return new aws.apigatewayv2.Stage(
    `${stageName}Stage`,
    {
      apiId: api.id,
      name: stageName,
      routeSettings: [
        {
          routeKey: route.routeKey,
          throttlingBurstLimit: 5000,
          throttlingRateLimit: 10000,
        },
      ],
      autoDeploy: true,
      accessLogSettings: {
        format:
          '$context.identity.sourceIp - [$context.requestTime] $context.httpMethod $context.routeKey $context.protocol $context.status $context.responseLength $context.requestId $context.integrationErrorMessage',
        destinationArn: logGroup.arn,
      },
    },
    { dependsOn: [route, logGroup] },
  )
}

export const prodStage = makeStage({
  stageName: 'prod',
  lambdaInvokeArn: lambda.apiLambda.invokeArn,
})
