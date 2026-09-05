"use client";

import React from "react";
import { BookOpen, Layers, Terminal, Trophy, Compass } from "lucide-react";

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
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-12 shadow-xl">
      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-[0.2em] text-[11px] font-bold">13-Level Production Track</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Backend Engineering{" "}
          <span className="text-cyan-400">
            Curriculum
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          A structured, beginner-to-advanced curriculum. Progress from core JavaScript syntax and logic to high-throughput HTTP services, databases, and microservices architecture.
        </p>

        {/* Learning Statistics Pills */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 shadow-sm transition hover:border-cyan-500/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {totalCourses || 18}
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 shadow-sm transition hover:border-indigo-500/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {totalModules || 72}
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Modules</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 shadow-sm transition hover:border-purple-500/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {totalLessons || 216}
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Lessons</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 shadow-sm transition hover:border-emerald-500/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {totalXP ? totalXP.toLocaleString() : "34,200"}
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Total XP</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
