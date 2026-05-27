import { notFound } from "next/navigation";
import Link from "next/link";
import { cases, disciplines } from "@/data/cases";
import SlideCardThumbnail from "@/components/SlideCardThumbnail";

export function generateStaticParams() {
  return disciplines.map((d) => ({ id: d.id }));
}

export default async function DisciplinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const disc = disciplines.find((d) => d.id === id);

  if (!disc) {
    notFound();
  }

  const disciplineCases = cases.filter((c) => c.discipline === id);

  return (
    <div className="flex flex-col min-h-full">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm mb-2 inline-block"
          >
            &larr; All Disciplines
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{disc.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{disc.name}</h1>
              <p className="text-gray-400 text-sm">{disc.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {disciplineCases.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No slides available yet for this discipline.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Content is being added regularly. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disciplineCases.map((c) => (
              <Link
                key={c.id}
                href={`/slide/${c.id}`}
                className="group block rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-600 transition-colors"
              >
                <SlideCardThumbnail
                  stage={c.svgConfig?.stage}
                  species={c.svgConfig?.species}
                  discipline={c.discipline}
                  category={c.category}
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                    {c.category}
                  </span>
                  {c.svgConfig?.stage && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-300 uppercase">
                      {c.svgConfig.stage}
                    </span>
                  )}
                </div>
                <h3 className="font-medium mt-1 text-sm group-hover:text-white transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                  {c.clinicalHistory}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                  <span>{c.urineConfig?.fields.length ?? c.sicklingConfig?.fields.length ?? c.svgConfig?.fields.length ?? c.fields.length} fields</span>
                  <span>{c.teachingPoints.length} teaching points</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
