# config micro-saas

Used to define all types of settings using a nice GUI and consume it through a rest API

## Features

- Uses https://github.com/vercel/nextjs-subscription-payments for authentication and stripe integration
- In addition offers:
  - GraphQL config and Apollo Client for querying and mutating all collections
  - Teams management and RLS build in PostgreSQL based on TeamId
  - Support for multiple projects
  - Rest API for requesting settings by project, section or name with JWT authentication [WIP]
  - Automatic sync on build time [WIP]

## Demo

- ...

[![Screenshot of demo](...)

## Architecture

![Architecture diagram]()

## Step-by-step setup

- Create [supabase](https://supabase.com/) account and project
- Create [stripe](https://stripe.com/) account
- Rename .env.example to .env and add the values
- Run supabase/fixtures/schema.sql to create and populate the PostgreSQL tables
- [Optional] use https://stripe.com/docs/stripe-cli#install to create stripe products
- Use link-project, generate-types, and generate-schema to create and update the types and schema for PostgreSQL database.


