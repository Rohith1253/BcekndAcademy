"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ArrowLeft, ArrowRight, Trophy, BookOpen, Code2, Award } from "lucide-react";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonSidebar from "@/components/lesson/LessonSidebar";
import LessonContent from "@/components/lesson/LessonContent";
import LessonGameBanner from "@/components/lesson/LessonGameBanner";
import QuizPreview from "@/components/lesson/QuizPreview";
import NotesPanel from "@/components/lesson/NotesPanel";
import NextLesson from "@/components/lesson/NextLesson";
import ProgressBar from "@/components/lesson/ProgressBar";

interface LessonClientWrapperProps {
  slug: string;
  lesson: any;
  allLessons: any[];
}

export default function LessonClientWrapper({
  slug,
  lesson,
  allLessons,
}: LessonClientWrapperProps) {
  const { user, refreshUser } = useClient();
  const [courseProgress, setCourseProgress] = useState<any>(null);
  const [lessonContext, setLessonContext] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");
  const [courseCompletedCelebration, setCourseCompletedCelebration] = useState<{
    bonusXP: number;
    achievements: any[];
  } | null>(null);

  // 1. Load lesson context & record access
  useEffect(() => {
    async function initLessonData() {
      try {
        const ctxJson = await api.get(`/api/lessons/${slug}`).catch(() => null);
        if (ctxJson?.success && ctxJson.data) {
          setLessonContext(ctxJson.data);
        }

        const parentCourseSlug = ctxJson?.data?.course?.slug || "backend-node-js";

        // Try learning summary first
        const summaryJson = await api.get(`/api/learning/courses/${parentCourseSlug}/summary`).catch(() => null);
        if (summaryJson?.success && summaryJson.data) {
          setCourseProgress(summaryJson.data);
          const allSummaryLessons = summaryJson.data.modules?.flatMap((m: any) => m.lessons) || [];
          const active = allSummaryLessons.find((l: any) => (l.slug || l) === slug);
          if (active?.isCompleted || active?.completed || active?.status === "completed") {
            setIsCompleted(true);
          }
        } else {
          // Fallback to course progress
          const progJson = await api.get(`/api/courses/${parentCourseSlug}/progress`).catch(() => null);
          if (progJson?.success && progJson.data) {
            setCourseProgress(progJson.data);
            const activeProgress = progJson.data.modules
              ?.flatMap((m: any) => m.lessons)
              ?.find((l: any) => l.slug === slug);
            if (activeProgress?.completed || activeProgress?.status === "completed") {
              setIsCompleted(true);
            }
          }
        }

        if (!user) return;

        // Record in-progress status
        await api.post("/api/progress", {
          lessonId: slug,
          status: "in-progress",
        }).catch(() => null);
      } catch (err) {
        console.error("Lesson initialization error:", err);
      }
    }

    initLessonData();
  }, [slug, user]);

  // 2. Complete Lesson Handler (Idempotent XP + Course Completion Bonus)
  async function handleMarkComplete() {
    if (!user || completing) return;
    setCompleting(true);

    try {
      const res = await api.post(`/api/learning/lessons/${slug}/complete`, {
        lessonId: slug,
        progressPercentage: 100,
        timeSpent: 120,
      }).catch(async () => {
        // Fallback to general progress endpoint
        return await api.post("/api/progress", {
          lessonId: slug,
          status: "completed",
          progressPercentage: 100,
        });
      });

      if (res?.success && res.data) {
        setIsCompleted(true);
        const earnedXP = res.data.earnedXP ?? res.data.xpEarned ?? 0;
        const isCourseComplete = res.data.isCourseCompleted ?? false;
        const bonusXP = res.data.courseBonusXP ?? 0;

        if (isCourseComplete) {
          setCourseCompletedCelebration({
            bonusXP: bonusXP || 500,
            achievements: res.data.unlockedAchievements || [],
          });
          setCompletionMessage(`🏆 COURSE COMPLETED! +${earnedXP} Lesson XP + 🌟 +${bonusXP || 500} XP Course Master Bonus!`);
        } else if (earnedXP > 0) {
          setCompletionMessage(`🎉 Lesson Completed! +${earnedXP} XP awarded!`);
        } else {
          setCompletionMessage("✓ Lesson marked as complete (XP already claimed).");
        }

        await refreshUser();

        // Refresh course summary
        const parentCourseSlug = lessonContext?.course?.slug || "backend-node-js";
        const refreshed = await api.get(`/api/learning/courses/${parentCourseSlug}/summary`).catch(() => null);
        if (refreshed?.success && refreshed.data) {
          setCourseProgress(refreshed.data);
        }
      }
    } catch (err) {
      console.error("Mark complete error:", err);
    } finally {
      setCompleting(false);
    }
  }

  const courseTitle = lessonContext?.course?.title || "Backend Engineering";
  const courseSlug = lessonContext?.course?.slug || "backend-node-js";
  const prevLesson = lessonContext?.previousLesson;
  const nextLesson = lessonContext?.nextLesson;
  const lessonIndex = lessonContext?.lessonIndex || 1;
  const totalLessons = lessonContext?.totalLessons || 12;

  const completedLessons = courseProgress?.completedLessons || 0;
  const courseTotalLessons = courseProgress?.totalLessons || totalLessons;
  const completionPercentage = Math.round((completedLessons / courseTotalLessons) * 100);

  return (
    <div className="min-h-screen bg-[#070913]">
      <ProgressBar completion={completionPercentage} />

      <div className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Navigation Action Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <a
                href={`/courses/${courseSlug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Course
              </a>
              {isCompleted && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
              )}
            </div>

            {/* Previous & Next Quick Controls */}
            <div className="flex items-center gap-2">
              {prevLesson && (
                <a
                  href={`/learn/${prevLesson.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/80 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:border-violet-500/40 hover:text-white transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Prev
                </a>
              )}
              {nextLesson && (
                <a
                  href={`/learn/${nextLesson.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/80 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:border-violet-500/40 hover:text-white transition"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}

              {user && (
                <button
                  onClick={handleMarkComplete}
                  disabled={completing || isCompleted}
                  className={`ml-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold shadow-md transition ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-95 cursor-pointer"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isCompleted ? "Completed" : completing ? "Saving..." : "Mark as Complete (+100 XP)"}
                </button>
              )}
            </div>
          </div>

          {/* Course Completed Celebration Banner */}
          {courseCompletedCelebration && (
            <div className="mb-8 rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shrink-0">
                    <Trophy className="h-8 w-8 text-emerald-400 animate-bounce" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold mb-2">
                      <Award className="h-3.5 w-3.5" /> COURSE COMPLETED
                    </div>
                    <h3 className="text-2xl font-black text-white">
                      Congratulations! You mastered {courseTitle}!
                    </h3>
                    <p className="text-sm text-slate-300 mt-1">
                      You've completed all lessons in this curriculum and claimed the <span className="text-emerald-400 font-bold">+{courseCompletedCelebration.bonusXP} XP</span> Master Bonus.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href={`/courses/${courseSlug}`}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition"
                  >
                    View Syllabus & Certificate
                  </a>
                  <a
                    href="/challenges"
                    className="px-4 py-2.5 rounded-xl border border-white/20 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
                  >
                    Explore Challenges
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Completion Toast Message */}
          {completionMessage && !courseCompletedCelebration && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                <span className="text-sm font-semibold">{completionMessage}</span>
              </div>
              <button
                onClick={() => setCompletionMessage("")}
                className="text-xs text-emerald-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          )}

          <LessonHeader
            lesson={lesson}
            completion={completionPercentage}
            courseTitle={courseTitle}
            courseSlug={courseSlug}
            lessonIndex={lessonIndex}
            totalLessons={totalLessons}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px]">
            <main className="space-y-8">
              {/* Lesson Text & Code Content */}
              <LessonContent blocks={lesson.content} />

              {/* Educational Mini-Game CTA Challenge */}
              <LessonGameBanner lessonSlug={slug} />

              {/* Hands-On Coding Practice CTA */}
              <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Hands-On Practice</span>
                    <h4 className="text-sm font-bold text-white">Practice What You Learned</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Write real backend code and evaluate against visible and hidden test suites.</p>
                  </div>
                </div>
                <a
                  href="/challenges"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/20 hover:bg-cyan-500/30 px-4 py-2 text-xs font-semibold text-cyan-300 transition shrink-0"
                >
                  <span>Start Coding Challenge</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Quiz Assessment */}
              <QuizPreview
                questions={lesson.quiz}
                xpReward={lesson.xpReward}
                lessonId={lesson.id}
              />

              <NotesPanel lessonId={lesson.id} />

              {/* Dynamic Next / Previous Lesson Navigation Block */}
              {nextLesson ? (
                <NextLesson
                  slug={nextLesson.slug}
                  title={nextLesson.title}
                  duration={nextLesson.duration || 30}
                  xp={nextLesson.xpReward || 150}
                />
              ) : (
                <div className="my-8 rounded-[2rem] border border-emerald-500/30 bg-emerald-500/10 p-8 text-center backdrop-blur-xl">
                  <Trophy className="mx-auto h-12 w-12 text-emerald-300" />
                  <h3 className="mt-4 text-2xl font-semibold text-white">Course Complete!</h3>
                  <p className="mt-2 text-slate-300">
                    You have reached the final lesson in {courseTitle}.
                  </p>
                  <a
                    href={`/courses/${courseSlug}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-slate-950"
                  >
                    View Syllabus & Certificate
                  </a>
                </div>
              )}
            </main>

            <aside className="h-fit space-y-6 lg:sticky lg:top-24">
              <LessonSidebar
                courseTitle={courseTitle}
                courseSlug={courseSlug}
                modules={courseProgress?.modules || []}
                currentSlug={slug}
                progressData={courseProgress}
              />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
