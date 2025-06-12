import * as aws from '@pulumi/aws'

export const makeQueue = ({
  name,
  visibilityTimeoutSeconds = 30,
}: {
  name: string
  visibilityTimeoutSeconds?: number
}) => {
  const deadLetterQueue = new aws.sqs.Queue(`${name}-dlq`, {
    name: `${name}-dlq`,
  })

  return new aws.sqs.Queue(name, {
    name,
    visibilityTimeoutSeconds,
    redrivePolicy: deadLetterQueue.arn.apply(deadLetterQueueArn =>
      JSON.stringify({
        deadLetterTargetArn: deadLetterQueueArn,
        maxReceiveCount: 5,
      }),
    ),
  })
}

export const defaultProdQueue = makeQueue({
  name: 'default-prod-queue',
  visibilityTimeoutSeconds: 60 * 15,
})
