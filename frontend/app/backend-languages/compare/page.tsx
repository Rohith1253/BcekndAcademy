"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GitCompare,
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
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers as ArchitectureIcon,
  BookOpen,
} from "lucide-react";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import Footer from "@/components/Footer";
import { BACKEND_LANGUAGES, BackendLanguage, getBackendLanguage } from "@/lib/backend-languages";
import { LANGUAGE_COMPARISON_METRICS, getComparisonPair } from "@/lib/language-comparisons";
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

function CompareComponent() {
  const searchParams = useSearchParams();
  const initialLang1 = searchParams.get("lang1") || "go";
  const initialLang2 = searchParams.get("lang2") || "rust";

  const [lang1Slug, setLang1Slug] = useState(initialLang1);
  const [lang2Slug, setLang2Slug] = useState(initialLang2);

  const lang1 = getBackendLanguage(lang1Slug) || BACKEND_LANGUAGES[5]; // Go fallback
  const lang2 = getBackendLanguage(lang2Slug) || BACKEND_LANGUAGES[7]; // Rust fallback

  const comparison = useMemo(() => {
    return getComparisonPair(lang1.slug, lang2.slug);
  }, [lang1.slug, lang2.slug]);

  const badge1 = getLanguageColorBadge(lang1.slug);
  const badge2 = getLanguageColorBadge(lang2.slug);

  const Icon1 = ICON_MAP[lang1.icon] || Code2;
  const Icon2 = ICON_MAP[lang2.icon] || Code2;

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link href="/backend-languages" className="hover:text-cyan-400 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Languages</span>
        </Link>
        <span>/</span>
        <span className="text-slate-200">Language Architecture Comparison</span>
      </div>

      {/* ================= HERO HEADER ================= */}
      <section className="relative rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 sm:p-10 backdrop-blur-md overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Architectural Head-to-Head</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Compare Backend Architectures
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Evaluate performance throughput, concurrency models, developer velocity, and package ecosystems side-by-side to make the right engineering choice for your platform.
          </p>
        </div>

        {/* Dual Language Selector Controls */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/[0.08]">
          {/* Language 1 Select */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <span>Select Primary Language:</span>
            </label>
            <select
              value={lang1Slug}
              onChange={(e) => setLang1Slug(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-cyan-400 transition cursor-pointer"
            >
              {BACKEND_LANGUAGES.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name} ({l.typing} - {l.primaryFrameworks[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Language 2 Select */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
              <span>Select Comparison Language:</span>
            </label>
            <select
              value={lang2Slug}
              onChange={(e) => setLang2Slug(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-indigo-400 transition cursor-pointer"
            >
              {BACKEND_LANGUAGES.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name} ({l.typing} - {l.primaryFrameworks[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ================= DUAL CARDS OVERVIEW ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language 1 Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${badge1.bg} border ${badge1.border} ${badge1.text}`}>
                <Icon1 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{lang1.name}</h2>
                <p className="text-xs text-cyan-400 font-medium">{lang1.tagline}</p>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badge1.bg} border ${badge1.border} ${badge1.text}`}>
              {lang1.typing}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {lang1.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/[0.06]">
              <span className="text-slate-500 font-bold uppercase text-[9px] block">Runtime</span>
              <span className="text-slate-200 font-semibold">{lang1.runtimeOrCompiler}</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/[0.06]">
              <span className="text-slate-500 font-bold uppercase text-[9px] block">Concurrency</span>
              <span className="text-slate-200 font-semibold">{lang1.concurrencyModel}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={`/backend-languages/${lang1.slug}`}
              className="flex items-center justify-between w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <span>Explore {lang1.name} Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Language 2 Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${badge2.bg} border ${badge2.border} ${badge2.text}`}>
                <Icon2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{lang2.name}</h2>
                <p className="text-xs text-indigo-400 font-medium">{lang2.tagline}</p>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badge2.bg} border ${badge2.border} ${badge2.text}`}>
              {lang2.typing}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {lang2.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/[0.06]">
              <span className="text-slate-500 font-bold uppercase text-[9px] block">Runtime</span>
              <span className="text-slate-200 font-semibold">{lang2.runtimeOrCompiler}</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/[0.06]">
              <span className="text-slate-500 font-bold uppercase text-[9px] block">Concurrency</span>
              <span className="text-slate-200 font-semibold">{lang2.concurrencyModel}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={`/backend-languages/${lang2.slug}`}
              className="flex items-center justify-between w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <span>Explore {lang2.name} Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ARCHITECTURAL BENCHMARK RATINGS ================= */}
      <section className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 sm:p-10 space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Head-to-Head Comparison Matrix
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Architectural Metrics Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ratings based on real production characteristics and engineering benchmarks.
          </p>
        </div>

        <div className="space-y-6">
          {comparison.metrics.map((m, idx) => (
            <div key={idx} className="rounded-xl border border-white/[0.08] bg-slate-900/90 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
                    {m.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{m.metric}</h3>
                </div>
                <p className="text-xs text-slate-400 sm:text-right max-w-sm">{m.description}</p>
              </div>

              {/* Progress Bar Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                {/* Lang 1 Metric */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300">{lang1.name}: {m.rating1?.label || "Good"}</span>
                    <span className="font-mono font-bold text-slate-300">{m.rating1?.score || 7}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-white/[0.06]">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${(m.rating1?.score || 7) * 10}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {m.rating1?.details || "Solid standard performance."}
                  </p>
                </div>

                {/* Lang 2 Metric */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300">{lang2.name}: {m.rating2?.label || "Good"}</span>
                    <span className="font-mono font-bold text-slate-300">{m.rating2?.score || 7}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-white/[0.06]">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${(m.rating2?.score || 7) * 10}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {m.rating2?.details || "Solid standard performance."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= VERDICT & WHEN TO CHOOSE GUIDE ================= */}
      <section className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 sm:p-10 space-y-8">
        {/* Overview and Verdict */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>Architectural Synthesis</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Engineering Verdict</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {comparison.summary.overview}
          </p>
          <div className="rounded-xl bg-cyan-950/20 border border-cyan-500/30 p-4 text-xs font-medium text-cyan-200 leading-relaxed">
            <span className="font-bold text-cyan-300">Recommendation: </span>
            {comparison.summary.verdict}
          </div>
        </div>

        {/* When to choose each language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/[0.08]">
          <div className="rounded-xl bg-slate-950/80 border border-cyan-500/30 p-5 space-y-3">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>When to Choose {lang1.name}</span>
            </h3>
            <ul className="space-y-2">
              {comparison.summary.whenToChooseFirst.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-950/80 border border-indigo-500/30 p-5 space-y-3">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>When to Choose {lang2.name}</span>
            </h3>
            <ul className="space-y-2">
              {comparison.summary.whenToChooseSecond.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CompareLanguagesPage() {
  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <AnimatedBackground />
      <div className="relative z-10 pt-8 sm:pt-10 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={
            <div className="flex min-h-[320px] flex-col items-center justify-center text-slate-400 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <p className="text-xs font-mono">Loading comparison matrix...</p>
            </div>
          }>
            <CompareComponent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
