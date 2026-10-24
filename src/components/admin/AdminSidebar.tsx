"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  GraduationCap,
  MapPinHouse,
  HeartHandshake,
  Users2,
  Wallet,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  ChevronRight,
  LogOut,
} from "lucide-react";
import {
  getStoredSession,
  clearSession,
  AuthSession,
  roleDisplayNames,
} from "@/lib/auth";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Pendataan Anak Yatim",
    href: "/admin/anak-yatim",
    icon: GraduationCap,
  },
  {
    title: "Pendataan AV (Kordinator)",
    href: "/admin/av",
    icon: MapPinHouse,
  },
  {
    title: "Pendataan Relawan",
    href: "/admin/relawan",
    icon: HeartHandshake,
  },
  {
    title: "Pendataan Donatur",
    href: "/admin/donatur",
    icon: Users2,
  },
  {
    title: "Manajemen Keuangan",
    href: "/admin/keuangan",
    icon: Wallet,
  },
  {
    title: "Kelola User",
    href: "/admin/users",
    icon: ShieldAlert,
  },
  {
    title: "Manajemen Role",
    href: "/admin/roles",
    icon: ShieldCheck,
  },
  {
    title: "Permission Role",
    href: "/admin/permissions",
    icon: KeyRound,
  },
];

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const activeSession = getStoredSession();
    queueMicrotask(() => setSession(activeSession));
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push("/admin/login");
  };

  const displayName = session?.user.nama || "Fajar Maulana, S.Kom";
  const displayRole =
    (session?.user.roleId && roleDisplayNames[session.user.roleId]) ||
    "Super Admin Lembaga";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-[#5E2276] text-white p-5 lg:p-6 select-none overflow-y-auto overscroll-contain">
      {/* Top Section: Brand & Nav */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <Link
            href="/admin"
            className="flex items-center gap-3 group transition-transform active:scale-95"
            onClick={onCloseMobile}
          >
            <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
              <Image
                src="/images/logo.png"
                alt="Logo SFY Papua"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">
                  SFY Papua
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#facc15] text-[#1c0b27]">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-purple-200/80 font-normal">
                Sistem Tata Kelola Amanah
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Menu Admin SFY">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-200/60 px-3 pb-1">
            Menu Operasional
          </div>

          {adminNavItems.slice(0, 6).map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-[#5E2276] shadow-sm font-semibold"
                    : "text-purple-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-[#5E2276]" : "text-purple-200"
                  }`}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}

          <div className="pt-4 text-[10px] font-bold uppercase tracking-wider text-purple-200/60 px-3 pb-1">
            Hak Akses & Pengaturan
          </div>

          {adminNavItems.slice(6).map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-[#5E2276] shadow-sm font-semibold"
                    : "text-purple-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-[#5E2276]" : "text-purple-200"
                  }`}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Operator Card & Public Portal Link */}
      <div className="pt-6 space-y-3">
        {/* Operator Profile Card */}
        <div className="bg-[#48165B] border border-white/10 rounded-2xl p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-[#1C0B27] font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-purple-200 truncate">
                  {displayRole}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-purple-200/90">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sesi Terverifikasi
            </span>
            <span className="text-[10px] font-mono text-purple-300">WIT (UTC+9)</span>
          </div>
        </div>

        {/* Return to Public Website */}
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website Publik</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
