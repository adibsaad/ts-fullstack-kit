import { Environment, LogLevel, Paddle } from '@paddle/paddle-node-sdk'

import { isProd } from '@common/env'

import { PADDLE_API_KEY, PADDLE_ENVIRONMENT } from './env'

export const paddle = new Paddle(PADDLE_API_KEY, {
  logLevel: isProd ? LogLevel.warn : LogLevel.verbose,
  environment:
    PADDLE_ENVIRONMENT === 'sandbox'
      ? Environment.sandbox
      : Environment.production,
})
