import React from "react";
import Image from "next/image";
import Link from "next/link";
import { organization } from "@/data/organization";
import { programs } from "@/data/programs";
import { Button } from "@/components/Button";
import { InteractiveAccordion } from "@/components/InteractiveAccordion";

export default function HomePage() {
  const whyItWorksItems = [
    {
      id: "w-1",
      number: "01",
      title: "Verifikasi Lapangan Langsung",
      content:
        "Relawan meninjau langsung kondisi tempat tinggal anak asuh di Jayapura dan Sentani untuk memastikan kebutuhan perlengkapan sekolah dan pangan terdata secara akurat.",
    },
    {
      id: "w-2",
      number: "02",
      title: "Pengadaan Berbasis Pedagang Lokal Papua",
      content:
        "Seluruh paket sembako dan kebutuhan logistik dibelanjakan langsung di pasar-pasar lokal Papua untuk menjamin kesegaran pangan sekaligus memberdayakan pedagang setempat.",
    },
    {
      id: "w-3",
      number: "03",
      title: "Pendampingan Belajar & Ruang Aman Anak",
      content:
        "Bantuan materi diimbangi dengan kelas belajar akhir pekan, membaca dongeng inspiratif, serta bimbingan moral yang menghormati kenyamanan anak.",
    },
    {
      id: "w-4",
      number: "04",
      title: "Perlindungan Martabat Anak (Child Safeguarding)",
      content:
        "Kami menolak eksploitasi visual kemiskinan demi memancing rasa iba. Seluruh dokumentasi menjaga kehormatan anak dan mematuhi etika keselamatan anak.",
    },
    {
      id: "w-5",
      number: "05",
      title: "Pelaporan Rekapitulasi Terbuka Tanpa Rekayasa",
      content:
        "Pencatatan nota riil dan rekapitulasi penyaluran per aksi dilaporkan secara terbuka tanpa melebih-lebihkan angka atau membuat statistik fiktif.",
    },
  ];

  const faqItems = [
    {
      id: "faq-1",
      title: "Bagaimana donasi disalurkan kepada anak-anak yatim binaan?",
      content:
        "Donasi disalurkan dalam bentuk paket perlengkapan sekolah langsung (tas, seragam, sepatu, buku teks) dan sembako bernutrisi tinggi yang diserahkan langsung oleh relawan kepada anak di hadapan wali asuh.",
    },
    {
      id: "faq-2",
      title: "Apakah Sedekah for Yatim Papua memiliki nomor rekening resmi?",
      content:
        "Ya. Demi keamanan donatur dan mencegah penipuan oleh oknum yang mengatasnamakan lembaga, nomor rekening resmi dibagikan dengan konfirmasi langsung melalui WhatsApp Sekretariat di +62 821-9800-4411.",
    },
    {
      id: "faq-3",
      title: "Bagaimana proses seleksi dan orientasi relawan baru?",
      content:
        "Pendaftaran diawali dengan pengisian formulir minat, sesi penyelarasan nilai bersama koordinator, dan pembekalan etika perlindungan anak (Child Safeguarding) sebelum terjun ke jadwal aksi lapangan.",
    },
    {
      id: "faq-4",
      title: "Apakah ada pungutan biaya dalam pendaftaran relawan?",
      content:
        "Sama sekali tidak ada. Seluruh proses pendaftaran dan pembekalan relawan bersifat 100% gratis dan berlandaskan gotong royong kerelawanan.",
    },
    {
      id: "faq-5",
      title: "Bagaimana cara memverifikasi keaslian kegiatan SFY Papua?",
      content:
        "Anda dapat memeriksa dokumentasi riil pada laman Kegiatan, menghubungi koordinator kami di posko Jayapura, atau meminta salinan rekapitulasi penyaluran resmi melalui email sekretariat@sfypapua.org.",
    },
  ];

  return (
    <div className="flex flex-col bg-[#F8F9FA] min-h-screen">
      {/* =========================================================================
          1. HERO SECTION: Framed scenic landscape backdrop with giant wordmark
      ========================================================================= */}
      <section className="px-3 sm:px-5 lg:px-6 pt-3 sm:pt-4 pb-12 sm:pb-16">
        <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-forest-950">
          {/* Background Landscape Photo */}
          <Image
            src="/images/hero-landscape.jpg"
            alt="Lansekap alam hijau pegunungan Papua yang asri dan cerah"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Atmospheric vignette overlays to ensure readable text */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/30 to-forest-950/50" />

          {/* Top-Left Hero Content */}
          <div className="relative z-10 max-w-2xl space-y-5 pt-4 sm:pt-8">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Menumbuhkan Harapan, Menguatkan Masa Depan Anak Papua.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-xl font-normal">
              {organization.heroSupportingCopy}
            </p>

            {/* Pill Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Button
                href="/jadi-relawan"
                variant="primary"
                size="md"
              >
                Jadi Relawan
              </Button>

              <Button
                href="/program"
                variant="frosted"
                size="md"
              >
                Kenali Program Kami →
              </Button>
            </div>
          </div>

          {/* Bottom Giant Typographic Wordmark (Greenova Style) */}
          <div className="relative z-10 pt-16 sm:pt-24 select-none pointer-events-none">
            <div className="text-4xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9.5rem] font-black text-white/95 tracking-tighter leading-none opacity-90">
              SFY<span className="text-[#C6F24D]">.</span>Papua
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. BENTO PHOTO GRID: Editorial split with asymmetric rounded cards
      ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 max-w-7xl mx-auto w-full space-y-12">
        {/* Header: Bullet Eyebrow + Large Editorial Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
              Tentang Kami
            </span>
          </div>

          <div className="lg:col-span-9">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-950 tracking-tight leading-snug">
              Dari ruang belajar pelosok hingga pemenuhan nutrisi harian, menyalakan harapan bagi masa depan generasi anak-anak di tanah Papua.
            </h2>
          </div>
        </div>

        {/* 4-Card Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Card 1 (Large Left): Documentary photo with bottom pill overlay */}
          <div className="md:col-span-6 lg:col-span-6 relative aspect-4/3 sm:aspect-5/4 md:aspect-auto md:min-h-[460px] rounded-3xl overflow-hidden shadow-xs bg-ivory-200 group">
            <Image
              src="/images/hero-community.jpg"
              alt="Anak-anak dan relawan berkumpul dengan penuh keceriaan"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 inset-x-6 space-y-2 text-white">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                Aksi Lapangan Berkelanjutan
              </span>
              <p className="text-sm sm:text-base font-semibold leading-snug">
                Pendampingan langsung ke pintu-pintu keluarga asuh di wilayah Jayapura dan distrik sekitarnya.
              </p>
            </div>
          </div>

          {/* Right Column (Subdivided into Top Card + Bottom 2 Subcards) */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col gap-5 sm:gap-6">
            {/* Card 2 (Top Right): Wide Community Photo */}
            <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden shadow-xs bg-ivory-200 group">
              <Image
                src="/images/about-story.jpg"
                alt="Relawan berdiskusi dan berkoordinasi bersama"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-5 inset-x-5 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C6F24D] block mb-1">
                  Gotong Royong
                </span>
                <h3 className="text-base sm:text-lg font-bold leading-snug">
                  Kemitraan Erat Bersama Tokoh & Komunitas Lokal Papua
                </h3>
              </div>
            </div>

            {/* Bottom Row: Two Subcards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 flex-1">
              {/* Card 3: Fresh Lime Accent Card with Stat */}
              <div className="bg-[#C6F24D] text-[#0C1D13] p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider font-bold text-black/60">
                  Prinsip Amanah
                </span>
                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                    100%
                  </div>
                  <p className="text-xs sm:text-sm font-semibold leading-snug pt-1">
                    Penyaluran langsung tanpa perantara fiktif dan tanpa potongan tak bertanggung jawab.
                  </p>
                </div>
                <Link
                  href="/transparansi"
                  className="text-xs font-bold underline underline-offset-2 hover:opacity-80"
                >
                  Pelajari Transparansi →
                </Link>
              </div>

              {/* Card 4: Location Landscape Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-xs bg-ivory-200 min-h-[180px] group">
                <Image
                  src="/images/nature-leaf.jpg"
                  alt="Harmoni alam hijau tanah Papua"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-5 inset-x-5 text-white space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#C6F24D] block">
                    Wilayah Jangkauan
                  </span>
                  <p className="text-xs font-bold leading-tight">
                    Jayapura, Sentani, & Distrik Terdekat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. ACCORDION SPLIT SECTION: "Smarter energy, with clear and proven impact"
      ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto w-full space-y-12">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
              Bagaimana Kami Bekerja
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-950 tracking-tight leading-snug">
              Pendekatan Humanis dengan Akuntabilitas yang Nyata.
            </h2>
          </div>

          <div className="lg:col-span-5 text-sm sm:text-base text-charcoal-700 leading-relaxed">
            Kami memastikan setiap donasi dan tenaga relawan berbuah manfaat terukur bagi pendidikan dan kesejahteraan anak-anak yatim di Papua.
          </div>
        </div>

        {/* Split Accordion & Large Photo Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Interactive Highlight Accordion */}
          <div className="lg:col-span-6">
            <InteractiveAccordion
              items={whyItWorksItems}
              defaultOpenId="w-2"
              variant="highlight"
            />
          </div>

          {/* Right: Large Crisp Photograph */}
          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 sm:aspect-16/11 rounded-3xl overflow-hidden shadow-sm bg-ivory-200">
              <Image
                src="/images/program-basic-needs.jpg"
                alt="Penyaluran paket bahan pokok dan nutrisi bagi anak-anak"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 inset-x-6 text-white text-xs sm:text-sm font-medium">
                Penyaluran terverifikasi di distrik Sentani bersama keluarga asuh binaan.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HORIZONTAL PROGRAMS GALLERY: "Powering a cleaner, smarter future"
      ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-white border-y border-editorial">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
              Pilar Program
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-950 tracking-tight">
                Empat Pilar Aksi untuk Kemandirian Anak Papua
              </h2>
              <Button href="/program" variant="outline" size="sm">
                Lihat Semua Program →
              </Button>
            </div>
          </div>

          {/* 4 Tall Photographic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => (
              <Link
                key={program.id}
                href={`/program#${program.id}`}
                className="group flex flex-col space-y-4"
              >
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-ivory-200 shadow-2xs">
                  <Image
                    src={program.image}
                    alt={program.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {program.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-charcoal-950 group-hover:text-botanical-700 transition-colors leading-snug">
                    {program.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                    {program.shortSummary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ACTIVITIES & FIELD STORIES: "What Our Customers Say" style
      ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto w-full space-y-12">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
            Cerita Lapangan
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-950 tracking-tight">
            Aksi Nyata & Catatan dari Komunitas
          </h2>
        </div>

        {/* 3 Story Cards with Middle Documentary Photo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Story Card 1 */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-editorial shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-charcoal-400 block">
                CATATAN 01
              </span>
              <p className="text-sm sm:text-base text-charcoal-800 leading-relaxed font-medium">
                &ldquo;Melihat anak-anak di Sentani menyambut paket buku tulis dengan mata berbinar menegaskan bahwa langkah kecil kita benar-benar menyalakan harapan mereka.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-editorial text-xs text-charcoal-600">
              <strong className="text-charcoal-900 block font-semibold">Sarah Maria K.</strong>
              <span>Relawan Bimbingan Literasi Sentani</span>
            </div>
          </div>

          {/* Center Documentary Photo Card */}
          <div className="relative min-h-[300px] rounded-3xl overflow-hidden shadow-xs bg-ivory-200">
            <Image
              src="/images/activity-mentoring.jpg"
              alt="Suasana membaca dan belajar bersama anak-anak"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 inset-x-5 text-white text-xs font-medium">
              Kelas belajar gembira akhir pekan di posko Abepura, Kota Jayapura.
            </div>
          </div>

          {/* Story Card 2 */}
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-editorial shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-charcoal-400 block">
                CATATAN 02
              </span>
              <p className="text-sm sm:text-base text-charcoal-800 leading-relaxed font-medium">
                &ldquo;Setiap paket sembako dibelanjakan langsung di pasar lokal untuk memastikan kesegaran pangan sekaligus mendukung para pedagang mama-mama Papua.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-editorial text-xs text-charcoal-600">
              <strong className="text-charcoal-900 block font-semibold">Robert Wanimbo</strong>
              <span>Relawan Logistik & Penyaluran</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FAQ SECTION: Split Layout with Left CTA and Right Accordions
      ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-white border-y border-editorial">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Title & Contact CTA */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
              Tanya Jawab
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-950 tracking-tight leading-snug">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Masih memiliki pertanyaan seputar alokasi donasi, verifikasi rekening resmi, atau pendaftaran relawan?
            </p>
            <div className="pt-2">
              <Button
                href="https://wa.me/6282198004411"
                external
                variant="dark"
                size="md"
              >
                Hubungi Sekretariat →
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Accordion */}
          <div className="lg:col-span-7">
            <InteractiveAccordion items={faqItems} defaultOpenId="faq-1" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CLOSING CTA BANNER: Immersive landscape photo card ("Ready to Power...")
      ========================================================================= */}
      <section className="px-3 sm:px-5 lg:px-6 py-12 sm:py-16">
        <div className="relative w-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden p-8 sm:p-14 lg:p-20 text-center flex flex-col items-center justify-center space-y-6 shadow-sm bg-forest-950">
          <Image
            src="/images/hero-landscape.jpg"
            alt="Lansekap alam pegunungan Papua"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-40"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Siap Menumbuhkan Harapan Bersama Kami?
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
              Bergabunglah sebagai relawan lapangan atau salurkan bantuan melalui kanal resmi terverifikasi untuk menguatkan masa depan anak-anak di tanah Papua.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button href="/jadi-relawan" variant="primary" size="md">
              Daftar Jadi Relawan
            </Button>
            <Button href="/donasi" variant="frosted" size="md">
              Salurkan Donasi Resmi
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
