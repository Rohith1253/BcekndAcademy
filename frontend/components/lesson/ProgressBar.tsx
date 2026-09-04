"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  completion: number;
}

export default function ProgressBar({ completion }: ProgressBarProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-sm font-medium text-slate-400">Lesson Progress</div>
        <div className="w-64 rounded-full bg-white/5 p-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30"
          />
        </div>
        <div className="text-sm font-semibold text-white">{completion}%</div>
      </div>
    </div>
  );
}
