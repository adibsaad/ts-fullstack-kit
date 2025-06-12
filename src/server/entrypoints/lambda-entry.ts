import awsLambdaFastify, {
  LambdaResponse,
  PromiseHandler,
} from '@fastify/aws-lambda'
import { init as sentryInit, wrapHandler } from '@sentry/aws-serverless'
import { setupFastifyErrorHandler } from '@sentry/node'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'
import { FastifyInstance } from 'fastify'

import { handlerFn as workerHandlerFn } from '@server/jobs/handler'

import { genFastifyApp } from './fastify_app'

sentryInit({
  dsn: process.env.SENTRY_DSN,
})

let initSentry = false
let cachedApp: FastifyInstance
let cachedProxy: PromiseHandler<unknown, LambdaResponse>
const webHandlerFn = async (
  e: APIGatewayProxyEvent,
  c: Context,
): Promise<APIGatewayProxyResult> => {
  cachedApp ||= await genFastifyApp()
  if (!initSentry) {
    initSentry = true

    // We need to setup Sentry's error handler for Fastify
    // because the @fastify/aws-lambda catches exceptions
    // and transforms them into HTTP responses, so
    // Sentry's wrapHandler doesn't work.
    // setupFastifyErrorHandler adds a Fastify error handler
    // which sends exceptions to Sentry.
    setupFastifyErrorHandler(cachedApp)
  }
  cachedProxy ||= awsLambdaFastify(cachedApp)
  return await cachedProxy(e, c)
}

export const webHandler = wrapHandler(webHandlerFn)
export const workerHandler = wrapHandler(workerHandlerFn)
