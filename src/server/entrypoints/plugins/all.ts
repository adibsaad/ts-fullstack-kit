import { FastifyInstance } from 'fastify'

import { cors } from './cors'
import { errors } from './errors'
import { logs } from './logs'

export async function initPlugins(app: FastifyInstance) {
  logs(app)
  errors(app)
  await cors(app)
}
