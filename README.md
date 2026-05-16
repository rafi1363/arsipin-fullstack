# Arsipin Fullstack

Arsipin adalah project belajar fullstack untuk manajemen arsip dan dokumen. Repo ini sudah punya fondasi backend yang cukup siap untuk MVP demo, sementara frontend sekarang sudah mulai bergerak dari starter menuju fondasi UI produk yang reusable.

## Snapshot Repo

Tanggal snapshot: `2026-05-16`

- Branch aktif lokal saat dokumentasi terakhir disinkronkan: `main`
- Branch deployment/docs terbaru: `docs/deployment-history-vercel`
- Backend sudah menyediakan auth JWT, protected routes, rate limiting, document metadata CRUD, search/filter/sort, dan dashboard summary.
- Frontend sudah memiliki landing page minimalis, theme token dasar light/dark, reusable UI component dasar, dan util auth client berbasis `axios`.
- Workflow engineering baseline sudah aktif: CI, format check backend, CodeQL, Gitleaks, Trivy, Dependabot, dan deploy manual ke Vercel untuk `staging` serta `production`.
- Deployment aktif saat ini:
  - frontend production: `https://arsipin-fullstack.vercel.app`
  - frontend staging: `https://arsipin-fullstack-stg.vercel.app`
  - backend production: `https://arsipin-backend.vercel.app`
  - backend staging: `https://arsipin-backend-stg.vercel.app`

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

- halaman login yang benar-benar aktif
- integrasi auth frontend end-to-end
- upload file arsip asli
- reminder expiry
- automated tests
- login/register UI dan dashboard/list dokumen yang memakai API production/staging

## Struktur Repo

- `backend/`: Express, Prisma, auth, dan documents API
- `frontend/`: Next.js App Router dengan fondasi UI awal, theme token, dan auth client helper
- `PROJECT_RECAP.md`: rekap proyek yang lebih detail
- `MILESTONES.md`: daftar milestone repo dan status terbarunya
- `LEARNING_CENTER.md`: catatan belajar dan keputusan engineering
- `ENVIRONMENT_SETUP.md`: panduan setup environment Windows, macOS/Linux, provider, dan secret
- `DEPLOYMENT_CHECKLIST.md`: checklist deployment Vercel + Neon
- `DEPLOYMENT_HISTORY.md`: catatan rinci pekerjaan deployment terbaru dari persiapan sampai URL aktif
- `CONTRIBUTING.md`: workflow branch dan PR
- `SECURITY.md`: baseline keamanan project

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

Isi env frontend minimal:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Untuk panduan environment lintas Windows dan macOS/Linux, lihat `ENVIRONMENT_SETUP.md`.

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

Deploy workflow saat ini berjalan manual lewat `workflow_dispatch`:

- `Deploy Staging`: manual via `workflow_dispatch`
- `Deploy Production`: manual via `workflow_dispatch`
- `Deploy Backend Staging`: manual via `workflow_dispatch`
- `Deploy Backend Production`: manual via `workflow_dispatch`

Frontend dan backend sekarang memakai Vercel project terpisah. Production memakai domain normal, staging memakai alias dengan suffix `-stg`.

Yang masih harus disiapkan manual agar GitHub Actions bisa deploy sendiri:

- `VERCEL_TOKEN` di GitHub environment `staging`
- `VERCEL_TOKEN` di GitHub environment `production`

Detail lengkap ada di `DEPLOYMENT_HISTORY.md`.

## Fokus Implementasi Berikutnya

Urutan yang paling masuk akal dari kondisi repo sekarang:

1. buat route `/login` dan form login yang benar-benar aktif
2. sambungkan submit login ke `POST /auth/login` lewat `axios`
3. simpan token dan sambungkan `getMe()` untuk status auth awal
4. bangun dashboard summary frontend
5. bangun halaman list/detail/manage dokumen
6. tambah automated tests backend
7. putuskan desain upload file dan storage provider
8. tambah automated tests dan monitoring dasar setelah flow aplikasi mulai dipakai

## Pola Kolaborasi Implementasi

Mulai fase kerja ini, pola kolaborasi yang dipakai di repo adalah:

- AI boleh membaca repo, menganalisis progress, memberi instruksi kerja, dan mengedit dokumentasi
- implementasi aplikasi, pembuatan file fitur, pengetikan kode, commit, dan PR bisa dilakukan manual oleh pemilik repo atau dibantu AI sesuai kebutuhan task
- contoh kode dari AI dipakai sebagai panduan belajar dan referensi implementasi, bukan perubahan langsung ke source app
- jika ada perubahan besar yang mengubah arah kerja, sinkronkan kembali ke `PROJECT_RECAP.md`, `LEARNING_CENTER.md`, dan `recap.md`

## Helper Lokal PR

Repo ini memiliki helper lokal di `.local-scripts/` untuk mempercepat workflow solo development.

Yang saat ini dipakai:

- `.local-scripts/pr-create.sh` untuk membuat PR dengan summary awal
- `.local-scripts/pr-summary.sh` untuk membentuk ringkasan perubahan
- `.local-scripts/pr-batch-merge.sh` untuk audit batch PR open dan merge hanya PR yang aman

Command penting:

```bash
.local-scripts/pr-create.sh
```

```bash
.local-scripts/pr-batch-merge.sh main --dry-run
```

```bash
.local-scripts/pr-batch-merge.sh main --execute
```

Catatan:

- helper batch merge tidak langsung merge semua PR hijau
- script tetap meminta konfirmasi manual
- PR yang overlap file dengan PR siap merge lain akan ditahan untuk ditinjau manual

## Deployment Dan Penyimpanan File

Untuk fase belajar yang tetap realistis secara operasional, stack yang paling seimbang saat ini:

- frontend: `Vercel`
- backend API: `Vercel Functions`
- database PostgreSQL: `Neon`
- file dokumen asli: object storage seperti `Cloudflare R2`, `AWS S3`, atau `Supabase Storage`

Prinsip penting:

- jangan simpan file dokumen biner langsung di PostgreSQL untuk kebutuhan utama aplikasi
- simpan metadata dokumen di database
- simpan file asli di object storage
- simpan URL/path, provider key, mime type, dan ukuran file di tabel database

Jalur yang sedang dipakai untuk MVP belajar:

1. tetap pakai `Neon` untuk database
2. deploy frontend ke `Vercel`
3. deploy backend ke project Vercel terpisah `arsipin-backend`
4. pakai `Cloudflare R2` untuk file upload nanti karena object storage memang cocok untuk arsip

Alternatif backend jika Vercel Functions nanti terasa kurang cocok:

- `Koyeb`: cocok untuk API Docker kecil, tetapi kapasitas free terbatas
- `Render`: mudah untuk web service tradisional, tetapi tier gratis bisa sleep
- `Fly.io`: fleksibel untuk belajar infra, tetapi setup lebih teknis
