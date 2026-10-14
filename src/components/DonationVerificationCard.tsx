"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";

export function DonationVerificationCard() {
  const [copied, setCopied] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("Paket Perlengkapan Sekolah (SD/SMP)");
  const [donorName, setDonorName] = useState("");

  const officialNumber = "+62 821-9800-4411";
  const officialEmail = "sekretariat@sfypapua.org";

  const handleCopy = () => {
    navigator.clipboard.writeText("+6282198004411");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Halo Bendahara Amanah SFY Papua,\n\nSaya ingin konfirmasi dan meminta nomor rekening resmi lembaga untuk penyaluran donasi:\n- Nama: ${donorName || "Dermawan"}\n- Program yang didukung: ${selectedProgram}\n\nMohon petunjuk rekening resmi yang telah terverifikasi. Terima kasih.`;
    const url = `https://wa.me/6282198004411?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
      {/* Banner */}
      <div className="bg-[#0C1D13] text-stone-100 p-6 sm:p-7 space-y-3">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C6F24D] font-bold block">
          PROTOKOL KEAMANAN TRANSAKSI
        </span>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Informasi Rekening Resmi & Prosedur Donasi
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Kami mematuhi etika transparansi mutlak. Demi mencegah penipuan oleh oknum yang tidak bertanggung jawab, konfirmasi nomor rekening resmi dilakukan melalui saluran koordinasi resmi di bawah ini.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Honest Status Callout */}
        <div className="p-4 rounded-2xl bg-[#FFF9EE] border border-[#F3E2C4] text-xs text-stone-700 space-y-1.5">
          <p className="font-bold text-[#9E5A0A]">
            Transparansi Kanal Pembayaran (Anti Rekening Fiktif):
          </p>
          <p className="leading-relaxed">
            Sesuai regulasi dan etika nirlaba, rekening bank resmi yayasan hanya dibagikan secara terverifikasi dengan surat tugas/konfirmasi resmi. Kami <strong>tidak menampilkan rekening perorangan pribadi</strong> di halaman publik tanpa verifikasi langsung guna menjamin keamanan dana amanah Anda.
          </p>
        </div>

        {/* Form to Request Account via Official WhatsApp */}
        <form onSubmit={handleConfirmWhatsApp} className="space-y-4">
          <h4 className="font-bold text-sm text-stone-900">
            Minta Detail Rekening Resmi Lembaga:
          </h4>

          <div>
            <label
              htmlFor="donorName"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
            >
              Nama Anda / Hamba Allah
            </label>
            <input
              id="donorName"
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Masukkan nama atau inisial Anda..."
              className="w-full px-4 py-3 text-sm rounded-2xl border border-stone-200 bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C1D13]"
            />
          </div>

          <div>
            <label
              htmlFor="program"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
            >
              Alokasi Program yang Ingin Didukung
            </label>
            <select
              id="program"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-2xl border border-stone-200 bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C1D13] cursor-pointer"
            >
              <option value="Paket Perlengkapan Sekolah & Madrasah Santri Yatim">Paket Perlengkapan Sekolah & Madrasah Santri Yatim</option>
              <option value="Paket Sembako Halal & Nutrisi Keluarga Yatim">Paket Sembako Halal & Nutrisi Keluarga Yatim</option>
              <option value="Bantuan Operasional Asrama & TPQ Belajar Yatim">Bantuan Operasional Asrama & TPQ Belajar Yatim</option>
              <option value="Sedekah Bebas / Sesuai Kebutuhan Mendesak Yatim">Sedekah Bebas / Sesuai Kebutuhan Mendesak Yatim</option>
            </select>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Minta No. Rekening Resmi via WhatsApp →
          </Button>
        </form>

        {/* Official Channels Copy Box */}
        <div className="pt-4 border-t border-stone-100 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Saluran Korespondensi Resmi Bendahara:
          </p>

          <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-stone-200/80 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-[11px] text-stone-500 block">WhatsApp Resmi Sekretariat:</span>
              <span className="font-semibold text-stone-900">{officialNumber}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer shadow-2xs"
            >
              {copied ? "Tersalin ✓" : "Salin Nomor"}
            </button>
          </div>

          <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-stone-200/80 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-[11px] text-stone-500 block">Email Konfirmasi Donasi:</span>
              <span className="font-semibold text-stone-900">{officialEmail}</span>
            </div>
            <a
              href={`mailto:${officialEmail}?subject=Konfirmasi%20Donasi%20SFY%20Papua`}
              className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 text-xs font-medium text-stone-700 hover:bg-stone-50 shadow-2xs"
            >
              Kirim Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
