"use client";

import { motion } from "framer-motion";
import { Volume2, Copy } from "lucide-react";

interface ChallengePanel {
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  timeEstimate: number;
  learningPoints: string[];
  onRunCode: () => void;
  onShowSolution: () => void;
}

export default function ChallengePanel({
  title,
  description,
  difficulty,
  xpReward,
  timeEstimate,
  learningPoints,
  onRunCode,
  onShowSolution,
}: ChallengePanel) {
  const difficultyColor = {
    beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-500/30",
    intermediate: "text-amber-400 bg-amber-400/10 border-amber-500/30",
    advanced: "text-rose-400 bg-rose-400/10 border-rose-500/30",
  };

  const colors = difficultyColor[difficulty as keyof typeof difficultyColor];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col bg-slate-950 rounded-lg border border-white/10 p-6 overflow-y-auto"
    >
      <h2 className="text-2xl font-bold text-white">{title}</h2>

      {/* Metadata */}
      <div className="mt-4 flex flex-wrap gap-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${colors}`}>
          {difficulty}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-slate-400">
          ⏱ {timeEstimate} min
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-violet-300">
          +{xpReward} XP
        </span>
      </div>

      {/* Description */}
      <p className="mt-6 leading-7 text-slate-300">{description}</p>

      {/* Learning Points */}
      <div className="mt-8">
        <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
          What You'll Learn
        </h4>
        <ul className="mt-4 space-y-2">
          {learningPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="mt-1 text-cyan-400">→</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-auto pt-6 space-y-3 border-t border-white/10">
        <button
          onClick={onRunCode}
          className="w-full rounded-[1.25rem] bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-slate-950 transition hover:opacity-90"
        >
          Run Code
        </button>
        <button
          onClick={onShowSolution}
          className="w-full rounded-[1.25rem] border border-white/20 bg-white/5 py-3 font-semibold text-white transition hover:bg-white/10"
        >
          Show Solution
        </button>
      </div>
    </motion.div>
  );
}
