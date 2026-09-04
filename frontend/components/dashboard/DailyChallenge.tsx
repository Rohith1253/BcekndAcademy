"use client";

import { motion } from "framer-motion";
import { Bolt, Coins } from "lucide-react";

export default function DailyChallenge() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 to-slate-900/90 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Daily Challenge</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Build a simple REST API</h3>
        </div>
        <div className="rounded-3xl bg-slate-900/90 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
          Today
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-300">Create a lightweight API with HTTP methods, routes, and JSON responses to reinforce your backend fundamentals.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 text-white shadow-inner shadow-white/5">
          <div className="inline-flex items-center gap-2 text-slate-200">
            <Bolt className="h-5 w-5 text-cyan-300" />
            <span className="text-sm uppercase tracking-[0.22em] text-slate-400">Reward</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">+150 XP</p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 text-white shadow-inner shadow-white/5">
          <div className="inline-flex items-center gap-2 text-slate-200">
            <Coins className="h-5 w-5 text-violet-300" />
            <span className="text-sm uppercase tracking-[0.22em] text-slate-400">Bonus</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">+50 Coins</p>
        </div>
      </div>
    </motion.section>
  );
}
