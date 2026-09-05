"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Flame,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Clock,
  Code2,
  Trophy,
  ArrowUpRight,
  PieChart as PieChartIcon
} from "lucide-react";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";

export default function AnalyticsDashboardPage() {
  const { user } = useClient();
  const [overview, setOverview] = useState<any>(null);
  const [activityDays, setActivityDays] = useState<any[]>([]);
  const [languageStats, setLanguageStats] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        if (user) {
          const overRes = await api.get("/api/analytics/overview");
          if (overRes.success && overRes.data) {
            setOverview(overRes.data);
          }

          const actRes = await api.get(`/api/analytics/activity?days=${timeRange === "7d" ? 7 : 30}`);
          if (actRes.success && Array.isArray(actRes.data)) {
            setActivityDays(actRes.data);
          }
        }

        const langRes = await api.get("/api/analytics/languages");
        if (langRes.success && Array.isArray(langRes.data)) {
          setLanguageStats(langRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [user, timeRange]);

  // Fallback defaults for unauthenticated or new users
  const totalXP = overview?.totalXP ?? (user?.xp || 0);
  const currentLevel = overview?.levelInfo?.currentLevel ?? 1;
  const levelTitle = overview?.levelInfo?.levelTitle ?? "Backend Developer";
  const streakDays = overview?.streak?.currentStreak ?? 0;
  const completedLessons = overview?.lessonsCompleted ?? 0;
  const passedQuizzes = overview?.quizzesPassed ?? 0;
  const solvedChallenges = overview?.challengesSolved ?? 0;

  const quizStats = overview?.quizStats || {
    totalAttempts: 0,
    averageScore: 0,
    passRate: 0,
  };

  const challengeStats = overview?.challengeStats || {
    totalSubmissions: 0,
    solvedCount: 0,
    successRate: 0,
  };

  return (
    <div className="min-h-screen bg-[#060813] px-4 py-24 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#070913] p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-cyan-300 uppercase tracking-widest">
                <BarChart3 className="h-4 w-4" />
                <span>Learning Analytics & Telemetry</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Backend Performance Metrics
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Real-time insights into your coding velocity, quiz precision, multi-language curriculum completion, and system architecture mastery.
              </p>
            </div>

            {/* Time range selector */}
            <div className="flex items-center rounded-2xl border border-white/10 bg-slate-900/90 p-1.5">
              <button
                onClick={() => setTimeRange("7d")}
                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  timeRange === "7d"
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  timeRange === "30d"
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total XP Velocity</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Zap className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">{totalXP.toLocaleString()}</p>
            <p className="mt-1 text-xs text-cyan-300 font-medium">Level {currentLevel}: {levelTitle}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Quiz Precision</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">{quizStats.averageScore || 0}%</p>
            <p className="mt-1 text-xs text-emerald-400 font-medium">
              {passedQuizzes} Passed • {quizStats.totalAttempts || 0} Total Attempts
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Challenge Solve Rate</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Code2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">{challengeStats.successRate || 0}%</p>
            <p className="mt-1 text-xs text-violet-300 font-medium">
              {solvedChallenges} Solved • {challengeStats.totalSubmissions || 0} Submissions
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Streak</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">{streakDays} Days</p>
            <p className="mt-1 text-xs text-amber-300 font-medium">Continuous learning momentum</p>
          </div>
        </div>

        {/* Activity Histogram & Timeline */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-7 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-semibold">
                <Activity className="h-4 w-4" />
                <span>Velocity Trends</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {timeRange === "7d" ? "7-Day" : "30-Day"} Activity Heatmap
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Updated Live
            </span>
          </div>

          {/* Activity Bars */}
          <div className="grid grid-cols-7 sm:grid-cols-7 gap-2 sm:gap-4 pt-4">
            {(activityDays.length > 0
              ? activityDays
              : Array.from({ length: timeRange === "7d" ? 7 : 14 }).map((_, i) => ({
                  day: `Day ${i + 1}`,
                  date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
                  xp: i === 6 ? 150 : 0,
                  events: i === 6 ? 1 : 0,
                }))
            ).slice(-7).map((item: any, idx: number) => {
              const heightPct = Math.min(100, Math.max(15, ((item.xp || item.events * 50 || 0) / 300) * 100));
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="h-36 w-full rounded-2xl bg-slate-900/80 border border-white/5 p-1 flex flex-col justify-end">
                    <div
                      className="w-full rounded-xl bg-gradient-to-t from-cyan-500 to-teal-400 transition-all duration-500 shadow-md shadow-cyan-500/20"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{item.date || item.day}</span>
                  <span className="text-[10px] font-mono text-cyan-300">+{item.xp || 0} XP</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Language Stack Mastery Distribution */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-semibold">
                <Layers className="h-4 w-4" />
                <span>11 Backend Stacks Telemetry</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Competency Distribution
              </h3>
            </div>
            <Link
              href="/progress"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>View Full Progress Hub</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {languageStats.map((item) => (
              <div
                key={item.slug}
                className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-xl backdrop-blur-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Code2 className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    {item.progressPercentage || 0}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-white/5">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                    style={{ width: `${item.progressPercentage || 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                  <span>{item.completedLessons || 0} / {item.totalLessons || 0} Lessons</span>
                  <span>Level: {item.currentLevel || "Beginner"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
