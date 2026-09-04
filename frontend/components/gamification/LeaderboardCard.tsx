"use client";

import { motion } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  avatar: string;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  userRank?: number;
}

const sampleLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "CodeNinja", level: 10, xp: 50000, avatar: "🥷" },
  { rank: 2, username: "DevMaster", level: 9, xp: 45000, avatar: "👨‍💻" },
  { rank: 3, username: "BackendPro", level: 9, xp: 42000, avatar: "🧑‍💼" },
  { rank: 4, username: "ApiBuilder", level: 8, xp: 38000, avatar: "🔧" },
  { rank: 5, username: "YourName", level: 6, xp: 15000, avatar: "👤" },
];

export default function LeaderboardCard({ entries = sampleLeaderboard, userRank = 5 }: LeaderboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Leaderboard</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Top Learners</h2>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => {
          const isUserRank = entry.rank === userRank;
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`rounded-[1.75rem] border-2 p-4 transition ${
                isUserRank
                  ? "border-violet-500/50 bg-violet-500/10"
                  : "border-white/10 bg-slate-900/50 hover:bg-slate-900/70"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-800/80 font-semibold text-white">
                    {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                  </div>
                  <div className="text-3xl">{entry.avatar}</div>
                  <div>
                    <p className={`font-semibold ${isUserRank ? "text-violet-300" : "text-white"}`}>
                      {entry.username}
                    </p>
                    <p className="text-sm text-slate-400">Level {entry.level}</p>
                  </div>
                </div>
                <p className="font-semibold text-cyan-300">{(entry.xp / 1000).toFixed(1)}K XP</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">Updated hourly</p>
    </motion.div>
  );
}
