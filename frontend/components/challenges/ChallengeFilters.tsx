"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

interface ChallengeFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (diff: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function ChallengeFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  searchQuery,
  onSearchChange,
}: ChallengeFiltersProps) {
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  return (
    <div className="space-y-4">
      {/* Search and Difficulty Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search coding challenges..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition"
          />
        </div>

        {/* Difficulty Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-white/10 bg-slate-900/60 w-full sm:w-auto overflow-x-auto">
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => onSelectDifficulty(diff)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedDifficulty.toLowerCase() === diff.toLowerCase()
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Category Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
        <span className="flex items-center gap-1 text-xs font-mono text-slate-500 shrink-0 mr-1">
          <Filter className="w-3 h-3" /> Categories:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              selectedCategory === cat
                ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                : "border border-white/[0.06] bg-slate-900/40 text-slate-400 hover:border-white/10 hover:text-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
