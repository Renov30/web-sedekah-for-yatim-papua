import React from "react";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6 p-8 sm:p-12 bg-white rounded-3xl border border-stone-200/80 shadow-xs">
        <div className="inline-block px-5 py-2 rounded-full bg-[#EBF4E5] text-[#163821] font-mono text-lg font-bold">
          404
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#163821] font-bold block">
            Halaman Tidak Ditemukan
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Tampaknya Jalur Ini Belum Tersedia
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Halaman yang Anda cari mungkin telah dipindahkan, diperbarui, atau alamat tautan yang dimasukkan kurang tepat.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" variant="primary" size="md">
            Kembali ke Beranda
          </Button>

          <Button href="/program" variant="outline" size="md">
            Jelajahi Program →
          </Button>
        </div>
      </div>
    </div>
  );
}
