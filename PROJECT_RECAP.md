# Arsipin Project Recap

Tanggal recap: `2026-05-16`

## Ringkasan Utama

Arsipin adalah project belajar fullstack untuk manajemen arsip dan dokumen.

Status repo saat ini:

- backend inti sudah cukup siap untuk MVP demo metadata dokumen
- frontend sudah punya fondasi UI awal, tetapi auth flow dan halaman aplikasi utama belum jadi
- pipeline engineering baseline sudah aktif dan cukup rapi untuk ukuran project belajar
- deployment final masih belum dihubungkan ke provider hosting nyata

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

- [ ] staging deploy nyata
- [ ] production deploy nyata
- [ ] setup environment production
- [ ] monitoring dan observability dasar

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
- untuk source of truth yang lebih operasional, gunakan `recap.md`
- untuk keputusan belajar dan alasan engineering, gunakan `LEARNING_CENTER.md`

## Catatan Arah Operasional Berikutnya

Keputusan arsitektur yang saat ini paling masuk akal untuk fase berikutnya:

- database tetap `Neon PostgreSQL`
- frontend sebaiknya diarahkan ke `Vercel`
- backend sebaiknya diarahkan ke `Railway` atau `Render`
- file dokumen asli nantinya disimpan di object storage, bukan langsung di database

Model data produk yang disarankan untuk fitur upload nanti:

- database menyimpan metadata dokumen
- object storage menyimpan file asli
- tabel dokumen atau tabel file turunan menyimpan referensi key/path file, mime type, ukuran, dan waktu upload
