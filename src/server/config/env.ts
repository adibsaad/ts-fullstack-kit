import { isProd } from '@common/env'

// TODO: Change the default domain name
export const DOMAIN_NAME = process.env.DOMAIN_NAME ?? 'example.com'
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
export const JWT_SECRET = process.env.JWT_SECRET!
export const QUEUE_URL =
  process.env.QUEUE_URL ?? 'http://localhost:9324/queues/default'
export const SMTP_PORT = Number(process.env.SMTP_PORT) || 1025
export const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN ?? ''

export const PADDLE_ENVIRONMENT = process.env.PADDLE_ENVIRONMENT as
  | 'sandbox'
  | 'production'
export const PADDLE_API_KEY = process.env.PADDLE_API_KEY!
export const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET!

export const API_PREFIX = process.env.API_PREFIX ?? ''

// TODO: Change the default frontend URL
export const FRONTEND_URL = (
  process.env.FRONTEND_URL ?? 'http://localhost:4000'
).replace(/\/$/, '')

if (!DOMAIN_NAME) {
  throw new Error('Missing DOMAIN_NAME environment variable')
}

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID environment variable')
}

if (!GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET environment variable')
}

if (PADDLE_ENVIRONMENT !== 'sandbox' && PADDLE_ENVIRONMENT !== 'production') {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Invalid PADDLE_ENVIRONMENT: ${PADDLE_ENVIRONMENT}`)
}

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable')
}

if (isProd) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set')
  }

  if (!process.env.QUEUE_URL) {
    throw new Error('QUEUE_URL must be set')
  }

  if (!process.env.POSTMARK_API_TOKEN) {
    throw new Error('POSTMARK_API_TOKEN must be set')
  }

  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL must be set')
  }
}
