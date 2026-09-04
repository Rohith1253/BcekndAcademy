"use client";

import React, { useEffect, useState } from "react";
import { Gamepad2, ArrowRight, Trophy, Sparkles, Award } from "lucide-react";
import { api } from "@/lib/api";

export default function ContinuePlayingGames() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      try {
        const json = await api.get("/api/games");
        if (json.success && json.data?.games) {
          setGames(json.data.games);
        }
      } catch (err) {
        console.error("Dashboard games load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  const completedGames = games.filter((g) => g.progress?.completed);
  const nextRecommendedGame = games.find((g) => !g.progress?.completed) || games[0];

  if (loading || !nextRecommendedGame) return null;

  return (
    <section className="rounded-[2.5rem] border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900/90 to-indigo-950/40 p-7 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>Educational Games Hub</span>
          </div>
          <h3 className="mt-1 text-2xl font-bold text-white tracking-tight">
            Continue Playing
          </h3>
        </div>

        <a
          href="/games"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>View All ({games.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Featured Recommended Game Card */}
      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
              {nextRecommendedGame.category}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">
              {nextRecommendedGame.difficulty}
            </span>
          </div>

          <h4 className="text-lg font-bold text-white tracking-tight">
            {nextRecommendedGame.title}
          </h4>

          <p className="text-xs text-slate-300 max-w-md line-clamp-2">
            {nextRecommendedGame.description}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-fuchsia-300 block">+{nextRecommendedGame.xpReward} XP</span>
            <span className="text-[10px] text-slate-400">~{nextRecommendedGame.estimatedMinutes} mins</span>
          </div>

          <a
            href={`/games/${nextRecommendedGame.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:scale-[1.02] cursor-pointer"
          >
            <span>Play Now</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Mini Stats Summary */}
      <div className="grid grid-cols-3 gap-3 pt-2 text-center">
        <div className="rounded-xl border border-white/[0.08] bg-slate-950/60 p-3">
          <p className="text-xl font-bold text-cyan-400">{completedGames.length}/{games.length}</p>
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Games Cleared</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-slate-950/60 p-3">
          <p className="text-xl font-bold text-amber-400">
            {completedGames.filter((g) => g.progress?.stars === "gold").length}
          </p>
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Gold Stars</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-slate-950/60 p-3">
          <p className="text-xl font-bold text-fuchsia-400">
            {completedGames.reduce((acc, g) => acc + (g.progress?.xpEarned || 0), 0)}
          </p>
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Game XP Earned</p>
        </div>
      </div>
    </section>
  );
}
