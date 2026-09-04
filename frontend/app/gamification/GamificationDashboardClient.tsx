"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Flame, Target, Sparkles, Award, TrendingUp, CheckCircle2,
  Clock, ArrowRight, Zap, Bell, Check, BookOpen, Code2, HelpCircle,
  Shield, Brain, AlertTriangle, ChevronRight, Lock
} from "lucide-react";
import { useClient } from "@/lib/store";
import { getApiUrl } from "@/lib/http";
import { api } from "@/lib/api";

export default function GamificationDashboardClient() {
  const { user, refreshUser } = useClient();
  const [data, setData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    async function fetchGamificationData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const [summaryRes, recRes] = await Promise.all([
          fetch(getApiUrl("/api/gamification/summary"), { credentials: "include" }),
          fetch(getApiUrl("/api/recommendations"), { credentials: "include" }),
        ]);

        const summaryJson = await summaryRes.json();
        const recJson = await recRes.json();

        if (summaryJson.success) {
          setData(summaryJson.data);
        } else {
          setError(summaryJson.error || "Failed to load gamification data");
        }

        if (recJson.success) {
          setRecommendations(recJson.data);
        }
      } catch (err: any) {
        setError(err.message || "Network error loading data");
      } finally {
        setLoading(false);
      }
    }

    fetchGamificationData();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/api/notifications/${id}/read`, {});
      setData((prev: any) => {
        if (!prev) return prev;
        const updated = prev.notifications?.notifications?.map((n: any) =>
          n._id === id ? { ...n, isRead: true } : n
        );
        const unreadCount = Math.max(0, (prev.notifications?.unreadCount || 1) - 1);
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            notifications: updated,
            unreadCount,
          },
        };
      });
    } catch (e) {
      console.error("Mark read error:", e);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await api.patch("/api/notifications/read-all", {});
      setData((prev: any) => {
        if (!prev) return prev;
        const updated = prev.notifications?.notifications?.map((n: any) => ({ ...n, isRead: true }));
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            notifications: updated,
            unreadCount: 0,
          },
        };
      });
    } catch (e) {
      console.error("Mark all read error:", e);
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span>Loading gamification engine & personal stats...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-20 text-center text-white flex flex-col items-center justify-center">
        <Trophy className="h-16 w-16 text-violet-400 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold">Gamification & Progression</h1>
        <p className="mt-2 max-w-md text-slate-400">
          Sign in or create an account to track your level progression, daily streaks, personal goals, and adaptive recommendations.
        </p>
        <a
          href="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold text-slate-950 shadow-lg"
        >
          Sign In to Track Progress
        </a>
      </div>
    );
  }

  const levelInfo = data?.levelInfo || {
    level: 1,
    title: "Backend Novice",
    totalXP: 0,
    currentLevelXP: 0,
    xpForNextLevel: 100,
    progressPercentage: 0,
    nextTitle: "Syntax Apprentice",
  };

  const streak = data?.streak || { currentStreak: 0, longestStreak: 0, totalActiveDays: 0, isActiveToday: false };
  const dailyChallenge = data?.dailyChallenge;
  const dailyGoals = data?.dailyGoals;
  const adaptiveProfile = data?.adaptiveProfile;
  const milestones = data?.milestones || [];
  const notifications = data?.notifications?.notifications || [];
  const unreadCount = data?.notifications?.unreadCount || 0;

  const filteredMilestones =
    activeCategory === "all" ? milestones : milestones.filter((m: any) => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
              <Sparkles className="h-4 w-4" />
              <span>Personalized Learning & Gamification Hub</span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Welcome back, {user.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-xs font-semibold text-cyan-300 flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>{levelInfo.totalXP} Total XP</span>
            </span>
            <span className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-xs font-semibold text-amber-400 flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streak.currentStreak} Day Streak</span>
            </span>
          </div>
        </div>

        {/* Top Grid: Level Progression + Streak Card + Daily Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Level Progress Card */}
          <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950 to-violet-950/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Level Progression
              </span>
              <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 border border-violet-500/30">
                Level {levelInfo.level}
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{levelInfo.title}</h2>
              <p className="text-xs text-slate-400 mt-1">Next rank: {levelInfo.nextTitle}</p>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Progress to Level {levelInfo.level + 1}</span>
                <span className="font-mono text-cyan-400 font-bold">{levelInfo.progressPercentage}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>{levelInfo.currentLevelXP} XP in level</span>
                <span>{levelInfo.neededXP} XP needed</span>
              </div>
            </div>
          </div>

          {/* Daily Streak Card */}
          <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Daily Streak</span>
                <Flame className="h-6 w-6 text-amber-500 fill-amber-500 animate-pulse" />
              </div>

              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">{streak.currentStreak}</span>
                  <span className="text-sm font-semibold text-slate-400">days active</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {streak.isActiveToday ? "✓ Logged learning activity today!" : "Complete a lesson or challenge today to keep the flame burning."}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Longest Streak: <strong className="text-white">{streak.longestStreak} days</strong></span>
              <span>Total Active: <strong className="text-white">{streak.totalActiveDays} days</strong></span>
            </div>
          </div>

          {/* Daily Goals Card */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Today&apos;s Goals</span>
                <span className="text-xs font-semibold text-emerald-400 font-mono">
                  {dailyGoals?.completedCount || 0}/{dailyGoals?.totalGoals || 3} Completed
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {dailyGoals?.goals?.map((g: any) => (
                  <div key={g.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      {g.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span className={g.completed ? "text-slate-300 line-through" : "text-white font-medium"}>
                        {g.title}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {g.current}/{g.target} {g.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Resets daily at 00:00 UTC</span>
              {dailyGoals?.allCompleted && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" /> All Done!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Middle Grid: Daily Challenge + Adaptive Learning Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Challenge Widget */}
          {dailyChallenge && (
            <div className="lg:col-span-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-cyan-950/20 to-slate-950 p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Daily Challenge of the Day
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-cyan-300 border border-cyan-500/30">
                    {dailyChallenge.difficulty}
                  </span>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/30">
                    +{dailyChallenge.bonusXP} Bonus XP
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{dailyChallenge.challenge?.title}</h3>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2">{dailyChallenge.challenge?.description}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="text-xs text-slate-400">
                  <span>Language: <strong className="text-white uppercase">{dailyChallenge.challenge?.language}</strong></span>
                  <span className="mx-2">&bull;</span>
                  <span>Base Reward: <strong className="text-cyan-300">+{dailyChallenge.xpReward} XP</strong></span>
                </div>

                {dailyChallenge.alreadyCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Check className="h-4 w-4" /> Completed Today
                  </span>
                ) : (
                  <a
                    href={`/challenges/${dailyChallenge.challenge?.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:opacity-90 transition shadow-md"
                  >
                    <span>Solve Challenge</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Adaptive Learning Profile */}
          {adaptiveProfile && (
            <div className="lg:col-span-6 rounded-3xl border border-violet-500/20 bg-gradient-to-br from-slate-900/90 via-violet-950/20 to-slate-950 p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-violet-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                    Adaptive Skill & Difficulty Profile
                  </span>
                </div>
                <span className="rounded-full bg-violet-500/20 px-3 py-0.5 text-xs font-semibold uppercase text-violet-300 border border-violet-500/30">
                  Target: {adaptiveProfile.recommendedDifficulty}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="rounded-xl bg-slate-950/60 p-3 border border-white/5 text-center">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Success Rate</div>
                  <div className="mt-1 text-xl font-bold text-cyan-300">{adaptiveProfile.successRate}%</div>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-3 border border-white/5 text-center">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Quiz Avg</div>
                  <div className="mt-1 text-xl font-bold text-violet-300">{adaptiveProfile.avgQuizScore}%</div>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-3 border border-white/5 text-center">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Confidence</div>
                  <div className="mt-1 text-xl font-bold text-emerald-300">{adaptiveProfile.confidenceScore}%</div>
                </div>
              </div>

              {adaptiveProfile.suggestedActions?.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs text-slate-300 font-medium">{adaptiveProfile.suggestedActions[0].title}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{adaptiveProfile.suggestedActions[0].description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Personalized Recommendations Section */}
        {recommendations && (
          <section className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Tailored For You</p>
              <h2 className="text-2xl font-bold text-white mt-1">Personalized Learning Next Steps</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Continue Current Course */}
              {recommendations.continueLearning && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase">
                    <BookOpen className="h-4 w-4" />
                    <span>In-Progress Course</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{recommendations.continueLearning.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{recommendations.continueLearning.description}</p>
                  <a
                    href={`/courses/${recommendations.continueLearning.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition pt-2"
                  >
                    <span>Resume Course</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {/* 2. Recommended Next Course */}
              {recommendations.recommendedCourse && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase">
                    <Sparkles className="h-4 w-4" />
                    <span>Recommended Next Course</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{recommendations.recommendedCourse.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{recommendations.recommendedCourse.description}</p>
                  <a
                    href={`/courses/${recommendations.recommendedCourse.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-violet-200 transition pt-2"
                  >
                    <span>Explore Syllabus</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {/* 3. Recommended Practice Challenge */}
              {recommendations.practiceChallenges?.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase">
                    <Code2 className="h-4 w-4" />
                    <span>Recommended Practice</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{recommendations.practiceChallenges[0].title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{recommendations.practiceChallenges[0].description}</p>
                  <a
                    href={`/challenges/${recommendations.practiceChallenges[0].slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition pt-2"
                  >
                    <span>Practice Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Milestones & Achievements Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Badges & Progression</p>
              <h2 className="text-2xl font-bold text-white mt-1">Milestones Catalog</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              {["all", "xp", "lessons", "challenges", "quizzes", "streak"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition ${
                    activeCategory === cat
                      ? "bg-violet-500 text-slate-950 shadow-md"
                      : "bg-slate-900 text-slate-300 border border-white/10 hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMilestones.map((m: any) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition space-y-3 ${
                  m.completed
                    ? "border-emerald-500/30 bg-emerald-950/20"
                    : "border-white/10 bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-400 font-mono">{m.category}</span>
                  <span className="text-xs font-semibold text-amber-300">+{m.xpReward} XP</span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    {m.completed && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                    <span>{m.title}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>
                </div>

                <div className="space-y-1 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Progress</span>
                    <span className="font-mono">{m.current}/{m.target}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        m.completed ? "bg-emerald-400" : "bg-violet-500"
                      }`}
                      style={{ width: `${m.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* In-App Notifications Drawer */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Recent Notifications</h2>
              {unreadCount > 0 && (
                <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 text-xs font-semibold font-mono">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="text-xs text-slate-400 hover:text-white transition disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="space-y-2">
            {notifications.length > 0 ? (
              notifications.map((n: any) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition cursor-pointer ${
                    n.isRead
                      ? "border-white/5 bg-slate-900/40 text-slate-400"
                      : "border-cyan-500/30 bg-cyan-950/20 text-slate-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      {!n.isRead && <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />}
                      <span>{n.title}</span>
                    </div>
                    <p className="text-xs text-slate-300">{n.message}</p>
                    <span className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(n._id);
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 shrink-0"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No notifications yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
