"use client";

import React from "react";
import Link from "next/link";
import {
  Play,
  ArrowRight,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  Rocket,
  Compass,
} from "lucide-react";
import { getCourseTheme } from "./course-theme";

interface ContinueLearningCardProps {
  activeCourse: any | null;
  activeProgress: number; // 0 to 100
  recommendedCourse: any;
  user: any | null;
}

export default function ContinueLearningCard({
  activeCourse,
  activeProgress,
  recommendedCourse,
  user,
}: ContinueLearningCardProps) {
  // If user is logged in and has an active in-progress course
  const isInProgress = user && activeCourse && activeProgress > 0 && activeProgress < 100;
  const targetCourse = isInProgress ? activeCourse : recommendedCourse;

  if (!targetCourse) return null;

  const theme = getCourseTheme(targetCourse.slug);
  const Icon = theme.icon;

  // Compute remaining hours
  const totalHours = targetCourse.estimatedHours || 14;
  const remainingHours = Math.max(1, Math.round(totalHours * (1 - activeProgress / 100)));

  return (
    <section className="relative overflow-hidden rounded-lg border border-cyan-500/30 bg-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="relative z-10 grid gap-6 lg:grid-cols-12 items-center">
        {/* Left/Main Column: Status badge, Title, Progress & Details */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            {isInProgress ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>CONTINUE LEARNING</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-300">
                <Rocket className="w-3.5 h-3.5" />
                <span>START YOUR LEARNING JOURNEY</span>
              </span>
            )}

            <span className="text-[11px] font-mono uppercase tracking-wider rounded-md bg-white/[0.06] text-slate-300 px-2.5 py-0.5 border border-white/[0.08]">
              {targetCourse.category || "Backend"}
            </span>

            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              {targetCourse.difficulty || "Beginner"}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {targetCourse.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {targetCourse.shortDescription || targetCourse.description}
            </p>
          </div>

          {/* Progress Bar (if in-progress) */}
          {isInProgress ? (
            <div className="space-y-2 pt-2 max-w-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Your Course Progress</span>
                <span className="font-bold text-cyan-400 font-mono">{activeProgress}% completed</span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 border border-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${theme.progressBarGradient}`}
                  style={{ width: `${activeProgress}%` }}
                />
              </div>
            </div>
          ) : null}

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>
                {isInProgress ? `~${remainingHours}h remaining` : `${totalHours}h total`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{targetCourse.totalModules || 4} Modules</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <span>+{targetCourse.totalXP || 1770} XP</span>
            </div>
          </div>
        </div>

        {/* Right Column: Prominent Call To Action & Tech Badge */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8">
          <div className="flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} shadow-lg shadow-cyan-500/10`}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Recommended</p>
              <p className="text-sm font-bold text-white">Step 1 in Roadmap</p>
            </div>
          </div>

          <Link
            href={`/courses/${targetCourse.slug}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-cyan-500 py-3.5 px-7 text-xs sm:text-sm font-bold text-slate-950 shadow-md transition-all duration-300 hover:bg-cyan-400 hover:scale-[1.02] cursor-pointer"
          >
            <span>{isInProgress ? "Continue Learning" : "Start Learning"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
