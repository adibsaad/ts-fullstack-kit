#!/usr/bin/env bash

set -e

# Check if aws cli is installed
if ! command -v aws &> /dev/null
then
    echo "AWS CLI could not be found"
    exit 1
fi

# Get aws major version
AWS_CLI_VERSION=$(aws --version 2>&1 | cut -d " " -f1 | cut -d "/" -f2 | cut -d "." -f1)

if [ "$AWS_CLI_VERSION" -lt 2 ]; then
  echo "AWS CLI version 2 is required"
  exit 1
fi

# source .env.deploy if it exists
# Useful for secrets and other environment variables
if [ -f .env.deploy ]; then
  source .env.deploy
fi

pnpm db:prisma:generate
pnpm build:lambda

pushd dist/lambda

# TODO(optional): Change the region to your region
aws lambda update-function-code \
--function-name api \
--region us-east-1 \
--no-cli-pager \
--zip-file fileb://./build.zip

# TODO(optional): Change the region to your region
aws lambda update-function-code \
--function-name worker \
--region us-east-1 \
--no-cli-pager \
--zip-file fileb://./build.zip
