"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Menu,
  X,
  Search,
  Radio,
  Clock,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function AdminHeader({
  onToggleSidebar,
  isSidebarOpen,
}: AdminHeaderProps) {
  const [currentDateString, setCurrentDateString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Formatter in Indonesian locale with WIT
      const formatted = new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(now);
      setCurrentDateString(formatted);
    };

    updateTime();
  }, []);

  return (
    <header className="px-6 py-4 border-b border-stone-100 flex items-center justify-between gap-4 bg-white">
      {/* Left: Mobile hamburger & Welcome Banner */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Welcome Pill inspired by reference image */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FAF4FC] border border-[#823296]/15 text-[#5E2276] text-xs font-medium">
          <Radio className="w-3.5 h-3.5 text-[#823296] animate-pulse" />
          <span className="truncate">
            Assalamu&apos;alaikum, <strong className="font-semibold">Fajar Maulana</strong>
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-white text-[#5E2276] border border-[#823296]/10 shadow-2xs font-normal">
            Wilayah Jayapura
          </span>
        </div>
      </div>

      {/* Right: Quick Date, Notifications & Account */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Date badge */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 font-medium px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-200/60">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>{currentDateString || "Papua, WIT"}</span>
        </div>

        {/* Minimal Notification Bell */}
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-xl text-stone-500 hover:text-[#5E2276] hover:bg-purple-50 transition-colors relative"
            title="Pemberitahuan Sistem"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>
        </div>

        {/* User Profile Mini Badge (as in reference image) */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
          <div className="w-8 h-8 rounded-full bg-[#823296] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            FM
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-stone-900 leading-tight">
              admin@sfypapua.org
            </p>
            <p className="text-[10px] text-stone-500 leading-tight">
              Akses Penuh
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

