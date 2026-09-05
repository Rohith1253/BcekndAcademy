"use client";

import { motion } from "framer-motion";
import { Clock, Zap, ArrowRight, Lock, CheckCircle2 } from "lucide-react";

interface NextLessonProps {
  slug?: string;
  title?: string;
  duration?: number;
  xp?: number;
  locked?: boolean;
}

export default function NextLesson({
  slug = "rest-apis",
  title = "REST APIs Architecture & Design Patterns",
  duration = 30,
  xp = 140,
  locked = false,
}: NextLessonProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="my-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 to-slate-900/90 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <p className="text-xs uppercase tracking-[0.24em] font-semibold text-cyan-300">Up Next</p>
      <h3 className="mt-2 text-3xl font-semibold text-white">{title}</h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.75rem] bg-slate-900/90 p-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="h-5 w-5 text-sky-300" />
            <span className="text-sm font-medium">Duration</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-white">{duration} min</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-900/90 p-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="h-5 w-5 text-violet-300" />
            <span className="text-sm font-medium">XP Reward</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-white">+{xp} XP</p>
        </div>
      </div>

      <a
        href={`/learn/${slug}`}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:opacity-95 shadow-lg transition"
      >
        Start Next Lesson
        <ArrowRight className="h-4 w-4" />
      </a>
    </motion.section>
  );
}
