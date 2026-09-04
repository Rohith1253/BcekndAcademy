"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ArrowLeft, ArrowRight, Trophy, Sparkles, BookOpen, Code2 } from "lucide-react";
import { useClient } from "@/lib/store";
import { getApiUrl } from "@/lib/http";
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

  // 1. Load lesson context & record access
  useEffect(() => {
    async function initLessonData() {
      try {
        const ctxRes = await fetch(getApiUrl(`/api/lessons/${slug}`));
        const ctxJson = await ctxRes.json();
        if (ctxJson.success && ctxJson.data) {
          setLessonContext(ctxJson.data);
        }

        if (!user) return;

        await fetch(getApiUrl("/api/progress"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            lessonId: slug,
            status: "in-progress",
          }),
        });

        const parentCourseSlug = ctxJson.data?.course?.slug || "backend-node-js";

        const progRes = await fetch(getApiUrl(`/api/courses/${parentCourseSlug}/progress`), {
          credentials: "include",
        });
        const progJson = await progRes.json();

        if (progJson.success && progJson.data) {
          setCourseProgress(progJson.data);

          const activeProgress = progJson.data.modules
            ?.flatMap((m: any) => m.lessons)
            ?.find((l: any) => l.slug === slug);

          if (activeProgress?.completed || activeProgress?.status === "completed") {
            setIsCompleted(true);
          }
        }
      } catch (err) {
        console.error("Lesson initialization error:", err);
      }
    }

    initLessonData();
  }, [slug, user]);

  // 2. Complete Lesson Handler (Idempotent XP)
  async function handleMarkComplete() {
    if (!user || completing) return;
    setCompleting(true);

    try {
      const res = await fetch(getApiUrl("/api/progress"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          lessonId: slug,
          status: "completed",
          progressPercentage: 100,
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        setIsCompleted(true);
        if (json.data.xpEarned > 0) {
          setCompletionMessage(`🎉 Lesson Completed! +${json.data.xpEarned} XP awarded!`);
        } else {
          setCompletionMessage("✓ Lesson marked as complete (XP already claimed).");
        }
        await refreshUser();
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

          {/* Completion Toast Message */}
          {completionMessage && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-300" />
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
