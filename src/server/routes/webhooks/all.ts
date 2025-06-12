import { FastifyInstance, FastifyPluginCallback } from 'fastify'

import { paddleWebhook } from './paddle'

export const webhookRoutes: FastifyPluginCallback = (
  app: FastifyInstance,
  _,
  done,
) => {
  paddleWebhook(app)
  done()
}
