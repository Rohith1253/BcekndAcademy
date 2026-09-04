"use client";

import React from "react";
import { ArrowLeft, Clock, Sparkles, Trophy, RotateCcw } from "lucide-react";
import AnimatedBackground from "@/components/auth/AnimatedBackground";

interface GameShellProps {
  title: string;
  category: string;
  difficulty: string;
  xpReward: number;
  timeSpent: number;
  children: React.ReactNode;
  onBack?: () => void;
  onRestart?: () => void;
}

export default function GameShell({
  title,
  category,
  difficulty,
  xpReward,
  timeSpent,
  children,
  onBack,
  onRestart,
}: GameShellProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Ambient glowing orb background */}
      <AnimatedBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.12] bg-white/[0.04] p-4 sm:p-5 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3">
            <a
              href="/games"
              onClick={(e) => {
                if (onBack) {
                  e.preventDefault();
                  onBack();
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:border-white/20 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Games Hub</span>
            </a>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 font-semibold">
                <span>{category}</span>
                <span>•</span>
                <span className="capitalize text-indigo-300">{difficulty}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Tracker */}
            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTime(timeSpent)}</span>
            </div>

            {/* XP Reward Badge */}
            <div className="flex items-center gap-1.5 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1.5 text-xs font-bold text-fuchsia-300">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>+{xpReward} XP</span>
            </div>

            {/* Restart Option */}
            {onRestart && (
              <button
                type="button"
                onClick={onRestart}
                title="Restart Game"
                className="rounded-xl border border-white/10 bg-slate-950/70 p-2 text-slate-400 transition hover:border-white/20 hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Game Active Stage Container */}
        <div className="rounded-[28px] border border-white/[0.12] bg-white/[0.04] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
          {children}
        </div>
      </div>
    </div>
  );
}
