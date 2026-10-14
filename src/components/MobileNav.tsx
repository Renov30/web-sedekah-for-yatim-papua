"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavigation, actionNavigation } from "@/data/navigation";
import { organization } from "@/data/organization";
import { BrandLogo } from "@/components/BrandLogo";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close helper
  const handleLinkClick = () => setIsOpen(false);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Buka menu navigasi"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        className="px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase border border-editorial text-forest-900 hover:bg-forest-900/5 rounded-xs cursor-pointer"
      >
        Menu
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-over panel */}
      <div
        id="mobile-menu"
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-ivory-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out border-l border-editorial ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
      >
        {/* Top bar inside drawer */}
        <div className="p-5 border-b border-editorial flex items-center justify-between">
          <BrandLogo />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup menu navigasi"
            className="px-3 py-1 text-xs font-semibold tracking-wider uppercase border border-editorial text-charcoal-700 hover:text-charcoal-950 rounded-xs cursor-pointer"
          >
            Tutup [×]
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          <nav aria-label="Navigasi Utama Mobile" className="space-y-1">
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-between py-3 px-3 text-base font-semibold rounded-xs transition-colors ${
                    isActive
                      ? "bg-botanical-500/10 text-botanical-700"
                      : "text-charcoal-800 hover:bg-forest-900/5 hover:text-botanical-600"
                  }`}
                >
                  <span>{item.title}</span>
                  <span className="text-xs text-charcoal-400 font-normal">→</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-editorial space-y-3">
            <Link
              href={actionNavigation.volunteer.href}
              onClick={handleLinkClick}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xs bg-forest-900 text-ivory-50 text-sm font-semibold hover:bg-forest-850 shadow-sm"
            >
              <span>{actionNavigation.volunteer.title}</span>
            </Link>

            <Link
              href={actionNavigation.donate.href}
              onClick={handleLinkClick}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xs bg-botanical-600 text-white text-sm font-semibold hover:bg-botanical-700 shadow-sm"
            >
              <span>{actionNavigation.donate.title}</span>
            </Link>
          </div>

          {/* Official contact snippet */}
          <div className="p-4 bg-forest-900/5 rounded-xs border border-editorial text-xs space-y-2">
            <div className="font-semibold text-charcoal-900">
              Verifikasi Saluran Resmi
            </div>
            <p className="text-charcoal-700 leading-relaxed">
              Pastikan komunikasi dan donasi hanya melalui saluran resmi:
            </p>
            <div className="space-y-1 pt-1 text-charcoal-800 font-medium">
              <div>
                <span className="text-charcoal-500 text-[11px] block">WhatsApp:</span>
                <span>+62 821-9800-4411</span>
              </div>
              <div>
                <span className="text-charcoal-500 text-[11px] block">Email:</span>
                <span>sekretariat@sfypapua.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer footer */}
        <div className="p-4 border-t border-editorial text-center text-xs text-charcoal-600">
          <p>© {new Date().getFullYear()} {organization.name}</p>
        </div>
      </div>
    </div>
  );
}
