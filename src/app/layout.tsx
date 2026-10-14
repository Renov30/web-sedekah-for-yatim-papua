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
    default: "Sedekah for Yatim Papua — Memuliakan Anak Yatim di Bumi Cenderawasih",
    template: "%s | Sedekah for Yatim Papua",
  },
  description:
    "Gerakan kerelawanan mandiri mendukung anak-anak yatim di tanah Papua—terutama anak-anak yatim muslim—melalui penyediaan perlengkapan sekolah, gizi halal, pendampingan belajar, dan pembinaan akhlak mulia.",
  keywords: [
    "Sedekah for Yatim Papua",
    "Yatim Muslim Papua",
    "Sedekah Yatim Papua",
    "Donasi Yatim Papua",
    "Santri Yatim Papua",
    "Relawan Papua",
    "Pendidikan Yatim Papua",
    "Panti Asuhan Yatim Jayapura",
  ],
  authors: [{ name: "Sedekah for Yatim Papua" }],
  openGraph: {
    title: "Sedekah for Yatim Papua — Memuliakan Anak Yatim di Bumi Cenderawasih",
    description:
      "Gerakan kerelawanan mandiri mendukung anak-anak yatim di Papua—terutama anak-anak yatim muslim—dengan prinsip amanah, keterbukaan, dan memuliakan anak yatim.",
    url: "https://sfypapua.org",
    siteName: "Sedekah for Yatim Papua",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sedekah for Yatim Papua",
    description:
      "Gerakan kerelawanan mendukung anak-anak yatim di Papua—terutama anak-anak yatim muslim—melalui pendidikan, pangan halal bergizi, dan pembinaan akhlak.",
  },
  icons: {
    icon: [
      { url: "/images/logo.png" },
      { url: "/favicon.ico" },
    ],
    apple: "/images/logo.png",
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
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#823296] focus:text-white focus:font-semibold focus:rounded-sm focus:shadow-lg"
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
