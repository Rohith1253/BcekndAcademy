"use client";

import { motion } from "framer-motion";
import { Activity, Award, CloudLightning } from "lucide-react";

interface ProgressTrackerProps {
  completion: number;
  completedModules: number;
  xpEarned: number;
  level: number;
}

export default function ProgressTracker({ completion, completedModules, xpEarned, level }: ProgressTrackerProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.26em] text-slate-400">Roadmap Progress</p>
          <h1 className="text-3xl font-semibold text-white">Interactive backend journey</h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Navigate the 20-module backend roadmap, unlock each stage, and build strong system design foundations.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <Activity className="h-5 w-5 text-cyan-300" />
              <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Completion</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">{completion}%</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <Award className="h-5 w-5 text-violet-300" />
              <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Modules</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">{completedModules}/20</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <CloudLightning className="h-5 w-5 text-amber-300" />
              <span className="text-sm uppercase tracking-[0.24em] text-slate-500">XP Earned</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">{xpEarned.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-cyan-300/10 bg-gradient-to-r from-cyan-500/10 via-slate-900/70 to-violet-500/10 p-4 text-sm text-slate-300">
        <p className="font-medium text-slate-100">Current Level:</p>
        <p className="mt-2 text-xl font-semibold text-white">Level {level}</p>
      </div>
    </motion.section>
  );
}
