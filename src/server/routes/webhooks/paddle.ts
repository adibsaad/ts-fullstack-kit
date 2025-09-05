import { FastifyInstance } from 'fastify'

import { PADDLE_WEBHOOK_SECRET } from '@server/config/env'
import { paddle } from '@server/config/paddle'
import { pushJob } from '@server/jobs/pusher'

/**
 * https://developer.paddle.com/webhooks/overview
 *
 * Needs to complete within 5 seconds
 */
export function paddleWebhook(app: FastifyInstance) {
  app.post<{
    Headers: {
      'paddle-signature': string
    }
    Body: Record<string, unknown>
  }>('/paddle', async (req, reply) => {
    const signature = req.headers['paddle-signature'] || ''
    const rawRequestBody = JSON.stringify(req.body)

    if (!signature || !rawRequestBody) {
      return reply.status(400).send()
    }

    const valid = await paddle.webhooks.isSignatureValid(
      rawRequestBody,
      PADDLE_WEBHOOK_SECRET,
      signature,
    )

    if (!valid) {
      return reply.status(400).send()
    }

    await pushJob({
      type: 'paddle-webhook-event',
      payload: rawRequestBody,
    })

    return reply.status(200).send()
  })
}
