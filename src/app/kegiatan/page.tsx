import React from "react";
import type { Metadata } from "next";
import { activities } from "@/data/activities";
import { ActivityList } from "@/components/ActivityList";
import { HonestNotice } from "@/components/HonestNotice";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Dokumentasi Kegiatan",
  description:
    "Arsip dan dokumentasi aksi nyata di lapangan oleh relawan Sedekah for Yatim Papua, memuat catatan penyaluran, kelas literasi, serta rencana agenda mendatang.",
};

export default function KegiatanPage() {
  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* Header Banner */}
      <section className="w-full bg-[#F4F6F2] border-b border-[#DFE7DB] pt-28 sm:pt-36 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Rekam Jejak Kebaikan & Aksi Nyata Relawan di Papua.
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Setiap amanah sedekah yang tersalurkan didokumentasikan dengan penuh tanggung jawab. Kami menyajikan catatan riil penyaluran paket belajar santri yatim, sembako halal, serta pembinaan akhlak di asrama dan distrik-distrik Papua.
            </p>
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        {/* Honest Notice */}
        <HonestNotice
          type="info"
          title="Prinsip Kejujuran Dokumentasi & Perlindungan Privasi"
        >
          Kegiatan di bawah ini memuat aksi nyata yang telah dilaksanakan di lapangan serta rencana agenda kolaborasi berikutnya yang ditandai dengan label khusus. Untuk melindungi martabat penerima manfaat, kami menerapkan panduan child safeguarding dan tidak mengunggah data pribadi sensitif anak.
        </HonestNotice>

        {/* Interactive Activity List */}
        <ActivityList initialActivities={activities} />
      </section>

      {/* Volunteer Documentation Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-[2.5rem] bg-[#1A0B23] text-stone-100 p-10 sm:p-14 text-center space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FACC15] font-bold block">
            RUANG PENGABDIAN RELAWAN
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Punya Keterampilan Fotografi, Menulis, atau Mengajar?
          </h2>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Kami membutuhkan relawan dokumentasi yang jujur, peka terhadap etika kemanusiaan, serta memiliki hati untuk mengabdi bersama anak-anak di tanah Papua.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button href="/jadi-relawan" variant="primary" size="md">
              Gabung Tim Relawan
            </Button>
            <Button
              href="/transparansi"
              variant="outline"
              size="md"
              className="text-white border-white/20 hover:bg-white/10"
            >
              Lihat Standar Transparansi →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
