import Link from "next/link";
import { exams, DIFFICULTY_META } from "@/data/exams";
import type { Difficulty } from "@/data/exams";

const LEVELS: Difficulty[] = ["student", "mls", "specialist", "consultant"];

export default function ExamsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="border-b border-gray-800/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors text-xs mb-3 inline-block">&larr; Home</Link>
          <h1 className="text-2xl font-bold">Examinations</h1>
          <p className="text-sm text-gray-400 mt-1">Competency assessments from student to consultant level</p>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-5 sm:px-8 py-6 w-full space-y-8">
        {LEVELS.map((level) => {
          const meta = DIFFICULTY_META[level];
          const levelExams = exams.filter((e) => e.difficulty === level);
          if (levelExams.length === 0) return null;
          return (
            <section key={level}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded ${meta.bg} ${meta.color}`}>
                  {meta.label}
                </span>
                <span className="text-[10px] text-gray-600">{meta.desc}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {levelExams.map((exam) => {
                  const pts = exam.questionBank.reduce((s, q) => s + q.points, 0);
                  return (
                    <Link key={exam.id} href={`/exam/${exam.id}`}
                      className="group block rounded-xl border border-gray-800/40 bg-gray-900/30 p-4 sm:p-5 hover:border-gray-600/50 transition-colors">
                      <h3 className="text-sm sm:text-base font-semibold group-hover:text-white transition-colors">{exam.title}</h3>
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{exam.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-600">
                        <span>{exam.questionBank.length} questions</span>
                        <span>{pts} pts</span>
                        {exam.timeLimit && <span>{Math.floor(exam.timeLimit / 60)} min</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

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
