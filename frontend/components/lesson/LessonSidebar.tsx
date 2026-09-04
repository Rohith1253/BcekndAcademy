"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Lock, BookOpen, Layers, Menu, X } from "lucide-react";

interface LessonSidebarProps {
  courseTitle?: string;
  courseSlug?: string;
  modules?: any[];
  currentSlug: string;
  progressData?: any;
}

export default function LessonSidebar({
  courseTitle = "Backend Development with Node.js",
  courseSlug = "backend-node-js",
  modules = [],
  currentSlug,
  progressData,
}: LessonSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (slug: string) => {
    setCollapsedModules((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const progressPercent = progressData?.progressPercentage ?? 0;
  const completedLessonsCount = progressData?.completedLessons ?? 0;
  const totalLessonsCount = progressData?.totalLessons ?? 12;

  const contentMarkup = (
    <aside className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl backdrop-blur-xl">
      {/* Sidebar Header */}
      <div className="mb-6 space-y-3 pb-4 border-b border-white/10">
        <a
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 hover:text-violet-200"
        >
          ← Back to Course
        </a>
        <h2 className="text-lg font-semibold text-white line-clamp-2">{courseTitle}</h2>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Course Progress</span>
            <span className="text-cyan-300 font-medium">{completedLessonsCount}/{totalLessonsCount} ({progressPercent}%)</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules & Lessons List */}
      <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
        {modules && modules.length > 0 ? (
          modules.map((mod: any, mIdx: number) => {
            const isCollapsed = collapsedModules[mod.slug];
            const modLessons = mod.lessons || [];
            const hasCurrentLesson = modLessons.some((l: any) => (l.slug || l) === currentSlug);
            const isModComplete = mod.isModuleComplete || (modLessons.length > 0 && modLessons.every((l: any) => l.isCompleted || l.completed || l.status === "completed"));

            return (
              <div key={mod._id || mod.slug || mIdx} className="rounded-2xl border border-white/5 bg-slate-900/60 overflow-hidden">
                {/* Module Accordion Header */}
                <button
                  onClick={() => toggleModule(mod.slug)}
                  className="w-full flex items-center justify-between p-3.5 text-left bg-slate-900/80 hover:bg-slate-900 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-semibold ${
                      isModComplete ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-cyan-500/20 text-cyan-300"
                    }`}>
                      {isModComplete ? "✓" : mod.order || mIdx + 1}
                    </span>
                    <span className="text-xs font-semibold text-white line-clamp-1">{mod.title}</span>
                  </div>
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>

                {/* Module Lessons */}
                {!isCollapsed && (
                  <div className="p-2 space-y-1 bg-slate-950/40">
                    {modLessons.map((les: any) => {
                      const lesSlug = les.slug || les;
                      const isCurrent = lesSlug === currentSlug;
                      const isDone = les.isCompleted || les.completed || les.status === "completed";

                      return (
                        <a
                          key={les._id || lesSlug}
                          href={`/learn/${lesSlug}`}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                            isCurrent
                              ? "bg-cyan-500/20 text-white font-semibold border border-cyan-500/40 shadow-sm"
                              : isDone
                              ? "text-emerald-300 hover:bg-slate-900"
                              : "text-slate-300 hover:bg-slate-900 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 max-w-[80%]">
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                            ) : isCurrent ? (
                              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-600 flex-shrink-0" />
                            )}
                            <span className="truncate">{les.title || lesSlug}</span>
                          </div>

                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {les.durationMinutes || les.duration || 15}m
                          </span>
                        </a>
                      );
                    })}

                    {/* Module Assessment Status */}
                    <div className="pt-2 mt-2 border-t border-white/5 px-2 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Module Quiz:</span>
                      {isModComplete ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Ready
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Lock className="h-3 w-3" /> In Progress
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400">Loading syllabus modules...</p>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-xl"
        >
          <div className="flex items-center gap-2">
            <Menu className="h-4 w-4 text-violet-300" />
            <span>Course Syllabus & Lessons</span>
          </div>
          <span className="text-xs text-cyan-300">{completedLessonsCount}/{totalLessonsCount}</span>
        </button>
      </div>

      {/* Desktop Sidebar View */}
      <div className="hidden lg:block lg:sticky lg:top-24">{contentMarkup}</div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-950/80 backdrop-blur-md lg:hidden">
          <div className="relative w-full max-w-xs p-4">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-6 top-6 rounded-full bg-slate-900 p-2 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {contentMarkup}
          </div>
        </div>
      )}
    </>
  );
}
