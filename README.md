# IdeaVault

Capture, tag, and organize your ideas — minimal by design.

**Live → [idea-vault-api.vercel.app](https://idea-vault-api.vercel.app)**

---

## Screenshots

![Empty State](./screenshots/empty-state.png)

![Dashboard](./screenshots/dashboard.png)

![New Idea](./screenshots/new-idea.png)

---

## Features

- Create ideas with a title, content, and tags
- Filter by tag, sort by date or alphabetically
- Soft-delete with a recoverable trash bin
- Secure auth with Clerk
- Responsive masonry grid layout

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Monorepo | Turborepo + pnpm |
| Auth | Clerk |
| Database | Neon (PostgreSQL) + Prisma |
| UI | shadcn/ui + Tailwind CSS |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+
- A [Clerk](https://clerk.com) account
- A [Neon](https://neon.tech) database

### Install

```bash
git clone https://github.com/dhaanisi/IdeaVault.git
cd IdeaVault
pnpm install
```

### Environment Variables

```bash
cp .env.example .env
```

Minimum required:

```properties
DATABASE_URL=""

CLERK_SECRET_KEY=""
CLERK_WEBHOOK_SECRET=""
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database

```bash
pnpm --filter @repo/database db:generate
pnpm --filter @repo/database db:push
```

### Run

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

---

## Contributing

1. Fork the repo
2. Create a branch — `git checkout -b feat/your-feature`
3. Commit — `git commit -m "feat: your feature"`
4. Push — `git push origin feat/your-feature`
5. Open a pull request

---

## License

MIT
