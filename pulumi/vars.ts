import * as fs from 'fs'
import * as yaml from 'js-yaml'

interface StackVars {
  prod: {
    DATABASE_URL: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    JWT_SECRET: string
    POSTMARK_API_TOKEN: string
    PADDLE_API_KEY: string
    PADDLE_WEBHOOK_SECRET: string
    SENTRY_DSN: string
    FRONTEND_URL: string
  }
}

let stackVars = {} as StackVars
if (fs.existsSync('./stack-vars.yml')) {
  stackVars = yaml.load(
    fs.readFileSync('./stack-vars.yml', 'utf8'),
  ) as StackVars
} else {
  throw new Error('stack-vars.yml not found')
}

export { stackVars }
