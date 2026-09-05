"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Zap,
  BookOpen,
  CheckCircle2,
  Terminal,
  Award,
  ChevronRight,
  ShieldCheck,
  Globe,
  Code2,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Lock,
  Calendar
} from "lucide-react";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";

interface LevelInfo {
  currentLevel: number;
  levelTitle: string;
  totalXP: number;
  currentLevelBaseXP: number;
  nextLevelXP: number;
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
  progressPercentage: number;
  isMaxLevel: boolean;
}

interface LanguageProgressItem {
  name: string;
  slug: string;
  icon?: string;
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  earnedXP: number;
  totalPossibleXP: number;
  currentLevel: "Beginner" | "Intermediate" | "Advanced";
}

interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function ProgressPage() {
  const { user } = useClient();
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [streak, setStreak] = useState<{ currentStreak: number; longestStreak: number }>({
    currentStreak: 0,
    longestStreak: 0,
  });
  const [languageProgress, setLanguageProgress] = useState<LanguageProgressItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [selectedAchievementCategory, setSelectedAchievementCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgressData() {
      try {
        // Fetch 11-language progress (public or authenticated)
        const langRes = await api.get("/api/progress/languages");
        if (langRes.success && Array.isArray(langRes.data)) {
          setLanguageProgress(langRes.data);
        }

        // Fetch user progress and achievements
        if (user) {
          const progRes = await api.get("/api/progress");
          if (progRes.success && progRes.data) {
            setLevelInfo(progRes.data.levelInfo || null);
            if (progRes.data.streak) {
              setStreak(progRes.data.streak);
            }
          }

          const achRes = await api.get("/api/achievements/user");
          if (achRes.success && Array.isArray(achRes.data?.achievements)) {
            setAchievements(achRes.data.achievements);
          }
        } else {
          // Unauthenticated fallback: fetch master achievements catalog
          const achRes = await api.get("/api/achievements");
          if (achRes.success && Array.isArray(achRes.data)) {
            setAchievements(achRes.data.map((a: any) => ({ ...a, unlocked: false })));
          }
        }
      } catch (err) {
        console.error("Failed to load progress hub data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProgressData();
  }, [user]);

  // Compute total platform lessons & XP stats
  const totalCompletedLessons = languageProgress.reduce((acc, l) => acc + l.completedLessons, 0);
  const totalLessonsCount = languageProgress.reduce((acc, l) => acc + l.totalLessons, 0);
  const totalEarnedXP = levelInfo?.totalXP ?? (user?.xp || 0);

  const achievementCategories = ["All", "beginner", "backend", "language", "streak", "coding", "quiz"];
  const filteredAchievements = achievements.filter((a) => {
    if (selectedAchievementCategory === "All") return true;
    return a.category.toLowerCase() === selectedAchievementCategory.toLowerCase();
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-[#060813] px-4 py-24 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Hero & Level Progress Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#070913] p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
            {/* User Level Title & Rank */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-cyan-300 uppercase tracking-widest">
                <Trophy className="h-4 w-4" />
                <span>Backend Engineering Competency</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {levelInfo?.levelTitle || "Backend Developer"}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Track your multi-language backend journey across 11 language stacks, 26 production courses, and 32+ hands-on challenges.
              </p>

              {/* Level Progress Bar */}
              <div className="pt-2 space-y-2 max-w-xl">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">
                    Level {levelInfo?.currentLevel || 1}
                  </span>
                  <span className="text-slate-400">
                    {levelInfo?.isMaxLevel
                      ? "Maximum Level Reached"
                      : `${levelInfo?.xpInCurrentLevel || 0} / ${levelInfo?.xpRequiredForNextLevel || 100} XP to Level ${(levelInfo?.currentLevel || 1) + 1}`}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-900 border border-white/10 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-300 transition-all duration-700 shadow-lg shadow-cyan-500/50"
                    style={{ width: `${levelInfo?.progressPercentage || 10}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick KPI Stats Cards (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total XP</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalEarnedXP.toLocaleString()}</p>
                <p className="text-[11px] text-slate-500 mt-1">Platform-wide XP</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Flame className="h-4 w-4" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Streak</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">
                  {streak.currentStreak} <span className="text-sm font-normal text-slate-400">days</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Best: {streak.longestStreak} days</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Lessons</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">
                  {totalCompletedLessons} <span className="text-sm font-normal text-slate-500">/ {totalLessonsCount}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Lessons Completed</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-fuchsia-400 mb-1">
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Badges</span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">
                  {unlockedCount} <span className="text-sm font-normal text-slate-500">/ {achievements.length}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Achievements Unlocked</p>
              </div>
            </div>
          </div>
        </div>

        {/* 11 Language Competency Matrix */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-semibold">
                <Layers className="h-4 w-4" />
                <span>Polyglot Backend Mastery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Language Competency Progress
              </h2>
            </div>
            <Link
              href="/backend-languages"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>Explore Matrix Comparison</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {languageProgress.map((lang) => {
              const levelBadgeColor =
                lang.currentLevel === "Advanced"
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  : lang.currentLevel === "Intermediate"
                  ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                  : "bg-slate-800/80 text-slate-400 border-white/10";

              return (
                <div
                  key={lang.slug}
                  className="group relative rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl backdrop-blur-xl hover:border-cyan-500/40 transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
                          <Code2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition">
                            {lang.name}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {lang.totalCourses} {lang.totalCourses === 1 ? "Course" : "Courses"} • {lang.totalLessons} Lessons
                          </p>
                        </div>
                      </div>

                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${levelBadgeColor}`}>
                        {lang.currentLevel}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Progress</span>
                        <span className="text-white font-bold">{lang.progressPercentage}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-white/5">
                        <div
                          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                          style={{ width: `${lang.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs font-mono text-slate-400 border-t border-white/5">
                      <span>{lang.completedLessons} / {lang.totalLessons} completed</span>
                      <span className="text-cyan-300 font-semibold">+{lang.earnedXP} XP</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 flex items-center gap-2 border-t border-white/10">
                    <Link
                      href={`/playground?lang=${lang.slug}`}
                      className="flex-1 rounded-xl bg-slate-900/90 border border-white/10 py-2 text-center text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition"
                    >
                      Playground
                    </Link>
                    <Link
                      href={`/backend-languages/${lang.slug}`}
                      className="flex-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 py-2 text-center text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
                    >
                      Language Track
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Master Achievements Showcase */}
        <section className="space-y-6 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-fuchsia-400 text-xs font-mono uppercase tracking-wider font-semibold">
                <Award className="h-4 w-4" />
                <span>Recognition & Mastery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Achievements & Badges ({unlockedCount}/{achievements.length})
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {achievementCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedAchievementCategory(cat)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                    selectedAchievementCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "bg-slate-900/90 text-slate-400 hover:text-white border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredAchievements.map((ach) => (
              <div
                key={ach.id}
                className={`relative rounded-2xl border p-5 transition flex flex-col justify-between ${
                  ach.unlocked
                    ? "border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-slate-950/80 shadow-lg shadow-cyan-950/30"
                    : "border-white/5 bg-slate-950/50 opacity-60"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                        ach.unlocked
                          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                          : "bg-slate-900 border-white/5 text-slate-600"
                      }`}
                    >
                      {ach.unlocked ? <Award className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                    </div>

                    <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                      +{ach.xpReward} XP
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500 uppercase">{ach.category}</span>
                  {ach.unlocked ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-slate-500">Locked</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
