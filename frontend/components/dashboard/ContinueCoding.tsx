"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Code2, ArrowRight, Sparkles, CheckCircle2, Flame, Trophy } from "lucide-react";
import { api } from "@/lib/api";
import type { CodingProgressStats, CodingChallengeSummary } from "@/lib/challenge-types";

export default function ContinueCoding() {
  const [stats, setStats] = useState<CodingProgressStats | null>(null);
  const [nextChallenge, setNextChallenge] = useState<CodingChallengeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch progress stats
        const progressRes = await api.get("/api/challenges/progress");
        if (progressRes.success && progressRes.data) {
          setStats(progressRes.data);
        }

        // 2. Fetch challenge catalog to find in-progress or next uncompleted challenge
        const catalogRes = await api.get("/api/challenges");
        if (catalogRes.success && catalogRes.data?.challenges) {
          const list: CodingChallengeSummary[] = catalogRes.data.challenges;
          const uncompleted = list.find((c) => !c.isCompleted);
          setNextChallenge(uncompleted || list[0] || null);
        }
      } catch (err) {
        console.error("Fetch coding stats error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded mb-4" />
        <div className="h-16 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  const completedCount = stats?.completedCount || 0;
  const totalCount = stats?.totalChallenges || 15;
  const totalCodingXP = stats?.totalCodingXP || 0;
  const streak = stats?.currentStreak || 0;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Hands-On Practice</p>
            <h3 className="text-xl font-bold text-white">Continue Coding</h3>
          </div>
        </div>

        <Link
          href="/challenges"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
        >
          <span>View All Challenges</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid: Active Challenge Card + Overall Stats */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12 items-center">
        {/* Next Recommended Challenge Card */}
        <div className="lg:col-span-7 rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5 shadow-inner shadow-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wide text-cyan-300">
                {nextChallenge?.category || "Backend Practice"}
              </span>
              <span className="text-[11px] font-mono font-semibold text-emerald-400 uppercase">
                {nextChallenge?.difficulty || "Easy"}
              </span>
            </div>

            <h4 className="text-base font-bold text-white">
              {nextChallenge?.title || "Create Hello API Response"}
            </h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {nextChallenge?.description || "Write real backend code and evaluate against test cases."}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs font-mono text-fuchsia-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              +{nextChallenge?.xpReward || 50} XP
            </span>

            <Link
              href={nextChallenge ? `/challenges/${nextChallenge.slug}` : "/challenges"}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/15 hover:bg-cyan-500/25 px-4 py-2 text-xs font-semibold text-cyan-300 transition"
            >
              Continue Practice
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Pill Breakdown */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Completed</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {completedCount} <span className="text-xs text-slate-500">/ {totalCount}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Practice XP</span>
            </div>
            <div className="text-xl font-bold font-mono text-fuchsia-300">
              {totalCodingXP} <span className="text-xs text-slate-500">XP</span>
            </div>
          </div>

          <div className="col-span-2 rounded-2xl border border-white/10 bg-slate-900/60 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300">Coding Streak</span>
            </div>
            <span className="font-mono text-sm font-bold text-amber-400">{streak} days</span>
          </div>
        </div>
      </div>
    </section>
  );
}
