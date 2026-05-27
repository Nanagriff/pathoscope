import { notFound } from "next/navigation";
import Link from "next/link";
import { cases, disciplines } from "@/data/cases";
import SlideViewer from "@/components/SlideViewer";
import SVGSlideViewer from "@/components/SVGSlideViewer";
import SlideSidebar from "@/components/SlideSidebar";
import MobileSidebarToggle from "@/components/MobileSidebarToggle";

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

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-3 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm shrink-0">
          &larr;
        </Link>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: disc?.color }} />
          <span className="text-xs text-gray-500 uppercase tracking-wide shrink-0 hidden sm:inline">
            {disc?.name}
          </span>
          <h1 className="text-sm font-semibold truncate">{slideCase.title}</h1>
        </div>
        {/* Mobile info toggle */}
        <MobileSidebarToggle slideCase={slideCase} />
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Viewer */}
        <div className="flex-1 min-w-0 min-h-0">
          {svg ? (
            <SVGSlideViewer
              stainType={svg.stainType}
              parasitemia={svg.parasitemia}
              fields={svg.fields}
              species={svg.species}
              stage={svg.stage}
              showFilmToggle={slideCase.discipline === "malaria"}
            />
          ) : (
            <SlideViewer fields={slideCase.fields} />
          )}
        </div>

        {/* Desktop sidebar */}
        <aside className="w-72 xl:w-80 shrink-0 border-l border-gray-800 bg-gray-900 overflow-y-auto hidden lg:block">
          <SlideSidebar slideCase={slideCase} />
        </aside>
      </div>
    </div>
  );
}
