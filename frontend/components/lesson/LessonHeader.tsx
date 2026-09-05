"use client";

import { Clock, Zap, Trophy, BookOpen, ChevronRight } from "lucide-react";
import BookmarkButton from "@/components/lesson/BookmarkButton";
import type { LessonData } from "@/data/lessons/types";

interface LessonHeaderProps {
  lesson: LessonData;
  completion: number;
  courseTitle?: string;
  courseSlug?: string;
  lessonIndex?: number;
  totalLessons?: number;
}

export default function LessonHeader({
  lesson,
  completion,
  courseTitle = "Backend Development with Node.js",
  courseSlug = "backend-node-js",
  lessonIndex = 1,
  totalLessons = 12,
}: LessonHeaderProps) {
  const estimatedReadingTime = Math.max(3, Math.round((lesson.content?.length || 10) * 1.2));

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl">
      {/* Breadcrumb "You Are Here" Context */}
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
        <a href={`/courses/${courseSlug}`} className="hover:text-violet-300 transition">
          {courseTitle}
        </a>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-300">{lesson.moduleName}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-cyan-300 font-semibold">Lesson {lessonIndex} of {totalLessons}</span>
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-violet-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 border border-violet-500/30">
              {lesson.moduleName}
            </span>
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                lesson.difficulty === "Beginner"
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : lesson.difficulty === "Intermediate"
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
              }`}
            >
              {lesson.difficulty}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">{lesson.title}</h1>
          <p className="max-w-3xl text-base sm:text-lg leading-7 text-slate-300">{lesson.description}</p>
        </div>
        <BookmarkButton lessonId={lesson.id} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="h-5 w-5 text-sky-300" />
            <span className="text-xs uppercase tracking-wider font-medium">Duration & Reading Time</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-white">{lesson.duration || 30} min (~{estimatedReadingTime}m read)</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="h-5 w-5 text-violet-300" />
            <span className="text-xs uppercase tracking-wider font-medium">XP Reward</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-white">+{lesson.xpReward || 100} XP</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
          <div className="flex items-center gap-2 text-slate-300">
            <Trophy className="h-5 w-5 text-amber-300" />
            <span className="text-xs uppercase tracking-wider font-medium">Course Completion</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-white">{completion}%</p>
        </div>
      </div>
    </div>
  );
}
