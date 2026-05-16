# Arsipin Frontend

Frontend Arsipin saat ini masih berada di tahap starter Next.js dan belum merepresentasikan UI produk final, tetapi kontrak backend inti sudah cukup stabil untuk mulai membangun MVP UI.

## Status Saat Ini

Yang sudah tersedia:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- metadata dasar project

Yang belum tersedia:

- UI login/register Arsipin
- dashboard summary Arsipin
- list/manajemen dokumen
- search/filter/sort dokumen di UI
- integrasi ke backend auth dan documents
- reminder expiry

## Getting Started

Run development server:

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

Minimal env yang dipakai saat ini:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Notes

- halaman utama masih template awal Next.js
- backend sekarang sudah menyediakan auth, CRUD dokumen, list filter, dan summary dashboard untuk menopang pengerjaan frontend berikutnya
