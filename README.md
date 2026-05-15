# Arsipin Fullstack

Arsipin adalah project belajar fullstack untuk manajemen arsip dan dokumen.

## Current State

- Backend sudah memiliki fondasi API yang nyata dengan auth JWT, protected routes, rate limiting, dan document metadata CRUD.
- Frontend masih berada di tahap starter `Next.js` dan belum merepresentasikan UI produk Arsipin.
- Pipeline engineering baseline sudah aktif: CI, CodeQL, Gitleaks, Trivy, Dependabot, dan workflow deploy manual untuk `staging` serta `production`.
- Deploy nyata ke provider hosting belum dihubungkan; workflow deploy saat ini masih berupa scaffold dengan guardrail yang sudah disiapkan.

## Backend Features Today

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Documents:

- `POST /documents`
- `GET /documents`
- `GET /documents/:id`
- `PUT /documents/:id`
- `DELETE /documents/:id`

Catatan implementasi:

- JWT helper dipusatkan di `backend/lib/jwt.ts`
- route protected memakai limiter sebelum auth middleware
- akses dokumen tunggal dibatasi dengan ownership check `id + userId`
- sistem dokumen saat ini masih menyimpan metadata, belum file upload/storage

## Repo Map

- `backend/`: Express, Prisma, auth, dan document API
- `frontend/`: Next.js App Router starter
- `.github/workflows/`: CI, security scans, CodeQL, dan deploy scaffold
- `PROJECT_RECAP.md`: rekap proyek yang lebih detail
- `LEARNING_CENTER.md`: catatan pembelajaran dan keputusan engineering
- `SECURITY.md`: baseline keamanan project
- `CONTRIBUTING.md`: alur kerja branch dan PR
- `recap.md`: ringkasan kerja terbaru yang lebih operasional

## Local Setup

Backend:

```bash
cd backend
bun install
cp .env.example .env
bun run prisma:generate
bun run typecheck
bun run dev
```

Frontend:

```bash
cd frontend
bun install
cp .env.example .env.local
bun run dev
```

## Validation

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

## GitHub Automation

GitHub Actions berjalan otomatis pada:

- push ke `main`
- push ke branch `feature/**`, `fix/**`, `chore/**`, dan `docs/**`
- pull request ke `main`

Deploy workflow:

- `Deploy Staging`: manual via `workflow_dispatch`, hanya lanjut jika checks utama hijau
- `Deploy Production`: manual via `workflow_dispatch`, hanya lanjut jika checks utama hijau dan staging sukses untuk SHA yang sama

## Security Notes

- Jangan commit file `.env` asli.
- Simpan secret production di provider deploy yang dipilih dan dashboard Neon.
- Pertahankan Dependabot, CodeQL, secret scanning, dan dependency scanning tetap aktif.
- Jika secret pernah terekspos, rotasi segera sebelum deploy ulang.

## Recommended Next Steps

1. Tambahkan validasi input backend yang lebih kuat, terutama untuk field document dan tanggal.
2. Lanjutkan search, filter, expiry tracking, dan dashboard summary endpoint.
3. Setelah kontrak API lebih stabil, mulai bangun UI frontend Arsipin.
4. Tambahkan automated tests sebelum menghubungkan deploy ke host final.
