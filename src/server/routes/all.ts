import { FastifyInstance } from 'fastify'

import { DOMAIN_NAME } from '@server/config/env'
import { HelloEmail } from '@server/email/hello'
import { pushJob } from '@server/jobs/pusher'
import { prisma } from '@server/prisma/client'

import { webhookRoutes } from './webhooks/all'
import { yogaRouter } from './yoga'

export async function initRoutes(app: FastifyInstance) {
  app.get('/', () => ({ hello: 'world' }))

  // TODO: Remove these test routes
  app.get('/test_sqs', async () => {
    await pushJob({
      type: 'hello-job',
    })
    return {}
  })

  // TODO: Remove these test routes
  app.get('/test_email', async () => {
    await new HelloEmail().send({
      from: `user1@${DOMAIN_NAME}`,
      to: `user2@${DOMAIN_NAME}`,
      subject: 'Hello',
      data: {
        user: 'user',
      },
    })

    return {}
  })

  app.get('/users', async () => {
    const users = await prisma.user.findMany()
    return { users }
  })

  yogaRouter(app)
  await app.register(webhookRoutes, { prefix: '/webhooks' })
}
