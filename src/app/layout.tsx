import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sfypapua.org"),
  title: {
    default: "Sedekah for Yatim Papua — Menumbuhkan Harapan Anak Papua",
    template: "%s | Sedekah for Yatim Papua",
  },
  description:
    "Gerakan kerelawanan mandiri mendukung anak-anak yatim, piatu, dan dhuafa di Papua melalui penyediaan perlengkapan sekolah, kebutuhan gizi dasar, pendampingan belajar, dan aksi sosial bermartabat.",
  keywords: [
    "Sedekah for Yatim Papua",
    "Yatim Papua",
    "Donasi Papua",
    "Relawan Papua",
    "Pendidikan Anak Papua",
    "Kemanusiaan Jayapura",
    "Gerakan Sosial Papua",
  ],
  authors: [{ name: "Sedekah for Yatim Papua" }],
  openGraph: {
    title: "Sedekah for Yatim Papua — Menumbuhkan Harapan Anak Papua",
    description:
      "Gerakan kerelawanan mandiri mendukung anak-anak yatim dan dhuafa di Papua dengan prinsip keterbukaan, amanah, dan martabat anak.",
    url: "https://sfypapua.org",
    siteName: "Sedekah for Yatim Papua",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sedekah for Yatim Papua",
    description:
      "Gerakan kerelawanan mendukung anak yatim dan dhuafa di Papua melalui pendidikan, pangan bergizi, dan pendampingan karakter.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory-50 text-charcoal-900 font-sans">
        {/* Accessible Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-botanical-600 focus:text-white focus:font-semibold focus:rounded-sm focus:shadow-lg"
        >
          Lewati ke konten utama
        </a>

        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
