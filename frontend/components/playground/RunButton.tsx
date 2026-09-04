"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface RunButtonProps {
  isLoading?: boolean;
  isRunning?: boolean;
  onClick: () => void;
  xpReward?: number;
}

export default function RunButton({
  isLoading = false,
  isRunning = false,
  onClick,
  xpReward = 0,
}: RunButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={isLoading || isRunning}
      className="inline-flex items-center gap-3 rounded-md bg-violet-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <motion.div
        animate={isRunning ? { rotate: 360 } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Play className="h-5 w-5 fill-current" />
      </motion.div>
      <span>{isRunning ? "Running..." : "Run Code"}</span>
      {xpReward > 0 && <span className="ml-2 text-sm font-semibold">+{xpReward} XP</span>}
    </motion.button>
  );
}
