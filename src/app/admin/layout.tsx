"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#FAF8FB] flex flex-row overflow-hidden antialiased">
      {/* Desktop Fixed Sidebar (Edge-to-Edge, locked height) */}
      <div className="hidden lg:flex w-64 xl:w-72 shrink-0 h-full bg-[#5E2276] border-r border-[#4A1860] z-40 overflow-hidden">
        <AdminSidebar />
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
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
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
