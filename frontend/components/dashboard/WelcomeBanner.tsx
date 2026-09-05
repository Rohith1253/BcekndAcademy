"use client";

import { useMemo } from "react";
import { Activity, Terminal, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useClient } from "@/lib/store";
import { calculateLevel } from "@/lib/xp-backend";

export default function WelcomeBanner() {
  const { user, loading } = useClient();

  const level = useMemo(() => calculateLevel(user?.totalXP ?? 0), [user?.totalXP]);
  const streak = user?.currentStreak ?? 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-lg border border-white/10 bg-slate-900/70 p-8 shadow-sm"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 rounded-md bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 ring-1 ring-cyan-500/20">
            <Terminal className="h-4 w-4 text-cyan-300" />
            Dashboard Overview
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {loading ? "Loading..." : `${user?.name || "Learner"} 👋`}
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Your backend skills are leveling up. Keep the streak alive and conquer the next milestone with confidence.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-auto lg:grid-cols-2">
          <div className="rounded-md border border-white/10 bg-slate-950/85 p-5 shadow-inner shadow-white/5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Current Level</p>
            <div className="mt-4 flex items-center gap-3 text-3xl font-semibold text-white">
              <Trophy className="h-7 w-7 text-amber-400" />
              {level}
            </div>
          </div>

          <div className="rounded-md border border-white/10 bg-slate-950/85 p-5 shadow-inner shadow-white/5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Daily Streak</p>
            <div className="mt-4 flex items-center gap-3 text-3xl font-semibold text-white">
              <Activity className="h-7 w-7 text-cyan-300" />
              {streak} days
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-md border border-violet-500/20 bg-slate-800/60 p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-violet-300/70">Motivational Quote</p>
        <p className="mt-4 text-xl font-semibold leading-9 text-slate-100">
          “Great backend systems are built one strong API at a time.”
        </p>
      </div>
    </motion.section>
  );
}
