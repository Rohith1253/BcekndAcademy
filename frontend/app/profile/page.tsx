"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import XPBar from "@/components/gamification/XPBar";
import LevelCard from "@/components/gamification/LevelCard";
import DailyStreak from "@/components/gamification/DailyStreak";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import CoinWallet from "@/components/gamification/CoinWallet";
import LeaderboardCard from "@/components/gamification/LeaderboardCard";
import RewardPopup from "@/components/gamification/RewardPopup";
import CertificateCard from "@/components/gamification/CertificateCard";
import { ArrowLeft, Settings } from "lucide-react";
import { useClient } from "@/lib/store";
import { calculateLevel, calculateXPProgress } from "@/lib/xp-backend";

export default function ProfilePage() {
  const { user, loading, error } = useClient();
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "certificates">("overview");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-rose-400">Error loading profile: {error}</p>
      </div>
    );
  }

  const userXP = user?.totalXP ?? 0;
  const userLevel = calculateLevel(userXP);
  const userCoins = user?.coins ?? 0;
  const currentStreak = user?.currentStreak ?? 0;
  const longestStreak = user?.longestStreak ?? 0;

  const xpProgress = calculateXPProgress(userXP, userLevel);

  const certificates = user?.certificates || [];
  const achievements = user?.achievements || [];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="rounded-full p-2 transition hover:bg-white/10">
                <ArrowLeft className="h-5 w-5 text-slate-300" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Your Profile</h1>
                <p className="mt-1 text-sm text-slate-400">Track your learning journey</p>
              </div>
            </div>
            <button className="rounded-full bg-white/10 p-3 transition hover:bg-white/20">
              <Settings className="h-5 w-5 text-slate-300" />
            </button>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-[2.5rem] border border-gradient-to-r from-purple-500/20 to-cyan-500/20 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="flex items-start gap-4">
                <div className="text-6xl">{user?.avatar || "👨‍💻"}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{user?.bio || "Backend learner"}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              <motion.div whileHover={{ scale: 1.02 }} className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Total XP</p>
                <p className="mt-2 text-3xl font-bold text-violet-300">{userXP.toLocaleString()}</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Lessons Completed</p>
                <p className="mt-2 text-3xl font-bold text-cyan-300">{user?.lessonsCompleted || 0}</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Achievements</p>
                <p className="mt-2 text-3xl font-bold text-emerald-300">{achievements?.length || 0}</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Rank</p>
                <p className="mt-2 text-3xl font-bold text-amber-300">#{user?.rank || "—"}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="mb-8 flex gap-4 border-b border-white/10">
          {["overview", "achievements", "certificates"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-4 font-semibold uppercase tracking-[0.22em] transition ${activeTab === tab ? "border-b-2 border-violet-500 text-white" : "text-slate-400 hover:text-white"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <LevelCard level={userLevel} nextLevel={userLevel + 1} />
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Experience Progress</p>
                <div className="mt-6">
                  <XPBar currentXP={xpProgress.currentXP} nextLevelXP={xpProgress.levelEnd} percentage={xpProgress.percentage} />
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <DailyStreak currentStreak={currentStreak} longestStreak={longestStreak} isActive={true} />
              <CoinWallet totalCoins={userCoins} />
            </div>

            <LeaderboardCard entries={[]} userRank={user?.rank || 0} />
          </motion.div>
        )}

        {activeTab === "achievements" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white">Achievements ({achievements?.length || 0})</h3>
              <p className="mt-2 text-slate-400">Complete challenges and learning tasks to unlock achievements</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {achievements?.map((achievement: any, i: number) => (
                <AchievementBadge key={achievement.achievementId || i} achievement={{...achievement, earned: true}} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "certificates" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white">Certificates</h3>
              <p className="mt-2 text-slate-400">Earn certificates by completing course modules</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {certificates.map((cert: any, i: number) => (
                <CertificateCard key={i} {...cert} />
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <RewardPopup isOpen={showRewardPopup} level={userLevel} xpGained={500} coinsGained={100} newBadges={["🏆", "⚡", "🚀"]} onClose={() => setShowRewardPopup(false)} />
    </div>
  );
}
