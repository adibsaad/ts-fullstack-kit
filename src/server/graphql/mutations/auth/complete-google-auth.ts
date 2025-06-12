import { LoginTicket, OAuth2Client } from 'google-auth-library'
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client'

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@server/config/env'
import { Builder, GraphqlError } from '@server/graphql/builder'
import { UserService } from '@server/services/user'

import { AuthSuccessResponseRef, genJwtToken } from './common'

const oAuth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'postmessage',
)

export function completeGoogleAuth(builder: Builder) {
  builder.mutationField('completeGoogleAuth', t =>
    t.field({
      type: AuthSuccessResponseRef,
      errors: {
        types: [GraphqlError],
      },
      args: {
        code: t.arg.string({ required: true }),
      },
      resolve: async (query, { code }) => {
        let tokenResponse: GetTokenResponse
        try {
          tokenResponse = await oAuth2Client.getToken(code)
        } catch (error) {
          return {
            token: '',
            error: 'Invalid user detected. Please try again',
          }
        }

        const { tokens } = tokenResponse
        if (!tokens.id_token) {
          throw new GraphqlError('Invalid user detected. Please try again')
        }

        let ticket: LoginTicket
        try {
          ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: GOOGLE_CLIENT_ID,
          })
        } catch (error) {
          throw new GraphqlError('Invalid user detected. Please try again')
        }

        const profile = ticket.getPayload()
        if (!profile) {
          throw new GraphqlError('Invalid user detected. Please try again')
        }

        if (!profile?.email) {
          throw new GraphqlError('Invalid user detected. Please try again')
        }

        const user = await UserService.upsertUserFromGoogleSub({
          googleSub: profile.sub,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          pictureUrl: profile.picture,
        })

        return {
          token: genJwtToken(user.id),
        }
      },
    }),
  )
}
