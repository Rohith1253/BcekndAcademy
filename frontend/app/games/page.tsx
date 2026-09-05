"use client";

import React, { useEffect, useState } from "react";
import {
  Gamepad2,
  Search,
  Filter,
  Sparkles,
  Trophy,
  Award,
  Clock,
  ArrowRight,
  Shield,
  Database,
  Terminal,
  Server,
  Bug,
  Lock,
} from "lucide-react";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import Footer from "@/components/Footer";

export default function GamesHubPage() {
  const { user } = useClient();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadGames() {
      try {
        const json = await api.get("/api/games");
        if (json.success && json.data?.games) {
          setGames(json.data.games);
        }
      } catch (err) {
        console.error("Fetch games error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [user]);

  const categories = [
    "All",
    "HTTP & APIs",
    "Express & Routing",
    "Database",
    "Authentication",
    "Debugging",
    "Security",
  ];

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredGames = games.filter((game) => {
    const cat = game.category || "";
    const matchesCategory =
      selectedCategory === "All" || cat.toLowerCase() === selectedCategory.toLowerCase();

    const diff = (game.difficulty || "").toLowerCase();
    const matchesDifficulty =
      selectedDifficulty === "All" || diff === selectedDifficulty.toLowerCase();

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      game.title?.toLowerCase().includes(query) ||
      game.description?.toLowerCase().includes(query) ||
      cat.toLowerCase().includes(query);

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getGameIcon = (gameType: string) => {
    switch (gameType) {
      case "http-status":
      case "api-flow":
        return <Server className="w-5 h-5 text-cyan-400" />;
      case "route-matcher":
      case "middleware-maze":
        return <Terminal className="w-5 h-5 text-indigo-400" />;
      case "database-puzzle":
        return <Database className="w-5 h-5 text-emerald-400" />;
      case "jwt-flow":
      case "security-defender":
        return <Shield className="w-5 h-5 text-fuchsia-400" />;
      case "bug-hunter":
        return <Bug className="w-5 h-5 text-rose-400" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getStarBadge = (stars: string) => {
    switch (stars) {
      case "gold":
        return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20"><Trophy className="w-3 h-3" /> Gold</span>;
      case "silver":
        return <span className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-300/10 px-2 py-0.5 rounded border border-slate-300/20"><Award className="w-3 h-3" /> Silver</span>;
      case "bronze":
        return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-600/10 px-2 py-0.5 rounded border border-amber-600/20"><Award className="w-3 h-3" /> Bronze</span>;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      <AnimatedBackground />

      <div className="relative z-10 pt-8 sm:pt-10 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Interactive Backend Learning Games</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Learn Backend Concepts —{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                By Playing.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Reinforce your knowledge of HTTP status codes, Express middleware pipelines, MongoDB query optimization, JWT authentication, and security defenses through hands-on interactive challenges.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  aria-label="Search educational games"
                  placeholder="Search games, concepts, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/70 border border-white/[0.12] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Showing <span className="text-cyan-400 font-bold">{filteredGames.length}</span> of{" "}
                <span className="text-white font-bold">{games.length}</span> games
              </div>
            </div>

            {/* Category & Difficulty Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-white/[0.06]">
              <div className="flex flex-wrap items-center gap-1.5 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Category:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "bg-slate-950/60 text-slate-400 border border-white/[0.06] hover:border-white/20 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
                  Difficulty:
                </span>
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      selectedDifficulty === diff
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                        : "bg-slate-950/60 text-slate-400 border border-white/[0.06] hover:border-white/20 hover:text-slate-200"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Games Grid */}
          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-slate-400 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <p className="text-xs font-medium uppercase tracking-wider">Loading Educational Games...</p>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="rounded-[24px] border border-white/[0.1] bg-white/[0.03] p-12 text-center text-slate-400 backdrop-blur-xl space-y-4">
              <p className="text-lg font-semibold text-white">No games match your search criteria.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-5 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map((game) => {
                const prog = game.progress || {};
                const isCompleted = prog.completed;

                return (
                  <div
                    key={game.id}
                    className="group rounded-[24px] border border-white/[0.12] bg-white/[0.04] p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/[0.07] hover:scale-[1.01]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 border border-white/10 group-hover:border-cyan-400/40 transition">
                            {getGameIcon(game.gameType)}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                              {game.category}
                            </span>
                            <span className="text-[11px] text-slate-400 capitalize font-medium">
                              {game.difficulty}
                            </span>
                          </div>
                        </div>

                        {isCompleted && getStarBadge(prog.stars)}
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {game.title}
                      </h3>

                      <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {game.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>~{game.estimatedMinutes} mins</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                          <span>+{game.xpReward} XP</span>
                        </div>
                      </div>

                      <a
                        href={`/games/${game.id}`}
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                          isCompleted
                            ? "bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:bg-slate-850"
                            : "bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 text-slate-950 shadow-md hover:scale-[1.01]"
                        }`}
                      >
                        <span>{isCompleted ? "Play Again (Replay)" : "Play Game"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
