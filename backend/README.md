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
- `GET /documents/:id`
- `PUT /documents/:id`
- `DELETE /documents/:id`
- JWT helper reusable
- shared input validation helper
- shared HTTP error response helper
- auth middleware
- rate limiting dasar untuk route auth dan route protected
- search dokumen via query `search`
- filter status dokumen via query `status`
- sorting dokumen via query `sortBy` dan `sortOrder`

Yang belum tersedia:

- dashboard summary endpoint
- reminder expiry
- upload file arsip asli

Catatan:

- Workflow deployment staging dan production sudah mulai disiapkan di `.github/workflows/`, tetapi backend belum dihubungkan ke target hosting final.
- Untuk saat ini fokus backend masih di API, validasi, dan fondasi deploy, bukan eksekusi deployment production penuh.
- route auth sekarang memvalidasi required fields, format email, dan minimum password length
- route documents sekarang memvalidasi title dan format `expiredDate` sebelum write ke database
- route `GET /documents` sekarang mendukung search, status filter, dan sorting
- status `active`, `expiring_soon`, dan `expired` saat ini dihitung dari `expiredDate` pada response list dokumen
- error response backend mulai dirapikan lewat helper `backend/lib/http.ts`

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
- document saat ini masih berupa metadata di database
- file upload/storage belum diterapkan
- validasi email saat ini memakai pendekatan non-regex sederhana agar tidak memicu alert CodeQL tentang regex performance risk
