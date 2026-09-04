"use client";

import { motion } from "framer-motion";
import type { DailyGoal } from "@/lib/rewards";
import { CheckCircle2, Circle } from "lucide-react";

interface DailyGoalProps {
  goal: DailyGoal;
  index: number;
}

export default function DailyGoalComponent({ goal, index }: DailyGoalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-[1.75rem] border-2 p-5 transition ${
        goal.completed
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-white/10 bg-slate-900/50 hover:bg-slate-900/70"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {goal.completed ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-300" />
            ) : (
              <Circle className="h-5 w-5 flex-shrink-0 text-slate-500" />
            )}
            <div>
              <p className={`font-semibold ${goal.completed ? "text-emerald-300" : "text-white"}`}>
                {goal.title}
              </p>
              <p className="mt-1 text-sm text-slate-400">{goal.description}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-sm font-medium">
          {goal.reward.xp > 0 && <span className="text-violet-300">+{goal.reward.xp} XP</span>}
          {goal.reward.coins > 0 && <span className="text-cyan-300">+{goal.reward.coins} 💰</span>}
        </div>
      </div>
    </motion.div>
  );
}
