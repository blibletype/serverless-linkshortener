# Serverless Link Shortener

## Overview

Serverless Link Shortener is a URL shortening service implemented using AWS Serverless technologies. It allows users to shorten long URLs, making them easier to share. The project uses AWS Lambda, DynamoDB, Simple Email Service (SES), and Simple Queue Service (SQS) to provide a scalable and cost-effective solution.

## Features

- **User Authentication**: Secure user sign-up and sign-in functionality using JSON Web Tokens (JWT).
- **Link Shortening**: Shorten long URLs into easily shareable links.
- **Link Deactivation**: Users can deactivate links to prevent them from being accessed.
- **Link Expiry**: Automatically deactivates links that have expired.
- **Email Notifications**: Sends email notifications for important events, such as link deactivation.

## Prerequisites

Before deploying the project, ensure you have the following:

- [Node.js](https://nodejs.org/) installed
- [AWS CLI](https://aws.amazon.com/cli/) configured with the necessary permissions
- [Serverless Framework](https://www.serverless.com/) installed (`npm install -g serverless`)

## Deployment Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/blibletype/serverless-linkshortener.git
    cd serverless-linkshortener
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

   Copy the `.env.example` file to `.env` and fill in the required values:

    ```env
    JWT_ACCESS_SECRET=your_access_secret
    JWT_REFRESH_SECRET=your_refresh_secret
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
    ```

4. **Provide your aws credentials:**

    ```bash
    serverless config credentials --provider aws --key 1234 --secret 5678
    ```

   Replace `key and secret value`.

5**Deploy the project:**

    ```bash
    serverless deploy --region your-region
    ```

   Replace `your-region` with the desired AWS region (e.g., `eu-central-1`).

## Usage

After deploying, you can use the following endpoints:

- **Sign Up:** `POST /auth/sign-up`
- **Sign In:** `POST /auth/sign-in`
- **Shorten Link:** `POST /links`
- **Deactivate Link:** `DELETE /links/{linkId}`
- **List Links:** `GET /links`
- **Redirect:** `GET /{linkId}`

Ensure to include the JWT token in the Authorization header for authenticated endpoints.

## Cleanup

To remove the deployed resources, run:

```bash
serverless remove --region your-region
