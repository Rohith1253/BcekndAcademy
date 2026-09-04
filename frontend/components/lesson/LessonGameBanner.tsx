"use client";

import React from "react";
import { Gamepad2, ArrowRight, Sparkles } from "lucide-react";
import { GAME_DEFINITIONS } from "@/games/registry";

interface LessonGameBannerProps {
  lessonSlug: string;
}

export default function LessonGameBanner({ lessonSlug }: LessonGameBannerProps) {
  // Find mapped game for this lesson or default to http-status
  const game =
    GAME_DEFINITIONS.find((g) => g.lessonSlug === lessonSlug) ||
    GAME_DEFINITIONS.find((g) => lessonSlug.includes(g.id) || lessonSlug.includes(g.slug)) ||
    GAME_DEFINITIONS[0];

  if (!game) return null;

  return (
    <div className="rounded-[24px] border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-slate-900/80 to-indigo-950/20 p-6 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>Test Your Knowledge Through a Game</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            🎮 Play {game.title}
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            You just learned backend concepts for this module. Reinforce your understanding with an interactive educational game challenge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/30 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>+{game.xpReward} XP</span>
          </div>

          <a
            href={`/games/${game.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-indigo-500/20 transition hover:scale-[1.02] cursor-pointer"
          >
            <span>Play Game</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
