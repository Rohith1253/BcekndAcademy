"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Compass, 
  Flame, 
  GraduationCap, 
  Layers, 
  Lock, 
  PlayCircle, 
  Server, 
  Sparkles, 
  Terminal, 
  Trophy, 
  Zap 
} from "lucide-react";
import { useClient } from "@/lib/store";
import { getApiUrl } from "@/lib/api";
import BeginnerOnboardingModal, { LEARNER_STAGES, type LearnerProfile } from "@/components/learning/BeginnerOnboardingModal";

const CURRICULUM_ROADMAP = [
  { level: 1, slug: "javascript-foundations", title: "JavaScript Foundations", desc: "Variables, types, control flow & syntax" },
  { level: 2, slug: "programming-logic", title: "Programming Logic", desc: "Algorithmic thinking & data manipulation" },
  { level: 3, slug: "async-javascript", title: "Async JavaScript", desc: "Event loop, Promises & Async/Await" },
  { level: 4, slug: "backend-node-js", title: "Node.js Fundamentals", desc: "Server runtime, HTTP & modules" },
  { level: 5, slug: "express-rest-api", title: "Express.js & REST APIs", desc: "Middleware, routing & status codes" },
  { level: 6, slug: "fastify-high-performance-apis", title: "High-Throughput APIs", desc: "Fastify schema compilation & plugins" },
  { level: 7, slug: "mongodb-database", title: "MongoDB & Data Modeling", desc: "Schemas, queries & indexing" },
  { level: 8, slug: "backend-auth-security", title: "Auth & JWT Security", desc: "Tokens, bcrypt & authorization" },
  { level: 9, slug: "typescript-backend", title: "TypeScript for Backend", desc: "Type safety, generics & DTOs" },
  { level: 10, slug: "nestjs-backend-architecture", title: "Enterprise NestJS", desc: "Clean architecture & dependency injection" },
  { level: 11, slug: "production-security-hardening", title: "Security Hardening", desc: "CORS, Helmet, Rate Limiting & OWASP" },
  { level: 12, slug: "caching-queues-realtime", title: "Caching & Queues", desc: "Redis, WebSockets & Message Queues" },
  { level: 13, slug: "cloud-microservices-capstone", title: "Docker & Capstone", desc: "Containerization & Cloud Production" },
];

export default function DashboardPage() {
  const { user } = useClient();
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [learnerStage, setLearnerStage] = useState<LearnerProfile>(LEARNER_STAGES[0]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    // Load learner stage from localStorage
    try {
      const saved = localStorage.getItem("backend_academy_learner_stage");
      if (saved) {
        const found = LEARNER_STAGES.find((s) => s.id === saved);
        if (found) setLearnerStage(found);
      }
    } catch {}

    const handleStageUpdate = (e: any) => {
      if (e.detail) setLearnerStage(e.detail);
    };
    window.addEventListener("learner_stage_updated", handleStageUpdate);
    return () => window.removeEventListener("learner_stage_updated", handleStageUpdate);
  }, []);

  // Determine active starting course based on learner stage
  const activeCourseSlug = learnerStage.recommendedCourseSlug;
  const activeCourseTitle = learnerStage.recommendedCourseTitle;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-20 px-4 sm:px-6 lg:px-10 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* ================= STAGE ONBOARDING BANNER ================= */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Current Track</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {learnerStage.title}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Recommended Start: {activeCourseTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {learnerStage.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOnboardingOpen(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white px-4 py-2 text-xs font-semibold text-slate-300 transition cursor-pointer"
          >
            <span>Change Learning Level</span>
          </button>
        </div>

        {/* ================= HERO: WHAT SHOULD I DO NEXT? ================= */}
        <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Primary Learning Objective</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {activeCourseTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Step-by-step interactive lessons with real code exercises. Learn the core principles, build mental models, and master backend mechanics.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Est. Duration: ~7 Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>12 Core Lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>1,780 XP Reward</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href={`/courses/${activeCourseSlug === "challenges" ? "backend-node-js" : activeCourseSlug}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 px-8 py-4 text-sm font-bold text-slate-950 transition shadow-xl shadow-cyan-500/25 cursor-pointer"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 px-6 py-3 text-xs font-semibold text-slate-300 transition"
              >
                <span>View Complete Path</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ================= 13-LEVEL BACKEND JOURNEY MAP ================= */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                Curriculum Progression
              </p>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                13-Level Backend Engineering Journey
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Complete each level in order to build deep backend engineering expertise.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CURRICULUM_ROADMAP.map((item) => {
              const isCurrent = item.slug === activeCourseSlug || (activeCourseSlug === "challenges" && item.level === 1);
              return (
                <Link
                  key={item.level}
                  href={`/courses/${item.slug}`}
                  className={`group rounded-2xl border p-4 transition-all duration-200 ${
                    isCurrent
                      ? "border-cyan-500/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isCurrent
                        ? "bg-cyan-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      Level {item.level}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ================= FOCUSED 2-COLUMN PRACTICE & TOOLS ================= */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Practice & Challenges */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Hands-On Practice Challenges</h3>
                <p className="text-xs text-slate-400">Write real backend code and evaluate against automated test suites</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Build an HTTP Request Router</p>
                  <p className="text-[11px] text-slate-400">Practice matching URL paths and HTTP methods</p>
                </div>
                <Link
                  href="/challenges"
                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold transition"
                >
                  Solve
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">JWT Token Signer & Verifier</p>
                  <p className="text-[11px] text-slate-400">Implement HMAC-SHA256 signature verification</p>
                </div>
                <Link
                  href="/challenges"
                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold transition"
                >
                  Solve
                </Link>
              </div>
            </div>

            <Link
              href="/challenges"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition pt-1"
            >
              <span>Explore All 25+ Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* AI Learning Assistant & Architecture Labs */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Interactive Tools & Assistant</h3>
                <p className="text-xs text-slate-400">Dedicated assistance and visual systems simulators</p>
              </div>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <Link
                href="/ai-assistant"
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 hover:border-cyan-500/40 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Dedicated Hub</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition" />
                </div>
                <p className="text-xs font-bold text-white">AI Learning Assistant</p>
                <p className="text-[11px] text-slate-400 mt-1">Ask questions about any backend concept or error</p>
              </Link>

              <Link
                href="/architecture-labs"
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 hover:border-emerald-500/40 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Simulators</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <p className="text-xs font-bold text-white">Architecture Labs</p>
                <p className="text-[11px] text-slate-400 mt-1">Simulate distributed requests, caching & gateways</p>
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Looking to test multi-file servers?</span>
              <Link href="/coding-lab" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Open AI Coding Lab →
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Beginner Onboarding Modal */}
      <BeginnerOnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onSelectStage={(stage) => setLearnerStage(stage)}
        currentStageId={learnerStage.id}
      />
    </div>
  );
}
