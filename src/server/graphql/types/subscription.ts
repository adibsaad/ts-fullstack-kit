import { SubscriptionStatus } from '@server/services/enums'

import { Builder } from '../builder'

// TODO: Replace these with actual paddle price ids
const hobbyPriceId = 'pri_01j7vb384adt2aa8zt5xeb9fby'
const proPriceId = 'pri_01j9hr1ekws9x1rb4kew6jw801'

export function subscription(builder: Builder) {
  const subStatus = builder.enumType('SubscriptionStatus', {
    values: ['Active', 'Inactive'] as const,
  })

  const subName = builder.enumType('SubscriptionName', {
    values: ['Hobby', 'Pro'] as const,
  })

  builder.prismaObject('Subscription', {
    name: 'UserSubscription',
    fields: t => ({
      id: t.exposeID('id'),
      expiresAt: t.field({
        nullable: true,
        type: 'String',
        resolve: parent => parent.expiresAt?.toISOString(),
      }),
      subName: t.field({
        nullable: false,
        type: subName,
        resolve: parent => {
          if (parent.paddlePriceId === hobbyPriceId) {
            return 'Hobby'
          } else if (parent.paddlePriceId === proPriceId) {
            return 'Pro'
          }

          throw new Error('Unknown subscription name')
        },
      }),
      status: t.field({
        nullable: false,
        type: subStatus,
        resolve: parent => {
          if (parent.status === SubscriptionStatus.Active.toString()) {
            if (parent.expiresAt && parent.expiresAt < new Date()) {
              return 'Inactive'
            }

            return 'Active'
          }

          return 'Inactive'
        },
      }),
    }),
  })
}
