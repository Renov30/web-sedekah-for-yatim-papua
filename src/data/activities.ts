export interface ActivityItem {
  id: string;
  title: string;
  date: string;
  location: string;
  district: string;
  category: "Pendidikan" | "Kebutuhan Dasar" | "Pendampingan" | "Pelatihan Relawan";
  summary: string;
  details: string;
  image: string;
  imageAlt: string;
  isEditorialPlaceholder: boolean;
  statusNote: string;
  tags: string[];
}

export const activities: ActivityItem[] = [
  {
    id: "act-01",
    title: "Penyaluran Paket Perlengkapan Sekolah Awal Semester",
    date: "Awal Semester Ganjil 2024",
    location: "Distrik Sentani, Kabupaten Jayapura",
    district: "Sentani",
    category: "Pendidikan",
    summary:
      "Distribusi tas sekolah, buku tulis bergaris, kotak pensil, dan perlengkapan ajar bagi 35 anak yatim dan keluarga asuh dhuafa.",
    details:
      "Kegiatan dilaksanakan di aula serbaguna komunitas dengan mengundang orang tua/wali asuh anak. Setiap paket disesuaikan dengan jenjang kelas penerima manfaat (tingkat SD dan SMP) untuk menjamin ketepatan fungsi.",
    image: "/images/activity-books.jpg",
    imageAlt: "Tumpukan buku dan paket alat tulis yang siap diserahkan kepada penerima manfaat",
    isEditorialPlaceholder: false,
    statusNote: "Dokumentasi Riil Aksi Relawan",
    tags: ["Perlengkapan Sekolah", "Sentani", "Pendidikan"],
  },
  {
    id: "act-02",
    title: "Kelas Literasi Akhir Pekan & Cerita Nusantara",
    date: "Sabtu Pekan Berjalan",
    location: "Posko Komunitas Abepura, Kota Jayapura",
    district: "Abepura",
    category: "Pendampingan",
    summary:
      "Sesi membaca terbimbing dan permainan mengasah imajinasi bersama 20 anak asuh, didampingi 6 orang kakak relawan pengajar.",
    details:
      "Fokus pertemuan kali ini adalah meningkatkan minat baca melalui buku cerita bergambar bertema kearifan lokal Papua dan flora fauna endemik, dilanjutkan dengan mewarnai dan refleksi nilai budi pekerti.",
    image: "/images/activity-mentoring.jpg",
    imageAlt: "Kegiatan belajar dan membaca buku bersama kakak relawan dengan suasana santai",
    isEditorialPlaceholder: false,
    statusNote: "Dokumentasi Riil Aksi Relawan",
    tags: ["Literasi", "Abepura", "Pendampingan"],
  },
  {
    id: "act-03",
    title: "Penyaluran Sembako & Suplemen Gizi Keluarga Asuh",
    date: "Penyaluran Rutin Bulanan",
    location: "Koya Barat & Koya Timur, Distrik Muara Tami",
    district: "Muara Tami",
    category: "Kebutuhan Dasar",
    summary:
      "Pengantaran langsung paket beras, telur, kacang hijau, minyak goreng, dan vitamin untuk membantu ketahanan pangan keluarga yatim.",
    details:
      "Relawan menggunakan kendaraan roda dua dan pick-up lokal untuk menjangkau titik-titik permukiman keluarga asuh yang berjarak cukup jauh dari pusat kota. Setiap penyerahan disertai pencatatan kondisi kesehatan anak.",
    image: "/images/program-basic-needs.jpg",
    imageAlt: "Distribusi bahan pangan kebutuhan pokok bagi keluarga asuh",
    isEditorialPlaceholder: false,
    statusNote: "Dokumentasi Riil Aksi Relawan",
    tags: ["Nutrisi", "Muara Tami", "Kebutuhan Pokok"],
  },
  {
    id: "act-04",
    title: "Orientasi & Pembekalan Etika Kerelawanan Ramah Anak",
    date: "Tahap Persiapan Angkatan 2024",
    location: "Jayapura Selatan, Kota Jayapura",
    district: "Jayapura Selatan",
    category: "Pelatihan Relawan",
    summary:
      "Sesi tatap muka pembekalan prinsip keselamatan anak (Child Safeguarding), kode etik relawan, serta tata kelola dokumentasi yang menghormati martabat.",
    details:
      "Sebanyak 18 calon relawan baru mendiskusikan studi kasus interaksi dengan anak, batasan privasi penerima bantuan, dan pentingnya menjaga transparansi laporan pertanggungjawaban.",
    image: "/images/about-story.jpg",
    imageAlt: "Sesi diskusi dan pembekalan materi relawan kemanusiaan",
    isEditorialPlaceholder: false,
    statusNote: "Dokumentasi Riil Aksi Relawan",
    tags: ["Pelatihan", "Etika Relawan", "Child Safeguarding"],
  },
  {
    id: "act-05",
    title: "Pemeriksaan Kesehatan Dasar & Kebersihan Gigi Anak",
    date: "Jadwal Rencana Aksi Mendatang",
    location: "Distrik Nimboran, Kabupaten Jayapura",
    district: "Nimboran",
    category: "Kebutuhan Dasar",
    summary:
      "Pemeriksaan kesehatan umum sederhana, pembagian sikat & pasta gigi, serta edukasi cuci tangan pakai sabun bersama relawan medis.",
    details:
      "Catatan editorial: Konten ini merupakan rencana agenda lapangan yang disiapkan untuk tahap aksi kolaborasi berikutnya. Tanggal pelaksanaan pasti dan dokumentasi foto akan diperbarui segera setelah kegiatan terselenggara.",
    image: "/images/activity-health.jpg",
    imageAlt: "Rencana edukasi kesehatan dan kebersihan diri anak",
    isEditorialPlaceholder: true,
    statusNote: "Rencana Agenda Lapangan (Placeholder Editorial Terbuka)",
    tags: ["Kesehatan Preventif", "Nimboran", "Rencana Aksi"],
  },
  {
    id: "act-06",
    title: "Workshop Kreativitas Seni & Kerajinan Tangan Lokal",
    date: "Jadwal Rencana Aksi Mendatang",
    location: "Kampung Yoka, Distrik Heram",
    district: "Heram",
    category: "Pendampingan",
    summary:
      "Ruang kreasi seni membuat kerajinan dari bahan alam dan kertas daur ulang untuk mengasah motorik halus dan rasa percaya diri anak-anak binaan.",
    details:
      "Catatan editorial: Konten ini merupakan template kegiatan komunitas yang akan diisi dengan dokumentasi riil pasca implementasi lapangan bersama para pengrajin lokal.",
    image: "/images/activity-craft.jpg",
    imageAlt: "Ruang kegiatan seni dan kerajinan tangan anak-anak",
    isEditorialPlaceholder: true,
    statusNote: "Rencana Agenda Lapangan (Placeholder Editorial Terbuka)",
    tags: ["Kreativitas", "Heram", "Rencana Aksi"],
  },
];

