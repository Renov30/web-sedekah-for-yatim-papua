"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Eye } from "lucide-react";
import { AdminSidebar, adminNavItems } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  AuthSession,
  getStoredSession,
  roleDisplayNames,
} from "@/lib/auth";
import {
  canRoleAccessPath,
  getModuleFromPathname,
  getRolePermissionsForModule,
  getStoredPermissions,
  getStoredRoles,
} from "@/lib/adminDataStore";
import {
  initialPermissions,
  moduleList,
  RolePermissionsMap,
} from "@/data/admin/adminData";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [permissionsMap, setPermissionsMap] =
    useState<RolePermissionsMap>(initialPermissions);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sfy_admin_sidebar_collapsed");
      if (saved !== null) {
        queueMicrotask(() => setIsSidebarCollapsed(saved === "true"));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sfy_admin_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // If on login page, don't show admin shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      queueMicrotask(() => setIsCheckingAuth(false));
      return;
    }

    const verifyAuthAndPermissions = () => {
      const currentSession = getStoredSession();
      if (!currentSession) {
        router.replace("/admin/login");
        return;
      }
      setSession(currentSession);
      setPermissionsMap(getStoredPermissions());
      setIsCheckingAuth(false);
    };

    queueMicrotask(verifyAuthAndPermissions);

    window.addEventListener("sfy-permissions-updated", verifyAuthAndPermissions);
    window.addEventListener("storage", verifyAuthAndPermissions);
    return () => {
      window.removeEventListener(
        "sfy-permissions-updated",
        verifyAuthAndPermissions
      );
      window.removeEventListener("storage", verifyAuthAndPermissions);
    };
  }, [isLoginPage, pathname, router]);

  const roleId = session?.user.roleId || "super_admin";
  const storedRoles = getStoredRoles();
  const matchedRole = storedRoles.find((r) => r.id === roleId);
  const roleLabel =
    matchedRole?.nama ||
    session?.roleName ||
    roleDisplayNames[roleId] ||
    "Staf Lembaga";

  const isAllowed = canRoleAccessPath(roleId, pathname, permissionsMap);
  const currentModuleId = getModuleFromPathname(pathname);
  const currentModuleMeta = moduleList.find((m) => m.id === currentModuleId);
  const modulePerms = currentModuleId
    ? getRolePermissionsForModule(roleId, currentModuleId, permissionsMap)
    : { create: true, read: true, update: true, delete: true };

  const isReadOnlyModule =
    Boolean(currentModuleId) &&
    modulePerms.read &&
    !modulePerms.create &&
    !modulePerms.update &&
    !modulePerms.delete;

  const allowedNavLinks = adminNavItems.filter((item) =>
    canRoleAccessPath(roleId, item.href, permissionsMap)
  );

  // Enforce granular Create / Update / Delete button visibility inside module pages
  useEffect(() => {
    if (isLoginPage || isCheckingAuth || !isAllowed || !currentModuleId) return;

    const applyGranularDomPermissions = () => {
      const mainEl = document.querySelector("main[data-role]");
      if (!mainEl) return;

      const buttons = mainEl.querySelectorAll<HTMLButtonElement>("button");
      buttons.forEach((btn) => {
        const text = (btn.textContent || "").trim().toLowerCase();
        const title = (btn.getAttribute("title") || "").trim().toLowerCase();

        const isCreateBtn =
          text.startsWith("tambah ") ||
          text.startsWith("catat transaksi") ||
          title.startsWith("tambah ");

        const isUpdateBtn =
          title.includes("edit") ||
          title.includes("ubah status") ||
          title.includes("ubah kata sandi") ||
          text === "edit" ||
          text === "edit data" ||
          text.startsWith("ubah status");

        const isDeleteBtn =
          title.includes("hapus") ||
          title.includes("sampah") ||
          text.includes("kotak sampah") ||
          text.startsWith("hapus") ||
          text.startsWith("pindahkan ke sampah");

        if (isCreateBtn) {
          btn.style.display = modulePerms.create ? "" : "none";
        } else if (isUpdateBtn) {
          btn.style.display = modulePerms.update ? "" : "none";
        } else if (isDeleteBtn) {
          btn.style.display = modulePerms.delete ? "" : "none";
        }
      });

      // Hide bulk-select checkboxes inside tables if delete permission is false (except in permissions matrix)
      if (currentModuleId !== "permissions") {
        const tableCheckboxes = mainEl.querySelectorAll<HTMLInputElement>(
          "table input[type='checkbox']"
        );
        tableCheckboxes.forEach((cb) => {
          const cell = cb.closest("th, td") as HTMLElement | null;
          if (cell) {
            cell.style.display = modulePerms.delete ? "" : "none";
          }
        });
      }
    };

    applyGranularDomPermissions();
    const observer = new MutationObserver(applyGranularDomPermissions);
    const mainEl = document.querySelector("main[data-role]");
    if (mainEl) {
      observer.observe(mainEl, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [
    isLoginPage,
    isCheckingAuth,
    isAllowed,
    currentModuleId,
    modulePerms.create,
    modulePerms.update,
    modulePerms.delete,
    pathname,
  ]);

  // If on login page, render children directly without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Brief loading placeholder while checking auth session
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full bg-[#FAF8FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#5E2276] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-stone-500 font-medium">
            Memverifikasi sesi & hak akses role SFY Papua...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#FAF8FB] flex flex-row overflow-hidden antialiased">
      {/* Desktop Fixed Sidebar (Edge-to-Edge, locked height, collapsible) */}
      <div
        className={`hidden lg:flex shrink-0 h-full bg-[#5E2276] border-r border-[#4A1860] z-40 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-20" : "w-64 xl:w-72"
        }`}
      >
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <AdminSidebar
              onCloseMobile={() => setMobileSidebarOpen(false)}
              isCollapsed={false}
            />
          </div>
        </div>
      )}

      {/* Main Workspace (Independent Scroll Container) */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto overscroll-contain bg-[#FAF8FB]">
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
          <AdminHeader
            onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            isSidebarOpen={mobileSidebarOpen}
          />
        </div>
        <main
          className="flex-1 w-full p-4 sm:p-6 lg:p-8 xl:p-10 focus:outline-none"
          data-role={roleId}
          data-can-create={String(modulePerms.create)}
          data-can-update={String(modulePerms.update)}
          data-can-delete={String(modulePerms.delete)}
        >
          {!isAllowed ? (
            <div className="max-w-xl mx-auto my-8 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  Akses Dibatasi Berdasarkan Role
                </span>
                <h2 className="text-xl font-bold text-stone-900">
                  Halaman {currentModuleMeta?.name || "Ini"} Tidak Tersedia untuk Role Anda
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Akun Anda saat ini masuk menggunakan jabatan{" "}
                  <strong className="text-[#5E2276]">{roleLabel}</strong>. Sesuai
                  konfigurasi <em>Role-Based Access Control (RBAC)</em> SFY Papua,
                  jabatan ini hanya dapat mengakses modul yang relevan dengan
                  tugasnya.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-left space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Halaman yang Dapat Diakses oleh {roleLabel}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allowedNavLinks.map((nav) => {
                    const Icon = nav.icon;
                    return (
                      <Link
                        key={nav.href}
                        href={nav.href}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-800 hover:border-[#5E2276] hover:text-[#5E2276] transition-colors shadow-2xs"
                      >
                        <Icon className="w-3.5 h-3.5 text-[#5E2276]" />
                        <span>{nav.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-1 flex justify-center">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#5E2276] text-white hover:bg-[#4A1860] transition-colors shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Dashboard</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {isReadOnlyModule && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>Mode Hanya Baca ({roleLabel}):</strong> Anda dapat melihat dan mengekspor data pada halaman ini, namun penambahan, pengubahan, dan penghapusan data dinonaktifkan.
                    </span>
                  </div>
                </div>
              )}
              {children}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
