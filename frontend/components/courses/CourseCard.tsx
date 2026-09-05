"use client";

import React from "react";
import Link from "next/link";
import { 
  Clock, 
  BookOpen, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  Terminal,
  FileText
} from "lucide-react";
import type { CatalogCourse } from "@/data/courses-catalog-data";

interface CourseCardProps {
  course: CatalogCourse;
  progress?: number;
  isAuthenticated?: boolean;
}

export default function CourseCard({ course, progress = 0 }: CourseCardProps) {
  const isCompleted = progress >= 100;
  const inProgress = progress > 0 && progress < 100;
  const isInteractive = course.executionSupport === "interactive" || course.language === "javascript" || course.language === "agnostic";

  return (
    <div className="course-card group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-900/90">
      
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              {course.level || (course.levelNumber !== undefined ? `Level ${course.levelNumber}` : "Course")}
            </span>

            {/* Execution Support Badge */}
            {isInteractive ? (
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>Interactive Sandbox</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                <FileText className="w-3 h-3 text-slate-400" />
                <span>Curriculum Guide</span>
              </span>
            )}
          </div>

          {isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </span>
          ) : inProgress ? (
            <span className="text-xs font-semibold text-cyan-400">
              {progress}% Done
            </span>
          ) : (
            <span className="text-xs text-slate-500 font-mono capitalize">
              {course.difficulty}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {course.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {course.shortDescription || course.description}
          </p>
        </div>

        {/* Why it matters note */}
        {course.whyItMatters && (
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 text-[11px] text-slate-400 leading-snug">
            <span className="font-bold text-slate-300">Why learn this: </span>
            {course.whyItMatters}
          </div>
        )}

        {/* Metadata stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{course.estimatedHours || 6}h</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-cyan-400" />
            <span>{course.totalLessons || 12} Lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-emerald-400" />
            <span>{course.totalXP || 1500} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar if active */}
      {inProgress && (
        <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-mono">
          {course.frameworks?.slice(0, 2).join(", ") || course.language}
        </span>
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 px-3.5 py-1.5 text-xs font-bold text-slate-200 transition"
        >
          <span>{isCompleted ? "Review" : inProgress ? "Continue" : "Start Course"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
