# Arsipin Project Recap

Tanggal recap: 2026-05-15

## Ringkasan Singkat

Arsipin adalah project belajar fullstack untuk aplikasi manajemen arsip dan dokumen.

Kondisi repo saat ini:

- Backend dasar sudah berjalan dengan Express, Prisma, dan endpoint auth register pertama.
- Frontend masih berada di tahap template Next.js awal, belum masuk ke UI produk Arsipin.
- Pipeline GitHub untuk CI dan security baseline sudah ada dan validasi utama sudah bisa dijalankan.
- Proteksi branch `main` sudah menarget branch yang benar dan sedang masuk tahap verifikasi perilaku direct push dan pull request.

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
- [x] Backend `prisma:generate` lulus
- [x] Backend `typecheck` lulus
- [x] Frontend `lint` lulus
- [x] Frontend `build` lulus
- [ ] Automated tests backend/frontend
- [ ] Deployment workflow

Catatan:

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
- [ ] Endpoint `POST /auth/login`
- [ ] JWT token generation
- [ ] JWT auth middleware / protected routes
- [ ] CRUD dokumen
- [ ] Search dan filter dokumen
- [ ] Expiry tracking
- [ ] Dashboard summary endpoint

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

### Auth Register

Flow `POST /auth/register` yang sudah ada:

1. membaca `name`, `email`, `password` dari request body
2. memvalidasi field wajib
3. mengecek email duplikat
4. meng-hash password dengan `bcrypt`
5. menyimpan user lewat Prisma
6. mengembalikan data aman tanpa password hash

Status fitur auth saat ini:

- register: sudah ada
- login: belum ada
- JWT: belum ada
- protected route: belum ada

### Prisma Dan Database

Yang sudah tersedia:

- model `User`
- model `Document`
- migration awal
- `prisma.config.ts`
- adapter PostgreSQL untuk runtime Prisma 7

Catatan:

- tabel `Document` sudah ada di schema, tetapi endpoint CRUD dokumen belum dibuat.

## Progress GitHub Workflow Dan Protection

### Workflow Yang Sudah Ada

- `.github/workflows/ci.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/security.yml`
- `.github/dependabot.yml`

Job/check penting yang dipakai saat ini:

- `Backend`
- `Frontend`
- `Analyze`
- `Secret Scan`
- `Dependency Scan`

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

Kesimpulan:

- ruleset `main` sudah menarget branch yang benar
- tahap berikutnya adalah verifikasi langsung bahwa direct push ke `main` benar-benar tertolak dan PR membaca required checks dengan benar

## Validasi Yang Terakhir Diverifikasi

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

Hasil:

- `prisma:generate`: lulus
- `typecheck`: lulus
- `lint`: lulus
- `build`: lulus

## Catatan Penting Yang Masih Relevan

- `jsonwebtoken` sudah terpasang sebagai dependency, tetapi belum dipakai di implementasi runtime saat ini.
- `backend/.env` tetap tidak dibaca atau disalin ke dokumentasi agar secret aman.
- Workspace settings editor ada secara lokal, tetapi `.vscode/` tetap di-ignore dari Git.
- `backend/README.md` dan `frontend/README.md` masih berisi template awal dan belum sepenuhnya mengikuti kondisi implementasi terbaru.

## Next Milestone Yang Disarankan

Urutan yang paling masuk akal dari kondisi sekarang:

1. Verifikasi ruleset/proteksi `main` dengan uji direct push dan pull request.
2. Buat endpoint `POST /auth/login`.
3. Tambahkan JWT token generation dan auth middleware.
4. Buat endpoint document CRUD.
5. Tambahkan search, filter, dan expiry tracking.
6. Bangun UI frontend Arsipin dan integrasi ke backend.
7. Tambahkan automated tests.
8. Siapkan deployment workflow.
