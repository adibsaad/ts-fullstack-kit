import { isProd } from '@common/env'

// TODO: Add VITE_API_URL on netlify
export const baseApiUrl = (
  isProd ? import.meta.env.VITE_API_URL : 'http://localhost:3000'
).replace(/\/$/, '')

export const baseFrontendUrl =
  window.location.protocol + '//' + window.location.host

export const LOCAL_STORAGE_TOKEN_KEY = 'token'
