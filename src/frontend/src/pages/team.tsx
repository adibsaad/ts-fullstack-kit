import { Link, Navigate } from 'react-router-dom'

import { gql } from '@apollo/client'

import { CenteredSpinner } from '@frontend/components/centered-spinner'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@frontend/components/ui/avatar'
import { Badge } from '@frontend/components/ui/badge'
import { useTeamMembersQuery } from '@frontend/graphql/generated'

import { useCurrentUser } from '../hooks/current-user'

gql(/* GraphQL */ `
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
`)

export function TeamList() {
  const { loading, data } = useTeamMembersQuery({
    fetchPolicy: 'cache-and-network',
  })

  if (loading) {
    return <CenteredSpinner />
  }

  const team = data?.currentUser?.team

  if (!team?.users?.length) {
    return null
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Team</h1>
      <p className="text-gray-500">
        <Link to="./invite" className="text-blue-500">
          Invite a new member
        </Link>
      </p>
      <ul className="mt-4">
        {team.users.map(user => (
          <li key={user.id} className="mb-5 flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={user.pictureUrl ?? ''} />
              <AvatarFallback>
                <div className="h-8 w-8 rounded-full bg-gray-200" />
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center">
              <div>
                <div>
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <Badge
                className="ml-2 max-h-4"
                variant={
                  user.role === 'OWNER'
                    ? 'destructive'
                    : user.role === 'ADMIN'
                      ? 'outline'
                      : 'secondary'
                }
              >
                {user.role}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Team() {
  const { isLoading, currentUser } = useCurrentUser()

  if (isLoading) {
    return <CenteredSpinner />
  }

  if (!currentUser) {
    return <Navigate to="/" />
  }

  return <TeamList />
}
