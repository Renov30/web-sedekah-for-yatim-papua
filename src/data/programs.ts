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
    title: "Dukungan Pendidikan & Perlengkapan Belajar Yatim",
    category: "Pendidikan & Literasi",
    shortSummary:
      "Memastikan anak-anak yatim dan dhuafa di Papua memiliki perlengkapan sekolah lengkap, seragam, serta sarana belajar agama dan umum yang memadai.",
    description:
      "Banyak anak yatim dan santri dhuafa di Papua yang menuntut ilmu dengan fasilitas sangat terbatas: seragam yang telah usang, buku tulis minim, dan keterbatasan mushaf Al-Qur'an. Melalui pilar ini, relawan mengidentifikasi kebutuhan langsung anak asuh di asrama yatim, pesantren, dan keluarga binaan untuk diserahkan paket tas, buku teks, alat tulis, dan perlengkapan sekolah yang layak.",
    focusAreas: [
      "Paket tas, buku tulis, seragam, dan sepatu baru untuk anak yatim",
      "Penyediaan mushaf Al-Qur'an, juz amma, dan buku bacaan Islami",
      "Bantuan penunjang kelancaran sekolah formal jenjang SD–SMA",
    ],
    operationalScope:
      "Fokus aksi di asrama yatim dan keluarga binaan wilayah Jayapura, Sentani, dan Keerom.",
    status: "active",
    statusLabel: "Program Berjalan",
    image: "/images/program-education.jpg",
    imageAlt:
      "Buku-buku pelajaran dan perlengkapan sekolah yang disiapkan untuk anak-anak yatim",
    keyActivities: [
      "Asesmen langsung kebutuhan anak yatim di asrama dan keluarga asuh",
      "Pengadaan dan pengepakan seragam serta alat tulis oleh relawan",
      "Penyerahan amanah diiringi sesi doa dan motivasi belajar",
    ],
    callToAction: {
      label: "Dukung Program Pendidikan Yatim",
      href: "/donasi",
    },
  },
  {
    id: "kebutuhan-dasar",
    slug: "bantuan-kebutuhan-dasar",
    title: "Paket Nutrisi Halal & Kebutuhan Pangan Yatim",
    category: "Nutrisi & Kesejahteraan",
    shortSummary:
      "Penyaluran berkala sembako berkualitas, pangan bergizi halal, dan pemenuhan kebutuhan dasar bagi anak-anak yatim dan keluarga asuh.",
    description:
      "Gizi yang baik dan halal adalah pondasi utama agar anak-anak yatim tumbuh sehat, berenergi, dan optimal dalam menuntut ilmu. Pilar ini menyalurkan paket sembako lengkap (beras, telur, minyak goreng, susu, protein hewani, dan kacang-kacangan) ke panti asuhan yatim, pondok pesantren dhuafa, dan keluarga ibu tunggal yang merawat anak yatim.",
    focusAreas: [
      "Paket sembako bulanan untuk keluarga asuh dan panti asuhan yatim",
      "Suplemen gizi, susu, dan bahan pangan berprotein tinggi",
      "Bantuan sandang layak pakai dan paket perlengkapan sanitasi diri",
    ],
    operationalScope:
      "Penyaluran rutin bulanan berbasis data keluarga binaan yatim muslim terverifikasi.",
    status: "active",
    statusLabel: "Program Berjalan",
    image: "/images/program-basic-needs.jpg",
    imageAlt:
      "Paket bahan pangan pokok dan nutrisi halal yang disiapkan untuk keluarga asuh anak yatim",
    keyActivities: [
      "Pendataan faktual kondisi persediaan pangan di asrama/keluarga binaan",
      "Belanja langsung ke pedagang pasar lokal Papua guna menggerakkan ekonomi sekitar",
      "Penyaluran santun dengan bukti berita acara penyerahan",
    ],
    callToAction: {
      label: "Salurkan Sedekah Pangan Yatim",
      href: "/donasi",
    },
  },
  {
    id: "pendampingan",
    slug: "pendampingan-dan-pemberdayaan",
    title: "Bimbingan Karakter, Literasi Quran, & Keterampilan",
    category: "Pengembangan Karakter",
    shortSummary:
      "Kelas belajar gembira, bimbingan mengaji Al-Qur'an, pembinaan akhlak mulia, serta pengenalan keterampilan hidup bersama kakak relawan.",
    description:
      "Anak-anak yatim membutuhkan figur kakak dan sahabat yang tulus membimbing serta menghidupkan rasa percaya diri mereka. Program ini menghadirkan ruang belajar akhir pekan yang memadukan bimbingan calistung, penguatan akidah dan akhlak, kisah teladan para Nabi, serta kreasi seni yang menggembirakan.",
    focusAreas: [
      "Bimbingan membaca dan tahsin Al-Qur'an serta doa-doa harian",
      "Bimbingan belajar calistung dan pelajaran sekolah umum",
      "Pendidikan akhlak terpuji, adab, dan penanaman rasa percaya diri",
    ],
    operationalScope:
      "Dilaksanakan secara terjadwal di posko asrama dan TPQ mitra di Jayapura.",
    status: "active",
    statusLabel: "Program Berjalan",
    image: "/images/program-empowerment.jpg",
    imageAlt:
      "Suasana bimbingan belajar dan mengaji santai bersama kakak relawan",
    keyActivities: [
      "Pendampingan rutin akhir pekan bersama kakak relawan pengajar",
      "Pemberian apresiasi kreasi dan hafalan surat pendek anak asuh",
      "Sesi konsultasi hangat mendengarkan cita-cita dan keluh kesah anak",
    ],
    callToAction: {
      label: "Bergabung Jadi Relawan Pengajar",
      href: "/jadi-relawan",
    },
  },
  {
    id: "relawan",
    slug: "gerakan-relawan",
    title: "Gerakan Relawan & Penguatan Ukhuwah Komunitas",
    category: "Kerelawanan Sosial",
    shortSummary:
      "Wadah kolaborasi pemuda dan masyarakat Papua untuk mengabdi memuliakan anak-anak yatim secara berkesinambungan.",
    description:
      "Kekuatan gerakan Sedekah for Yatim Papua bertumpu pada niat tulus dan etika gotong royong para relawan. Program ini membina pemuda lokal agar memiliki kepedulian sosial tinggi, memahami pedoman perlindungan anak (child safeguarding), serta mampu mengelola aksi kemanusiaan secara mandiri dan profesional.",
    focusAreas: [
      "Pelatihan relawan peduli yatim dan etika keselamatan anak",
      "Penguatan posko koordinasi lapangan di distrik-distrik Papua",
      "Sinergi bersama komunitas dakwah, kampus, dan majelis taklim setempat",
    ],
    operationalScope:
      "Terbuka untuk generasi muda, mahasiswa, dan masyarakat umum di tanah Papua.",
    status: "active",
    statusLabel: "Program Terbuka",
    image: "/images/program-volunteer.jpg",
    imageAlt:
      "Relawan saling bergotong royong mempersiapkan rencana kegiatan penyaluran amanah",
    keyActivities: [
      "Orientasi niat kerelawanan dan pemahaman SOP pendampingan anak",
      "Distribusi tugas berbasis minat (pengajar, logistik lapangan, dokumentasi)",
      "Silaturahmi dan evaluasi rutin untuk menjaga integritas gerakan",
    ],
    callToAction: {
      label: "Daftar Jadi Relawan SFY",
      href: "/jadi-relawan",
    },
  },
];
