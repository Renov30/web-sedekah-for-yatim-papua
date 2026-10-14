import React from "react";
import type { Metadata } from "next";
import { VolunteerForm } from "@/components/VolunteerForm";
import { SectionHeading } from "@/components/SectionHeading";
import { HonestNotice } from "@/components/HonestNotice";
import { organization } from "@/data/organization";

export const metadata: Metadata = {
  title: "Jadi Relawan",
  description:
    "Bergabunglah bersama gerakan relawan Sedekah for Yatim Papua. Salurkan waktu, empati, dan keahlian untuk mendampingi anak-anak yatim dan dhuafa di Papua.",
};

export default function JadiRelawanPage() {
  const volunteerRoles = [
    {
      title: "Pengajar Literasi & Karakter",
      desc: "Mendampingi kelas belajar gembira akhir pekan, membaca dongeng inspiratif, dan menanamkan nilai-nilai budi pekerti.",
      criteria: "Sabar, menyukai interaksi dengan anak, komunikatif.",
    },
    {
      title: "Logistik & Penyaluran Lapangan",
      desc: "Menyiapkan penyortiran paket sembako, perlengkapan belajar, dan mengantarkannya langsung ke keluarga asuh binaan.",
      criteria: "Cekatan, sehat jasmani, menguasai medan distrik setempat.",
    },
    {
      title: "Dokumentasi & Narasi Humanis",
      desc: "Mengabadikan momen kegiatan secara santun, beretika, serta menuliskan laporan naratif tanpa melanggar martabat anak.",
      criteria: "Peka etika perlindungan anak, memiliki kamera atau ponsel memadai.",
    },
    {
      title: "Pendataan & Asesmen Lapangan",
      desc: "Melakukan verifikasi faktual kondisi rumah tangga calon penerima manfaat dan mengidentifikasi kebutuhan paling mendesak.",
      criteria: "Teliti, obyektif, menjunjung tinggi kejujuran data.",
    },
  ];

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* Inset Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#F4F6F2] border border-[#DFE7DB] p-8 sm:p-14 lg:p-16 overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E4EFE0] text-[#122A1C] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C6F24D]" />
              <span>GABUNG GERAKAN KERELAWANAN</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Langkah Kecil Anda, Cahaya Masa Depan Mereka.
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Kami percaya gerakan sosial yang tangguh tidak diukur dari seberapa megah gedungnya, melainkan seberapa tulus hati para relawannya yang mau turun langsung merangkul sesama.
            </p>
          </div>
        </div>
      </section>

      {/* Main Roles & Application Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Roles & Expectations (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <SectionHeading
                eyebrow="PELUANG KERELAWANAN"
                title="Pilihan Peran Sesuai Keahlian & Waktu Anda"
                description="Setiap orang memiliki peran unik yang dapat disumbangkan bagi kemajuan anak-anak di tanah Papua."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {volunteerRoles.map((role, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <span className="font-mono text-xs font-bold text-[#163821] bg-[#EBF4E5] px-3 py-1 rounded-full inline-block">
                      Divisi 0{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 tracking-tight">
                      {role.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {role.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <strong className="text-stone-700">Karakter utama:</strong> {role.criteria}
                  </div>
                </div>
              ))}
            </div>

            {/* Responsibilities & Safeguarding Pledge */}
            <div className="bg-[#0C1D13] text-stone-100 p-8 rounded-3xl space-y-4">
              <div className="text-[#C6F24D] font-bold text-xs uppercase tracking-wider">
                Komitmen & Tanggung Jawab Relawan
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Menjadi relawan Sedekah for Yatim Papua menuntut kepatuhan mutlak pada prinsip perlindungan anak:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-200">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C6F24D] font-bold shrink-0">—</span>
                  <span>Tidak mengeksploitasi anak untuk konten viral pribadi maupun komersial.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C6F24D] font-bold shrink-0">—</span>
                  <span>Menjaga sopan santun dan menghormati norma adat masyarakat setempat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C6F24D] font-bold shrink-0">—</span>
                  <span>Tidak memungut biaya apa pun dari keluarga penerima manfaat.</span>
                </li>
              </ul>
            </div>

            {/* Application Stages */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Alur Perekrutan Relawan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
                  <span className="font-mono font-bold text-[#163821] block mb-1">01</span>
                  <strong className="block text-stone-900">Kirim Minat</strong>
                  <span className="text-stone-500">Isi formulir via WhatsApp resmi.</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
                  <span className="font-mono font-bold text-[#163821] block mb-1">02</span>
                  <strong className="block text-stone-900">Penyelarasan</strong>
                  <span className="text-stone-500">Sesi sapa & diskusi bersama koordinator.</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
                  <span className="font-mono font-bold text-[#163821] block mb-1">03</span>
                  <strong className="block text-stone-900">Pembekalan</strong>
                  <span className="text-stone-500">Materi Child Safeguarding & etika aksi.</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
                  <span className="font-mono font-bold text-[#163821] block mb-1">04</span>
                  <strong className="block text-stone-900">Turun Aksi</strong>
                  <span className="text-stone-500">Terlibat langsung di jadwal lapangan.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Application Form Component (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <VolunteerForm />

            <HonestNotice
              type="info"
              title="Informasi Bebas Biaya Pendaftaran"
            >
              {organization.volunteerPolicyNotice}
            </HonestNotice>
          </div>
        </div>
      </section>
    </div>
  );
}
