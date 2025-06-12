# Supabase

Setup an account on [Supabase](https://supabase.io/).

## Create a database

Go through the process of creating a new database on Supabase.

Once the database is created, you'll be able to see the connection string.

Copy the connection string and add it to the `pulumi/stack-vars.yml` file under the `DATABASE_URL` key and run `pulumi up` to deploy the changes.

## Database migrations on Github Actions

### Setup

You'll need to make the following modifications to the URL you get from Supabase

1. Change the port number from 6543 to 5432

1. Add `?pgbouncer=true` to the end of the connection string.

Supabase URL

```
postgresql://xxx:xxx@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

New URL

```
postgresql://xxx:xxx@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true
```

Add the new URL to the Github Actions secrets as `PROD_DB_MIGRATION_URL`.

1. Go to your repository on Github

1. Go to the `Settings` tab

1. Click on `Secrets`

1. Click on `New repository secret`

1. Add the `PROD_DB_MIGRATION_URL` secret

### Running migrations

You can now run prisma migrations on Github.

1. Go to your repository on Github

1. Go to the `Actions` tab

1. Click on the `Migrate Prod DB` workflow

1. Click on `Run workflow`, and `Run workflow` again

![Run workflow](./github-actions-migration.png)

Make sure to run the migrations before deploying the application to production and each time you make changes to the database schema.
