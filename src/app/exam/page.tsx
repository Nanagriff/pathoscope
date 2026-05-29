import Link from "next/link";
import { exams, DIFFICULTY_META } from "@/data/exams";

const DEPARTMENTS = [
  {
    id: "haematology",
    name: "Haematology",
    color: "#DC2626",
    subcategories: [
      { id: "haematoparasitology", name: "Haematoparasitology", desc: "Malaria parasites — detection, species ID, staging, quantitation" },
      { id: "morphology", name: "Morphology & Film Commenting", desc: "WBC differential, RBC abnormalities, film reporting" },
      { id: "wet-prep", name: "Wet Preps", desc: "Sickling test, reticulocyte count" },
    ],
  },
  {
    id: "microbiology",
    name: "Microbiology",
    color: "#D97706",
    subcategories: [
      { id: "wet-prep", name: "Wet Preps", desc: "Urine sediment, vaginal wet mount, stool wet prep" },
      { id: "stained-prep", name: "Stained Preps", desc: "Gram stain, ZN stain, India ink" },
      { id: "culture", name: "Culture & Sensitivity", desc: "Colony morphology, biochemical tests, AST" },
    ],
  },
] as const;

export default function ExamsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="border-b border-gray-800/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors text-xs mb-3 inline-block">&larr; Home</Link>
          <h1 className="text-2xl font-bold">Examinations</h1>
          <p className="text-sm text-gray-400 mt-1">Competency assessments grouped by department</p>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-5 sm:px-8 py-6 w-full space-y-10">
        {DEPARTMENTS.map((dept) => (
          <section key={dept.id}>
            {/* Department header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: dept.color }} />
              <h2 className="text-lg font-bold">{dept.name}</h2>
            </div>

            <div className="space-y-6 pl-4 border-l border-gray-800/30">
              {dept.subcategories.map((sub) => {
                const subExams = exams.filter(
                  (e) => e.department === dept.id && e.subcategory === sub.id
                );
                const hasExams = subExams.length > 0;
                const isComingSoon = !hasExams;

                return (
                  <div key={sub.id}>
                    {/* Subcategory header */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-200">{sub.name}</h3>
                      {isComingSoon && (
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 uppercase tracking-wider">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mb-3">{sub.desc}</p>

                    {hasExams ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {subExams.map((exam) => {
                          const meta = DIFFICULTY_META[exam.difficulty];
                          const pts = exam.questionBank.reduce((s, q) => s + q.points, 0);
                          return (
                            <Link key={exam.id} href={`/exam/${exam.id}`}
                              className="group block rounded-xl border border-gray-800/40 bg-gray-900/30 p-4 sm:p-5 hover:border-gray-600/50 transition-colors">
                              <div className="flex items-center gap-2 mb-1.5">
                                <h4 className="text-sm font-semibold group-hover:text-white transition-colors flex-1">{exam.title}</h4>
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${meta.bg} ${meta.color}`}>
                                  {meta.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{exam.description}</p>
                              <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-600">
                                <span>{exam.questionBank.length} questions</span>
                                <span>{pts} pts</span>
                                {exam.timeLimit && <span>{Math.floor(exam.timeLimit / 60)} min</span>}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-800/30 bg-gray-900/10 p-4 text-center">
                        <p className="text-xs text-gray-600">Exams for this section are under development</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <div className="pt-4">
          <Link href="/leaderboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-800/40 hover:border-gray-600/50 text-sm font-medium transition-colors">
            View Leaderboards &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
