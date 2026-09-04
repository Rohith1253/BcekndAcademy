"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Play, Sparkles } from "lucide-react";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";

export default function ProgressCard() {
  const { user } = useClient();
  const [continueData, setContinueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContinueLearning() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const json = await api.get("/api/learning/continue");
        if (json.success && json.data) {
          setContinueData(json.data);
        }
      } catch (err) {
        console.error("Dashboard continue fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadContinueLearning();
  }, [user]);

  const courseTitle = continueData?.courseTitle || continueData?.title || "Backend Development with Node.js";
  const lessonTitle = continueData?.title || "HTTP Basics";
  const progressPercent = continueData?.progressPercentage ?? 0;
  const isCompleted = continueData?.isCompleted ?? false;
  const targetUrl = continueData?.url || `/learn/${continueData?.slug || "http-basics"}`;
  const nextAction = continueData?.nextAction || (progressPercent > 0 ? "Resume Lesson" : "Start Learning");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] font-semibold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isCompleted ? "Course Mastered" : "Resume Learning"}</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-white">
              {isCompleted ? courseTitle : lessonTitle}
            </h3>
          </div>
          <div className="rounded-2xl bg-slate-900/90 px-3.5 py-1.5 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/20">
            {progressPercent}% Complete
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {isCompleted
            ? `🎉 Outstanding work! You have completed this track. Explore the 11-language matrix for your next stack.`
            : `Continue ${courseTitle}: ${lessonTitle} to build high-performance distributed systems.`}
        </p>

        {/* Gradient Progress Bar */}
        <div className="mt-6 rounded-full bg-slate-900 border border-white/5 p-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(5, progressPercent)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-3 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-300 shadow-md shadow-cyan-500/30"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-slate-400 font-mono">
          Course: {courseTitle}
        </span>

        <Link
          href={targetUrl}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 transition group"
        >
          <span>{nextAction}</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
