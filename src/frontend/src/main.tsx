import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { ApolloProvider } from '@apollo/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import * as Sentry from '@sentry/react'
import { Toaster } from 'sonner'

import './index.css'

import { apolloClient, ClientLinkBuilder } from './apollo-client'
import { FallbackComponent } from './components/fallback'
import { GOOGLE_CLIENT_ID } from './config/env'
import { CurrentUserProvider } from './context/current-user'
import { ThemeProvider } from './context/theme'
import { router } from './router'

// TODO: add VITE_SENTRY_DSN on netlify
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
})

ReactDOM.createRoot(document.getElementById('root')!, {
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <CurrentUserProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <ClientLinkBuilder />
            <Toaster />
            <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
              <RouterProvider router={router} />
            </Sentry.ErrorBoundary>
          </GoogleOAuthProvider>
        </CurrentUserProvider>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
)
