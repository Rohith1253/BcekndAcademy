"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";
import type { RoadmapModule } from "@/components/roadmap/types";

interface RoadmapNodeProps {
  module: RoadmapModule;
  selected: boolean;
  onSelect: () => void;
}

export default function RoadmapNode({ module, selected, onSelect }: RoadmapNodeProps) {
  const isLocked = module.status === "locked";
  const isCurrent = module.status === "current";

  return (
    <motion.button
      layout
      type="button"
      onClick={() => {
        if (!isLocked) onSelect();
      }}
      whileHover={{ scale: isLocked ? 1 : 1.03 }}
      whileTap={{ scale: isLocked ? 1 : 0.98 }}
      className={`absolute flex min-h-[115px] w-[168px] flex-col justify-between rounded-[1.9rem] border p-5 text-left shadow-2xl shadow-slate-950/20 transition-all duration-300 ${
        selected
          ? "border-cyan-400/40 bg-slate-900/95 shadow-cyan-500/25"
          : "border-white/10 bg-slate-950/80"
      } ${isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:border-cyan-400/40"}`}
      style={{ left: `${module.x}px`, top: `${module.y}px` }}
      title={isLocked ? "Complete previous module to unlock." : module.title}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
            Module {module.id}
          </p>
          <h3 className="mt-2 text-base font-semibold text-white">{module.title}</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-white/5 text-slate-100">
          {isLocked ? <Lock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span className={isCurrent ? "text-cyan-300" : "text-slate-400"}>
          {module.status === "completed" ? "Completed" : module.status === "current" ? "Current" : "Locked"}
        </span>
        <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">
          {module.difficulty}
        </span>
      </div>
    </motion.button>
  );
}
