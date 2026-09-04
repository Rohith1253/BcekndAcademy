'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  Code2,
  Database,
  Lock,
  FileCode,
  Briefcase,
} from 'lucide-react';
import { BACKEND_LEARNING_PATH, LearningPathStep } from '@/lib/learningPath';
import { getCourseTheme } from './course-theme';

interface RecommendedLearningPathProps {
  courses: any[];
  userProgressMap: Record<string, number>;
  isAuthenticated: boolean;
}

export default function RecommendedLearningPath({
  courses,
  userProgressMap,
  isAuthenticated,
}: RecommendedLearningPathProps) {
  // Map step icon based on course slug
  const getStepIcon = (slug: string) => {
    switch (slug) {
      case 'backend-node-js':
        return Code2;
      case 'typescript-backend':
        return FileCode;
      case 'express-rest-api':
        return Sparkles;
      case 'mongodb-database':
        return Database;
      case 'backend-auth-security':
        return Lock;
      default:
        return Code2;
    }
  };

  // Calculate overall foundation progress
  const totalSteps = BACKEND_LEARNING_PATH.length;
  const completedSteps = BACKEND_LEARNING_PATH.filter(
    (step) => (userProgressMap[step.slug] || 0) === 100
  ).length;
  const overallPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <section
      aria-labelledby="learning-path-heading"
      className="relative rounded-[2.5rem] border border-cyan-500/20 bg-gradient-to-b from-slate-950 via-[#0a0f24] to-slate-950 p-6 sm:p-10 lg:p-12 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/3 -mt-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 -mb-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="uppercase tracking-[0.2em] text-[11px]">Recommended Learning Path</span>
            </div>
            <h2 id="learning-path-heading" className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Guided Backend Developer Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Never wonder what to learn next. Follow our battle-tested, 5-stage curriculum designed to take you from core HTTP network fundamentals to enterprise security engineering.
            </p>
          </div>

          {/* User Progress Badge */}
          {isAuthenticated && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shrink-0 min-w-[220px]">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
                <span>Path Progression</span>
                <span className="text-cyan-400 font-bold font-mono">{overallPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {completedSteps} of {totalSteps} core courses mastered
              </p>
            </div>
          )}
        </div>

        {/* Step-by-Step Learning Timeline */}
        <div className="space-y-6">
          {BACKEND_LEARNING_PATH.map((step: LearningPathStep, index: number) => {
            const progress = userProgressMap[step.courseSlug] || 0;
            const isCompleted = progress === 100;
            const isInProgress = progress > 0 && progress < 100;
            const StepIcon = getStepIcon(step.courseSlug);
            const theme = getCourseTheme(step.courseSlug);

            return (
              <div key={step.courseSlug} className="relative group">
                {/* Connecting Line to next step */}
                {index < BACKEND_LEARNING_PATH.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-6 sm:left-8 top-20 bottom-[-24px] w-0.5 bg-gradient-to-b from-cyan-500/40 via-indigo-500/20 to-transparent z-0 hidden sm:block"
                  />
                )}

                <div
                  className={`relative z-10 rounded-2xl border transition-all duration-300 p-5 sm:p-7 ${
                    isCompleted
                      ? "border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50"
                      : isInProgress
                      ? "border-cyan-500/40 bg-cyan-950/20 shadow-lg shadow-cyan-950/40"
                      : step.isStartHere
                      ? "border-cyan-500/50 bg-slate-900/90 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                      : "border-white/[0.08] bg-slate-900/60 hover:border-white/20 hover:bg-slate-900/90"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Step Number, Icon, Title, Description */}
                    <div className="flex items-start gap-4 sm:gap-5 flex-1">
                      {/* Step Number Badge */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div
                          className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-105 shadow-lg ${
                            isCompleted
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                              : isInProgress
                              ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 animate-pulse"
                              : step.isStartHere
                              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                              : `${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
                          ) : (
                            <StepIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                          Step {step.stepNumber}
                        </span>
                      </div>

                      {/* Course Content Details */}
                      <div className="space-y-2.5 flex-1 min-w-0">
                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-2">
                          {step.isStartHere && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest shadow-md shadow-emerald-500/30 animate-pulse">
                              <Sparkles className="w-3 h-3" />
                              START HERE
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                            Level {step.levelNumber}: {step.levelName}
                          </span>

                          <span className="text-[10px] font-mono text-slate-300 bg-slate-950/70 px-2.5 py-0.5 rounded-lg border border-white/5">
                            {step.difficulty}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            Prereq:{" "}
                            <strong className="text-slate-300">
                              {step.prerequisites ? step.prerequisites.title : "None (Beginner)"}
                            </strong>
                          </span>
                        </div>

                        {/* Course Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          <Link
                            href={`/courses/${step.courseSlug}`}
                            className="hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                          >
                            {step.courseTitle}
                          </Link>
                        </h3>

                        {/* Why Learn This? */}
                        <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                          <strong className="text-slate-100 font-semibold">Why learn this:</strong>{" "}
                          {step.whyLearn}
                        </p>

                        {/* Skills Gained Chips */}
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {step.skillsGained.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-medium text-slate-300 bg-slate-950/80 border border-white/[0.06] rounded-md px-2 py-0.5"
                            >
                              &bull; {skill}
                            </span>
                          ))}
                        </div>

                        {/* Real-World Build Case */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                          <Briefcase className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="text-slate-500 font-medium">Real-World Project:</span>
                          <span className="text-slate-300 font-mono text-[10px]">
                            {step.realWorldBuild}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Progress & Action CTA */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/[0.08]">
                      {/* Progress state */}
                      <div className="text-left lg:text-right">
                        <div className="text-[11px] font-semibold">
                          {isCompleted ? (
                            <span className="text-emerald-400 font-mono flex items-center lg:justify-end gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Completed
                            </span>
                          ) : isInProgress ? (
                            <span className="text-cyan-400 font-mono font-bold">
                              {progress}% In Progress
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono">Not started</span>
                          )}
                        </div>
                        {step.nextCourseTitle && (
                          <span className="text-[10px] text-slate-500 hidden sm:inline-block mt-0.5">
                            Next: {step.nextCourseTitle}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/courses/${step.courseSlug}`}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                          isCompleted
                            ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                            : isInProgress
                            ? "border border-cyan-500/40 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30"
                            : step.isStartHere
                            ? "border border-emerald-400/50 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20"
                            : "border border-white/10 bg-slate-800 text-white hover:border-cyan-400/50 hover:bg-slate-700"
                        }`}
                      >
                        <span>
                          {isCompleted
                            ? "Review Course"
                            : isInProgress
                            ? "Continue Course"
                            : step.isStartHere
                            ? "Start Learning Here"
                            : "Start Course"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Final Milestone Banner: 🎉 BACKEND DEVELOPER FOUNDATION COMPLETE */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-950/80 to-cyan-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-inner">
                <Award className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                  Curriculum Milestone
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  🎉 BACKEND DEVELOPER FOUNDATION COMPLETE
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  By completing all 5 stages, you possess full mastery over HTTP protocols, TypeScript microservices, Express REST design, MongoDB indexing, and OWASP security hardening.
                </p>
              </div>
            </div>

            <Link
              href={`/courses/${BACKEND_LEARNING_PATH[0].courseSlug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-5 py-3 text-xs font-bold text-emerald-200 hover:bg-emerald-500/30 transition shrink-0"
            >
              <span>Begin Your Journey</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
