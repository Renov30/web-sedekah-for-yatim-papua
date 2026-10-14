"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavigation, actionNavigation } from "@/data/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/Button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomepage = pathname === "/";
  const isDarkHeroHeader = isHomepage && !isScrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <BrandLogo withTagline dark={isDarkHeroHeader} />
          </div>

          {/* Desktop Navigation (Center Pill) */}
          <nav
            aria-label="Navigasi Utama"
            className={`hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 ${
              isDarkHeroHeader
                ? "bg-black/30 backdrop-blur-md border border-white/20 text-white shadow-sm"
                : "bg-[#F6F0FA] border border-[#823296]/10 text-stone-700 shadow-2xs"
            }`}
          >
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  isDarkHeroHeader
                    ? "text-white/85 hover:text-white hover:bg-white/15"
                    : "text-stone-700 hover:text-[#823296] hover:bg-white"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              href={actionNavigation.donate.href}
              variant={isDarkHeroHeader ? "frosted" : "outline"}
              size="sm"
            >
              {actionNavigation.donate.title}
            </Button>

            <Button
              href={actionNavigation.volunteer.href}
              variant="primary"
              size="sm"
            >
              {actionNavigation.volunteer.title}
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <MobileNav dark={isDarkHeroHeader} />
        </div>
      </div>
    </header>
  );
}
