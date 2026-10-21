export interface OrphanRecord {
  id: string;
  namaLengkap: string;
  namaPanggilan: string;
  gender: "L" | "P";
  usia: number;
  status: "Yatim" | "Piatu" | "Yatim Piatu";
  asalDaerah: string;
  kabupaten: string;
  tempatTinggal: string;
  wali: string;
  jenjangPendidikan: string;
  kebutuhanMendesak: string;
  statusVerifikasi: "Terverifikasi" | "Menunggu Survei" | "Perlu Pembaruan";
  tanggalMasuk: string;
}

export interface VolunteerRecord {
  id: string;
  namaLengkap: string;
  email: string;
  noTelepon: string;
  domisili: string;
  divisi: "Pendidikan & Bimbel" | "Distribusi & Logistik" | "Kesehatan & Gizi" | "Media & Publikasi";
  keahlian: string;
  status: "Aktif" | "Menunggu Verifikasi" | "Cuti";
  tanggalGabung: string;
}

export interface DonorRecord {
  id: string;
  nama: string;
  tipe: "Individu" | "Lembaga/Komunitas" | "Hamba Allah";
  email: string;
  noTelepon: string;
  totalDonasi: number;
  jumlahFrekuensi: number;
  programFavorit: string;
  status: "Donatur Rutin" | "Donatur Insidental";
  tanggalTerakhir: string;
}

export interface FinanceTransaction {
  id: string;
  noRef: string;
  tanggal: string;
  jenis: "Pemasukan" | "Pengeluaran";
  kategori: string;
  jumlah: number;
  keterangan: string;
  metode: string;
  status: "Terverifikasi" | "Review";
  petugas: string;
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

export interface RoleDefinition {
  id: string;
  nama: string;
  badgeColor: string;
  deskripsi: string;
  userCount: number;
}

export interface ModulePermission {
  moduleId: string;
  moduleName: string;
  description: string;
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}

export interface RolePermissionsMap {
  [roleId: string]: {
    [moduleId: string]: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  };
}

export const initialOrphans: OrphanRecord[] = [
  {
    id: "YTM-001",
    namaLengkap: "Muhammad Fikri Kogoya",
    namaPanggilan: "Fikri",
    gender: "L",
    usia: 11,
    status: "Yatim",
    asalDaerah: "Distrik Sentani",
    kabupaten: "Kab. Jayapura",
    tempatTinggal: "Asrama SFY Sentani",
    wali: "Ustadz Harun (Pengasuh)",
    jenjangPendidikan: "SD Kelas 5 MI Nurul Huda",
    kebutuhanMendesak: "Sepatu Sekolah & Kitab Iqro",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "12 Januari 2024",
  },
  {
    id: "YTM-002",
    namaLengkap: "Aisyah Maryam Wenda",
    namaPanggilan: "Aisyah",
    gender: "P",
    usia: 9,
    status: "Yatim Piatu",
    asalDaerah: "Distrik Arso",
    kabupaten: "Kab. Keerom",
    tempatTinggal: "Keluarga Asuh Mama Fatima",
    wali: "Fatima Wenda (Bibi)",
    jenjangPendidikan: "SD Kelas 3 SD Inpres Arso",
    kebutuhanMendesak: "Seragam & Tambahan Gizi Susu",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "04 Maret 2024",
  },
  {
    id: "YTM-003",
    namaLengkap: "Rizky Bilal Tabuni",
    namaPanggilan: "Bilal",
    gender: "L",
    usia: 14,
    status: "Yatim",
    asalDaerah: "Distrik Abepura",
    kabupaten: "Kota Jayapura",
    tempatTinggal: "Pesantren Hidayatullah Holtekamp",
    wali: "Keluarga Asuh Abepura",
    jenjangPendidikan: "MTs Kelas 2 Holtekamp",
    kebutuhanMendesak: "Buku Pelajaran & SPP Madrasah",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "18 Mei 2023",
  },
  {
    id: "YTM-004",
    namaLengkap: "Fatimah Zahra Al-Papuani",
    namaPanggilan: "Zahra",
    gender: "P",
    usia: 7,
    status: "Yatim",
    asalDaerah: "Distrik Muara Tami",
    kabupaten: "Kota Jayapura",
    tempatTinggal: "Keluarga Asuh Skouw",
    wali: "Siti Aminah (Ibu)",
    jenjangPendidikan: "SD Kelas 1 MI Skouw",
    kebutuhanMendesak: "Tas Sekolah & Alat Tulis",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "01 September 2024",
  },
  {
    id: "YTM-005",
    namaLengkap: "Ibrahim Samuel Yoman",
    namaPanggilan: "Baim",
    gender: "L",
    usia: 13,
    status: "Piatu",
    asalDaerah: "Distrik Biak Kota",
    kabupaten: "Kab. Biak Numfor",
    tempatTinggal: "Keluarga Asuh Biak",
    wali: "Yahya Yoman (Ayah)",
    jenjangPendidikan: "SMP Kelas 1 SMP Negeri Biak",
    kebutuhanMendesak: "Bantuan Kacamata Minus & Sepatu",
    statusVerifikasi: "Menunggu Survei",
    tanggalMasuk: "15 Oktober 2024",
  },
  {
    id: "YTM-006",
    namaLengkap: "Nur Khadijah Asso",
    namaPanggilan: "Khadijah",
    gender: "P",
    usia: 12,
    status: "Yatim Piatu",
    asalDaerah: "Distrik Wamena Kota",
    kabupaten: "Kab. Jayawijaya",
    tempatTinggal: "Asrama SFY Jayapura",
    wali: "Ustadzah Halimah (Pendamping)",
    jenjangPendidikan: "SD Kelas 6 SD Yapis Jayapura",
    kebutuhanMendesak: "Persiapan Masuk MTs & Gizi",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "20 November 2023",
  },
  {
    id: "YTM-007",
    namaLengkap: "Ahmad Dani Wandik",
    namaPanggilan: "Dani",
    gender: "L",
    usia: 8,
    status: "Yatim",
    asalDaerah: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    tempatTinggal: "Keluarga Asuh Merauke",
    wali: "Maimunah (Nenek)",
    jenjangPendidikan: "SD Kelas 2 MI Al-Ma'arif",
    kebutuhanMendesak: "Paket Sembako Keluarga & Buku",
    statusVerifikasi: "Perlu Pembaruan",
    tanggalMasuk: "08 Februari 2024",
  },
  {
    id: "YTM-008",
    namaLengkap: "Zulfa Safira Matuan",
    namaPanggilan: "Zulfa",
    gender: "P",
    usia: 10,
    status: "Yatim",
    asalDaerah: "Distrik Depapre",
    kabupaten: "Kab. Jayapura",
    tempatTinggal: "Keluarga Asuh Depapre",
    wali: "Khadijah Matuan (Ibu)",
    jenjangPendidikan: "SD Kelas 4 SD Negeri Depapre",
    kebutuhanMendesak: "Pakaian Seragam & Sepatu",
    statusVerifikasi: "Terverifikasi",
    tanggalMasuk: "10 Desember 2024",
  },
];

export const initialVolunteers: VolunteerRecord[] = [
  {
    id: "RLW-001",
    namaLengkap: "Ahmad Faisal Sanjaya",
    email: "faisal.s@gmail.com",
    noTelepon: "0812-4829-1102",
    domisili: "Kotaraja, Abepura",
    divisi: "Pendidikan & Bimbel",
    keahlian: "Guru Matematika & Tahsin",
    status: "Aktif",
    tanggalGabung: "15 Januari 2023",
  },
  {
    id: "RLW-002",
    namaLengkap: "Siti Rahmawati Papua",
    email: "rahma.papua@yahoo.com",
    noTelepon: "0821-9876-4321",
    domisili: "Sentani Kota",
    divisi: "Kesehatan & Gizi",
    keahlian: "Perawat & Ahli Gizi Anak",
    status: "Aktif",
    tanggalGabung: "02 Mei 2023",
  },
  {
    id: "RLW-003",
    namaLengkap: "Daud Mansyur Kogoya",
    email: "daud.kogoya@sfypapua.org",
    noTelepon: "0813-5567-8890",
    domisili: "Arso 2, Keerom",
    divisi: "Distribusi & Logistik",
    keahlian: "Pengemudi Lapangan & Distribusi",
    status: "Aktif",
    tanggalGabung: "10 Agustus 2023",
  },
  {
    id: "RLW-004",
    namaLengkap: "Annisa Nabila Sari",
    email: "annisa.nabila@gmail.com",
    noTelepon: "0852-4412-9908",
    domisili: "Jayapura Utara",
    divisi: "Media & Publikasi",
    keahlian: "Desain Grafis & Fotografi",
    status: "Aktif",
    tanggalGabung: "05 November 2023",
  },
  {
    id: "RLW-005",
    namaLengkap: "Hendra Wijaya Maturbongs",
    email: "hendra.maturbongs@gmail.com",
    noTelepon: "0812-3344-5566",
    domisili: "Waena, Heram",
    divisi: "Pendidikan & Bimbel",
    keahlian: "Bimbingan Belajar Bahasa Inggris",
    status: "Menunggu Verifikasi",
    tanggalGabung: "14 Januari 2025",
  },
  {
    id: "RLW-006",
    namaLengkap: "Maryam Latuconsina",
    email: "maryam.latu@outlook.com",
    noTelepon: "0823-7788-9900",
    domisili: "Holtekamp, Muara Tami",
    divisi: "Kesehatan & Gizi",
    keahlian: "Bidan Komunitas & P3K",
    status: "Cuti",
    tanggalGabung: "22 Maret 2023",
  },
];

export const initialDonors: DonorRecord[] = [
  {
    id: "DNR-001",
    nama: "Hamba Allah (Jakarta)",
    tipe: "Hamba Allah",
    email: "rahasia.donatur@sfypapua.org",
    noTelepon: "0811-****-421",
    totalDonasi: 48500000,
    jumlahFrekuensi: 24,
    programFavorit: "Pendidikan Santri Papua",
    status: "Donatur Rutin",
    tanggalTerakhir: "01 Februari 2025",
  },
  {
    id: "DNR-002",
    nama: "dr. Hendro Prasetyo, Sp.A",
    tipe: "Individu",
    email: "hendro.prasetyo@medika.id",
    noTelepon: "0812-9900-1122",
    totalDonasi: 18000000,
    jumlahFrekuensi: 12,
    programFavorit: "Pangan Halal Bergizi",
    status: "Donatur Rutin",
    tanggalTerakhir: "28 Januari 2025",
  },
  {
    id: "DNR-003",
    nama: "Komunitas Muslim Peduli Papua (KMPP) Surabaya",
    tipe: "Lembaga/Komunitas",
    email: "kmpp.surabaya@gmail.com",
    noTelepon: "0813-8899-7711",
    totalDonasi: 65000000,
    jumlahFrekuensi: 8,
    programFavorit: "Paket Pendidikan & Seragam",
    status: "Donatur Rutin",
    tanggalTerakhir: "15 Januari 2025",
  },
  {
    id: "DNR-004",
    nama: "Ibu Hj. Aminah Jayapura",
    tipe: "Individu",
    email: "aminah.jayapura@gmail.com",
    noTelepon: "0852-1234-5678",
    totalDonasi: 9500000,
    jumlahFrekuensi: 6,
    programFavorit: "Pangan Halal Bergizi",
    status: "Donatur Insidental",
    tanggalTerakhir: "10 Januari 2025",
  },
  {
    id: "DNR-005",
    nama: "PT Papua Berkah Sejahtera",
    tipe: "Lembaga/Komunitas",
    email: "csr@papuaberkah.co.id",
    noTelepon: "0967-532100",
    totalDonasi: 35000000,
    jumlahFrekuensi: 3,
    programFavorit: "Pendidikan Santri Papua",
    status: "Donatur Insidental",
    tanggalTerakhir: "20 Desember 2024",
  },
  {
    id: "DNR-006",
    nama: "Keluarga Bapak Rahmatullah",
    tipe: "Individu",
    email: "rahmatullah.kel@gmail.com",
    noTelepon: "0812-7766-5544",
    totalDonasi: 4200000,
    jumlahFrekuensi: 4,
    programFavorit: "Santunan Bulanan Yatim",
    status: "Donatur Rutin",
    tanggalTerakhir: "02 Februari 2025",
  },
];

export const initialFinances: FinanceTransaction[] = [
  {
    id: "TRX-001",
    noRef: "SFY-IN-202502-001",
    tanggal: "02 Feb 2025",
    jenis: "Pemasukan",
    kategori: "Sedekah Rutin",
    jumlah: 5000000,
    keterangan: "Sedekah bulanan via Transfer BSI Donatur Tetap",
    metode: "Bank BSI",
    status: "Terverifikasi",
    petugas: "Ustadzah Wardah (Bendahara)",
  },
  {
    id: "TRX-002",
    noRef: "SFY-OUT-202502-002",
    tanggal: "01 Feb 2025",
    jenis: "Pengeluaran",
    kategori: "Pangan & Nutrisi",
    jumlah: 3200000,
    keterangan: "Pembelian sembako dan susu nutrisi untuk santri asrama Sentani",
    metode: "Tunai / Kas Kecil",
    status: "Terverifikasi",
    petugas: "Daud M. Kogoya (Logistik)",
  },
  {
    id: "TRX-003",
    noRef: "SFY-IN-202501-019",
    tanggal: "28 Jan 2025",
    jenis: "Pemasukan",
    kategori: "Infaq Pendidikan",
    jumlah: 15000000,
    keterangan: "Donasi beasiswa pendidikan dari KMPP Surabaya",
    metode: "Bank Mandiri",
    status: "Terverifikasi",
    petugas: "Ustadzah Wardah (Bendahara)",
  },
  {
    id: "TRX-004",
    noRef: "SFY-OUT-202501-018",
    tanggal: "25 Jan 2025",
    jenis: "Pengeluaran",
    kategori: "Perlengkapan Sekolah",
    jumlah: 4650000,
    keterangan: "Pengadaan 15 paket seragam, sepatu & tas santri yatim Arso Keerom",
    metode: "Transfer Toko Mitra",
    status: "Terverifikasi",
    petugas: "Ahmad Faisal (Pendidikan)",
  },
  {
    id: "TRX-005",
    noRef: "SFY-IN-202501-017",
    tanggal: "20 Jan 2025",
    jenis: "Pemasukan",
    kategori: "Sedekah Umum",
    jumlah: 2500000,
    keterangan: "Sedekah QRIS website resmi sfypapua.org",
    metode: "QRIS BSI",
    status: "Terverifikasi",
    petugas: "Sistem Otomatis",
  },
  {
    id: "TRX-006",
    noRef: "SFY-OUT-202501-016",
    tanggal: "18 Jan 2025",
    jenis: "Pengeluaran",
    kategori: "Operasional Relawan",
    jumlah: 1100000,
    keterangan: "BBM & transportasi survei pendataan anak yatim Distrik Depapre",
    metode: "Tunai / Kas Kecil",
    status: "Terverifikasi",
    petugas: "Daud M. Kogoya (Logistik)",
  },
  {
    id: "TRX-007",
    noRef: "SFY-IN-202501-015",
    tanggal: "15 Jan 2025",
    jenis: "Pemasukan",
    kategori: "Sedekah Khusus Kesehatan",
    jumlah: 6000000,
    keterangan: "Donasi program pemeriksaan gigi dan vitamin anak dari dr. Hendro",
    metode: "Bank BSI",
    status: "Terverifikasi",
    petugas: "Ustadzah Wardah (Bendahara)",
  },
  {
    id: "TRX-008",
    noRef: "SFY-OUT-202501-014",
    tanggal: "12 Jan 2025",
    jenis: "Pengeluaran",
    kategori: "Kesehatan Santri",
    jumlah: 1850000,
    keterangan: "Pemeriksaan medis awal & vitamin anak yatim Holtekamp",
    metode: "Transfer Klinik",
    status: "Review",
    petugas: "Siti Rahmawati (Medis)",
  },
];

export const initialUsers: UserAccount[] = [
  {
    id: "USR-001",
    nama: "Fajar Maulana, S.Kom",
    email: "admin@sfypapua.org",
    roleId: "super_admin",
    status: "Aktif",
    terakhirLogin: "Hari ini, 08:30 WIT",
    wilayahTugas: "Sekretariat Pusat Jayapura",
  },
  {
    id: "USR-002",
    nama: "Ustadzah Wardah Al-Kaf",
    email: "keuangan@sfypapua.org",
    roleId: "bendahara",
    status: "Aktif",
    terakhirLogin: "Kemarin, 16:45 WIT",
    wilayahTugas: "Sekretariat Pusat Jayapura",
  },
  {
    id: "USR-003",
    nama: "Ahmad Faisal Sanjaya",
    email: "faisal.s@gmail.com",
    roleId: "koordinator_relawan",
    status: "Aktif",
    terakhirLogin: "2 hari lalu",
    wilayahTugas: "Koord. Wilayah Sentani & Abepura",
  },
  {
    id: "USR-004",
    nama: "Daud Mansyur Kogoya",
    email: "daud.kogoya@sfypapua.org",
    roleId: "staf_lapangan",
    status: "Aktif",
    terakhirLogin: "3 hari lalu",
    wilayahTugas: "Distribusi Lapangan & Survei Keerom",
  },
  {
    id: "USR-005",
    nama: "Drs. H. Mulyadi Saputra",
    email: "auditor@sfypapua.org",
    roleId: "auditor",
    status: "Aktif",
    terakhirLogin: "1 minggu lalu",
    wilayahTugas: "Dewan Pengawas & Verifikasi Transparansi",
  },
  {
    id: "USR-006",
    nama: "Rian Hidayat",
    email: "rian.magang@sfypapua.org",
    roleId: "staf_lapangan",
    status: "Non-aktif",
    terakhirLogin: "15 Des 2024",
    wilayahTugas: "Bantuan Input Data Lapangan",
  },
];

export const initialRoles: RoleDefinition[] = [
  {
    id: "super_admin",
    nama: "Super Admin",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    deskripsi: "Akses mutlak untuk seluruh modul sistem, konfigurasi akun pengguna, role, dan hak akses.",
    userCount: 1,
  },
  {
    id: "bendahara",
    nama: "Bendahara Lembaga",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    deskripsi: "Mengelola seluruh catatan arus kas, penerimaan sedekah, verifikasi pengeluaran, dan audit keuangan.",
    userCount: 1,
  },
  {
    id: "koordinator_relawan",
    nama: "Koordinator Relawan",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    deskripsi: "Verifikasi pendaftar relawan baru, penugasan divisi kerelawanan, dan koordinasi giat santri.",
    userCount: 1,
  },
  {
    id: "staf_lapangan",
    nama: "Staf Pendataan Lapangan",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    deskripsi: "Menginput dan memvalidasi data anak yatim di distrik-distrik pedalaman, survei kebutuhan, dan penyaluran logistik.",
    userCount: 2,
  },
  {
    id: "auditor",
    nama: "Auditor & Pengawas",
    badgeColor: "bg-stone-100 text-stone-800 border-stone-300",
    deskripsi: "Akses baca (read-only) penuh untuk verifikasi kepatuhan, keabsahan transaksi, dan laporan transparansi publik.",
    userCount: 1,
  },
];

export const moduleList = [
  { id: "anak-yatim", name: "Pendataan Anak Yatim", desc: "Data santri yatim/piatu, profil keluarga, dan riwayat pendidikan" },
  { id: "relawan", name: "Pendataan Relawan", desc: "Database anggota relawan aktif, keahlian, dan divisi tugas" },
  { id: "donatur", name: "Pendataan Donatur", desc: "Database donatur perorangan, lembaga, dan riwayat komitmen" },
  { id: "keuangan", name: "Manajemen Keuangan", desc: "Arus kas masuk-keluar, pencatatan kuitansi, dan neraca sedekah" },
  { id: "users", name: "Kelola User Admin", desc: "Akun operator staf, izin login, dan status keaktifan user" },
  { id: "roles", name: "Manajemen Role", desc: "Definisi jabatan dan klasifikasi hak istimewa operasional" },
  { id: "permissions", name: "Penentuan Permission", desc: "Matriks granular Create, Read, Update, Delete per role" },
];

export const initialPermissions: RolePermissionsMap = {
  super_admin: {
    "anak-yatim": { create: true, read: true, update: true, delete: true },
    relawan: { create: true, read: true, update: true, delete: true },
    donatur: { create: true, read: true, update: true, delete: true },
    keuangan: { create: true, read: true, update: true, delete: true },
    users: { create: true, read: true, update: true, delete: true },
    roles: { create: true, read: true, update: true, delete: true },
    permissions: { create: true, read: true, update: true, delete: true },
  },
  bendahara: {
    "anak-yatim": { create: false, read: true, update: false, delete: false },
    relawan: { create: false, read: true, update: false, delete: false },
    donatur: { create: true, read: true, update: true, delete: false },
    keuangan: { create: true, read: true, update: true, delete: true },
    users: { create: false, read: false, update: false, delete: false },
    roles: { create: false, read: false, update: false, delete: false },
    permissions: { create: false, read: false, update: false, delete: false },
  },
  koordinator_relawan: {
    "anak-yatim": { create: true, read: true, update: true, delete: false },
    relawan: { create: true, read: true, update: true, delete: true },
    donatur: { create: false, read: true, update: false, delete: false },
    keuangan: { create: false, read: true, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    roles: { create: false, read: false, update: false, delete: false },
    permissions: { create: false, read: false, update: false, delete: false },
  },
  staf_lapangan: {
    "anak-yatim": { create: true, read: true, update: true, delete: false },
    relawan: { create: false, read: true, update: false, delete: false },
    donatur: { create: false, read: false, update: false, delete: false },
    keuangan: { create: false, read: false, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    roles: { create: false, read: false, update: false, delete: false },
    permissions: { create: false, read: false, update: false, delete: false },
  },
  auditor: {
    "anak-yatim": { create: false, read: true, update: false, delete: false },
    relawan: { create: false, read: true, update: false, delete: false },
    donatur: { create: false, read: true, update: false, delete: false },
    keuangan: { create: false, read: true, update: false, delete: false },
    users: { create: false, read: true, update: false, delete: false },
    roles: { create: false, read: true, update: false, delete: false },
    permissions: { create: false, read: true, update: false, delete: false },
  },
};

