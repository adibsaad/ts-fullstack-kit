import { prisma } from '@server/prisma/client'
import { UserService } from '@server/services/user'

import { Builder } from '../builder'
import { roleRef } from './enums'

export function user(builder: Builder) {
  builder.prismaObject('User', {
    fields: t => ({
      id: t.exposeID('id'),
      email: t.exposeString('email'),
      firstName: t.exposeString('firstName', { nullable: true }),
      lastName: t.exposeString('lastName', { nullable: true }),
      pictureUrl: t.exposeString('pictureUrl', { nullable: true }),
      hasGoogleAuth: t.field({
        type: 'Boolean',
        resolve: parent => {
          return !!parent.googleSub
        },
      }),
      role: t.field({
        type: roleRef,
        nullable: false,
        resolve: parent => UserService.getUserRole(parent.id),
      }),
      team: t.prismaField({
        type: 'Team',
        nullable: false,
        resolve: (query, parent) =>
          prisma.team.findFirstOrThrow({
            ...query,
            where: {
              userTeamMembership: {
                some: {
                  userId: parent.id,
                },
              },
            },
          }),
      }),
    }),
  })
}
