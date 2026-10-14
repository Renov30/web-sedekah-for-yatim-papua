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
      bg: "bg-[#FAF6FC]",
      border: "border border-[#EBDFF2]",
      badge: "CATATAN",
      badgeColor: "text-[#581C87] bg-[#F3E8FF]",
    },
    warning: {
      bg: "bg-[#FFF9EE]",
      border: "border border-[#F3E2C4]",
      badge: "PERINGATAN",
      badgeColor: "text-[#9E5A0A] bg-[#FDE7C4]",
    },
    verified: {
      bg: "bg-[#FAF5FD]",
      border: "border border-[#E4D1F0]",
      badge: "TERVERIFIKASI",
      badgeColor: "text-white bg-[#823296]",
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
