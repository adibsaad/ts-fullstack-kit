# Local setup

## Dependencies

- Install [docker](https://docs.docker.com/engine/install/)

- Install Node 18. It's recommended to use [nvm](https://github.com/nvm-sh/nvm)

- Install pnpm

  ```
  npm i -g pnpm
  ```

- Install [pulumi](https://www.pulumi.com/docs/iac/download-install/)

- Install and configure [direnv](https://direnv.net/)

- Install [overmind](https://github.com/DarthSim/overmind)

## Clone repo

Start by cloning the repo

```bash
git clone https://github.com/adibsaad/ts-fullstack-kit my-app
cd ~/my-app
rm -rf .git
git init
```

## Install Packages

Run `pnpm install-all` to install the packages in the root directory and in `src/frontend`

## Launch docker services

Run `docker-compose up -d` to bring up the services.

## overmind and direnv config

Copy `Procfile.example` to `Procfile`. This file will be used by overmind.

Copy `.envrc.example` to `.envrc` and run `direnv allow` to apply the environment variables in the current session

## Run migrations

Run the migrations to initialize the database schema.

```
pnpm db:prisma:migrate
```

## Launch

Finally, you can bring up the processes

```
pnpm start
```

This will launch overmind, which will read the `Procfile` and start the processes. You should see all the logs in your terminal.

Once everything is up, you'll be able to access the following URLs:

- http://localhost:8025 -> Mailpit
  - This is a service that will catch all the emails sent by the application
- http://localhost:9325 -> ElasticMQ Dashboard
- http://localhost:3000 -> Backend
- http://localhost:4000 -> Frontend

# Pulumi

## Dependencies

Start by installing [Pulumi](https://www.pulumi.com/docs/iac/download-install/). Once it's installed, make sure to login.

```bash
pulumi login
```

It's assumed that you have accounts on AWS and Cloudflare, and that your domain name is already registered and managed by Cloudflare.

You'll need AWS keys for a user with admin access, and a Cloudflare API key.

## Setup

The Pulumi code lives under `./pulumi`.

Provisioning of resources is done from your own machine, not the CI, though this might change in the future.

```bash
cd ./pulumi
pnpm i
```

The directory has its own `.envrc` which holds authentication keys.

Copy the `.envrc.example` to `.envrc` and fill in the values.

```bash
cp .envrc.example .envrc
# Fill in the values
direnv allow
```

The `DOMAIN_NAME` variable should be the domain name you want to use for your website and should match the domain name you have in Cloudflare.

The setup uses a YAML file to hold secrets that can be used between different environments.

```bash
cp stack-vars.example.yml stack-vars.yml
```

`stack-vars.yml` is gitignored, so that you don't commit any secrets to git.

The next section will guide you through the process of creating the accounts you need to run the infrastructure.

## Running

To create the infrastructure, run the following command:

```bash
pulumi up
```

This will create the infrastructure in your AWS account and configure Cloudflare to point to the new resources.

# Deployment

## Accounts

Check out the docs under [./accounts](./accounts) to see how to set up the services required for production operation.

## Backend

The backend is deployed automatically to AWS from Github Actions when a new commit is pushed to the `main` branch.

### Setup

Add the following secrets to the GitHub repository:

- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
  - These are the AWS credentials for the IAM user that can deploy to lambda
- `SENTRY_SOURCEMAP_ORG` and `SENTRY_SOURCEMAP_PROJECT`
  - These are the Sentry project details for uploading source maps to the Sentry frontend project
- `SENTRY_AUTH_TOKEN`
  - These are the Sentry credentials you created in the Sentry dashboard

## Frontend

Create a [Netlify](https://netlify.com/) account and make a new project using your app's repository. It should auto-detect the `netlify.toml` and apply the right settings.

### Environment variables

In order for the app to work, you'll need to define the following environment variables (make sure to replace the values with the correct ones)

```
VITE_API_URL=https://api.domain.com/prod
VITE_GOOGLE_CLIENT_ID=XXXXXXXXXXX.apps.googleusercontent.com
VITE_PADDLE_AUTH_TOKEN=live_XXXXXXXXX
VITE_PADDLE_ENVIRONMENT=production
VITE_SENTRY_DSN=https://XXX@XXX.ingest.us.sentry.io/XXX
SENTRY_ORG=XXX
SENTRY_PROJECT=XXX
SENTRY_AUTH_TOKEN=XXX
```

The `VITE_API_URL` should point to `/prod`.

The `SENTRY_AUTH_TOKEN` is used to upload source maps to Sentry.

### Domain

Go to `Domain Management` to add your domain. You'll then have to manually create a CNAME record on Cloudflare that points to your app's Netlify subdomain.
