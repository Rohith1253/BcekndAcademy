"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { 
  CheckCircle2, ArrowLeft, ArrowRight, Trophy, BookOpen, 
  Code2, Award, Lock, Play, Clock, HelpCircle, ChevronLeft, ChevronRight,
  RefreshCw, Check, AlertTriangle, ExternalLink, Terminal
} from "lucide-react";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";
import { getApiUrl } from "@/lib/http";
import InteractiveCodeBlock from "@/components/lesson/InteractiveCodeBlock";
import LessonExercise from "@/components/lesson/LessonExercise";
import QuizPreview from "@/components/lesson/QuizPreview";
import NotesPanel from "@/components/lesson/NotesPanel";
import ProgressBar from "@/components/lesson/ProgressBar";
import LessonContentRenderer from "@/components/learning/LessonContentRenderer";

interface CourseLessonWorkspaceProps {
  courseSlug: string;
  lessonSlug: string;
}

export default function CourseLessonWorkspace({
  courseSlug,
  lessonSlug,
}: CourseLessonWorkspaceProps) {
  const { user, refreshUser } = useClient();
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lockedError, setLockedError] = useState<{ isLocked: boolean; reason?: string; requiredLessonSlug?: string } | null>(null);
  const [error, setError] = useState("");
  
  // Progress states
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completionData, setCompletionData] = useState<any>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, boolean>>({});
  
  const contentRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced auto-save progress
  const saveProgress = useCallback((scroll: number, exercises: Record<string, boolean>) => {
    if (!user) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await api.patch(`/api/courses/${courseSlug}/lessons/${lessonSlug}/progress`, {
          scrollPosition: scroll,
          readingProgress: scroll,
          exerciseProgress: exercises,
          timeSpent: 10,
        });
      } catch (err) {
        // silent fail on auto-save
      }
    }, 3000);
  }, [courseSlug, lessonSlug, user]);

  // Load lesson & curriculum data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setLockedError(null);
      setError("");

      try {
        // 1. Fetch lesson
        const lessonRes = await fetch(getApiUrl(`/api/courses/${courseSlug}/lessons/${lessonSlug}`), { credentials: "include" });
        const lessonJson = await lessonRes.json();

        if (!lessonRes.ok || !lessonJson.success) {
          if (lessonRes.status === 403 || lessonJson.isLocked) {
            setLockedError({
              isLocked: true,
              reason: lessonJson.reason || "Complete the previous lesson first to unlock this content.",
              requiredLessonSlug: lessonJson.requiredLessonSlug,
            });
            setLoading(false);
            return;
          }
          setError(lessonJson.error || "Failed to load lesson");
          setLoading(false);
          return;
        }

        setLesson(lessonJson.data.lesson);
        setCourse(lessonJson.data.course);
        if (lessonJson.data.progress) {
          setIsCompleted(lessonJson.data.progress.status === "completed" || !!lessonJson.data.progress.completed);
          if (lessonJson.data.progress.exerciseProgress) {
            setExerciseProgress(lessonJson.data.progress.exerciseProgress);
          }
        }

        // 2. Fetch curriculum
        const currRes = await fetch(getApiUrl(`/api/courses/${courseSlug}/curriculum`), { credentials: "include" });
        const currJson = await currRes.json();
        if (currJson.success && currJson.data) {
          setCurriculum(currJson.data);
        }

        // 3. Mark start
        if (user) {
          api.post(`/api/courses/${courseSlug}/lessons/${lessonSlug}/start`, {}).catch(() => null);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }

    loadData();

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [courseSlug, lessonSlug, user]);

  // Scroll listener for reading progress
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight <= 0) return;
      const current = Math.min(100, Math.max(0, Math.round((el.scrollTop / totalHeight) * 100)));
      setScrollProgress(current);
      saveProgress(current, exerciseProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [exerciseProgress, saveProgress]);

  // Handle exercise completion
  const handleExerciseComplete = (exerciseId: string) => {
    const updated = { ...exerciseProgress, [exerciseId]: true };
    setExerciseProgress(updated);
    saveProgress(scrollProgress, updated);
  };

  // Handle Mark as Complete
  const handleCompleteLesson = async () => {
    if (!user || completing) return;
    setCompleting(true);
    try {
      const res = await api.post(`/api/courses/${courseSlug}/lessons/${lessonSlug}/complete`, {
        readingProgress: 100,
        scrollPosition: 100,
        exerciseProgress,
        timeSpent: 180,
      });

      if (res.success && res.data) {
        setIsCompleted(true);
        setCompletionData(res.data);
        if (refreshUser) refreshUser();
      }
    } catch (err: any) {
      console.error("Failed to complete lesson:", err);
    } finally {
      setCompleting(false);
    }
  };

  // Find flattened lessons for prev / next navigation
  const allLessons = curriculum?.modules?.flatMap((m: any) => m.lessons) || [];
  const currentIndex = allLessons.findIndex((l: any) => l.slug === lessonSlug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <span>Loading lesson content & workspace...</span>
        </div>
      </div>
    );
  }

  // Locked Lesson State
  if (lockedError?.isLocked) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-xl text-center space-y-6 rounded-3xl border border-amber-500/20 bg-slate-900/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-white">Lesson is Locked</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {lockedError.reason || "This lesson requires sequential completion of previous lessons."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/10">
            {lockedError.requiredLessonSlug ? (
              <a
                href={`/courses/${courseSlug}/lessons/${lockedError.requiredLessonSlug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-slate-950 shadow-lg transition hover:opacity-90"
              >
                <span>Go to Prerequisite Lesson</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : null}
            <a
              href={`/courses/${courseSlug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-6 py-3 font-medium text-slate-200 hover:bg-slate-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Course Syllabus</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <h1 className="text-3xl font-semibold text-rose-400">Lesson Not Found</h1>
        <p className="mt-3 text-slate-400">{error || "The requested lesson is unavailable."}</p>
        <a
          href={`/courses/${courseSlug}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950"
        >
          Return to Course
        </a>
      </div>
    );
  }

  // Determine language for playground/interactive code
  const codeLanguage = lesson.language || course?.language || "javascript";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top sticky progress bar */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href={`/courses/${courseSlug}`}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Course Syllabus</span>
          </a>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-semibold text-cyan-300 truncate max-w-[200px] sm:max-w-md">
            {lesson.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>Reading Progress:</span>
            <span className="font-mono text-cyan-400 font-semibold">{scrollProgress}%</span>
          </div>
          <div className="w-24 sm:w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-200"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Check className="h-3 w-3" /> Done
            </span>
          ) : (
            <button
              onClick={handleCompleteLesson}
              disabled={completing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:opacity-90 transition disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{completing ? "Saving..." : "Mark Complete"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Curriculum navigation */}
        <aside className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Curriculum</h3>
              <span className="text-xs text-cyan-400 font-mono">
                {curriculum?.stats?.completedLessons ?? 0}/{curriculum?.stats?.totalLessons ?? allLessons.length} Done
              </span>
            </div>

            <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {curriculum?.modules?.map((mod: any, mIdx: number) => (
                <div key={mod.slug || mIdx} className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                    <span>M{mod.order}: {mod.title}</span>
                  </div>
                  <div className="space-y-1">
                    {mod.lessons?.map((les: any) => {
                      const isCurrent = les.slug === lessonSlug;
                      const isDone = les.isCompleted || les.completed;
                      const isLesLocked = les.isLocked;

                      return (
                        <a
                          key={les.slug}
                          href={isLesLocked ? undefined : `/courses/${courseSlug}/lessons/${les.slug}`}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition ${
                            isCurrent
                              ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-semibold"
                              : isDone
                              ? "text-emerald-300 hover:bg-emerald-500/10"
                              : isLesLocked
                              ? "text-slate-500 cursor-not-allowed opacity-60"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            ) : isLesLocked ? (
                              <Lock className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                            ) : (
                              <span className={`h-1.5 w-1.5 rounded-full ${isCurrent ? "bg-cyan-400" : "bg-slate-500"}`} />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          {les.isPreview && !isDone && (
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                              Preview
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notes Panel */}
          <NotesPanel lessonId={lessonSlug} />
        </aside>

        {/* Center/Main: Lesson Content (750-900px ideal reading width) */}
        <main className="lg:col-span-8 space-y-8 order-1 lg:order-2" ref={contentRef}>
          {/* Completion banner */}
          {completionData && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-5 backdrop-blur text-emerald-200 space-y-3">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-300 text-base">Lesson Completed!</h4>
                  <p className="text-xs text-emerald-300/80">
                    {completionData.alreadyCompleted 
                      ? "Progress updated. (XP previously awarded)" 
                      : `You earned +${completionData.xpEarned || lesson.xpReward || 100} XP!`}
                  </p>
                </div>
              </div>
              {completionData.courseCompleted && (
                <div className="mt-3 p-3 rounded-xl bg-violet-950/60 border border-violet-500/30 text-violet-200 flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-300">🎉 Course Completed!</span>
                    <p className="text-xs text-violet-300">+{completionData.courseBonusXP || 500} Bonus XP Awarded!</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lesson Header */}
          <header className="space-y-4 pb-6 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold uppercase tracking-wider">
                {course?.title || "Backend Course"}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-slate-400" />
                {lesson.estimatedMinutes || 15} mins
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium flex items-center gap-1.5">
                <Trophy className="h-3 w-3 text-emerald-400" />
                +{lesson.xpReward || 100} XP
              </span>
              {lesson.isPreview && (
                <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 font-medium">
                  Free Preview
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{lesson.title}</h1>
            <p className="text-slate-300 text-base leading-relaxed">{lesson.description}</p>
          </header>

          {/* Main Lesson Content */}
          <article className="space-y-6 text-slate-200">
            <LessonContentRenderer
              content={lesson.content}
              defaultLanguage={codeLanguage}
            />
          </article>

          {/* Interactive Code Example */}
          {lesson.codeExample && (
            <section className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400 uppercase tracking-wider">
                  <Code2 className="h-4 w-4" />
                  <span>Interactive Code Example</span>
                </div>
                <Link
                  href={`/workspace?course=${courseSlug}&lesson=${lessonSlug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold transition"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Open in Workspace</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <InteractiveCodeBlock
                initialCode={lesson.codeExample || ""}
                language={codeLanguage}
                title={lesson.title + " Example"}
              />
            </section>
          )}

          {/* Interactive Lesson Exercises */}
          {lesson.exercises && lesson.exercises.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  <Award className="h-4 w-4" />
                  <span>Interactive Practice Exercises</span>
                </div>
                <span className="text-xs text-slate-400">
                  {Object.keys(exerciseProgress).length}/{lesson.exercises.length} Complete
                </span>
              </div>

              <div className="space-y-6">
                {lesson.exercises.map((exercise: any, idx: number) => (
                  <LessonExercise
                    key={exercise.id || idx}
                    exercise={exercise}
                    isCompleted={!!exerciseProgress[exercise.id || String(idx)]}
                    onComplete={() => handleExerciseComplete(exercise.id || String(idx))}
                  />
                ))}
              </div>
            </section>
          )}

          {/* End-of-Lesson Assessment Quiz */}
          {lesson.quiz && (
            <section className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-400 uppercase tracking-wider">
                <HelpCircle className="h-4 w-4" />
                <span>Knowledge Check Quiz</span>
              </div>
              <QuizPreview questions={lesson.quiz?.questions || []} xpReward={lesson.quiz?.xpReward || 50} lessonId={lessonSlug} />
            </section>
          )}

          {/* Bottom Navigation */}
          <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
            {prevLesson ? (
              <a
                href={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous: {prevLesson.title}</span>
              </a>
            ) : <div />}

            <div className="flex items-center gap-3">
              {!isCompleted && (
                <button
                  onClick={handleCompleteLesson}
                  disabled={completing}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  <span>{completing ? "Completing..." : "Complete Lesson"}</span>
                </button>
              )}

              {nextLesson && (
                <a
                  href={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:opacity-90 transition shadow-lg"
                >
                  <span>Next: {nextLesson.title}</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </nav>
        </main>
      </div>
    </div>
  );
}
