import React from "react";

export interface HonestNoticeProps {
  type?: "info" | "warning" | "verified" | "roadmap";
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function HonestNotice({
  type = "info",
  title,
  children,
  className = "",
}: HonestNoticeProps) {
  const config = {
    info: {
      bg: "bg-[#F4F7F2]",
      border: "border border-[#DCE6D5]",
      badge: "CATATAN",
      badgeColor: "text-[#122A1C] bg-[#E2EDD9]",
    },
    warning: {
      bg: "bg-[#FFF9EE]",
      border: "border border-[#F3E2C4]",
      badge: "PERINGATAN",
      badgeColor: "text-[#9E5A0A] bg-[#FDE7C4]",
    },
    verified: {
      bg: "bg-[#F4FBE4]",
      border: "border border-[#D7F397]",
      badge: "TERVERIFIKASI",
      badgeColor: "text-[#28570A] bg-[#C6F24D]",
    },
    roadmap: {
      bg: "bg-[#F5F6F8]",
      border: "border border-[#E2E5E9]",
      badge: "AGENDA",
      badgeColor: "text-stone-800 bg-stone-200",
    },
  }[type];

  return (
    <div
      role="note"
      className={`rounded-2xl p-5 text-sm ${config.bg} ${config.border} ${className}`}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <span className={`text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${config.badgeColor}`}>
            {config.badge}
          </span>
          <p className="font-bold text-stone-900 tracking-tight text-sm sm:text-base">
            {title}
          </p>
        </div>
        <div className="text-stone-700 leading-relaxed text-xs sm:text-sm pl-0.5">
          {children}
        </div>
      </div>
    </div>
  );
}
