"use client";

import React from "react";
import Link from "next/link";
import { Clock, Zap, CheckCircle2, ArrowRight, Code2 } from "lucide-react";
import type { CodingChallengeSummary } from "@/lib/challenge-types";

interface ChallengeCardProps {
  challenge: CodingChallengeSummary;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const diffLower = (challenge.difficulty || "medium").toLowerCase();
  const difficultyBadge = {
    beginner: "border-teal-500/30 bg-teal-500/10 text-teal-300",
    easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    hard: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    advanced: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  }[diffLower] || "border-slate-500/30 bg-slate-500/10 text-slate-400";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-cyan-950/20">
      <div>
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300 tracking-wide uppercase">
            {challenge.category}
          </span>
          <span className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wide uppercase ${difficultyBadge}`}>
            {challenge.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
          {challenge.title}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-xs text-slate-400 leading-relaxed">
          {challenge.description}
        </p>

        {/* Supported Languages Tags */}
        {challenge.supportedLanguages && challenge.supportedLanguages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {challenge.supportedLanguages.slice(0, 4).map((lang) => (
              <span
                key={lang}
                className="rounded bg-slate-950/80 border border-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400"
              >
                {lang}
              </span>
            ))}
            {challenge.supportedLanguages.length > 4 && (
              <span className="rounded bg-slate-950/80 border border-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                +{challenge.supportedLanguages.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            ~{challenge.estimatedMinutes}m
          </span>
          <span className="flex items-center gap-1 text-amber-300 font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            +{challenge.xpReward} XP
          </span>
        </div>

        <Link
          href={`/challenges/${challenge.slug}`}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            challenge.isCompleted
              ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
              : "border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400"
          }`}
        >
          {challenge.isCompleted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Completed
            </>
          ) : (
            <>
              Solve Challenge
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
