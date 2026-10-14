"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";

export function VolunteerForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("Pengajar Literasi & Karakter");
  const [motivation, setMotivation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare formatted WhatsApp text
    const message = `Halo Koordinator Relawan SFY Papua,\n\nSaya berminat bergabung sebagai relawan:\n- Nama: ${name}\n- WhatsApp: ${phone}\n- Domisili/Distrik: ${location}\n- Pilihan Peran: ${role}\n- Motivasi/Keahlian Singkat: ${motivation}\n\nMohon informasi jadwal orientasi dan langkah berikutnya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6282198004411?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs">
      <div className="space-y-2 mb-6">
        <h3 className="text-xl font-bold text-stone-900 tracking-tight">
          Formulir Minat Relawan
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Isi informasi di bawah ini untuk tersambung langsung dengan koordinator relawan kami melalui WhatsApp resmi.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 bg-[#FAF5FD] border border-[#E4D1F0] rounded-2xl text-stone-900 space-y-3">
          <div className="text-[#823296] font-bold text-sm sm:text-base">
            Pesan Pendaftaran Berhasil Disiapkan
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            WhatsApp Anda telah terbuka dengan draf pesan pendaftaran terformat. Silakan tekan &ldquo;Kirim&rdquo; pada aplikasi WhatsApp untuk menyelesaikan koordinasi bersama tim kami.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-xs font-semibold text-[#823296] underline cursor-pointer hover:text-[#702882]"
            >
              Ubah data atau kirim ulang
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Nama Lengkap <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Maria Kogoya / Yusuf Pratama"
              className="w-full px-4 py-3 text-sm rounded-2xl border border-stone-200 bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#823296]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                Nomor WhatsApp <span className="text-red-600">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-3 text-sm rounded-2xl border border-stone-200 bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#823296]"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                Kota / Distrik Domisili <span className="text-red-600">*</span>
              </label>
              <input
                id="location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Jayapura / Sentani / Luar Papua"
                className="w-full px-4 py-3 text-sm rounded-2xl border border-stone-200 bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#823296]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Minat Peran Relawan <span className="text-red-600">*</span>
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-2xl border border-stone-200 bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#823296] cursor-pointer"
            >
              <option value="Pengajar Literasi Al-Qur'an & Karakter">Pengajar Literasi Al-Qur&apos;an & Pelajaran Sekolah</option>
              <option value="Distribusi Sembako Halal & Logistik">Distribusi Sembako Halal & Perlengkapan Belajar</option>
              <option value="Dokumentasi & Publikasi Santun">Fotografi, Video, & Narasi Humanis</option>
              <option value="Pendataan & Asesmen Asrama Yatim">Asesmen Kondisi Asrama Yatim & Keluarga Binaan</option>
              <option value="Dukungan Medis & Kesehatan Santri Yatim">Relawan Medis / Penyuluhan Kesehatan Anak</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="motivation"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
            >
              Motivasi / Keahlian Khusus (Opsional)
            </label>
            <textarea
              id="motivation"
              rows={3}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Ceritakan latar belakang, profesi, atau keterampilan yang ingin disumbangkan..."
              className="w-full px-4 py-3 text-sm rounded-2xl border border-stone-200 bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#823296] resize-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
            >
              Kirim Formulir via WhatsApp Resmi →
            </Button>
          </div>

          <p className="text-[11px] text-stone-500 text-center leading-normal">
            Data Anda hanya digunakan untuk koordinasi internal kerelawanan dan tidak disebarluaskan kepada pihak ketiga.
          </p>
        </form>
      )}
    </div>
  );
}
