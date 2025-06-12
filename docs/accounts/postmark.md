# Postmark

To send transactional emails, we'll use [Postmark](https://postmarkapp.com/).

Create an account on Postmark and go through the process of applying for production access. This can take a few days.

Once you have access, you'll be able to create a new server and get an API key.

Add the API key to the `pulumi/stack-vars.yml` file under the `POSTMARK_API_TOKEN` key and run `pulumi up` to deploy the changes.

In the meantime, you can use the sandbox server to test sending emails.
