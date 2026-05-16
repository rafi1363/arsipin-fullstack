# Arsipin Deployment Checklist

Panduan ini untuk deploy repo monorepo Arsipin dengan layanan terpisah:

- Frontend: Vercel
- Backend API: Railway
- Database: Neon PostgreSQL
- File storage nanti: Cloudflare R2

Jangan commit secret asli ke GitHub. Simpan secret di dashboard platform dan GitHub Environments/Secrets.

## 1. Neon

Yang perlu dibuat:

- Project PostgreSQL untuk Arsipin
- Database default, misalnya `neondb`
- Connection string PostgreSQL dengan SSL

Yang perlu diambil:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
```

Catatan:

- Untuk runtime backend, pooled connection string Neon biasanya lebih aman saat trafik mulai naik.
- Untuk migrasi manual dari lokal, connection string direct juga boleh dipakai sementara.
- Project ini memakai Prisma migrations dari `backend/prisma/migrations`.

Setelah `DATABASE_URL` valid:

```powershell
cd backend
bun run prisma:generate
bun run prisma:deploy
```

## 2. Railway

Railway dipakai untuk backend Express/Bun.

Setup service:

- New Project
- Deploy from GitHub repo
- Pilih repo `arsipin-fullstack`
- Set Root Directory: `backend`
- Pastikan Railway memakai `backend/Dockerfile`
- Generate public domain di tab Networking

Environment variables Railway:

```env
DATABASE_URL="ambil dari Neon"
JWT_SECRET="generate random minimal 32 bytes"
PORT=5000
CORS_ORIGIN="https://domain-frontend-vercel"
STORAGE_PROVIDER="r2"
S3_ENDPOINT="https://ACCOUNT_ID.r2.cloudflarestorage.com"
S3_REGION="auto"
S3_BUCKET="arsipin-documents"
S3_ACCESS_KEY_ID="ambil dari Cloudflare R2"
S3_SECRET_ACCESS_KEY="ambil dari Cloudflare R2"
S3_PUBLIC_BASE_URL=""
```

Command penting:

- Start command cukup default dari Dockerfile: `bun run start`
- Migrasi database jalankan manual saat schema berubah: `bun run prisma:deploy`
- Health check URL: `https://domain-backend-railway/health`

## 3. Vercel

Vercel dipakai untuk frontend Next.js.

Setup project:

- Import GitHub repo `arsipin-fullstack`
- Framework Preset: Next.js
- Root Directory: `frontend`
- Build Command: default atau `bun run build`
- Output Directory: default `.next`

Environment variables Vercel:

```env
NEXT_PUBLIC_API_URL="https://domain-backend-railway"
NEXT_PUBLIC_APP_URL="https://domain-frontend-vercel"
```

Setelah backend Railway punya domain final:

- Update `NEXT_PUBLIC_API_URL` di Vercel
- Redeploy frontend
- Update `CORS_ORIGIN` di Railway dengan domain Vercel
- Redeploy backend

## 4. Cloudflare R2

R2 disiapkan untuk upload file dokumen nanti. Backend saat ini masih metadata-only, jadi ini belum wajib untuk demo awal.

Yang perlu dibuat:

- Bucket: `arsipin-documents`
- R2 API Token / S3 credentials untuk bucket tersebut

Yang perlu diambil:

```env
S3_ENDPOINT="https://ACCOUNT_ID.r2.cloudflarestorage.com"
S3_REGION="auto"
S3_BUCKET="arsipin-documents"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_PUBLIC_BASE_URL=""
```

Jangan jadikan bucket public dulu untuk dokumen pribadi. Nanti gunakan signed URL/presigned URL saat fitur upload dibuat.

## 5. GitHub

Yang disimpan di GitHub:

- Source code
- `.env.example`
- Migration SQL di `backend/prisma/migrations`
- Workflow CI/security
- Dokumentasi deployment

Yang tidak disimpan di GitHub:

- `backend/.env`
- `frontend/.env.local`
- Database password
- JWT secret
- R2 access key/secret

GitHub Secrets yang berguna untuk workflow manual:

```env
DATABASE_URL
JWT_SECRET
CORS_ORIGIN
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_APP_URL
S3_ENDPOINT
S3_REGION
S3_BUCKET
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_PUBLIC_BASE_URL
```

## 6. Urutan Deploy Paling Aman

1. Push repo ke GitHub.
2. Buat Neon database dan ambil `DATABASE_URL`.
3. Deploy backend ke Railway dengan root `backend`.
4. Isi env Railway, sementara `CORS_ORIGIN` boleh pakai `http://localhost:3000` dulu.
5. Jalankan migration ke Neon.
6. Cek `https://domain-backend-railway/health`.
7. Deploy frontend ke Vercel dengan root `frontend`.
8. Isi `NEXT_PUBLIC_API_URL` memakai domain Railway.
9. Update `CORS_ORIGIN` Railway memakai domain Vercel.
10. Redeploy frontend dan backend.
