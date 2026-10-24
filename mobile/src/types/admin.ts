export interface OrphanRecord {
  id: string;
  namaLengkap: string;
  namaPanggilan: string;
  gender: "L" | "P";
  usia: number;
  status: "Yatim" | "Piatu" | "Yatim Piatu";
  asalDaerah: string;
  kabupaten: string;
  kampung?: string;
  pjAvId?: string;
  pjAvNama?: string;
  tempatTinggal: string;
  wali: string;
  pekerjaanWali?: string;
  noHpWali?: string;
  jenjangPendidikan: string;
  namaSekolah?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  hobi?: string;
  citaCita?: string;
  kebutuhanMendesak: string;
  statusVerifikasi: "Terverifikasi" | "Menunggu Survei" | "Perlu Pembaruan";
  tanggalMasuk: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface AVRecord {
  id: string;
  nama: string;
  noHp: string;
  kampung: string;
  distrik: string;
  kabupaten: string;
  alamat: string;
  anakDampingan: string[];
  status: "Aktif" | "Non-aktif" | "Menunggu Verifikasi";
  tanggalBergabung: string;
  catatanWilayah?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface DistrikRecord {
  id: string;
  nama: string;
  kabupaten: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface KampungRecord {
  id: string;
  nama: string;
  distrikId: string;
  distrikNama: string;
  kabupaten: string;
  catatan?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface UserAccount {
  id: string;
  nama: string;
  email: string;
  roleId: string;
  status: "Aktif" | "Non-aktif";
  terakhirLogin: string;
  wilayahTugas: string;
}

export interface AuthSession {
  user: UserAccount;
  roleName: string;
  token: string;
}

export interface SyncQueueItem {
  opId: string;
  timestamp: number;
  entity: "orphan" | "av" | "distrik" | "kampung";
  action: "create" | "update" | "soft_delete" | "restore" | "delete";
  recordId: string;
  payload?: Record<string, unknown>;
}

export const initialDistriks: DistrikRecord[] = [
  { id: "DST-001", nama: "Distrik Merauke", kabupaten: "Kab. Merauke" },
  { id: "DST-002", nama: "Distrik Semangga", kabupaten: "Kab. Merauke" },
  { id: "DST-003", nama: "Distrik Kurik", kabupaten: "Kab. Merauke" },
  { id: "DST-004", nama: "Distrik Tanah Miring", kabupaten: "Kab. Merauke" },
  { id: "DST-005", nama: "Distrik Malind", kabupaten: "Kab. Merauke" },
  { id: "DST-006", nama: "Distrik Sota", kabupaten: "Kab. Merauke" },
  { id: "DST-007", nama: "Distrik Naukenjerai", kabupaten: "Kab. Merauke" },
  { id: "DST-008", nama: "Distrik Jagebob", kabupaten: "Kab. Merauke" },
  { id: "DST-009", nama: "Distrik Animha", kabupaten: "Kab. Merauke" },
  { id: "DST-010", nama: "Distrik Okaba", kabupaten: "Kab. Merauke" },
  { id: "DST-011", nama: "Distrik Muting", kabupaten: "Kab. Merauke" },
  { id: "DST-012", nama: "Distrik Tanah Merah", kabupaten: "Kab. Boven Digoel" },
  { id: "DST-013", nama: "Distrik Mandobo", kabupaten: "Kab. Boven Digoel" },
  { id: "DST-014", nama: "Distrik Obaa", kabupaten: "Kab. Mappi" },
  { id: "DST-015", nama: "Distrik Agats", kabupaten: "Kab. Asmat" },
];

export const initialKampungs: KampungRecord[] = [
  {
    id: "KMP-001",
    nama: "Kampung Wasur",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Kawasan Taman Nasional Wasur, basis binaan anak yatim dan posko AV Yohanes Gebze.",
  },
  {
    id: "KMP-002",
    nama: "Kampung Nasem",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Wilayah pesisir selatan Merauke.",
  },
  {
    id: "KMP-004",
    nama: "Kelurahan Maro",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Pusat kota Merauke dekat Sungai Maro.",
  },
  {
    id: "KMP-005",
    nama: "Kelurahan Mandala",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Kawasan padat penduduk, lokasi sekretariat relawan SFY Papua.",
  },
  {
    id: "KMP-008",
    nama: "Kampung Urumb",
    distrikId: "DST-002",
    distrikNama: "Distrik Semangga",
    kabupaten: "Kab. Merauke",
    catatan: "Kawasan transmigrasi pesisir, posko dampingan AV Petrus Mahuze.",
  },
  {
    id: "KMP-009",
    nama: "Kampung Wendu",
    distrikId: "DST-002",
    distrikNama: "Distrik Semangga",
    kabupaten: "Kab. Merauke",
    catatan: "Sentra perkebunan & pesisir, posko AV Markus Samkakai.",
  },
  {
    id: "KMP-012",
    nama: "Kampung Kumbe",
    distrikId: "DST-003",
    distrikNama: "Distrik Kurik",
    kabupaten: "Kab. Merauke",
    catatan: "Pusat persimpangan Kurik-Malind, posko AV Elisabeth Kaize.",
  },
  {
    id: "KMP-020",
    nama: "Kampung Sota",
    distrikId: "DST-006",
    distrikNama: "Distrik Sota",
    kabupaten: "Kab. Merauke",
    catatan: "Kawasan perbatasan RI - Papua Nugini (PNG).",
  },
  {
    id: "KMP-023",
    nama: "Kampung Tanah Merah",
    distrikId: "DST-012",
    distrikNama: "Distrik Tanah Merah",
    kabupaten: "Kab. Boven Digoel",
    catatan: "Pusat kabupaten Boven Digoel di hulu Sungai Digoel.",
  },
];

export const initialAVs: AVRecord[] = [
  {
    id: "AV-001",
    nama: "Yohanes Gebze",
    noHp: "0812-4890-1234",
    kampung: "Kampung Wasur",
    distrik: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    alamat: "Jl. Poros Trans Irian, RT 02 / RW 01, Kampung Wasur",
    anakDampingan: ["Muhammad Fikri Gebze", "Nur Khadijah Samkakai"],
    status: "Aktif",
    tanggalBergabung: "10 Januari 2023",
    catatanWilayah: "Koordinator posko dampingan anak yatim dan penyaluran sembako di kawasan Wasur.",
  },
  {
    id: "AV-002",
    nama: "Petrus Mahuze",
    noHp: "0821-9765-4321",
    kampung: "Kampung Urumb",
    distrik: "Distrik Semangga",
    kabupaten: "Kab. Merauke",
    alamat: "Jalur 4 Barat, RT 05, Kampung Urumb",
    anakDampingan: ["Aisyah Maryam Mahuze", "Daud Yusuf Mahuze"],
    status: "Aktif",
    tanggalBergabung: "14 Februari 2023",
    catatanWilayah: "Mendampingi anak-anak santri di kawasan pesisir Semangga dan pendataan sekolah.",
  },
  {
    id: "AV-003",
    nama: "Elisabeth Kaize",
    noHp: "0813-4411-9988",
    kampung: "Kampung Kumbe",
    distrik: "Distrik Malind",
    kabupaten: "Kab. Merauke",
    alamat: "Dekat Dermaga Kumbe, RT 01, Kampung Kumbe",
    anakDampingan: ["Rizky Bilal Kaize", "Zulfa Safira Gebze"],
    status: "Aktif",
    tanggalBergabung: "05 Mei 2023",
    catatanWilayah: "Pusat informasi anak yatim dhuafa dan penyambung komunikasi relawan di Distrik Malind.",
  },
  {
    id: "AV-004",
    nama: "Markus Samkakai",
    noHp: "0852-5400-3321",
    kampung: "Kampung Wendu",
    distrik: "Distrik Semangga",
    kabupaten: "Kab. Merauke",
    alamat: "Jl. Pantai Wendu, RT 03, Kampung Wendu",
    anakDampingan: ["Fatimah Zahra Ndiken"],
    status: "Aktif",
    tanggalBergabung: "20 Agustus 2023",
    catatanWilayah: "Koordinator lapangan kegiatan bimbingan belajar dan gizi anak di Wendu.",
  },
  {
    id: "AV-005",
    nama: "Theresia Balagaize",
    noHp: "0822-3810-7766",
    kampung: "Kampung Sota",
    distrik: "Distrik Sota",
    kabupaten: "Kab. Merauke",
    alamat: "Kawasan Perbatasan RI-PNG, RT 01, Kampung Sota",
    anakDampingan: [],
    status: "Aktif",
    tanggalBergabung: "12 November 2023",
    catatanWilayah: "Penanggung jawab koordinasi anak yatim muslim di wilayah perbatasan Sota.",
  },
  {
    id: "AV-006",
    nama: "Dominggus Ndiken",
    noHp: "0812-4099-8877",
    kampung: "Kampung Nasem",
    distrik: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    alamat: "Jalur Pesisir Nasem, RT 02, Kampung Nasem",
    anakDampingan: [],
    status: "Menunggu Verifikasi",
    tanggalBergabung: "10 Januari 2025",
    catatanWilayah: "Calon koordinator kampung baru untuk wilayah pesisir Distrik Merauke.",
  },
];

export const initialOrphans: OrphanRecord[] = [
  {
    id: "YTM-001",
    namaLengkap: "Muhammad Fikri Gebze",
    namaPanggilan: "Fikri",
    gender: "L",
    usia: 11,
    status: "Yatim",
    asalDaerah: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    kampung: "Kampung Wasur",
    pjAvId: "AV-001",
    pjAvNama: "Yohanes Gebze",
    tempatTinggal: "Asrama SFY Merauke",
    wali: "Ustadz Harun (Pengasuh Asrama)",
    jenjangPendidikan: "SD Kelas 5 MI Al-Ma'arif Merauke",
    kebutuhanMendesak: "Sepatu Sekolah & Kitab Iqro",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "12 Januari 2024",
  },
  {
    id: "YTM-002",
    namaLengkap: "Aisyah Maryam Mahuze",
    namaPanggilan: "Aisyah",
    gender: "P",
    usia: 9,
    status: "Yatim Piatu",
    asalDaerah: "Distrik Tanah Miring",
    kabupaten: "Kab. Merauke",
    kampung: "Kampung Urumb",
    pjAvId: "AV-002",
    pjAvNama: "Petrus Mahuze",
    tempatTinggal: "Keluarga Asuh Mama Fatima",
    wali: "Fatima Mahuze (Bibi)",
    jenjangPendidikan: "SD Kelas 3 SD Inpres Tanah Miring",
    kebutuhanMendesak: "Seragam & Tambahan Gizi Susu",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "04 Maret 2024",
  },
  {
    id: "YTM-003",
    namaLengkap: "Rizky Bilal Kaize",
    namaPanggilan: "Bilal",
    gender: "L",
    usia: 14,
    status: "Yatim",
    asalDaerah: "Distrik Kurik",
    kabupaten: "Kab. Merauke",
    kampung: "Kampung Kumbe",
    pjAvId: "AV-003",
    pjAvNama: "Elisabeth Kaize",
    tempatTinggal: "Pesantren Hidayatullah Kurik",
    wali: "Keluarga Asuh Kurik",
    jenjangPendidikan: "MTs Kelas 2 Kurik Merauke",
    kebutuhanMendesak: "Buku Pelajaran & SPP Madrasah",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "18 Mei 2023",
  },
  {
    id: "YTM-004",
    namaLengkap: "Fatimah Zahra Ndiken",
    namaPanggilan: "Zahra",
    gender: "P",
    usia: 7,
    status: "Yatim",
    asalDaerah: "Distrik Semangga",
    kabupaten: "Kab. Merauke",
    kampung: "Kampung Wendu",
    pjAvId: "AV-004",
    pjAvNama: "Markus Samkakai",
    tempatTinggal: "Keluarga Asuh Semangga",
    wali: "Siti Aminah (Ibu)",
    jenjangPendidikan: "SD Kelas 1 MI Semangga",
    kebutuhanMendesak: "Tas Sekolah & Alat Tulis",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "01 September 2024",
  },
  {
    id: "YTM-005",
    namaLengkap: "Ibrahim Samuel Basik-Basik",
    namaPanggilan: "Baim",
    gender: "L",
    usia: 13,
    status: "Piatu",
    asalDaerah: "Distrik Tanah Merah",
    kabupaten: "Kab. Boven Digoel",
    kampung: "Kampung Tanah Merah",
    pjAvId: "AV-001",
    pjAvNama: "Yohanes Gebze",
    tempatTinggal: "Keluarga Asuh Tanah Merah",
    wali: "Yahya Basik-Basik (Ayah)",
    jenjangPendidikan: "SMP Kelas 1 SMP Negeri Tanah Merah",
    kebutuhanMendesak: "Bantuan Kacamata Minus & Sepatu",
    statusVerifikasi: "Menunggu Survei",
    tanggalMasuk: "15 Oktober 2024",
  },
  {
    id: "YTM-006",
    namaLengkap: "Nur Khadijah Samkakai",
    namaPanggilan: "Khadijah",
    gender: "P",
    usia: 12,
    status: "Yatim Piatu",
    asalDaerah: "Distrik Kepi",
    kabupaten: "Kab. Mappi",
    kampung: "Kampung Wasur",
    pjAvId: "AV-001",
    pjAvNama: "Yohanes Gebze",
    tempatTinggal: "Asrama SFY Merauke",
    wali: "Ustadzah Halimah (Pendamping)",
    jenjangPendidikan: "SD Kelas 6 SD Yapis Merauke",
    kebutuhanMendesak: "Persiapan Masuk MTs & Gizi",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "20 November 2023",
  },
  {
    id: "YTM-007",
    namaLengkap: "Ahmad Dani Balagaize",
    namaPanggilan: "Dani",
    gender: "L",
    usia: 8,
    status: "Yatim",
    asalDaerah: "Distrik Agats",
    kabupaten: "Kab. Asmat",
    kampung: "Kampung Agats",
    pjAvId: "AV-005",
    pjAvNama: "Theresia Balagaize",
    tempatTinggal: "Keluarga Asuh Agats",
    wali: "Maimunah (Nenek)",
    jenjangPendidikan: "SD Kelas 2 MI Agats",
    kebutuhanMendesak: "Paket Sembako Keluarga & Buku",
    statusVerifikasi: "Perlu Pembaruan",
    tanggalMasuk: "08 Februari 2024",
  },
  {
    id: "YTM-008",
    namaLengkap: "Zulfa Safira Gebze",
    namaPanggilan: "Zulfa",
    gender: "P",
    usia: 10,
    status: "Yatim",
    asalDaerah: "Distrik Jagebob",
    kabupaten: "Kab. Merauke",
    kampung: "Kampung Kumbe",
    pjAvId: "AV-003",
    pjAvNama: "Elisabeth Kaize",
    tempatTinggal: "Keluarga Asuh Jagebob",
    wali: "Khadijah Gebze (Ibu)",
    jenjangPendidikan: "SD Kelas 4 SD Negeri Jagebob",
    kebutuhanMendesak: "Pakaian Seragam & Sepatu",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "10 Desember 2024",
  },
  {
    id: "YTM-009",
    namaLengkap: "Daud Yusuf Mahuze",
    namaPanggilan: "Daud",
    gender: "L",
    usia: 15,
    status: "Yatim",
    asalDaerah: "Distrik Semangga",
    kabupaten: "Kab. Merauke",
    kampung: "Kampung Urumb",
    pjAvId: "AV-002",
    pjAvNama: "Petrus Mahuze",
    tempatTinggal: "Keluarga Asuh Urumb",
    wali: "Yakob Mahuze (Paman)",
    jenjangPendidikan: "SMK Kelas 1 Merauke",
    kebutuhanMendesak: "Pelatihan Keterampilan Mandiri & Alat Praktek",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "14 Januari 2023",
  },
];

