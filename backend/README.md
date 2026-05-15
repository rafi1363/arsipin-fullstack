# Arsipin Backend

Backend Arsipin dibangun dengan Bun, Express, TypeScript, Prisma 7, dan Neon PostgreSQL.

## Status Saat Ini

Yang sudah tersedia:

- `GET /`
- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /documents`
- `GET /documents`
- JWT helper reusable
- auth middleware
- rate limiting dasar untuk route auth dan route protected

Yang belum tersedia:

- `GET /documents/:id`
- `PUT /documents/:id`
- `DELETE /documents/:id`
- search/filter document
- expiry tracking berbasis status
- upload file arsip asli

## Setup

```bash
bun install
cp .env.example .env
bun run prisma:generate
```

## Development

```bash
bun run dev
```

## Validation

```bash
bun run prisma:generate
bun run typecheck
```

## Environment Variables

Minimal env yang dibutuhkan:

```env
DATABASE_URL=...
JWT_SECRET=...
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

## Notes

- Prisma runtime memakai `@prisma/adapter-pg`
- document saat ini masih berupa metadata di database
- file upload/storage belum diterapkan
