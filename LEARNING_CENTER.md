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

### 6. Branch protection untuk solo repository

Kondisi yang dipilih untuk `main`:

- `Require a pull request before merging`: aktif
- `Require status checks to pass before merging`: aktif
- `Require branches to be up to date before merging`: aktif
- Required checks diperluas agar mencakup job utama dan security scan
- `Allow force pushes`: nonaktif
- `Allow deletions`: nonaktif

Catatan praktik:

- Untuk solo developer, branch protection tetap berguna karena memaksa setiap perubahan melewati PR dan pipeline.
- Approval review tidak wajib dijadikan pagar utama di fase awal jika justru membuat alur terlalu berat.
- Status checks sebaiknya tidak hanya security, tapi juga validasi build utama.

Status checks yang sehat untuk repo ini:

- `Backend`
- `Frontend`
- `CodeQL`
- `Dependency Scan`
- `Secret Scan`

Istilah penting:

- `branch protection`
- `required checks`
- `up to date before merging`

### 7. Membersihkan branch lokal dan remote

Perintah penting:

- Hapus branch lokal:

```bash
git branch -d nama-branch
```

- Hapus branch remote di GitHub:

```bash
git push origin --delete nama-branch
```

- Bersihkan referensi remote yang sudah basi di lokal:

```bash
git fetch --prune
```

Pelajaran:

- Menghapus branch lokal tidak otomatis menghapus branch di GitHub.
- `git fetch --prune` tidak menghapus branch di remote; ia hanya membersihkan daftar remote-tracking branch di mesin lokal.

Istilah penting:

- `remote branch`
- `remote-tracking branch`
- `prune`

### 8. Setup Prettier untuk format on save

Setup minimum yang cukup untuk backend saat ini:

- Tambahkan `prettier` sebagai `devDependency` di `backend`
- Tambahkan script:
  - `format`
  - `format:check`
- Buat `.vscode/settings.json` di root workspace
- Pastikan extension `Prettier - Code formatter` aktif di editor

Kenapa tidak perlu menambahkan semuanya sekaligus:

- Fokus sekarang adalah backend, jadi formatter lokal di `backend` dan workspace setting di root sudah cukup.
- Frontend bisa menyusul setelah workflow backend dasar stabil.
- Tooling yang terlalu banyak di awal bisa membuat belajar terseret ke konfigurasi, bukan ke pemahaman aplikasi.

Istilah penting:

- `format on save`
- `default formatter`
- `workspace settings`

### 9. Bootstrap backend Express dengan TypeScript

Milestone yang sudah berhasil:

- `backend/index.ts` tidak lagi placeholder
- server Express sudah bisa berjalan
- route `GET /` dan `GET /health` sudah berhasil dites
- `bun run prisma:generate` dan `bun run typecheck` lulus

Pelajaran utama:

- Express app dimulai dari `const app = express()`
- middleware seperti `cors()` dan `express.json()` didaftarkan dengan `app.use(...)`
- health endpoint adalah endpoint sederhana untuk memastikan service hidup
- TypeScript di backend tetap terasa seperti JavaScript, tetapi memberi bantuan tipe saat project mulai membesar

Perbedaan rasa antara JavaScript dan TypeScript di tahap ini:

- struktur route dan middleware tetap mirip Express biasa
- TypeScript mulai terasa saat file dipisah, request body divalidasi, dan Prisma dipakai
- tidak semua hal harus langsung diberi tipe yang rumit; mulai dari yang sederhana lalu diperjelas bertahap

Istilah penting:

- `middleware`
- `route handler`
- `health check`
- `request body`

### 10. Struktur backend bertahap

Struktur yang sedang mulai dipakai:

- `backend/index.ts` untuk bootstrap server
- `backend/lib/prisma.ts` untuk Prisma client shared
- `backend/routes/auth.ts` untuk route auth

Kenapa dipisah:

- `index.ts` fokus ke wiring aplikasi
- file `lib` fokus ke utilitas inti
- file `routes` fokus ke endpoint

Pelajaran:

- memisahkan file sejak awal membantu project tetap mudah dibaca saat fitur bertambah
- Express kecil masih bisa satu file, tapi auth + database lebih nyaman kalau mulai dipisah

Istilah penting:

- `bootstrap`
- `shared client`
- `router`

### 11. Prisma 7 membutuhkan driver adapter saat runtime

Masalah yang terjadi:

- `bun run dev` gagal saat membuat `PrismaClient`
- error menunjukkan bahwa `PrismaClient` membutuhkan `PrismaClientOptions` yang valid

Akar masalah:

- pada Prisma 7, konfigurasi di `prisma.config.ts` membantu Prisma CLI
- tetapi saat aplikasi berjalan, `PrismaClient` untuk PostgreSQL tetap membutuhkan driver adapter

Solusi yang dipakai:

- install `@prisma/adapter-pg`
- install `pg`
- gunakan `PrismaPg` di `backend/lib/prisma.ts`
- buat `new PrismaClient({ adapter })`

Pelajaran:

- konfigurasi CLI dan konfigurasi runtime tidak selalu sama
- membaca error runtime dengan tenang sering kali menunjukkan perubahan konsep library, bukan sekadar typo

Istilah penting:

- `driver adapter`
- `runtime configuration`
- `connection string`

### 12. Endpoint register pertama

Milestone yang berhasil:

- route `POST /auth/register` berhasil dibuat
- request berhasil menyimpan user ke database
- password berhasil di-hash dengan `bcrypt`
- response tidak mengembalikan password hash

Flow register yang dipakai:

1. baca `name`, `email`, `password` dari `req.body`
2. validasi field wajib
3. cek apakah email sudah ada
4. hash password
5. simpan user ke database
6. return data aman ke client

Contoh hasil sukses:

```json
{
  "message": "User Registered successfully",
  "user": {
    "id": "...",
    "name": "Rafi",
    "email": "rafi@example.com",
    "createdAt": "..."
  }
}
```

Pelajaran:

- endpoint auth sebaiknya mengembalikan hanya data yang aman
- field `password` tetap disimpan di database, tetapi tidak boleh dikirim balik ke frontend
- `try/catch` penting untuk menjaga API tetap memberi response yang jelas saat terjadi error

Istilah penting:

- `hashing`
- `select`
- `409 conflict`
- `201 created`

### 13. Menjalankan project di device lain

Repo ini bisa di-clone di laptop atau PC lain, tetapi tetap perlu setup environment lokal.

Yang biasanya perlu dilakukan ulang di device baru:

- install Bun
- install dependency dengan `bun install`
- siapkan file `.env`
- generate Prisma Client

Hal yang tidak perlu dibuat ulang dari nol:

- source code
- workflow GitHub Actions
- file dokumentasi project
- struktur branch yang sudah ada di remote GitHub

Pelajaran:

- Git menyinkronkan source code dan histori
- konfigurasi lokal seperti runtime, dependency, dan secret tetap perlu disiapkan di setiap device

Istilah penting:

- `clone`
- `local environment`

### 14. Detail endpoint harus menghormati ownership

Keputusan yang dipakai untuk `GET /documents/:id`:

- query detail memakai `id` dan `userId` sekaligus
- jika dokumen tidak cocok dengan user login, response tetap `404`
- route tetap memakai `protectedRouteLimiter` dan `authMiddleware`

Kenapa penting:

- endpoint detail tidak boleh jadi celah untuk menebak apakah dokumen milik user lain ada atau tidak
- ownership check sebaiknya dilakukan langsung di query, bukan setelah data diambil lalu disaring di memori
- pola yang sama akan cocok dipakai lagi untuk `PUT` dan `DELETE`

Istilah penting:

- `ownership check`
- `404 not found`
- `resource isolation`
- `runtime dependency`

### 14. Warning SSL mode pada PostgreSQL connection string

Warning yang muncul saat backend berjalan:

- `sslmode=require` pada stack `pg` saat ini masih diperlakukan seperti alias yang ketat
- pada major version berikutnya, semantiknya akan mengikuti `libpq` dan bisa memiliki jaminan security yang lebih lemah dibanding perilaku sekarang

Keputusan yang disarankan:

- gunakan `sslmode=verify-full` jika ingin mempertahankan perilaku aman yang eksplisit

Kenapa penting:

- warning ini bukan error
- aplikasi tetap jalan sekarang
- tetapi jika dibiarkan, upgrade dependency database di masa depan bisa mengubah perilaku koneksi TLS tanpa disadari

Pelajaran:

- connection string database juga bagian dari security configuration
- warning runtime yang terkait TLS/SSL sebaiknya tidak diabaikan

Istilah penting:

- `sslmode`
- `verify-full`
- `libpq semantics`
- `TLS verification`

### 15. Sinkronisasi branch lokal dengan GitHub

Kasus yang terjadi:

- branch feature di GitHub sudah hilang
- tetapi branch lokal dengan nama yang sama masih ada

Perintah yang dijalankan:

```bash
git fetch --prune
```

Hasilnya:

- referensi `origin/feature/...` dibersihkan dari lokal
- tetapi branch lokal tetap ada

Pelajaran utama:

- `git fetch --prune` hanya membersihkan `remote-tracking branches`
- branch lokal tetap harus dihapus dengan `git branch -d ...` atau `git branch -D ...`
- `git push origin --delete nama-branch` akan gagal jika branch remote memang sudah tidak ada

Istilah penting:

- `local branch`
- `remote-tracking branch`
- `prune`
- `remote ref does not exist`

### 16. Ruleset GitHub harus menarget branch dengan tepat

Kasus yang terjadi:

- ruleset untuk `main` sudah dibuat dengan target `branch`
- tetapi GitHub memberi warning bahwa ruleset tidak menarget resource apa pun

Akar masalah:

- field target branch pada ruleset bisa salah walau nama ruleset terlihat benar
- contoh target yang keliru:

```txt
refs/heads/refs/heads/main
```

- target yang benar untuk branch `main` adalah:

```txt
refs/heads/main
```

Pelajaran utama:

- ruleset yang `active` belum tentu benar-benar bekerja jika target branch salah
- warning seperti `This ruleset does not target any resources and will not be applied` harus dibaca harfiah
- saat memeriksa ruleset export JSON, fokus utama bukan hanya daftar rules, tetapi juga `conditions.ref_name.include`

Implikasi praktis:

- proteksi `main` belum boleh dianggap selesai hanya karena checkbox rule sudah banyak
- validasi akhir harus memastikan branch target cocok dan direct push ke `main` benar-benar tertolak

Update terbaru:

- export ruleset berikutnya sudah menunjukkan target yang benar:

```txt
refs/heads/main
```

- artinya warning `does not target any resources` sudah teratasi
- setelah target benar, fokus validasi berpindah dari bentuk konfigurasi ke perilaku nyata saat push dan pull request

Istilah penting:

- `ruleset`
- `ref_name`
- `target pattern`
- `branch targeting`

### 17. Proteksi `main` untuk owner repo tetap realistis

Tujuan yang diinginkan:

- bahkan pemilik repo tidak bisa asal push ke `main`
- semua perubahan normal harus lewat branch dan pull request

Pelajaran:

- GitHub bisa memaksa workflow harian agar `main` tertutup untuk direct push
- owner/admin tetap bisa mengubah pengaturan repository bila memang sengaja masuk ke Settings
- jadi tujuan yang realistis adalah mengunci alur kerja normal, bukan membuat owner mustahil mengubah aturan repo miliknya sendiri

Keputusan praktis yang sehat:

- kosongkan bypass actor bila memang tidak ingin ada jalur bypass harian
- wajibkan pull request dan status checks untuk `main`
- anggap proteksi branch sebagai pagar operasional, bukan sebagai pengganti governance akun GitHub

Istilah penting:

- `bypass actor`
- `administrator`
- `protected branch`
- `operational control`

### 18. Verifikasi branch protection harus dibuktikan dengan perilaku nyata

Hasil uji yang terjadi:

- direct push ke `main` memang tertolak
- alur perubahan normal sekarang harus lewat branch baru dan pull request

Pelajaran:

- branch protection tidak cukup dinilai dari tampilan settings saja
- validasi terbaik adalah mencoba alur kerja nyatanya
- setelah perilaku direct push benar-benar tertolak, proteksi `main` baru bisa dianggap selesai secara operasional

Istilah penting:

- `direct push`
- `protected workflow`
- `behavior verification`

### 19. `req.body` tidak selalu aman untuk langsung di-destructure

Kasus yang terjadi:

- request `curl` yang salah format membuat body request tidak terbaca seperti yang diharapkan
- destructuring langsung seperti `const { email, password } = req.body` memicu runtime error

Solusi yang dipakai:

- gunakan fallback object kosong, misalnya `req.body ?? {}`

Pelajaran:

- validasi request tidak hanya soal isi field, tetapi juga soal bentuk data yang benar-benar masuk ke handler
- fallback sederhana bisa mengubah `500` yang membingungkan menjadi `400` yang lebih masuk akal

Istilah penting:

- `destructuring`
- `request body`
- `defensive coding`

### 20. JWT helper sebaiknya dipusatkan agar reusable

Struktur yang dipakai:

- `backend/lib/jwt.ts` memegang helper JWT utama
- helper tersebut menangani pengambilan secret, pembuatan token, dan verifikasi token

Kenapa penting:

- route login tidak perlu tahu detail implementasi `jsonwebtoken`
- middleware auth bisa memakai helper verifikasi yang sama
- perubahan seperti expiry token atau payload format cukup dilakukan di satu tempat

Pelajaran:

- helper reusable mengurangi duplikasi
- logika security yang tersebar di banyak file lebih sulit dirawat

Istilah penting:

- `token payload`
- `verify token`
- `single source of truth`

### 21. Protected route pertama membuktikan auth flow benar-benar selesai

Milestone yang berhasil:

- login sekarang mengembalikan JWT
- middleware auth membaca header `Authorization: Bearer ...`
- token diverifikasi sebelum route berjalan
- endpoint `GET /auth/me` berhasil mengembalikan user dari token

Pelajaran:

- auth belum benar-benar terasa selesai hanya dengan login sukses
- protected route adalah bukti bahwa token bisa dipakai untuk mengakses resource yang dijaga
- memperluas type `Express.Request` membantu TypeScript mengenali `req.user`

Istilah penting:

- `Bearer token`
- `protected route`
- `request augmentation`

### 22. Fitur inti Arsipin sebaiknya dimulai dari metadata dokumen dulu

Keputusan yang dipilih:

- backend document dimulai dari metadata dulu, bukan langsung upload file
- endpoint pertama yang dibuat adalah `POST /documents` dan `GET /documents`

Kenapa langkah ini sehat:

- auth yang sudah dibuat langsung dipakai di fitur nyata
- kontrak backend untuk dokumen mulai stabil sebelum frontend dibangun
- upload file bisa menyusul setelah struktur data dan alur dokumen lebih jelas

Catatan produk yang muncul:

- sistem arsip nanti bisa menyimpan file asli, tetapi file sebaiknya dipisah dari metadata database
- `expiredDate` lebih aman dipakai untuk status dan reminder, bukan auto-delete
- keputusan perpanjang, arsipkan, atau hapus sebaiknya tetap ada di tangan user

Istilah penting:

- `metadata`
- `object storage`
- `expiry status`
- `manual retention decision`

### 23. Pipeline branch membantu mendeteksi masalah sebelum pull request

Perubahan yang dipilih:

- workflow `CI`, `Security`, dan `CodeQL` tidak hanya berjalan untuk `main`
- branch `feature/**`, `fix/**`, `chore/**`, dan `docs/**` juga ikut memicu pipeline saat `push`

Kenapa ini berguna:

- developer bisa melihat status branch lebih awal sebelum membuka PR
- masalah build atau security tidak menumpuk di tahap review
- feedback loop jadi lebih cepat dan lebih tenang

Pelajaran:

- pipeline yang hanya aktif di PR kadang terlambat memberi sinyal
- menjalankan validasi sejak branch kerja membantu menjaga kualitas tanpa harus menunggu merge gate

Istilah penting:

- `branch pipeline`
- `feedback loop`
- `push trigger`

### 24. Urutan middleware memengaruhi hasil security analysis

Kasus yang terjadi:

- rate limiter sudah dipasang, tetapi CodeQL masih menandai route sebagai `Missing rate limiting`
- penyebabnya adalah urutan middleware masih menempatkan authorization sebelum limiter pada route protected

Solusi yang dipakai:

- pasang rate limiter sebelum `authMiddleware` pada route yang dilindungi

Pelajaran:

- urutan middleware bukan hanya soal runtime behavior, tetapi juga memengaruhi bagaimana static analysis membaca kontrol keamanan
- untuk route yang dilindungi, pembatasan request sebaiknya terjadi seawal mungkin

Istilah penting:

- `middleware order`
- `rate limiting`
- `static analysis`

### 25. Deployment scaffold sebaiknya dipisahkan dari target hosting final

Pendekatan yang dipilih untuk Arsipin:

- siapkan workflow `staging` dan `production` lebih dulu
- gunakan satu repo utama sebagai sumber kebenaran kode
- simpan perbedaan environment di GitHub Environments
- tunda wiring deploy sampai target hosting final sudah dipilih

Kenapa ini sehat:

- struktur pipeline sudah siap tanpa memaksa keputusan hosting terlalu cepat
- kita bisa belajar CI/CD bertahap tanpa meniru kompleksitas sistem enterprise
- deployment workflow yang masih scaffold tidak mengganggu development backend harian

Istilah penting:

- `environment`
- `deployment scaffold`
- `single repo`
- `provider final`

## Hal Yang Masih Perlu Diterapkan Manual Di GitHub

Beberapa hal tidak bisa disetel penuh hanya dari file di repo:

- Aturan approval bila nanti project mulai kolaboratif
- GitHub Environments untuk `staging` dan `production`
- Secret scanning / push protection bila tersedia di paket GitHub yang dipakai

## Daftar Belajar Berikutnya

- Melengkapi document CRUD
- Menambahkan validasi input yang lebih kuat
- Menentukan desain upload file dan storage
- Menambahkan status `expiring_soon` dan `expired`
- Menambahkan automated tests
- Menambahkan deployment workflow
- Menentukan target host final untuk staging dan production
- Belajar Docker untuk packaging aplikasi
- Belajar monitoring, logging, health check, dan backup
