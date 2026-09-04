"use client";

import { motion } from "framer-motion";

interface HintPanelProps {
  hints: string[];
  currentHintLevel: number;
  onRequestHint: () => void;
}

export default function HintPanel({ hints, currentHintLevel, onRequestHint }: HintPanelProps) {
  return (
    <div className="space-y-3">
      {hints.map((hint, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`rounded-[1.25rem] border-2 p-4 transition ${
            i < currentHintLevel
              ? "border-violet-500/50 bg-violet-500/10"
              : "border-white/10 bg-slate-900/50 opacity-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{hint}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {currentHintLevel < hints.length && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRequestHint}
          className="w-full rounded-[1.25rem] bg-gradient-to-r from-violet-500 to-cyan-500 py-3 font-semibold text-slate-950 transition hover:opacity-90"
        >
          Get Hint ({currentHintLevel}/{hints.length})
        </motion.button>
      )}
    </div>
  );
}
