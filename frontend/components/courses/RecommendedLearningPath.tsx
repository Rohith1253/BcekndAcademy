"use client";

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Award,
  ChevronRight,
  Code2,
  Database,
  Lock,
  FileCode,
  Briefcase,
  Server,
  Layers,
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
  const getStepIcon = (slug: string) => {
    switch (slug) {
      case 'backend-node-js':
        return Server;
      case 'typescript-backend':
        return FileCode;
      case 'express-rest-api':
        return Code2;
      case 'mongodb-database':
        return Database;
      case 'backend-auth-security':
        return Lock;
      default:
        return Layers;
    }
  };

  const totalSteps = BACKEND_LEARNING_PATH.length;
  const completedSteps = BACKEND_LEARNING_PATH.filter(
    (step) => (userProgressMap[step.slug] || 0) === 100
  ).length;
  const overallPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <section
      aria-labelledby="learning-path-heading"
      className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-10 lg:p-12 shadow-xl overflow-hidden"
    >
      <div className="relative z-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-300">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase tracking-[0.2em] text-[11px]">Beginner-to-Production Path</span>
            </div>
            <h2 id="learning-path-heading" className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Guided Backend Developer Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Never wonder what to learn next. Follow our battle-tested curriculum designed to take you from core JavaScript to production microservices and security engineering.
            </p>
          </div>

          {/* User Progress Badge */}
          {isAuthenticated && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shrink-0 min-w-[220px]">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
                <span>Core Progression</span>
                <span className="text-cyan-400 font-bold font-mono">{overallPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {completedSteps} of {totalSteps} core courses completed
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
                {index < BACKEND_LEARNING_PATH.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-6 sm:left-8 top-20 bottom-[-24px] w-0.5 bg-slate-800 z-0 hidden sm:block"
                  />
                )}

                <div
                  className={`relative z-10 rounded-2xl border transition-all duration-200 p-5 sm:p-7 ${
                    isCompleted
                      ? "border-emerald-500/30 bg-emerald-950/10"
                      : isInProgress
                      ? "border-cyan-500/40 bg-cyan-950/20 shadow-lg shadow-cyan-950/40"
                      : step.isStartHere
                      ? "border-cyan-500/50 bg-slate-900 shadow-xl shadow-cyan-500/10"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4 sm:gap-5 flex-1">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div
                          className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border transition-transform duration-200 group-hover:scale-105 shadow-md ${
                            isCompleted
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                              : isInProgress
                              ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                              : step.isStartHere
                              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                              : "bg-slate-900 border-slate-800 text-slate-300"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
                          ) : (
                            <StepIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                          Stage {step.stepNumber}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {step.isStartHere && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500 text-slate-950 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                              START HERE
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                            Level {step.levelNumber}: {step.levelName}
                          </span>

                          <span className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
                            {step.difficulty}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          <Link
                            href={`/courses/${step.courseSlug}`}
                            className="hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                          >
                            {step.courseTitle}
                          </Link>
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          <strong className="text-slate-100 font-semibold">Why learn this:</strong>{" "}
                          {step.whyLearn}
                        </p>

                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {step.skillsGained.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-md px-2 py-0.5"
                            >
                              &bull; {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      <div className="text-left lg:text-right">
                        <div className="text-[11px] font-semibold">
                          {isCompleted ? (
                            <span className="text-emerald-400 font-mono flex items-center lg:justify-end gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                          ) : isInProgress ? (
                            <span className="text-cyan-400 font-mono font-bold">
                              {progress}% In Progress
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono">Not started</span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/courses/${step.courseSlug}`}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                          isCompleted
                            ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                            : isInProgress
                            ? "border border-cyan-500/40 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30"
                            : step.isStartHere
                            ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                            : "border border-slate-800 bg-slate-900 text-white hover:border-cyan-400 hover:bg-slate-800"
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
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
