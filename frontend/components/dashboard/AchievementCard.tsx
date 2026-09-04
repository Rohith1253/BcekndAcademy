"use client";

import { Award, BookOpen, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { label: "First Login", description: "Welcome aboard", earned: true, icon: Award },
  { label: "First Lesson", description: "Started learning", earned: true, icon: BookOpen },
  { label: "HTTP Master", description: "Completed HTTP module", earned: true, icon: ShieldCheck },
  { label: "Node.js Expert", description: "Unlock at level 10", earned: false, icon: ShieldCheck },
  { label: "Docker Builder", description: "Unlocks later", earned: false, icon: ShieldCheck },
];

export default function AchievementCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Achievements</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Earned badges</h3>
        </div>
        <span className="rounded-full bg-slate-900/90 px-4 py-2 text-sm text-slate-300">3 unlocked</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.label}
              className={`rounded-[1.75rem] border border-white/5 p-5 transition ${badge.earned ? "bg-slate-900/80 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.8)]" : "bg-slate-950/60 text-slate-500"}`}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${badge.earned ? "bg-gradient-to-br from-violet-500 to-sky-500 text-white" : "bg-slate-800/80 text-slate-500"}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h4 className={`mt-5 text-lg font-semibold ${badge.earned ? "text-white" : "text-slate-400"}`}>{badge.label}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-400">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
