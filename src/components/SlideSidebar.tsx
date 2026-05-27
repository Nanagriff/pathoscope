"use client";

import { useState } from "react";
import type { SlideCase } from "@/data/cases";

const TABS = ["Case", "Lab", "Learn"] as const;
type Tab = (typeof TABS)[number];

export default function SlideSidebar({ slideCase }: { slideCase: SlideCase }) {
  const [tab, setTab] = useState<Tab>("Case");

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-gray-800/60 shrink-0">
        {TABS.map((t) => {
          const active = tab === t;
          const show = t === "Lab" ? !!slideCase.labData : true;
          if (!show) return null;
          return (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors relative ${
                active ? "text-purple-400" : "text-gray-600 hover:text-gray-400"
              }`}>
              {t}
              {active && (
                <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-purple-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "Case" && <CaseTab slideCase={slideCase} />}
        {tab === "Lab" && slideCase.labData && <LabTab labData={slideCase.labData} />}
        {tab === "Learn" && <LearnTab slideCase={slideCase} />}
      </div>
    </div>
  );
}

function CaseTab({ slideCase }: { slideCase: SlideCase }) {
  return (
    <div className="p-4 space-y-4">
      {/* Patient header */}
      <div className="rounded-lg bg-gray-800/30 border border-gray-800/40 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-purple-900/40 flex items-center justify-center">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5">
              <circle cx={8} cy={5} r={3} fill="none" stroke="rgba(168,130,255,0.5)" strokeWidth={1} />
              <path d="M2 14 Q2 10 8 10 Q14 10 14 14" fill="none" stroke="rgba(168,130,255,0.5)" strokeWidth={1} />
            </svg>
          </div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Clinical History</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{slideCase.clinicalHistory}</p>
      </div>

      {/* Category & discipline */}
      <div className="flex gap-2">
        <span className="text-[9px] px-2 py-1 rounded-full bg-purple-900/20 text-purple-300 border border-purple-800/20 font-medium uppercase tracking-wide">
          {slideCase.category}
        </span>
        {slideCase.svgConfig?.stage && (
          <span className="text-[9px] px-2 py-1 rounded-full bg-indigo-900/20 text-indigo-300 border border-indigo-800/20 font-medium uppercase tracking-wide">
            {slideCase.svgConfig.stage}
          </span>
        )}
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-2 gap-2">
        <InfoCard label="Stain" value={slideCase.svgConfig?.stainType === "giemsa" ? "Giemsa" : "Wright-Giemsa"} />
        <InfoCard label="Film" value="Thin & Thick" />
        <InfoCard label="Fields" value={`${slideCase.svgConfig?.fields.length ?? slideCase.fields.length}`} />
        <InfoCard label="Source" value="SVG Simulation" />
      </div>
    </div>
  );
}

function LabTab({ labData }: { labData: string }) {
  return (
    <div className="p-4">
      <div className="rounded-lg bg-gray-800/30 border border-gray-800/40 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-emerald-900/40 flex items-center justify-center">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5">
              <rect x={4} y={2} width={8} height={12} rx={1} fill="none" stroke="rgba(110,231,183,0.5)" strokeWidth={1} />
              <line x1={6} y1={6} x2={10} y2={6} stroke="rgba(110,231,183,0.3)" strokeWidth={0.7} />
              <line x1={6} y1={8.5} x2={10} y2={8.5} stroke="rgba(110,231,183,0.3)" strokeWidth={0.7} />
              <line x1={6} y1={11} x2={8} y2={11} stroke="rgba(110,231,183,0.3)" strokeWidth={0.7} />
            </svg>
          </div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Laboratory Data</span>
        </div>
        <pre className="text-xs text-emerald-300/80 leading-relaxed font-mono whitespace-pre-wrap">{labData}</pre>
      </div>
    </div>
  );
}

function LearnTab({ slideCase }: { slideCase: SlideCase }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-full bg-amber-900/40 flex items-center justify-center">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5">
            <circle cx={8} cy={6} r={4} fill="none" stroke="rgba(251,191,36,0.5)" strokeWidth={1} />
            <line x1={8} y1={10} x2={8} y2={14} stroke="rgba(251,191,36,0.5)" strokeWidth={1} />
            <line x1={5} y1={12} x2={11} y2={12} stroke="rgba(251,191,36,0.4)" strokeWidth={0.8} />
          </svg>
        </div>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Teaching Points</span>
      </div>
      {slideCase.teachingPoints.map((point, i) => (
        <div key={i} className="flex gap-2.5 group">
          <div className="shrink-0 w-5 h-5 rounded-md bg-purple-900/20 border border-purple-800/20 flex items-center justify-center text-[9px] font-bold text-purple-400 mt-0.5">
            {i + 1}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{point}</p>
        </div>
      ))}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-800/20 border border-gray-800/30 px-3 py-2">
      <div className="text-[9px] text-gray-600 uppercase tracking-wider">{label}</div>
      <div className="text-xs text-gray-300 font-medium mt-0.5">{value}</div>
    </div>
  );
}
