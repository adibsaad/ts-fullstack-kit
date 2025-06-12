# Sentry

Make a [Sentry](https://sentry.io/) and create two projects, one for the backend and one for the frontend.

Copy the backend DSN into `pulumi/stack-vars.yml` under `SENTRY_DSN` and run `pulumi up` to deploy the changes.

Later, we'll add the frontend DSN to the Netlify environment variables.

## Source maps

In order to upload source maps, you'll need to create an [auth token](https://docs.sentry.io/account/auth-tokens/).

The token can now be used to upload source maps when you deploy the [backend](../../../deployment/backend.md) and [frontend](../../../deployment/frontend.md).
