"use client";

import { useEffect, useState } from "react";
import { Flame, Target, Trophy, ArrowRight, Zap, Sparkles } from "lucide-react";
import { useClient } from "@/lib/store";
import { getApiUrl } from "@/lib/http";

export default function GamificationCompactWidget() {
  const { user } = useClient();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    async function fetchSummary() {
      try {
        const res = await fetch(getApiUrl("/api/gamification/summary"), { credentials: "include" });
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (e) {
        // silent fail
      }
    }
    fetchSummary();
  }, [user]);

  if (!user || !data) return null;

  const streak = data.streak || { currentStreak: 0 };
  const dailyGoals = data.dailyGoals || { completedCount: 0, totalGoals: 3 };
  const levelInfo = data.levelInfo || { level: 1, title: "Backend Novice", progressPercentage: 0 };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900/90 to-violet-950/40 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur">
      <div className="flex flex-wrap items-center gap-6">
        {/* Streak indicator */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Flame className="h-6 w-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">Streak</div>
            <div className="text-xl font-bold text-white">{streak.currentStreak} Days</div>
          </div>
        </div>

        {/* Daily Goals */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">Daily Goals</div>
            <div className="text-xl font-bold text-white">{dailyGoals.completedCount}/{dailyGoals.totalGoals} Done</div>
          </div>
        </div>

        {/* Level Rank */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">Level {levelInfo.level}</div>
            <div className="text-sm font-bold text-white truncate max-w-[150px]">{levelInfo.title}</div>
          </div>
        </div>
      </div>

      <a
        href="/gamification"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:opacity-95 transition shadow-md shrink-0"
      >
        <span>Gamification Hub</span>
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
