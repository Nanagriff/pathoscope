import Link from "next/link";
import { cases } from "@/data/cases";
import { exams } from "@/data/exams";
import SlideCardThumbnail from "@/components/SlideCardThumbnail";

/* ── Data ── */
const malariaCases = cases.filter((c) => c.discipline === "malaria");
const wbcCases = cases.filter((c) => c.discipline === "hematology" && c.category === "Normal WBC");
const rbcCases = cases.filter((c) => c.discipline === "hematology" && c.category !== "Normal WBC");
const urineCases = cases.filter((c) => c.discipline === "urinalysis");

const sections = [
  { id: "malaria", label: "Malaria", count: malariaCases.length, color: "purple" },
  { id: "wbc", label: "WBC", count: wbcCases.length, color: "rose" },
  { id: "rbc", label: "RBC", count: rbcCases.length, color: "amber" },
  ...(urineCases.length > 0 ? [{ id: "urine", label: "Urine", count: urineCases.length, color: "yellow" }] : []),
  ...(exams.length > 0 ? [{ id: "exams", label: "Exams", count: exams.length, color: "indigo" }] : []),
];

export default function BrowsePage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* ═══ Sticky header ═══ */}
      <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Top row */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800/40 border border-gray-700/30 hover:border-purple-500/25 hover:bg-purple-500/10 transition-all duration-300">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Slide Library</h1>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{cases.length} interactive slides · {exams.length} exams</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/exam" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/[0.06] border border-purple-500/15 hover:border-purple-500/30 hover:bg-purple-500/10 text-sm text-purple-300 hover:text-purple-200 transition-all duration-300 font-medium">
                Exams
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="/leaderboard" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/40 border border-gray-700/30 hover:border-gray-600/40 text-sm text-gray-300 hover:text-white transition-all duration-300 font-medium">
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Jump nav — horizontal scroll on mobile */}
          <div className="flex items-center gap-1.5 pb-3 -mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}
                className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/40 hover:bg-gray-800/50 text-xs font-medium text-gray-300 hover:text-white transition-all duration-300">
                <span>{s.label}</span>
                <span className="text-[10px] text-gray-500 font-[family-name:var(--font-geist-mono)] tabular-nums">{s.count}</span>
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ Content ═══ */}
      <main className="flex-1 max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12 w-full space-y-10 sm:space-y-14">

        {/* ── Malaria ── */}
        <DeptBlock id="malaria" name="Malaria Microscopy" accent="purple"
          desc="Giemsa-stained thin & thick blood films. P. falciparum and P. vivax, all developmental stages."
          count={malariaCases.length}
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5"><circle cx={12} cy={12} r={8} fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth={1.2} /><circle cx={12} cy={12} r={3} fill="rgba(168,85,247,0.15)" /><circle cx={9} cy={10} r={1.2} fill="rgba(168,85,247,0.45)" /></svg>}>
          <SlideGrid cases={malariaCases} />
        </DeptBlock>

        {/* ── WBC ── */}
        <DeptBlock id="wbc" name="WBC Morphology & Differential" accent="rose"
          desc="Identify the five normal WBC types on Wright-Giemsa stained peripheral blood films."
          count={wbcCases.length}
          icon={<svg viewBox="0 0 24 24" className="w-5 h-5"><circle cx={12} cy={12} r={8} fill="none" stroke="rgba(251,113,133,0.5)" strokeWidth={1.2} /><ellipse cx={10} cy={11} rx={3} ry={2.5} fill="rgba(251,113,133,0.2)" /><ellipse cx={14} cy={13} rx={2.5} ry={2} fill="rgba(251,113,133,0.15)" /></svg>}>
          <SlideGrid cases={wbcCases} />
        </DeptBlock>

        {/* ── RBC ── */}
        {rbcCases.length > 0 && (
          <DeptBlock id="rbc" name="RBC Morphology & Abnormalities" accent="amber"
            desc="Sickle cells, target cells, spherocytes, and other red cell abnormalities."
            count={rbcCases.length}
            icon={<svg viewBox="0 0 24 24" className="w-5 h-5"><circle cx={12} cy={12} r={8} fill="none" stroke="rgba(251,191,36,0.5)" strokeWidth={1.2} /><circle cx={12} cy={12} r={3.5} fill="rgba(251,191,36,0.12)" /><path d="M8,12 Q12,8 16,12 Q12,16 8,12 Z" fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth={0.8} /></svg>}>
            <SlideGrid cases={rbcCases} />
          </DeptBlock>
        )}

        {/* ── Urine ── */}
        {urineCases.length > 0 && (
          <DeptBlock id="urine" name="Urine R/E" accent="yellow"
            desc="Urine sediment microscopy — crystals, casts, cells, and organisms."
            count={urineCases.length}
            icon={<svg viewBox="0 0 24 24" className="w-5 h-5"><rect x={8} y={4} width={8} height={16} rx={2} fill="none" stroke="rgba(250,204,21,0.5)" strokeWidth={1.2} /><rect x={9.5} y={10} width={5} height={4} rx={0.5} fill="rgba(250,204,21,0.15)" /></svg>}>
            <SlideGrid cases={urineCases} />
          </DeptBlock>
        )}

        {/* ── Exams ── */}
        {exams.length > 0 && (
          <section id="exams" className="scroll-mt-28 reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/[0.08] border border-indigo-500/15 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5"><rect x={5} y={3} width={14} height={18} rx={2} fill="none" stroke="rgba(129,140,248,0.5)" strokeWidth={1.2} /><line x1={9} y1={8} x2={15} y2={8} stroke="rgba(129,140,248,0.25)" strokeWidth={0.8} /><line x1={9} y1={11} x2={15} y2={11} stroke="rgba(129,140,248,0.25)" strokeWidth={0.8} /><line x1={9} y1={14} x2={12} y2={14} stroke="rgba(129,140,248,0.25)" strokeWidth={0.8} /></svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Examinations</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Timed quizzes with scoring and leaderboard</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exams.map((exam) => {
                const pts = exam.questionBank.reduce((s, q) => s + q.points, 0);
                return (
                  <Link key={exam.id} href={`/exam/${exam.id}`}
                    className="group flex items-center justify-between px-5 py-4 rounded-xl bg-gray-900/40 border border-gray-700/30 hover:border-indigo-500/25 hover:bg-gray-900/60 transition-all duration-300 card-hover">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors">{exam.title}</div>
                      <div className="text-[11px] text-gray-400 mt-1 font-[family-name:var(--font-geist-mono)]">
                        {exam.questionBank.length} questions · {pts} pts {exam.timeLimit ? `· ${Math.floor(exam.timeLimit / 60)} min` : ""}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/[0.06] border border-indigo-500/10 flex items-center justify-center shrink-0 ml-4 group-hover:bg-indigo-500/15 group-hover:border-indigo-500/20 transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-indigo-400 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-gray-800/40 py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-sm font-bold text-white">
            Patho<span className="text-purple-400">Scope</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">Home</Link>
            <Link href="/exam" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">Exams</Link>
            <Link href="/leaderboard" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">Leaderboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══ Department Block ═══ */

function DeptBlock({ id, name, accent, desc, count, icon, children }: {
  id: string; name: string; accent: string; desc: string; count: number;
  icon: React.ReactNode; children: React.ReactNode;
}) {
  const accentStyles: Record<string, { border: string; badge: string }> = {
    purple: { border: "border-purple-500/15", badge: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
    rose: { border: "border-rose-500/15", badge: "bg-rose-500/10 text-rose-300 border-rose-500/20" },
    amber: { border: "border-amber-500/15", badge: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
    yellow: { border: "border-yellow-500/15", badge: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20" },
  };
  const s = accentStyles[accent] ?? accentStyles.purple;

  return (
    <section id={id} className="scroll-mt-28 reveal">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gray-800/40 ${s.border} border flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">{name}</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5 max-w-lg">{desc}</p>
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border ${s.badge} font-[family-name:var(--font-geist-mono)] tabular-nums shrink-0 hidden sm:block`}>
          {count} slides
        </span>
      </div>

      {/* Cards */}
      {children}
    </section>
  );
}

/* ═══ Slide Grid ═══ */

function SlideGrid({ cases: slideCases }: { cases: (typeof cases) }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {slideCases.map((c) => (
        <SlideCard key={c.id} c={c} />
      ))}
    </div>
  );
}

/* ═══ Slide Card ═══ */

function SlideCard({ c }: { c: (typeof cases)[number] }) {
  return (
    <Link href={`/slide/${c.id}`}
      className="group block rounded-xl bg-gray-900/40 border border-gray-700/25 overflow-hidden hover:border-purple-500/25 hover:bg-gray-900/60 transition-all duration-300 card-hover">
      <div className="overflow-hidden">
        <div className="transition-transform duration-500 group-hover:scale-105">
          <SlideCardThumbnail stage={c.svgConfig?.stage} species={c.svgConfig?.species} discipline={c.discipline} category={c.category} title={c.title} />
        </div>
      </div>
      <div className="px-3 pb-3 -mt-0.5">
        {c.svgConfig?.stage && (
          <span className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/15 uppercase tracking-wide mb-1.5">
            {c.svgConfig.stage}
          </span>
        )}
        <h3 className="text-xs sm:text-sm font-semibold leading-snug text-gray-200 group-hover:text-white transition-colors line-clamp-2">{c.title}</h3>
        <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 font-[family-name:var(--font-geist-mono)]">{c.svgConfig?.fields.length ?? c.fields.length} fields</p>
      </div>
    </Link>
  );
}
