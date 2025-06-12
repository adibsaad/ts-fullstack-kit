import { Builder } from '../builder'
import { add } from './add'
import { completeGoogleAuth } from './auth/complete-google-auth'
import { magicLinkAuth } from './auth/magic-link'
import { resourcesMut } from './resources'
import { subscriptionMutations } from './subscription'
import { userMutations } from './user'

export function mutations(builder: Builder) {
  builder.mutationType({})
  add(builder)
  resourcesMut(builder)
  completeGoogleAuth(builder)
  magicLinkAuth(builder)
  subscriptionMutations(builder)
  userMutations(builder)
}
