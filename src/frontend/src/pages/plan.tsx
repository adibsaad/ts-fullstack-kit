import { Navigate } from 'react-router-dom'

import { gql } from '@apollo/client'
import { CheckIcon } from 'lucide-react'
import { toast } from 'sonner'

import { CenteredSpinner } from '@frontend/components/centered-spinner'
import { ConfirmDialog } from '@frontend/components/confirm-dialog'
import { Button } from '@frontend/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@frontend/components/ui/card'
import {
  SubscriptionName,
  useCancelSubscriptionMutation,
  User,
  useResumeSubscriptionMutation,
} from '@frontend/graphql/generated'
import { cn } from '@frontend/lib/utils'

import { useCheckout } from '../hooks/checkout'
import { useCurrentUser } from '../hooks/current-user'

gql(/* GraphQL */ `
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
`)

// TODO: Create products and prices in Paddle and replace the priceIds
const tiers: {
  name: string
  priceId: string
  id: SubscriptionName
  priceMonthly: string
  description: string
  features: string[]
  featured: boolean
}[] = [
  {
    name: 'Hobby',
    // You may want to do something like this
    // priceId: isProd ? '<prod price id>' : 'dev price id',
    priceId: 'pri_01j7vb384adt2aa8zt5xeb9fby',
    id: SubscriptionName.Hobby,
    priceMonthly: '$9',
    description:
      "The perfect plan if you're just getting started with our product.",
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    featured: false,
  },
  {
    name: 'Pro',
    // You may want to do something like this
    // priceId: isProd ? '<prod price id>' : 'dev price id',
    priceId: 'pri_01j7vb384adt2aa8zt5xeb9fby',
    id: SubscriptionName.Pro,
    priceMonthly: '$19',
    description: 'For businesses looking to scale their operations.',
    features: [
      'Everything in Hobby plus:',
      'Feature 5',
      'Feature 6',
      'Feature 7',
      'Feature 8',
      'Feature 9',
    ],
    featured: true,
  },
]

export function PlanTiers({ currentUser }: { currentUser: User }) {
  const { openCheckout } = useCheckout()

  return (
    <div className="relative isolate px-6 lg:px-8">
      <div className="mx-auto grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-8 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={cn(
              tier.featured
                ? 'relative bg-gray-900 shadow-2xl'
                : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none'
                  : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10',
            )}
          >
            <h3
              id={tier.id}
              className={cn(
                tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                'text-base font-semibold leading-7',
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={cn(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-bold tracking-tight',
                )}
              >
                {tier.priceMonthly}
              </span>
              <span
                className={cn(
                  tier.featured ? 'text-gray-400' : 'text-gray-500',
                  'text-base',
                )}
              >
                / month
              </span>
            </p>
            <p
              className={cn(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-6 text-base leading-7',
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={cn(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-8 space-y-3 text-sm leading-6 sm:mt-10',
              )}
            >
              {tier.features.map(feature => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={cn(
                      tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                      'h-6 w-5 flex-none',
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              onClick={() =>
                openCheckout({
                  priceId: tier.priceId,
                  user: currentUser,
                })
              }
              aria-describedby={tier.id}
              className={cn(
                'cursor-pointer',
                tier.featured
                  ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                  : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600',
                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10',
              )}
            >
              Subscribe
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

function CurrentPlan({ user }: { user: User }) {
  const [cancelMut, { loading }] = useCancelSubscriptionMutation()
  const [resumeMut] = useResumeSubscriptionMutation()
  const { refetchCurrentUser } = useCurrentUser()

  const sub = user.team.subscription
  if (!sub) {
    return null
  }

  const price = tiers.find(tier => tier.id === sub.subName)?.priceMonthly

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn('text-indigo-600', 'text-base font-semibold leading-7')}
        >
          Current Plan - {sub.subName}
        </CardTitle>
        {sub.expiresAt && (
          <CardDescription
            className={cn('text-gray-600', 'mt-2 text-base leading-7')}
          >
            Expires at {new Date(sub.expiresAt).toLocaleString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="mt-4 flex items-baseline gap-x-2">
          <span className={cn('text-5xl font-bold tracking-tight')}>
            {price}
          </span>
          <span className={cn('text-gray-500', 'text-base')}>/ month</span>
        </p>
        <p className={cn('text-gray-600', 'mt-6 text-base leading-7')}>
          {sub.status}
        </p>

        {sub.status === 'Active' ? (
          !sub.expiresAt ? (
            <ConfirmDialog
              title="Are you sure you want to cancel your subscription?"
              onConfirm={() => {
                cancelMut().then(res => {
                  if (res.data?.cancelSubscription?.__typename === 'Error') {
                    toast.error(res.data.cancelSubscription.message)
                    return
                  } else {
                    refetchCurrentUser()
                  }
                })
              }}
            >
              <Button disabled={loading} variant="destructive" className="mt-8">
                Cancel Subscription
              </Button>
            </ConfirmDialog>
          ) : (
            <ConfirmDialog
              title="Are you sure you want to resume your subscription?"
              onConfirm={() => {
                resumeMut().then(res => {
                  if (res.data?.resumeSubscription?.__typename === 'Error') {
                    toast.error(res.data.resumeSubscription.message)
                    return
                  } else {
                    refetchCurrentUser()
                  }
                })
              }}
            >
              <Button disabled={loading} variant="secondary" className="mt-8">
                Resume Subscription
              </Button>
            </ConfirmDialog>
          )
        ) : null}
      </CardContent>
    </Card>
  )
}

export function Plan() {
  const { isLoading, currentUser } = useCurrentUser()

  if (isLoading) {
    return <CenteredSpinner />
  }

  if (!currentUser) {
    return <Navigate to="/" />
  }

  if (!currentUser.team.subscription) {
    return <PlanTiers currentUser={currentUser} />
  }

  return <CurrentPlan user={currentUser} />
}
