# Arsipin Deployment History

Dokumen ini menjelaskan pekerjaan deployment terbaru Arsipin dari fase persiapan sampai backend dan frontend benar-benar bisa dibuka melalui URL Vercel.

Tanggal update: `2026-05-16`

Branch dokumentasi/update: `docs/deployment-history-vercel`

## 1. Tujuan Perubahan

Sebelumnya repo sudah punya workflow deployment `staging` dan `production`, tetapi langkah akhirnya masih placeholder:

```bash
echo "Replace this step with your ... deployment command"
```

Artinya GitHub Actions bisa terlihat `success`, tetapi belum benar-benar mengirim aplikasi ke hosting.

Tujuan pekerjaan terbaru:

- membuat workflow frontend benar-benar deploy ke Vercel
- membuat staging dan production punya URL yang mudah dibedakan
- mengganti kebutuhan Railway karena trial sudah expired
- membuat backend Express bisa hidup di Vercel Functions
- mendokumentasikan semua secret, URL, urutan deploy, dan hal manual yang masih perlu disiapkan

## 2. Keputusan Platform Terbaru

Stack deployment saat ini:

- Frontend: Vercel project `arsipin-fullstack`
- Backend API: Vercel project `arsipin-backend`
- Database: Neon PostgreSQL
- File storage nanti: Cloudflare R2, belum dipakai oleh fitur aplikasi saat ini

Railway sudah tidak dipakai sebagai target utama karena trial akun sudah expired.

Kenapa backend dipindahkan ke Vercel:

- backend Express kecil Arsipin bisa dijalankan sebagai Vercel Function
- frontend dan backend bisa dikelola dari platform yang sama
- tidak perlu akun Railway aktif
- cocok untuk MVP belajar selama traffic masih kecil dan endpoint tidak butuh long-running process

Catatan batasan:

- Vercel Functions bukan server tradisional yang selalu hidup
- cocok untuk REST API singkat seperti `/health`, `/auth/*`, dan `/documents/*`
- jika nanti butuh job background panjang, websocket, worker permanen, atau proses berat, backend bisa dipindahkan lagi ke platform long-running seperti Koyeb, Render, Fly.io, atau VPS

## 3. URL Yang Aktif Saat Ini

Production:

- Frontend: `https://arsipin-fullstack.vercel.app`
- Backend: `https://arsipin-backend.vercel.app`
- Backend health check: `https://arsipin-backend.vercel.app/health`

Staging:

- Frontend: `https://arsipin-fullstack-stg.vercel.app`
- Backend: `https://arsipin-backend-stg.vercel.app`
- Backend health check: `https://arsipin-backend-stg.vercel.app/health`

Hasil verifikasi terakhir pada 2026-05-16:

- frontend production: `200`, title `Arsipin`
- frontend staging: `200`, title `Arsipin`
- backend production `/health`: `200 {"status":"ok"}`
- backend staging `/health`: `200 {"status":"ok"}`

## 4. Project Vercel Yang Dibuat/Dipakai

Frontend:

```env
VERCEL_PROJECT_ID="prj_eEmsx7oUJJCSdzrSprqtSRObEPWf"
VERCEL_ORG_ID="team_rWj5d9rb0ggoVrf1EAISqSIj"
VERCEL_PROJECT_NAME="arsipin-fullstack"
```

Backend:

```env
VERCEL_BACKEND_PROJECT_ID="prj_hkOXShZRqwTnEsumSGvaK4uJWnnU"
VERCEL_ORG_ID="team_rWj5d9rb0ggoVrf1EAISqSIj"
VERCEL_PROJECT_NAME="arsipin-backend"
```

Backend dibuat sebagai project Vercel terpisah agar frontend dan API punya domain serta environment yang jelas.

## 5. Perubahan Struktur Backend

Sebelumnya backend hanya punya `backend/index.ts` sebagai file utama Express yang langsung menjalankan `app.listen(...)`.

Untuk Vercel Functions, Express app perlu bisa di-export tanpa selalu memanggil `listen`. Karena itu struktur backend diubah:

- `backend/app.ts`: berisi konfigurasi Express app, middleware, route, dan export `app`
- `backend/index.ts`: entrypoint lokal, menjalankan `app.listen(PORT)`
- `backend/api/index.ts`: entrypoint Vercel Function, export `app`
- `backend/vercel.json`: konfigurasi build dan routing Vercel untuk backend

Dengan struktur ini:

- lokal tetap jalan dengan `bun run start` atau `bun run dev`
- Vercel bisa menjalankan Express app sebagai Function

## 6. Perubahan Penting Agar Backend Bisa Jalan Di Vercel

### 6.1. Export Express App

Express app dipindah ke `backend/app.ts` agar bisa dipakai oleh dua entrypoint:

- local server: `backend/index.ts`
- Vercel Function: `backend/api/index.ts`

### 6.2. Import Relatif Memakai Ekstensi `.js`

Vercel runtime Node menjalankan hasil transpile JavaScript dalam mode ESM. Import relatif seperti ini gagal di runtime Vercel:

```ts
import authRouter from "./routes/auth";
```

Karena itu import relatif backend dirapikan menjadi:

```ts
import authRouter from "./routes/auth.js";
```

Hal yang sama diterapkan pada import internal lain seperti `../lib/prisma.js`, `../middlewares/auth.js`, dan sebagainya.

### 6.3. Prisma Client Harus Di-generate Saat Install

Saat Vercel build dari source, Prisma Client belum tersedia sebelum `prisma generate` berjalan.

Solusi:

```json
"postinstall": "prisma generate"
```

Script ini ditambahkan ke `backend/package.json`, sehingga Vercel otomatis generate Prisma Client setelah dependency terinstall.

### 6.4. Backend Tidak Menggunakan `--prebuilt`

Percobaan deploy backend dengan `vercel build` lokal lalu `vercel deploy --prebuilt` sempat gagal karena package native `bcrypt` ikut dibundel dari Windows, lalu tidak cocok dengan runtime Linux Vercel.

Error yang muncul:

```txt
No native build was found for platform=linux arch=x64 runtime=node
loaded from: /var/task/node_modules/bcrypt
```

Solusi:

- frontend tetap boleh memakai `vercel build` + `vercel deploy --prebuilt`
- backend tidak memakai `--prebuilt`
- backend dideploy dari source agar Vercel melakukan install/build langsung di Linux

## 7. Workflow GitHub Actions Yang Sekarang Ada

Workflow validasi:

- `CI`: backend format/typecheck, frontend lint/build
- `CodeQL`
- `Security`

Workflow deployment frontend:

- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`

Workflow deployment backend:

- `.github/workflows/deploy-backend-staging.yml`
- `.github/workflows/deploy-backend-production.yml`

Semua deploy workflow bersifat manual dengan `workflow_dispatch`. Artinya deployment dilakukan dari tab GitHub Actions, bukan otomatis setiap push.

## 8. Cara Kerja Deploy Frontend

### 8.1. Frontend Staging

Workflow: `Deploy Staging`

Ringkasannya:

1. checkout target commit
2. pastikan required checks sudah hijau
3. install backend dependency untuk validasi backend
4. generate Prisma Client dan typecheck backend
5. install frontend dependency
6. build frontend dengan:

```env
NEXT_PUBLIC_API_URL="https://arsipin-backend-stg.vercel.app"
NEXT_PUBLIC_APP_URL="https://arsipin-fullstack-stg.vercel.app"
```

7. pull Vercel preview environment
8. build Vercel preview artifact
9. deploy preview ke Vercel
10. pasang alias:

```txt
arsipin-fullstack-stg.vercel.app
```

### 8.2. Frontend Production

Workflow: `Deploy Production`

Ringkasannya:

1. checkout target commit
2. pastikan required checks sudah hijau
3. pastikan workflow `Deploy Staging` sudah sukses untuk commit yang sama
4. build frontend dengan:

```env
NEXT_PUBLIC_API_URL="https://arsipin-backend.vercel.app"
NEXT_PUBLIC_APP_URL="https://arsipin-fullstack.vercel.app"
```

5. pull Vercel production environment
6. build Vercel production artifact
7. deploy production ke Vercel dengan `--prod`
8. domain normal tetap:

```txt
arsipin-fullstack.vercel.app
```

## 9. Cara Kerja Deploy Backend

### 9.1. Backend Staging

Workflow: `Deploy Backend Staging`

Ringkasannya:

1. checkout target commit
2. pastikan required checks sudah hijau
3. install backend dependency
4. generate Prisma Client
5. typecheck backend
6. deploy backend ke Vercel preview dari source
7. pass runtime env:

```env
DATABASE_URL="..."
JWT_SECRET="..."
PORT=5000
CORS_ORIGIN="https://arsipin-fullstack-stg.vercel.app"
```

8. pasang alias:

```txt
arsipin-backend-stg.vercel.app
```

9. cek health:

```txt
https://arsipin-backend-stg.vercel.app/health
```

### 9.2. Backend Production

Workflow: `Deploy Backend Production`

Ringkasannya:

1. checkout target commit
2. pastikan required checks sudah hijau
3. pastikan `Deploy Backend Staging` sudah sukses untuk commit yang sama
4. install backend dependency
5. generate Prisma Client
6. jalankan Prisma migration deploy
7. typecheck backend
8. deploy backend ke Vercel production dari source dengan `--prod`
9. pass runtime env:

```env
DATABASE_URL="..."
JWT_SECRET="..."
PORT=5000
CORS_ORIGIN="https://arsipin-fullstack.vercel.app"
```

10. cek health:

```txt
https://arsipin-backend.vercel.app/health
```

## 10. GitHub Secrets Dan Variables

GitHub environment yang dipakai:

- `staging`
- `production`

### 10.1. Secrets Staging

Yang sudah disiapkan dari lokal saat update ini:

- `CORS_ORIGIN`
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `VERCEL_BACKEND_PROJECT_ID`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Yang masih harus Anda isi manual:

- `VERCEL_TOKEN`

### 10.2. Secrets Production

Yang sudah disiapkan dari lokal saat update ini:

- `CORS_ORIGIN`
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `VERCEL_BACKEND_PROJECT_ID`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Yang masih harus Anda isi manual:

- `VERCEL_TOKEN`

### 10.3. Variables Staging

Yang sudah disiapkan:

- `VERCEL_STAGING_ALIAS=arsipin-fullstack-stg.vercel.app`
- `VERCEL_BACKEND_STAGING_ALIAS=arsipin-backend-stg.vercel.app`

Production tidak membutuhkan variable alias khusus karena memakai domain normal.

## 11. Hal Yang Harus Anda Siapkan Manual

### 11.1. Buat Vercel Token

Workflow GitHub Actions butuh `VERCEL_TOKEN`.

Langkah manual:

1. Buka Vercel Dashboard.
2. Masuk ke Account Settings.
3. Buka Tokens.
4. Buat token baru.
5. Simpan token itu ke GitHub Environments.

Command:

```powershell
gh secret set VERCEL_TOKEN --env staging --body "TOKEN_ANDA"
gh secret set VERCEL_TOKEN --env production --body "TOKEN_ANDA"
```

Jangan commit token ke repo.

### 11.2. Pertimbangkan Database Staging Terpisah

Saat update ini dibuat, staging dan production masih memakai Neon database yang sama.

Ini cukup untuk fase belajar awal, tetapi tidak ideal jika staging mulai dipakai untuk eksperimen data.

Rekomendasi nanti:

- buat Neon branch atau project khusus staging
- update `DATABASE_URL` di GitHub environment `staging`
- biarkan production memakai database production

### 11.3. File Storage Belum Aktif

Cloudflare R2 masih rencana untuk upload file dokumen asli.

Saat ini backend masih metadata-only. Artinya:

- belum ada endpoint upload file
- belum ada signed URL
- belum ada bucket R2 yang wajib aktif untuk aplikasi berjalan

R2 baru perlu disiapkan saat fitur upload file mulai dibuat.

## 12. Urutan Deploy Yang Benar

Jika Anda ingin deploy commit baru secara aman:

1. Push branch kerja ke GitHub.
2. Pastikan CI, Security, dan CodeQL hijau.
3. Merge branch ke `main` lewat PR.
4. Jalankan workflow `Deploy Backend Staging`.
5. Jalankan workflow `Deploy Staging`.
6. Cek:

```txt
https://arsipin-backend-stg.vercel.app/health
https://arsipin-fullstack-stg.vercel.app
```

7. Jalankan workflow `Deploy Backend Production`.
8. Jalankan workflow `Deploy Production`.
9. Cek:

```txt
https://arsipin-backend.vercel.app/health
https://arsipin-fullstack.vercel.app
```

## 13. Perintah Validasi Yang Dipakai

Backend lokal:

```powershell
cd backend
bun run prisma:generate
bun run typecheck
bun run format:check
```

Frontend lokal:

```powershell
cd frontend
bun run lint
bun run build
```

Health check production:

```powershell
Invoke-WebRequest -Uri "https://arsipin-backend.vercel.app/health" -UseBasicParsing
```

Health check staging:

```powershell
Invoke-WebRequest -Uri "https://arsipin-backend-stg.vercel.app/health" -UseBasicParsing
```

## 14. Masalah Yang Ditemukan Dan Cara Membacanya

### 14.1. GitHub Deploy Workflow Hijau Tetapi Tidak Deploy

Penyebab:

- workflow lama hanya berisi placeholder `echo`

Solusi:

- workflow frontend dan backend sekarang memanggil Vercel CLI sungguhan

### 14.2. Vercel Preview/Staging 401 Unauthorized

Penyebab:

- Vercel Deployment Protection aktif untuk non-custom domain

Solusi yang dilakukan:

- SSO deployment protection dimatikan untuk project `arsipin-fullstack` dan `arsipin-backend`
- staging alias sekarang bisa diakses publik

### 14.3. Backend Vercel 500 Karena Import ESM

Penyebab:

- import relatif TypeScript tanpa ekstensi tidak selalu bisa di-resolve oleh runtime Node ESM di Vercel

Solusi:

- import relatif backend memakai ekstensi `.js`

### 14.4. Backend Vercel 500 Karena `bcrypt`

Penyebab:

- deploy backend memakai prebuilt artifact dari Windows sehingga native binary `bcrypt` tidak cocok dengan Linux Vercel

Solusi:

- backend deploy dari source, bukan `--prebuilt`

### 14.5. Prisma Client Belum Siap Saat Build Vercel

Penyebab:

- Prisma Client belum di-generate sebelum TypeScript/Vercel build membaca package

Solusi:

- tambahkan `postinstall: prisma generate`

## 15. Apa Yang Sudah Benar-Benar Terdeploy

Sudah terdeploy dan bisa dilihat:

- frontend production
- frontend staging
- backend production `/health`
- backend staging `/health`

Belum bisa dianggap selesai sebagai produk:

- frontend belum punya login page aktif
- frontend belum terhubung end-to-end ke auth flow
- belum ada dashboard UI
- belum ada UI dokumen
- belum ada upload file
- belum ada tests otomatis
- belum ada monitoring/alerting production

## 16. Ringkasan File Yang Relevan

Deployment frontend:

- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`

Deployment backend:

- `.github/workflows/deploy-backend-staging.yml`
- `.github/workflows/deploy-backend-production.yml`

Backend Vercel:

- `backend/app.ts`
- `backend/index.ts`
- `backend/api/index.ts`
- `backend/vercel.json`
- `backend/package.json`

Dokumentasi:

- `README.md`
- `PROJECT_RECAP.md`
- `ENVIRONMENT_SETUP.md`
- `DEPLOYMENT_CHECKLIST.md`
- `DEPLOYMENT_HISTORY.md`
- `backend/README.md`
- `frontend/README.md`
- `SECURITY.md`
- `LEARNING_CENTER.md`
