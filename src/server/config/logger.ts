import pino from 'pino'
import pinoPretty from 'pino-pretty'

import { isProd } from '@common/env'

export const logger = isProd
  ? pino()
  : pino(
      pinoPretty({
        ignore: 'pid,hostname',
        translateTime: true,
      }),
    )
