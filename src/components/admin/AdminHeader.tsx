"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  Search,
  Radio,
  Clock,
  Calendar,
  CheckCircle2,
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
  const displayEmail = session?.user.email || "admin@sfypapua.org";
  const wilayahTugas = session?.user.wilayahTugas || "Sekretariat Pusat Jayapura";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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

        {/* Welcome Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FAF4FC] border border-[#823296]/15 text-[#5E2276] text-xs font-medium">
          <Radio className="w-3.5 h-3.5 text-[#823296] animate-pulse" />
          <span className="truncate">
            Assalamu&apos;alaikum, <strong className="font-semibold">{displayName}</strong>
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-white text-[#5E2276] border border-[#823296]/10 shadow-2xs font-normal">
            {wilayahTugas}
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

        {/* User Profile Mini Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
          <div className="w-8 h-8 rounded-full bg-[#823296] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-stone-900 leading-tight">
              {displayEmail}
            </p>
            <p className="text-[10px] text-stone-500 leading-tight">
              {session?.roleName || "Akses Penuh"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar dari akun"
            className="hidden sm:inline-flex p-1.5 ml-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
