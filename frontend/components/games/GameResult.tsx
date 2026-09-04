"use client";

import React from "react";
import { Trophy, Award, Sparkles, CheckCircle2, XCircle, RotateCcw, ArrowRight, BookOpen } from "lucide-react";
import { GameStarRating } from "@/games/types";

interface GameResultProps {
  score: number;
  stars: GameStarRating;
  xpEarned: number;
  alreadyCompleted: boolean;
  message: string;
  breakdown: Array<{
    scenarioId: string;
    isCorrect: boolean;
    userAnswer: any;
    correctAnswer: any;
    explanation: string;
  }>;
  onPlayAgain: () => void;
  nextGameSlug?: string;
}

export default function GameResult({
  score,
  stars,
  xpEarned,
  alreadyCompleted,
  message,
  breakdown,
  onPlayAgain,
  nextGameSlug = "api-flow",
}: GameResultProps) {
  const getStarBadge = (starRating: GameStarRating) => {
    switch (starRating) {
      case "gold":
        return {
          label: "Gold Star Master",
          color: "text-amber-400 border-amber-400/40 bg-amber-400/10",
          icon: <Trophy className="w-8 h-8 text-amber-400" />,
        };
      case "silver":
        return {
          label: "Silver Star Developer",
          color: "text-slate-300 border-slate-300/40 bg-slate-300/10",
          icon: <Award className="w-8 h-8 text-slate-300" />,
        };
      case "bronze":
        return {
          label: "Bronze Star Learner",
          color: "text-amber-600 border-amber-600/40 bg-amber-600/10",
          icon: <Award className="w-8 h-8 text-amber-600" />,
        };
      default:
        return {
          label: "Needs Review",
          color: "text-rose-400 border-rose-400/40 bg-rose-400/10",
          icon: <XCircle className="w-8 h-8 text-rose-400" />,
        };
    }
  };

  const badgeInfo = getStarBadge(stars);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="text-center max-w-xl mx-auto space-y-4">
        <div className="inline-flex p-4 rounded-full border border-white/10 bg-slate-950/80 shadow-2xl">
          {badgeInfo.icon}
        </div>

        <div>
          <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${badgeInfo.color}`}>
            {badgeInfo.label}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Final Score: <span className="text-cyan-400">{score}%</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">{message}</p>
        </div>

        {/* XP Reward Granted */}
        {xpEarned > 0 ? (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-fuchsia-500/40 bg-fuchsia-500/15 px-6 py-2.5 text-sm font-bold text-fuchsia-300 shadow-lg shadow-fuchsia-500/20">
            <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            <span>+{xpEarned} XP Added to Profile!</span>
          </div>
        ) : alreadyCompleted ? (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2 text-xs font-semibold text-slate-400">
            <span>Replay Mode (XP already claimed)</span>
          </div>
        ) : null}
      </div>

      {/* Answer Rationale Breakdown */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Scenario Rationale Breakdown ({breakdown.filter((b) => b.isCorrect).length}/{breakdown.length} Correct)
        </h3>

        <div className="space-y-3">
          {breakdown.map((item, idx) => (
            <div
              key={item.scenarioId || idx}
              className={`rounded-2xl border p-4 backdrop-blur-xl space-y-2 text-xs transition ${
                item.isCorrect
                  ? "border-emerald-500/30 bg-emerald-500/[0.05]"
                  : "border-rose-500/30 bg-rose-500/[0.05]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 font-semibold">
                <div className="flex items-center gap-2">
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className="text-white">Question {idx + 1}</span>
                </div>
                <span className={item.isCorrect ? "text-emerald-400" : "text-rose-400"}>
                  {item.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>

              <div className="text-slate-300 font-mono text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-white/[0.06]">
                <p>
                  <span className="text-slate-500">Your Selection: </span>
                  <span className={item.isCorrect ? "text-emerald-300" : "text-rose-300"}>
                    {Array.isArray(item.userAnswer) ? item.userAnswer.join(" -> ") : String(item.userAnswer || "No answer")}
                  </span>
                </p>
                {!item.isCorrect && (
                  <p className="mt-1">
                    <span className="text-slate-500">Correct Answer: </span>
                    <span className="text-cyan-300">
                      {Array.isArray(item.correctAnswer) ? item.correctAnswer.join(" -> ") : String(item.correctAnswer)}
                    </span>
                  </p>
                )}
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">
                <span className="font-bold text-slate-200">Rationale: </span>
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 text-xs font-bold text-white transition hover:bg-white/[0.12] hover:border-white/30 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>

        <a
          href={`/games/${nextGameSlug}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-indigo-500/25 transition hover:scale-[1.02] cursor-pointer"
        >
          <span>Next Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        <a
          href="/courses"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Back to Courses</span>
        </a>
      </div>
    </div>
  );
}
