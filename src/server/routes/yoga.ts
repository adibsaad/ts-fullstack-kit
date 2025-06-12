import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createYoga } from 'graphql-yoga'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '@server/config/env'
import { UserContext } from '@server/graphql/builder'
import { schema } from '@server/graphql/schema'
import { prisma } from '@server/prisma/client'
import { JWTPayload } from '@server/types'

export function yogaRouter(app: FastifyInstance) {
  const yoga = createYoga<
    {
      req: FastifyRequest
      reply: FastifyReply
    },
    UserContext
  >({
    schema,
    // Integrate Fastify logger
    logging: {
      debug: (...args) => args.forEach(arg => app.log.debug(arg)),
      info: (...args) => args.forEach(arg => app.log.info(arg)),
      warn: (...args) => args.forEach(arg => app.log.warn(arg)),
      error: (...args) => args.forEach(arg => app.log.error(arg)),
    },
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')?.[1]
      if (!token) {
        return {
          currentUser: null,
        }
      }

      const userId = await new Promise<number | null>(resolve => {
        jwt.verify(token, JWT_SECRET, function (err, decoded) {
          if (err) {
            resolve(null)
          }

          const payload = decoded as JWTPayload
          resolve(payload.id)
        })
      })

      if (!userId) {
        return {
          currentUser: null,
        }
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          googleSub: true,
        },
      })

      if (!user) {
        return {
          currentUser: null,
        }
      }

      return {
        currentUser: user,
      }
    },
  })

  app.route({
    // Bind to the Yoga's endpoint to avoid rendering on any path
    url: yoga.graphqlEndpoint,
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      const token = req.headers.authorization?.split(' ')?.[1]
      if (token) {
        const isValidToken = await new Promise(r => {
          jwt.verify(token, JWT_SECRET, err => r(!err))
        })

        if (!isValidToken) {
          return reply.code(401).send({ message: 'Unauthorized' })
        }
      }

      // Second parameter adds Fastify's `req` and `reply` to the GraphQL Context
      const response = await yoga.handleNodeRequestAndResponse(req, reply, {
        req,
        reply,
      })

      response.headers.forEach((value, key) => {
        reply = reply.header(key, value)
      })

      return reply.status(response.status).send(response.body)
    },
  })
}
