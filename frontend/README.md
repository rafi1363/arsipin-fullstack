# Arsipin Frontend

Frontend Arsipin menggunakan `Next.js 16`, `React 19`, `TypeScript`, dan `Tailwind CSS 4`.

## Status Saat Ini

Frontend saat ini sudah memiliki fondasi UI awal, tetapi belum masuk ke flow auth dan halaman aplikasi utama yang benar-benar bisa dipakai.

Yang sudah tersedia:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- metadata dasar project
- landing page minimalis yang lebih responsive
- theme token dasar untuk light dan dark mode
- reusable component dasar:
  - `Button`
  - `Card`
  - `Container`
  - `Badge`
- shared API client dengan `axios`
- auth token helper berbasis `localStorage`
- auth API helper dasar untuk `login` dan `getMe`

Yang belum tersedia:

- route `/login`
- UI login/register
- dashboard summary Arsipin
- list dokumen
- detail/create/edit/delete dokumen
- search/filter/sort di UI
- integrasi auth ke backend
- proteksi route frontend
- toggle dark mode manual

## Backend Yang Sudah Bisa Dipakai Frontend

Base URL aktif:

- production: `https://arsipin-backend.vercel.app`
- staging: `https://arsipin-backend-stg.vercel.app`
- local development: `http://localhost:5000`

Endpoint yang sudah siap dikonsumsi:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /documents`
- `GET /documents`
- `GET /documents/summary`
- `GET /documents/:id`
- `PUT /documents/:id`
- `DELETE /documents/:id`

Query yang sudah tersedia pada list dokumen:

- `search`
- `status`
- `sortBy`
- `sortOrder`

## Urutan Implementasi Frontend Yang Disarankan

1. buat route `/login`
2. bangun halaman login
3. sambungkan submit login ke backend lewat `axios`
4. simpan token dan sambungkan `getMe`
5. bangun dashboard summary
6. bangun halaman list dokumen
7. tambahkan form create dan edit dokumen
8. tambahkan proteksi route dan session handling

## Getting Started

```bash
bun install
cp .env.example .env.local
bun run dev
```

Open `http://localhost:3000`.

## Validation

```bash
bun run lint
bun run build
```

## Environment

Minimal env:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Production env:

```env
NEXT_PUBLIC_API_URL=https://arsipin-backend.vercel.app
NEXT_PUBLIC_APP_URL=https://arsipin-fullstack.vercel.app
```

Staging env:

```env
NEXT_PUBLIC_API_URL=https://arsipin-backend-stg.vercel.app
NEXT_PUBLIC_APP_URL=https://arsipin-fullstack-stg.vercel.app
```

## Deployment

Frontend sekarang dideploy ke Vercel project `arsipin-fullstack`.

Workflow:

- staging: `.github/workflows/deploy-staging.yml`
- production: `.github/workflows/deploy-production.yml`

Domain:

- production: `https://arsipin-fullstack.vercel.app`
- staging: `https://arsipin-fullstack-stg.vercel.app`

Production workflow hanya boleh dijalankan setelah staging workflow sukses untuk commit yang sama.

## Notes

- `src/app/page.tsx` sudah menjadi landing page minimalis awal, bukan template default lagi
- route `/login` belum ada, jadi CTA login saat ini belum usable end-to-end
- fokus implementasi berikutnya sebaiknya memakai kontrak backend yang sudah stabil terlebih dulu
- detail deployment terbaru ada di `../DEPLOYMENT_HISTORY.md`
