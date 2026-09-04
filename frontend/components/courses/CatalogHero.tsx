"use client";

import React from "react";
import { BookOpen, Layers, Terminal, Sparkles, Compass } from "lucide-react";

interface CatalogHeroProps {
  totalCourses: number;
  totalModules: number;
  totalLessons: number;
  totalXP: number;
}

export default function CatalogHero({
  totalCourses,
  totalModules,
  totalLessons,
  totalXP,
}: CatalogHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-900 p-8 sm:p-12 shadow-sm">
      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="uppercase tracking-[0.2em] text-[11px] font-bold">Your Learning Journey</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Your Backend Developer{" "}
          <span className="text-cyan-300">
            Learning Journey
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          Follow a structured path from backend fundamentals to building secure, production-ready backend applications.
        </p>

        {/* Learning Statistics Pills */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 rounded-md border border-white/[0.08] bg-slate-800/70 p-3.5 shadow-sm transition hover:border-cyan-500/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {totalCourses || 5}
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-white/[0.08] bg-slate-800/70 p-3.5 shadow-sm transition hover:border-indigo-500/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {totalModules || 20}
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Modules</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-white/[0.08] bg-slate-800/70 p-3.5 shadow-sm transition hover:border-fuchsia-500/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {totalLessons || 60}
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Lessons</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-white/[0.08] bg-slate-800/70 p-3.5 shadow-sm transition hover:border-emerald-500/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {totalXP ? totalXP.toLocaleString() : "9,120"}
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Total XP</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
