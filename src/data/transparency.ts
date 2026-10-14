export interface TransparencyPrinciple {
  title: string;
  description: string;
  practice: string;
}

export interface TransparencyRoadmap {
  phase: string;
  timeline: string;
  status: "active" | "next" | "planned";
  statusLabel: string;
  title: string;
  description: string;
  deliverables: string[];
}

export const transparencyPrinciples: TransparencyPrinciple[] = [
  {
    title: "Pemisahan Rekening Khusus Donasi",
    description:
      "Dana amanah publik dikelola secara terpisah sepenuhnya dari keperluan pribadi perorangan relawan. Setiap aliran kas masuk dan keluar dicatat dengan teliti.",
    practice:
      "Menggunakan rekening bank kelembagaan resmi dengan rekonsiliasi berkala oleh bendahara amanah.",
  },
  {
    title: "Verifikasi Berbasis Bukti Lapangan",
    description:
      "Setiap pengeluaran belanja bantuan wajib disertai nota pembelian riil, dokumentasi penyerahan barang yang santun, serta tanda terima tertulis dari wali anak.",
    practice:
      "Arsip digital faktur dan foto dokumentasi disimpan tersentralisasi untuk verifikasi silang internal.",
  },
  {
    title: "Publikasi Rekapitulasi Terbuka",
    description:
      "Laporan ringkas penyaluran dan pemanfaatan donasi dipublikasikan secara berkala agar para donatur dan masyarakat luas dapat meninjau realisasi program.",
    practice:
      "Rekapitulasi berkala diterbitkan melalui halaman resmi ini dan kanal media sosial resmi lembaga.",
  },
  {
    title: "Perlindungan Martabat Penerima Manfaat",
    description:
      "Prinsip transparansi tidak boleh mengorbankan privasi dan kehormatan anak. Kami tidak mempublikasikan identitas sensitif seperti alamat rinci atau wajah anak dalam kondisi tertekan.",
    practice:
      "Penyampaian laporan publik tetap memenuhi standar Child Safeguarding Policy dan etika kemanusiaan.",
  },
  {
    title: "Saluran Konfirmasi & Pengaduan Terbuka",
    description:
      "Donatur dan publik berhak mengajukan pertanyaan, klarifikasi rincian penyaluran, maupun masukan konstruktif atas program yang dijalankan.",
    practice:
      "Sekretariat melayani korespondensi konfirmasi via WhatsApp resmi dan surat elektronik.",
  },
];

export const transparencyRoadmap: TransparencyRoadmap[] = [
  {
    phase: "Fase 1 (Saat Ini)",
    timeline: "Tahap Rintisan & Konsolidasi Lapangan",
    status: "active",
    statusLabel: "Sedang Dijalankan",
    title: "Pencatatan Berbasis Kegiatan & Verifikasi Lapangan",
    description:
      "Fokus pada dokumentasi faktual per aksi penyaluran: bukti transaksi belanja lokal, berita acara serah terima, dan laporan visual kegiatan yang transparan kepada para donatur per kegiatan.",
    deliverables: [
      "Pencatatan nota riil setiap pengeluaran logistik",
      "Berita acara serah terima bersama wali asuh penerima",
      "Publikasi rekapitulasi penyaluran per sesi kegiatan di web resmi",
    ],
  },
  {
    phase: "Fase 2 (Berikutnya)",
    timeline: "Pasca Penyelesaian Administrasi Kelembagaan",
    status: "next",
    statusLabel: "Agenda Mendatang",
    title: "Publikasi Laporan Keuangan Berkala Terbuka (PDF)",
    description:
      "Penyusunan format laporan berkala yang dapat diunduh bebas oleh publik, memuat ringkasan penerimaan donasi, alokasi per pilar program, dan efisiensi biaya operasional penyaluran.",
    deliverables: [
      "Penerbitan rekapitulasi kas masuk & keluar kuartalan",
      "Dokumen PDF publik yang memuat rincian alokasi program",
      "Sistem verifikasi kode donasi unik untuk kemudahan konfirmasi donatur",
    ],
  },
  {
    phase: "Fase 3 (Jangka Menengah)",
    timeline: "Setelah Genap Satu Tahun Buku Kelembagaan",
    status: "planned",
    statusLabel: "Rencana Jangka Panjang",
    title: "Audit Keuangan & Tata Kelola Independen",
    description:
      "Sebagai komitmen puncak akuntabilitas, pembukuan lembaga akan diajukan untuk ditinjau oleh pihak akuntan publik / auditor independen guna memastikan kepatuhan standar akuntansi nirlaba.",
    deliverables: [
      "Penelaahan pembukuan tahunan",
      "Penerbitan opini laporan keuangan nirlaba resmi",
      "Laporan tahunan terintegrasi (Annual Impact & Accountability Report)",
    ],
  },
];

export const antiFraudGuidelines = [
  {
    step: "1",
    title: "Cek Keaslian Nama Rekening",
    desc: "Pastikan rekening tujuan transfer hanya atas nama resmi kelembagaan Sedekah for Yatim Papua, bukan atas nama rekening pribadi pengurus.",
  },
  {
    step: "2",
    title: "Hubungi Kanal Resmi Sebelum Mentransfer",
    desc: "Bila Anda ragu terhadap pesan, pamflet, atau tautan yang mengatasnamakan SFY Papua, konfirmasikan terlebih dahulu ke nomor WhatsApp resmi di +62 821-9800-4411.",
  },
  {
    step: "3",
    title: "Waspada Penipuan Mengatasnamakan Bantuan",
    desc: "Kami tidak pernah memungut biaya pendaftaran bantuan kepada penerima manfaat dan tidak pernah meminta imbalan apa pun.",
  },
];
