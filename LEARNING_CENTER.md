# Learning Center

Dokumen ini adalah pusat catatan belajar untuk project Arsipin. Setiap kali ada konsep baru, keputusan engineering baru, atau perubahan operasional yang penting, tambahkan ringkasannya di sini agar pembelajaran tidak hilang di chat.

## Cara Pakai

- Tulis apa yang dipelajari, bukan hanya apa yang diubah.
- Fokus pada alasan di balik keputusan.
- Simpan istilah penting yang perlu dipelajari lagi nanti.
- Jika perubahan cukup besar, sinkronkan juga ke `PROJECT_RECAP.md`.

## Topik Yang Sudah Dipelajari

### 1. Branching strategy untuk solo developer

Keputusan:

- `main` diperlakukan sebagai branch stabil.
- Semua pekerjaan baru masuk lewat branch singkat, misalnya:
  - `feature/auth-backend`
  - `feature/document-list-ui`
  - `chore/security-baseline`
  - `docs/project-recap-update`

Alasan:

- Memudahkan review perubahan walau dikerjakan sendiri.
- Membuat histori Git lebih mudah dibaca.
- Mengurangi risiko `main` berisi eksperimen yang belum siap.

Istilah penting:

- `short-lived branch`
- `pull request`
- `stable branch`

### 2. CI sebagai pagar kualitas minimum

Kondisi saat ini:

- Backend dicek dengan typecheck.
- Frontend dicek dengan lint dan build.

Makna praktis:

- CI bukan hanya formalitas.
- CI membantu memastikan project masih bisa dibangun saat ada perubahan.
- CI sebaiknya dijadikan syarat merge ke `main`.

Istilah penting:

- `status checks`
- `continuous integration`
- `build validation`

### 3. Security automation baseline

Security automation yang sudah ada atau ditambahkan:

- `CodeQL` untuk static analysis.
- `Dependabot` untuk update dependency dan GitHub Actions.
- `Gitleaks` untuk mendeteksi secret yang tidak sengaja ter-commit.
- `Trivy` untuk memindai dependency dan filesystem project dari kerentanan yang dikenal.

Pelajaran utama:

- Security tidak mulai dari tools yang mahal atau kompleks.
- Baseline yang baik dimulai dari kebiasaan: PR, review, scan, dan secret hygiene.

Istilah penting:

- `SAST`
- `secret scanning`
- `dependency scanning`
- `vulnerability database`

### 4. Least privilege di GitHub Actions

Prinsip:

- Workflow hanya diberi permission minimum yang dibutuhkan.
- Untuk job CI biasa, permission dasar yang aman biasanya `contents: read`.

Kenapa penting:

- Jika action atau dependency workflow bermasalah, dampaknya lebih terbatas.
- Ini melatih kebiasaan security-by-default.

Istilah penting:

- `permissions`
- `least privilege`
- `workflow token`

### 5. Version pinning pada GitHub Actions

Kasus yang terjadi:

- Pipeline `Security` gagal karena `aquasecurity/trivy-action@0.33.1` tidak bisa di-resolve.

Pelajaran:

- Versi action harus mengikuti tag yang benar-benar tersedia di upstream repository atau Marketplace.
- Untuk `trivy-action`, dokumentasi resmi dan GitHub Marketplace saat ini menggunakan `v0.36.0`, bukan `0.33.1`.
- Saat workflow gagal di tahap `unable to resolve action`, cek dulu apakah nama action dan tag versinya masih valid.

Praktik yang sehat:

- Gunakan versi yang tercantum di dokumentasi resmi.
- Lebih aman lagi, untuk action yang sensitif secara security, pertimbangkan pin ke commit SHA immutable setelah workflow stabil.

Istilah penting:

- `action tag`
- `version pinning`
- `immutable commit SHA`

## Hal Yang Masih Perlu Diterapkan Manual Di GitHub

Beberapa hal tidak bisa disetel penuh hanya dari file di repo:

- Branch protection untuk `main`
- Wajib pull request sebelum merge
- Required status checks: `CI`, `CodeQL`, dan `Security`
- Aturan approval bila nanti project mulai kolaboratif
- GitHub Environments untuk `staging` dan `production`
- Secret scanning / push protection bila tersedia di paket GitHub yang dipakai

## Daftar Belajar Berikutnya

- Membuat backend Express yang benar-benar hidup
- Menambahkan automated tests
- Menambahkan deployment workflow
- Belajar Docker untuk packaging aplikasi
- Belajar monitoring, logging, health check, dan backup
