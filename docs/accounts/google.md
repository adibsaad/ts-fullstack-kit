# Google

In order to use the Google sign-in feature, you need to have a Google Workspace account. If you don't have one, you can create one [here](https://workspace.google.com/).

If you don't want to set up Google sign-in, you can skip this section.

## Create a Google Cloud project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).

2. Click on the project selector at the top of the page and then click on the `New Project` button.

3. Fill in the project name and click on the `Create` button.

4. Once the project is created, click on the `Select` button.

## Create OAuth 2.0 credentials for local development

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).

2. Click on the project selector at the top of the page and then click on the project you just created.

3. Click on the `Navigation menu` button at the top-left corner of the page.

4. Go to `APIs & Services` > `Credentials`.

5. Click on the `Create credentials` button and then click on the `OAuth client ID` option.

6. Select `Web application` as the application type.

7. Fill in the name of the OAuth client ID.

8. Add `http://localhost:4000` and `http://localhost` to the authorized JavaScript origins.

9. Add `http://localhost:4000/auth/google_callback` to the authorized redirect URIs.

10. Click on the `Create` button.

11. Copy the `Client ID` and `Client Secret` into the root `.envrc` file, for the `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `VITE_GOOGLE_CLIENT_ID` variables so that it works locally.

## Create OAuth 2.0 credentials for production

1. Repeat the steps above, but add the production domain to the authorized JavaScript origins and authorized redirect URIs.

2. Copy the `Client ID` and `Client Secret` into `pulumi/stack-vars.yml` for the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` keys and run `pulumi up` to update the stack.

3. Later we'll add the `Client ID` to Netlify when we set up the production environment.
