export const GOOGLE_CLIENT_ID = String(import.meta.env.VITE_GOOGLE_CLIENT_ID)

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing VITE_GOOGLE_CLIENT_ID')
}

const PADDLE_ENVIRONMENT_ENV = String(import.meta.env.VITE_PADDLE_ENVIRONMENT)!
export const PADDLE_AUTH_TOKEN = String(import.meta.env.VITE_PADDLE_AUTH_TOKEN)

if (
  PADDLE_ENVIRONMENT_ENV !== 'sandbox' &&
  PADDLE_ENVIRONMENT_ENV !== 'production'
) {
  throw new Error(`Invalid Paddle environment: ${PADDLE_ENVIRONMENT_ENV}`)
}

export const PADDLE_ENVIRONMENT = PADDLE_ENVIRONMENT_ENV
