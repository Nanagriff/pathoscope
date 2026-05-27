import Link from "next/link";
import { cases } from "@/data/cases";
import { exams } from "@/data/exams";
import SlideCardThumbnail from "@/components/SlideCardThumbnail";
import HeroBackground from "@/components/HeroBackground";

/* ── Data ── */
const malariaCases = cases.filter((c) => c.discipline === "malaria");
const wbcCases = cases.filter((c) => c.discipline === "hematology" && c.category === "Normal WBC");
const rbcCases = cases.filter((c) => c.discipline === "hematology" && c.category !== "Normal WBC");
const urineCases = cases.filter((c) => c.discipline === "urinalysis");

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO — animated floating cells background
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="relative isolate overflow-hidden min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center">
        {/* Animated canvas background */}
        <div className="absolute inset-0 -z-20">
          <HeroBackground />
        </div>
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-gray-950" />
        {/* Optical blur — top and bottom edges */}
        <div className="absolute top-0 left-0 right-0 h-32 -z-10" style={{ background: "linear-gradient(to bottom, rgba(3,7,18,0.9), transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-48 -z-10" style={{ background: "linear-gradient(to top, rgb(3,7,18), transparent)" }} />
        {/* Vignette */}
        <div className="absolute inset-0 -z-10" style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,7,18,0.7) 100%)"
        }} />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center py-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] sm:text-xs font-medium mb-6 backdrop-blur-sm animate-[fadeIn_0.8s_ease-out]">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Interactive Microscopy for Modern Laboratory Training
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight animate-[fadeIn_0.6s_ease-out]">
            Patho<span className="text-purple-400">Scope</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 mt-4 sm:mt-6 text-sm sm:text-lg max-w-lg mx-auto leading-relaxed animate-[fadeIn_1s_ease-out]">
            Explore realistic interactive blood films and virtual microscopy directly in your browser.
            Realistic microscopy simulation for MLS education.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 mt-8 sm:mt-10 animate-[fadeIn_1.2s_ease-out]">
            <Link href={`/slide/${malariaCases[0]?.id ?? cases[0]?.id ?? ""}`}
              className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm sm:text-base font-semibold transition-all hover:shadow-xl hover:shadow-purple-600/25 hover:scale-[1.02]">
              Learn
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link href={exams[0] ? `/exam/${exams[0].id}` : "#departments"}
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-gray-600 hover:border-purple-500/50 text-gray-200 hover:text-white text-sm sm:text-base font-medium transition-all hover:bg-purple-500/5 backdrop-blur-sm">
              Test Your Knowledge
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-10 sm:mt-14 pt-6 border-t border-gray-700/30 max-w-md mx-auto animate-[fadeIn_1.4s_ease-out]">
            {[
              { v: cases.length.toString(), l: "Slides" },
              { v: "5", l: "Species" },
              { v: "4", l: "Stages" },
              { v: "2", l: "Film Types" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-lg sm:text-2xl font-bold">{s.v}</div>
                <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ━━ CAPABILITIES ━━ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14 w-full">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">What you can do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Identify Parasites", desc: "Scan Giemsa-stained thin and thick blood films for P. falciparum & P. vivax. Practice rings, trophozoites, schizonts, and gametocytes.", icon: "🦟" },
            { title: "Differentiate WBCs", desc: "Master neutrophil, eosinophil, basophil, lymphocyte, and monocyte morphology on Wright-Giemsa stained peripheral films.", icon: "🔬" },
            { title: "Switch Film Types", desc: "Toggle thick film (detection & density estimation) and thin film (species & stage identification) on every malaria slide.", icon: "🔄" },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-800/40 bg-gray-900/30 p-5 hover:border-gray-700/60 transition-colors">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="text-sm font-semibold mt-3">{f.title}</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━ DEPARTMENTS ━━ */}
      <main id="departments" className="flex-1 max-w-5xl mx-auto px-5 sm:px-8 pb-8 sm:pb-14 w-full space-y-5">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Laboratory Departments</h2>

        {/* Haematology */}
        <DeptSection name="Haematology" accent="rose" icon={<HaemIcon />}
          desc="Complete blood film analysis — from WBC differential to malaria parasitology.">
          <SubSection title="Malaria Microscopy" count={malariaCases.length}
            desc="Giemsa-stained thin & thick blood films. P. falciparum and P. vivax, all developmental stages.">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {malariaCases.map((c) => <SlideCard key={c.id} c={c} />)}
            </div>
          </SubSection>
          <SubSection title="WBC Morphology & Differential" count={wbcCases.length}
            desc="Identify the five normal WBC types on Wright-Giemsa stained peripheral blood films.">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {wbcCases.map((c) => <SlideCard key={c.id} c={c} />)}
            </div>
          </SubSection>
          {rbcCases.length > 0 && (
            <SubSection title="RBC Morphology & Abnormalities" count={rbcCases.length}
              desc="Sickle cells, target cells, spherocytes, and other red cell abnormalities.">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {rbcCases.map((c) => <SlideCard key={c.id} c={c} />)}
              </div>
            </SubSection>
          )}
          <SubSection title="Blood Film Commenting" count={0}
            desc="Practice writing structured blood film comments for clinical reporting.">
            <ComingSoon />
          </SubSection>
        </DeptSection>

        {/* Parasitology */}
        <DeptSection name="Parasitology" accent="emerald" icon={<ParaIcon />}
          desc="Stool and HVS microscopy for parasites, ova, cysts, and organisms.">
          <SubSection title="Stool R/E" count={0} desc="Direct wet mount and concentration techniques for intestinal parasites.">
            <ComingSoon />
          </SubSection>
          <SubSection title="HVS Microscopy" count={0} desc="Gram stain, wet mount — clue cells, Trichomonas, yeast.">
            <ComingSoon />
          </SubSection>
        </DeptSection>

        {/* Urine */}
        <DeptSection name="Urine R/E" accent="amber" icon={<UrineIcon />}
          desc="Urine sediment microscopy — crystals, casts, cells, and organisms.">
          {urineCases.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
              {urineCases.map((c) => <SlideCard key={c.id} c={c} />)}
            </div>
          ) : <ComingSoon />}
        </DeptSection>

        {/* Coming Soon departments */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: "Histopathology", desc: "H&E tissue sections, pathological diagnosis", accent: "sky", icon: <HistoIcon /> },
            { name: "Cytology", desc: "Pap smear, FNA, body fluid cytology", accent: "fuchsia", icon: <CytoIcon /> },
            { name: "Semen Analysis", desc: "Motility, morphology, count (WHO criteria)", accent: "teal", icon: <SemenIcon /> },
          ].map((d) => (
            <div key={d.name} className={`rounded-xl border border-${d.accent}-900/30 bg-gradient-to-br from-${d.accent}-950/10 to-transparent p-4 sm:p-5`}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gray-900/60 border border-gray-800/40 flex items-center justify-center">{d.icon}</div>
                <h3 className={`text-sm font-semibold text-${d.accent}-400`}>{d.name}</h3>
              </div>
              <p className="text-[11px] text-gray-600">{d.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-700 animate-pulse" />
                Coming Soon
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ━━ EXAMINATIONS & LEADERBOARD ━━ */}
      <section className="border-t border-gray-800/40 bg-gray-900/20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">Test Your Knowledge</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Exams */}
            <div className="rounded-2xl border border-indigo-900/30 bg-gradient-to-br from-indigo-950/15 to-transparent p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gray-900/60 border border-gray-800/40 flex items-center justify-center">
                  <ExamIcon />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-indigo-400">Examinations</h3>
                  <p className="text-[10px] text-gray-500">Timed quizzes with scoring</p>
                </div>
              </div>
              {exams.length > 0 ? (
                <div className="space-y-2">
                  {exams.map((exam) => {
                    const pts = exam.questionBank.reduce((s, q) => s + q.points, 0);
                    return (
                      <Link key={exam.id} href={`/exam/${exam.id}`}
                        className="group flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-900/40 border border-gray-800/30 hover:border-indigo-800/40 transition-colors">
                        <div>
                          <div className="text-xs sm:text-sm font-medium group-hover:text-white transition-colors">{exam.title}</div>
                          <div className="text-[10px] text-gray-600 mt-0.5">{exam.questionBank.length} questions &middot; {pts} pts {exam.timeLimit ? `\u00b7 ${Math.floor(exam.timeLimit / 60)} min` : ""}</div>
                        </div>
                        <svg className="w-4 h-4 text-gray-700 group-hover:text-indigo-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    );
                  })}
                </div>
              ) : <ComingSoon />}
            </div>

            {/* Leaderboard */}
            <div className="rounded-2xl border border-yellow-900/30 bg-gradient-to-br from-yellow-950/10 to-transparent p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gray-900/60 border border-gray-800/40 flex items-center justify-center">
                  <LeaderIcon />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-yellow-400">Leaderboard</h3>
                  <p className="text-[10px] text-gray-500">Compete with your classmates</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Complete exams to earn points. Top scores are saved per exam — see how you rank against your peers.
              </p>
              <Link href="/leaderboard"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/40 border border-gray-800/30 hover:border-yellow-800/40 text-xs font-medium text-gray-300 hover:text-white transition-colors">
                View Leaderboard
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━ HOW IT WORKS ━━ */}
      <section className="border-t border-gray-800/40">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">How it works</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { n: "01", t: "Choose a slide", d: "Pick a species, stage, or cell type from any department." },
              { n: "02", t: "Pan & zoom", d: "Drag to scan the smear. Scroll to zoom — like a real microscope." },
              { n: "03", t: "Toggle thick / thin", d: "Switch film types for detection vs. identification." },
              { n: "04", t: "Study annotations", d: "Click findings to learn morphology and clinical significance." },
            ].map((step) => (
              <div key={step.n}>
                <div className="text-2xl font-bold text-purple-900/60 tabular-nums">{step.n}</div>
                <h3 className="text-sm font-semibold mt-1">{step.t}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ FOOTER ━━ */}
      <footer className="border-t border-gray-800/40 py-6">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm font-semibold">
            Patho<span className="text-purple-400">Scope</span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-600">
            Realistic microscopy simulation for MLS education &middot; SVG-generated &middot; No images needed
          </p>
        </div>
      </footer>

      {/* Global animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ═══ Shared Components ═══ */

function DeptSection({ name, accent, icon, desc, children }: {
  name: string; accent: string; icon: React.ReactNode; desc: string; children: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border border-${accent}-900/30 bg-gradient-to-br from-${accent}-950/10 to-transparent overflow-hidden`}>
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-800/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-900/60 border border-gray-800/40 flex items-center justify-center">{icon}</div>
          <div>
            <h2 className={`text-sm sm:text-base font-semibold text-${accent}-400`}>{name}</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 max-w-md">{desc}</p>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-5 space-y-5">{children}</div>
    </section>
  );
}

function SubSection({ title, count, desc, children }: {
  title: string; count: number; desc: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2.5">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-300">{title}</h3>
          <p className="text-[10px] text-gray-600 mt-0.5">{desc}</p>
        </div>
        {count > 0 && <span className="text-[10px] text-gray-600 shrink-0 ml-3">{count} slides</span>}
      </div>
      {children}
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="py-6 text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900/40 border border-gray-800/30 text-[10px] text-gray-600">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-700 animate-pulse" />
        Coming Soon
      </div>
    </div>
  );
}

function SlideCard({ c }: { c: (typeof cases)[number] }) {
  return (
    <Link href={`/slide/${c.id}`}
      className="group block rounded-xl bg-gray-900/40 border border-gray-800/30 overflow-hidden hover:border-gray-600/50 hover:bg-gray-900/70 transition-all">
      <SlideCardThumbnail stage={c.svgConfig?.stage} species={c.svgConfig?.species} discipline={c.discipline} category={c.category} title={c.title} />
      <div className="px-2.5 pb-2.5 -mt-1">
        {c.svgConfig?.stage && (
          <span className="inline-block text-[8px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 uppercase tracking-wide mb-1">
            {c.svgConfig.stage}
          </span>
        )}
        <h3 className="text-[11px] sm:text-xs font-medium leading-snug group-hover:text-white transition-colors line-clamp-2">{c.title}</h3>
        <p className="text-[9px] text-gray-600 mt-0.5">{c.svgConfig?.fields.length ?? c.fields.length} fields</p>
      </div>
    </Link>
  );
}

/* ═══ Icons ═══ */

function HaemIcon() { return (<svg viewBox="0 0 24 24" className="w-5 h-5"><circle cx={12} cy={12} r={8} fill="none" stroke="rgba(244,63,94,0.4)" strokeWidth={1} /><circle cx={12} cy={12} r={3} fill="rgba(244,63,94,0.15)" /><circle cx={9} cy={10} r={1} fill="rgba(139,92,246,0.5)" /></svg>); }
function ParaIcon() { return (<svg viewBox="0 0 24 24" className="w-5 h-5"><ellipse cx={12} cy={12} rx={7} ry={5} fill="none" stroke="rgba(52,211,153,0.35)" strokeWidth={1} /><circle cx={10} cy={11} r={1.5} fill="rgba(52,211,153,0.25)" /><circle cx={14} cy={13} r={1} fill="rgba(52,211,153,0.2)" /></svg>); }
function UrineIcon() { return (<svg viewBox="0 0 24 24" className="w-5 h-5"><rect x={8} y={4} width={8} height={16} rx={2} fill="none" stroke="rgba(251,191,36,0.35)" strokeWidth={1} /><rect x={9.5} y={10} width={5} height={4} rx={0.5} fill="rgba(251,191,36,0.12)" /></svg>); }
function HistoIcon() { return (<svg viewBox="0 0 24 24" className="w-5 h-5"><rect x={5} y={6} width={14} height={12} rx={1} fill="none" stroke="rgba(56,189,248,0.35)" strokeWidth={1} /><line x1={8} y1={10} x2={16} y2={10} stroke="rgba(56,189,248,0.15)" strokeWidth={0.8} /><line x1={8} y1={13} x2={14} y2={13} stroke="rgba(56,189,248,0.15)" strokeWidth={0.8} /></svg>); }
function CytoIcon() { return (<svg viewBox="0 0 24 24" className="w-5 h-5"><circle cx={12} cy={12} r={7} fill="none" stroke="rgba(217,70,239,0.35)" strokeWidth={1} /><circle cx={12} cy={11} r={4} fill="rgba(217,70,239,0.1)" /><circle cx={12} cy={10.5} r={2} fill="rgba(217,70,239,0.18)" /></svg>); }
function SemenIcon() { return (<svg viewBox="0 0 24 24" className="w-5 h-5"><circle cx={10} cy={14} r={3} fill="none" stroke="rgba(45,212,191,0.35)" strokeWidth={1} /><path d="M13 14 Q16 10 14 7" fill="none" stroke="rgba(45,212,191,0.25)" strokeWidth={1} strokeLinecap="round" /></svg>); }
function ExamIcon() { return (<svg viewBox="0 0 24 24" className="w-5 h-5"><rect x={5} y={3} width={14} height={18} rx={2} fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth={1} /><line x1={9} y1={8} x2={15} y2={8} stroke="rgba(129,140,248,0.2)" strokeWidth={0.8} /><line x1={9} y1={11} x2={15} y2={11} stroke="rgba(129,140,248,0.2)" strokeWidth={0.8} /><line x1={9} y1={14} x2={12} y2={14} stroke="rgba(129,140,248,0.2)" strokeWidth={0.8} /></svg>); }
function LeaderIcon() { return (<svg viewBox="0 0 24 24" className="w-5 h-5"><rect x={4} y={12} width={4} height={8} rx={0.5} fill="rgba(250,204,21,0.2)" /><rect x={10} y={6} width={4} height={14} rx={0.5} fill="rgba(250,204,21,0.3)" /><rect x={16} y={9} width={4} height={11} rx={0.5} fill="rgba(250,204,21,0.15)" /></svg>); }
