# Arsipin Fullstack

Arsipin adalah project belajar fullstack untuk manajemen arsip dan dokumen.

## Status Saat Ini

- Backend sudah memiliki auth dasar: `register`, `login`, JWT, dan `GET /auth/me`
- Backend sudah memiliki document metadata endpoint awal: `POST /documents` dan `GET /documents`
- Frontend masih berada di tahap starter Next.js dan belum merepresentasikan UI produk Arsipin
- GitHub Actions sudah berjalan untuk `main`, pull request ke `main`, dan branch kerja seperti `feature/**`, `fix/**`, `chore/**`, dan `docs/**`

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Backend: Bun, Express.js, TypeScript
- Database: Neon PostgreSQL
- ORM: Prisma 7
- CI/CD: GitHub Actions, Dependabot, CodeQL, Gitleaks, Trivy

## Local Setup

Backend:

```bash
cd backend
bun install
cp .env.example .env
bun run prisma:generate
bun run typecheck
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

GitHub Actions will run automatically on:

- push ke `main`
- push ke branch `feature/**`, `fix/**`, `chore/**`, dan `docs/**`
- pull request ke `main`

## Security Notes

- Do not commit real `.env` files.
- Store production secrets in Vercel, Render, Railway, Fly.io, or the chosen deployment provider.
- Keep Dependabot and CodeQL enabled on GitHub.
- Rotate secrets immediately if they are ever exposed.

## Current Direction

Fokus milestone saat ini masih di backend. Urutan berikutnya yang paling masuk akal adalah melengkapi document CRUD, menambahkan validasi input yang lebih kuat, lalu baru masuk ke UI frontend setelah kontrak API lebih stabil.
