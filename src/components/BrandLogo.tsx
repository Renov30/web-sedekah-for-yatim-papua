import React from "react";
import Link from "next/link";

export interface BrandLogoProps {
  dark?: boolean;
  className?: string;
  withTagline?: boolean;
}

export function BrandLogo({
  dark = false,
  className = "",
  withTagline = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Sedekah for Yatim Papua - Kembali ke Beranda"
      className={`group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
    >
      <span
        className={`font-black tracking-tight text-xl sm:text-2xl transition-colors ${
          dark ? "text-white" : "text-[#0C1D13]"
        }`}
      >
        SFY<span className="text-[#84CC16]">.</span>Papua
      </span>
      {withTagline && (
        <span
          className={`hidden md:inline-block text-xs font-medium tracking-tight border-l pl-2.5 py-0.5 ${
            dark ? "border-white/20 text-white/70" : "border-black/15 text-charcoal-600"
          }`}
        >
          Sedekah for Yatim Papua
        </span>
      )}
    </Link>
  );
}
