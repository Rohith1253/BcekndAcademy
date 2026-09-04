"use client";

import { motion } from "framer-motion";
import { getStreakMessage, getStreakEmoji } from "@/lib/streak";

interface DailyStreakProps {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
}

export default function DailyStreak({ currentStreak, longestStreak, isActive }: DailyStreakProps) {
  const emoji = getStreakEmoji(currentStreak);
  const message = getStreakMessage(currentStreak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Daily Streak</p>
          <div className="mt-4 flex items-center gap-4">
            <motion.div
              animate={isActive ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-6xl"
            >
              {emoji}
            </motion.div>
            <div>
              <motion.p
                key={currentStreak}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-5xl font-bold text-white"
              >
                {currentStreak}
              </motion.p>
              <p className="mt-1 text-slate-400">days in a row</p>
            </div>
          </div>
          <p className="mt-4 text-base font-medium text-violet-300">{message}</p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Personal Best</p>
          <p className="mt-3 text-4xl font-semibold text-white">{longestStreak}</p>
          <p className="mt-1 text-sm text-slate-400">day streak</p>
        </div>
      </div>

      {!isActive && currentStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 rounded-[1.5rem] border border-rose-500/20 bg-rose-500/10 p-4"
        >
          <p className="text-sm text-rose-300">Come back today to continue your streak!</p>
        </motion.div>
      )}
    </motion.div>
  );
}
