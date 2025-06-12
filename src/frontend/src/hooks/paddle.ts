import { useEffect, useState } from 'react'

import { initializePaddle, Paddle } from '@paddle/paddle-js'
import { useBetween } from 'use-between'

import { PADDLE_AUTH_TOKEN, PADDLE_ENVIRONMENT } from '../config/env'

/**
 * https://developer.paddle.com/
 */
function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle>()

  useEffect(() => {
    void initializePaddle({
      environment: PADDLE_ENVIRONMENT,
      token: PADDLE_AUTH_TOKEN,
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance)
      }
    })
  }, [])

  return { paddle }
}

export const useSharedPaddle = () => useBetween(usePaddle)
