import { useEffect, useRef } from 'react'

import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  useApolloClient,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

import { baseApiUrl } from './config/consts'
import { useSharedJwt } from './hooks/jwt'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const httpLink = new HttpLink({
  uri: `${baseApiUrl}/graphql`,
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
})

export const ClientLinkBuilder = () => {
  const { clearJwt } = useSharedJwt()
  const client = useApolloClient()
  const hasSetLinkRef = useRef(false)

  useEffect(() => {
    if (hasSetLinkRef.current) {
      return
    }

    hasSetLinkRef.current = true

    client.setLink(
      from([
        authLink,
        onError(({ operation }) => {
          const context = operation.getContext()
          if (context?.response?.status === 401) {
            clearJwt()
          }
        }),
        httpLink,
      ]),
    )
  }, [client, clearJwt])

  return null
}
