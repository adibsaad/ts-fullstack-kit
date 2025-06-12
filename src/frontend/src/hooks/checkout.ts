import { User } from '@frontend/graphql/generated'

import { useSharedPaddle } from './paddle'

export function useCheckout() {
  const { paddle } = useSharedPaddle()

  const openCheckout = ({ user, priceId }: { user: User; priceId: string }) => {
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      ...(user.email && {
        customer: {
          email: user.email ?? '',
        },
      }),
      customData: {
        userId: String(user.id),
      },
    })
  }

  return { openCheckout }
}
