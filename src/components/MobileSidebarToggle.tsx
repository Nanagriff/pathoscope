"use client";

import { useState } from "react";
import type { SlideCase } from "@/data/cases";
import SlideSidebar from "./SlideSidebar";

export default function MobileSidebarToggle({ slideCase }: { slideCase: SlideCase }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button — visible only on mobile/tablet */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        aria-label="Case information"
      >
        <svg viewBox="0 0 20 20" className="w-4 h-4 text-gray-400">
          <circle cx={10} cy={10} r={8} fill="none" stroke="currentColor" strokeWidth={1.5} />
          <line x1={10} y1={7} x2={10} y2={13} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          <circle cx={10} cy={5} r={0.8} fill="currentColor" />
        </svg>
      </button>

      {/* Overlay + bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-gray-900 border-t border-gray-800 rounded-t-2xl overflow-hidden flex flex-col animate-[slideUp_0.25s_ease-out]">
            {/* Handle + close */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/60 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 rounded-full bg-gray-700" />
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-300 text-lg leading-none">
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <SlideSidebar slideCase={slideCase} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
