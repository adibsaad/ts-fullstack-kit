import { FastifyInstance } from 'fastify'

import { isDev } from '@common/env'

import { fastifyErrorHandler } from './error-handler'

export function errors(app: FastifyInstance) {
  app.setErrorHandler(
    fastifyErrorHandler({
      log: isDev
        ? ({ error }) => {
            app.log.error(error)
          }
        : undefined,
    }),
  )
}
