"use client";

import React, { useEffect, useState, use } from "react";
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
  ArrowLeft,
  ArrowRight,
  Sparkles,
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Copy,
  Check,
  Server,
} from "lucide-react";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import Footer from "@/components/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { getBackendLanguage, BackendLanguage, BACKEND_LANGUAGES } from "@/lib/backend-languages";
import { getLanguageColorBadge } from "@/components/courses/course-theme";
import { getApiUrl } from "@/lib/http";
import { useClient } from "@/lib/store";

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

export default function BackendLanguageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user } = useClient();
  const lang = getBackendLanguage(slug);

  const [courses, setCourses] = useState<any[]>([]);
  const [userProgressMap, setUserProgressMap] = useState<Record<string, number>>({});
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function loadLanguageCourses() {
      try {
        const res = await fetch(getApiUrl(`/api/courses?language=${slug}`));
        const json = await res.json();
        if (json.success && json.data?.courses) {
          setCourses(json.data.courses);
        }
      } catch (err) {
        console.error("Error fetching language courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    }
    loadLanguageCourses();
  }, [slug]);

  if (!lang) {
    return (
      <div className="relative min-h-screen bg-[#070913] text-slate-100 flex flex-col justify-between">
        <AnimatedBackground />
        <main className="relative z-10 pt-32 pb-24 text-center max-w-lg mx-auto px-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 space-y-4">
            <Code2 className="mx-auto h-12 w-12 text-slate-500" />
            <h1 className="text-2xl font-bold text-white">Backend Language Not Found</h1>
            <p className="text-xs text-slate-400">
              The requested backend language '{slug}' does not exist in our catalog.
            </p>
            <Link
              href="/backend-languages"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Languages Matrix</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const IconComponent = ICON_MAP[lang.icon] || Code2;
  const badgeTheme = getLanguageColorBadge(lang.slug);

  const otherLanguages = BACKEND_LANGUAGES.filter((l) => l.slug !== lang.slug).slice(0, 3);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lang.sampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <AnimatedBackground />

      <main className="relative z-10 pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/backend-languages" className="hover:text-cyan-400 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Languages</span>
            </Link>
            <span>/</span>
            <span className="text-slate-200">{lang.name}</span>
          </div>

          {/* ================= HERO HEADER ================= */}
          <section className="relative rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 sm:p-10 backdrop-blur-md overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${badgeTheme.bg} border ${badgeTheme.border} ${badgeTheme.text} shadow-lg`}
                  >
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeTheme.bg} border ${badgeTheme.border} ${badgeTheme.text}`}>
                        {lang.typing}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/[0.08]">
                        {lang.difficulty}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                      {lang.name} Backend Engineering
                    </h1>
                  </div>
                </div>

                <p className="text-sm sm:text-base font-semibold text-cyan-400">
                  {lang.tagline}
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang.description}
                </p>

                {/* Primary Frameworks Pills */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 mr-1">Top Frameworks:</span>
                  {lang.primaryFrameworks.map((fw) => (
                    <span
                      key={fw}
                      className="rounded-lg bg-slate-950/80 border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200"
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-auto">
                <Link
                  href={`/backend-languages/compare?lang1=${lang.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-indigo-500 transition shadow-md shadow-cyan-500/20"
                >
                  <GitCompare className="w-4 h-4" />
                  <span>Compare {lang.name}</span>
                </Link>
                <a
                  href="#courses-section"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View Courses ({courses.length})</span>
                </a>
              </div>
            </div>

            {/* Architectural Specs Row */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-white/[0.08]">
              <div className="rounded-xl bg-slate-950/70 border border-white/[0.06] p-3">
                <p className="text-[10px] font-mono uppercase text-slate-500 font-bold">Runtime / Compiler</p>
                <p className="text-xs font-semibold text-white mt-1">{lang.runtimeOrCompiler}</p>
              </div>
              <div className="rounded-xl bg-slate-950/70 border border-white/[0.06] p-3">
                <p className="text-[10px] font-mono uppercase text-slate-500 font-bold">Type System</p>
                <p className="text-xs font-semibold text-white mt-1">{lang.typing}</p>
              </div>
              <div className="rounded-xl bg-slate-950/70 border border-white/[0.06] p-3">
                <p className="text-[10px] font-mono uppercase text-slate-500 font-bold">Concurrency Model</p>
                <p className="text-xs font-semibold text-white mt-1">{lang.concurrencyModel}</p>
              </div>
              <div className="rounded-xl bg-slate-950/70 border border-white/[0.06] p-3">
                <p className="text-[10px] font-mono uppercase text-slate-500 font-bold">Memory Management</p>
                <p className="text-xs font-semibold text-white mt-1">{lang.memoryManagement}</p>
              </div>
            </div>
          </section>

          {/* ================= CODE SNIPPET & ARCHITECTURE ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Code Snippet Box */}
            <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-400 ml-2">
                    {lang.name} Production Architecture Pattern
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-2.5 py-1 rounded-md bg-slate-950/80 border border-white/10"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied!" : "Copy Snippet"}</span>
                </button>
              </div>

              <pre className="rounded-xl bg-slate-950 p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed border border-white/[0.06]">
                <code>{lang.sampleCode}</code>
              </pre>

              <p className="text-xs text-slate-400 leading-relaxed">
                Authentic server architecture pattern illustrating request routing, JSON serialization, and idiomatic handler patterns in {lang.name}.
              </p>
            </div>

            {/* Strengths vs Limitations Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              {/* Strengths */}
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Architectural Strengths</span>
                </div>
                <ul className="space-y-2">
                  {lang.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-400 font-bold mt-0.5">+</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              <div className="rounded-2xl border border-amber-500/20 bg-slate-900/80 p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Trade-Offs & Considerations</span>
                </div>
                <ul className="space-y-2">
                  {lang.limitations.map((lim, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-400 font-bold mt-0.5">-</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ================= CURRICULUM ROADMAP ================= */}
          <section className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 sm:p-10 space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                Structured Learning Progression
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                {lang.name} Backend Engineering Roadmap
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Master {lang.name} through progressive, real-world milestones from language runtime mechanics to production deployment.
              </p>
            </div>

            <div className="space-y-4">
              {lang.roadmapSteps.map((step) => (
                <div
                  key={step.step}
                  className="group relative rounded-xl border border-white/[0.08] bg-slate-900/90 p-5 transition hover:border-cyan-500/40 hover:bg-slate-900"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs shrink-0">
                        0{step.step}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 justify-start md:justify-end shrink-0 pl-12 md:pl-0">
                      {step.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md bg-slate-950 px-2 py-0.5 text-[11px] font-mono text-slate-300 border border-white/[0.06]"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= LANGUAGE COURSES SECTION ================= */}
          <section id="courses-section" className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Curriculum Catalog
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  {lang.name} Courses & Labs
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Structured, hands-on courses featuring authentic backend code examples, interactive quizzes, and coding challenges.
                </p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                <span>Browse All Stacks Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loadingCourses ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-slate-400 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                <p className="text-xs font-mono">Loading {lang.name} courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400 space-y-3">
                <BookOpen className="mx-auto h-8 w-8 text-slate-500" />
                <p className="text-sm font-bold text-white">Courses are active in catalog</p>
                <p className="text-xs text-slate-400">
                  Check the complete course catalog for all available backend learning paths.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                >
                  <span>Open Course Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {courses.map((course) => (
                  <CourseCard
                    key={course.slug}
                    course={course}
                    progress={userProgressMap[course.slug] || 0}
                    isAuthenticated={Boolean(user)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ================= QUICK COMPARISON SUGGESTIONS ================= */}
          <section className="rounded-2xl border border-white/[0.08] bg-slate-900/40 p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span>Compare {lang.name} With Other Backend Languages</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {otherLanguages.map((other) => (
                <Link
                  key={other.slug}
                  href={`/backend-languages/compare?lang1=${lang.slug}&lang2=${other.slug}`}
                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-slate-900/80 p-3 text-xs font-medium text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-slate-800 transition"
                >
                  <span>{lang.name} vs {other.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
