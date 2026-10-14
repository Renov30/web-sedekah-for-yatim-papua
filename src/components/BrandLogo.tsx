import React from "react";
import Link from "next/link";
import Image from "next/image";

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
      className={`group inline-flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
    >
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
        <Image
          src="/images/logo.png"
          alt="Logo Sedekah for Yatim Papua"
          width={48}
          height={48}
          priority
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-black tracking-tight text-lg sm:text-xl leading-tight transition-colors ${
            dark ? "text-white" : "text-[#1A0B23]"
          }`}
        >
          SFY<span className={dark ? "text-[#FACC15]" : "text-[#823296]"}>.</span>Papua
        </span>
        {withTagline && (
          <span
            className={`text-[10px] sm:text-[11px] font-medium tracking-tight leading-none mt-0.5 transition-colors ${
              dark ? "text-white/70" : "text-stone-500"
            }`}
          >
            Sedekah for Yatim Papua
          </span>
        )}
      </div>
    </Link>
  );
}

