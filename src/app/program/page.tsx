import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { programs } from "@/data/programs";
import { Button } from "@/components/Button";
import { HonestNotice } from "@/components/HonestNotice";

export const metadata: Metadata = {
  title: "Pilar Program",
  description:
    "Empat pilar program inisiatif Sedekah for Yatim Papua: Dukungan Pendidikan, Pemenuhan Kebutuhan Dasar, Pendampingan Belajar, dan Gerakan Relawan Komunitas.",
};

export default function ProgramPage() {
  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* Header Banner */}
      <section className="w-full bg-[#F4F6F2] border-b border-[#DFE7DB] pt-28 sm:pt-36 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Inisiatif Nyata untuk Masa Depan Berkelanjutan Anak Yatim Papua.
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Kami membagi ikhtiar kepedulian ke dalam empat pilar terpadu. Setiap pilar dirancang untuk menjawab akar persoalan anak-anak yatim di Papua—khususnya anak yatim muslim—mulai dari pemenuhan gizi halal, perlengkapan madrasah/sekolah, hingga pembinaan akhlak mulia dan Al-Qur&apos;an.
            </p>
          </div>
        </div>
      </section>

      {/* Program Methodology Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <span className="font-mono text-xs font-bold text-[#163821] bg-[#EBF4E5] px-3 py-1 rounded-full inline-block">
              Tahap 01
            </span>
            <h3 className="font-bold text-stone-900 text-lg">Pendataan & Verifikasi</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Relawan meninjau langsung kondisi keluarga asuh dan asrama untuk memastikan ketepatan sasaran penerima manfaat.
            </p>
          </div>

          <div className="p-7 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <span className="font-mono text-xs font-bold text-[#163821] bg-[#EBF4E5] px-3 py-1 rounded-full inline-block">
              Tahap 02
            </span>
            <h3 className="font-bold text-stone-900 text-lg">Pengadaan Lokal Berkualitas</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Membeli bahan pangan dan perlengkapan sekolah dari pedagang lokal Papua untuk menggerakkan denyut perekonomian sekitar.
            </p>
          </div>

          <div className="p-7 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <span className="font-mono text-xs font-bold text-[#163821] bg-[#EBF4E5] px-3 py-1 rounded-full inline-block">
              Tahap 03
            </span>
            <h3 className="font-bold text-stone-900 text-lg">Pendampingan Humanis</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Penyaluran dibersamai dengan kelas bermain, membaca dongeng inspiratif, dan mendengarkan harapan anak asuh secara tulus.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16 sm:space-y-24">
        {programs.map((program, idx) => {
          const isEven = idx % 2 === 1;

          return (
            <div
              key={program.id}
              id={program.id}
              className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
            >
              {/* Photo Column */}
              <div
                className={`lg:col-span-5 ${
                  isEven ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="relative aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden shadow-sm bg-stone-200">
                  <Image
                    src={program.image}
                    alt={program.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold uppercase tracking-wider bg-black/70 text-white px-3.5 py-1 rounded-full backdrop-blur-xs">
                      Pilar 0{idx + 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div
                className={`lg:col-span-7 space-y-5 ${
                  isEven ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EBF4E5] text-[#163821] font-bold">
                    {program.statusLabel}
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-700">{program.category}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
                  {program.title}
                </h2>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {program.description}
                </p>

                <div className="space-y-2.5 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Cakupan Aksi & Fokus Penyaluran:
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-stone-700">
                    {program.focusAreas.map((area, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-stone-200/80">
                        <span className="text-[#163821] font-bold shrink-0">—</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-stone-200/80 text-xs text-stone-700 space-y-1">
                  <p className="font-semibold text-stone-900">Cakupan Wilayah Operasional:</p>
                  <p>{program.operationalScope}</p>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Button href={program.callToAction.href} variant="primary" size="md">
                    {program.callToAction.label}
                  </Button>
                  <Button href="/jadi-relawan" variant="outline" size="md">
                    Daftar Relawan Pilar Ini →
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Honest Operational Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <HonestNotice
          type="info"
          title="Catatan Validitas & Keterbukaan Operasional Program"
        >
          Program-program di atas dijalankan berdasarkan data asesmen aktual yang telah diverifikasi oleh relawan di lapangan. Kami tidak menambahkan program fiktif dan tidak menjanjikan penyaluran di luar wilayah jangkauan relawan yang terverifikasi (Jayapura dan distrik sekitarnya).
        </HonestNotice>
      </section>

      {/* Closing CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-[2.5rem] bg-[#0C1D13] text-stone-100 p-10 sm:p-14 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Ingin Mengusulkan Kerjasama Program atau Bantuan Spesifik?
          </h2>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Kami terbuka berkolaborasi dengan komunitas belajar, pengajar, donatur perlengkapan buku, dan tenaga medis untuk memperluas manfaat bagi anak-anak yatim di Papua.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              href="mailto:sekretariat@sfypapua.org"
              external
              variant="primary"
              size="md"
            >
              Kirim Usulan Kerjasama (Email)
            </Button>
            <Button
              href="/transparansi"
              variant="outline"
              size="md"
              className="text-white border-white/20 hover:bg-white/10"
            >
              Pelajari Akuntabilitas Donasi →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
