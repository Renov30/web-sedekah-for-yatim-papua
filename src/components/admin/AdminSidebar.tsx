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
  clearSession,
  getStoredSession,
  roleDisplayNames,
} from "@/lib/auth";
import {
  canRoleAccessPath,
  getStoredPermissions,
  getStoredRoles,
} from "@/lib/adminDataStore";
import { initialPermissions, RolePermissionsMap } from "@/data/admin/adminData";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    moduleId: null,
    icon: LayoutDashboard,
    group: "operational" as const,
  },
  {
    title: "Pendataan Anak Yatim",
    href: "/admin/anak-yatim",
    moduleId: "anak-yatim",
    icon: GraduationCap,
    group: "operational" as const,
  },
  {
    title: "Pendataan AV",
    href: "/admin/av",
    moduleId: "av",
    icon: MapPinHouse,
    group: "operational" as const,
  },
  {
    title: "Data Wilayah",
    href: "/admin/wilayah",
    moduleId: "wilayah",
    icon: Map,
    group: "operational" as const,
  },
  {
    title: "Pendataan Relawan",
    href: "/admin/relawan",
    moduleId: "relawan",
    icon: HeartHandshake,
    group: "operational" as const,
  },
  {
    title: "Pendataan Donatur",
    href: "/admin/donatur",
    moduleId: "donatur",
    icon: Users2,
    group: "operational" as const,
  },
  {
    title: "Manajemen Keuangan",
    href: "/admin/keuangan",
    moduleId: "keuangan",
    icon: Wallet,
    group: "operational" as const,
  },
  {
    title: "Kelola User",
    href: "/admin/users",
    moduleId: "users",
    icon: ShieldAlert,
    group: "settings" as const,
  },
  {
    title: "Manajemen Role",
    href: "/admin/roles",
    moduleId: "roles",
    icon: ShieldCheck,
    group: "settings" as const,
  },
  {
    title: "Permission Role",
    href: "/admin/permissions",
    moduleId: "permissions",
    icon: KeyRound,
    group: "settings" as const,
  },
];

export function AdminSidebar({
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [roleId, setRoleId] = useState<string>("super_admin");
  const [roleBadgeLabel, setRoleBadgeLabel] = useState<string>("Admin");
  const [permissionsMap, setPermissionsMap] =
    useState<RolePermissionsMap>(initialPermissions);

  useEffect(() => {
    const syncRoleAndPerms = () => {
      const session = getStoredSession();
      const currentRoleId = session?.user.roleId || "super_admin";
      setRoleId(currentRoleId);

      const storedRoles = getStoredRoles();
      const matchedRole = storedRoles.find((r) => r.id === currentRoleId);
      const fullLabel =
        matchedRole?.nama ||
        session?.roleName ||
        roleDisplayNames[currentRoleId] ||
        "Staf";
      // Short badge label for sidebar top pill
      const shortLabel =
        currentRoleId === "super_admin"
          ? "Super Admin"
          : currentRoleId === "bendahara"
          ? "Bendahara"
          : currentRoleId === "koordinator_relawan"
          ? "Koordinator"
          : currentRoleId === "staf_lapangan"
          ? "Staf Lapangan"
          : currentRoleId === "auditor"
          ? "Auditor"
          : fullLabel.split(" ")[0];
      setRoleBadgeLabel(shortLabel);
      setPermissionsMap(getStoredPermissions());
    };

    queueMicrotask(syncRoleAndPerms);

    window.addEventListener("sfy-permissions-updated", syncRoleAndPerms);
    window.addEventListener("storage", syncRoleAndPerms);
    return () => {
      window.removeEventListener("sfy-permissions-updated", syncRoleAndPerms);
      window.removeEventListener("storage", syncRoleAndPerms);
    };
  }, [pathname]);

  const operationalItems = adminNavItems.filter(
    (item) =>
      item.group === "operational" &&
      canRoleAccessPath(roleId, item.href, permissionsMap)
  );

  const settingsItems = adminNavItems.filter(
    (item) =>
      item.group === "settings" &&
      canRoleAccessPath(roleId, item.href, permissionsMap)
  );

  const handleLogout = () => {
    clearSession();
    router.push("/admin/login");
  };

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
                    {roleBadgeLabel}
                  </span>
                </div>
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

          {operationalItems.map((item) => {
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

          {settingsItems.length > 0 && (
            <>
              {isCollapsed ? (
                <div className="my-2 border-t border-white/10" />
              ) : (
                <div className="pt-4 text-[10px] font-bold uppercase tracking-wider text-purple-200/60 px-3 pb-1">
                  Hak Akses & Pengaturan
                </div>
              )}

              {settingsItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                if (isCollapsed) {
                  return (
                    <div
                      key={item.href}
                      className="relative group flex justify-center"
                    >
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
            </>
          )}
        </nav>
      </div>

      {/* Bottom Section: Public Portal Link & Logout */}
      <div className="pt-3">
        {isCollapsed ? (
          // Collapsed Footer: Clean Icon Links with Tooltips
          <div className="flex flex-col items-center gap-2 pt-3 border-t border-white/10">
            <div className="relative group flex justify-center">
              <Link
                href="/"
                className="flex items-center justify-center w-10 h-10 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Lihat Website Publik"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Lihat Website Publik
              </div>
            </div>

            <div className="relative group flex justify-center">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-xl text-purple-200 hover:text-rose-200 hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Keluar / Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Keluar
              </div>
            </div>
          </div>
        ) : (
          // Expanded Footer: Clean Links
          <div className="pt-3 border-t border-white/10 space-y-1">
            <Link
              href="/"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-purple-200 hover:text-white hover:bg-white/10 transition-colors font-medium"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4" />
                <span>Lihat Website Publik</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs text-purple-200 hover:text-rose-200 hover:bg-white/10 transition-colors font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Admin</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
