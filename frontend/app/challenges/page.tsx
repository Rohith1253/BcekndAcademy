"use client";

import React, { useState, useEffect, useMemo } from "react";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import ChallengeFilters from "@/components/challenges/ChallengeFilters";
import { api } from "@/lib/api";
import { Terminal, Sparkles, Code2 } from "lucide-react";
import type { CodingChallengeSummary } from "@/lib/challenge-types";

export default function ChallengesCatalogPage() {
  const [challenges, setChallenges] = useState<CodingChallengeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
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
  }, [challenges, selectedCategory, selectedDifficulty, searchQuery]);

  return (
    <div className="min-h-screen bg-[#060813] px-4 py-24 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-[#070913] p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-mono font-medium text-cyan-300 uppercase tracking-widest">
              <Terminal className="h-3.5 w-3.5" />
              <span>Interactive Coding System</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Practice Backend Development
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Write real code. Run tests. Build backend skills. Solve realistic Node.js, Express, REST API, MongoDB, and Authentication challenges directly in your browser.
            </p>
          </div>
        </div>

        {/* Filters */}
        <ChallengeFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content State */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Loading challenge library...
            </span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center space-y-3">
            <h3 className="text-lg font-bold text-rose-400">Failed to Load Challenges</h3>
            <p className="text-xs text-slate-400 font-mono">{error}</p>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/40 p-12 text-center space-y-3">
            <Code2 className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Challenges Match Your Filters</h3>
            <p className="text-xs text-slate-400">Try clearing your search query or selecting a different category.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge._id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
