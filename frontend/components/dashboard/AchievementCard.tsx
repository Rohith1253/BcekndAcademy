"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Award, BookOpen, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";

export default function AchievementCard() {
  const { user } = useClient();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        if (user) {
          const json = await api.get("/api/achievements/user");
          if (json.success && Array.isArray(json.data?.achievements)) {
            setAchievements(json.data.achievements);
          }
        } else {
          const json = await api.get("/api/achievements");
          if (json.success && Array.isArray(json.data)) {
            setAchievements(json.data.map((a: any) => ({ ...a, unlocked: false })));
          }
        }
      } catch (err) {
        console.error("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, [user]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const displayAchievements = achievements.slice(0, 6);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] font-semibold text-cyan-300">Milestones & Mastery</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Mastery Badges</h3>
          </div>
          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 text-xs font-mono font-semibold text-cyan-300">
            {unlockedCount} / {achievements.length || 22} Unlocked
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {displayAchievements.map((badge) => (
            <div
              key={badge.id || badge.title}
              className={`rounded-2xl border p-4 transition ${
                badge.unlocked
                  ? "border-cyan-500/30 bg-slate-900/80 shadow-md shadow-cyan-950/20"
                  : "border-white/5 bg-slate-950/50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                    badge.unlocked
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                      : "bg-slate-900 text-slate-600 border border-white/5"
                  }`}
                >
                  {badge.unlocked ? <Award className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>
                <span className="text-[10px] font-mono text-cyan-300">+{badge.xpReward} XP</span>
              </div>
              <h4 className={`mt-3 text-sm font-bold ${badge.unlocked ? "text-white" : "text-slate-400"}`}>
                {badge.title}
              </h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end">
        <Link
          href="/progress"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
        >
          <span>View All 22 Achievements in Progress Hub</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.section>
  );
}
