"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDot, Map } from "lucide-react";
import { getCourseTheme } from "./course-theme";

interface CourseRoadmapSectionProps {
  courses: any[];
  userProgressMap: Record<string, number>;
}

export default function CourseRoadmapSection({
  courses,
  userProgressMap,
}: CourseRoadmapSectionProps) {
  // Sort courses by their natural curriculum sequence order
  const sortedCourses = [...courses].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (sortedCourses.length === 0) return null;

  return (
    <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-slate-950/90 to-slate-900/60 p-7 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            <Map className="w-3.5 h-3.5" />
            <span>Recommended Sequence</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Your Backend Roadmap
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Follow this architected progression from network protocols to enterprise data systems and security.
          </p>
        </div>

        <Link
          href="/roadmap"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition shrink-0"
        >
          <span>View Full Visual Graph</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Desktop Horizontal Step Flow */}
      <div className="hidden lg:grid grid-cols-5 gap-3 relative">
        {sortedCourses.map((course, index) => {
          const progress = userProgressMap[course.slug] || 0;
          const isCompleted = progress === 100;
          const isInProgress = progress > 0 && progress < 100;
          const theme = getCourseTheme(course.slug);
          const Icon = theme.icon;

          return (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-950/70 p-4 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-200"
            >
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                    Stage 0{index + 1}
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Done</span>
                    </span>
                  ) : isInProgress ? (
                    <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold font-mono">
                      <CircleDot className="w-3 h-3 animate-pulse" />
                      <span>{progress}%</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Up next</span>
                  )}
                </div>

                {/* Tech Icon + Title */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.badgeBg} ${theme.badgeText}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-tight">
                    {course.title}
                  </span>
                </div>
              </div>

              {/* Bottom stage badge */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{course.category}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile/Tablet Vertical Timeline */}
      <div className="lg:hidden space-y-3">
        {sortedCourses.map((course, index) => {
          const progress = userProgressMap[course.slug] || 0;
          const isCompleted = progress === 100;
          const isInProgress = progress > 0 && progress < 100;
          const theme = getCourseTheme(course.slug);
          const Icon = theme.icon;

          return (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-slate-950/70 p-3.5 hover:border-cyan-500/40 hover:bg-slate-900 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-500 shrink-0">
                  0{index + 1}
                </span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${theme.badgeBg} ${theme.badgeText} shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 transition">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">{course.category} &bull; {course.estimatedHours || 14}h</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isInProgress ? (
                  <span className="text-xs font-mono font-bold text-cyan-400">{progress}%</span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
