import { v4 } from 'uuid'

import { FRONTEND_URL } from '@server/config/env'
import { MagicLinkEmail } from '@server/email/user/magic-link'
import { GraphqlError } from '@server/graphql/builder'
import { prisma } from '@server/prisma/client'

import { UserRole } from './enums'

const EXPIRY = 1000 * 60 * 60 * 24

export class AuthService {
  // TODO: add some kind of rate limiting to prevent abuse
  static async sendMagicLink(email: string) {
    const token = v4()
    await prisma.magicLink.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + EXPIRY),
      },
    })

    await new MagicLinkEmail().send({
      subject: 'Login Link',
      to: email,

      data: {
        url: `${FRONTEND_URL}/auth/magic-link?token=${token}`,
      },
    })
  }

  static async completeMagicLink(token: string) {
    const magicLink = await prisma.magicLink.findUnique({
      where: { token },
    })

    if (!magicLink || magicLink.expiresAt < new Date()) {
      throw new GraphqlError('Invalid token')
    }

    await prisma.magicLink.delete({
      where: { token },
    })

    return magicLink.email
  }

  static async hasAnyRole(userId: number, roles: UserRole[]) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        userTeamMembership: {
          select: {
            role: true,
          },
        },
      },
    })

    if (!user?.userTeamMembership) {
      throw new GraphqlError('User not found')
    }

    return roles.includes(user.userTeamMembership.role as UserRole)
  }
}
