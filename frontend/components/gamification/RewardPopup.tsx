"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Coins } from "lucide-react";

interface RewardPopupProps {
  isOpen: boolean;
  level: number;
  xpGained: number;
  coinsGained: number;
  newBadges?: string[];
  onClose: () => void;
}

export default function RewardPopup({
  isOpen,
  level,
  xpGained,
  coinsGained,
  newBadges = [],
  onClose,
}: RewardPopupProps) {
  const [showConfetti, setShowConfetti] = useState(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-slate-900 to-slate-950 p-10 text-center shadow-2xl"
          >
            <motion.p
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-6xl"
            >
              🎉
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl font-bold text-white"
            >
              Level Up!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-3xl font-semibold text-cyan-300"
            >
              You've reached Level {level}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 grid gap-4 sm:grid-cols-2"
            >
              <div className="rounded-[1.75rem] border border-violet-500/30 bg-violet-500/10 p-5">
                <div className="flex items-center justify-center gap-2 text-violet-300">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.22em]">XP Earned</span>
                </div>
                <p className="mt-3 text-3xl font-bold text-white">+{xpGained}</p>
              </div>

              <div className="rounded-[1.75rem] border border-cyan-500/30 bg-cyan-500/10 p-5">
                <div className="flex items-center justify-center gap-2 text-cyan-300">
                  <Coins className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.22em]">Coins</span>
                </div>
                <p className="mt-3 text-3xl font-bold text-white">+{coinsGained}</p>
              </div>
            </motion.div>

            {newBadges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 rounded-[1.75rem] border border-emerald-500/30 bg-emerald-500/10 p-5"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  🏆 New Badges Unlocked
                </p>
                <p className="mt-3 flex flex-wrap justify-center gap-2 text-2xl">{newBadges.join(" ")}</p>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-violet-500/30 transition hover:opacity-95"
            >
              Continue Learning 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
