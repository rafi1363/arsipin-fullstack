# Arsipin Project Recap

Tanggal recap: 2026-05-16

## Ringkasan Singkat

Arsipin adalah project belajar fullstack untuk aplikasi manajemen arsip dan dokumen.

Kondisi repo saat ini:

- Backend inti untuk MVP demo sudah berjalan dengan Express, Prisma, auth JWT dasar, reusable rate limiting, endpoint document CRUD metadata, list endpoint dengan search, status filter, dan sorting, serta dashboard summary endpoint.
- Frontend masih berada di tahap template Next.js awal, belum masuk ke UI produk Arsipin.
- Pipeline GitHub untuk CI, security baseline, dan branch workflow dasar sudah ada dan validasi utama sudah bisa dijalankan.
- Proteksi branch `main` sudah terverifikasi menolak direct push dan memaksa alur branch plus pull request.

## Stack Saat Ini

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Backend: Bun, Express.js, TypeScript
- Database: Neon PostgreSQL
- ORM: Prisma 7
- Automation: GitHub Actions, Dependabot, CodeQL, Gitleaks, Trivy

## Struktur Repo

```txt
arsipin-fullstack/
├── backend/
├── frontend/
├── .github/
├── README.md
├── PROJECT_RECAP.md
├── LEARNING_CENTER.md
├── CONTRIBUTING.md
└── SECURITY.md
```

## Milestone Saat Ini

### Fondasi Repo Dan Tooling

- [x] Repository Git lokal di root project
- [x] Remote GitHub aktif
- [x] Root `.gitignore` untuk env, build output, cache, dan log
- [x] `backend/.env.example` tersedia
- [x] `frontend/.env.example` tersedia
- [x] `SECURITY.md` tersedia
- [x] `CONTRIBUTING.md` tersedia
- [x] `LEARNING_CENTER.md` tersedia
- [x] PR template tersedia

### CI/CD Dan Security Baseline

- [x] Workflow `CI` untuk backend dan frontend
- [x] Workflow `CodeQL`
- [x] Workflow `Security` dengan `Gitleaks` dan `Trivy`
- [x] Dependabot untuk backend, frontend, dan GitHub Actions
- [x] Pipeline branch feature/fix/chore/docs saat push
- [x] Concurrency control untuk membatalkan run lama pada branch/PR yang sama
- [x] Backend `prisma:generate` lulus
- [x] Backend `format:check` lulus
- [x] Backend `typecheck` lulus
- [x] Frontend `lint` lulus
- [x] Frontend `build` lulus
- [ ] Automated tests backend/frontend
- [ ] Final deployment integration

Catatan:

- Workflow deploy staging dan production sudah disiapkan sebagai scaffold di `.github/workflows/`, tetapi target deployment final masih belum dihubungkan.
- Untuk tahap sekarang, repository sudah punya fondasi CI/CD yang siap dipakai, sementara deployment production masih menunggu pilihan host yang final.

- Build frontend lulus saat dijalankan normal.
- Saat diuji di sandbox lokal, `next build` sempat gagal karena batasan proses Turbopack, bukan karena source code.

### Backend

- [x] Bootstrap Express server
- [x] Middleware `cors` dan `express.json()`
- [x] Route `GET /`
- [x] Route `GET /health`
- [x] Shared Prisma client di `backend/lib/prisma.ts`
- [x] Prisma schema untuk `User` dan `Document`
- [x] Migration awal database
- [x] Runtime Prisma 7 memakai `@prisma/adapter-pg`
- [x] Endpoint `POST /auth/register`
- [x] Endpoint `POST /auth/login`
- [x] JWT token generation
- [x] JWT auth middleware / protected routes
- [x] Reusable JWT helper
- [x] Basic rate limiting untuk auth dan route protected
- [x] Shared input validation helper
- [x] Basic input validation untuk auth routes
- [x] Basic input validation untuk document routes
- [x] Shared helper untuk konsistensi error response
- [x] Endpoint `GET /auth/me`
- [x] Document create endpoint
- [x] Document list endpoint
- [x] Document detail endpoint
- [x] Document update endpoint
- [x] Document delete endpoint
- [x] Search dan filter dokumen dasar
- [x] Expiry tracking dasar berbasis status response
- [x] Dashboard summary endpoint
- [ ] Validasi input document yang lebih kuat

Catatan milestone:

- dari sisi fondasi API untuk demo, backend sudah cukup siap untuk menopang pengerjaan frontend
- pekerjaan backend berikutnya lebih banyak bersifat enhancement, automated tests, dan keputusan produk lanjutan

### Frontend

- [x] Next.js App Router
- [x] TypeScript
- [x] Tailwind CSS
- [x] ESLint
- [x] Metadata dasar Arsipin
- [ ] UI autentikasi Arsipin
- [ ] Integrasi frontend ke backend API
- [ ] Dashboard Arsipin
- [ ] Halaman/manajemen dokumen

Catatan:

- `frontend/src/app/page.tsx` masih template awal Next.js.
- Frontend belum merepresentasikan milestone produk Arsipin.

## Progress Implementasi Yang Sudah Nyata

### Backend Express

File utama:

- `backend/index.ts`
- `backend/lib/prisma.ts`
- `backend/routes/auth.ts`

Yang sudah aktif:

- server Express berjalan
- `GET /` mengembalikan pesan backend aktif
- `GET /health` mengembalikan status `ok`
- router `/auth` sudah terpasang
- router `/documents` sudah terpasang

### Auth Dan JWT

Flow `POST /auth/register` yang sudah ada:

1. membaca `name`, `email`, `password` dari request body
2. memvalidasi field wajib
3. mengecek email duplikat
4. meng-hash password dengan `bcrypt`
5. menyimpan user lewat Prisma
6. mengembalikan data aman tanpa password hash

Status fitur auth saat ini:

- register: sudah ada
- login: sudah ada
- JWT: sudah ada
- protected route: sudah ada
- endpoint `/auth/me`: sudah ada

Flow `POST /auth/login` yang sudah aktif:

1. membaca `email` dan `password` dari request body
2. memvalidasi field wajib
3. mencari user berdasarkan email
4. membandingkan password input dengan hash `bcrypt`
5. membuat JWT token
6. mengembalikan token dan data user yang aman

Catatan implementasi:

- `req.body` dibaca dengan fallback object kosong agar request rusak tidak langsung memicu error destructuring
- helper JWT dipusatkan di `backend/lib/jwt.ts`
- validasi input dasar dipusatkan lewat helper di `backend/lib/validation.ts`
- error response dasar mulai diseragamkan lewat helper di `backend/lib/http.ts`
- middleware auth memakai helper verifikasi token yang sama agar reusable
- request type Express diperluas agar `req.user` bisa dipakai dengan aman di route terlindungi
- rate limiting dasar sudah dipasang untuk route auth dan route protected
- urutan middleware protected route sudah disesuaikan agar limiter berjalan sebelum auth check
- validasi email diubah ke pendekatan non-regex sederhana setelah CodeQL menandai regex email sebelumnya sebagai performance risk

### Prisma Dan Database

Yang sudah tersedia:

- model `User`
- model `Document`
- migration awal
- `prisma.config.ts`
- adapter PostgreSQL untuk runtime Prisma 7

Catatan:

- tabel `Document` sudah ada di schema
- endpoint `POST /documents` sudah aktif untuk membuat dokumen milik user yang login
- endpoint `GET /documents` sudah aktif untuk mengambil daftar dokumen milik user yang login
- endpoint `GET /documents` sekarang juga mendukung query `search`, `status`, `sortBy`, dan `sortOrder`
- status dokumen `active`, `expiring_soon`, dan `expired` saat ini dihitung dari `expiredDate` di list response tanpa menambah kolom database baru
- endpoint `GET /documents/summary` sekarang menyediakan total dokumen, breakdown status expiry, dan nearest expiry untuk dashboard
- endpoint detail sudah aktif dan membatasi akses berdasarkan `id` + `userId`
- endpoint update dan delete sudah aktif dengan pola ownership check yang sama
- create dan update document sekarang sudah memvalidasi title serta format `expiredDate` sebelum write ke database

### Code Quality Dan Security Feedback

Status terbaru yang penting:

- pipeline branch sekarang juga berjalan saat `push` ke branch kerja yang sesuai pola
- CodeQL sempat menandai route auth dan documents sebagai `Missing rate limiting`
- perbaikan yang diterapkan adalah menambahkan limiter reusable dan memastikan limiter dijalankan sebelum middleware auth pada route protected
- CodeQL juga sempat menandai regex email awal sebagai risk pada input user, lalu validasi email diganti ke pendekatan non-regex yang lebih aman

Makna praktis:

- security feedback tidak selalu berarti desain salah total; kadang yang perlu diperbaiki adalah bentuk wiring middleware
- urutan middleware sekarang menjadi bagian dari baseline keamanan backend ini

## Progress GitHub Workflow Dan Protection

### Workflow Yang Sudah Ada

- `.github/workflows/ci.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/security.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`
- `.github/dependabot.yml`

Job/check penting yang dipakai saat ini:

- `Backend`
- `Frontend`
- `CodeQL Analyze`
- `Secret Scan`
- `Dependency Scan`

Catatan:

- workflow tidak lagi terbatas ke `main`
- branch `feature/**`, `fix/**`, `chore/**`, dan `docs/**` sekarang juga memicu pipeline saat `push`
- ini membantu melihat status branch sebelum membuat pull request
- workflow `CI`, `CodeQL`, dan `Security` sekarang memakai concurrency agar run lama pada branch/PR yang sama dibatalkan saat ada push baru
- job `Backend` sekarang juga menjalankan `bun run format:check`
- workflow deploy staging dan production sudah ada, tetapi masih bersifat scaffold dan belum terhubung ke provider deployment
- tersedia juga helper lokal untuk membuat PR dengan summary otomatis melalui `.local-scripts/pr-create.sh`; helper ini sengaja tidak di-track Git

### Status Proteksi Branch `main`

Tujuan yang sedang dikerjakan:

- semua perubahan ke `main` harus lewat pull request
- direct push ke `main` harus ditolak
- status checks harus lulus sebelum merge
- bypass actor dikosongkan

Status saat ini:

- ruleset GitHub untuk `main` sudah `active`
- export ruleset terbaru sudah menunjukkan target yang benar:

```txt
refs/heads/main
```

- bypass actor kosong
- rule pull request dan required status checks sudah ada
- rule linear history, no force push, dan block deletion juga sudah ada
- direct push ke `main` sudah diuji dan memang tertolak
- alur kerja normal sekarang wajib lewat branch baru dan pull request

Kesimpulan:

- ruleset `main` sudah menarget branch yang benar
- proteksi `main` sudah terverifikasi bekerja pada perilaku nyata, bukan hanya benar di konfigurasi

## Validasi Yang Terakhir Diverifikasi

Backend:

```bash
cd backend
bun install
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

Hasil:

- `prisma:generate`: lulus
- `format:check`: lulus
- `typecheck`: lulus
- `lint`: lulus
- `build`: lulus

## Catatan Penting Yang Masih Relevan

- `backend/.env` tetap tidak dibaca atau disalin ke dokumentasi agar secret aman.
- Workspace settings editor ada secara lokal, tetapi `.vscode/` tetap di-ignore dari Git.
- sistem dokumen saat ini baru menyimpan metadata dokumen di database; upload file arsip asli belum diterapkan
- strategi expiry yang disarankan adalah status dan reminder, bukan auto-delete, agar arsip penting tidak hilang otomatis

## Next Milestone Yang Disarankan

Urutan yang paling masuk akal dari kondisi sekarang:

1. Bangun UI frontend Arsipin dengan login, dashboard summary, dan list dokumen.
2. Tambahkan automated tests.
3. Putuskan desain upload file arsip dan storage provider yang akan dipakai.
4. Hubungkan workflow deploy ke provider hosting final.
