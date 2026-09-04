"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SolutionModalProps {
  isOpen: boolean;
  solution: string;
  onClose: () => void;
}

export default function SolutionModal({ isOpen, solution, onClose }: SolutionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-4xl w-full rounded-lg border border-white/20 bg-slate-950 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Solution</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Code */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-8">
              <pre className="rounded-[1.25rem] bg-slate-900/80 p-6 font-mono text-sm leading-6 text-slate-300 overflow-x-auto border border-white/5">
                {solution}
              </pre>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-8 py-4 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-md bg-white/10 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(solution);
                  onClose();
                }}
                className="flex-1 rounded-md bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500"
              >
                Copy Solution
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
