"use client";

import React, { useState, useEffect, useMemo } from "react";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import ChallengeFilters from "@/components/challenges/ChallengeFilters";
import { api } from "@/lib/api";
import { Terminal, Code2, Trophy, Layers } from "lucide-react";
import type { CodingChallengeSummary } from "@/lib/challenge-types";

export default function ChallengesCatalogPage() {
  const [challenges, setChallenges] = useState<CodingChallengeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const json = await api.get("/api/challenges");
        if (json.success && json.data?.challenges) {
          setChallenges(json.data.challenges);
        } else {
          setError(json.error || "Failed to load coding challenges");
        }
      } catch (err: any) {
        console.error("Fetch challenges error:", err);
        setError(err.message || "Network error loading challenges");
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add("All");
    challenges.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      // Language filter
      if (selectedLanguage !== "All") {
        const langLower = selectedLanguage.toLowerCase();
        const supported = (c.supportedLanguages || []).map((l) => l.toLowerCase());
        const primaryLang = (c.language || "").toLowerCase();
        if (!supported.includes(langLower) && primaryLang !== langLower) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "All" && c.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (
        selectedDifficulty !== "All" &&
        c.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchCat = c.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      return true;
    });
  }, [challenges, selectedLanguage, selectedCategory, selectedDifficulty, searchQuery]);

  const totalXP = useMemo(() => {
    return challenges.reduce((acc, c) => acc + (c.xpReward || 50), 0);
  }, [challenges]);

  const completedCount = useMemo(() => {
    return challenges.filter((c) => c.isCompleted).length;
  }, [challenges]);

  return (
    <div className="min-h-screen bg-[#060813] px-4 py-24 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-[#070913] p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-mono font-medium text-cyan-300 uppercase tracking-widest">
                <Terminal className="h-3.5 w-3.5" />
                <span>32+ Production Challenges</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Backend Coding Challenges
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Master production backend engineering patterns across 11 language stacks: rate limiters, circuit breakers, JWT verifiers, connection pools, and distributed saga coordinators.
              </p>
            </div>

            {/* Quick Challenge Stats */}
            <div className="flex gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-md text-center min-w-[110px]">
                <p className="text-2xl font-extrabold text-cyan-400">{challenges.length}</p>
                <p className="text-[11px] text-slate-400 font-mono uppercase mt-1">Challenges</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-md text-center min-w-[110px]">
                <p className="text-2xl font-extrabold text-amber-400">{totalXP.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 font-mono uppercase mt-1">Available XP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Coding Workspace Launcher Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Full-Screen Coding Workspace</h3>
              <p className="text-xs text-slate-400">Open the 3-panel Monaco Editor environment with AI Mentor and Web Worker execution.</p>
            </div>
          </div>

          <a
            href="/workspace"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 text-xs font-bold transition shrink-0 shadow-lg shadow-cyan-500/20"
          >
            <span>Launch Workspace</span>
            <Terminal className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Filters */}
        <ChallengeFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Challenge Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-flex items-center gap-3 text-cyan-400 font-mono text-sm">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <span>Loading Backend Challenges...</span>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-8 text-center text-rose-300">
            <p className="font-semibold">{error}</p>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-slate-950/40 py-20 text-center text-slate-400">
            <Code2 className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <p className="text-lg font-semibold text-slate-300">No challenges match the active filters</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the difficulty or stack filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id || challenge.slug} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
