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
    title: "Penyaluran Paket Perlengkapan Sekolah & Kit Belajar Santri Yatim",
    date: "Awal Semester Ganjil 2024",
    location: "Distrik Sentani, Kabupaten Jayapura",
    district: "Sentani",
    category: "Pendidikan",
    summary:
      "Distribusi tas sekolah, buku tulis, mushaf Al-Qur'an, dan perlengkapan belajar bagi 35 anak asuh yatim dan santri dhuafa.",
    details:
      "Kegiatan dilaksanakan di asrama binaan Sentani dengan dihadiri para pengasuh dan wali anak asuh. Setiap paket disesuaikan dengan kebutuhan jenjang sekolah dasar dan menengah guna menjamin kelancaran belajar di madrasah dan sekolah formal.",
    image: "/images/activity-books.jpg",
    imageAlt: "Tumpukan paket perlengkapan sekolah dan buku yang siap diserahkan kepada anak-anak yatim",
    isEditorialPlaceholder: false,
    statusNote: "Dokumentasi Riil Aksi Relawan",
    tags: ["Perlengkapan Sekolah", "Santri Yatim", "Sentani"],
  },
  {
    id: "act-02",
    title: "Kelas Literasi Akhir Pekan, Kisah Teladan, & Bimbingan Mengaji",
    date: "Sabtu Pekan Berjalan",
    location: "Posko Bina Anak Asuh Abepura, Kota Jayapura",
    district: "Abepura",
    category: "Pendampingan",
    summary:
      "Sesi membaca gembira, tahsin Al-Qur'an ringan, dan mendengarkan kisah teladan Nabi bersama 20 anak asuh binaan, didampingi 6 kakak relawan.",
    details:
      "Pertemuan rutin ini memadukan bimbingan membaca Al-Qur'an dengan pengenalan kisah-kisah penuh hikmah, dilanjutkan dengan mewarnai dan sesi interaktif mengasah kepercayaan diri anak.",
    image: "/images/activity-mentoring.jpg",
    imageAlt: "Kegiatan bimbingan belajar dan mengaji santai bersama kakak relawan dengan suasana hangat",
    isEditorialPlaceholder: false,
    statusNote: "Dokumentasi Riil Aksi Relawan",
    tags: ["Literasi Quran", "Bina Karakter", "Abepura"],
  },
  {
    id: "act-03",
    title: "Penyaluran Paket Sembako Halal & Pangan Gizi Keluarga Yatim",
    date: "Penyaluran Rutin Bulanan",
    location: "Koya Barat & Koya Timur, Distrik Muara Tami",
    district: "Muara Tami",
    category: "Kebutuhan Dasar",
    summary:
      "Pengantaran langsung paket beras premium, minyak goreng, telur, susu, dan bahan pokok untuk pemenuhan gizi keluarga janda/ibu tunggal perawat anak yatim.",
    details:
      "Relawan menyambangi langsung rumah-rumah keluarga binaan di wilayah Koya untuk memastikan ketersediaan pangan bergizi dan halal. Setiap penyerahan disertai pencatatan kondisi kesehatan anak dan keluarga.",
    image: "/images/program-basic-needs.jpg",
    imageAlt: "Distribusi bahan pangan kebutuhan pokok halal bagi keluarga asuh anak yatim",
    isEditorialPlaceholder: false,
    statusNote: "Dokumentasi Riil Aksi Relawan",
    tags: ["Sembako Halal", "Gizi Yatim", "Muara Tami"],
  },
  {
    id: "act-04",
    title: "Orientasi Relawan & Pembekalan Etika Khidmah Memuliakan Anak Yatim",
    date: "Tahap Persiapan Angkatan 2024",
    location: "Jayapura Selatan, Kota Jayapura",
    district: "Jayapura Selatan",
    category: "Pelatihan Relawan",
    summary:
      "Sesi tatap muka pembekalan adab berinteraksi dengan anak yatim, prinsip Child Safeguarding, dan etika dokumentasi yang menjaga kehormatan penerima manfaat.",
    details:
      "Sebanyak 18 relawan baru mendiskusikan nilai keikhlasan, larangan eksploitasi kemiskinan anak untuk konten media sosial pribadi, serta pentingnya menjaga integritas amanah donatur umat.",
    image: "/images/about-story.jpg",
    imageAlt: "Sesi diskusi dan pembekalan materi relawan kemanusiaan peduli yatim",
    isEditorialPlaceholder: false,
    statusNote: "Dokumentasi Riil Aksi Relawan",
    tags: ["Pelatihan", "Adab & Etika", "Child Safeguarding"],
  },
  {
    id: "act-05",
    title: "Pemeriksaan Kesehatan Anak Asuh & Santri Yatim",
    date: "Jadwal Rencana Aksi Mendatang",
    location: "Distrik Nimboran, Kabupaten Jayapura",
    district: "Nimboran",
    category: "Kebutuhan Dasar",
    summary:
      "Pemeriksaan kesehatan dasar, pengecekan kebersihan gigi dan telinga, serta pembagian multivitamin halal bersama relawan tenaga medis.",
    details:
      "Catatan editorial: Konten ini merupakan rencana agenda lapangan yang disiapkan untuk tahap aksi kolaborasi berikutnya. Tanggal pelaksanaan pasti dan dokumentasi foto akan diperbarui segera setelah kegiatan terselenggara.",
    image: "/images/activity-health.jpg",
    imageAlt: "Rencana edukasi kesehatan dan kebersihan diri anak yatim",
    isEditorialPlaceholder: true,
    statusNote: "Rencana Agenda Lapangan (Placeholder Editorial Terbuka)",
    tags: ["Kesehatan Santri", "Nimboran", "Agenda Mendatang"],
  },
];
