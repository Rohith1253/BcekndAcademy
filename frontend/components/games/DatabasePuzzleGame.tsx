"use client";

import React, { useState } from "react";
import { GameScenario } from "@/games/types";
import { CheckCircle2, XCircle, ArrowRight, Database, HelpCircle } from "lucide-react";

interface DatabasePuzzleGameProps {
  scenarios: GameScenario[];
  onComplete: (answers: Record<string, any>) => void;
}

export default function DatabasePuzzleGame({ scenarios, onComplete }: DatabasePuzzleGameProps) {
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
        <span>Database Query Puzzle {currentIndex + 1} of {scenarios.length}</span>
        <div className="flex items-center gap-1 text-emerald-400 font-mono">
          <Database className="w-3.5 h-3.5" />
          <span>MongoDB / Mongoose ODM</span>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/80 p-6 space-y-3">
        <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
          Query Requirement Scenario
        </span>
        <p className="text-base sm:text-lg font-semibold text-white">
          {currentScenario.prompt}
        </p>
      </div>

      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option;
          let style = "border-white/10 bg-slate-950/70 text-slate-200 hover:border-emerald-400/40 hover:bg-slate-900";

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
            <span>{isCorrect ? "Valid Query Operator!" : "Invalid Query Construct"}</span>
          </div>
          <p className="leading-relaxed">{currentScenario.explanation}</p>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 cursor-pointer"
            >
              <span>{isLast ? "View Final Results" : "Next Query Challenge"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
