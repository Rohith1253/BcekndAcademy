"use client";

import React, { useState } from "react";
import { GameScenario } from "@/games/types";
import { HelpCircle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface HttpStatusGameProps {
  scenarios: GameScenario[];
  onComplete: (answers: Record<string, any>) => void;
}

export default function HttpStatusGame({ scenarios, onComplete }: HttpStatusGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentScenario = scenarios[currentIndex];
  const isLast = currentIndex === scenarios.length - 1;

  const handleSelectOption = (option: string) => {
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
  const options = currentScenario.options || ["200 OK", "201 Created", "400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found", "409 Conflict", "500 Server Error"];

  return (
    <div className="space-y-6">
      {/* Progress Counter */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-400 pb-3 border-b border-white/[0.08]">
        <span>Scenario {currentIndex + 1} of {scenarios.length}</span>
        <div className="flex gap-1.5">
          {scenarios.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-cyan-400"
                  : idx < currentIndex
                  ? "w-2 bg-indigo-500"
                  : "w-2 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scenario Prompt Card */}
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-6 space-y-3 shadow-xl">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded">
          Real-World Backend Scenario
        </span>
        <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
          {currentScenario.prompt}
        </p>
      </div>

      {/* HTTP Status Code Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option;
          let btnStyle = "border-white/[0.1] bg-slate-950/70 text-slate-200 hover:border-cyan-400/40 hover:bg-slate-900";

          if (showFeedback) {
            if (option === currentScenario.correctAnswer) {
              btnStyle = "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-500/20";
            } else if (isSelected) {
              btnStyle = "border-rose-500/50 bg-rose-500/15 text-rose-300";
            } else {
              btnStyle = "border-white/[0.05] bg-slate-950/40 text-slate-500 opacity-60";
            }
          }

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelectOption(option)}
              disabled={showFeedback}
              className={`rounded-xl border p-4 text-xs font-mono font-bold transition-all text-left flex items-center justify-between cursor-pointer ${btnStyle}`}
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

      {/* Rationale & Feedback Panel */}
      {showFeedback && (
        <div className={`rounded-2xl border p-5 space-y-2 animate-fadeIn text-xs ${
          isCorrect ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <HelpCircle className="w-4 h-4 text-rose-400" />}
            <span>{isCorrect ? "Correct Choice!" : "Incorrect Choice"}</span>
          </div>
          <p className="leading-relaxed">{currentScenario.explanation}</p>
          {!isCorrect && selectedAnswer && currentScenario.wrongOptionExplanations?.[selectedAnswer] && (
            <p className="text-slate-300 font-mono text-[11px] pt-1 border-t border-white/10">
              <span className="text-rose-400 font-bold">Why {selectedAnswer} is wrong: </span>
              {currentScenario.wrongOptionExplanations[selectedAnswer]}
            </p>
          )}

          <div className="pt-3">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:scale-[1.02] cursor-pointer"
            >
              <span>{isLast ? "View Results" : "Next Scenario"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
