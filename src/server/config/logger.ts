import pino from 'pino'
import pinoPretty from 'pino-pretty'

import { isProd } from '@common/env'

export const logger = isProd
  ? pino()
  : pino(
      pinoPretty({
        translateTime: true,
        ignore: 'pid,hostname,reqId,responseTime,req,res',
        messageFormat: (log: Record<string, unknown>, messageKey: string) => {
          let msg = ''
          if (log.reqId) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
            msg = msg.concat(`reqId=${log.reqId} `)
          }

          if (log.req) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            msg = msg.concat(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
              `${(log.req as any).method} ${(log.req as any).url} - `,
            )
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          if ((log.res as any)?.statusCode) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            msg = msg.concat(`status=${(log.res as any)?.statusCode} `)
          }

          if (log.responseTime) {
            msg = msg.concat(`t=${Number(log.responseTime).toFixed(2)} `)
          }

          if (log[messageKey]) {
            msg = msg.concat(log[messageKey] as string)
          }
          return msg
        },
      }),
    )
