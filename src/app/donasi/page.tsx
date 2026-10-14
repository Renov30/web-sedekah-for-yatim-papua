import React from "react";
import type { Metadata } from "next";
import { DonationVerificationCard } from "@/components/DonationVerificationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { HonestNotice } from "@/components/HonestNotice";

export const metadata: Metadata = {
  title: "Dukungan & Donasi Resmi",
  description:
    "Salurkan sedekah dan bantuan terbaik Anda untuk anak-anak yatim dan dhuafa di Papua melalui panduan verifikasi rekening resmi dan pengelolaan amanah yang transparan.",
};

export default function DonasiPage() {
  const donationPillars = [
    {
      title: "Paket Pendidikan & Alat Tulis",
      desc: "Menyediakan seragam, tas, buku pelajaran, dan perlengkapan sekolah lengkap agar anak-anak tidak putus sekolah karena kendala biaya perlengkapan.",
      impact: "Bantuan diserahkan langsung ke tangan anak di hadapan wali asuh.",
    },
    {
      title: "Nutrisi Gizi & Pangan Pokok",
      desc: "Memastikan ketersediaan beras, telur, sumber protein hewani/nabati, dan susu bagi keluarga asuh yang merawat anak-anak yatim.",
      impact: "Pengadaan diprioritaskan dari pasar dan petani lokal Papua.",
    },
    {
      title: "Sarana Belajar Komunitas",
      desc: "Mendukung pengadaan buku cerita, modul ajar kontekstual Papua, dan biaya operasional ruang kelas literasi akhir pekan.",
      impact: "Membangun kecintaan membaca sejak usia dini.",
    },
  ];

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* Header Banner */}
      <section className="w-full bg-[#FAF6FC] border-b border-[#EBDFF2] pt-28 sm:pt-36 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3E8FF] text-[#581C87] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#823296]" />
              <span>SALURKAN AMANAH SEDEKAH YATIM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Setiap Sedekah Mengalir Jadi Senyum & Harapan Anak Yatim Papua.
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Sedekah Anda dikelola dengan prinsip amanah mutlak: 100% dialokasikan secara langsung untuk pemenuhan kebutuhan gizi halal, perlengkapan belajar, dan pembinaan anak-anak yatim binaan di tanah Papua—terutama anak-anak yatim muslim.
            </p>
          </div>
        </div>
      </section>

      {/* Main Donation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Content Column (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <SectionHeading
                eyebrow="MENGAPA DONASI ANDA PENTING"
                title="Menjembatani Keterbatasan di Pelosok Papua"
                description="Bagi seorang anak yatim di pinggiran Jayapura atau Sentani, sepasang sepatu baru atau sepaket buku tulis bukan sekadar benda—itu adalah tanda bahwa ada orang-orang berhati mulia yang percaya pada masa depan mereka."
              />
            </div>

            {/* Three Impact Pillars */}
            <div className="space-y-4">
              {donationPillars.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#581C87] bg-[#F3E8FF] px-3 py-0.5 rounded-full">
                      Fokus 0{idx + 1}
                    </span>
                    <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.desc}
                  </p>
                  <p className="text-xs text-[#823296] font-semibold pt-1">
                    <span>— {item.impact}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Four Trust Guarantees */}
            <div className="p-8 bg-[#1A0B23] text-stone-100 rounded-3xl space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#FACC15]">
                Prinsip Pertanggungjawaban Donasi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <strong className="text-white block text-sm">Tanpa Rekayasa Angka</strong>
                  <p className="text-stone-300">Laporan disajikan riil sesuai nota pengeluaran aktual di lapangan.</p>
                </div>
                <div className="space-y-1">
                  <strong className="text-white block text-sm">Menjaga Kehormatan Anak</strong>
                  <p className="text-stone-300">Dokumentasi penyerahan bantuan dilakukan dengan santun dan bermartabat.</p>
                </div>
                <div className="space-y-1">
                  <strong className="text-white block text-sm">Konfirmasi Terbuka</strong>
                  <p className="text-stone-300">Donatur berhak memperoleh salinan berita acara kegiatan lapangan.</p>
                </div>
                <div className="space-y-1">
                  <strong className="text-white block text-sm">Bebas Konflik Kepentingan</strong>
                  <p className="text-stone-300">Seluruh relawan mengabdi secara sukarela tanpa mengambil margin keuntungan pribadi.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form & Verification Column (5 cols) */}
          <div id="verifikasi" className="lg:col-span-5 sticky top-24 space-y-6">
            <DonationVerificationCard />

            <HonestNotice
              type="verified"
              title="Tanda Terima & Bukti Penyaluran"
            >
              Setelah melakukan transfer melalui nomor rekening resmi yang terverifikasi, kirimkan bukti setor ke WhatsApp Sekretariat. Tim bendahara akan mencatat dan mengirimkan e-tanda terima resmi serta tautan dokumentasi kegiatan yang bersangkutan.
            </HonestNotice>
          </div>
        </div>
      </section>

      {/* Goods & In-Kind Support Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F8F9FA] border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="text-stone-700 leading-relaxed">
            Ingin menyalurkan bantuan berupa barang (buku bacaan, sepatu, atau sembako)? Diskusikan pengiriman logistik bersama posko relawan kami di Jayapura.
          </div>
          <a
            href="https://wa.me/6282198004411?text=Halo%20Sekretariat%20SFY%20Papua,%20saya%20ingin%20konsultasi%20bantuan%20barang/logistik"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-900 font-semibold hover:text-[#823296] underline underline-offset-2 shrink-0"
          >
            Hubungi Posko Logistik →
          </a>
        </div>
      </section>
    </div>
  );
}
