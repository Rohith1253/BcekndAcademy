"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, Clock, Layers, ArrowRight, CheckCircle2, 
  Trophy, Play, Lock, Eye
} from "lucide-react";
import { useClient } from "@/lib/store";
import { getApiUrl } from "@/lib/http";
import { getLearningPathStep } from "@/lib/learningPath";

interface CourseDetailClientProps {
  slug: string;
}

export default function CourseDetailClient({ slug }: CourseDetailClientProps) {
  const { user } = useClient();
  const pathStep = getLearningPathStep(slug);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [curriculumData, setCurriculumData] = useState<any>(null);
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

        // Fetch curriculum with lock statuses
        try {
          const currRes = await fetch(getApiUrl(`/api/courses/${slug}/curriculum`), { credentials: "include" });
          const currJson = await currRes.json();
          if (currJson.success && currJson.data) {
            setCurriculumData(currJson.data);
            if (currJson.data.modules) {
              setModules(currJson.data.modules);
            }
          }
        } catch (cErr) {
          console.warn("Curriculum fetch error:", cErr);
        }

        // Fetch user-specific progress if logged in
        if (user) {
          const progRes = await fetch(getApiUrl(`/api/courses/${slug}/progress`), { credentials: "include" });
          const progJson = await progRes.json();
          if (progJson.success && progJson.data) {
            setProgressData(progJson.data);
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

  const completedCount = curriculumData?.stats?.completedLessons ?? progressData?.completedLessons ?? 0;
  const totalCount = curriculumData?.stats?.totalLessons ?? progressData?.totalLessons ?? course.totalLessons ?? 12;
  const progressPercent = curriculumData?.stats?.progressPercentage ?? progressData?.progressPercentage ?? 0;
  const resumeLessonSlug = curriculumData?.resumeLesson?.slug || progressData?.currentLesson?.slug || modules[0]?.lessons?.[0]?.slug || "http-basics";

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
            {pathStep && (
              <span className="rounded-full bg-cyan-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300 border border-cyan-500/30">
                Step {pathStep.stepNumber} of 5
              </span>
            )}
            {pathStep?.isStartHere && (
              <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-950 shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" /> Start Here
              </span>
            )}
            <span className="rounded-full bg-violet-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
              {course.category}
            </span>
            <span className="rounded-full bg-sky-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              {course.difficulty}
            </span>
            {(progressData?.completed || curriculumData?.stats?.progressPercentage === 100) && (
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
                  {progressData?.completed || curriculumData?.stats?.progressPercentage === 100
                    ? "🎉 Congratulations! You have completed all course requirements."
                    : `Next Up: ${curriculumData?.resumeLesson?.title || progressData?.currentLesson?.title || "Get Started"}`}
                </span>
                <a
                  href={`/courses/${slug}/lessons/${resumeLessonSlug}`}
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
              <p className="mt-2 text-2xl font-semibold text-white">{totalCount} Lessons</p>
            </div>

            <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
              <div className="flex items-center gap-2 text-slate-400">
                <Trophy className="h-5 w-5 text-amber-300" />
                <span className="text-xs uppercase tracking-wider font-medium">XP Reward</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">+{course.totalXP} XP</p>
            </div>
          </div>
        </motion.div>

        {/* Learning Path Context Banner */}
        {pathStep && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[2.5rem] border border-cyan-500/20 bg-gradient-to-r from-slate-950/90 via-cyan-950/20 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6"
          >
            {/* Header row: step number, level, start here */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm border border-cyan-500/30">
                  {pathStep.stepNumber}
                </span>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    Backend Developer Career Path • Step {pathStep.stepNumber} of 5
                  </div>
                  <div className="text-lg font-bold text-white">
                    Level {pathStep.levelNumber}: {pathStep.levelName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {pathStep.isStartHere ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 animate-pulse">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Recommended Start Here
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-300 border border-white/[0.08]">
                    Sequential Progression
                  </span>
                )}
              </div>
            </div>

            {/* Path Context Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              {/* 1. Why Learn This */}
              <div className="space-y-2 rounded-2xl bg-slate-900/60 p-5 border border-white/[0.06]">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Why Learn This Course
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pathStep.whyLearn}
                </p>
              </div>

              {/* 2. Real-World Use Cases */}
              <div className="space-y-2 rounded-2xl bg-slate-900/60 p-5 border border-white/[0.06]">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  Real-World Use Cases
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pathStep.realWorldBuild}
                </p>
              </div>

              {/* 3. Prerequisites */}
              <div className="space-y-2 rounded-2xl bg-slate-900/60 p-5 border border-white/[0.06]">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Prerequisites
                </div>
                {pathStep.prerequisites ? (
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-400">Recommended before starting:</span>
                    <div className="mt-1">
                      {pathStep.prerequisites.slug ? (
                        <a
                          href={`/courses/${pathStep.prerequisites.slug}`}
                          className="font-medium text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>{pathStep.prerequisites.title}</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="font-medium text-white">{pathStep.prerequisites.title}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-400/90 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>None &bull; Beginner friendly (START HERE)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Gained Tags */}
            <div className="pt-1">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mr-2">
                Core Competencies Gained:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {pathStep.skillsGained.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/25 px-3 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Next Step & Direct Progression Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Path Progression:
                </span>
                <div className="text-sm font-semibold text-white mt-0.5">
                  {pathStep.nextCourseSlug ? (
                    <span className="text-cyan-300 flex items-center gap-1.5">
                      <span>After completing this: Step {pathStep.stepNumber + 1} ({pathStep.nextCourseTitle})</span>
                    </span>
                  ) : (
                    <span className="text-emerald-300 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Completing this finishes the Backend Developer Foundation!</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {pathStep.nextCourseSlug && (
                  <a
                    href={`/courses/${pathStep.nextCourseSlug}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/40 hover:text-white transition"
                  >
                    <span>Next Course in Path</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                )}
                <a
                  href="/courses#learning-path"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/35 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/25 transition"
                >
                  <span>View All 5 Steps</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

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
              const modCompleted = mod.completedLessons || mod.lessons?.filter((l: any) => l.isCompleted || l.completed)?.length || 0;
              const modTotal = mod.totalLessons || mod.lessons?.length || 3;
              const modPercent = mod.progressPercentage || Math.round((modCompleted / modTotal) * 100) || 0;

              return (
                <motion.div
                  key={mod._id || mod.slug || index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-xl backdrop-blur-xl"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-sm font-semibold text-slate-950">
                        {mod.order || index + 1}
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
                        const isDone = les.isCompleted || les.completed || les.status === "completed";
                        const isCurrent = curriculumData?.resumeLesson?.slug === les.slug || progressData?.currentLesson?.slug === les.slug;
                        const isLocked = les.isLocked;
                        const isPreview = les.isPreview;

                        const targetHref = isLocked 
                          ? undefined 
                          : `/courses/${slug}/lessons/${les.slug}`;

                        return (
                          <a
                            key={les._id || les.slug}
                            href={targetHref}
                            className={`group flex items-center justify-between rounded-2xl border p-4 transition ${
                              isDone
                                ? "border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50"
                                : isCurrent
                                ? "border-violet-500/50 bg-violet-500/10 hover:border-violet-500/80"
                                : isLocked
                                ? "border-white/5 bg-slate-950/40 opacity-60 cursor-not-allowed"
                                : "border-white/5 bg-slate-900/60 hover:border-violet-500/40 hover:bg-slate-900/90"
                            }`}
                          >
                            <div className="flex items-center gap-3 truncate">
                              {isDone ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-300 flex-shrink-0" />
                              ) : isLocked ? (
                                <Lock className="h-5 w-5 text-slate-500 flex-shrink-0" />
                              ) : (
                                <span className={`h-2 w-2 rounded-full ${isCurrent ? "bg-violet-400 animate-pulse" : "bg-slate-600"}`} />
                              )}
                              <span className={`font-medium truncate ${isDone ? "text-emerald-200" : isCurrent ? "text-violet-200 font-semibold" : isLocked ? "text-slate-400" : "text-slate-200 group-hover:text-white"}`}>
                                {les.title}
                              </span>
                              <span className="text-xs text-slate-400 shrink-0">({les.estimatedMinutes || les.duration || 15} mins)</span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                              {isPreview && !isDone && (
                                <span className="rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-0.5 font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1">
                                  <Eye className="h-3 w-3" /> Preview
                                </span>
                              )}
                              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-300 font-medium">+{les.xpReward || 100} XP</span>
                              {isDone ? (
                                <span className="font-semibold text-emerald-300 flex items-center gap-1">Completed</span>
                              ) : isLocked ? (
                                <span className="font-semibold text-slate-500 flex items-center gap-1">Locked</span>
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
