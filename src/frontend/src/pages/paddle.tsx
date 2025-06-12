import { useEffect } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

import { useSharedPaddle } from '../hooks/paddle'

// Page meant to be the default checkout URL.
// Mainly used for user's to manage their subscription.
export function PaddlePay() {
  const { paddle } = useSharedPaddle()
  const [s] = useSearchParams()

  const txn = s.get('_ptxn')

  useEffect(() => {
    if (!txn || !paddle) {
      return
    }

    paddle.Checkout.open({
      transactionId: txn,
    })
  }, [paddle, txn])

  if (!txn) {
    return <Navigate to="/" />
  }

  return null
}
