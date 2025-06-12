import Fastify, { FastifyBaseLogger } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'node:http'
import { v4 as uuid } from 'uuid'

import { API_PREFIX } from '@server/config/env'

import { logger } from '../config/logger'
import { initRoutes } from '../routes/all'
import { initPlugins } from './plugins/all'

export async function genFastifyApp() {
  const app = Fastify<
    Server,
    IncomingMessage,
    ServerResponse,
    FastifyBaseLogger
  >({
    disableRequestLogging: true,
    logger,
    genReqId() {
      return uuid()
    },
  })

  await initPlugins(app)
  await app.register(initRoutes, { prefix: API_PREFIX })
  return app
}
