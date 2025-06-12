import { createContext } from 'react'

import { gql } from '@apollo/client'

import { useCurrentUserQuery, User } from '@frontend/graphql/generated'

import { useSharedJwt } from '../hooks/jwt'

export const CurrentUserContext = createContext<{
  currentUser: User | null | undefined
  isLoading: boolean
  refetchCurrentUser: () => void
  logOut: () => void
  setJwt: (jwt: string) => void
}>({
  currentUser: null,
  isLoading: true,
  refetchCurrentUser: () => {},
  logOut: () => {},
  setJwt: () => {},
})

gql(/* GraphQL */ `
  query CurrentUser {
    currentUser {
      id
      email
      pictureUrl
      team {
        id
        subscription {
          id
          status
          subName
          expiresAt
        }
      }
    }
  }
`)

export const CurrentUserProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { jwt, clearJwt, setJwt } = useSharedJwt()
  const {
    loading: isLoading,
    data,
    updateQuery,
    refetch,
  } = useCurrentUserQuery({
    skip: !jwt,
  })

  const logOut = () => {
    clearJwt()
    updateQuery(() => ({
      currentUser: null,
    }))
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser: data?.currentUser,
        isLoading,
        refetchCurrentUser: refetch,
        logOut,
        setJwt,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}
