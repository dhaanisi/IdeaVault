# IdeaVault
A full-stack idea management platform where creators can capture, organize, and revisit their ideas in a private workspace.
Built with a modern Typescript stack using Next.js, Turborepo, Prisma and PostgreSQL.

## Live Demo
Coming soon

## Features
- Secure authentication with Clerk
- Create, edit and delete ideas
- Tag ideas for easy organization
- Search ideaas instantly
- Modern responsive UI
- Private idea dashboard
- Full-stack API with Next.js route handlers
- Prisma ORM with PostgreSQL
- Turborepo monorepo architecture

## Tech Stack
Frontend
- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- Lucide Icons
- Storybook

Backend
- Next.js Route Handlers
- Prisma ORM
- PostgresSQL (Neon)

Authentication
- Clerk

Monorepo
- Turborepo
- pnpm workspaces

Other
- Zod validation
- Vitest testing
- Sentry monitoring

## Project Structure
apps/
  app/        ->  main Next.js application
  web/        ->  landing website
  email/      ->  email templates
  storybook/  ->  UI component previews

packages/
  database/        -> Prisma schema & client
  design-system    -> shared UI components
  auth/            -> authentication logic
  analytics/       -> analytics provider


## Getting started
Clone the repository

git clone https://github.com/dhaanisi/IdeaVault

Install dependencies

pnpm install

Run development server

pnpm dev

## Environment Variables

Create a '.env' file in the root directory

Example:
DATABASE_URL=

CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

NEXT_PUBLIC_WEB_URL=

## Future Improvements

- AI- powered idea suggestions
- Idea collaboration
- Rich text editor
- Idea sharing links
- Mobile app

## License

MIT
