"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ActivityItem } from "@/data/activities";

export interface ActivityListProps {
  initialActivities: ActivityItem[];
}

export function ActivityList({ initialActivities }: ActivityListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    "Semua",
    "Pendidikan",
    "Kebutuhan Dasar",
    "Pendampingan",
    "Pelatihan Relawan",
  ];

  const filtered = initialActivities.filter((act) => {
    if (selectedCategory === "Semua") return true;
    return act.category === selectedCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mr-2">
          Kategori:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#0C1D13] text-white"
                  : "bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-50"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((act) => {
          const isExpanded = expandedId === act.id;

          return (
            <article
              key={act.id}
              id={act.id}
              className="scroll-mt-28 bg-white rounded-3xl border border-stone-200/80 overflow-hidden flex flex-col justify-between hover:border-stone-400 hover:shadow-xs transition-all"
            >
              <div>
                {/* Photo Frame */}
                <div className="relative h-56 w-full bg-stone-100">
                  <Image
                    src={act.image}
                    alt={act.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-xs ${
                        act.isEditorialPlaceholder
                          ? "bg-[#FFF9EE] text-[#9E5A0A] border border-[#F3E2C4]"
                          : "bg-black/75 text-white"
                      }`}
                    >
                      {act.statusNote}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="text-xs text-stone-500 font-medium">
                    <span>{act.district}</span>
                    <span className="mx-2">•</span>
                    <span>{act.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 tracking-tight leading-snug">
                    {act.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {act.summary}
                  </p>

                  {/* Expandable Field Notes */}
                  {isExpanded && (
                    <div className="pt-3 mt-3 border-t border-stone-100 text-xs text-stone-700 space-y-2 bg-[#F8F9FA] p-4 rounded-2xl">
                      <p className="font-semibold text-stone-900">Catatan Lapangan & Detail Aksi:</p>
                      <p className="leading-relaxed">{act.details}</p>
                      <div className="pt-1 text-stone-500">
                        <span className="font-medium text-stone-800">Lokasi:</span> {act.location}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {act.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="px-6 py-4 bg-[#F8F9FA] border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-medium text-stone-500">
                  {act.category}
                </span>
                <button
                  type="button"
                  onClick={() => toggleExpand(act.id)}
                  className="font-semibold text-stone-900 hover:text-emerald-800 cursor-pointer underline underline-offset-2"
                >
                  {isExpanded ? "Tutup Catatan —" : "Detail Lapangan +"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
