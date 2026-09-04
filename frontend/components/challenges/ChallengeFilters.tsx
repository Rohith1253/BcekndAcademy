"use client";

import React from "react";
import { Search, Filter, Code2 } from "lucide-react";

interface ChallengeFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (diff: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function ChallengeFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  selectedLanguage,
  onSelectLanguage,
  searchQuery,
  onSearchChange,
}: ChallengeFiltersProps) {
  const difficulties = ["All", "Beginner", "Easy", "Medium", "Hard", "Advanced"];

  const languages = [
    { label: "All Stacks", value: "All" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
    { label: "Java", value: "java" },
    { label: "C# / .NET", value: "csharp" },
    { label: "PHP", value: "php" },
    { label: "Ruby", value: "ruby" },
    { label: "Kotlin", value: "kotlin" },
    { label: "Elixir", value: "elixir" },
  ];

  return (
    <div className="space-y-4">
      {/* 11 Language Stacks Horizontal Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
        <span className="flex items-center gap-1 text-xs font-mono text-cyan-400 font-semibold shrink-0 mr-2">
          <Code2 className="w-3.5 h-3.5" /> Language Stack:
        </span>
        {languages.map((lang) => (
          <button
            key={lang.value}
            type="button"
            onClick={() => onSelectLanguage(lang.value)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
              selectedLanguage.toLowerCase() === lang.value.toLowerCase()
                ? "border border-cyan-400 bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20 hover:text-white"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Search and Difficulty Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search 32+ backend challenges..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition"
          />
        </div>

        {/* Difficulty Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-slate-900/60 w-full sm:w-auto overflow-x-auto">
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => onSelectDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
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
          <Filter className="w-3 h-3" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              selectedCategory === cat
                ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-semibold"
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
