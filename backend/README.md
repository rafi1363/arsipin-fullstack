# Arsipin Backend

Backend Arsipin dibangun dengan `Bun`, `Express 5`, `TypeScript`, `Prisma 7`, dan `Neon PostgreSQL`.

## Status Saat Ini

Backend saat ini sudah cukup siap untuk menopang MVP demo metadata dokumen.

Yang sudah tersedia:

- `GET /`
- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /documents`
- `GET /documents`
- `GET /documents/summary`
- `GET /documents/:id`
- `PUT /documents/:id`
- `DELETE /documents/:id`

Fondasi implementasi yang sudah ada:

- JWT helper reusable
- auth middleware
- reusable rate limiter
- shared validation helper
- shared HTTP error response helper
- ownership check dokumen berdasarkan `id + userId`

Yang belum tersedia:

- upload file arsip
- storage integration
- reminder expiry
- automated tests
- pagination dokumen

## Perilaku API Penting

Auth:

- register memvalidasi `name`, `email`, dan `password`
- login memvalidasi `email` dan `password`
- minimum password length saat ini `8`
- validasi email memakai pendekatan non-regex sederhana

Documents:

- create mewajibkan `title` dan `expiredDate`
- update menerima `title`, `description`, dan/atau `expiredDate`
- `GET /documents` mendukung:
  - `search`
  - `status`
  - `sortBy`
  - `sortOrder`
- `sortBy` valid: `createdAt`, `expiredDate`, `title`
- `sortOrder` valid: `asc`, `desc`
- status response list:
  - `active`
  - `expiring_soon`
  - `expired`
- `GET /documents/summary` menyediakan total dokumen, breakdown status, dan `nearestExpiry`

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
bun run format:check
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
- document saat ini masih metadata-only
- deploy workflow backend belum terhubung ke hosting final
- source of truth progres backend yang lebih luas ada di `../PROJECT_RECAP.md` dan `../recap.md`
