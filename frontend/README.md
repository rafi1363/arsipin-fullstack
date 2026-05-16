# Arsipin Frontend

Frontend Arsipin menggunakan `Next.js 16`, `React 19`, `TypeScript`, dan `Tailwind CSS 4`.

## Status Saat Ini

Frontend saat ini masih starter project dan belum merepresentasikan UI produk final.

Yang sudah tersedia:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- metadata dasar project

Yang belum tersedia:

- UI login/register
- dashboard summary Arsipin
- list dokumen
- detail/create/edit/delete dokumen
- search/filter/sort di UI
- integrasi auth ke backend
- proteksi route frontend

## Backend Yang Sudah Bisa Dipakai Frontend

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

1. buat util API client dan auth contract
2. bangun halaman login
3. bangun dashboard summary
4. bangun halaman list dokumen
5. tambahkan form create dan edit dokumen
6. tambahkan proteksi route dan session handling

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
```

## Notes

- `src/app/page.tsx` masih template bawaan Next.js
- fokus implementasi berikutnya sebaiknya memakai kontrak backend yang sudah stabil terlebih dulu
