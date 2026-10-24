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
  Map,
  ExternalLink,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  getStoredSession,
  clearSession,
  AuthSession,
  roleDisplayNames,
} from "@/lib/auth";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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
    title: "Pendataan AV",
    href: "/admin/av",
    icon: MapPinHouse,
  },
  {
    title: "Master Wilayah",
    href: "/admin/wilayah",
    icon: Map,
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

export function AdminSidebar({
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
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

  const displayName = session?.user.nama || "Master Admin SFY";
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
    <aside
      className={`w-full h-full flex flex-col justify-between bg-[#5E2276] text-white select-none overflow-y-auto overscroll-contain transition-all duration-300 ${
        isCollapsed ? "p-3 py-5" : "p-5 lg:p-6"
      }`}
    >
      {/* Top Section: Brand & Nav */}
      <div className="space-y-5">
        {/* Brand Header */}
        {isCollapsed ? (
          // Collapsed Brand Header: Centered Logo + Expand Toggle
          <div className="flex flex-col items-center gap-2 pb-3 border-b border-white/10">
            <Link
              href="/admin"
              className="flex items-center justify-center group transition-transform active:scale-95"
              title="SFY Papua - Dashboard"
              onClick={onCloseMobile}
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md hover:ring-2 hover:ring-purple-300 transition-all">
                <Image
                  src="/images/logo.png"
                  alt="Logo SFY Papua"
                  width={30}
                  height={30}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Perluas Sidebar"
                className="hidden lg:flex p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          // Expanded Brand Header: Logo + Full Titles + Collapse Toggle
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Link
              href="/admin"
              className="flex items-center gap-3 group transition-transform active:scale-95 min-w-0"
              onClick={onCloseMobile}
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Logo SFY Papua"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-white truncate">
                    SFY Papua
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#facc15] text-[#1c0b27] shrink-0">
                    Admin
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 font-normal truncate">
                  Sistem Tata Kelola Amanah
                </p>
              </div>
            </Link>

            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Kecilkan Sidebar"
                className="hidden lg:flex p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-1"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Menu Admin SFY">
          {!isCollapsed && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-200/60 px-3 pb-1">
              Menu Operasional
            </div>
          )}

          {adminNavItems.slice(0, 7).map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            if (isCollapsed) {
              return (
                <div key={item.href} className="relative group flex justify-center">
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    aria-label={item.title}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                      isActive
                        ? "bg-white text-[#5E2276] shadow-sm font-semibold"
                        : "text-purple-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-[#5E2276]" : "text-purple-200"
                      }`}
                    />
                  </Link>
                  {/* Floating tooltip on hover */}
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.title}
                  </div>
                </div>
              );
            }

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
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}

          {isCollapsed ? (
            <div className="my-2 border-t border-white/10" />
          ) : (
            <div className="pt-4 text-[10px] font-bold uppercase tracking-wider text-purple-200/60 px-3 pb-1">
              Hak Akses & Pengaturan
            </div>
          )}

          {adminNavItems.slice(7).map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            if (isCollapsed) {
              return (
                <div key={item.href} className="relative group flex justify-center">
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    aria-label={item.title}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                      isActive
                        ? "bg-white text-[#5E2276] shadow-sm font-semibold"
                        : "text-purple-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-[#5E2276]" : "text-purple-200"
                      }`}
                    />
                  </Link>
                  {/* Floating tooltip on hover */}
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.title}
                  </div>
                </div>
              );
            }

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
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Operator Card & Public Portal Link */}
      <div className="pt-4 space-y-3">
        {isCollapsed ? (
          // Collapsed Footer: Avatar + Logout + Link
          <div className="flex flex-col items-center gap-2 pt-2 border-t border-white/10">
            <div
              className="w-9 h-9 rounded-full bg-amber-400 text-[#1C0B27] font-bold flex items-center justify-center text-xs shadow-sm cursor-pointer"
              title={`${displayName} (${displayRole})`}
            >
              {initials}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <Link
              href="/"
              className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Lihat Website Publik"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          // Expanded Footer: Operator Profile Card & Website Link
          <>
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
                  className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
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
                <span className="text-[10px] font-mono text-purple-300">
                  WIT (UTC+9)
                </span>
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
          </>
        )}
      </div>
    </aside>
  );
}
