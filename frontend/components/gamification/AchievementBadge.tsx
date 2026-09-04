"use client";

import { motion } from "framer-motion";
import type { Achievement } from "@/lib/achievements";

interface AchievementBadgeProps {
  achievement: Achievement;
  index?: number;
}

const RARITY_COLORS = {
  common: "border-slate-400/30 bg-slate-400/10 text-slate-300",
  uncommon: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  rare: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  epic: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  legendary: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
};

export default function AchievementBadge({ achievement, index = 0 }: AchievementBadgeProps) {
  const rarityColor = RARITY_COLORS[achievement.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, translateY: -4 }}
      className={`group rounded-[1.75rem] border-2 p-6 text-center transition ${
        achievement.earned ? rarityColor : "border-white/10 bg-slate-900/60 text-slate-500 opacity-60"
      }`}
    >
      <motion.p className="text-4xl">{achievement.icon}</motion.p>
      <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em]">{achievement.title}</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">{achievement.description}</p>
      {achievement.earned && achievement.earnedDate && (
        <p className="mt-3 text-xs text-slate-400">{new Date(achievement.earnedDate).toLocaleDateString()}</p>
      )}
    </motion.div>
  );
}
