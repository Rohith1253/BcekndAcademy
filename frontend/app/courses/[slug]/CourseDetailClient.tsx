"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Layers, Sparkles, ArrowRight, CheckCircle2, Trophy, Play } from "lucide-react";
import { useClient } from "@/lib/store";
import { getApiUrl } from "@/lib/http";

interface CourseDetailClientProps {
  slug: string;
}

export default function CourseDetailClient({ slug }: CourseDetailClientProps) {
  const { user } = useClient();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const res = await fetch(getApiUrl(`/api/courses/${slug}`));
        const json = await res.json();
        if (json.success && json.data) {
          setCourse(json.data.course);
          setModules(json.data.modules || []);
        } else {
          setError(json.error || "Course not found");
        }

        // Fetch user-specific progress if logged in
        if (user) {
          const progRes = await fetch(getApiUrl(`/api/courses/${slug}/progress`), { credentials: "include" });
          const progJson = await progRes.json();
          if (progJson.success && progJson.data) {
            setProgressData(progJson.data);
            if (progJson.data.modules) {
              setModules(progJson.data.modules);
            }
          }
        }
      } catch (e) {
        console.error("Fetch course error:", e);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, [slug, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span>Loading course progress & syllabus...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <h1 className="text-3xl font-semibold text-rose-400">Course Not Found</h1>
        <p className="mt-3 text-slate-400">The requested course &quot;{slug}&quot; does not exist or is unavailable.</p>
        <a
          href="/#learn"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-500 px-6 py-3 font-semibold text-white"
        >
          Return to Courses
        </a>
      </div>
    );
  }

  const completedCount = progressData?.completedLessons ?? 0;
  const totalCount = progressData?.totalLessons ?? course.totalLessons ?? 12;
  const progressPercent = progressData?.progressPercentage ?? 0;
  const nextLessonSlug = progressData?.currentLesson?.slug || "http-basics";

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Course Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:p-12"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-violet-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
              {course.category}
            </span>
            <span className="rounded-full bg-sky-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              {course.difficulty}
            </span>
            {progressData?.completed && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                <Trophy className="h-3.5 w-3.5" /> Course Complete!
              </span>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">{course.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{course.description}</p>

          {/* Real Course Progress Bar */}
          {user && (
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Your Progress</p>
                  <h3 className="text-xl font-semibold text-white">
                    {completedCount} of {totalCount} lessons completed
                  </h3>
                </div>
                <span className="text-2xl font-bold text-cyan-300">{progressPercent}%</span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm text-slate-300">
                  {progressData?.completed
                    ? "🎉 Congratulations! You have completed all course requirements."
                    : `Next Up: ${progressData?.currentLesson?.title || "HTTP Basics"}`}
                </span>
                <a
                  href={`/learn/${nextLessonSlug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:opacity-95"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {completedCount === 0 ? "Start Course" : progressData?.completed ? "Review Lessons" : "Continue Learning"}
                </a>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="h-5 w-5 text-sky-300" />
                <span className="text-xs uppercase tracking-wider font-medium">Duration</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{course.estimatedHours} Hours</p>
            </div>

            <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
              <div className="flex items-center gap-2 text-slate-400">
                <Layers className="h-5 w-5 text-violet-300" />
                <span className="text-xs uppercase tracking-wider font-medium">Modules</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{modules.length || course.totalModules} Modules</p>
            </div>

            <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
              <div className="flex items-center gap-2 text-slate-400">
                <BookOpen className="h-5 w-5 text-cyan-300" />
                <span className="text-xs uppercase tracking-wider font-medium">Lessons</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{course.totalLessons} Lessons</p>
            </div>

            <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
              <div className="flex items-center gap-2 text-slate-400">
                <Sparkles className="h-5 w-5 text-fuchsia-300" />
                <span className="text-xs uppercase tracking-wider font-medium">XP Reward</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">+{course.totalXP} XP</p>
            </div>
          </div>
        </motion.div>

        {/* Modules & Lessons Syllabus */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Syllabus & Modules</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Curriculum Modules</h2>
            </div>
            <span className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300 border border-white/10">
              {modules.length} Modules Total
            </span>
          </div>

          <div className="space-y-6">
            {modules.map((mod: any, index: number) => {
              const modCompleted = mod.completedLessons || 0;
              const modTotal = mod.totalLessons || mod.lessons?.length || 3;
              const modPercent = mod.progressPercentage || Math.round((modCompleted / modTotal) * 100) || 0;

              return (
                <motion.div
                  key={mod._id || mod.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-xl backdrop-blur-xl"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-sm font-semibold text-slate-950">
                        {mod.order}
                      </span>
                      <div>
                        <h3 className="text-2xl font-semibold text-white">{mod.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{mod.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      {user && (
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-cyan-300 font-semibold border border-white/10">
                          {modCompleted}/{modTotal} ({modPercent}%)
                        </span>
                      )}
                      <span className="text-slate-400">{mod.estimatedMinutes || 90} mins</span>
                    </div>
                  </div>

                  {/* Module Lessons List */}
                  <div className="mt-6 space-y-3 pt-4 border-t border-white/10">
                    {mod.lessons && mod.lessons.length > 0 ? (
                      mod.lessons.map((les: any) => {
                        const isDone = les.completed || les.status === "completed";
                        const isCurrent = progressData?.currentLesson?.slug === les.slug;

                        return (
                          <a
                            key={les._id || les.slug}
                            href={`/learn/${les.slug}`}
                            className={`group flex items-center justify-between rounded-2xl border p-4 transition ${
                              isDone
                                ? "border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50"
                                : isCurrent
                                ? "border-violet-500/50 bg-violet-500/10 hover:border-violet-500/80"
                                : "border-white/5 bg-slate-900/60 hover:border-violet-500/40 hover:bg-slate-900/90"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isDone ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-300 flex-shrink-0" />
                              ) : (
                                <span className={`h-2 w-2 rounded-full ${isCurrent ? "bg-violet-400 animate-pulse" : "bg-slate-600"}`} />
                              )}
                              <span className={`font-medium ${isDone ? "text-emerald-200" : isCurrent ? "text-violet-200 font-semibold" : "text-slate-200 group-hover:text-white"}`}>
                                {les.title}
                              </span>
                              <span className="text-xs text-slate-400">({les.estimatedMinutes || les.duration || 15} mins)</span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-300 font-medium">+{les.xpReward || 100} XP</span>
                              {isDone ? (
                                <span className="font-semibold text-emerald-300 flex items-center gap-1">Completed</span>
                              ) : (
                                <span className="font-semibold text-violet-300 group-hover:translate-x-1 transition flex items-center gap-1">
                                  {isCurrent ? "Continue" : "Start"} <ArrowRight className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </a>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-400">No lessons available in this module.</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
