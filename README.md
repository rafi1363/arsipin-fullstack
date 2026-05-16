# Arsipin Fullstack

Arsipin adalah project belajar fullstack untuk manajemen arsip dan dokumen. Repo ini sudah punya fondasi backend yang cukup siap untuk MVP demo, sementara frontend sekarang sudah mulai bergerak dari starter menuju fondasi UI produk yang reusable.

## Snapshot Repo

Tanggal snapshot: `2026-05-16`

- Branch aktif lokal saat dokumentasi terakhir disinkronkan: `main`
- HEAD saat recap frontend terakhir: `ca01b85`
- Backend sudah menyediakan auth JWT, protected routes, rate limiting, document metadata CRUD, search/filter/sort, dan dashboard summary.
- Frontend sudah memiliki landing page minimalis, theme token dasar light/dark, reusable UI component dasar, dan util auth client berbasis `axios`.
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

- halaman login yang benar-benar aktif
- integrasi auth frontend end-to-end
- upload file arsip asli
- reminder expiry
- automated tests
- deployment nyata ke provider hosting final

## Struktur Repo

- `backend/`: Express, Prisma, auth, dan documents API
- `frontend/`: Next.js App Router dengan fondasi UI awal, theme token, dan auth client helper
- `PROJECT_RECAP.md`: rekap proyek yang lebih detail
- `LEARNING_CENTER.md`: catatan belajar dan keputusan engineering
- `ENVIRONMENT_SETUP.md`: panduan setup environment Windows, macOS/Linux, provider, dan secret
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

Deploy workflow saat ini:

- `Deploy Staging`: manual via `workflow_dispatch`
- `Deploy Production`: manual via `workflow_dispatch`

Keduanya masih scaffold dan belum menjalankan deploy nyata ke provider final.

## Fokus Implementasi Berikutnya

Urutan yang paling masuk akal dari kondisi repo sekarang:

1. buat route `/login` dan form login yang benar-benar aktif
2. sambungkan submit login ke `POST /auth/login` lewat `axios`
3. simpan token dan sambungkan `getMe()` untuk status auth awal
4. bangun dashboard summary frontend
5. bangun halaman list/detail/manage dokumen
6. tambah automated tests backend
7. putuskan desain upload file dan storage provider
8. hubungkan deploy workflow ke target hosting final

## Pola Kolaborasi Implementasi

Mulai fase kerja ini, pola kolaborasi yang dipakai di repo adalah:

- AI boleh membaca repo, menganalisis progress, memberi instruksi kerja, dan mengedit dokumentasi
- implementasi aplikasi, pembuatan file fitur, pengetikan kode, commit, dan PR dikerjakan manual oleh pemilik repo
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

## Rekomendasi Hosting Dan Penyimpanan File

Untuk fase belajar yang tetap realistis secara operasional, stack yang paling seimbang saat ini:

- frontend: `Vercel`
- backend API: `Railway` atau `Render`
- database PostgreSQL: `Neon`
- file dokumen asli: object storage seperti `Cloudflare R2`, `AWS S3`, atau `Supabase Storage`

Prinsip penting:

- jangan simpan file dokumen biner langsung di PostgreSQL untuk kebutuhan utama aplikasi
- simpan metadata dokumen di database
- simpan file asli di object storage
- simpan URL/path, provider key, mime type, dan ukuran file di tabel database

Jika ingin jalur yang paling sederhana untuk MVP belajar:

1. tetap pakai `Neon` untuk database
2. deploy frontend ke `Vercel`
3. deploy backend ke `Railway`
4. pakai `Cloudflare R2` untuk file upload karena biaya egress biasanya lebih ramah

Jika prioritas utama adalah kemudahan setup penuh:

1. frontend ke `Vercel`
2. backend ke `Render`
3. database tetap `Neon`
4. file ke `Supabase Storage`

Tradeoff singkat:

- `Railway`: DX enak dan cepat untuk project belajar, tetapi perlu cek biaya/runtime limit terbaru saat nanti serius dipakai
- `Render`: setup cukup mudah dan stabil, tetapi cold start bisa terasa pada tier rendah
- `Fly.io`: fleksibel dan menarik untuk belajar infra, tetapi setup lebih teknis dibanding `Railway` atau `Render`
- `Cloudflare R2`: bagus untuk penyimpanan file karena object storage memang cocok untuk arsip
- `Supabase Storage`: onboarding mudah, tetapi berarti storage ada di platform berbeda dari backend utama jika backend tetap bukan di Supabase
