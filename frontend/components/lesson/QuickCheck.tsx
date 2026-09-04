"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Sparkles, HelpCircle, RotateCcw, Lightbulb } from "lucide-react";

export interface QuickCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptHint?: string;
}

interface QuickCheckProps {
  questions?: QuickCheckQuestion[];
  title?: string;
}

export default function QuickCheck({ questions, title = "Quick Concept Check" }: QuickCheckProps) {
  const defaultQuestions: QuickCheckQuestion[] = [
    {
      question: "What is the primary architectural responsibility of backend middleware?",
      options: [
        "Store data permanently in the database collection",
        "Process, inspect, or mutate requests between the client and route handler",
        "Compile backend templates into HTML for the client",
        "Generate TLS security certificates automatically"
      ],
      correctIndex: 1,
      explanation: "Middleware functions have access to the request (req) and response (res) objects, enabling tasks like authentication, logging, rate limiting, and request transformation.",
      conceptHint: "Think of middleware as a pipeline filter through which every incoming HTTP packet passes."
    }
  ];

  const activeQuestions = questions && questions.length > 0 ? questions : defaultQuestions;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const handleSelect = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleReset = (qIdx: number) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[qIdx];
      return next;
    });
    setShowExplanation((prev) => {
      const next = { ...prev };
      delete next[qIdx];
      return next;
    });
  };

  return (
    <section className="not-prose my-10 rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#070914] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400">
              Checkpoint
            </span>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </div>

        <span className="rounded-full border border-white/10 bg-slate-900/90 px-3 py-1 text-xs font-mono text-slate-400">
          Instant Feedback
        </span>
      </div>

      <div className="space-y-8">
        {activeQuestions.map((q, qIdx) => {
          const selected = selectedAnswers[qIdx];
          const hasAnswered = selected !== undefined;
          const isCorrect = selected === q.correctIndex;

          return (
            <div key={qIdx} className="space-y-4">
              <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                {q.question}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, optIdx) => {
                  let optStyle = "border-white/10 bg-slate-900/60 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900/90 hover:text-white";

                  if (hasAnswered) {
                    if (optIdx === q.correctIndex) {
                      optStyle = "border-emerald-500/50 bg-emerald-950/40 text-emerald-200 font-semibold ring-1 ring-emerald-500/40";
                    } else if (optIdx === selected) {
                      optStyle = "border-rose-500/50 bg-rose-950/40 text-rose-200 line-through opacity-80 ring-1 ring-rose-500/40";
                    } else {
                      optStyle = "border-white/5 bg-slate-950/40 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasAnswered}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full text-left rounded-2xl border p-4 text-xs sm:text-sm transition-all duration-200 flex items-start gap-3 cursor-pointer ${optStyle}`}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-slate-950/80 font-mono text-xs font-bold text-slate-400 border border-white/10">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Banner */}
              {hasAnswered && (
                <div
                  className={`rounded-2xl border p-4 sm:p-5 transition-all text-xs sm:text-sm ${
                    isCorrect
                      ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                      : "border-amber-500/30 bg-amber-950/20 text-amber-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <p className="font-bold text-white text-sm">
                          {isCorrect ? "✓ Correct!" : "✗ Not quite."}
                        </p>
                        <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                      </div>
                    </div>

                    {!isCorrect && (
                      <button
                        onClick={() => handleReset(qIdx)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 underline shrink-0 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Try Again</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
