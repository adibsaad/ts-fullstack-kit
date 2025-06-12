// Web
export interface JWTPayload {
  id: number
}

// Worker Jobs
export interface HelloJob {
  type: 'hello-job'
}

export interface PaddleWebhookEvent {
  type: 'paddle-webhook-event'
  payload: string
}

export type JobType = HelloJob | PaddleWebhookEvent
