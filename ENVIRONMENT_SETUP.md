# Environment Setup

Panduan ini merapikan setup environment Arsipin untuk Windows PowerShell dan macOS/Linux.

## 1. GitHub Login

GitHub dipakai sebagai pusat repo, workflow, dan login ke provider seperti Vercel, Railway/Render, Neon, dan Cloudflare.

Windows PowerShell:

```powershell
gh auth status
gh auth login -h github.com -p https -w
gh auth setup-git
```

macOS/Linux:

```bash
gh auth status
gh auth login -h github.com -p https -w
gh auth setup-git
```

Jika `gh` tidak terbaca di Windows, pastikan folder ini ada di `Path`:

```txt
C:\Program Files\GitHub CLI\
```

## 2. Local Environment Files

Backend:

Windows PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cd backend
cp .env.example .env
```

Frontend:

Windows PowerShell:

```powershell
cd frontend
Copy-Item .env.example .env.local
```

macOS/Linux:

```bash
cd frontend
cp .env.example .env.local
```

## 3. Database

Rekomendasi saat ini: Neon PostgreSQL.

Langkah manual:

1. Login ke Neon memakai GitHub.
2. Buat project database untuk Arsipin.
3. Salin connection string PostgreSQL.
4. Isi `backend/.env`.

Contoh:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
```

Untuk koneksi production yang lebih eksplisit, pertimbangkan `sslmode=verify-full` jika provider connection string mendukungnya.

Setelah `DATABASE_URL` valid:

```powershell
cd backend
bun run prisma:generate
bun run prisma:migrate
```

## 4. Backend Runtime

Isi minimal `backend/.env`:

```env
DATABASE_URL="..."
JWT_SECRET="..."
PORT=5000
CORS_ORIGIN="http://localhost:3000"
```

Generate `JWT_SECRET`:

Windows PowerShell:

```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

macOS/Linux:

```bash
openssl rand -base64 32
```

## 5. Frontend Runtime

Isi minimal `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 6. File Storage

Rekomendasi saat ini: Cloudflare R2 karena cocok untuk object storage dokumen.

Langkah manual:

1. Login ke Cloudflare memakai GitHub jika tersedia pada akun Anda.
2. Buat bucket, misalnya `arsipin-documents`.
3. Buat R2 API token/access key.
4. Isi variabel storage di `backend/.env`.

Template:

```env
STORAGE_PROVIDER="r2"
S3_ENDPOINT="https://ACCOUNT_ID.r2.cloudflarestorage.com"
S3_REGION="auto"
S3_BUCKET="arsipin-documents"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_PUBLIC_BASE_URL=""
```

Catatan: backend saat ini belum mengimplementasikan upload file. Variabel storage ini disiapkan agar desain environment tidak berubah besar saat fitur upload mulai dibuat.

## 7. Deployment Targets

Rekomendasi awal:

- Frontend: Vercel, login dengan GitHub, import repo `rafi1363/arsipin-fullstack`, root directory `frontend`.
- Backend: Railway atau Render, login dengan GitHub, import repo yang sama, root/service directory `backend`.
- Database: Neon PostgreSQL.
- File storage: Cloudflare R2.

Environment production yang perlu diisi:

Frontend:

```env
NEXT_PUBLIC_API_URL="https://backend-production-url"
NEXT_PUBLIC_APP_URL="https://frontend-production-url"
```

Backend:

```env
DATABASE_URL="..."
JWT_SECRET="..."
PORT=5000
CORS_ORIGIN="https://frontend-production-url"
```

Storage:

```env
STORAGE_PROVIDER="r2"
S3_ENDPOINT="..."
S3_REGION="auto"
S3_BUCKET="arsipin-documents"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_PUBLIC_BASE_URL=""
```

## 8. Validation

Backend:

```powershell
cd backend
bun run prisma:generate
bun run typecheck
```

Frontend:

```powershell
cd frontend
bun run lint
bun run build
```
