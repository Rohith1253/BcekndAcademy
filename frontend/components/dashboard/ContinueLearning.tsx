"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProgressCard from "@/components/dashboard/ProgressCard";
import { Lock, LockOpen, CheckCircle2, Layers } from "lucide-react";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";

export default function ContinueLearning() {
  const { user } = useClient();
  const [courseProgress, setCourseProgress] = useState<any>(null);

  useEffect(() => {
    async function loadSyllabusProgress() {
      if (!user) return;
      try {
        const json = await api.get("/api/courses/backend-node-js/progress");
        if (json.success && json.data) {
          setCourseProgress(json.data);
        }
      } catch (err) {
        console.error("Fetch roadmap progress error:", err);
      }
    }

    loadSyllabusProgress();
  }, [user]);

  const defaultModules = [
    { label: "Web & HTTP Fundamentals", slug: "web-http-fundamentals", lessonSlug: "http-basics" },
    { label: "Node.js Fundamentals", slug: "nodejs-fundamentals", lessonSlug: "nodejs" },
    { label: "Express.js Architecture", slug: "express-architecture", lessonSlug: "express-fundamentals" },
    { label: "MongoDB & Database Engineering", slug: "mongodb-engineering", lessonSlug: "mongodb-fundamentals" },
  ];

  const modulesData = courseProgress?.modules || [];

  return (
    <section className="grid gap-6 xl:grid-cols-[1.3fr_0.95fr]">
      <ProgressCard />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] font-semibold text-cyan-300">Backend Roadmap Path</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Curriculum Modules</h3>
          </div>
          <span className="rounded-full bg-slate-900 px-3.5 py-1 text-xs text-slate-300 border border-white/10">
            4 Modules
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {defaultModules.map((defMod, index) => {
            const liveMod = modulesData.find((m: any) => m.slug === defMod.slug);
            const isCompleted = liveMod?.completed || (liveMod?.completedLessons > 0 && liveMod?.completedLessons === liveMod?.totalLessons);
            const inProgress = liveMod?.completedLessons > 0 && !isCompleted;
            const isUnlocked = index === 0 || isCompleted || inProgress || (modulesData[index - 1]?.completedLessons > 0);

            const statusLabel = isCompleted ? "Completed" : inProgress ? "In Progress" : isUnlocked ? "Available" : "Locked";
            const badgeClass = isCompleted
              ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
              : inProgress
              ? "text-cyan-300 bg-cyan-500/10 border-cyan-500/20"
              : "text-slate-500 bg-slate-900 border-white/5";

            const Icon = isCompleted ? CheckCircle2 : isUnlocked ? LockOpen : Lock;
            const targetLesson = liveMod?.lessons?.find((l: any) => !l.completed)?.slug || defMod.lessonSlug;

            return (
              <a
                key={defMod.slug}
                href={`/learn/${targetLesson}`}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/60 px-4 py-3.5 text-white transition hover:border-violet-500/40 hover:bg-slate-900/90"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/90 ${badgeClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{defMod.label}</p>
                    <p className="text-xs text-slate-400">
                      {liveMod ? `${liveMod.completedLessons || 0}/${liveMod.totalLessons || 3} Lessons` : "3 Lessons"}
                    </p>
                  </div>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${badgeClass}`}>
                  {statusLabel}
                </span>
              </a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
