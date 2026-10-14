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
  tagline: "Menumbuhkan Harapan, Menguatkan Masa Depan Anak Papua",
  eyebrow: "GERAKAN KEBAIKAN UNTUK PAPUA",
  headline: "Menumbuhkan Harapan, Menguatkan Masa Depan Anak Papua.",
  heroSupportingCopy:
    "Bersama relawan dan para dermawan, kami berupaya menghadirkan dukungan pendidikan, kebutuhan dasar, dan kesempatan yang lebih baik bagi anak-anak di Papua.",
  aboutIntro:
    "Sedekah for Yatim Papua adalah inisiatif sosial berbasis kerelawanan yang lahir dari kepedulian mendalam terhadap masa depan anak-anak yatim, piatu, dan dhuafa di tanah Papua. Melalui pendekatan gotong royong dan kemitraan komunitas lokal, kami memastikan setiap bantuan tersalurkan secara langsung, bermartabat, dan dapat dipertanggungjawabkan.",
  vision:
    "Terwujudnya masa depan anak-anak yatim dan dhuafa di Papua yang bermartabat, berpendidikan layak, sehat jasmani rohani, serta berdaya saing dalam meraih cita-cita.",
  mission: [
    "Menyediakan akses perlengkapan belajar dan bantuan biaya pendidikan berkelanjutan bagi anak yatim dan dhuafa di Papua.",
    "Menyalurkan paket pemenuhan kebutuhan gizi dasar dan perawatan kesehatan preventif secara berkala.",
    "Mengembangkan program pendampingan literasi, karakter, dan keterampilan hidup bersama relawan dan tokoh masyarakat.",
    "Menjaga amanah donatur melalui pengelolaan dana yang transparan, terdokumentasi rapi, dan bebas dari konflik kepentingan.",
    "Menumbuhkan ekosistem kerelawanan pemuda lokal yang aktif berkontribusi bagi kemajuan kampung dan kotanya.",
  ],
  values: [
    {
      title: "Kasih Sayang (Compassion)",
      description:
        "Bergerak dengan ketulusan hati untuk merangkul dan melindungi anak-anak yang kehilangan orang tua, tanpa membeda-bedakan latar belakang.",
    },
    {
      title: "Amanah & Kepercayaan (Trust)",
      description:
        "Menjunjung tinggi kejujuran dalam memegang titipan donatur dan memperlakukan setiap rupiah sebagai tanggung jawab moral yang suci.",
    },
    {
      title: "Keterbukaan (Transparency)",
      description:
        "Membuka informasi alokasi penyaluran secara jujur dan berkala, tanpa melebih-lebihkan angka atau memanipulasi kenyataan lapangan.",
    },
    {
      title: "Martabat Anak (Dignity)",
      description:
        "Melindungi kehormatan anak-anak dan keluarga penerima manfaat. Kami pantang memanfaatkan rasa iba berlebihan atau eksploitasi visual demi simpati publik.",
    },
    {
      title: "Partisipasi Komunitas (Community Participation)",
      description:
        "Melibatkan keluarga asuh, pemuka adat/kampung, serta relawan setempat agar solusi tumbuh dari pemahaman mendalam atas kebutuhan riil.",
    },
    {
      title: "Dampak Berkelanjutan (Sustainable Impact)",
      description:
        "Tidak berhenti pada bantuan darurat sesaat, namun berorientasi pada kemandirian jangka panjang anak hingga menyelesaikan pendidikannya.",
    },
  ],
  approach: [
    {
      title: "Verifikasi Lapangan Langsung",
      description:
        "Relawan kami mengunjungi langsung keluarga asuh dan asrama untuk memverifikasi kondisi aktual sebelum bantuan disalurkan.",
    },
    {
      title: "Pendampingan, Bukan Sekadar Serah Terima",
      description:
        "Bantuan materi diimbangi dengan kunjungan berkala, ruang belajar gembira, serta bimbingan belajar bersama kakak relawan.",
    },
    {
      title: "Kerjasama Tokoh & Ekosistem Lokal",
      description:
        "Bekerja sama erat dengan para pengajar, komunitas pemuda, serta tetua lingkungan untuk memastikan keberlanjutan program.",
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
      value: "+62 821-9800-4411 (Konfirmasi & Layanan Relawan)",
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
    "Susunan dewan pengurus, pembina, serta struktur manajerial resmi Sedekah for Yatim Papua akan dipublikasikan secara lengkap bersamaan dengan penerbitan salinan akta legalitas kelembagaan.",
  donationPolicyNotice:
    "Demi keamanan bersama, seluruh donasi hanya disalurkan melalui rekening resmi atas nama lembaga yang telah terverifikasi. Kami tidak pernah meminta transfer ke rekening pribadi perorangan yang tidak terdaftar.",
  volunteerPolicyNotice:
    "Perekrutan relawan dilakukan secara terbuka dan tanpa dipungut biaya apa pun. Seluruh calon relawan akan melewati sesi penyelarasan nilai dan pelatihan keselamatan anak (child safeguarding).",
};

