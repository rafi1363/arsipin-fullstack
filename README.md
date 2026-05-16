# Arsipin Fullstack

Arsipin adalah project belajar fullstack untuk manajemen arsip dan dokumen. Repo ini sudah punya fondasi backend yang cukup siap untuk MVP demo, sementara frontend masih berada di tahap starter dan menjadi area implementasi utama berikutnya.

## Snapshot Repo

Tanggal snapshot: `2026-05-16`

- Branch aktif lokal: `main`
- HEAD lokal: `ca01b85`
- Backend sudah menyediakan auth JWT, protected routes, rate limiting, document metadata CRUD, search/filter/sort, dan dashboard summary.
- Frontend masih template default `Next.js` dan belum terhubung ke backend.
- Workflow engineering baseline sudah aktif: CI, format check backend, CodeQL, Gitleaks, Trivy, Dependabot, dan deploy scaffold manual untuk `staging` serta `production`.

## Kondisi Produk Saat Ini

Yang sudah ada:

- registrasi user
- login user
- endpoint cek user login
- CRUD metadata dokumen
- search dokumen
- filter status dokumen
- sorting dokumen
- summary dashboard untuk total dokumen dan nearest expiry

Yang belum ada:

- UI produk Arsipin
- integrasi frontend ke backend
- upload file arsip asli
- reminder expiry
- automated tests
- deployment nyata ke provider hosting final

## Struktur Repo

- `backend/`: Express, Prisma, auth, dan documents API
- `frontend/`: Next.js App Router starter
- `PROJECT_RECAP.md`: rekap proyek yang lebih detail
- `LEARNING_CENTER.md`: catatan belajar dan keputusan engineering
- `CONTRIBUTING.md`: workflow branch dan PR
- `SECURITY.md`: baseline keamanan project
- `recap.md`: handoff recap operasional untuk konteks kerja terbaru

## Backend API Yang Sudah Aktif

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Documents:

- `POST /documents`
- `GET /documents`
- `GET /documents/summary`
- `GET /documents/:id`
- `PUT /documents/:id`
- `DELETE /documents/:id`

Catatan implementasi penting:

- auth dan documents route sudah memakai rate limiter
- JWT helper dipusatkan di `backend/lib/jwt.ts`
- validasi dasar dipusatkan di `backend/lib/validation.ts`
- helper error response dipusatkan di `backend/lib/http.ts`
- akses dokumen tunggal dibatasi dengan ownership check `id + userId`
- status list dokumen dihitung sebagai `active`, `expiring_soon`, dan `expired`
- sistem dokumen saat ini masih metadata-only

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

## Validasi Lokal

Backend:

```bash
cd backend
bun run prisma:generate
bun run format:check
bun run typecheck
```

Frontend:

```bash
cd frontend
bun run lint
bun run build
```

## GitHub Automation

Workflow berjalan otomatis pada:

- push ke `main`
- push ke branch `feature/**`, `fix/**`, `chore/**`, dan `docs/**`
- pull request ke `main`

Required checks utama yang sedang dipakai:

- `Backend`
- `Frontend`
- `CodeQL Analyze`
- `Secret Scan`
- `Dependency Scan`

Deploy workflow saat ini:

- `Deploy Staging`: manual via `workflow_dispatch`
- `Deploy Production`: manual via `workflow_dispatch`

Keduanya masih scaffold dan belum menjalankan deploy nyata ke provider final.

## Fokus Implementasi Berikutnya

Urutan yang paling masuk akal dari kondisi repo sekarang:

1. bangun UI auth frontend
2. bangun dashboard summary frontend
3. bangun halaman list/detail/manage dokumen
4. sambungkan state auth frontend ke backend
5. tambah automated tests backend
6. putuskan desain upload file dan storage provider
7. hubungkan deploy workflow ke target hosting final
