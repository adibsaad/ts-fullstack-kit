import { Subscription } from '@paddle/paddle-node-sdk'

import { paddle } from '@server/config/paddle'
import { prisma } from '@server/prisma/client'

import { Builder, GraphqlError } from '../builder'

export function subscriptionMutations(builder: Builder) {
  builder.mutationField('cancelSubscription', t =>
    t.field({
      type: 'Boolean',
      authScopes: {
        private: true,
      },
      errors: {
        types: [GraphqlError],
      },
      resolve: async (_parent, _args, { currentUser }) => {
        const sub = await prisma.subscription.findFirst({
          where: {
            team: {
              userTeamMembership: {
                some: {
                  userId: currentUser!.id,
                },
              },
            },
          },
        })

        if (!sub) {
          throw new GraphqlError('Subscription not found')
        }

        let cancelResponse: Subscription

        try {
          cancelResponse = await paddle.subscriptions.cancel(
            sub.paddleSubscriptionId,
            {
              effectiveFrom: 'next_billing_period',
            },
          )
        } catch {
          throw new GraphqlError('Failed to cancel subscription')
        }

        if (cancelResponse.scheduledChange) {
          if (cancelResponse.scheduledChange.action === 'cancel') {
            await prisma.subscription.update({
              where: {
                id: sub.id,
              },
              data: {
                expiresAt: new Date(cancelResponse.scheduledChange.effectiveAt),
              },
            })
          }
        } else {
          throw new GraphqlError('Failed to cancel subscription')
        }

        return true
      },
    }),
  )

  builder.mutationField('resumeSubscription', t =>
    t.field({
      type: 'Boolean',
      authScopes: {
        private: true,
      },
      errors: {
        types: [GraphqlError],
      },
      resolve: async (_parent, _args, { currentUser }) => {
        const sub = await prisma.subscription.findFirst({
          where: {
            team: {
              userTeamMembership: {
                some: {
                  userId: currentUser!.id,
                },
              },
            },
          },
        })

        if (!sub) {
          throw new GraphqlError('Subscription not found')
        }

        let resumeResponse: Subscription

        try {
          resumeResponse = await paddle.subscriptions.update(
            sub.paddleSubscriptionId,
            {
              scheduledChange: null,
            },
          )
        } catch (error) {
          console.log(error)
          throw new GraphqlError('Failed to resume subscription')
        }

        if (resumeResponse.status === 'active') {
          await prisma.subscription.update({
            where: {
              id: sub.id,
            },
            data: {
              expiresAt: null,
            },
          })
        } else {
          throw new GraphqlError('Failed to resume subscription')
        }

        return true
      },
    }),
  )
}
