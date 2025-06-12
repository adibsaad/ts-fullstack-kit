import { FRONTEND_URL } from '@server/config/env'
import { InviteEmail } from '@server/email/user/invite'
import { GraphqlError } from '@server/graphql/builder'
import { prisma } from '@server/prisma/client'

import { UserRole } from './enums'

export class UserService {
  static async upsertUserFromGoogleSub({
    googleSub,
    email,
    firstName,
    lastName,
    pictureUrl,
  }: {
    googleSub: string
    email: string
    firstName: string | null | undefined
    lastName: string | null | undefined
    pictureUrl: string | null | undefined
  }) {
    let user = await prisma.user.findFirst({
      where: {
        googleSub,
      },
      select: { id: true, email: true },
    })

    if (user) {
      if (user.email !== email.toLowerCase()) {
        const emailInUse = await prisma.user.findFirst({
          where: {
            email: email.toLowerCase(),
          },
        })

        if (emailInUse) {
          throw new Error('Email is already in use')
        }
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
          pictureUrl,
        },
      })
    } else {
      const team = await prisma.team.create({
        data: {},
      })

      user = await prisma.user.create({
        data: {
          googleSub,
          email: email.toLowerCase(),
          firstName,
          lastName,
          pictureUrl,
          userTeamMembership: {
            create: {
              teamId: team.id,
              role: UserRole.Owner,
            },
          },
        },
      })
    }

    return user
  }

  static async upsertUserFromEmail({ email }: { email: string }) {
    let user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: { id: true, email: true },
    })

    if (!user) {
      const team = await prisma.team.create({
        data: {},
      })

      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          userTeamMembership: {
            create: {
              teamId: team.id,
              role: UserRole.Owner,
            },
          },
        },
      })
    }

    return user
  }

  static async inviteUser({
    email,
    role,
    inviter,
  }: {
    email: string
    role: UserRole
    inviter: { id: number }
  }) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user) {
      throw new GraphqlError('User already exists')
    }

    const inviterTeam = await prisma.team.findFirst({
      where: {
        userTeamMembership: {
          some: {
            userId: inviter.id,
          },
        },
      },
    })

    if (!inviterTeam) {
      throw new GraphqlError('User not in team')
    }

    const invitedUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        invitedAt: new Date(),
        invitedByUserId: inviter.id,

        userTeamMembership: {
          create: {
            role,
            team: {
              connect: {
                id: inviterTeam.id,
              },
            },
          },
        },
      },
    })

    await new InviteEmail().send({
      subject: 'You have been invited to join our platform!',
      to: invitedUser.email,
      data: {
        url: `${FRONTEND_URL}/login`,
      },
    })
  }

  static async getUserRole(userId: number) {
    const membership = await prisma.userTeamMembership.findFirstOrThrow({
      where: {
        userId,
      },
      select: {
        role: true,
      },
    })

    return membership.role as UserRole
  }
}
