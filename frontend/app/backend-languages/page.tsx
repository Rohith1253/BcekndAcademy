"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Code2,
  Cpu,
  FileCode2,
  Coffee,
  Hash,
  Zap,
  Layers,
  ShieldAlert,
  Gem,
  Compass,
  Activity,
  Search,
  Filter,
  ArrowRight,
  GitCompare,
  Layers as ArchitectureIcon,
  CheckCircle2,
  X,
  BookOpen,
  Terminal,
  FileText
} from "lucide-react";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import Footer from "@/components/Footer";
import { BACKEND_LANGUAGES, BackendLanguage } from "@/lib/backend-languages";
import { getLanguageColorBadge } from "@/components/courses/course-theme";

const ICON_MAP: Record<string, any> = {
  Code2,
  Cpu,
  FileCode2,
  Coffee,
  Hash,
  Zap,
  Layers,
  ShieldAlert,
  Gem,
  Compass,
  Activity,
};

export default function BackendLanguagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedTyping, setSelectedTyping] = useState("All");

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
  const typingOptions = ["All", "Static", "Dynamic", "Gradual"];

  const filteredLanguages = useMemo(() => {
    return BACKEND_LANGUAGES.filter((lang) => {
      const matchesDiff =
        selectedDifficulty === "All" ||
        lang.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchesTyping =
        selectedTyping === "All" ||
        lang.typing.toLowerCase() === selectedTyping.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        lang.name.toLowerCase().includes(q) ||
        lang.tagline.toLowerCase().includes(q) ||
        lang.description.toLowerCase().includes(q) ||
        lang.primaryFrameworks.some((f) => f.toLowerCase().includes(q)) ||
        lang.useCases.some((u) => u.toLowerCase().includes(q));

      return matchesDiff && matchesTyping && matchesSearch;
    });
  }, [searchQuery, selectedDifficulty, selectedTyping]);

  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <AnimatedBackground />

      <main className="relative z-10 pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* ================= HERO SECTION ================= */}
          <section className="relative rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 sm:p-10 backdrop-blur-md overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>Multi-Language Backend Engineering</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Master 10 Industry-Standard <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">
                  Backend Languages & Frameworks
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Every language solves specific backend engineering challenges: high I/O throughput, low-latency microservices, bare-metal memory safety, or rapid startup MVP prototyping. Choose your stack and follow authentic production roadmaps.
              </p>

              {/* Learning Progression Stepper */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-slate-300 flex flex-wrap items-center gap-2">
                <span className="font-bold text-cyan-400 uppercase text-[10px] tracking-wider">Recommended Flow:</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">1. Level 0 Foundations</span>
                <span className="text-slate-600">→</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">2. Universal Programming Logic</span>
                <span className="text-slate-600">→</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">3. Select Language Stack Below</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/backend-languages/compare"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-indigo-500 transition shadow-md shadow-cyan-500/20"
                >
                  <GitCompare className="w-4 h-4" />
                  <span>Compare All Languages</span>
                </Link>

                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse All 26 Courses</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/[0.08]">
              <div className="rounded-xl bg-slate-950/60 border border-white/[0.06] p-3 text-center">
                <p className="text-xl font-bold font-mono text-cyan-400">11</p>
                <p className="text-[11px] text-slate-400 font-medium">Languages & Stacks</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 border border-white/[0.06] p-3 text-center">
                <p className="text-xl font-bold font-mono text-indigo-400">26</p>
                <p className="text-[11px] text-slate-400 font-medium">Structured Courses</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 border border-white/[0.06] p-3 text-center">
                <p className="text-xl font-bold font-mono text-emerald-400">85+</p>
                <p className="text-[11px] text-slate-400 font-medium">Interactive Lessons</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 border border-white/[0.06] p-3 text-center">
                <p className="text-xl font-bold font-mono text-fuchsia-400">100%</p>
                <p className="text-[11px] text-slate-400 font-medium">Production Architectures</p>
              </div>
            </div>
          </section>

          {/* ================= FILTERS & SEARCH ================= */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Explore Backend Technology Matrix
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filter by runtime typing paradigm, difficulty tier, or search specific frameworks.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  aria-label="Search backend languages"
                  placeholder="Search by language, framework, or use case..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/90 border border-white/[0.12] pl-10 pr-9 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/25"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter buttons */}
            <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
              {/* Difficulty Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                  <Filter className="w-3 h-3" />
                  Difficulty:
                </span>
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer shrink-0 ${
                      selectedDifficulty === diff
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "bg-slate-900/80 text-slate-400 border border-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {/* Typing Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                  <ArchitectureIcon className="w-3 h-3" />
                  Typing:
                </span>
                {typingOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedTyping(type)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer shrink-0 ${
                      selectedTyping === type
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                        : "bg-slate-900/80 text-slate-400 border border-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ================= LANGUAGES GRID ================= */}
          {filteredLanguages.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center text-slate-400 space-y-4">
              <Code2 className="mx-auto h-10 w-10 text-slate-500" />
              <p className="text-lg font-bold text-white">No languages match your filters</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try searching for another framework or resetting your difficulty and typing filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDifficulty("All");
                  setSelectedTyping("All");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-5 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredLanguages.map((lang) => {
                const IconComponent = ICON_MAP[lang.icon] || Code2;
                const badgeTheme = getLanguageColorBadge(lang.slug);

                return (
                  <div
                    key={lang.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-slate-900/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/40 hover:shadow-cyan-500/10"
                  >
                    <div>
                      {/* Card Top Row */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${badgeTheme.bg} border ${badgeTheme.border} ${badgeTheme.text} shadow-md transition-transform duration-300 group-hover:scale-105`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 justify-end">
                          {lang.slug === "javascript" ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                              <Terminal className="w-3 h-3 text-emerald-400" />
                              Interactive
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-300 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-md">
                              <FileText className="w-3 h-3 text-slate-400" />
                              Guide
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeTheme.bg} border ${badgeTheme.border} ${badgeTheme.text}`}
                          >
                            {lang.typing}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/[0.08]">
                            {lang.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Language Title & Tagline */}
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {lang.name}
                      </h3>
                      <p className="text-xs font-medium text-cyan-400 mt-1 line-clamp-1">
                        {lang.tagline}
                      </p>

                      {/* Description */}
                      <p className="mt-3 text-xs text-slate-300/90 leading-relaxed line-clamp-3">
                        {lang.description}
                      </p>

                      {/* Frameworks Badges */}
                      <div className="mt-4 pt-3 border-t border-white/[0.06]">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                          Key Frameworks:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {lang.primaryFrameworks.map((fw) => (
                            <span
                              key={fw}
                              className="text-[11px] font-medium text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/[0.08]"
                            >
                              {fw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Primary Use Cases */}
                      <div className="mt-3">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                          Ideal Use Cases:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {lang.useCases.slice(0, 3).map((uc) => (
                            <span
                              key={uc}
                              className="text-[10px] text-slate-400 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.06]"
                            >
                              • {uc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Concurrency Info */}
                      <div className="mt-3 text-[11px] text-slate-400 bg-slate-950/60 rounded-lg p-2.5 border border-white/[0.06]">
                        <span className="text-slate-300 font-semibold">Concurrency: </span>
                        <span>{lang.concurrencyModel}</span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2">
                      <Link
                        href={`/backend-languages/${lang.slug}`}
                        className="flex-1 flex items-center justify-between rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 hover:border-cyan-400/40 transition group-hover:border-cyan-500/30"
                      >
                        <span>Roadmap & Courses</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>

                      <Link
                        href={`/backend-languages/compare?lang1=${lang.slug}`}
                        title={`Compare ${lang.name} with another language`}
                        className="flex items-center justify-center rounded-xl bg-slate-950 border border-white/10 p-2.5 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition"
                      >
                        <GitCompare className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= ARCHITECTURAL DECISION MATRIX BANNER ================= */}
          <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-8 sm:p-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center lg:text-left max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Architectural Decision Guide</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Which Backend Language Should You Choose?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Compare throughput, raw latency, concurrency models, and ecosystem packages side-by-side between any two backend technologies.
                </p>
              </div>

              <Link
                href="/backend-languages/compare"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer"
              >
                <span>Open Comparison Matrix</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
