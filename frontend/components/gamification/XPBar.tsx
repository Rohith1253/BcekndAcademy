"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  percentage: number;
}

export default function XPBar({ currentXP, nextLevelXP, percentage }: XPBarProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayPercentage(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">
          {Math.round(currentXP).toLocaleString()} / {Math.round(nextLevelXP).toLocaleString()} XP
        </span>
        <span className="font-semibold text-violet-300">{Math.round(displayPercentage)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/5 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-500 shadow-lg shadow-violet-500/30"
        />
      </div>
    </div>
  );
}
