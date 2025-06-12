import SchemaBuilder from '@pothos/core'
import ErrorsPlugin from '@pothos/plugin-errors'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'

import { prisma } from '@server/prisma/client'
import { AuthService } from '@server/services/auth'
import { UserRole } from '@server/services/enums'

export interface UserContext {
  currentUser: {
    id: number
    email: string
    googleSub: string | null
  } | null
}

interface SchemaTypes {
  PrismaTypes: PrismaTypes
  AuthScopes: {
    public: boolean
    private: boolean
    role: UserRole[]
  }
  Context: UserContext
  DefaultAuthStrategy: 'all'
}

export class GraphqlError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GraphqlError'
  }
}

export type Builder = PothosSchemaTypes.SchemaBuilder<
  PothosSchemaTypes.ExtendDefaultTypes<SchemaTypes>
>

export const builder = new SchemaBuilder<SchemaTypes>({
  plugins: [ErrorsPlugin, ScopeAuthPlugin, PrismaPlugin],
  prisma: {
    client: prisma,
  },
  scopeAuth: {
    defaultStrategy: 'all',
    unauthorizedError: () => {
      return new GraphqlError('Unauthorized')
    },
    authScopes: context => ({
      public: true,
      private: !!context.currentUser,

      // Role-based permissions
      role: (perm: UserRole[]) =>
        AuthService.hasAnyRole(context.currentUser!.id, perm),
    }),
  },
  errors: {
    defaultTypes: [GraphqlError],
  },
})

builder.objectType(GraphqlError, {
  name: 'Error',
  fields: t => ({
    message: t.exposeString('message', { nullable: false }),
  }),
})
