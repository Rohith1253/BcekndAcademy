"use client";

import { motion } from "framer-motion";

export default function PlaygroundHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💻</span>
            <h1 className="text-3xl font-bold text-white">Backend Playground</h1>
          </div>
          <p className="text-slate-400">
            Practice backend concepts in an interactive VS Code-inspired environment
          </p>
        </div>
      </div>
    </motion.header>
  );
}
