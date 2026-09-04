"use client";

import { motion } from "framer-motion";
import type { WeeklyChallenge } from "@/lib/rewards";

interface WeeklyChallengeProps {
  challenge: WeeklyChallenge;
  index: number;
}

export default function WeeklyChallengeCard({ challenge, index }: WeeklyChallengeProps) {
  const percentage = (challenge.progress / challenge.maxProgress) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <p className="text-3xl">{challenge.icon}</p>
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Weekly Challenge</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{challenge.title}</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">{challenge.description}</p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="font-semibold text-slate-300">
                {challenge.progress} / {challenge.maxProgress}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5">
              <motion.div
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-4 text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Reward</p>
          <p className="mt-2 text-lg font-semibold text-violet-300">+{challenge.reward.xp} XP</p>
          <p className="mt-1 text-lg font-semibold text-cyan-300">+{challenge.reward.coins} 💰</p>
        </div>
      </div>
    </motion.div>
  );
}
