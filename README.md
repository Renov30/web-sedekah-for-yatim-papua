# Sedekah for Yatim Papua — Public Website

> **Gerakan Kebaikan untuk Papua**: Menumbuhkan Harapan, Menguatkan Masa Depan Anak Papua.

Website publik resmi **Sedekah for Yatim Papua (SFY Papua)**, inisiatif kerelawanan independen yang berfokus mendampingi anak-anak yatim, piatu, dan dhuafa di wilayah Jayapura dan sekitarnya melalui penyediaan perlengkapan belajar, pemenuhan gizi pokok, serta pendampingan karakter.

Aplikasi ini merupakan **Fase 1** dari platform kebaikan terpadu SFY Papua, yang berfokus secara eksklusif pada kehadiran publik yang otentik, bermartabat, dan transparan. Sistem Informasi Manajemen (MIS) internal akan dikembangkan pada fase berikutnya.

---

## 1. Identitas Visual & Prinsip Desain

Website ini dirancang secara editorial tanpa menggunakan estetika template AI generik (bebas gradien acak, tanpa glassmorphism berlebihan, tanpa statistik fiktif, dan tanpa eksploitasi visual kemiskinan).

- **Forest Green** (`#0D2218`, `#122C20`): Warna grounding utama melambangkan alam Papua dan keteguhan amanah.
- **Botanical Green** (`#1E663D`, `#267F4C`): Warna aksi primer untuk tombol dan penekanan interaktif.
- **Warm Ivory** (`#FBF9F5`, `#F5F0E6`): Kanvas latar editorial yang nyaman dibaca.
- **Charcoal / Green-Black** (`#0F1C14`): Tipografi judul dengan kontras terukur.
- **Warm Ochre** (`#CF8424`): Aksen kehangatan budaya dan lencana pemberitahuan terbuka.
- **Tipografi**: **Plus Jakarta Sans** dengan skala editorial yang berwibawa dan mudah dibaca di layar seluler maupun desktop.

---

## 2. Struktur Rute Publik

| Rute | Halaman | Deskripsi |
|---|---|---|
| `/` | **Beranda** | Hero image-led, manifesto gerakan, 4 pilar program, 3 jalur partisipasi, sorotan kegiatan lapangan, komitmen transparansi, dan ajakan aksi penutup. |
| `/tentang-kami` | **Tentang Kami** | Latar belakang gerakan, visi dan misi, 6 nilai moral, kebijakan Child Safeguarding (perlindungan anak), dan catatan kejujuran struktur kepengurusan. |
| `/program` | **Program** | Pembahasan mendalam 4 pilar intervensi: Pendidikan, Kebutuhan Dasar, Pendampingan Belajar, dan Gerakan Relawan Komunitas. |
| `/kegiatan` | **Kegiatan** | Arsip aksi lapangan terverifikasi dan agenda editorial terbuka dilengkapi filter kategori interaktif dan catatan lapangan. |
| `/transparansi` | **Transparansi** | 5 prinsip tata kelola donasi bersih, peta jalan (roadmap) pelaporan keuangan berkala, dan panduan anti-penipuan. |
| `/jadi-relawan` | **Jadi Relawan** | 4 divisi peran relawan, etika aksi ramah anak, alur seleksi, serta formulir pendaftaran langsung terhubung ke WhatsApp resmi tanpa database perantara. |
| `/donasi` | **Dukungan & Donasi** | Urgensi donasi, jaminan amanah, dan kartu verifikasi permohonan rekening resmi ke sekretariat bendahara. |

---

## 3. Arsitektur Konten

Seluruh data publik dipisahkan secara rapi dalam berkas statis TypeScript berkonsistensi tipe tinggi (`src/data/`):
- `src/data/organization.ts`: Informasi resmi organisasi, nilai, kontak, dan catatan legalitas.
- `src/data/navigation.ts`: Struktur tautan navigasi header, drawer mobile, dan footer.
- `src/data/programs.ts`: Data strongly-typed untuk seluruh pilar program dan cakupan wilayah.
- `src/data/activities.ts`: Dokumentasi kegiatan dengan label pembeda riil vs placeholder editorial.
- `src/data/transparency.ts`: Prinsip akuntabilitas, roadmap laporan, dan panduan anti-fraud.

---

## 4. Stack Teknologi

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components by default)
- **Library UI**: React 19 + TypeScript (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan custom theme tokens
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Font**: Plus Jakarta Sans via `next/font/google`
- **Container**: Docker Multi-stage (Node.js 20 LTS Alpine, standalone output, non-root user `nextjs`)

---

## 5. Panduan Menjalankan Secara Lokal

### Prasyarat
- Node.js LTS (v20 atau lebih baru)
- npm v10+

### Langkah-langkah
```bash
# 1. Pasang dependensi
npm install

# 2. Salin variabel lingkungan
cp .env.example .env.local

# 3. Jalankan server pengembangan
npm run dev

# Buka http://localhost:3000 pada peramban Anda.
```

### Script Pengujian & Build
```bash
# Pemeriksaan linting ESLint
npm run lint

# Kompilasi build produksi Next.js
npm run build

# Menjalankan hasil build produksi lokal
npm run start
```

---

## 6. Panduan Menjalankan dengan Docker

Proyek ini telah dilengkapi dengan `Dockerfile` multi-stage efisien berbasis Alpine Linux, berjalan dengan user non-root `nextjs` (UID 1001), dan dilengkapi health check otomatis.

### Menjalankan dengan Docker Compose (Direkomendasikan)

```bash
# 1. Bangun image dan jalankan container di latar belakang
docker compose up -d --build

# 2. Periksa status dan health check container
docker compose ps

# 3. Pantau log aplikasi
docker compose logs -f web

# 4. Hentikan container
docker compose down
```

### Menjalankan dengan Docker CLI Langsung

```bash
# 1. Bangun image produksi
docker build -t web-sfy:latest .

# 2. Jalankan container pada port 3000
docker run -d \
  --name sfy-public-web \
  -p 3000:3000 \
  --restart unless-stopped \
  web-sfy:latest

# 3. Periksa status kesehatan container
docker inspect --format='{{json .State.Health}}' sfy-public-web

# 4. Hentikan dan hapus container
docker stop sfy-public-web && docker rm sfy-public-web
```

---

## 7. Kebijakan Keaslian Data & Donasi

Website ini beroperasi dengan **Zero-Fabrication Policy**:
1. **Tidak ada rekening bank fiktif**: Seluruh alokasi donasi diverifikasi langsung melalui sekretariat resmi.
2. **Tidak ada formulir semu**: Pendaftaran relawan langsung menghubungkan calon relawan ke nomor WhatsApp koordinator terverifikasi.
3. **Dokumentasi beretika**: Setiap foto anak mematuhi etika perlindungan martabat dan hak privasi anak (Child Safeguarding).
