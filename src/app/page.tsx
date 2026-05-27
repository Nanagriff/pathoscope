import Link from "next/link";
import { cases } from "@/data/cases";
import { exams } from "@/data/exams";
import SlideCardThumbnail from "@/components/SlideCardThumbnail";
import HeroBackground from "@/components/HeroBackground";
import LandingDemo from "@/components/LandingDemo";

/* ── Data ── */
const malariaCases = cases.filter((c) => c.discipline === "malaria");
const wbcCases = cases.filter((c) => c.discipline === "hematology" && c.category === "Normal WBC");
const rbcCases = cases.filter((c) => c.discipline === "hematology" && c.category !== "Normal WBC");
const totalQuestions = exams.reduce((s, e) => s + e.questionBank.length, 0);
const demoCase = malariaCases[0];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full overflow-x-hidden">

      {/* ━━━ FLOATING NAV ━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-4">
          <div className="glass rounded-2xl border border-white/[0.06] px-5 py-3 flex items-center justify-between">
            <Link href="/" className="text-sm font-bold text-white tracking-tight">
              Patho<span className="text-purple-400">Scope</span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/browse" className="px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                Slides
              </Link>
              <Link href="/exam" className="px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs text-gray-300 hover:text-white transition-colors duration-300 font-medium hidden sm:block">
                Exams
              </Link>
              <Link href={`/slide/${demoCase?.id ?? cases[0]?.id ?? ""}`}
                className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-[11px] sm:text-xs text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/20">
                Try it free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ━━━ HERO ━━━ */}
      <header className="relative isolate overflow-hidden min-h-[100svh] flex items-center justify-center pt-20">
        {/* Canvas */}
        <div className="absolute inset-0 -z-20"><HeroBackground /></div>
        {/* Heavy overlays for guaranteed contrast */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-950/90 via-gray-950/70 to-gray-950" />
        <div className="absolute top-0 inset-x-0 h-48 -z-10" style={{ background: "linear-gradient(to bottom, rgb(3,7,18), transparent)" }} />
        <div className="absolute bottom-0 inset-x-0 h-72 -z-10" style={{ background: "linear-gradient(to top, rgb(3,7,18), transparent)" }} />
        <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at center, transparent 15%, rgba(3,7,18,0.9) 100%)" }} />
        {/* Grain */}
        <div className="absolute inset-0 -z-[5] opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />
        {/* Radial glow behind eyepiece */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] -z-[8] rounded-full bg-purple-600/[0.04] blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 w-full py-8 sm:py-12">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-purple-400/20 bg-purple-500/10 backdrop-blur-sm mb-8 hero-blur" style={{ animationDelay: "0.1s" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-purple-200 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">The Future of Microscopy Training</span>
            </div>

            {/* Headline */}
            <h1 className="hero-blur text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.95]" style={{ animationDelay: "0.2s" }}>
              <span className="text-white">See what</span><br />
              <span className="text-gradient bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400 gradient-shift">textbooks can&apos;t show.</span>
            </h1>

            {/* Sub */}
            <p className="hero-fade text-gray-300 mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed" style={{ animationDelay: "0.45s" }}>
              A real microscope in your browser. Pan across blood films, zoom into parasites, identify morphology — indistinguishable from the real thing.
            </p>

            {/* CTAs */}
            <div className="hero-fade flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-9 w-full sm:w-auto" style={{ animationDelay: "0.65s" }}>
              <Link href={`/slide/${demoCase?.id ?? cases[0]?.id ?? ""}`}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-600/30 hover:scale-[1.03] active:scale-[0.97]">
                Start Exploring
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href={exams[0] ? `/exam/${exams[0].id}` : "/browse"}
                className="w-full sm:w-auto text-center px-9 py-4 rounded-full border border-white/10 hover:border-purple-400/30 text-white text-sm sm:text-base font-medium transition-all duration-300 hover:bg-white/[0.04] active:scale-[0.97] glass-subtle">
                Take an Exam
              </Link>
            </div>

            {/* Eyepiece — LIVE viewer inside */}
            <div className="hero-scale mt-12 sm:mt-16 relative" style={{ animationDelay: "0.4s" }}>
              <div className="relative float">
                {/* Outer glow */}
                <div className="absolute -inset-10 rounded-full bg-purple-500/[0.05] blur-[60px]" />
                {/* Ring */}
                <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] rounded-full overflow-hidden pulse-glow">
                  {demoCase?.svgConfig ? (
                    <LandingDemo
                      stainType={demoCase.svgConfig.stainType}
                      parasitemia={demoCase.svgConfig.parasitemia}
                      fields={demoCase.svgConfig.fields}
                      species={demoCase.svgConfig.species}
                      stage={demoCase.svgConfig.stage}
                    />
                  ) : (
                    <EyepieceIllustration />
                  )}
                  {/* Inner shadow */}
                  <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), inset 0 0 120px rgba(0,0,0,0.2)" }} />
                </div>
                {/* Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-7 h-[1px] bg-white/10" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-7 w-[1px] bg-white/10" />
                </div>
                {/* Label */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full glass border border-white/[0.06]">
                  <span className="text-[10px] sm:text-[11px] text-gray-200 font-[family-name:var(--font-geist-mono)] tracking-widest uppercase">100x oil · drag to explore</span>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="hero-fade grid grid-cols-4 gap-4 sm:gap-8 mt-16 sm:mt-20 pt-6 border-t border-white/[0.06] w-full max-w-lg" style={{ animationDelay: "0.9s" }}>
              {[
                { v: cases.length.toString(), l: "Slides" },
                { v: exams.length.toString(), l: "Exams" },
                { v: totalQuestions.toString(), l: "Questions" },
                { v: "3", l: "Disciplines" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="text-xl sm:text-3xl font-bold font-[family-name:var(--font-geist-mono)] tabular-nums text-white">{s.v}</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider font-[family-name:var(--font-geist-mono)] mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 scroll-pulse">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
        </div>
      </header>

      {/* ━━━ CAPABILITIES TICKER ━━━ */}
      <div className="border-y border-white/[0.04] bg-white/[0.01] py-4 overflow-hidden">
        <div className="ticker-scroll flex items-center gap-8 whitespace-nowrap w-max">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center gap-8">
              {[
                "Malaria Parasitology", "WBC Differential", "RBC Morphology",
                "Thick & Thin Films", "Giemsa Stain", "Wright-Giemsa Stain",
                "Species Identification", "Stage Recognition", "Parasitemia Estimation",
                "Timed Examinations", "Leaderboard", "Clinical Annotations",
              ].map((t) => (
                <span key={`${rep}-${t}`} className="flex items-center gap-3 text-xs text-gray-500 font-[family-name:var(--font-geist-mono)] uppercase tracking-wider">
                  <span className="w-1 h-1 rounded-full bg-purple-500/40" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ━━━ PROBLEM → SOLUTION ━━━ */}
      <section className="relative">
        {/* Mesh gradient bg */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-900/[0.03] rounded-full blur-[100px]" />
        </div>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
          <div className="text-center mb-16 sm:mb-20 reveal">
            <p className="text-[11px] sm:text-xs font-semibold text-purple-400 uppercase tracking-[0.2em] mb-4 font-[family-name:var(--font-geist-mono)]">Why this matters</p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Lab time is scarce.<br />
              <span className="text-gray-400">Proficiency shouldn&apos;t be.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 stagger-children">
            {[
              {
                problem: "Limited access",
                solution: "Your own microscope, anywhere",
                desc: "Dozens of students per microscope in university labs across Africa. PathScope gives every student unlimited seat time — no queues, no scheduling conflicts.",
                num: "01",
              },
              {
                problem: "No practice at home",
                solution: "Open your browser, open a slide",
                desc: "Morphology skills fade without daily practice. PathScope works on any device — study at home, on the bus, the night before your practical exam.",
                num: "02",
              },
              {
                problem: "Expensive consumables",
                solution: "Infinite slides, zero cost",
                desc: "Giemsa stain, immersion oil, glass slides — they add up. PathScope generates photorealistic blood films computationally. No reagents. No breakage. No limits.",
                num: "03",
              },
            ].map((item) => (
              <div key={item.num} className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 sm:p-8 card-hover shimmer">
                <div className="text-3xl sm:text-4xl font-bold text-purple-500/10 font-[family-name:var(--font-geist-mono)] mb-5">{item.num}</div>
                <p className="text-[11px] font-semibold text-purple-300/60 uppercase tracking-[0.15em] mb-2 font-[family-name:var(--font-geist-mono)]">
                  {item.problem}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">{item.solution}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ INTERACTIVE DEMO ━━━ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-purple-900/[0.05] rounded-full blur-[120px]" />
        </div>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
          <div className="text-center mb-12 sm:mb-14 reveal">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-green-400/20 bg-green-500/[0.06] mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-green-300 font-semibold tracking-wider uppercase font-[family-name:var(--font-geist-mono)]">Interactive · Try it now</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Don&apos;t take our word for it.
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              This is a real <span className="text-purple-300 font-semibold">P. falciparum</span> thin film. Drag to pan across the smear. Scroll to zoom in. Every cell, every parasite — rendered in real time.
            </p>
          </div>

          {/* Demo with animated gradient border */}
          <div className="relative max-w-4xl mx-auto reveal-scale">
            <div className="gradient-border rounded-2xl overflow-hidden" style={{ boxShadow: "0 30px 100px rgba(0,0,0,0.5)" }}>
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04] glass">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <div className="w-[1px] h-4 bg-white/[0.06] ml-1" />
                  <span className="text-xs font-medium text-gray-200">P. falciparum — Ring Forms · Thin Film</span>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 font-[family-name:var(--font-geist-mono)]">Giemsa stain</span>
                  <span className="w-[1px] h-3.5 bg-white/[0.06]" />
                  <span className="text-[11px] text-gray-500 font-[family-name:var(--font-geist-mono)]">Real-time rendering</span>
                </div>
              </div>
              {/* Viewer */}
              <div className="h-[300px] sm:h-[420px] lg:h-[480px]">
                {demoCase?.svgConfig ? (
                  <LandingDemo
                    stainType={demoCase.svgConfig.stainType}
                    parasitemia={demoCase.svgConfig.parasitemia}
                    fields={demoCase.svgConfig.fields}
                    species={demoCase.svgConfig.species}
                    stage={demoCase.svgConfig.stage}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Loading...</p>
                  </div>
                )}
              </div>
            </div>
            {/* CTA */}
            <div className="flex items-center justify-center mt-7">
              <Link href={`/slide/${demoCase?.id ?? cases[0]?.id}`}
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-purple-500/15 bg-purple-500/[0.05] text-sm text-purple-300 hover:text-purple-200 hover:border-purple-400/25 hover:bg-purple-500/10 transition-all duration-300 font-semibold">
                Open full viewer with annotations
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ DISCIPLINES ━━━ */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-14 gap-4 reveal">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold text-purple-400 uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-geist-mono)]">Disciplines</p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">What you&apos;ll master</h2>
              <p className="text-gray-400 mt-3 text-base sm:text-lg"><span className="text-white font-semibold">{cases.length} interactive slides</span> across three core areas.</p>
            </div>
            <Link href="/browse" className="hidden sm:inline-flex items-center gap-2.5 text-sm text-gray-300 hover:text-white transition-all duration-300 font-semibold group">
              Browse all
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 stagger-children">
            <DisciplineCard name="Malaria Parasitology" count={malariaCases.length}
              desc="Thin and thick blood films with P. falciparum and P. vivax. All developmental stages — rings, trophozoites, schizonts, gametocytes."
              accent="purple" href={`/slide/${malariaCases[0]?.id}`} thumbnail={malariaCases[0]} />
            <DisciplineCard name="WBC Morphology" count={wbcCases.length}
              desc="Master the five WBC types — neutrophils, eosinophils, basophils, lymphocytes, monocytes. Wright-Giemsa stained films."
              accent="rose" href={`/slide/${wbcCases[0]?.id}`} thumbnail={wbcCases[0]} />
            <DisciplineCard name="RBC Abnormalities" count={rbcCases.length}
              desc="Sickle cells, target cells, spherocytes — identify red cell abnormalities that point to underlying pathology."
              accent="amber" href={`/slide/${rbcCases[0]?.id}`} thumbnail={rbcCases[0]} />
          </div>

          <div className="sm:hidden mt-8 text-center">
            <Link href="/browse" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-white/[0.08] text-sm text-gray-200 hover:text-white hover:border-white/15 transition-all font-semibold glass-subtle">
              Browse all slides
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ EXAMS ━━━ */}
      <section className="relative bg-gradient-to-b from-white/[0.01] via-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="reveal">
              <p className="text-[11px] sm:text-xs font-semibold text-purple-400 uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-geist-mono)]">Assessments</p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Prove your<br /><span className="text-gray-400">proficiency.</span>
              </h2>
              <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed max-w-md">
                <span className="text-white font-semibold">{exams.length} timed exams</span> with {totalQuestions} questions. Identify species, estimate parasitemia, differentiate cells — all under the clock. Compete on the leaderboard.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-9">
                <Link href={exams[0] ? `/exam/${exams[0].id}` : "/exam"}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-600/25 hover:scale-[1.03] active:scale-[0.97]">
                  Start an Exam
                </Link>
                <Link href="/leaderboard"
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-white/10 hover:border-purple-400/25 text-white text-sm font-medium transition-all duration-300 hover:bg-white/[0.03] active:scale-[0.97] glass-subtle">
                  View Leaderboard
                </Link>
              </div>
            </div>

            <div className="space-y-3 reveal">
              {exams.slice(0, 4).map((exam, i) => {
                const pts = exam.questionBank.reduce((s, q) => s + q.points, 0);
                return (
                  <Link key={exam.id} href={`/exam/${exam.id}`}
                    className="group flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:border-purple-500/20 hover:bg-white/[0.04] transition-all duration-300 card-hover"
                    style={{ transitionDelay: `${i * 40}ms` }}>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm sm:text-base font-semibold text-white group-hover:text-purple-200 transition-colors">{exam.title}</div>
                      <div className="text-[11px] sm:text-xs text-gray-400 mt-1.5 font-[family-name:var(--font-geist-mono)]">
                        {exam.questionBank.length} questions · {pts} pts {exam.timeLimit ? `· ${Math.floor(exam.timeLimit / 60)} min` : ""}
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-purple-500/[0.06] border border-purple-500/10 flex items-center justify-center shrink-0 ml-4 group-hover:bg-purple-500/15 group-hover:border-purple-500/20 transition-all duration-300">
                      <svg className="w-4 h-4 text-purple-400 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </Link>
                );
              })}
              {exams.length > 4 && (
                <div className="text-center pt-2">
                  <Link href="/exam" className="text-xs text-gray-400 hover:text-purple-300 transition-colors">
                    +{exams.length - 4} more exams
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-28">
          <p className="text-[11px] sm:text-xs font-semibold text-purple-400 uppercase tracking-[0.2em] mb-10 font-[family-name:var(--font-geist-mono)] reveal">How it works</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 stagger-children">
            {[
              { n: "01", t: "Choose a slide", d: "Pick species, stage, or cell type from the slide library." },
              { n: "02", t: "Pan & zoom", d: "Drag to scan the smear. Scroll to zoom — exactly like the real thing." },
              { n: "03", t: "Toggle film types", d: "Switch thick and thin films. Detection vs. identification." },
              { n: "04", t: "Learn as you go", d: "Click any finding for morphology details and clinical significance." },
            ].map((step) => (
              <div key={step.n} className="group">
                <div className="text-4xl sm:text-5xl font-bold text-white/[0.04] font-[family-name:var(--font-geist-mono)] tabular-nums mb-4 group-hover:text-purple-500/10 transition-colors duration-500">{step.n}</div>
                <h3 className="text-base sm:text-lg font-bold text-white">{step.t}</h3>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CTA BANNER ━━━ */}
      <section className="py-20 sm:py-28 reveal">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Ready to see what you&apos;ve<br />been missing?
          </h2>
          <p className="text-gray-300 mt-5 text-base sm:text-lg max-w-md mx-auto">
            Join MLS students across Africa who are training smarter. Free to use. No account required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href={`/slide/${demoCase?.id ?? cases[0]?.id ?? ""}`}
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-600/30 hover:scale-[1.03] active:scale-[0.97]">
              Start exploring now
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link href="/browse"
              className="w-full sm:w-auto text-center px-10 py-4 rounded-full border border-white/10 text-white text-base font-medium transition-all duration-300 hover:bg-white/[0.04] hover:border-white/15 active:scale-[0.97]">
              Browse slides
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="border-t border-white/[0.04] py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-base font-bold text-white">Patho<span className="text-purple-400">Scope</span></span>
            <span className="text-gray-800">·</span>
            <span className="text-xs text-gray-400">Virtual microscopy for MLS education</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/browse" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">Slides</Link>
            <Link href="/exam" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">Exams</Link>
            <Link href="/leaderboard" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">Leaderboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══ Discipline Card ═══ */

function DisciplineCard({ name, count, desc, accent, href, thumbnail }: {
  name: string; count: number; desc: string; accent: string; href: string;
  thumbnail?: (typeof cases)[number];
}) {
  const styles: Record<string, { border: string; hoverBorder: string; text: string; glow: string; badge: string }> = {
    purple: { border: "border-purple-500/10", hoverBorder: "hover:border-purple-500/25", text: "text-purple-300", glow: "0 0 50px rgba(147,51,234,0.06)", badge: "bg-purple-500/10 text-purple-300 border-purple-500/15" },
    rose: { border: "border-rose-500/10", hoverBorder: "hover:border-rose-500/25", text: "text-rose-300", glow: "0 0 50px rgba(244,63,94,0.06)", badge: "bg-rose-500/10 text-rose-300 border-rose-500/15" },
    amber: { border: "border-amber-500/10", hoverBorder: "hover:border-amber-500/25", text: "text-amber-300", glow: "0 0 50px rgba(245,158,11,0.06)", badge: "bg-amber-500/10 text-amber-300 border-amber-500/15" },
  };
  const s = styles[accent] ?? styles.purple;

  return (
    <Link href={href}
      className={`group block rounded-2xl border ${s.border} ${s.hoverBorder} bg-white/[0.02] overflow-hidden transition-all duration-400 card-hover`}
      style={{ boxShadow: s.glow }}>
      {thumbnail && (
        <div className="border-b border-white/[0.04] overflow-hidden">
          <div className="transition-transform duration-700 group-hover:scale-[1.06]">
            <SlideCardThumbnail stage={thumbnail.svgConfig?.stage} species={thumbnail.svgConfig?.species} discipline={thumbnail.discipline} category={thumbnail.category} title={thumbnail.title} />
          </div>
        </div>
      )}
      <div className="px-5 sm:px-6 py-5 sm:py-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-base sm:text-lg font-bold ${s.text}`}>{name}</h3>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${s.badge} font-[family-name:var(--font-geist-mono)] tabular-nums shrink-0`}>{count}</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        <div className="mt-5 flex items-center gap-2.5 text-sm text-gray-400 group-hover:text-white transition-colors duration-300 font-semibold">
          <span>Explore slides</span>
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </div>
      </div>
    </Link>
  );
}

/* ═══ Eyepiece Illustration (fallback if no demo case) ═══ */

function EyepieceIllustration() {
  const cells: { cx: number; cy: number; r: number; parasitized: boolean; opacity: number }[] = [];
  let seed = 42;
  const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 90; i++) {
    cells.push({ cx: rand() * 400, cy: rand() * 400, r: 14 + rand() * 6, parasitized: rand() < 0.12, opacity: 0.5 + rand() * 0.4 });
  }
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" style={{ background: "#f0e8ef" }}>
      <defs>
        <radialGradient id="ep-bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#efe4ee" /><stop offset="100%" stopColor="#e0d2de" /></radialGradient>
        <radialGradient id="ep-rbc" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#eadae8" /><stop offset="40%" stopColor="#d4b0cf" /><stop offset="100%" stopColor="#c89ac2" /></radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#ep-bg)" />
      {cells.map((c, i) => (
        <g key={i} opacity={c.opacity}>
          <circle cx={c.cx} cy={c.cy} r={c.r} fill="url(#ep-rbc)" />
          <circle cx={c.cx} cy={c.cy} r={c.r * 0.35} fill="#efe4ee" opacity={0.6} />
          {c.parasitized && (<>
            <circle cx={c.cx + c.r * 0.15} cy={c.cy - c.r * 0.1} r={c.r * 0.25} fill="none" stroke="#3a1860" strokeWidth={1.2} opacity={0.7} strokeDasharray={`${c.r * 1.2} ${c.r * 0.4}`} />
            <circle cx={c.cx + c.r * 0.3} cy={c.cy - c.r * 0.25} r={1.8} fill="#2d1050" opacity={0.85} />
          </>)}
        </g>
      ))}
    </svg>
  );
}
