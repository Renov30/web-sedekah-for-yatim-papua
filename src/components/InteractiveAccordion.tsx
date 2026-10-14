"use client";

import React, { useState } from "react";

export interface AccordionItem {
  id: string;
  number?: string;
  title: string;
  content: string;
}

export interface InteractiveAccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  variant?: "default" | "highlight";
}

export function InteractiveAccordion({
  items,
  defaultOpenId,
  variant = "default",
}: InteractiveAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;

        if (variant === "highlight") {
          return (
            <div
              key={item.id}
              className={`rounded-2xl transition-all border ${
                isOpen
                  ? "bg-[#FAF5FD] border-[#823296]/30 shadow-xs"
                  : "bg-white border-black/5 hover:border-black/15"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5">
                  {item.number && (
                    <span className="font-mono text-xs font-bold text-charcoal-500">
                      {item.number}
                    </span>
                  )}
                  <h4 className="font-bold text-sm sm:text-base text-charcoal-900 tracking-tight">
                    {item.title}
                  </h4>
                </div>
                <span className="font-mono text-lg font-light text-charcoal-600 shrink-0 w-6 text-center">
                  {isOpen ? "—" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-charcoal-700 leading-relaxed border-t border-black/5 mt-1 pt-3">
                  {item.content}
                </div>
              )}
            </div>
          );
        }

        return (
          <div
            key={item.id}
            className="border-b border-black/10 pb-4 pt-3 transition-colors"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full text-left py-2 flex items-center justify-between gap-4 cursor-pointer group"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                {item.number && (
                  <span className="font-mono text-xs font-bold text-charcoal-400">
                    {item.number}
                  </span>
                )}
                <h4 className="font-bold text-sm sm:text-base text-charcoal-900 group-hover:text-[#823296] transition-colors tracking-tight">
                  {item.title}
                </h4>
              </div>
              <span className="font-mono text-base font-light text-charcoal-500 shrink-0 w-6 text-center">
                {isOpen ? "—" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="pt-2 pb-2 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

