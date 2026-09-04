"use client";

import React, { useState } from "react";
import { GameScenario } from "@/games/types";
import { CheckCircle2, XCircle, ArrowRight, Bug, HelpCircle } from "lucide-react";

interface BugHunterGameProps {
  scenarios: GameScenario[];
  onComplete: (answers: Record<string, any>) => void;
}

export default function BugHunterGame({ scenarios, onComplete }: BugHunterGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentScenario = scenarios[currentIndex];
  const isLast = currentIndex === scenarios.length - 1;

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;
    const newAnswers = { ...answers, [currentScenario.id]: selectedAnswer };
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setShowFeedback(false);

    if (isLast) {
      onComplete(newAnswers);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!currentScenario) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 text-center text-slate-400">
        <p className="text-sm font-medium">No scenarios available for this challenge.</p>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentScenario.correctAnswer;
  const options = currentScenario.options || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-medium text-slate-400 pb-3 border-b border-white/[0.08]">
        <span>Bug Hunter {currentIndex + 1} of {scenarios.length}</span>
        <div className="flex items-center gap-1 text-rose-400 font-mono">
          <Bug className="w-3.5 h-3.5" />
          <span>Node.js / TS Code Inspection</span>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-500/20 bg-slate-950/80 p-5 space-y-3">
        <span className="text-[10px] font-mono font-bold uppercase text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded">
          Bug Identification Scenario
        </span>
        <p className="text-sm sm:text-base font-semibold text-white">
          {currentScenario.prompt}
        </p>

        {/* Code Snippet Box */}
        {currentScenario.codeSnippet && (
          <div className="rounded-xl border border-white/[0.08] bg-slate-950 p-4 font-mono text-xs text-rose-300 leading-relaxed overflow-x-auto">
            <pre>{currentScenario.codeSnippet}</pre>
          </div>
        )}
      </div>

      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option;
          let style = "border-white/10 bg-slate-950/70 text-slate-200 hover:border-rose-400/40 hover:bg-slate-900";

          if (showFeedback) {
            if (option === currentScenario.correctAnswer) {
              style = "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-500/20";
            } else if (isSelected) {
              style = "border-rose-500/50 bg-rose-500/15 text-rose-300";
            } else {
              style = "border-white/[0.05] bg-slate-950/40 text-slate-500 opacity-60";
            }
          }

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={showFeedback}
              className={`rounded-xl border p-4 text-xs font-mono font-bold text-left flex items-center justify-between transition cursor-pointer ${style}`}
            >
              <span>{option}</span>
              {showFeedback && option === currentScenario.correctAnswer && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {showFeedback && isSelected && option !== currentScenario.correctAnswer && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className={`rounded-2xl border p-5 space-y-2 animate-fadeIn text-xs ${
          isCorrect ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <HelpCircle className="w-4 h-4 text-rose-400" />}
            <span>{isCorrect ? "Bug Located & Fixed!" : "Incorrect Diagnosis"}</span>
          </div>
          <p className="leading-relaxed">{currentScenario.explanation}</p>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-400 to-indigo-500 px-5 py-2.5 text-xs font-bold text-slate-950 cursor-pointer"
            >
              <span>{isLast ? "View Final Results" : "Next Bug Scenario"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
