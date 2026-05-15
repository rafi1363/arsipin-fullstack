# Arsipin Project Recap

Tanggal recap: 2026-05-15

## Ringkasan Project

Arsipin adalah project belajar fullstack untuk aplikasi manajemen arsip dan dokumen. Target MVP yang sudah disepakati:

- Authentication: register, login, JWT, protected routes.
- Document management: create, read, update, delete, search, dan filter dokumen.
- Expiry tracking: active, expiring soon, dan expired.
- Dashboard: total dokumen, dokumen aktif, hampir expired, dan expired.

Stack saat ini:

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4.
- Backend: Bun, Express.js, TypeScript.
- Database: Neon PostgreSQL.
- ORM: Prisma 7.
- CI/CD: GitHub Actions.
- Security automation: CodeQL dan Dependabot.

## Setup Awal Yang Sudah Ada

Struktur project:

```txt
arsipin-fullstack/
├── backend/
└── frontend/
```

Backend sudah memiliki:

- Bun project.
- Dependency utama: `express`, `cors`, `dotenv`, `bcrypt`, `jsonwebtoken`, `@prisma/client`.
- Dependency dev: `typescript`, `tsx`, `prisma`, type packages.
- Prisma schema untuk model `User` dan `Document`.
- Migration awal untuk membuat tabel `User` dan `Document`.
- Prisma config untuk Prisma v7, dengan `DATABASE_URL` dibaca dari `.env`.

Frontend sudah memiliki:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- ESLint.
- Template awal Next.js.

Catatan penting: dokumen setup awal menyebut Express API sudah dibuat, tetapi file aktual `backend/index.ts` saat dicek masih berisi default Bun `console.log("Hello via Bun!")`. Jadi backend Express API masih menjadi milestone berikutnya.

## Git Dan GitHub

Kita menemukan bahwa sebelum dirapikan, `git status` membaca repository dari folder `/Users/mac`, bukan dari root project Arsipin. Ini membuat Git menampilkan banyak file dari home directory.

Yang sudah dilakukan:

- Membuat repository Git lokal khusus di root project `arsipin-fullstack`.
- Menggunakan branch utama `main`.
- Membuat commit awal:

```txt
66ccfe3 Initial Arsipin fullstack setup
```

- Menghubungkan repo lokal ke GitHub:

```txt
https://github.com/rafi1363/arsipin-fullstack
```

- Push ke `main` berhasil setelah autentikasi GitHub diselesaikan.

Masalah GitHub auth yang sempat muncul:

- Password biasa tidak bisa dipakai untuk `git push` via HTTPS.
- Solusinya memakai Personal Access Token atau GitHub CLI.
- Setelah token/credential benar, push ke GitHub berhasil.

## File Security Dan Ignore

Kita menambahkan root `.gitignore` agar file sensitif dan hasil build tidak masuk Git.

File dan folder yang di-ignore:

- `.env` dan `.env.*`
- `backend/.env`
- `frontend/.env`
- `node_modules/`
- `frontend/.next/`
- build output seperti `dist/`, `out/`, `build/`
- cache dan log
- `.DS_Store`
- `.vercel/`

Kita juga menambahkan file contoh environment:

- `backend/.env.example`
- `frontend/.env.example`

Isi secret asli tetap tidak masuk Git. File `backend/.env` tetap ignored.

Kita menambahkan `SECURITY.md` dengan baseline security:

- Jangan commit secret.
- Hash password dengan `bcrypt`.
- Pakai `JWT_SECRET` kuat.
- Validasi input.
- Jangan return password hash ke frontend.
- Batasi CORS di production.
- Gunakan HTTPS saat deploy.
- Aktifkan Dependabot dan CodeQL.

## CI/CD Dan Automation

Kita menambahkan GitHub Actions CI:

```txt
.github/workflows/ci.yml
```

Workflow `CI` berjalan pada:

- push ke `main`
- pull request ke `main`

Job backend:

- checkout repo
- setup Bun
- install dependency dengan `bun install --frozen-lockfile`
- generate Prisma Client
- run backend typecheck

Job frontend:

- checkout repo
- setup Bun
- install dependency dengan `bun install --frozen-lockfile`
- run lint
- run build

Kita juga menambahkan CodeQL:

```txt
.github/workflows/codeql.yml
```

CodeQL berjalan pada:

- push ke `main`
- pull request ke `main`
- jadwal mingguan

Kita menambahkan Dependabot:

```txt
.github/dependabot.yml
```

Dependabot memantau:

- dependency Bun di `/backend`
- dependency Bun di `/frontend`
- GitHub Actions di root repo

## Perbaikan Agar CI Stabil

Backend typecheck awalnya gagal karena TypeScript belum mengenali global Bun seperti `console` dan `process`.

Perbaikan:

- Menambahkan `types: ["bun"]` di `backend/tsconfig.json`.
- Menambahkan script:

```json
"typecheck": "tsc --noEmit"
```

Frontend build awalnya gagal karena `next/font/google` mencoba fetch Google Fonts. Untuk membuat CI lebih stabil, kita menghapus dependency build ke Google Fonts dan memakai system font.

Perbaikan:

- Menghapus import `next/font/google` dari `frontend/src/app/layout.tsx`.
- Mengubah metadata menjadi Arsipin.
- Mengatur font system di `frontend/src/app/globals.css`.

Catatan lokal:

- `bun run build` untuk Next.js sempat gagal di sandbox karena Turbopack perlu membuat proses lokal.
- Build berhasil saat dijalankan di luar sandbox.
- Di GitHub Actions, build berjalan hijau.

## Dependabot Dan CI Merah

Setelah push awal, Dependabot membuka beberapa PR update dependency.

CI merah terjadi pada PR:

```txt
Bump eslint from 9.39.4 to 10.3.0 in /frontend
```

Keputusan:

- Tidak melakukan upgrade agresif ke ESLint 10.
- Menahan major update ESLint karena kombinasi project saat ini stabil dengan `eslint@9` dan `eslint-config-next@16.2.6`.

Perubahan yang diterapkan:

```yaml
ignore:
  - dependency-name: "eslint"
    versions:
      - ">=10"
```

Hasil:

- Dependabot tidak lagi membuka PR ESLint v10 untuk sementara.

## Update Baru Dari Sesi Ini

Fokus sesi ini adalah mulai membangun baseline engineering yang lebih siap untuk dipakai serius, walau project masih solo development.

Keputusan workflow:

- `main` diperlakukan sebagai branch stabil.
- Perubahan baru sebaiknya dikerjakan di branch singkat per topik, bukan branch permanen `backend` dan `frontend`.
- Contoh branch yang disarankan:
  - `feature/auth-backend`
  - `feature/document-list-ui`
  - `chore/security-baseline`
  - `docs/learning-center`

Dokumentasi baru yang ditambahkan:

- `LEARNING_CENTER.md` sebagai pusat pembelajaran teknis dan operasional.
- `CONTRIBUTING.md` untuk aturan branch, PR, dan validasi kerja.
- `.github/pull_request_template.md` untuk menjaga checklist perubahan tetap konsisten.

Perubahan workflow GitHub:

- `CI` sekarang memiliki permission minimum `contents: read`.
- Ditambahkan `timeout-minutes` agar job tidak menggantung terlalu lama.
- Ditambahkan workflow baru:

```txt
.github/workflows/security.yml
```

Isi workflow `Security`:

- Secret scanning dengan `Gitleaks`
- Dependency/filesystem scanning dengan `Trivy`

Tujuan perubahan ini:

- Menangkap secret yang tidak sengaja ter-commit lebih cepat
- Menambah lapisan scanning selain CodeQL dan Dependabot
- Melatih kebiasaan security-by-default sejak tahap awal project

Hal yang masih perlu disetel manual di GitHub UI:

- Branch protection untuk `main`
- Require pull request before merge
- Required status checks: `CI`, `CodeQL`, dan `Security`
- Block force pushes
- GitHub Environments untuk staging/production
- Secret scanning push protection bila fitur tersedia di plan GitHub

Catatan Git:

- File `PROJECT_RECAP.md` masih untracked sebelum sesi ini.
- Untuk update besar berikutnya, disarankan kerja di branch sesuai topik dan push branch tersebut ke GitHub agar histori perubahan lebih rapi.
- PR merah tidak dilanjutkan.

## Dependabot Updates Yang Sudah Masuk Main

Update Dependabot hijau sudah dimasukkan ke `main`:

- `actions/checkout@v6`
- `react@19.2.6`
- `react-dom@19.2.6`
- `typescript@^6`
- `@types/node@^25`

Catatan proses:

- GitHub CLI tidak bisa merge PR via API karena token tidak punya permission `mergePullRequest`.
- Solusi yang dipakai: fetch branch Dependabot, merge lokal ke `main`, lalu push.
- Saat merge `react-dom`, ada konflik kecil di `frontend/package.json` dan `frontend/bun.lock`.
- Konflik diselesaikan dengan kombinasi final `react@19.2.6` dan `react-dom@19.2.6`.

Status akhir:

- Open PR Dependabot: kosong.
- CI di `main`: hijau.
- CodeQL di `main`: hijau.
- Working tree lokal: bersih saat terakhir dicek.

## Validasi Yang Sudah Dijalankan

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

Semua validasi tersebut sudah berhasil.

## Kondisi Project Saat Ini

Project sudah memiliki fondasi:

- Git lokal rapi.
- Repo GitHub aktif.
- CI GitHub Actions aktif.
- CodeQL aktif.
- Dependabot aktif.
- Secret tidak masuk Git.
- `.env.example` tersedia.
- Dependency utama sudah diperbarui lewat Dependabot yang hijau.

Branch lokal saat recap dibuat:

```txt
main
```

Remote:

```txt
origin https://github.com/rafi1363/arsipin-fullstack.git
```

## Next Milestone Yang Disarankan

Langkah berikutnya adalah membuat backend Express API dasar di branch feature baru.

Branch yang disarankan:

```bash
git checkout -b feature/backend-express-api
```

Target backend API dasar:

- Ubah `backend/index.ts` dari default Bun menjadi Express server.
- Tambahkan `cors`, `dotenv`, dan JSON middleware.
- Tambahkan endpoint:
  - `GET /`
  - `GET /health`
- Siapkan struktur folder backend awal.
- Pastikan tetap lolos:
  - `bun run typecheck`
  - `bun run prisma:generate`
  - GitHub CI

Setelah backend dasar stabil, lanjut milestone:

1. Prisma Client singleton.
2. Auth register/login.
3. JWT middleware.
4. Document CRUD.
5. Dashboard frontend dan integrasi API.
