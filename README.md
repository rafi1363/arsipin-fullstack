# Arsipin Fullstack

Arsipin adalah project belajar fullstack untuk manajemen arsip dan dokumen.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Bun, Express.js, TypeScript
- Database: Neon PostgreSQL
- ORM: Prisma
- CI/CD: GitHub Actions

## Local Setup

Backend:

```bash
cd backend
bun install
cp .env.example .env
bun run prisma:generate
bun run dev
```

Frontend:

```bash
cd frontend
bun install
cp .env.example .env.local
bun run dev
```

## Validation

Backend:

```bash
cd backend
bun run prisma:generate
bun run typecheck
```

Frontend:

```bash
cd frontend
bun run lint
bun run build
```

## GitHub Setup

After creating an empty GitHub repository:

```bash
git remote add origin https://github.com/USERNAME/arsipin-fullstack.git
git push -u origin main
```

GitHub Actions will run automatically on pushes and pull requests to `main`.

## Security Notes

- Do not commit real `.env` files.
- Store production secrets in Vercel, Render, Railway, Fly.io, or the chosen deployment provider.
- Keep Dependabot and CodeQL enabled on GitHub.
- Rotate secrets immediately if they are ever exposed.
