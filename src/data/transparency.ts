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
    title: "Pemisahan Rekening Khusus Sedekah Yatim",
    description:
      "Dana amanah sedekah dari para dermawan dikelola secara terpisah sepenuhnya dari rekening pribadi relawan. Setiap rupiah aliran kas masuk dan keluar dicatat secara seksama dan diawasi bersama.",
    practice:
      "Menggunakan rekening bank kelembagaan resmi dengan rekonsiliasi berkala oleh bendahara amanah.",
  },
  {
    title: "Verifikasi Berbasis Bukti Lapangan",
    description:
      "Setiap pengeluaran belanja paket pangan halal dan perlengkapan sekolah anak yatim wajib disertai nota pembelian riil, dokumentasi santun, serta tanda terima tertulis dari pengasuh/wali asuh.",
    practice:
      "Arsip digital faktur dan foto dokumentasi disimpan tersentralisasi untuk verifikasi silang internal.",
  },
  {
    title: "Publikasi Rekapitulasi Terbuka",
    description:
      "Laporan ringkas penyaluran dan pemanfaatan donasi dipublikasikan secara berkala agar para donatur dan masyarakat luas dapat meninjau realisasi manfaat bagi anak-anak yatim.",
    practice:
      "Rekapitulasi berkala diterbitkan melalui halaman resmi ini dan kanal komunikasi resmi lembaga.",
  },
  {
    title: "Perlindungan Martabat Anak Asuh",
    description:
      "Prinsip transparansi tidak boleh mengorbankan privasi dan kehormatan anak yatim. Kami tidak mempublikasikan identitas sensitif seperti alamat rinci atau visual anak dalam kondisi tertekan.",
    practice:
      "Penyampaian laporan publik mematuhi etika Islam dalam memuliakan anak yatim serta standar Child Safeguarding Policy.",
  },
  {
    title: "Saluran Konfirmasi & Pengaduan Terbuka",
    description:
      "Donatur dan publik berhak mengajukan pertanyaan, klarifikasi rincian penyaluran, maupun masukan konstruktif atas program pembinaan anak yatim yang dijalankan.",
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
      "Fokus pada dokumentasi faktual per aksi penyaluran: bukti transaksi belanja lokal, berita acara serah terima bersama asrama/keluarga binaan yatim, dan laporan visual kegiatan yang transparan kepada para donatur.",
    deliverables: [
      "Pencatatan nota riil setiap pengeluaran logistik dan bantuan",
      "Berita acara serah terima bersama wali asuh / panti yatim penerima",
      "Publikasi rekapitulasi penyaluran per sesi aksi di web resmi",
    ],
  },
  {
    phase: "Fase 2 (Berikutnya)",
    timeline: "Pasca Penyelesaian Administrasi Kelembagaan",
    status: "next",
    statusLabel: "Agenda Mendatang",
    title: "Publikasi Laporan Keuangan Berkala Terbuka (PDF)",
    description:
      "Penyusunan format laporan berkala yang dapat diunduh bebas oleh donatur dan publik, memuat ringkasan penerimaan sedekah, alokasi per pilar program anak yatim, dan efisiensi penyaluran.",
    deliverables: [
      "Penerbitan rekapitulasi kas masuk & keluar kuartalan",
      "Dokumen PDF publik yang memuat rincian alokasi program yatim",
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
      "Sebagai komitmen puncak akuntabilitas amanah umat, pembukuan lembaga akan diajukan untuk ditinjau oleh pihak akuntan publik / auditor independen guna memastikan kepatuhan standar akuntansi nirlaba.",
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
    desc: "Pastikan rekening tujuan transfer hanya atas nama resmi kelembagaan Sedekah for Yatim Papua, bukan atas nama rekening pribadi perorangan.",
  },
  {
    step: "2",
    title: "Hubungi Kanal Resmi Sebelum Mentransfer",
    desc: "Bila Anda ragu terhadap pesan, pamflet, atau tautan yang mengatasnamakan SFY Papua, konfirmasikan terlebih dahulu ke nomor WhatsApp resmi di +62 821-9800-4411.",
  },
  {
    step: "3",
    title: "Waspada Pungutan Mengatasnamakan Bantuan",
    desc: "Kami tidak pernah memungut biaya pendaftaran bantuan kepada anak-anak yatim maupun keluarga asuh penerima manfaat.",
  },
];
