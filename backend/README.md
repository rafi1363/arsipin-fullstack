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
- Vercel Function entrypoint di `api/index.ts`
- shared Express app di `app.ts` agar bisa dipakai lokal dan deployment

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

Local production-like start:

```bash
bun run start
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

Production saat ini:

```env
BACKEND_URL=https://arsipin-backend.vercel.app
CORS_ORIGIN=https://arsipin-fullstack.vercel.app
```

Staging saat ini:

```env
BACKEND_URL=https://arsipin-backend-stg.vercel.app
CORS_ORIGIN=https://arsipin-fullstack-stg.vercel.app
```

## Deployment

Backend sekarang dideploy ke Vercel Functions lewat project `arsipin-backend`.

File yang membuat backend kompatibel dengan Vercel:

- `app.ts`: Express app tanpa `listen`
- `index.ts`: entrypoint lokal yang memanggil `app.listen`
- `api/index.ts`: entrypoint Vercel Function
- `vercel.json`: routing semua request ke `api/index.ts`
- `package.json`: `postinstall` menjalankan `prisma generate`

Workflow:

- staging: `.github/workflows/deploy-backend-staging.yml`
- production: `.github/workflows/deploy-backend-production.yml`

Catatan penting:

- backend tidak memakai `vercel deploy --prebuilt` karena dependency native `bcrypt` harus dibuild di Linux Vercel, bukan dari artifact lokal Windows
- production workflow menjalankan `bun run prisma:deploy` sebelum deploy backend production
- health check production: `https://arsipin-backend.vercel.app/health`
- health check staging: `https://arsipin-backend-stg.vercel.app/health`

## Notes

- Prisma runtime memakai `@prisma/adapter-pg`
- document saat ini masih metadata-only
- deploy workflow backend sudah terhubung ke Vercel Functions
- source of truth deployment terbaru ada di `../DEPLOYMENT_HISTORY.md`
- source of truth progres backend yang lebih luas ada di `../PROJECT_RECAP.md`
