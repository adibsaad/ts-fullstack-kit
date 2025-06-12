/**
 * https://developer.paddle.com/webhooks/overview
 *
 */
import {
  CustomerUpdatedEvent,
  EventName,
  IEvents,
  SubscriptionCanceledEvent,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
  TransactionCreatedEvent,
} from '@paddle/paddle-node-sdk'
import { Webhooks } from '@paddle/paddle-node-sdk'
import { Prisma } from '@prisma/client'

import { assertNotNull } from '@server/config/asserts'
import { logger } from '@server/config/logger'
import { paddle } from '@server/config/paddle'
import { prisma } from '@server/prisma/client'
import { SubscriptionStatus } from '@server/services/enums'
import { PaddleWebhookEvent } from '@server/types'

interface TransactionCreatedData {
  userId: string
}

export async function handlePaddleWebhook(job: PaddleWebhookEvent) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const parsed = JSON.parse(job.payload)
  const event = Webhooks.fromJson(parsed as IEvents)

  if (!event) {
    return
  }

  await prisma.paddleWebhookEvent.upsert({
    where: {
      eventId: event.eventId,
    },
    create: {
      eventId: event.eventId,
      eventType: event.eventType,
      payload: parsed as Prisma.JsonObject,
    },
    update: {
      eventType: event.eventType,
      payload: parsed as Prisma.JsonObject,
    },
  })

  if (event.eventType === EventName.TransactionCreated) {
    await handleTransactionCreated(event)
  } else if (event.eventType === EventName.CustomerUpdated) {
    await handleCustomerUpdated(event)
  } else if (event.eventType === EventName.SubscriptionCreated) {
    await handleSubscriptionCreated(event)
  } else if (event.eventType === EventName.SubscriptionCanceled) {
    await handleSubscriptionCanceled(event)
  } else if (event.eventType === EventName.SubscriptionUpdated) {
    await handleSubscriptionUpdated(event)
  } else {
    console.error(`Unhandled event: ${event.eventType}`)
  }

  logger.info(
    `[evtid=${event.eventId}][type=${event.eventType}] Paddle webhook event processed`,
  )
}

async function handleTransactionCreated(event: TransactionCreatedEvent) {
  const userIdStr = (event.data.customData as TransactionCreatedData)?.userId
  if (!userIdStr) {
    throw new Error(
      `[evtid=${event.eventId}][TransactionCreated] User ID not present in custom data: ${JSON.stringify(event.data.customData)}`,
    )
  }

  const userId = Number(userIdStr)
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  })

  if (!user) {
    console.error(
      `[evtId=${event.eventId}][TransactionCreated] User not found: ${userId}`,
    )
  }

  const customerId = event.data.customerId
  if (!customerId) {
    throw new Error(
      `[evtId=${event.eventId}][TransactionCreated] Customer ID not present: ${JSON.stringify(event.data)}`,
    )
  }

  const paddleCustomer = await paddle.customers.get(event.data.customerId)
  await prisma.userPaddleInfo.upsert({
    where: {
      userId: user.id,
    },
    create: {
      userId: user.id,
      customerId: event.data.customerId,
      email: paddleCustomer.email,
    },
    update: {
      email: paddleCustomer.email,
    },
  })
}

async function handleCustomerUpdated(event: CustomerUpdatedEvent) {
  const userPaddleInfo = await prisma.userPaddleInfo.findFirstOrThrow({
    where: {
      customerId: event.data.id,
    },
  })

  const paddleCustomer = await paddle.customers.get(event.data.id)

  userPaddleInfo.email = paddleCustomer.email
  await prisma.userPaddleInfo.update({
    where: {
      userId: userPaddleInfo.userId,
    },
    data: {
      email: paddleCustomer.email,
    },
  })
}

async function handleSubscriptionCreated(event: SubscriptionCreatedEvent) {
  const userPaddleInfo = await prisma.userPaddleInfo.findFirstOrThrow({
    where: {
      customerId: event.data.customerId,
    },
    select: {
      user: {
        select: {
          id: true,
          userTeamMembership: {
            select: {
              team: {
                select: {
                  id: true,
                  subscription: true,
                },
              },
            },
          },
        },
      },
    },
  })

  assertNotNull(
    userPaddleInfo.user.userTeamMembership,
    'user.userTeamMembership',
  )

  const existingCurrentSub =
    userPaddleInfo.user.userTeamMembership.team.subscription.find(
      s => s.isCurrent,
    )

  if (existingCurrentSub) {
    throw new Error(
      `[handleSubscriptionCreated] User ${userPaddleInfo.user.id} already has a current subscription`,
    )
  }

  const sub = await prisma.subscription.findFirst({
    where: {
      paddleSubscriptionId: event.data.id,
    },
  })

  if (sub) {
    logger.info(
      `[handleSubscriptionCreated] Subscription ${event.data.id} already exists`,
    )
    return
  }

  await prisma.subscription.create({
    data: {
      status: SubscriptionStatus.Active,
      teamId: userPaddleInfo.user.userTeamMembership.team.id,
      isCurrent: true,
      paddleSubscriptionId: event.data.id,
      paddlePriceId: event.data.items[0].price!.id,
    },
  })
}

async function handleSubscriptionUpdated(event: SubscriptionUpdatedEvent) {
  const sub = await prisma.subscription.findFirstOrThrow({
    where: {
      paddleSubscriptionId: event.data.id,
    },
    select: {
      id: true,
      status: true,
      expiresAt: true,
    },
  })

  sub.status =
    event.data.status === 'active'
      ? SubscriptionStatus.Active
      : SubscriptionStatus.Inactive

  if (event.data.scheduledChange) {
    if (event.data.scheduledChange.action === 'cancel') {
      sub.expiresAt = new Date(event.data.scheduledChange.effectiveAt)
    }
  } else {
    sub.expiresAt = event.data.canceledAt
      ? new Date(event.data.canceledAt)
      : null
  }

  await prisma.subscription.update({
    where: {
      id: sub.id,
    },
    data: sub,
  })
}

async function handleSubscriptionCanceled(event: SubscriptionCanceledEvent) {
  const sub = await prisma.subscription.findFirstOrThrow({
    where: {
      paddleSubscriptionId: event.data.id,
    },
    select: {
      id: true,
      status: true,
      expiresAt: true,
      isCurrent: true,
    },
  })

  if (!event.data.canceledAt) {
    throw new Error(
      `[evtId=${event.eventId}][SubscriptionCanceled] canceledAt not present: ${JSON.stringify(event.data)}`,
    )
  }

  sub.status = SubscriptionStatus.Cancelled
  sub.isCurrent = false
  sub.expiresAt = new Date(event.data.canceledAt)
  await prisma.subscription.update({
    where: {
      id: sub.id,
    },
    data: sub,
  })
}
