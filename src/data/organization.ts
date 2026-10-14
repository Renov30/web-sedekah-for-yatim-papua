export interface OrganizationValue {
  title: string;
  description: string;
}

export interface OfficialContact {
  label: string;
  value: string;
  href?: string;
  description: string;
}

export interface OrganizationInfo {
  name: string;
  shortName: string;
  tagline: string;
  eyebrow: string;
  headline: string;
  heroSupportingCopy: string;
  aboutIntro: string;
  vision: string;
  mission: string[];
  values: OrganizationValue[];
  approach: {
    title: string;
    description: string;
  }[];
  contacts: OfficialContact[];
  location: {
    city: string;
    region: string;
    country: string;
    note: string;
  };
  governanceNote: string;
  donationPolicyNotice: string;
  volunteerPolicyNotice: string;
}

export const organization: OrganizationInfo = {
  name: "Sedekah for Yatim Papua",
  shortName: "SFY Papua",
  tagline: "Menumbuhkan Harapan, Menguatkan Masa Depan Anak Yatim Papua",
  eyebrow: "GERAKAN SEDEKAH & KEPEDULIAN ANAK YATIM PAPUA",
  headline: "Menumbuhkan Harapan, Menguatkan Masa Depan Anak Yatim Papua.",
  heroSupportingCopy:
    "Bersama relawan dan para dermawan, kami berikhtiar menghadirkan dukungan pendidikan, pemenuhan gizi halal, dan pembinaan bagi anak-anak yatim di tanah Papua—terutama anak-anak yatim muslim—agar tumbuh cerdas, bermartabat, dan berakhlak mulia.",
  aboutIntro:
    "Sedekah for Yatim Papua (SFY Papua) adalah gerakan kerelawanan independen yang lahir dari kepedulian mendalam terhadap masa depan anak-anak yatim, piatu, dan dhuafa di tanah Papua, dengan fokus utama mendampingi anak-anak yatim muslim di perkotaan hingga distrik pedalaman. Melalui amanah sedekah, infak, dan kepedulian umat, kami menyalurkan bantuan secara langsung, amanah, dan bermartabat guna memastikan mereka memperoleh hak pendidikan, pembinaan akhlak, serta kebutuhan hidup yang layak.",
  vision:
    "Terwujudnya masa depan anak-anak yatim di Papua—khususnya anak-anak yatim muslim—yang berakhlak mulia, berpendidikan layak, mandiri, sehat jasmani rohani, serta berdaya saing dalam meraih cita-cita.",
  mission: [
    "Menyediakan perlengkapan belajar, buku bacaan Islami dan umum, serta beasiswa pendidikan berkelanjutan bagi anak-anak yatim muslim dan dhuafa di Papua.",
    "Menyalurkan paket sembako bergizi dan pangan halal secara rutin ke panti asuhan yatim, pondok pesantren, dan keluarga asuh dhuafa.",
    "Menyelenggarakan program bimbingan belajar, literasi Al-Qur'an, pembinaan karakter akhlakul karimah, dan keterampilan hidup bersama relawan pemuda.",
    "Mengelola amanah dana sedekah dan donasi masyarakat dengan standar transparansi mutlak, pencatatan riil tanpa rekayasa, dan bebas konflik kepentingan.",
    "Membangun jejaring kepedulian dan ukhuwah bersama masyarakat lokal Papua untuk menjaga martabat serta memuliakan anak-anak yatim.",
  ],
  values: [
    {
      title: "Memuliakan Anak Yatim (Ikramul Aitam)",
      description:
        "Menjadikan kepedulian kepada anak yatim sebagai ibadah utama, merangkul mereka dengan penuh kasih sayang tanpa merendahkan martabat.",
    },
    {
      title: "Amanah & Ketulusan (Trust & Integrity)",
      description:
        "Memperlakukan setiap rupiah titipan sedekah sebagai amanah suci yang wajib dipertanggungjawabkan kepada para donatur dan di hadapan Allah SWT.",
    },
    {
      title: "Keterbukaan Mutlak (Transparency)",
      description:
        "Menyajikan data penyaluran dan dokumentasi lapangan secara jujur, objektif, dan faktual tanpa rekayasa angka maupun statistik fiktif.",
    },
    {
      title: "Menjaga Kehormatan (Dignity & Safeguarding)",
      description:
        "Melindungi privasi dan kehormatan anak asuh. Kami menolak eksploitasi visual kemiskinan atau tangisan anak demi memancing belas kasihan.",
    },
    {
      title: "Kemitraan Komunitas Lokal",
      description:
        "Bekerja sama erat dengan pengurus asrama yatim, ustadz/ustadzah, keluarga asuh, dan tokoh masyarakat Papua dalam verifikasi kebutuhan riil.",
    },
    {
      title: "Dampak Berkelanjutan (Sustainable Impact)",
      description:
        "Tidak hanya memberikan bantuan konsumtif sesaat, melainkan mendampingi proses tumbuh kembang anak hingga tuntas pendidikan dan mandiri.",
    },
  ],
  approach: [
    {
      title: "Verifikasi Lapangan Langsung",
      description:
        "Relawan meninjau langsung kondisi asrama yatim, pondok pesantren, dan rumah keluarga asuh di Jayapura dan sekitarnya sebelum menyalurkan bantuan.",
    },
    {
      title: "Pendidikan & Pembinaan Karakter",
      description:
        "Bantuan materi dilengkapi dengan kelas mengaji, bimbingan akhlak, pendampingan sekolah, serta ruang motivasi bersama kakak relawan.",
    },
    {
      title: "Pengadaan Logistik Halal & Lokal",
      description:
        "Belanja bahan pokok diprioritaskan di pedagang pasar tradisional Papua guna memberdayakan perekonomian warga lokal secara berkesinambungan.",
    },
  ],
  contacts: [
    {
      label: "Sekretariat Relawan",
      value: "sekretariat@sfypapua.org",
      href: "mailto:sekretariat@sfypapua.org",
      description: "Saluran korespondensi resmi untuk verifikasi informasi & kemitraan",
    },
    {
      label: "Pusat Koordinasi WhatsApp",
      value: "+62 821-9800-4411 (Sekretariat & Layanan Donasi)",
      href: "https://wa.me/6282198004411",
      description: "Layanan pesan resmi untuk verifikasi nomor rekening & pendaftaran relawan",
    },
  ],
  location: {
    city: "Jayapura",
    region: "Papua",
    country: "Indonesia",
    note: "Posko Relawan dan Aksi Lapangan berpusat di wilayah Jayapura, Sentani, Keerom, dan distrik sekitarnya.",
  },
  governanceNote:
    "Susunan dewan inisiator, koordinator relawan, serta badan hukum resmi Sedekah for Yatim Papua akan dipublikasikan secara lengkap bersamaan dengan proses finalisasi administrasi kelembagaan.",
  donationPolicyNotice:
    "Demi menjaga kesucian amanah dan menghindari penipuan oleh oknum tidak bertanggung jawab, nomor rekening resmi yayasan hanya dibagikan melalui konfirmasi langsung sekretariat. Kami tidak menggunakan rekening pribadi yang tidak terverifikasi.",
  volunteerPolicyNotice:
    "Pendaftaran relawan terbuka bagi siapa saja yang memiliki ketulusan hati untuk mengabdi bagi anak-anak yatim di Papua, tanpa pungutan biaya apa pun.",
};
