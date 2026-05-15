# Arsipin Frontend

Frontend Arsipin saat ini masih berada di tahap starter Next.js dan belum merepresentasikan UI produk final.

## Status Saat Ini

Yang sudah tersedia:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- metadata dasar project

Yang belum tersedia:

- UI login/register Arsipin
- integrasi ke backend auth
- dashboard dokumen
- halaman manajemen dokumen
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
- frontend sengaja belum diperdalam sebelum kontrak backend document lebih stabil
