"use client";

import React, { useState } from "react";
import { Zap, Clock, Lightbulb, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import type { CodingChallengeDetail } from "@/lib/challenge-types";

interface ChallengeDescriptionProps {
  challenge: CodingChallengeDetail;
  isCompleted?: boolean;
}

export default function ChallengeDescription({ challenge, isCompleted }: ChallengeDescriptionProps) {
  const [showHint, setShowHint] = useState(false);

  const difficultyBadge = {
    easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    hard: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  }[challenge.difficulty] || "border-slate-500/30 bg-slate-500/10 text-slate-400";

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300 uppercase">
            {challenge.category}
          </span>
          <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold uppercase ${difficultyBadge}`}>
            {challenge.difficulty}
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> Solved
            </span>
          )}
        </div>

        <h1 className="text-2xl font-extrabold text-white tracking-tight">{challenge.title}</h1>

        <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> ~{challenge.estimatedMinutes} mins
          </span>
          <span className="flex items-center gap-1 text-amber-300 font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> +{challenge.xpReward} XP
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Overview</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{challenge.description}</p>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Instructions</h3>
        <div className="rounded-xl border border-white/[0.08] bg-slate-900/60 p-4 text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
          {challenge.instructions}
        </div>
      </div>

      {/* Visible Test Requirements */}
      {challenge.visibleTests && challenge.visibleTests.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Visible Test Cases ({challenge.visibleTests.length})
          </h3>
          <div className="space-y-2">
            {challenge.visibleTests.map((t, idx) => (
              <div key={idx} className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-3 text-xs">
                <p className="font-semibold text-white">{t.name}</p>
                {t.description && (
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Hint Toggle */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="flex items-center justify-between w-full text-xs font-semibold text-amber-300 hover:text-amber-200 transition"
        >
          <span className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" /> Need a hint?
          </span>
          {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showHint && (
          <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            Carefully check parameter names, edge-case null/undefined values, and ensure your function returns the expected object or HTTP status chain. Use <code>console.log()</code> to inspect runtime values in the Console panel!
          </div>
        )}
      </div>
    </div>
  );
}
