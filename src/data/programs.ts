export interface ProgramPillar {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortSummary: string;
  description: string;
  focusAreas: string[];
  operationalScope: string;
  status: "active" | "pilot" | "proposed";
  statusLabel: string;
  image: string;
  imageAlt: string;
  keyActivities: string[];
  callToAction: {
    label: string;
    href: string;
  };
}

export const programs: ProgramPillar[] = [
  {
    id: "pendidikan",
    slug: "dukungan-pendidikan",
    title: "Dukungan Pendidikan & Perlengkapan Belajar",
    category: "Pendidikan & Literasi",
    shortSummary:
      "Memastikan anak-anak yatim dan dhuafa di Papua memiliki perlengkapan sekolah lengkap dan akses ke bahan ajar yang layak.",
    description:
      "Banyak anak yatim dan dhuafa di pelosok Papua menghadapi keterbatasan sarana dasar sekolah: buku tulis, tas, seragam, hingga sepatu layak pakai. Melalui pilar ini, relawan mengidentifikasi kebutuhan spesifik setiap anak dan menyalurkan paket perlengkapan belajar secara langsung, bekerja sama dengan guru dan pengurus sekolah setempat.",
    focusAreas: [
      "Paket perlengkapan sekolah (buku, alat tulis, tas, seragam)",
      "Bantuan iuran atau perlengkapan pendukung jenjang SD–SMA",
      "Penyediaan modul literasi baca-tulis kontekstual Papua",
    ],
    operationalScope:
      "Fokus rintisan di wilayah Jayapura, Sentani, dan distrik terdekat dengan target perluasan bertahap.",
    status: "active",
    statusLabel: "Program Berjalan (Tahap Rintisan)",
    image: "/images/program-education.jpg",
    imageAlt:
      "Buku-buku pelajaran dan perlengkapan sekolah yang rapi disiapkan untuk anak-anak",
    keyActivities: [
      "Pendataan kebutuhan anak di asrama dan lingkungan keluarga asuh",
      "Pengepakan dan penyortiran paket perlengkapan oleh relawan",
      "Penyerahan langsung serta motivasi belajar bersama pengajar",
    ],
    callToAction: {
      label: "Dukung Program Pendidikan",
      href: "/donasi",
    },
  },
  {
    id: "kebutuhan-dasar",
    slug: "bantuan-kebutuhan-dasar",
    title: "Bantuan Kebutuhan Dasar & Pangan Bergizi",
    category: "Nutrisi & Kesejahteraan",
    shortSummary:
      "Penyediaan bahan pangan pokok bergizi serta dukungan sandang dan sanitasi harian anak-anak yatim binaan.",
    description:
      "Kebutuhan nutrisi yang tercukupi adalah fondasi utama agar anak dapat belajar dengan sehat dan berkonsentrasi. Pilar ini berfokus pada penyaluran paket bahan pokok berkualitas (beras, telur, kacang-kacangan, susu, minyak goreng) serta perlengkapan kebersihan diri untuk keluarga asuh dan panti asuhan yatim.",
    focusAreas: [
      "Paket sembako berkala untuk keluarga asuh yatim dhuafa",
      "Suplementasi gizi dan pemenuhan protein anak",
      "Penyediaan paket sanitasi higienis dan sandang layak",
    ],
    operationalScope:
      "Penyaluran bertahap tiap bulan berbasis data keluarga asuh yang telah diverifikasi.",
    status: "active",
    statusLabel: "Program Berjalan",
    image: "/images/program-basic-needs.jpg",
    imageAlt:
      "Paket bahan pangan pokok dan nutrisi yang disiapkan untuk keluarga asuh penerima manfaat",
    keyActivities: [
      "Verifikasi berkala status ekonomi keluarga asuh yatim",
      "Belanja langsung ke pasar lokal untuk menggerakkan pedagang sekitar",
      "Distribusi teratur dengan tanda terima terdokumentasi",
    ],
    callToAction: {
      label: "Salurkan Bantuan Nutrisi",
      href: "/donasi",
    },
  },
  {
    id: "pendampingan",
    slug: "pendampingan-dan-pemberdayaan",
    title: "Pendampingan Belajar, Karakter, & Keterampilan",
    category: "Pengembangan Karakter",
    shortSummary:
      "Sesi belajar gembira, bimbingan moral, serta pelatihan keterampilan hidup ringan bersama kakak asuh relawan.",
    description:
      "Anak-anak yatim tidak hanya membutuhkan materi, namun juga kehadiran figur pendamping yang tulus mendengarkan, memberi semangat, dan menanamkan nilai-nilai luhur. Relawan hadir menyelenggarakan kelas baca ceria, pengenalan teknologi dasar, serta ruang diskusi yang aman dan menggembirakan.",
    focusAreas: [
      "Bimbingan membaca, menulis, dan berhitung (calistung) santai",
      "Ruang kreasi seni, cerita inspiratif, dan penanaman budi pekerti",
      "Pengenalan dasar literasi digital dan keterampilan praktis",
    ],
    operationalScope:
      "Pertemuan akhir pekan rutin di titik-titik posko belajar komunitas.",
    status: "active",
    statusLabel: "Program Berjalan",
    image: "/images/program-empowerment.jpg",
    imageAlt:
      "Suasana diskusi dan bimbingan belajar santai penuh semangat bersama anak-anak",
    keyActivities: [
      "Penyusunan kurikulum non-formal yang ramah anak",
      "Pertemuan mingguan kakak asuh bersama kelompok kecil anak",
      "Pameran karya kreasi anak sebagai sarana menumbuhkan rasa percaya diri",
    ],
    callToAction: {
      label: "Bergabung Menjadi Pendamping",
      href: "/jadi-relawan",
    },
  },
  {
    id: "relawan",
    slug: "gerakan-relawan",
    title: "Gerakan Relawan & Penguatan Komunitas",
    category: "Kerelawanan Sosial",
    shortSummary:
      "Wadah kolaborasi generasi muda Papua untuk mengambil peran aktif dalam kerja-kerja sosial kemanusiaan.",
    description:
      "Keberhasilan gerakan ini bertumpu pada integritas dan ketulusan para relawan di lapangan. Program ini membekali relawan dengan etika perlindungan anak (child safeguarding), teknik pendataan objektif, koordinasi tanggap sosial, serta kepemimpinan komunitas yang berpihak pada martabat sesama.",
    focusAreas: [
      "Pelatihan dasar relawan kemanusiaan dan etika keselamatan anak",
      "Pengembangan jaringan posko relawan berbasis distrik",
      "Kolaborasi terbuka dengan universitas lokal dan komunitas pemuda",
    ],
    operationalScope:
      "Terbuka untuk pemuda, mahasiswa, dan masyarakat umum di wilayah Papua.",
    status: "active",
    statusLabel: "Program Terbuka",
    image: "/images/program-volunteer.jpg",
    imageAlt:
      "Relawan saling bergotong royong mempersiapkan rencana kegiatan kemanusiaan",
    keyActivities: [
      "Orientasi nilai dan SOP penanganan anak bagi relawan baru",
      "Pemberian mandat tugas berbasis keahlian (logistik, ajar, media)",
      "Refleksi rutin dan evaluasi berkala demi menjaga kemurnian gerakan",
    ],
    callToAction: {
      label: "Daftar Jadi Relawan",
      href: "/jadi-relawan",
    },
  },
];

