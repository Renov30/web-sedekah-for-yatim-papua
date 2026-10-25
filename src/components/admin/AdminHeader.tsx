"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Calendar,
  LogOut,
  ChevronDown,
  Users,
  ShieldCheck,
  ExternalLink,
  Map,
  LayoutDashboard,
} from "lucide-react";
import {
  getStoredSession,
  clearSession,
  AuthSession,
  MASTER_ADMIN_CREDENTIALS,
  roleDisplayNames,
} from "@/lib/auth";
import {
  canRoleAccessPath,
  getStoredPermissions,
  getStoredRoles,
} from "@/lib/adminDataStore";
import { initialPermissions, RolePermissionsMap } from "@/data/admin/adminData";

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
  const [permissionsMap, setPermissionsMap] =
    useState<RolePermissionsMap>(initialPermissions);
  const [roleTitle, setRoleTitle] = useState("Super Admin Lembaga");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncHeaderState = () => {
      const currentSession = getStoredSession();
      setSession(currentSession);
      setPermissionsMap(getStoredPermissions());

      const rId = currentSession?.user.roleId || "super_admin";
      const storedRoles = getStoredRoles();
      const matched = storedRoles.find((r) => r.id === rId);
      setRoleTitle(
        matched?.nama ||
          currentSession?.roleName ||
          roleDisplayNames[rId] ||
          "Staf Lembaga"
      );
    };

    queueMicrotask(syncHeaderState);

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

    window.addEventListener("sfy-permissions-updated", syncHeaderState);
    window.addEventListener("storage", syncHeaderState);
    return () => {
      window.removeEventListener("sfy-permissions-updated", syncHeaderState);
      window.removeEventListener("storage", syncHeaderState);
    };
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

  const roleId = session?.user.roleId || "super_admin";
  const displayName = session?.user.nama || MASTER_ADMIN_CREDENTIALS.nama;
  const firstName = displayName.split(" ")[0];
  const displayUsername = session?.user.email || MASTER_ADMIN_CREDENTIALS.email;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const canAccessUsers = canRoleAccessPath(
    roleId,
    "/admin/users",
    permissionsMap
  );
  const canAccessPermissions = canRoleAccessPath(
    roleId,
    "/admin/permissions",
    permissionsMap
  );
  const canAccessWilayah = canRoleAccessPath(
    roleId,
    "/admin/wilayah",
    permissionsMap
  );

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

        {/* Welcome Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-[#5E2276] text-xs font-medium">
          <span>
            Assalamu&apos;alaikum,{" "}
            <strong className="font-semibold">{firstName}</strong>
          </span>
        </div>
      </div>

      {/* Right: Quick Date & Interactive Account Menu */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Date badge - Desktop only */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 font-medium px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-200/60">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>{currentDateString || "Papua, WIT"}</span>
        </div>

        {/* User Account Trigger & Dropdown Menu */}
        <div
          className="relative md:pl-2 md:border-l md:border-stone-200"
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
                {roleTitle}
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
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Account Identity Summary Header */}
              <div className="px-4 py-3 border-b border-stone-100 bg-[#FAF4FC]/70 -mt-2 rounded-t-2xl">
                <p className="text-sm font-bold text-stone-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-stone-500 font-mono truncate mt-0.5">
                  @{displayUsername}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#5E2276] text-white">
                    {roleTitle}
                  </span>
                </div>
              </div>

              {/* Action Menu Links (Filtered by Role Permission) */}
              <div className="py-1.5 px-1.5 space-y-0.5">
                <Link
                  href="/admin"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-purple-50 hover:text-[#5E2276] transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-stone-400" />
                  <span>Dashboard Utama</span>
                </Link>

                {canAccessUsers && (
                  <Link
                    href="/admin/users"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-purple-50 hover:text-[#5E2276] transition-colors"
                  >
                    <Users className="w-4 h-4 text-stone-400" />
                    <span>Kelola Pengguna</span>
                  </Link>
                )}

                {canAccessPermissions && (
                  <Link
                    href="/admin/permissions"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-purple-50 hover:text-[#5E2276] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-stone-400" />
                    <span>Hak Akses (RBAC)</span>
                  </Link>
                )}

                {canAccessWilayah && (
                  <Link
                    href="/admin/wilayah"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-purple-50 hover:text-[#5E2276] transition-colors"
                  >
                    <Map className="w-4 h-4 text-stone-400" />
                    <span>Data Wilayah</span>
                  </Link>
                )}

                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-stone-400" />
                  <span>Website Publik</span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="pt-1.5 px-1.5 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
