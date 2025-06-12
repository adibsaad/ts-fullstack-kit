import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type AuthSuccessResponse = {
  __typename?: 'AuthSuccessResponse'
  token: Scalars['String']['output']
}

export type Error = {
  __typename?: 'Error'
  message: Scalars['String']['output']
}

export enum InviteUserRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
}

export type Mutation = {
  __typename?: 'Mutation'
  add?: Maybe<Scalars['Int']['output']>
  cancelSubscription?: Maybe<MutationCancelSubscriptionResult>
  completeGoogleAuth?: Maybe<MutationCompleteGoogleAuthResult>
  completeMagicLink?: Maybe<MutationCompleteMagicLinkResult>
  inviteUser?: Maybe<MutationInviteUserResult>
  magicLink?: Maybe<MutationMagicLinkResult>
  resumeSubscription?: Maybe<MutationResumeSubscriptionResult>
  saveResources?: Maybe<Array<Resource>>
}

export type MutationAddArgs = {
  a: Scalars['Int']['input']
  b: Scalars['Int']['input']
}

export type MutationCompleteGoogleAuthArgs = {
  code: Scalars['String']['input']
}

export type MutationCompleteMagicLinkArgs = {
  token: Scalars['String']['input']
}

export type MutationInviteUserArgs = {
  email: Scalars['String']['input']
  role: InviteUserRole
}

export type MutationMagicLinkArgs = {
  email: Scalars['String']['input']
}

export type MutationSaveResourcesArgs = {
  resources: Array<ResourceInput>
}

export type MutationCancelSubscriptionResult =
  | Error
  | MutationCancelSubscriptionSuccess

export type MutationCancelSubscriptionSuccess = {
  __typename?: 'MutationCancelSubscriptionSuccess'
  data: Scalars['Boolean']['output']
}

export type MutationCompleteGoogleAuthResult =
  | Error
  | MutationCompleteGoogleAuthSuccess

export type MutationCompleteGoogleAuthSuccess = {
  __typename?: 'MutationCompleteGoogleAuthSuccess'
  data: AuthSuccessResponse
}

export type MutationCompleteMagicLinkResult =
  | Error
  | MutationCompleteMagicLinkSuccess

export type MutationCompleteMagicLinkSuccess = {
  __typename?: 'MutationCompleteMagicLinkSuccess'
  data: AuthSuccessResponse
}

export type MutationInviteUserResult = Error | MutationInviteUserSuccess

export type MutationInviteUserSuccess = {
  __typename?: 'MutationInviteUserSuccess'
  data: Scalars['Boolean']['output']
}

export type MutationMagicLinkResult = Error | MutationMagicLinkSuccess

export type MutationMagicLinkSuccess = {
  __typename?: 'MutationMagicLinkSuccess'
  data: Scalars['Boolean']['output']
}

export type MutationResumeSubscriptionResult =
  | Error
  | MutationResumeSubscriptionSuccess

export type MutationResumeSubscriptionSuccess = {
  __typename?: 'MutationResumeSubscriptionSuccess'
  data: Scalars['Boolean']['output']
}

export type Query = {
  __typename?: 'Query'
  currentUser?: Maybe<User>
  hello?: Maybe<Scalars['String']['output']>
  resources?: Maybe<Array<Resource>>
}

export type Resource = {
  __typename?: 'Resource'
  field: Scalars['String']['output']
  id: Scalars['ID']['output']
}

export type ResourceInput = {
  field: Scalars['String']['input']
  id: Scalars['String']['input']
  new?: InputMaybe<Scalars['Boolean']['input']>
  remove?: InputMaybe<Scalars['Boolean']['input']>
}

export enum SubscriptionName {
  Hobby = 'Hobby',
  Pro = 'Pro',
}

export enum SubscriptionStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export type Team = {
  __typename?: 'Team'
  id?: Maybe<Scalars['ID']['output']>
  subscription?: Maybe<UserSubscription>
  users?: Maybe<Array<User>>
}

export type User = {
  __typename?: 'User'
  email?: Maybe<Scalars['String']['output']>
  firstName?: Maybe<Scalars['String']['output']>
  hasGoogleAuth?: Maybe<Scalars['Boolean']['output']>
  id?: Maybe<Scalars['ID']['output']>
  lastName?: Maybe<Scalars['String']['output']>
  pictureUrl?: Maybe<Scalars['String']['output']>
  role: UserRole
  team: Team
}

export enum UserRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Owner = 'OWNER',
}

export type UserSubscription = {
  __typename?: 'UserSubscription'
  expiresAt?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['ID']['output']>
  status: SubscriptionStatus
  subName: SubscriptionName
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserQuery = {
  __typename?: 'Query'
  currentUser?: {
    __typename?: 'User'
    id?: string | null
    email?: string | null
    pictureUrl?: string | null
    team: {
      __typename?: 'Team'
      id?: string | null
      subscription?: {
        __typename?: 'UserSubscription'
        id?: string | null
        status: SubscriptionStatus
        subName: SubscriptionName
        expiresAt?: string | null
      } | null
    }
  } | null
}

export type CompleteMagicLinkMutationVariables = Exact<{
  token: Scalars['String']['input']
}>

export type CompleteMagicLinkMutation = {
  __typename?: 'Mutation'
  completeMagicLink?:
    | { __typename: 'Error'; message: string }
    | {
        __typename: 'MutationCompleteMagicLinkSuccess'
        data: { __typename?: 'AuthSuccessResponse'; token: string }
      }
    | null
}

export type ResourcesQueryVariables = Exact<{ [key: string]: never }>

export type ResourcesQuery = {
  __typename?: 'Query'
  resources?: Array<{
    __typename?: 'Resource'
    id: string
    field: string
  }> | null
}

export type SaveResourcesMutationVariables = Exact<{
  resources: Array<ResourceInput> | ResourceInput
}>

export type SaveResourcesMutation = {
  __typename?: 'Mutation'
  saveResources?: Array<{
    __typename?: 'Resource'
    id: string
    field: string
  }> | null
}

export type MyHelloQueryVariables = Exact<{ [key: string]: never }>

export type MyHelloQuery = { __typename?: 'Query'; hello?: string | null }

export type AddMutationVariables = Exact<{
  a: Scalars['Int']['input']
  b: Scalars['Int']['input']
}>

export type AddMutation = { __typename?: 'Mutation'; add?: number | null }

export type InviteUserMutationVariables = Exact<{
  email: Scalars['String']['input']
  role: InviteUserRole
}>

export type InviteUserMutation = {
  __typename?: 'Mutation'
  inviteUser?:
    | { __typename: 'Error'; message: string }
    | { __typename: 'MutationInviteUserSuccess'; data: boolean }
    | null
}

export type CompleteGoogleAuthMutationVariables = Exact<{
  code: Scalars['String']['input']
}>

export type CompleteGoogleAuthMutation = {
  __typename?: 'Mutation'
  completeGoogleAuth?:
    | { __typename?: 'Error'; message: string }
    | {
        __typename?: 'MutationCompleteGoogleAuthSuccess'
        data: { __typename?: 'AuthSuccessResponse'; token: string }
      }
    | null
}

export type MagicLinkMutationVariables = Exact<{
  email: Scalars['String']['input']
}>

export type MagicLinkMutation = {
  __typename?: 'Mutation'
  magicLink?:
    | { __typename: 'Error'; message: string }
    | { __typename: 'MutationMagicLinkSuccess'; data: boolean }
    | null
}

export type CancelSubscriptionMutationVariables = Exact<{
  [key: string]: never
}>

export type CancelSubscriptionMutation = {
  __typename?: 'Mutation'
  cancelSubscription?:
    | { __typename: 'Error'; message: string }
    | { __typename: 'MutationCancelSubscriptionSuccess'; data: boolean }
    | null
}

export type ResumeSubscriptionMutationVariables = Exact<{
  [key: string]: never
}>

export type ResumeSubscriptionMutation = {
  __typename?: 'Mutation'
  resumeSubscription?:
    | { __typename: 'Error'; message: string }
    | { __typename: 'MutationResumeSubscriptionSuccess'; data: boolean }
    | null
}

export type TeamMembersQueryVariables = Exact<{ [key: string]: never }>

export type TeamMembersQuery = {
  __typename?: 'Query'
  currentUser?: {
    __typename?: 'User'
    team: {
      __typename?: 'Team'
      id?: string | null
      users?: Array<{
        __typename?: 'User'
        id?: string | null
        pictureUrl?: string | null
        email?: string | null
        role: UserRole
        firstName?: string | null
        lastName?: string | null
      }> | null
    }
  } | null
}

export const CurrentUserDocument = gql`
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
`

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    options,
  )
}
export function useCurrentUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    options,
  )
}
export function useCurrentUserSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        CurrentUserQuery,
        CurrentUserQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    options,
  )
}
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>
export type CurrentUserLazyQueryHookResult = ReturnType<
  typeof useCurrentUserLazyQuery
>
export type CurrentUserSuspenseQueryHookResult = ReturnType<
  typeof useCurrentUserSuspenseQuery
>
export type CurrentUserQueryResult = Apollo.QueryResult<
  CurrentUserQuery,
  CurrentUserQueryVariables
>
export const CompleteMagicLinkDocument = gql`
  mutation CompleteMagicLink($token: String!) {
    completeMagicLink(token: $token) {
      __typename
      ... on Error {
        message
      }
      ... on MutationCompleteMagicLinkSuccess {
        data {
          token
        }
      }
    }
  }
`
export type CompleteMagicLinkMutationFn = Apollo.MutationFunction<
  CompleteMagicLinkMutation,
  CompleteMagicLinkMutationVariables
>

/**
 * __useCompleteMagicLinkMutation__
 *
 * To run a mutation, you first call `useCompleteMagicLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteMagicLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeMagicLinkMutation, { data, loading, error }] = useCompleteMagicLinkMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useCompleteMagicLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CompleteMagicLinkMutation,
    CompleteMagicLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    CompleteMagicLinkMutation,
    CompleteMagicLinkMutationVariables
  >(CompleteMagicLinkDocument, options)
}
export type CompleteMagicLinkMutationHookResult = ReturnType<
  typeof useCompleteMagicLinkMutation
>
export type CompleteMagicLinkMutationResult =
  Apollo.MutationResult<CompleteMagicLinkMutation>
export type CompleteMagicLinkMutationOptions = Apollo.BaseMutationOptions<
  CompleteMagicLinkMutation,
  CompleteMagicLinkMutationVariables
>
export const ResourcesDocument = gql`
  query Resources {
    resources {
      id
      field
    }
  }
`

/**
 * __useResourcesQuery__
 *
 * To run a query within a React component, call `useResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourcesQuery({
 *   variables: {
 *   },
 * });
 */
export function useResourcesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ResourcesQuery,
    ResourcesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ResourcesQuery, ResourcesQueryVariables>(
    ResourcesDocument,
    options,
  )
}
export function useResourcesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ResourcesQuery,
    ResourcesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ResourcesQuery, ResourcesQueryVariables>(
    ResourcesDocument,
    options,
  )
}
export function useResourcesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ResourcesQuery, ResourcesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ResourcesQuery, ResourcesQueryVariables>(
    ResourcesDocument,
    options,
  )
}
export type ResourcesQueryHookResult = ReturnType<typeof useResourcesQuery>
export type ResourcesLazyQueryHookResult = ReturnType<
  typeof useResourcesLazyQuery
>
export type ResourcesSuspenseQueryHookResult = ReturnType<
  typeof useResourcesSuspenseQuery
>
export type ResourcesQueryResult = Apollo.QueryResult<
  ResourcesQuery,
  ResourcesQueryVariables
>
export const SaveResourcesDocument = gql`
  mutation SaveResources($resources: [ResourceInput!]!) {
    saveResources(resources: $resources) {
      id
      field
    }
  }
`
export type SaveResourcesMutationFn = Apollo.MutationFunction<
  SaveResourcesMutation,
  SaveResourcesMutationVariables
>

/**
 * __useSaveResourcesMutation__
 *
 * To run a mutation, you first call `useSaveResourcesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveResourcesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveResourcesMutation, { data, loading, error }] = useSaveResourcesMutation({
 *   variables: {
 *      resources: // value for 'resources'
 *   },
 * });
 */
export function useSaveResourcesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SaveResourcesMutation,
    SaveResourcesMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    SaveResourcesMutation,
    SaveResourcesMutationVariables
  >(SaveResourcesDocument, options)
}
export type SaveResourcesMutationHookResult = ReturnType<
  typeof useSaveResourcesMutation
>
export type SaveResourcesMutationResult =
  Apollo.MutationResult<SaveResourcesMutation>
export type SaveResourcesMutationOptions = Apollo.BaseMutationOptions<
  SaveResourcesMutation,
  SaveResourcesMutationVariables
>
export const MyHelloDocument = gql`
  query MyHello {
    hello
  }
`

/**
 * __useMyHelloQuery__
 *
 * To run a query within a React component, call `useMyHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyHelloQuery(
  baseOptions?: Apollo.QueryHookOptions<MyHelloQuery, MyHelloQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MyHelloQuery, MyHelloQueryVariables>(
    MyHelloDocument,
    options,
  )
}
export function useMyHelloLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MyHelloQuery,
    MyHelloQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MyHelloQuery, MyHelloQueryVariables>(
    MyHelloDocument,
    options,
  )
}
export function useMyHelloSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyHelloQuery, MyHelloQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MyHelloQuery, MyHelloQueryVariables>(
    MyHelloDocument,
    options,
  )
}
export type MyHelloQueryHookResult = ReturnType<typeof useMyHelloQuery>
export type MyHelloLazyQueryHookResult = ReturnType<typeof useMyHelloLazyQuery>
export type MyHelloSuspenseQueryHookResult = ReturnType<
  typeof useMyHelloSuspenseQuery
>
export type MyHelloQueryResult = Apollo.QueryResult<
  MyHelloQuery,
  MyHelloQueryVariables
>
export const AddDocument = gql`
  mutation Add($a: Int!, $b: Int!) {
    add(a: $a, b: $b)
  }
`
export type AddMutationFn = Apollo.MutationFunction<
  AddMutation,
  AddMutationVariables
>

/**
 * __useAddMutation__
 *
 * To run a mutation, you first call `useAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMutation, { data, loading, error }] = useAddMutation({
 *   variables: {
 *      a: // value for 'a'
 *      b: // value for 'b'
 *   },
 * });
 */
export function useAddMutation(
  baseOptions?: Apollo.MutationHookOptions<AddMutation, AddMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AddMutation, AddMutationVariables>(
    AddDocument,
    options,
  )
}
export type AddMutationHookResult = ReturnType<typeof useAddMutation>
export type AddMutationResult = Apollo.MutationResult<AddMutation>
export type AddMutationOptions = Apollo.BaseMutationOptions<
  AddMutation,
  AddMutationVariables
>
export const InviteUserDocument = gql`
  mutation InviteUser($email: String!, $role: InviteUserRole!) {
    inviteUser(email: $email, role: $role) {
      __typename
      ... on Error {
        message
      }
      ... on MutationInviteUserSuccess {
        data
      }
    }
  }
`
export type InviteUserMutationFn = Apollo.MutationFunction<
  InviteUserMutation,
  InviteUserMutationVariables
>

/**
 * __useInviteUserMutation__
 *
 * To run a mutation, you first call `useInviteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteUserMutation, { data, loading, error }] = useInviteUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useInviteUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    InviteUserMutation,
    InviteUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<InviteUserMutation, InviteUserMutationVariables>(
    InviteUserDocument,
    options,
  )
}
export type InviteUserMutationHookResult = ReturnType<
  typeof useInviteUserMutation
>
export type InviteUserMutationResult = Apollo.MutationResult<InviteUserMutation>
export type InviteUserMutationOptions = Apollo.BaseMutationOptions<
  InviteUserMutation,
  InviteUserMutationVariables
>
export const CompleteGoogleAuthDocument = gql`
  mutation CompleteGoogleAuth($code: String!) {
    completeGoogleAuth(code: $code) {
      ... on MutationCompleteGoogleAuthSuccess {
        data {
          token
        }
      }
      ... on Error {
        message
      }
    }
  }
`
export type CompleteGoogleAuthMutationFn = Apollo.MutationFunction<
  CompleteGoogleAuthMutation,
  CompleteGoogleAuthMutationVariables
>

/**
 * __useCompleteGoogleAuthMutation__
 *
 * To run a mutation, you first call `useCompleteGoogleAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteGoogleAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeGoogleAuthMutation, { data, loading, error }] = useCompleteGoogleAuthMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useCompleteGoogleAuthMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CompleteGoogleAuthMutation,
    CompleteGoogleAuthMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    CompleteGoogleAuthMutation,
    CompleteGoogleAuthMutationVariables
  >(CompleteGoogleAuthDocument, options)
}
export type CompleteGoogleAuthMutationHookResult = ReturnType<
  typeof useCompleteGoogleAuthMutation
>
export type CompleteGoogleAuthMutationResult =
  Apollo.MutationResult<CompleteGoogleAuthMutation>
export type CompleteGoogleAuthMutationOptions = Apollo.BaseMutationOptions<
  CompleteGoogleAuthMutation,
  CompleteGoogleAuthMutationVariables
>
export const MagicLinkDocument = gql`
  mutation MagicLink($email: String!) {
    magicLink(email: $email) {
      __typename
      ... on Error {
        message
      }
      ... on MutationMagicLinkSuccess {
        data
      }
    }
  }
`
export type MagicLinkMutationFn = Apollo.MutationFunction<
  MagicLinkMutation,
  MagicLinkMutationVariables
>

/**
 * __useMagicLinkMutation__
 *
 * To run a mutation, you first call `useMagicLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMagicLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [magicLinkMutation, { data, loading, error }] = useMagicLinkMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useMagicLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MagicLinkMutation,
    MagicLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<MagicLinkMutation, MagicLinkMutationVariables>(
    MagicLinkDocument,
    options,
  )
}
export type MagicLinkMutationHookResult = ReturnType<
  typeof useMagicLinkMutation
>
export type MagicLinkMutationResult = Apollo.MutationResult<MagicLinkMutation>
export type MagicLinkMutationOptions = Apollo.BaseMutationOptions<
  MagicLinkMutation,
  MagicLinkMutationVariables
>
export const CancelSubscriptionDocument = gql`
  mutation CancelSubscription {
    cancelSubscription {
      __typename
      ... on MutationCancelSubscriptionSuccess {
        data
      }
      ... on Error {
        message
      }
    }
  }
`
export type CancelSubscriptionMutationFn = Apollo.MutationFunction<
  CancelSubscriptionMutation,
  CancelSubscriptionMutationVariables
>

/**
 * __useCancelSubscriptionMutation__
 *
 * To run a mutation, you first call `useCancelSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelSubscriptionMutation, { data, loading, error }] = useCancelSubscriptionMutation({
 *   variables: {
 *   },
 * });
 */
export function useCancelSubscriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CancelSubscriptionMutation,
    CancelSubscriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    CancelSubscriptionMutation,
    CancelSubscriptionMutationVariables
  >(CancelSubscriptionDocument, options)
}
export type CancelSubscriptionMutationHookResult = ReturnType<
  typeof useCancelSubscriptionMutation
>
export type CancelSubscriptionMutationResult =
  Apollo.MutationResult<CancelSubscriptionMutation>
export type CancelSubscriptionMutationOptions = Apollo.BaseMutationOptions<
  CancelSubscriptionMutation,
  CancelSubscriptionMutationVariables
>
export const ResumeSubscriptionDocument = gql`
  mutation ResumeSubscription {
    resumeSubscription {
      __typename
      ... on MutationResumeSubscriptionSuccess {
        data
      }
      ... on Error {
        message
      }
    }
  }
`
export type ResumeSubscriptionMutationFn = Apollo.MutationFunction<
  ResumeSubscriptionMutation,
  ResumeSubscriptionMutationVariables
>

/**
 * __useResumeSubscriptionMutation__
 *
 * To run a mutation, you first call `useResumeSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResumeSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resumeSubscriptionMutation, { data, loading, error }] = useResumeSubscriptionMutation({
 *   variables: {
 *   },
 * });
 */
export function useResumeSubscriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ResumeSubscriptionMutation,
    ResumeSubscriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ResumeSubscriptionMutation,
    ResumeSubscriptionMutationVariables
  >(ResumeSubscriptionDocument, options)
}
export type ResumeSubscriptionMutationHookResult = ReturnType<
  typeof useResumeSubscriptionMutation
>
export type ResumeSubscriptionMutationResult =
  Apollo.MutationResult<ResumeSubscriptionMutation>
export type ResumeSubscriptionMutationOptions = Apollo.BaseMutationOptions<
  ResumeSubscriptionMutation,
  ResumeSubscriptionMutationVariables
>
export const TeamMembersDocument = gql`
  query TeamMembers {
    currentUser {
      team {
        id
        users {
          id
          pictureUrl
          email
          role
          firstName
          lastName
        }
      }
    }
  }
`

/**
 * __useTeamMembersQuery__
 *
 * To run a query within a React component, call `useTeamMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamMembersQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeamMembersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    TeamMembersQuery,
    TeamMembersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TeamMembersQuery, TeamMembersQueryVariables>(
    TeamMembersDocument,
    options,
  )
}
export function useTeamMembersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TeamMembersQuery,
    TeamMembersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TeamMembersQuery, TeamMembersQueryVariables>(
    TeamMembersDocument,
    options,
  )
}
export function useTeamMembersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        TeamMembersQuery,
        TeamMembersQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TeamMembersQuery, TeamMembersQueryVariables>(
    TeamMembersDocument,
    options,
  )
}
export type TeamMembersQueryHookResult = ReturnType<typeof useTeamMembersQuery>
export type TeamMembersLazyQueryHookResult = ReturnType<
  typeof useTeamMembersLazyQuery
>
export type TeamMembersSuspenseQueryHookResult = ReturnType<
  typeof useTeamMembersSuspenseQuery
>
export type TeamMembersQueryResult = Apollo.QueryResult<
  TeamMembersQuery,
  TeamMembersQueryVariables
>
