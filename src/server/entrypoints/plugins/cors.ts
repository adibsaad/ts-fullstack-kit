import corsFastify from '@fastify/cors'
import { FastifyInstance } from 'fastify'

import { isDev } from '@common/env'

export async function cors(app: FastifyInstance) {
  // TODO: add production domain
  if (isDev) {
    await app.register(corsFastify, {
      origin: ['http://localhost:4000', 'http://lvh.me:4000'],
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
    })
  }
}
