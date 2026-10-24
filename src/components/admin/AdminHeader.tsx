"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  Radio,
  Calendar,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Users,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Map,
} from "lucide-react";
import {
  getStoredSession,
  clearSession,
  AuthSession,
  MASTER_ADMIN_CREDENTIALS,
  roleDisplayNames,
} from "@/lib/auth";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onToggleCollapse?: () => void;
  isSidebarCollapsed?: boolean;
}

export function AdminHeader({
  onToggleSidebar,
  isSidebarOpen,
  onToggleCollapse,
  isSidebarCollapsed = false,
}: AdminHeaderProps) {
  const router = useRouter();
  const [currentDateString, setCurrentDateString] = useState("");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => setSession(getStoredSession()));

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

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    clearSession();
    router.push("/admin/login");
  };

  const displayName = session?.user.nama || MASTER_ADMIN_CREDENTIALS.nama;
  const firstName = displayName.split(" ")[0];
  const displayEmail = session?.user.email || MASTER_ADMIN_CREDENTIALS.email;
  const displayRole =
    session?.roleName ||
    (session?.user.roleId && roleDisplayNames[session.user.roleId]) ||
    "Super Admin Lembaga";
  const wilayahTugas =
    session?.user.wilayahTugas || MASTER_ADMIN_CREDENTIALS.wilayahTugas;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="px-3 sm:px-6 py-3 sm:py-4 border-b border-stone-100 flex items-center justify-between gap-2 sm:gap-4 bg-white relative z-30">
      {/* Left: Mobile hamburger & Welcome Banner */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Drawer Trigger */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Desktop Sidebar Collapse Toggle */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-xl text-stone-500 hover:text-[#5E2276] hover:bg-purple-50 transition-colors shrink-0 cursor-pointer"
            title={isSidebarCollapsed ? "Perluas Sidebar" : "Kecilkan Sidebar"}
            aria-label="Toggle Sidebar"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#5E2276]" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Welcome Pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#FAF4FC] border border-[#823296]/15 text-[#5E2276] text-xs font-medium max-w-[180px] sm:max-w-none">
          <Radio className="w-3.5 h-3.5 text-[#823296] animate-pulse shrink-0" />
          <span className="truncate">
            <span className="hidden md:inline">Assalamu&apos;alaikum, </span>
            <strong className="font-semibold">{firstName}</strong>
            <span className="hidden sm:inline">
              {" "}
              {displayName.split(" ").slice(1).join(" ")}
            </span>
          </span>
          <span className="hidden lg:inline-block text-[11px] px-2 py-0.5 rounded-full bg-white text-[#5E2276] border border-[#823296]/10 shadow-2xs font-normal">
            {wilayahTugas}
          </span>
        </div>
      </div>

      {/* Right: Quick Date, Notifications & Interactive Account Menu */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Date badge - Desktop only */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 font-medium px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-200/60">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>{currentDateString || "Papua, WIT"}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            className="p-1.5 sm:p-2 rounded-xl text-stone-500 hover:text-[#5E2276] hover:bg-purple-50 transition-colors relative cursor-pointer"
            title="Pemberitahuan Sistem"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>
        </div>

        {/* User Account Trigger & Dropdown Menu */}
        <div
          className="relative pl-1 sm:pl-2 border-l border-stone-200"
          ref={dropdownRef}
        >
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl transition-all cursor-pointer group ${
              isDropdownOpen
                ? "bg-purple-50 ring-1 ring-[#5E2276]/20"
                : "hover:bg-stone-100"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#5E2276] text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              {initials}
            </div>

            <div className="hidden sm:block text-left max-w-[130px] lg:max-w-[160px] truncate">
              <p className="text-xs font-semibold text-stone-900 leading-tight truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-stone-500 leading-tight truncate">
                {displayRole}
              </p>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180 text-[#5E2276]" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu Popup */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Account Identity Summary Header */}
              <div className="px-4 py-3.5 border-b border-stone-100 bg-[#FAF4FC]/70 -mt-2 rounded-t-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5E2276] text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-stone-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {displayEmail}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#5E2276] text-white">
                        {displayRole}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Aktif
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#5E2276]/10 flex items-center gap-1.5 text-[11px] text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-[#5E2276] shrink-0" />
                  <span className="truncate">{wilayahTugas}</span>
                </div>
              </div>

              {/* Action Menu Links */}
              <div className="py-2 px-1.5 space-y-0.5">
                <Link
                  href="/admin/users"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-stone-700 hover:bg-purple-50 hover:text-[#5E2276] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 group-hover:bg-[#5E2276] group-hover:text-white transition-colors">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900 group-hover:text-[#5E2276]">
                      Kelola Pengguna & Staf
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      Daftar akun, atur password & hak akses
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/permissions"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-stone-700 hover:bg-purple-50 hover:text-[#5E2276] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 group-hover:bg-[#5E2276] group-hover:text-white transition-colors">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900 group-hover:text-[#5E2276]">
                      Matriks Hak Akses (RBAC)
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      Pengaturan izin CRUD per modul sistem
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/wilayah"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-stone-700 hover:bg-purple-50 hover:text-[#5E2276] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 group-hover:bg-[#5E2276] group-hover:text-white transition-colors">
                    <Map className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900 group-hover:text-[#5E2276]">
                      Data Wilayah (Distrik & Kampung)
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      Kelola daftar kampung binaan SFY
                    </p>
                  </div>
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-stone-700 hover:bg-stone-50 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 group-hover:bg-stone-200 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900">
                      Buka Website Publik
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      Halaman utama Sedekah for Yatim Papua
                    </p>
                  </div>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="pt-2 px-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Keluar dari Akun (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
