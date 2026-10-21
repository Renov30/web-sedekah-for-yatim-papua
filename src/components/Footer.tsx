"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { footerNavigation } from "@/data/navigation";
import { organization } from "@/data/organization";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-20 sm:mt-28 border-t border-stone-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Manifesto Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <BrandLogo withTagline />
            <p className="text-sm text-stone-600 leading-relaxed max-w-md">
              Gerakan kerelawanan independen yang berfokus mendampingi anak-anak yatim di tanah Papua—terutama anak-anak yatim muslim—melalui pemenuhan kebutuhan pendidikan, pangan halal bergizi, serta pembinaan akhlak mulia yang berkelanjutan.
            </p>
          </div>

          {/* Nav Column 1: Navigasi Utama (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerNavigation.primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-stone-600 hover:text-stone-950 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column 2: Program Prioritas (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Pilar Program
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerNavigation.programs.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-stone-600 hover:text-stone-950 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Kontak Resmi & Verifikasi (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Saluran Resmi
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-stone-600">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-semibold mb-0.5">
                  Posko Lapangan
                </span>
                <span className="text-stone-800">{organization.location.note}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-semibold mb-0.5">
                  WhatsApp Koordinasi
                </span>
                <a
                  href="https://wa.me/6282198004411"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-stone-900 hover:text-[#823296] transition-colors underline underline-offset-2"
                >
                  +62 821-9800-4411
                </a>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-semibold mb-0.5">
                  Email Korespondensi
                </span>
                <a
                  href="mailto:sekretariat@sfypapua.org"
                  className="text-stone-800 hover:text-[#823296] transition-colors"
                >
                  sekretariat@sfypapua.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Accountability & Security Notice */}
        <div className="mt-12 p-5 rounded-2xl bg-[#FAF7FC] border border-[#E8DEF0] text-xs text-stone-600 space-y-1.5">
          <p className="font-bold text-stone-900">
            Pemberitahuan Keamanan & Keaslian Donasi:
          </p>
          <p className="leading-relaxed">
            {organization.donationPolicyNotice} Selalu konfirmasikan ke nomor koordinasi resmi sebelum melakukan transaksi donasi apa pun. Kami tidak pernah menggunakan rekening perorangan pribadi yang tidak terverifikasi.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2.5">
            <p>© {currentYear} {organization.name}. Seluruh hak cipta dilindungi.</p>
            <span>•</span>
            <Link
              href="/admin"
              className="text-stone-400 hover:text-[#823296] transition-colors"
            >
              Portal Admin
            </Link>
          </div>
          <div className="text-stone-600 font-medium text-center sm:text-right">
            Dikelola dengan integritas dan ketulusan oleh Relawan Sedekah for Yatim Papua
          </div>
        </div>
      </div>
    </footer>
  );
}

