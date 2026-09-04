"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getCourseTheme, COURSE_SYLLABUS_PREVIEWS } from "./course-theme";

interface CourseCardProps {
  course: any;
  progress: number; // 0 - 100
  isAuthenticated: boolean;
}

export default function CourseCard({
  course,
  progress = 0,
  isAuthenticated,
}: CourseCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const theme = getCourseTheme(course.slug);
  const Icon = theme.icon;

  const isCompleted = progress === 100;
  const isInProgress = progress > 0 && progress < 100;
  const diffLabel = course.difficulty || course.level || "Intermediate";

  // Real curriculum syllabus preview points
  const syllabusPoints = COURSE_SYLLABUS_PREVIEWS[course.slug] || [
    "Core backend system fundamentals & request lifecycle",
    "Production architecture & controller separation",
    "Database modeling & schema validation",
    "Security hardening & testing masterclass",
  ];

  // CTA Text & Styling logic
  let ctaText = "Start Learning";
  if (isCompleted) {
    ctaText = "Review Course";
  } else if (isInProgress) {
    ctaText = "Continue Learning";
  }

  return (
    <div
      className={`course-card group relative flex flex-col justify-between rounded-[24px] border border-white/[0.1] bg-gradient-to-b ${theme.cardBgGradient} p-6 sm:p-7 backdrop-blur-xl shadow-xl transition-all duration-300 ease-out hover:-translate-y-1.5 ${theme.cardBorderHover}`}
    >
      {/* Top Header Row: Technology Icon + Category & Difficulty Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-5">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} shadow-md transition-transform duration-300 group-hover:scale-105`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            <span
              className={`text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText}`}
            >
              {course.category || "Backend"}
            </span>

            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider bg-white/[0.06] px-2.5 py-1 rounded-lg border border-white/[0.08]">
              {diffLabel}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-xl font-bold text-white transition-colors duration-200 leading-snug group-hover:${theme.textColor}`}
        >
          {course.title}
        </h3>

        {/* Description */}
        <p className="mt-2.5 text-xs text-slate-300/90 leading-relaxed line-clamp-3">
          {course.shortDescription || course.description}
        </p>

        {/* Technology Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {course.tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded-md border border-white/[0.06]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Section 7: Course Quick Preview (What you'll learn) */}
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPreview(!showPreview);
            }}
            className="flex items-center justify-between w-full text-left text-[11px] font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span>What you&apos;ll learn</span>
              <span className="text-[10px] text-slate-500 font-mono">({syllabusPoints.length} topics)</span>
            </span>
            {showPreview ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {showPreview && (
            <div className="mt-2.5 space-y-1.5 rounded-xl bg-slate-950/80 p-3 border border-white/[0.06] text-[11px] text-slate-300">
              {syllabusPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Progress Bar, Metadata, Dynamic CTA */}
      <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-3.5">
        {/* Progress Bar (Always present to convey learner progression state) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-slate-400">
              {isCompleted
                ? "Status"
                : isInProgress
                ? "In Progress"
                : "Course Status"}
            </span>

            {isCompleted ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
                <CheckCircle2 className="w-3 h-3" />
                <span>Completed (100%)</span>
              </span>
            ) : isInProgress ? (
              <span className="text-cyan-400 font-bold font-mono">
                {progress}% Complete
              </span>
            ) : (
              <span className="text-slate-500 font-mono">0% Completed</span>
            )}
          </div>

          <div className="h-1.5 rounded-full bg-slate-950/90 overflow-hidden border border-white/[0.06]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? "bg-emerald-400" : theme.progressBarGradient
              }`}
              style={{ width: `${Math.max(progress, 0)}%` }}
            />
          </div>
        </div>

        {/* Course Metadata Stats */}
        <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 font-medium pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-mono">{course.estimatedHours || 14}h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-mono">{course.totalModules || 4} Mod</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
            <span className="font-mono">+{course.totalXP || 1770} XP</span>
          </div>
        </div>

        {/* Dynamic CTA Button */}
        <div className="pt-1">
          <Link
            href={`/courses/${course.slug}`}
            className={`flex items-center justify-between w-full rounded-xl py-2.5 px-4 text-xs font-bold transition-all duration-200 cursor-pointer ${
              isCompleted
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                : isInProgress
                ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25"
                : "border border-white/10 bg-slate-900/80 text-white hover:border-cyan-400/40 hover:bg-slate-800"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {isInProgress && (
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
              {isCompleted && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{ctaText}</span>
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
