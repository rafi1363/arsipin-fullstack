# Arsipin Deployment Checklist

Panduan ini untuk deploy repo monorepo Arsipin dengan layanan terpisah:

- Frontend: Vercel
- Backend API: Vercel Functions
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

## 2. Backend API

Backend Express/Bun sekarang disiapkan sebagai project Vercel terpisah. Ini menggantikan Railway agar frontend dan backend bisa dikelola dari platform yang sama.

Project:

- Project name: `arsipin-backend`
- Root directory lokal: `backend`
- Production URL: `https://arsipin-backend.vercel.app`
- Staging alias: `https://arsipin-backend-stg.vercel.app`

Environment variables backend:

```env
DATABASE_URL="ambil dari Neon"
JWT_SECRET="generate random minimal 32 bytes"
PORT=5000
CORS_ORIGIN="https://domain-frontend-vercel-sesuai-environment"
STORAGE_PROVIDER="r2"
S3_ENDPOINT="https://ACCOUNT_ID.r2.cloudflarestorage.com"
S3_REGION="auto"
S3_BUCKET="arsipin-documents"
S3_ACCESS_KEY_ID="ambil dari Cloudflare R2"
S3_SECRET_ACCESS_KEY="ambil dari Cloudflare R2"
S3_PUBLIC_BASE_URL=""
```

Command penting:

- Local start command: `bun run start`
- Vercel production health check: `https://arsipin-backend.vercel.app/health`
- Vercel staging health check: `https://arsipin-backend-stg.vercel.app/health`
- Migrasi database jalankan manual saat schema berubah: `bun run prisma:deploy`
- Staging/preview Vercel bisa terkena Deployment Protection, jadi health check CI memakai `vercel curl`.

Alternatif gratis jika backend perlu platform long-running non-serverless:

- Koyeb: cocok untuk Docker/API kecil, free instance 512MB RAM, 0.1 vCPU, 2GB SSD.
- Render: free web service tersedia, tetapi service idle bisa spin down setelah tidak ada trafik.

Untuk Arsipin MVP, Vercel Functions dipilih karena Express didukung langsung, sudah satu ekosistem dengan frontend, dan tidak perlu Railway.

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
NEXT_PUBLIC_API_URL="https://domain-backend-vercel"
NEXT_PUBLIC_APP_URL="https://domain-frontend-vercel"
```

Environment yang disarankan:

- Production: gunakan domain normal, misalnya `https://arsipin-fullstack.vercel.app`
- Preview/Staging: gunakan backend staging dan alias khusus, yaitu `https://arsipin-fullstack-stg.vercel.app`

GitHub Actions deploy Vercel membutuhkan secret berikut di environment `staging` dan `production`:

```env
VERCEL_TOKEN="token dari Vercel Account Settings > Tokens"
VERCEL_ORG_ID="orgId dari .vercel/project.json"
VERCEL_PROJECT_ID="projectId dari .vercel/project.json"
VERCEL_BACKEND_PROJECT_ID="projectId backend dari backend/.vercel/project.json"
DATABASE_URL="connection string Neon"
JWT_SECRET="secret JWT backend"
CORS_ORIGIN="domain frontend sesuai environment"
NEXT_PUBLIC_API_URL="domain backend sesuai environment"
```

Yang masih harus dibuat manual oleh pemilik repo:

```powershell
gh secret set VERCEL_TOKEN --env staging --body "TOKEN_ANDA"
gh secret set VERCEL_TOKEN --env production --body "TOKEN_ANDA"
```

Tambahkan juga GitHub environment/repository variable untuk staging:

```env
VERCEL_STAGING_ALIAS="arsipin-fullstack-stg.vercel.app"
VERCEL_BACKEND_STAGING_ALIAS="arsipin-backend-stg.vercel.app"
```

Nilai dari project lokal saat checklist ini dibuat:

```env
VERCEL_ORG_ID="team_rWj5d9rb0ggoVrf1EAISqSIj"
VERCEL_PROJECT_ID="prj_eEmsx7oUJJCSdzrSprqtSRObEPWf"
VERCEL_BACKEND_PROJECT_ID="prj_hkOXShZRqwTnEsumSGvaK4uJWnnU"
```

Domain final yang dipakai:

```env
# staging
NEXT_PUBLIC_API_URL="https://arsipin-backend-stg.vercel.app"
NEXT_PUBLIC_APP_URL="https://arsipin-fullstack-stg.vercel.app"
CORS_ORIGIN="https://arsipin-fullstack-stg.vercel.app"

# production
NEXT_PUBLIC_API_URL="https://arsipin-backend.vercel.app"
NEXT_PUBLIC_APP_URL="https://arsipin-fullstack.vercel.app"
CORS_ORIGIN="https://arsipin-fullstack.vercel.app"
```

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
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
VERCEL_BACKEND_PROJECT_ID
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
3. Isi GitHub environment secrets untuk `staging` dan `production`.
4. Jalankan `Deploy Backend Staging`.
5. Jalankan `Deploy Staging`.
6. Jalankan `Deploy Backend Production`.
7. Jalankan `Deploy Production`.
8. Cek `https://arsipin-backend.vercel.app/health`.
9. Cek `https://arsipin-fullstack.vercel.app`.
