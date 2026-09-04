"use client";

import { motion } from "framer-motion";
import { getLevelName } from "@/lib/xp";

interface LevelCardProps {
  level: number;
  nextLevel: number;
}

const LEVEL_COLORS = {
  1: "from-slate-400 to-slate-600",
  2: "from-amber-400 to-amber-600",
  3: "from-cyan-400 to-sky-600",
  4: "from-violet-400 to-violet-600",
  5: "from-emerald-400 to-emerald-600",
  6: "from-rose-400 to-rose-600",
  7: "from-fuchsia-400 to-fuchsia-600",
  8: "from-indigo-400 to-indigo-600",
  9: "from-teal-400 to-teal-600",
  10: "from-yellow-300 to-orange-500",
} as Record<number, string>;

export default function LevelCard({ level, nextLevel }: LevelCardProps) {
  const currentLevelName = getLevelName(level);
  const nextLevelName = getLevelName(Math.min(nextLevel, 10));
  const color = LEVEL_COLORS[level] || LEVEL_COLORS[1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${color} p-8 shadow-md shadow-slate-950/40`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative z-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Current Level</p>
        <motion.div
          key={level}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-6xl font-bold text-white"
        >
          {level}
        </motion.div>
        <p className="mt-3 text-2xl font-semibold text-white">{currentLevelName}</p>

        {level < 10 && (
          <div className="mt-6 rounded-md bg-white/10 p-4">
            <p className="text-sm text-white/70">Next: {nextLevelName}</p>
            <p className="mt-1 text-lg font-semibold text-white">Level {Math.min(nextLevel, 10)}</p>
          </div>
        )}

        {level === 10 && (
          <div className="mt-6 rounded-md bg-white/20 p-4">
            <p className="text-lg font-bold text-white">✨ You've Reached the Top! ✨</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
