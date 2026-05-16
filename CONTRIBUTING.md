# Contributing

Panduan ini dibuat untuk menjaga alur kerja Arsipin tetap rapi walau saat ini dikerjakan oleh solo developer.

## Workflow Branch

- `main` adalah branch stabil.
- Jangan kerjakan perubahan baru langsung di `main`.
- Buat branch baru untuk setiap unit kerja yang jelas.

Contoh nama branch:

- `feature/auth-backend`
- `feature/dashboard-summary`
- `fix/login-validation`
- `chore/security-baseline`
- `docs/learning-center`

## Pull Request Flow

Alur yang disarankan:

1. Buat branch dari `main`.
2. Kerjakan satu topik perubahan yang fokus.
3. Jalankan validasi lokal yang relevan.
4. Push branch ke GitHub.
5. Buat pull request ke `main`.
6. Pastikan semua workflow hijau sebelum merge.

Walau solo developer, pull request tetap berguna untuk:

- melihat diff dengan lebih tenang,
- memaksa perubahan melewati CI,
- menjaga histori project tetap mudah ditelusuri.

## Optional PR Helper

Repo ini juga mendukung workflow lokal opsional untuk mengisi bagian `Summary` PR secara otomatis.

Yang perlu diketahui:

- placeholder summary ada di `.github/pull_request_template.md`
- script helper lokal disimpan di `.local-scripts/`
- `.local-scripts/` sengaja di-ignore dari Git agar tetap menjadi alat bantu lokal

Contoh pemakaian:

```bash
.local-scripts/pr-create.sh
```

Atau dengan base branch dan title eksplisit:

```bash
.local-scripts/pr-create.sh main "feat(frontend): build dashboard shell"
```

Catatan:

- helper ini membaca branch aktif, commit message, dan file yang berubah untuk mengisi summary
- helper ini bersifat lokal dan tidak wajib dipakai
- review isi summary tetap disarankan sebelum PR benar-benar dibuat

## Validasi Lokal

Backend:

```bash
cd backend
bun run prisma:generate
bun run format:check
bun run typecheck
```

Frontend:

```bash
cd frontend
bun run lint
bun run build
```

## Catatan Dokumentasi

Jika perubahan cukup besar:

- perbarui `PROJECT_RECAP.md`,
- tambahkan pelajaran baru ke `LEARNING_CENTER.md`.

Jika perubahan menyentuh keamanan atau operasional:

- jelaskan alasan perubahan,
- sebutkan risiko yang dikurangi,
- catat apa yang masih harus disetel manual di GitHub atau provider deploy.

## GitHub Settings Yang Disarankan

Setel langsung di repository GitHub:

- branch protection untuk `main`,
- require pull request before merge,
- require status checks to pass,
- block force push,
- enable Dependabot alerts,
- enable Code scanning alerts,
- aktifkan secret scanning bila tersedia.
