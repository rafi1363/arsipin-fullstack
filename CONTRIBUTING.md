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

## Optional Batch Merge Helper

Selain helper pembuatan PR, repo ini juga mendukung helper lokal untuk audit dan merge batch PR yang sudah hijau.

Script:

- `.local-scripts/pr-batch-merge.sh`

Tujuan:

- mengecek semua PR open ke branch target
- memisahkan PR yang siap merge dari PR yang masih pending, failed, blocked, atau draft
- menahan PR yang punya overlap file dengan PR siap merge lain
- meminta konfirmasi eksplisit sebelum merge benar-benar dijalankan

Cara pakai:

```bash
.local-scripts/pr-batch-merge.sh
```

Dry run eksplisit:

```bash
.local-scripts/pr-batch-merge.sh main --dry-run
```

Eksekusi merge untuk PR yang aman:

```bash
.local-scripts/pr-batch-merge.sh main --execute
```

Perilaku penting:

- mode default adalah `--dry-run`
- hanya PR dengan required checks hijau dan status merge bersih yang masuk kategori siap merge
- PR dengan overlap file tidak di-merge batch dan hanya dilaporkan sebagai `OVERLAP RISK`
- merge tetap meminta kata konfirmasi manual sebelum dijalankan
- merge memakai strategi `--squash`

Prasyarat:

- `gh` harus terpasang dan valid login
- jika auth `gh` invalid, login ulang dengan:

```bash
gh auth login -h github.com
```

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
- sinkronkan `README.md` bila ada perubahan yang mengubah gambaran umum repo.
- sinkronkan `recap.md` bila kamu memakai file itu sebagai handoff konteks kerja terbaru.
- jika perubahan ada di frontend foundation, sinkronkan juga `frontend/README.md` agar status UI/auth terbaru tidak tertinggal.

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
