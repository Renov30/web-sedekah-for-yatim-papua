import React from "react";
import Link from "next/link";
import { mainNavigation, actionNavigation } from "@/data/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full transition-all bg-white/95 backdrop-blur-md border-b border-editorial">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <BrandLogo withTagline />
          </div>

          {/* Desktop Navigation (Pill container) */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden lg:flex items-center gap-1 bg-[#F4F5F7] px-3 py-1.5 rounded-full border border-black/5 shadow-2xs"
          >
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-1.5 text-xs font-semibold text-charcoal-700 hover:text-charcoal-950 hover:bg-white rounded-full transition-all"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              href={actionNavigation.donate.href}
              variant="outline"
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
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
