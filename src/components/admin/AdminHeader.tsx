"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  Radio,
  Calendar,
  LogOut,
} from "lucide-react";
import { getStoredSession, clearSession, AuthSession } from "@/lib/auth";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function AdminHeader({
  onToggleSidebar,
  isSidebarOpen,
}: AdminHeaderProps) {
  const router = useRouter();
  const [currentDateString, setCurrentDateString] = useState("");
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(getStoredSession());

    const updateTime = () => {
      const now = new Date();
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

  const handleLogout = () => {
    clearSession();
    router.push("/admin/login");
  };

  const displayName = session?.user.nama || "Fajar Maulana";
  const firstName = displayName.split(" ")[0];
  const displayEmail = session?.user.email || "admin@sfypapua.org";
  const wilayahTugas = session?.user.wilayahTugas || "Sekretariat Pusat Merauke (Papua Selatan)";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="px-3 sm:px-6 py-3 sm:py-4 border-b border-stone-100 flex items-center justify-between gap-2 sm:gap-4 bg-white">
      {/* Left: Mobile hamburger & Welcome Banner */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Welcome Pill (Responsive compact on mobile) */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#FAF4FC] border border-[#823296]/15 text-[#5E2276] text-xs font-medium max-w-[180px] sm:max-w-none">
          <Radio className="w-3.5 h-3.5 text-[#823296] animate-pulse shrink-0" />
          <span className="truncate">
            <span className="hidden md:inline">Assalamu&apos;alaikum, </span>
            <strong className="font-semibold">{firstName}</strong>
            <span className="hidden sm:inline"> {displayName.split(" ").slice(1).join(" ")}</span>
          </span>
          <span className="hidden lg:inline-block text-[11px] px-2 py-0.5 rounded-full bg-white text-[#5E2276] border border-[#823296]/10 shadow-2xs font-normal">
            {wilayahTugas}
          </span>
        </div>
      </div>

      {/* Right: Quick Date, Notifications & Account */}
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {/* Date badge - Desktop only */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 font-medium px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-200/60">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>{currentDateString || "Papua, WIT"}</span>
        </div>

        {/* Minimal Notification Bell */}
        <div className="relative">
          <button
            type="button"
            className="p-1.5 sm:p-2 rounded-xl text-stone-500 hover:text-[#5E2276] hover:bg-purple-50 transition-colors relative"
            title="Pemberitahuan Sistem"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>
        </div>

        {/* User Profile Mini Badge */}
        <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-stone-200">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#823296] text-white flex items-center justify-center text-[11px] sm:text-xs font-bold shadow-2xs shrink-0"
            title={displayName}
          >
            {initials}
          </div>
          <div className="hidden sm:block text-left max-w-[140px] truncate">
            <p className="text-xs font-semibold text-stone-900 leading-tight truncate">
              {displayEmail}
            </p>
            <p className="text-[10px] text-stone-500 leading-tight truncate">
              {session?.roleName || "Akses Penuh"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar dari akun"
            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
