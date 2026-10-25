# PANDUAN LENGKAP: DEPLOY WEB, DATABASE & BUILD APK ANDROID
**Sistem Informasi & Pendataan Sedekah for Yatim Papua (SFY)**

Dokumen ini berisi panduan terpadu langkah demi langkah untuk melakukan deploy backend website, mengatur database production (PostgreSQL), menghubungkan aplikasi Android, serta mem-build file instalasi APK mandiri (*standalone APK*).

---

## 📌 Ringkasan Arsitektur Sistem

```
┌────────────────────────────────┐
│   Database Production          │
│   (PostgreSQL: Neon/Supabase)  │
└───────────────▲────────────────┘
                │ Prisma ORM (DATABASE_URL)
┌───────────────┴────────────────┐
│   Web & REST API Backend       │
│   Next.js 16 di Vercel Cloud   │
│   (https://web-sfy.vercel.app) │
└───────▲────────────────▲───────┘
        │                │
┌───────┴────────┐ ┌─────┴─────────────────────────────────┐
│ Web Browser    │ │ Aplikasi Mobile Android (APK)         │
│ (Admin Portal) │ │ React Native (Expo SDK 58)            │
│                │ │ Offline-First Caching + Two-Way Sync  │
└────────────────┘ └───────────────────────────────────────┘
```

Aplikasi mobile **tidak langsung membuka port database secara terbuka** demi keamanan, melainkan berkomunikasi melalui **REST API Next.js** yang sudah terautentikasi dan terenkripsi HTTPS (`/api/admin/auth/login`, `/api/admin/sync`, `/api/admin/orphans`, dll).

---

## 🗄️ Bagian 1: Deploy & Setup Database Production (PostgreSQL)

### 1. Memilih Penyedia Database Cloud (Gratis & Direkomendasikan)
Gunakan salah satu penyedia cloud database PostgreSQL terkelola gratis berikut:
- **Neon Serverless Postgres** (*Paling direkomendasikan untuk Vercel / Next.js*): [neon.tech](https://neon.tech)
- **Supabase**: [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)

### 2. Dapatkan Connection String (`DATABASE_URL`)
Setelah membuat project/database baru, salin URL koneksi PostgreSQL. Format umumnya:
```text
postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require
```

### 3. Migrasi Skema & Seeding Data ke Database Cloud
Di komputer lokal Anda, jalankan perintah berikut dari folder root project untuk membuat seluruh tabel dan mengunggah data awal:

```bash
# 1. Pastikan Prisma Client ter-generate
npx prisma generate

# 2. Push struktur tabel (schema.prisma) langsung ke database cloud
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require" npx prisma db push

# 3. Jalankan seeding data awal (Master Akun Admin, Anak Yatim, Wilayah, AV)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require" npx tsx prisma/seed.ts
```

> **Tips:** Anda juga bisa menjalankan query SQL manual dari file `prisma/init_schema.sql` atau `prisma/seed_kurik_orphans.sql` langsung melalui fitur **SQL Editor** di dashboard Neon / Supabase Anda.

---

## 🌐 Bagian 2: Deploy Web & Backend API ke Vercel

Sistem web dan backend API Next.js di-deploy ke Vercel dan terintegrasi otomatis dengan Git repository di GitHub.

### 1. Hubungkan Repository ke Vercel
1. Buka [https://vercel.com](https://vercel.com) dan login ke akun Vercel Anda.
2. Klik **Add New...** -> **Project**.
3. Pilih repository GitHub project ini: `Renov30/web-sedekah-for-yatim-papua`.
4. Framework Preset akan otomatis terdeteksi sebagai **Next.js**.

### 2. Atur Environment Variables di Vercel Dashboard
Sebelum klik Deploy, tambahkan variabel lingkungan (*Environment Variables*) pada menu pengaturan Vercel:

| Nama Variabel | Nilai Contoh | Keterangan |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Connection string PostgreSQL production dari Bagian 1 |
| `NEXT_PUBLIC_SITE_URL` | `https://web-sfy.vercel.app` | Domain website Anda di Vercel |
| `NODE_ENV` | `production` | Mode produksi |

### 3. Build Command & Verifikasi Deploy
- Pastikan build command di Vercel adalah standar: `npm run build`
- File `package.json` sudah dilengkapi hook `"postinstall": "prisma generate"`, sehingga Prisma Client otomatis dibuat saat Vercel melakukan build.
- Klik **Deploy**. Tunggu 1–3 menit hingga status bertanda hijau (Ready).
- Uji endpoint API di browser atau via cURL:
  ```bash
  curl -I https://web-sfy.vercel.app/api/admin/sync
  # Harus mengembalikan HTTP 200 OK dengan JSON data
  ```

---

## 📱 Bagian 3: Menghubungkan Aplikasi Mobile ke Database Production

Aplikasi mobile sudah dilengkapi mesin sinkronisasi offline-first otomatis di file `mobile/src/services/syncEngine.ts`.

### 1. Konfigurasi Endpoint di Aplikasi Mobile
Pastikan file konfigurasi berikut mengarah ke domain Vercel Anda:

1. **File `mobile/.env`**:
   ```env
   EXPO_PUBLIC_API_URL=https://web-sfy.vercel.app
   ```
2. **File `mobile/eas.json`** (pada blok `preview` dan `production`):
   ```json
   "env": {
     "EXPO_PUBLIC_API_URL": "https://web-sfy.vercel.app"
   }
   ```
3. **File `mobile/src/services/syncEngine.ts`**:
   ```typescript
   export const PRODUCTION_SERVER_URL = "https://web-sfy.vercel.app";
   ```

### 2. Fitur Auto-Healing & Proteksi Cache
Jika aplikasi di HP pengguna pernah menyimpan alamat server lama (misal IP lokal `192.168.1.15`), fungsi `getServerUrl()` di `syncEngine.ts` secara cerdas akan otomatis memulihkan (*auto-heal*) alamat server ke `https://web-sfy.vercel.app`.

### 3. Uji Coba Cepat Tanpa Build APK (Expo Go)
Untuk memverifikasi koneksi langsung dari HP Anda:
```bash
cd mobile
npm run tunnel
```
1. Buka aplikasi **Expo Go** di HP Android atau iPhone.
2. Scan QR code yang tampil di layar terminal.
3. Masuk dengan akun Master Admin:
   - **Email**: `admin@sfypapua.org`
   - **Password**: `AdminSFY2025!`
4. Periksa indikator status di pojok kanan atas aplikasi mobile: pastikan bertuliskan **Online** (titik hijau).

---

## 🔨 Bagian 4: Cara Build Aplikasi Menjadi File APK (Android)

Untuk membuat file `.apk` yang bisa dibagikan langsung lewat WhatsApp / Google Drive dan diinstal di semua jenis HP Android tanpa Google Play Store:

### Langkah 1: Persiapan Akun Expo
Daftar akun gratis di [https://expo.dev/signup](https://expo.dev/signup) jika belum memilikinya.

### Langkah 2: Login Akun Expo di Komputer Anda
Buka terminal dan masuk ke folder `mobile`:
```bash
cd mobile
npx eas-cli login
```
*Masukkan email dan password akun Expo Anda.*

### Langkah 3: Inisialisasi Proyek (Hanya Pertama Kali)
Kaitkan folder lokal Anda ke proyek di dasbor Expo:
```bash
npx eas-cli project:init
```

### Langkah 4: Mulai Proses Build Cloud
Jalankan perintah pembuatan APK:
```bash
npm run build:apk
```
*(atau bisa juga menjalankan: `npx eas-cli build -p android --profile preview`)*

1. Saat muncul pertanyaan pembuatan Keystore Android:
   > `Generate a new Android Keystore?` -> Ketik **`Y`** lalu Enter.
2. Proses kompilasi akan dikerjakan oleh cloud build Expo. Anda dapat memantau log prosesnya secara live.
3. Anda bisa menekan `Ctrl + C` di terminal jika ingin ditinggal; proses build tetap berjalan di cloud server Expo.
4. Anda dapat memantau statusnya di web browser melalui: [https://expo.dev](https://expo.dev) -> menu **Builds**.

### Langkah 5: Unduh dan Instal APK di HP
- Setelah proses selesai (biasanya 7–15 menit), terminal dan halaman web `expo.dev` akan memberikan link unduhan serta QR Code untuk file `.apk`.
- Buka link tersebut di browser HP Anda untuk mengunduh file `.apk`.
- Buka file hasil unduhan di HP Android dan izinkan *"Install from Unknown Sources"* (Instal dari Sumber Tidak Dikenal).
- Aplikasi **SFY Papua Admin** siap digunakan!

---

## 🔄 Bagian 5: Alur Pembaruan (Cara Melakukan Update)

### 1. Jika Memperbarui Web, Database, atau API Backend
- Cukup push commit ke GitHub:
  ```bash
  git add .
  git commit -m "perbaikan data atau api"
  git push origin main
  ```
- Vercel akan otomatis melakukan build & deploy ulang.
- Aplikasi mobile di HP pengguna **tidak perlu diinstal ulang**. Cukup buka aplikasi dan tekan tombol *Sinkronkan Data*, perubahan data langsung tampil.

### 2. Jika Memperbarui Fitur / Tampilan Aplikasi Mobile (`mobile/`)
- Ubah nomor versi di `mobile/app.json`:
  ```json
  "version": "1.0.1"
  ```
- Jalankan kembali perintah build APK:
  ```bash
  cd mobile
  npm run build:apk
  ```
- Unduh APK baru dan pasang di HP. Android akan langsung menimpa aplikasi lama sebagai pembaruan (*Update*) tanpa menghapus data lokal yang tersimpan.

---

## 🔑 Bagian 6: Kredensial Default Master Admin

- **Portal Web Admin**: [https://web-sfy.vercel.app/admin/login](https://web-sfy.vercel.app/admin/login)
- **Aplikasi Android**: Buka aplikasi SFY Papua Admin
- **Email**: `admin@sfypapua.org`
- **Kata Sandi**: `AdminSFY2025!`
- **Hak Akses**: Super Admin Lembaga (Akses Penuh Seluruh Modul)

---

## 🛠️ Ringkasan Perintah Penting (Cheat Sheet)

```bash
# === WEB & DATABASE ===
npm run dev                  # Menjalankan Next.js di lokal (localhost:3000)
npx prisma studio            # Buka UI visual database lokal di browser
npx prisma db push           # Sinkronkan schema.prisma ke database target

# === MOBILE ===
cd mobile
npm start                    # Jalankan Expo server mode lokal
npm run tunnel               # Jalankan Expo tunnel (bisa diakses HP dari internet)
npm run build:apk            # Mem-build file APK Android standalone via EAS
```
