# Arsipin Milestones

Dokumen ini merangkum milestone Arsipin dalam bahasa operasional: apa yang sudah selesai, apa yang baru berubah, dan apa yang belum selesai.

Tanggal update: `2026-05-16`

## Milestone 1: Fondasi Repo

Status: selesai

Yang sudah ada:

- monorepo sederhana dengan folder `backend` dan `frontend`
- dokumentasi dasar repo
- `.gitignore` untuk dependency, build output, env, dan file lokal
- PR template
- GitHub branch workflow berbasis branch pendek

Dokumen terkait:

- `README.md`
- `CONTRIBUTING.md`
- `PROJECT_RECAP.md`

## Milestone 2: Backend API Dasar

Status: selesai untuk MVP metadata dokumen

Yang sudah ada:

- Express 5 + Bun + TypeScript
- `GET /`
- `GET /health`
- Prisma 7 + Neon PostgreSQL
- Prisma migration awal untuk `User` dan `Document`
- Prisma runtime memakai `@prisma/adapter-pg`

Dokumen terkait:

- `backend/README.md`
- `LEARNING_CENTER.md`

## Milestone 3: Auth Backend

Status: selesai untuk baseline MVP

Yang sudah ada:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- hash password dengan `bcrypt`
- JWT helper di `backend/lib/jwt.ts`
- auth middleware di `backend/middlewares/auth.ts`
- request protected memakai `Authorization: Bearer <token>`

Yang belum ada:

- refresh token
- reset password
- email verification
- automated auth tests

## Milestone 4: Documents Backend

Status: selesai untuk MVP metadata dokumen

Yang sudah ada:

- `POST /documents`
- `GET /documents`
- `GET /documents/summary`
- `GET /documents/:id`
- `PUT /documents/:id`
- `DELETE /documents/:id`
- ownership check berdasarkan `id + userId`
- search dokumen
- filter status dokumen
- sort dokumen
- computed status `active`, `expiring_soon`, dan `expired`

Yang belum ada:

- upload file asli
- object storage integration
- pagination
- reminder expiry
- automated tests

## Milestone 5: Frontend Foundation

Status: fondasi selesai, flow aplikasi belum

Yang sudah ada:

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint
- landing page awal
- theme token light/dark dasar
- komponen UI dasar: `Button`, `Card`, `Container`, `Badge`
- shared axios client
- auth token helper berbasis `localStorage`
- auth API helper dasar

Yang belum ada:

- route `/login`
- UI login/register
- dashboard
- list dokumen
- form create/edit/delete dokumen
- route protection
- session bootstrap di frontend

## Milestone 6: CI, Security, Dan Branch Protection

Status: baseline selesai

Yang sudah ada:

- workflow `CI`
- backend format check
- backend typecheck
- frontend lint
- frontend build
- workflow `CodeQL`
- workflow `Security`
- Gitleaks secret scan
- Trivy dependency/filesystem scan
- Dependabot
- branch pipeline untuk `feature/**`, `fix/**`, `chore/**`, dan `docs/**`
- required checks untuk merge ke `main`

Required checks yang dipakai:

- `Backend`
- `Frontend`
- `CodeQL Analyze`
- `Secret Scan`
- `Dependency Scan`

## Milestone 7: Deployment Scaffold

Status: digantikan oleh deploy nyata Vercel

Sebelumnya:

- workflow `Deploy Staging` dan `Deploy Production` sudah ada
- tetapi step deploy hanya placeholder `echo`

Masalah:

- GitHub Actions bisa hijau tanpa benar-benar deploy aplikasi

Status terbaru:

- placeholder sudah diganti dengan Vercel CLI
- frontend staging dan production sudah deploy nyata
- backend staging dan production sudah deploy nyata

## Milestone 8: Backend Deployment Ke Vercel

Status: selesai dan sudah diverifikasi

Yang dilakukan:

- membuat project Vercel `arsipin-backend`
- menambahkan `backend/app.ts`
- menjadikan `backend/index.ts` entrypoint lokal
- menambahkan `backend/api/index.ts` untuk Vercel Function
- menambahkan `backend/vercel.json`
- menambahkan `postinstall: prisma generate`
- merapikan import ESM relatif agar kompatibel dengan runtime Vercel
- menghindari `--prebuilt` untuk backend karena dependency native `bcrypt`

URL aktif:

- production: `https://arsipin-backend.vercel.app/health`
- staging: `https://arsipin-backend-stg.vercel.app/health`

Hasil terakhir:

- production health: `200 {"status":"ok"}`
- staging health: `200 {"status":"ok"}`

## Milestone 9: Frontend Deployment Ke Vercel

Status: selesai dan sudah diverifikasi

Yang dilakukan:

- workflow frontend staging memakai Vercel preview deployment
- workflow frontend production memakai Vercel production deployment
- staging diberi alias `arsipin-fullstack-stg.vercel.app`
- production memakai domain normal `arsipin-fullstack.vercel.app`
- frontend production diarahkan ke backend production
- frontend staging diarahkan ke backend staging

URL aktif:

- production: `https://arsipin-fullstack.vercel.app`
- staging: `https://arsipin-fullstack-stg.vercel.app`

Hasil terakhir:

- production frontend: `200`, title `Arsipin`
- staging frontend: `200`, title `Arsipin`

## Milestone 10: Environment Dan Secret Deployment

Status: sebagian besar selesai, satu secret wajib masih manual

Sudah disiapkan di GitHub environment `staging` dan `production`:

- `CORS_ORIGIN`
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `VERCEL_BACKEND_PROJECT_ID`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Sudah disiapkan di GitHub environment variable `staging`:

- `VERCEL_STAGING_ALIAS=arsipin-fullstack-stg.vercel.app`
- `VERCEL_BACKEND_STAGING_ALIAS=arsipin-backend-stg.vercel.app`

Masih manual:

- `VERCEL_TOKEN` untuk `staging`
- `VERCEL_TOKEN` untuk `production`

Command:

```powershell
gh secret set VERCEL_TOKEN --env staging --body "TOKEN_ANDA"
gh secret set VERCEL_TOKEN --env production --body "TOKEN_ANDA"
```

## Milestone 11: Next Product Work

Status: belum selesai

Prioritas berikutnya:

1. buat route `/login`
2. buat UI login
3. sambungkan login ke backend production/staging sesuai env
4. simpan token
5. panggil `GET /auth/me`
6. buat dashboard summary
7. buat list dokumen
8. buat create/edit/delete dokumen
9. tambah automated tests backend
10. rancang upload file dan Cloudflare R2
