"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getStoredSession } from "@/lib/auth";

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

    // Check if session exists
    const session = getStoredSession();
    if (!session) {
      // If not logged in, redirect to login page
      router.replace("/admin/login");
    } else {
      queueMicrotask(() => setIsCheckingAuth(false));
    }
  }, [isLoginPage, router]);

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
            Memverifikasi sesi amanah SFY Papua...
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
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 xl:p-10 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
