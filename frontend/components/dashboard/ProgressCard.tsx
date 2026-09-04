"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Play } from "lucide-react";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";

export default function ProgressCard() {
  const { user } = useClient();
  const [activeCourseInfo, setActiveCourseInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMultiCourseProgress() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const courseSlugs = [
          "backend-node-js",
          "typescript-backend",
          "express-rest-api",
          "mongodb-database",
          "backend-auth-security",
        ];

        let selectedCourseData: any = null;

        for (const slug of courseSlugs) {
          const json = await api.get(`/api/courses/${slug}/progress`);
          if (json.success && json.data) {
            const data = json.data;
            // Priority 1: First course with an in-progress lesson or partial progress < 100%
            if (data.inProgressLessons > 0 || (data.progressPercentage > 0 && data.progressPercentage < 100)) {
              selectedCourseData = data;
              break;
            } else if (!selectedCourseData && data.progressPercentage === 0) {
              selectedCourseData = data;
            }
          }
        }

        if (selectedCourseData) {
          setActiveCourseInfo(selectedCourseData);
        }
      } catch (err) {
        console.error("Dashboard progress fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMultiCourseProgress();
  }, [user]);

  const courseTitle = activeCourseInfo?.course?.title || "Backend Development with Node.js";
  const currentLesson = activeCourseInfo?.currentLesson;
  const progressPercent = activeCourseInfo?.progressPercentage ?? 0;
  const isCompleted = activeCourseInfo?.completed ?? false;
  const targetSlug = currentLesson?.slug || "http-basics";
  const targetTitle = currentLesson?.title || "HTTP Basics";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] font-semibold text-cyan-300">
            {isCompleted ? "Course Completed" : "Next Up"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {isCompleted ? courseTitle : targetTitle}
          </h3>
        </div>
        <div className="rounded-3xl bg-slate-900/90 px-4 py-2 text-sm font-semibold text-cyan-300 ring-1 ring-cyan-300/15">
          {progressPercent}%
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-300">
        {isCompleted
          ? `🎉 Outstanding job! You have completed all lessons in ${courseTitle}.`
          : `Continue ${courseTitle} to learn ${targetTitle} and build production backends.`}
      </p>

      <div className="mt-6 rounded-full bg-white/5 p-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-3 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"
        />
      </div>

      <a
        href={`/learn/${targetSlug}`}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5"
      >
        {isCompleted ? "Review Course Lessons" : "Continue Learning"}
        <ArrowRight className="h-4 w-4" />
      </a>
    </motion.div>
  );
}
