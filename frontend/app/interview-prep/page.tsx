"use client";

import { useEffect, useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Sparkles, BookOpen, ShieldCheck } from "lucide-react";
import { getApiUrl } from "@/lib/http";
import { api } from "@/lib/api";
import { useClient } from "@/lib/store";

export default function InterviewPrepPage() {
  const { user, refreshUser } = useClient();
  const [questions, setQuestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<string, { selected: number; result?: any }>>({});

  useEffect(() => {
    async function loadInterview() {
      try {
        const [catRes, qRes] = await Promise.all([
          fetch(getApiUrl("/api/interview/categories")),
          fetch(getApiUrl("/api/interview/questions")),
        ]);
        const catJson = await catRes.json();
        const qJson = await qRes.json();

        if (catJson.success && Array.isArray(catJson.data?.categories)) {
          setCategories(catJson.data.categories);
        }
        if (qJson.success && Array.isArray(qJson.data?.questions)) {
          setQuestions(qJson.data.questions);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadInterview();
  }, []);

  const handleSelectOption = async (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: { selected: optionIndex } }));

    try {
      const res = await api.post("/api/interview/answer", {
        questionId,
        selectedOptionIndex: optionIndex,
      });

      if (res.success && res.data) {
        setUserAnswers((prev) => ({
          ...prev,
          [questionId]: { selected: optionIndex, result: res.data },
        }));
        if (refreshUser) refreshUser();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = selectedCategory === "all"
    ? questions
    : questions.filter((q) => q.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
            <HelpCircle className="h-4 w-4" />
            <span>Senior Staff Backend Knowledge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Backend Interview Preparation</h1>
          <p className="max-w-2xl text-sm sm:text-base text-slate-400">
            Master high-signal interview topics: Event Loop concurrency, MongoDB compound indexing, JWT security flaws, and distributed system architectures.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              selectedCategory === "all"
                ? "bg-violet-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 border border-white/10 hover:border-white/20"
            }`}
          >
            All Questions ({questions.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-violet-500 text-slate-950 shadow-md"
                  : "bg-slate-900 text-slate-300 border border-white/10 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((q, qIdx) => {
              const currentAns = userAnswers[q.id];
              const result = currentAns?.result;

              return (
                <div key={q.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 border border-violet-500/30">
                        {q.category}
                      </span>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-mono uppercase text-slate-300">
                        {q.difficulty}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-cyan-300 font-mono">+{q.xpReward} XP</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{q.title}</h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">{q.question}</p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {q.options?.map((opt: string, optIdx: number) => {
                      const isSelected = currentAns?.selected === optIdx;
                      const isRevealed = !!result;
                      const isCorrectOpt = result?.correctOptionIndex === optIdx;

                      let btnStyle = "border-white/10 bg-slate-950/60 hover:border-violet-500/40 text-slate-200";
                      if (isRevealed) {
                        if (isCorrectOpt) {
                          btnStyle = "border-emerald-500/50 bg-emerald-950/40 text-emerald-200 font-semibold";
                        } else if (isSelected && !isCorrectOpt) {
                          btnStyle = "border-rose-500/50 bg-rose-950/40 text-rose-200";
                        }
                      } else if (isSelected) {
                        btnStyle = "border-violet-500/60 bg-violet-950/40 text-violet-200 font-semibold";
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => !result && handleSelectOption(q.id, optIdx)}
                          disabled={!!result}
                          className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition flex items-center justify-between gap-4 ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isRevealed && isCorrectOpt && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
                          {isRevealed && isSelected && !isCorrectOpt && <XCircle className="h-5 w-5 text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback after answer */}
                  {result && (
                    <div className={`p-5 rounded-2xl border text-xs space-y-2 ${
                      result.isCorrect ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200" : "border-amber-500/40 bg-amber-950/30 text-amber-200"
                    }`}>
                      <div className="font-bold text-sm">
                        {result.isCorrect ? "✓ Correct Answer!" : "Review Concept:"}
                      </div>
                      <p className="leading-relaxed text-slate-300">{result.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
