import { SQSClient } from '@aws-sdk/client-sqs'

import { isProd } from '@common/env'

import { QUEUE_URL } from './env'

export const sqsClient = isProd
  ? new SQSClient({})
  : new SQSClient({
      endpoint: QUEUE_URL,
      region: 'elasticmq',
      credentials: {
        accessKeyId: 'x',
        secretAccessKey: 'x',
      },
    })
