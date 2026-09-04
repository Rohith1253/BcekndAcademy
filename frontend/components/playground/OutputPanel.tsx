"use client";

import { motion } from "framer-motion";

interface OutputPanelProps {
  output: string;
  error?: string;
  isLoading?: boolean;
}

export default function OutputPanel({ output, error, isLoading }: OutputPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-slate-950 rounded-lg border border-white/10"
    >
      <div className="border-b border-white/10 px-4 py-3 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${error ? "bg-rose-500" : "bg-emerald-500"}`} />
        <h3 className="text-sm font-semibold text-white">
          {error ? "Error" : "Output"}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {isLoading ? (
          <motion.div animate={{ opacity: [0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
            <p className="text-slate-400">Running code...</p>
          </motion.div>
        ) : error ? (
          <p className="text-rose-400 whitespace-pre-wrap">{error}</p>
        ) : output ? (
          <p className="text-slate-300 whitespace-pre-wrap">{output}</p>
        ) : (
          <p className="text-slate-600">Output will appear here...</p>
        )}
      </div>
    </motion.div>
  );
}
