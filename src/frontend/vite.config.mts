/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'
import { defineConfig } from 'vite'

import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, '..', 'common'),
      '@frontend': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
  },
  plugins: [
    react(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})
