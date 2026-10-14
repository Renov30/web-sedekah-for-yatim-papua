export interface NavItem {
  title: string;
  href: string;
  description?: string;
  badge?: string;
}

export const mainNavigation: NavItem[] = [
  {
    title: "Beranda",
    href: "/",
    description: "Halaman utama gerakan Sedekah for Yatim Papua",
  },
  {
    title: "Tentang Kami",
    href: "/tentang-kami",
    description: "Latar belakang, visi misi, nilai, dan pendekatan kerelawanan",
  },
  {
    title: "Program",
    href: "/program",
    description: "Pilar inisiatif pendidikan, gizi, pendampingan, dan komunitas",
  },
  {
    title: "Kegiatan",
    href: "/kegiatan",
    description: "Dokumentasi riil aksi lapangan dan agenda kerelawanan",
  },
  {
    title: "Transparansi",
    href: "/transparansi",
    description: "Prinsip akuntabilitas penyaluran dana dan laporan publik",
  },
];

export const actionNavigation = {
  volunteer: {
    title: "Jadi Relawan",
    href: "/jadi-relawan",
    description: "Bergabung bersama gerakan relawan aksi kemanusiaan",
  },
  donate: {
    title: "Donasi",
    href: "/donasi",
    description: "Salurkan kepedulian melalui kanal resmi terverifikasi",
  },
};

export const footerNavigation = {
  primary: [
    { title: "Tentang Kami", href: "/tentang-kami" },
    { title: "Pilar Program", href: "/program" },
    { title: "Dokumentasi Kegiatan", href: "/kegiatan" },
    { title: "Prinsip Transparansi", href: "/transparansi" },
  ],
  participation: [
    { title: "Gabung Jadi Relawan", href: "/jadi-relawan" },
    { title: "Panduan Donasi Resmi", href: "/donasi" },
    { title: "Verifikasi Rekening & Kontak", href: "/donasi#verifikasi" },
    { title: "Etika Perlindungan Anak", href: "/tentang-kami#martabat-anak" },
  ],
  programs: [
    { title: "Dukungan Pendidikan", href: "/program#pendidikan" },
    { title: "Kebutuhan Dasar & Gizi", href: "/program#kebutuhan-dasar" },
    { title: "Pendampingan Belajar", href: "/program#pendampingan" },
    { title: "Gerakan Relawan Lokal", href: "/program#relawan" },
  ],
};

