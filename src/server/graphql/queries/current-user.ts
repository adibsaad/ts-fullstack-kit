import { prisma } from '@server/prisma/client'

import type { Builder } from '../builder'

export function currentUser(builder: Builder) {
  builder.queryField('currentUser', t =>
    t.prismaField({
      authScopes: { private: true },
      type: 'User',
      resolve: (query, _parent, _args, { currentUser: cu }) => {
        if (!cu) {
          return null
        }
        return prisma.user.findUnique({
          ...query,
          where: {
            id: cu.id,
          },
        })
      },
    }),
  )
}
