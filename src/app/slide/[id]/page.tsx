import { notFound } from "next/navigation";
import Link from "next/link";
import { cases, disciplines } from "@/data/cases";
import SlideViewer from "@/components/SlideViewer";
import SVGSlideViewer from "@/components/SVGSlideViewer";
import SicklingViewer from "@/components/SicklingViewer";
import UrineViewer from "@/components/UrineViewer";
import SlideSidebar from "@/components/SlideSidebar";
import MobileSidebarToggle from "@/components/MobileSidebarToggle";
import SlideOnboarding from "@/components/SlideOnboarding";

export function generateStaticParams() {
  return cases.map((c) => ({ id: c.id }));
}

export default async function SlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slideCase = cases.find((c) => c.id === id);

  if (!slideCase) {
    notFound();
  }

  const disc = disciplines.find((d) => d.id === slideCase.discipline);
  const svg = slideCase.svgConfig;
  const sickling = slideCase.sicklingConfig;
  const urine = slideCase.urineConfig;

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-3 py-2.5 bg-gray-900 border-b border-gray-700 shrink-0">
        <Link href="/browse" className="text-gray-300 hover:text-white transition-colors text-sm shrink-0">
          &larr;
        </Link>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: disc?.color }} />
          <span className="text-xs text-gray-400 uppercase tracking-wide shrink-0 hidden sm:inline">
            {disc?.name}
          </span>
          <h1 className="text-sm font-semibold text-white truncate">{slideCase.title}</h1>
        </div>
        {/* Mobile info toggle */}
        <MobileSidebarToggle slideCase={slideCase} />
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Viewer */}
        <div className="flex-1 min-w-0 min-h-0 relative">
          {urine ? (
            <UrineViewer config={urine} fields={urine.fields} />
          ) : sickling ? (
            <SicklingViewer
              sicklingRate={sickling.sicklingRate}
              fields={sickling.fields}
            />
          ) : svg ? (
            <SVGSlideViewer
              stainType={svg.stainType}
              parasitemia={svg.parasitemia}
              fields={svg.fields}
              species={svg.species}
              stage={svg.stage}
              showFilmToggle={slideCase.discipline === "malaria"}
              initialFilmType={slideCase.discipline === "malaria" ? "thick" : undefined}
            />
          ) : (
            <SlideViewer fields={slideCase.fields} />
          )}
          {/* First-time onboarding overlay */}
          <SlideOnboarding isMalaria={slideCase.discipline === "malaria"} />
        </div>

        {/* Desktop sidebar */}
        <aside className="w-72 xl:w-80 shrink-0 border-l border-gray-800 bg-gray-900 overflow-y-auto hidden lg:block">
          <SlideSidebar slideCase={slideCase} />
        </aside>
      </div>
    </div>
  );
}
