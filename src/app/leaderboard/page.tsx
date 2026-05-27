"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { exams } from "@/data/exams";
import type { ExamScore } from "@/data/exams";

export default function LeaderboardPage() {
  const [selectedExam, setSelectedExam] = useState(exams[0]?.id || "");
  const [scores, setScores] = useState<ExamScore[]>([]);

  useEffect(() => {
    const key = `leaderboard-${selectedExam}`;
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    setScores(data);
  }, [selectedExam]);

  return (
    <div className="flex flex-col min-h-full">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors text-sm mb-2 inline-block">
            &larr; Home
          </Link>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-gray-400 mt-1">Top scores across all examinations</p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Exam selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => setSelectedExam(exam.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedExam === exam.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {exam.title}
            </button>
          ))}
        </div>

        {/* Scores table */}
        {scores.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No scores yet for this exam.</p>
            <Link
              href={`/exam/${selectedExam}`}
              className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
            >
              Be the first to take it
            </Link>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rank</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={s.id} className={`border-b border-gray-800/50 ${i < 3 ? "bg-gray-800/30" : ""}`}>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${
                        i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-gray-500"
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{s.userName}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-blue-400">{s.percentage}%</span>
                      <span className="text-xs text-gray-500 ml-2">{s.score}/{s.totalPoints}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                      {Math.floor(s.timeSpent / 60)}:{(s.timeSpent % 60).toString().padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(s.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
