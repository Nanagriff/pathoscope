"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Exam, ExamQuestion, ExamScore, Difficulty } from "@/data/exams";
import { exams, DIFFICULTY_META } from "@/data/exams";
import SVGSlideViewer from "./SVGSlideViewer";
import { generateSlide } from "./microscope/generateSlide";

interface Props {
  exam: Exam;
}

type Phase = "intro" | "active" | "review";

export default function SVGExamViewer({ exam }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string; correct: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(exam.timeLimit ?? 0);
  const [startTime, setStartTime] = useState(0);

  const q = questions[qIdx];
  const totalPts = questions.reduce((s, q) => s + q.points, 0);

  // Timer
  useEffect(() => {
    if (phase !== "active" || !exam.timeLimit) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setPhase("review");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, exam.timeLimit]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleStart = () => {
    // Draw random questions from bank, randomize seeds for each attempt
    const bank = [...exam.questionBank];
    const count = Math.min(exam.questionsPerAttempt, bank.length);
    // Shuffle
    for (let i = bank.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bank[i], bank[j]] = [bank[j], bank[i]];
    }
    // Take subset and randomize each slide seed so the same question generates a different slide
    const drawn = bank.slice(0, count).map((q, i) => ({
      ...q,
      id: `${q.id}-${Date.now()}-${i}`,
      slide: { ...q.slide, seed: q.slide.seed + Math.floor(Math.random() * 10000) },
    }));
    setQuestions(drawn);
    setQIdx(0);
    setAnswers([]);
    setSelected(null);
    setSubmitted(false);
    setPhase("active");
    setStartTime(Date.now());
    setTimeLeft(exam.timeLimit ?? 0);
  };

  const handleSubmit = () => {
    if (!selected || !q) return;
    const correct = selected === q.correctAnswer;
    setAnswers((prev) => [...prev, { questionId: q.id, answer: selected, correct }]);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(qIdx + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      finishExam();
    }
  };

  const finishExam = useCallback(() => {
    const earned = answers.reduce((s, a, i) => s + (a.correct ? questions[i].points : 0), 0);
    const score: ExamScore = {
      id: Date.now().toString(),
      examId: exam.id,
      userName: name || "Anonymous",
      score: earned,
      totalPoints: totalPts,
      percentage: Math.round((earned / totalPts) * 100),
      timeSpent: Math.round((Date.now() - startTime) / 1000),
      completedAt: new Date().toISOString(),
      answers,
    };
    // Save to leaderboard
    const key = `leaderboard-${exam.id}`;
    const existing: ExamScore[] = JSON.parse(localStorage.getItem(key) ?? "[]");
    existing.push(score);
    existing.sort((a, b) => b.percentage - a.percentage || a.timeSpent - b.timeSpent);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
    setPhase("review");
  }, [answers, exam, name, startTime, totalPts]);

  // Review stats
  const earnedPts = useMemo(() =>
    answers.reduce((s, a, i) => s + (a.correct ? questions[i].points : 0), 0),
    [answers, questions],
  );

  // Focus indicator for cell-specific questions
  const focusIndicator = useMemo(() => {
    if (!q || (q.type !== "identify-cell" && q.type !== "wbc-differential")) return undefined;
    const slide = generateSlide({
      width: 400, height: 300, cellSpacing: 7.6,
      parasitemia: q.slide.parasitemia, seed: q.slide.seed,
      smearDirection: 12, focusCenter: [0.50, 0.50], focusRadius: 350,
      species: q.slide.species,
      stageWeights: q.slide.stage ? { [q.slide.stage]: 1 } as Partial<Record<import("./microscope/types").ParasiteStage, number>> : undefined,
    });
    if (q.correctAnswer.toLowerCase().includes("platelet")) {
      const plt = slide.cells.find((c) => c.type === "platelet");
      if (plt) return { x: plt.x, y: plt.y };
    }
    const para = slide.cells.find((c) => c.type === "parasitized-rbc");
    if (para) return { x: para.x, y: para.y };
    const wbc = slide.cells.find((c) => ["neutrophil", "eosinophil", "basophil", "lymphocyte", "monocyte"].includes(c.type));
    if (wbc) return { x: wbc.x, y: wbc.y };
    return undefined;
  }, [q]);

  // All exams in the same discipline for difficulty switching
  const relatedExams = exams.filter((e) => e.discipline === exam.discipline);
  const levels: Difficulty[] = ["student", "mls", "specialist", "consultant"];

  // ── INTRO ──
  if (phase === "intro") {
    const meta = DIFFICULTY_META[exam.difficulty];
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="max-w-md w-full space-y-6">
          <div>
            <div className="text-[10px] text-purple-400 uppercase tracking-widest font-semibold mb-1">Examination</div>
            <h1 className="text-xl sm:text-2xl font-bold">{exam.title}</h1>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">{exam.description}</p>
          </div>

          {/* Difficulty selector */}
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">Difficulty Level</div>
            <div className="grid grid-cols-4 gap-1.5">
              {levels.map((lvl) => {
                const m = DIFFICULTY_META[lvl];
                const related = relatedExams.find((e) => e.difficulty === lvl);
                const isCurrent = lvl === exam.difficulty;
                if (!related) {
                  return (
                    <div key={lvl} className="py-2 rounded-lg text-center text-[9px] text-gray-700 bg-gray-900/20 border border-gray-800/20 cursor-not-allowed">
                      {m.label}
                    </div>
                  );
                }
                return isCurrent ? (
                  <div key={lvl} className={`py-2 rounded-lg text-center text-[10px] font-bold ${m.color} ${m.bg} border border-current/20`}>
                    {m.label}
                  </div>
                ) : (
                  <a key={lvl} href={`/exam/${related.id}`}
                    className="py-2 rounded-lg text-center text-[10px] font-medium text-gray-400 bg-gray-800/30 border border-gray-800/30 hover:border-gray-600/50 hover:text-white transition-colors">
                    {m.label}
                  </a>
                );
              })}
            </div>
            <p className="text-[9px] text-gray-600 mt-1.5">{meta.desc}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <InfoBox label="Questions" value={exam.questionsPerAttempt.toString()} />
            <InfoBox label="Question Bank" value={exam.questionBank.length.toString()} />
            <InfoBox label="Time Limit" value={exam.timeLimit ? `${Math.floor(exam.timeLimit / 60)} min` : "None"} />
          </div>
          <p className="text-[10px] text-gray-600 leading-relaxed">{exam.questionsPerAttempt} questions drawn randomly from a bank of {exam.questionBank.length}. Slides are re-generated each attempt.</p>

          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name for the leaderboard"
              className="w-full px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-sm focus:border-purple-600 focus:outline-none transition-colors"
            />
          </div>

          <button
            onClick={handleStart}
            disabled={!name.trim()}
            className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all hover:shadow-lg hover:shadow-purple-600/20"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  // ── REVIEW ──
  if (phase === "review") {
    const pct = totalPts > 0 ? Math.round((earnedPts / totalPts) * 100) : 0;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    // ECAMM-style domain scoring
    const detectionQs = answers.filter((_, i) => ["identify-finding", "true-false"].includes(questions[i].type));
    const speciesQs = answers.filter((_, i) => ["identify-species", "identify-stage", "identify-cell", "wbc-differential"].includes(questions[i].type));
    const quantQs = answers.filter((_, i) => ["estimate-density", "film-comment"].includes(questions[i].type));

    const detectionPct = detectionQs.length > 0 ? Math.round((detectionQs.filter(a => a.correct).length / detectionQs.length) * 100) : null;
    const speciesPct = speciesQs.length > 0 ? Math.round((speciesQs.filter(a => a.correct).length / speciesQs.length) * 100) : null;
    const quantPct = quantQs.length > 0 ? Math.round((quantQs.filter(a => a.correct).length / quantQs.length) * 100) : null;

    // WHO proficiency level
    const whoLevel = (() => {
      const det = detectionPct ?? pct;
      const sp = speciesPct ?? pct;
      const qt = quantPct ?? 100;
      if (det >= 90 && sp >= 80 && qt >= 40) return { level: 1, label: "Expert", color: "text-emerald-400", bg: "bg-emerald-900/30" };
      if (det >= 80 && sp >= 80 && qt >= 40) return { level: 2, label: "Competent", color: "text-sky-400", bg: "bg-sky-900/30" };
      if (det >= 70 && sp >= 70) return { level: 3, label: "Advanced Beginner", color: "text-amber-400", bg: "bg-amber-900/30" };
      return { level: 4, label: "Needs Training", color: "text-red-400", bg: "bg-red-900/30" };
    })();

    return (
      <div className="flex flex-col h-full overflow-y-auto p-6">
        <div className="max-w-lg mx-auto w-full space-y-6">
          {/* WHO Level */}
          <div className="text-center">
            <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${whoLevel.bg} ${whoLevel.color}`}>
              WHO Level {whoLevel.level} — {whoLevel.label}
            </div>
            <div className="text-5xl font-bold">{pct}<span className="text-xl text-gray-500">%</span></div>
            <p className="text-gray-400 mt-1 text-sm">{earnedPts} / {totalPts} points &middot; {formatTime(timeSpent)}</p>
          </div>

          {/* Domain scores */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Detection", pct: detectionPct, threshold: 80 },
              { label: "Species ID", pct: speciesPct, threshold: 80 },
              { label: "Quantitation", pct: quantPct, threshold: 40 },
            ].map((d) => (
              <div key={d.label} className="rounded-lg border border-gray-800/40 bg-gray-800/20 p-3 text-center">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{d.label}</div>
                {d.pct !== null ? (
                  <>
                    <div className={`text-lg font-bold mt-0.5 ${d.pct >= d.threshold ? "text-emerald-400" : "text-red-400"}`}>{d.pct}%</div>
                    <div className="text-[9px] text-gray-600">pass: {d.threshold}%</div>
                  </>
                ) : (
                  <div className="text-xs text-gray-600 mt-1">N/A</div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {questions.map((q, i) => {
              const a = answers[i];
              if (!a) return null;
              return (
                <div key={q.id} className={`rounded-lg border p-3 ${
                  a.correct ? "border-emerald-900/40 bg-emerald-950/10" : "border-red-900/40 bg-red-950/10"
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-gray-300">{q.prompt}</p>
                    <span className={`shrink-0 text-[10px] font-bold ${a.correct ? "text-emerald-400" : "text-red-400"}`}>
                      {a.correct ? `+${q.points}` : "0"}
                    </span>
                  </div>
                  {!a.correct && (
                    <div className="mt-2 text-[10px] text-gray-500">
                      Your answer: <span className="text-red-400">{a.answer}</span> &middot; Correct: <span className="text-emerald-400">{q.correctAnswer}</span>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-600 mt-1.5 leading-relaxed">{q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <a href={`/exam/${exam.id}`} className="flex-1 py-2.5 rounded-lg border border-gray-800 text-center text-sm font-medium hover:border-gray-600 transition-colors">
              Retake
            </a>
            <a href="/leaderboard" className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-center text-sm font-semibold text-white transition-colors">
              Leaderboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── ACTIVE ──
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Q{qIdx + 1}/{questions.length}</span>
          <span className="text-[10px] text-purple-400 font-semibold">{q.points} pts</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Progress dots */}
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${
                i < answers.length ? (answers[i].correct ? "bg-emerald-500" : "bg-red-500") :
                i === qIdx ? "bg-purple-500" : "bg-gray-800"
              }`} />
            ))}
          </div>
          {exam.timeLimit && (
            <span className={`text-xs font-mono tabular-nums ${timeLeft < 60 ? "text-red-400" : "text-gray-400"}`}>
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>

      {/* Main: slide + question */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Slide */}
        <div className="flex-1 min-w-0 min-h-0">
          <SVGSlideViewer
            key={q.id}
            stainType={q.slide.stainType}
            parasitemia={q.slide.parasitemia}
            fields={[{ seed: q.slide.seed }]}
            species={q.slide.species}
            stage={q.slide.stage}
            showFilmToggle={false}
            examMode={!submitted}
            initialFilmType={q.slide.filmType}
            focusIndicator={!submitted ? focusIndicator : undefined}
          />
        </div>

        {/* Question panel */}
        <div className="w-80 xl:w-96 shrink-0 border-l border-gray-800 bg-gray-900 overflow-y-auto hidden sm:block">
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-200 leading-relaxed font-medium">{q.prompt}</p>

            <div className="space-y-2">
              {q.options.map((opt) => {
                const isSelected = selected === opt;
                const isCorrect = opt === q.correctAnswer;
                let cls = "border-gray-800 bg-gray-800/30 hover:border-gray-600";
                if (submitted) {
                  if (isCorrect) cls = "border-emerald-600/60 bg-emerald-950/20 text-emerald-300";
                  else if (isSelected && !isCorrect) cls = "border-red-600/60 bg-red-950/20 text-red-300";
                  else cls = "border-gray-800/40 bg-gray-800/10 opacity-50";
                } else if (isSelected) {
                  cls = "border-purple-500/60 bg-purple-950/20 text-purple-200";
                }
                return (
                  <button key={opt}
                    onClick={() => !submitted && setSelected(opt)}
                    disabled={submitted}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs sm:text-sm transition-all ${cls}`}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div className="rounded-lg border border-gray-800/40 bg-gray-800/20 p-3">
                <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
              </div>
            )}

            {!submitted ? (
              <button onClick={handleSubmit} disabled={!selected}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all">
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNext}
                className="w-full py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold transition-all">
                {qIdx < questions.length - 1 ? "Next Question" : "Finish Exam"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile question panel — bottom sheet */}
      <div className="sm:hidden border-t border-gray-800 bg-gray-900 max-h-[45%] overflow-y-auto">
        <div className="p-3 space-y-3">
          <p className="text-xs text-gray-200 leading-relaxed font-medium">{q.prompt}</p>
          <div className="space-y-1.5">
            {q.options.map((opt) => {
              const isSelected = selected === opt;
              const isCorrect = opt === q.correctAnswer;
              let cls = "border-gray-800 bg-gray-800/30";
              if (submitted) {
                if (isCorrect) cls = "border-emerald-600/60 bg-emerald-950/20 text-emerald-300";
                else if (isSelected) cls = "border-red-600/60 bg-red-950/20 text-red-300";
                else cls = "border-gray-800/40 opacity-40";
              } else if (isSelected) cls = "border-purple-500/60 bg-purple-950/20";
              return (
                <button key={opt} onClick={() => !submitted && setSelected(opt)} disabled={submitted}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${cls}`}>
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && <p className="text-[10px] text-gray-500 leading-relaxed">{q.explanation}</p>}
          {!submitted ? (
            <button onClick={handleSubmit} disabled={!selected}
              className="w-full py-2 rounded-lg bg-purple-600 disabled:opacity-40 text-white text-xs font-semibold">Submit</button>
          ) : (
            <button onClick={handleNext}
              className="w-full py-2 rounded-lg bg-gray-800 text-white text-xs font-semibold">
              {qIdx < questions.length - 1 ? "Next" : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-800/30 border border-gray-800/40 px-3 py-2.5 text-center">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
