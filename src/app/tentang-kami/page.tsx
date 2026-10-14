import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { organization } from "@/data/organization";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { HonestNotice } from "@/components/HonestNotice";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal lebih dekat gerakan Sedekah for Yatim Papua, visi misi, nilai kemanusiaan, serta komitmen menjaga martabat anak yatim dan dhuafa di Papua.",
};

export default function TentangKamiPage() {
  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* Editorial Header Banner */}
      <section className="w-full bg-[#F4F6F2] border-b border-[#DFE7DB] pt-28 sm:pt-36 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Memuliakan Amanah, Mendampingi Anak Yatim di Bumi Cenderawasih.
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Inisiatif kerelawanan independen yang berfokus mendampingi anak-anak yatim di tanah Papua—terutama anak-anak yatim muslim—melalui aksi langsung yang amanah, transparan, dan berakar pada ukhuwah komunitas lokal.
            </p>
          </div>
        </div>
      </section>

      {/* Background & Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Story Column */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              eyebrow="LATAR BELAKANG GERAKAN"
              title="Lahir dari Kepedulian Memuliakan Anak Yatim"
            />

            <div className="text-stone-600 space-y-4 text-sm sm:text-base leading-relaxed">
              <p>
                Tanah Papua dianugerahi keindahan alam yang megah dan kearifan masyarakat yang luhur. Namun, di berbagai distrik perkotaan hingga pelosok, banyak anak-anak yatim dan keluarga dhuafa menghadapi keterbatasan nyata untuk mendapatkan perlengkapan sekolah yang layak, pangan halal bergizi, serta pembinaan akhlak dan Al-Qur&apos;an secara teratur.
              </p>
              <p>
                <strong className="text-stone-900">Sedekah for Yatim Papua</strong> bermula dari ikhtiar tulus lingkaran relawan pemuda muslim dan tokoh masyarakat lokal di Jayapura yang tergerak menyisihkan waktu, tenaga, dan sebagian rezeki untuk mengantarkan bantuan langsung ke asrama santri yatim, pondok pesantren dhuafa, serta pintu-pintu rumah keluarga asuh.
              </p>
              <p>
                Kami meyakini bahwa menyantuni anak yatim adalah amanah ibadah yang sangat mulia. Bantuan yang diserahkan harus menjunjung tinggi adab dan kehormatan anak—tidak dijadikan komoditas visual kemiskinan, melainkan diperlakukan sebagai hak suci saudara kita yang dititipkan melalui tangan-tangan para dermawan.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button href="/program" variant="primary" size="md">
                Lihat Program Kami →
              </Button>
              <Button href="/transparansi" variant="outline" size="md">
                Komitmen Transparansi →
              </Button>
            </div>
          </div>

          {/* Right Photo Column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-sm bg-stone-200">
              <Image
                src="/images/about-story.jpg"
                alt="Relawan berdiskusi dan merencanakan pendampingan anak asuh"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 text-white text-xs space-y-1">
                <p className="font-semibold text-[#C6F24D] text-sm">Gotong Royong Komunitas</p>
                <p className="text-stone-200 leading-relaxed">
                  Membangun ruang aman dan penuh kasih bagi tumbuh kembang anak-anak Papua.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#0C1D13] text-stone-100 rounded-[2.5rem] p-8 sm:p-14 lg:p-16 space-y-12">
          <SectionHeading
            dark
            align="center"
            eyebrow="ARAH PANDANG GERAKAN"
            title="Visi & Misi Keberlanjutan"
            description="Fondasi nilai dan sasaran kerja yang membimbing setiap langkah aksi kerelawanan kami."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Vision Card */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-xs p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-[#C6F24D]">
                  VISI UTAMA
                </span>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                  &ldquo;{organization.vision}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 text-xs text-stone-300">
                Menjadi jembatan kebaikan yang mandiri, jujur, dan berakar pada kearifan lokal tanah Papua.
              </div>
            </div>

            {/* Mission List */}
            <div className="lg:col-span-7 bg-white/5 backdrop-blur-xs p-8 rounded-3xl border border-white/10 space-y-5">
              <span className="text-xs uppercase tracking-widest font-bold text-[#C6F24D]">
                MISI KERJA
              </span>
              <ul className="space-y-4">
                {organization.mission.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <span className="font-mono text-xs font-bold text-[#0C1D13] bg-[#C6F24D] px-2.5 py-0.5 rounded-full mt-0.5 shrink-0">
                      0{idx + 1}
                    </span>
                    <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <SectionHeading
          eyebrow="NILAI-NILAI UTAMA"
          title="Enam Prinsip Moral yang Membimbing Langkah Kami"
          description="Nilai-nilai ini dijunjung tinggi oleh setiap relawan dan pengurus dalam berinteraksi dengan anak-anak binaan serta mengelola amanah donatur."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organization.values.map((val, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 hover:border-stone-400 transition-colors"
            >
              <div className="font-mono text-xs font-bold text-[#163821] bg-[#EBF4E5] px-3 py-1 rounded-full inline-block">
                Nilai 0{idx + 1}
              </div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                {val.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Child Safeguarding & Dignity Policy */}
      <section id="martabat-anak" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#F8F9FA] rounded-[2.5rem] border border-stone-200/80 p-8 sm:p-12 lg:p-14 space-y-8">
          <div className="max-w-3xl space-y-4">
            <SectionHeading
              eyebrow="ETIKA PERLINDUNGAN ANAK"
              title="Komitmen Perlindungan Martabat & Keamanan Anak"
              description="Kami menerapkan standar ketat dalam hal dokumentasi dan interaksi relawan dengan anak binaan."
            />

            <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
              <p>
                Dalam setiap kegiatan lapangan, Sedekah for Yatim Papua memegang teguh pedoman keselamatan anak (Child Safeguarding):
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3.5 bg-white p-5 rounded-2xl border border-stone-200/80">
                  <span className="font-mono text-xs font-bold text-[#163821] bg-[#EBF4E5] px-2.5 py-0.5 rounded-full mt-0.5 shrink-0">
                    01
                  </span>
                  <span><strong className="text-stone-900">Larangan Eksploitasi Visual:</strong> Kami tidak mengambil foto dramatisasi kemiskinan atau tangisan anak demi memancing belas kasihan publik.</span>
                </li>
                <li className="flex items-start gap-3.5 bg-white p-5 rounded-2xl border border-stone-200/80">
                  <span className="font-mono text-xs font-bold text-[#163821] bg-[#EBF4E5] px-2.5 py-0.5 rounded-full mt-0.5 shrink-0">
                    02
                  </span>
                  <span><strong className="text-stone-900">Perlindungan Privasi:</strong> Alamat spesifik kediaman keluarga asuh dan data pribadi rahasia anak tidak dipublikasikan ke ranah publik terbuka.</span>
                </li>
                <li className="flex items-start gap-3.5 bg-white p-5 rounded-2xl border border-stone-200/80">
                  <span className="font-mono text-xs font-bold text-[#163821] bg-[#EBF4E5] px-2.5 py-0.5 rounded-full mt-0.5 shrink-0">
                    03
                  </span>
                  <span><strong className="text-stone-900">Persetujuan Wali:</strong> Setiap keterlibatan anak dalam program belajar bersama didasarkan atas izin sukarela dari wali/keluarga asuh.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Structure / Honest Governance Note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="TATA KELOLA & KEPENGURUSAN"
            title="Transparansi Struktur Kelembagaan"
            description="Sebagai wujud kejujuran publik, kami menyampaikan status kelembagaan saat ini secara terbuka."
          />

          <HonestNotice
            type="info"
            title="Status Kepengurusan & Proses Legalitas Yayasan"
          >
            {organization.governanceNote} Saat ini seluruh aksi diorganisasi oleh koordinator relawan independen dan dewan inisiator lokal di Jayapura. Nama-nama pengurus definitif, pembina, serta nomor pengesahan Kementerian Hukum dan HAM akan dipublikasikan secara terbuka pada laman ini begitu proses administrasi selesai.
          </HonestNotice>

          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200/80 space-y-4">
            <h4 className="font-bold text-sm text-stone-900">
              Pilar Koordinasi Lapangan Saat Ini:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
              <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-stone-100">
                <span className="font-semibold block text-stone-900 text-sm mb-1">Koordinator Wilayah</span>
                <span>Jayapura, Sentani, & Keerom</span>
              </div>
              <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-stone-100">
                <span className="font-semibold block text-stone-900 text-sm mb-1">Divisi Logistik & Sembako</span>
                <span>Penyaluran & Belanja Lokal</span>
              </div>
              <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-stone-100">
                <span className="font-semibold block text-stone-900 text-sm mb-1">Divisi Pendidikan & Ajar</span>
                <span>Kakak Relawan Literasi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-[2.5rem] bg-[#0C1D13] text-stone-100 p-10 sm:p-14 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Ingin Berdiskusi Lebih Jauh Bersama Tim Kami?
          </h2>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Kami menyambut hangat kolaborasi komunitas, donatur, maupun calon relawan yang ingin bersilaturahmi dan memverifikasi kegiatan kami.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button href="/jadi-relawan" variant="primary" size="md">
              Daftar Jadi Relawan
            </Button>
            <Button
              href="https://wa.me/6282198004411"
              external
              variant="outline"
              size="md"
              className="text-white border-white/20 hover:bg-white/10"
            >
              Hubungi Sekretariat via WhatsApp →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
