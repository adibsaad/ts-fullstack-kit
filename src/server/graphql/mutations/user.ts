import { assertNotNull } from '@server/config/asserts'
import { UserRole } from '@server/services/enums'
import { UserService } from '@server/services/user'

import { Builder, GraphqlError } from '../builder'

export function userMutations(builder: Builder) {
  builder.mutationField('inviteUser', t =>
    t.field({
      type: 'Boolean',
      authScopes: {
        $all: {
          private: true,
          role: [UserRole.Owner, UserRole.Admin],
        },
      },
      errors: {
        types: [GraphqlError],
      },
      args: {
        email: t.arg.string({ required: true }),
        role: t.arg({
          type: builder.enumType('InviteUserRole', {
            values: ['ADMIN', 'MEMBER'] as const,
          }),
          required: true,
        }),
      },
      resolve: async (_parent, { email, role }, { currentUser }) => {
        assertNotNull(currentUser, 'User not authenticated')
        await UserService.inviteUser({
          email,
          role: role === 'ADMIN' ? UserRole.Admin : UserRole.Member,
          inviter: currentUser,
        })

        return true
      },
    }),
  )
}
