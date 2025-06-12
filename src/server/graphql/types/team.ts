import { prisma } from '@server/prisma/client'

import { Builder } from '../builder'

export function team(builder: Builder) {
  builder.prismaObject('Team', {
    fields: t => ({
      id: t.exposeID('id'),
      users: t.prismaField({
        type: ['User'],
        resolve: (query, root) =>
          prisma.user.findMany({
            ...query,
            where: {
              userTeamMembership: {
                teamId: root.id,
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          }),
      }),
      subscription: t.prismaField({
        type: 'Subscription',
        resolve: (query, root) =>
          prisma.subscription.findFirst({
            ...query,
            where: { isCurrent: true, teamId: root.id },
          }),
      }),
    }),
  })
}
