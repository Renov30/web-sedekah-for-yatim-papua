import React from "react";
import type { Metadata } from "next";
import {
  transparencyPrinciples,
  transparencyRoadmap,
  antiFraudGuidelines,
} from "@/data/transparency";
import { SectionHeading } from "@/components/SectionHeading";
import { HonestNotice } from "@/components/HonestNotice";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Transparansi & Akuntabilitas",
  description:
    "Prinsip pengelolaan dana, komitmen akuntabilitas publik, tahapan pelaporan berkala, dan panduan verifikasi saluran resmi donasi Sedekah for Yatim Papua.",
};

export default function TransparansiPage() {
  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* Header Banner */}
      <section className="w-full bg-[#FAF6FC] border-b border-[#EBDFF2] pt-28 sm:pt-36 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Amanah Sedekah Dikelola dengan Keterbukaan & Hati Bersih.
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Kami memandang dana sedekah dan donasi bagi anak-anak yatim sebagai titipan suci umat. Tanggung jawab kami tidak hanya kepada para dermawan dan anak-anak binaan, melainkan yang utama adalah pertanggungjawaban di hadapan Allah SWT.
            </p>
          </div>
        </div>
      </section>

      {/* Honest Commitment Statement Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-8 bg-[#1A0B23] text-stone-100 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs sm:text-sm">
          <div>
            <p className="leading-relaxed">
              <strong className="text-white">Prinsip Kejujuran Data:</strong> Kami tidak pernah mempublikasikan angka statistik rekayasa, jumlah anak asuhan fiktif, atau klaim audit yang belum terlaksana. Seluruh penyajian data berpatokan pada dokumen riil di lapangan.
            </p>
          </div>
          <span className="text-[#1A0B23] bg-[#FACC15] font-mono text-xs uppercase tracking-wider font-bold shrink-0 px-3.5 py-1.5 rounded-full">
            Zero-Fabrication Policy
          </span>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <SectionHeading
          eyebrow="PRINSIP PENGELOLAAN"
          title="Lima Pilar Pengelolaan Amanah Publik"
          description="Standar operasional yang kami terapkan dalam setiap tahap penghimpunan dan penyaluran dana kebaikan."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transparencyPrinciples.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between hover:border-stone-400 transition-colors"
            >
              <div className="space-y-3">
                <span className="font-mono text-xs font-bold text-[#581C87] bg-[#F3E8FF] px-3 py-1 rounded-full inline-block">
                  Prinsip 0{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-stone-900 tracking-tight leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 text-xs text-stone-600 space-y-1 bg-[#F8F9FA] p-3.5 rounded-2xl">
                <span className="font-semibold text-stone-900 block">Penerapan Lapangan:</span>
                <p>{item.practice}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Reporting Roadmap Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <SectionHeading
          eyebrow="ROADMAP PELAPORAN"
          title="Tahapan Publikasi Laporan Keuangan"
          description="Rencana terstruktur penerbitan laporan keuangan dan akuntabilitas seiring pertumbuhan kelembagaan Sedekah for Yatim Papua."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {transparencyRoadmap.map((roadmap, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-stone-500">{roadmap.phase}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    roadmap.status === "active"
                      ? "bg-[#823296] text-white"
                      : "bg-stone-100 text-stone-700"
                  }`}>
                    {roadmap.statusLabel}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 tracking-tight leading-snug">
                  {roadmap.title}
                </h3>

                <div className="text-xs text-stone-500 font-medium">
                  {roadmap.timeline}
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {roadmap.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-2">
                <span className="text-xs font-semibold text-stone-900 block">Keluaran Nyata:</span>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {roadmap.deliverables.map((item, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <span className="text-[#823296] font-bold shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <HonestNotice
          type="roadmap"
          title="Komitmen Penerbitan Laporan PDF Berkala"
        >
          Laporan rekapitulasi penyaluran donasi per kegiatan saat ini dapat diminta langsung oleh donatur melalui korespondensi sekretariat resmi. Format PDF berkala publik akan diunggah pada halaman ini setelah sistem rekapitulasi digital distandarisasi.
        </HonestNotice>
      </section>

      {/* Anti-Fraud & Safe Donation Section */}
      <section id="verifikasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <SectionHeading
          eyebrow="KEAMANAN & ANTI-PENIPUAN"
          title="Panduan Verifikasi Resmi Donasi"
          description="Langkah praktis bagi donatur untuk memastikan bantuan Anda benar-benar tersampaikan ke saluran resmi SFY Papua dan terhindar dari pihak tidak bertanggung jawab."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {antiFraudGuidelines.map((guide, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-3"
            >
              <div className="font-mono font-bold text-xs text-[#9E5A0A] bg-[#FFF9EE] px-3 py-1 rounded-full inline-block border border-[#F3E2C4]">
                Langkah {guide.step}
              </div>
              <h3 className="text-base font-bold text-stone-900 tracking-tight">
                {guide.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {guide.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9EE] border border-[#F3E2C4] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 text-stone-900">
            <p className="font-bold text-base">
              Temukan Indikasi Pihak yang Mengatasnamakan Kami?
            </p>
            <p className="text-xs sm:text-sm text-stone-600">
              Segera laporkan kepada sekretariat resmi kami agar dapat kami tindak lanjuti dan umumkan ke publik demi melindungi masyarakat.
            </p>
          </div>
          <Button
            href="https://wa.me/6282198004411?text=Halo%20Sekretariat%20SFY%20Papua,%20saya%20ingin%20mengonfirmasi%20informasi%20donasi"
            external
            variant="primary"
            size="md"
            className="shrink-0"
          >
            Laporkan via WhatsApp →
          </Button>
        </div>
      </section>

      {/* Contact Channel for Transparency Inquiries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-[2.5rem] bg-[#1A0B23] text-stone-100 p-10 sm:p-14 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Saluran Terbuka Pertanyaan Transparansi
          </h2>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Bagi donatur atau pemerhati sosial yang memerlukan konfirmasi rincian pengeluaran per kegiatan, tim koordinator kami menyambut baik korespondensi tertulis Anda.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="mailto:sekretariat@sfypapua.org?subject=Permohonan%20Informasi%20Transparansi%20SFY%20Papua"
              external
              variant="primary"
              size="md"
            >
              Email Sekretariat
            </Button>
            <Button
              href="https://wa.me/6282198004411?text=Halo%20Sekretariat%20SFY%20Papua,%20saya%20ingin%20berdiskusi%20tentang%20alokasi%20program"
              external
              variant="outline"
              size="md"
              className="text-white border-white/20 hover:bg-white/10"
            >
              WhatsApp Koordinator (+62 821-9800-4411)
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
