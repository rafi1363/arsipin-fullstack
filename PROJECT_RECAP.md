# Arsipin Project Recap

Tanggal recap: `2026-05-16`

## Ringkasan Utama

Arsipin adalah project belajar fullstack untuk manajemen arsip dan dokumen.

Status repo saat ini:

- backend inti sudah cukup siap untuk MVP demo metadata dokumen
- frontend sudah punya fondasi UI awal, tetapi auth flow dan halaman aplikasi utama belum jadi
- pipeline engineering baseline sudah aktif dan cukup rapi untuk ukuran project belajar
- deployment frontend dan backend sudah aktif di Vercel untuk staging dan production

## Snapshot Implementasi

### Yang sudah selesai

Fondasi repo:

- [x] mono-repo sederhana `frontend` + `backend`
- [x] env example untuk backend dan frontend
- [x] dokumen keamanan, kontribusi, recap, dan learning center
- [x] PR template dan helper lokal PR summary

CI/CD dan security:

- [x] workflow `CI`
- [x] workflow `CodeQL`
- [x] workflow `Security`
- [x] `Dependabot`
- [x] concurrency untuk workflow utama
- [x] required checks untuk merge ke `main`
- [x] deploy scaffold untuk `staging`
- [x] deploy scaffold untuk `production`
- [x] deploy frontend staging nyata ke Vercel
- [x] deploy frontend production nyata ke Vercel
- [x] deploy backend staging nyata ke Vercel Functions
- [x] deploy backend production nyata ke Vercel Functions
- [x] alias staging/frontend/backend dengan suffix `-stg`

Backend:

- [x] Express bootstrap
- [x] `GET /`
- [x] `GET /health`
- [x] Prisma client shared
- [x] Prisma schema `User` dan `Document`
- [x] initial migration
- [x] auth register
- [x] auth login
- [x] auth me
- [x] JWT helper
- [x] auth middleware
- [x] rate limiter reusable
- [x] validation helper reusable
- [x] HTTP error helper reusable
- [x] create document
- [x] list documents
- [x] document detail
- [x] update document
- [x] delete document
- [x] search/filter/sort list dokumen
- [x] summary dashboard
- [x] ownership check dokumen
- [x] backend compatible dengan Vercel Functions via `backend/api/index.ts`
- [x] split Express app ke `backend/app.ts` agar lokal dan Vercel bisa berbagi app yang sama
- [x] Prisma Client auto-generate saat install lewat `postinstall`

Frontend:

- [x] Next.js App Router
- [x] TypeScript
- [x] Tailwind CSS
- [x] ESLint
- [x] metadata dasar
- [x] landing page minimalis awal
- [x] theme token light/dark dasar
- [x] reusable UI component dasar
- [x] shared axios client
- [x] auth token helper dasar
- [x] auth API helper dasar

### Yang belum selesai

Backend enhancement:

- [ ] automated tests
- [ ] pagination list dokumen
- [ ] validasi domain document yang lebih kuat
- [ ] upload file arsip
- [ ] storage provider integration
- [ ] reminder expiry

Frontend:

- [ ] route `/login`
- [ ] halaman login/register
- [ ] integrasi auth ke backend
- [ ] dashboard summary
- [ ] list dokumen
- [ ] create/edit/delete dokumen
- [ ] filter/sort/search UI
- [ ] route protection dan session handling
- [ ] toggle dark mode manual

Operasional:

- [x] staging deploy nyata
- [x] production deploy nyata
- [x] setup environment production untuk Vercel frontend/backend
- [x] setup environment staging untuk Vercel frontend/backend
- [ ] monitoring dan observability dasar
- [ ] `VERCEL_TOKEN` perlu disimpan manual di GitHub environment `staging` dan `production`
- [ ] database staging terpisah masih opsional dan belum dibuat
- [x] helper lokal audit/merge batch PR untuk solo workflow

## Kontrak Backend Yang Sudah Stabil Untuk Frontend

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

Query yang sudah didukung pada `GET /documents`:

- `search`
- `status`
- `sortBy`
- `sortOrder`

Status dokumen yang tersedia:

- `active`
- `expiring_soon`
- `expired`

## Prioritas Implementasi Yang Paling Masuk Akal

Urutan kerja yang disarankan dari kondisi repo sekarang:

1. buat route `/login`
2. bangun form login dan submit ke backend lewat `axios`
3. simpan token dan bootstrap user lewat `GET /auth/me`
4. bangun dashboard summary dari endpoint `/documents/summary`
5. bangun list dokumen yang memakai `search`, `status`, `sortBy`, dan `sortOrder`
6. bangun form create dan edit dokumen
7. tambah detail page atau drawer dokumen
8. setelah flow UI stabil, tambah automated tests backend

## Catatan Penting

- sistem dokumen saat ini masih menyimpan metadata, belum file upload
- homepage frontend sudah berubah dari template default, tetapi route `/login` belum tersedia
- navigasi internal frontend sudah mulai memakai `next/link`, jadi fondasi SPA-style navigation sudah ada
- untuk source of truth deployment terbaru, gunakan `DEPLOYMENT_HISTORY.md`
- untuk keputusan belajar dan alasan engineering, gunakan `LEARNING_CENTER.md`

## Update Workflow Lokal

Tooling lokal kini juga mencakup script `.local-scripts/pr-batch-merge.sh`.

Perannya:

- audit semua PR open ke branch target
- klasifikasikan status PR menjadi siap merge, pending, failed, blocked, draft, atau overlap risk
- izinkan merge batch hanya untuk PR yang bersih dan sudah hijau
- tetap meminta konfirmasi manual sebelum merge

Status saat recap ini diperbarui:

- script sudah berhasil dijalankan pada macOS dengan bash bawaan setelah dibuat kompatibel tanpa `declare -A` dan tanpa `mapfile`

## Catatan Arah Operasional Berikutnya

Keputusan arsitektur yang saat ini paling masuk akal untuk fase berikutnya:

- database tetap `Neon PostgreSQL`
- frontend sebaiknya diarahkan ke `Vercel`
- backend sekarang diarahkan ke `Vercel Functions` lewat project terpisah `arsipin-backend`
- file dokumen asli nantinya disimpan di object storage, bukan langsung di database

URL aktif:

- frontend production: `https://arsipin-fullstack.vercel.app`
- frontend staging: `https://arsipin-fullstack-stg.vercel.app`
- backend production: `https://arsipin-backend.vercel.app`
- backend staging: `https://arsipin-backend-stg.vercel.app`

Catatan deploy:

- Railway tidak lagi menjadi target utama karena trial akun sudah expired.
- Backend Vercel tidak memakai prebuilt artifact lokal karena dependency native seperti `bcrypt` harus dibuild di environment Linux Vercel.
- Production deploy workflow backend memverifikasi staging deployment untuk commit yang sama sebelum deploy production.

Model data produk yang disarankan untuk fitur upload nanti:

- database menyimpan metadata dokumen
- object storage menyimpan file asli
- tabel dokumen atau tabel file turunan menyimpan referensi key/path file, mime type, ukuran, dan waktu upload
