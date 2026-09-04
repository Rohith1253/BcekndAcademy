"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bolt, Sparkles, ArrowRight, Code2, Clock } from "lucide-react";
import { api } from "@/lib/api";

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState<any>(null);

  useEffect(() => {
    async function loadFeaturedChallenge() {
      try {
        const json = await api.get("/api/challenges");
        if (json.success && json.data?.challenges?.length > 0) {
          // Pick a random or featured challenge
          const uncompleted = json.data.challenges.find((c: any) => !c.isCompleted);
          setChallenge(uncompleted || json.data.challenges[0]);
        }
      } catch (err) {
        console.error("Failed to load daily challenge:", err);
      }
    }

    loadFeaturedChallenge();
  }, []);

  const targetChallenge = challenge || {
    title: "Express Rate Limiter Middleware",
    description: "Build an in-memory sliding window rate limiter middleware that inspects IP headers.",
    slug: "in-memory-rate-limiter",
    difficulty: "medium",
    estimatedMinutes: 20,
    xpReward: 120,
    category: "Middleware",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 to-slate-900/90 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-300 font-semibold">
              <Bolt className="h-3.5 w-3.5" />
              <span>Recommended Practice</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-white">{targetChallenge.title}</h3>
          </div>
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold">
            {targetChallenge.difficulty}
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-300 line-clamp-3">
          {targetChallenge.description}
        </p>

        <div className="mt-6 grid gap-4 grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-white shadow-inner shadow-white/5">
            <div className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-mono uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>XP Reward</span>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white">+{targetChallenge.xpReward} XP</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-white shadow-inner shadow-white/5">
            <div className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-mono uppercase tracking-wider">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>Est. Time</span>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white">~{targetChallenge.estimatedMinutes || 20}m</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <Link
          href="/challenges"
          className="text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          View All Challenges
        </Link>
        <Link
          href={`/challenges/${targetChallenge.slug}`}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 transition group"
        >
          <span>Start Challenge</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.section>
  );
}
