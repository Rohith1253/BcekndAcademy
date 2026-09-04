"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import {
  BookOpen,
  CheckSquare,
  Code2,
  Trophy,
  ArrowRight,
  Sparkles,
  Layers,
  Terminal,
  Zap,
} from "lucide-react";
import { useClient } from "@/lib/store";

// Verified project statistics from seed data and automated tests
const realStats = [
  { value: "5+", label: "Backend Courses", detail: "Node.js, TypeScript, Express, MongoDB, Security" },
  { value: "60+", label: "Interactive Lessons", detail: "Comprehensive step-by-step technical guides" },
  { value: "300+", label: "Quiz Questions", detail: "Server-evaluated scoring & anti-farming rules" },
  { value: "15+", label: "VM Challenges", detail: "Isolated code sandbox with 2,000ms limits" },
];

// Real verified platform features
const realFeatures = [
  {
    title: "Structured Multi-Course Curriculum",
    description: "Deep dive into real backend engineering—from HTTP specifications and Node.js event loops to REST APIs, Mongoose schemas, and production security.",
    icon: BookOpen,
    tag: "Curriculum",
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Server-Evaluated Quiz & XP Engine",
    description: "Validate your comprehension with 300+ server-scored quiz questions. Earn XP, climb level tiers, and benefit from server-enforced anti-farming protection.",
    icon: CheckSquare,
    tag: "Assessment",
    color: "from-indigo-400 to-violet-500",
  },
  {
    title: "Isolated VM Coding Playground",
    description: "Write real Node.js and TypeScript solution code directly in your browser. Code is securely executed in a sandboxed VM with strict 2,000ms execution limits.",
    icon: Code2,
    tag: "Sandbox",
    color: "from-fuchsia-400 to-pink-500",
  },
  {
    title: "Real-Time Progress & Analytics",
    description: "Track your streak, completed modules, total XP, and unlocked badges across courses through an intuitive personal developer dashboard.",
    icon: Trophy,
    tag: "Analytics",
    color: "from-violet-400 to-purple-500",
  },
];

// Learning Journey steps
const learningFlow = [
  { step: "01", title: "Learn", desc: "Study core backend concepts and specs with interactive lessons.", icon: BookOpen },
  { step: "02", title: "Practice", desc: "Write solution code in real-time VM sandboxed challenges.", icon: Terminal },
  { step: "03", title: "Test", desc: "Pass server-scored quizzes to verify technical mastery.", icon: Zap },
  { step: "04", title: "Track Progress", desc: "Earn XP, unlock level badges, and track completed paths.", icon: Trophy },
];

// 5 Real Verified Courses
const featuredCourses = [
  {
    slug: "backend-node-js",
    title: "Backend Development with Node.js",
    category: "Node.js",
    level: "Beginner • 4 Modules • 12 Lessons",
    desc: "Master HTTP basics, client-server models, Event Loop architecture, standard library modules, and Express MongoDB CRUD pipelines.",
    color: "cyan",
  },
  {
    slug: "typescript-backend",
    title: "TypeScript for Backend Development",
    category: "TypeScript",
    level: "Intermediate • 4 Modules • 12 Lessons",
    desc: "Build strongly-typed Node.js APIs with interfaces, generics, discriminated unions, utility types, DTO patterns, and Zod validation.",
    color: "indigo",
  },
  {
    slug: "express-rest-api",
    title: "REST API Development with Express.js",
    category: "Express.js",
    level: "Intermediate • 4 Modules • 12 Lessons",
    desc: "Architect robust REST endpoints, controllers, middleware pipelines, error handling, rate limiting, and OpenAPI/Swagger documentation.",
    color: "fuchsia",
  },
  {
    slug: "mongodb-database",
    title: "MongoDB & Database Engineering",
    category: "MongoDB",
    level: "Advanced • 4 Modules • 12 Lessons",
    desc: "Master NoSQL document modeling, indexing, aggregation pipelines, Mongoose schemas, virtuals, population, and ACID transactions.",
    color: "violet",
  },
  {
    slug: "backend-auth-security",
    title: "Backend Authentication & Security",
    category: "Security",
    level: "Advanced • 4 Modules • 12 Lessons",
    desc: "Implement JWT signing, HTTP-Only session cookies, refresh token rotation, bcrypt password hashing, RBAC, and NoSQL injection defense.",
    color: "purple",
  },
];

export default function Features() {
  const { user } = useClient();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || !sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll(".feature-card");

    const anim = anime({
      targets: cards,
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(60, { start: 100 }),
      duration: 700,
      easing: "easeOutCubic",
    });

    return () => {
      anim.pause();
      anime.remove(cards);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative pb-24 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-28">
        {/* ================= VERIFIED STATS BAR ================= */}
        <div className="rounded-[24px] sm:rounded-[28px] border border-white/[0.12] bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {realStats.map((stat, idx) => (
              <div key={idx} className="space-y-1.5 p-3">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-white tracking-wide">{stat.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PLATFORM FEATURES SECTION ================= */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              Platform Features
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered for Production Developers
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
              Every tool and course on Backend Academy is designed around real backend engineering standards and executable code.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {realFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="feature-card rounded-[24px] border border-white/[0.12] bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.06] group"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.color} text-slate-950 shadow-md`}
                    >
                      <Icon className="h-6 w-6 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-950/60 px-3 py-1 rounded-full border border-white/[0.06]">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= LEARNING JOURNEY FLOW ================= */}
        <div className="rounded-[28px] border border-white/[0.12] bg-slate-950/80 p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
              Methodology
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The 4-Step Learning Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {learningFlow.map((flow, idx) => {
              const Icon = flow.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 flex flex-col items-start relative group hover:border-cyan-400/30 transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-cyan-400 mb-3 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                    Step {flow.step}
                  </span>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-base font-bold text-white">{flow.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{flow.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= FEATURED REAL COURSES CATALOG ================= */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-fuchsia-400">
                Curriculum Overview
              </span>
              <h2 className="mt-2 text-3xl font-bold text-white tracking-tight">
                Featured Backend Courses
              </h2>
            </div>
            <a
              href="/courses"
              className="inline-flex items-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View All 5 Courses</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <a
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="group rounded-[24px] border border-white/[0.12] bg-white/[0.04] p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/[0.07] hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="font-mono text-cyan-400 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                      {course.category}
                    </span>
                    <span className="text-slate-400 text-[11px]">{course.level}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                    {course.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>View Course Syllabus</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ================= FINAL CALL TO ACTION (CTA) BANNER ================= */}
        <div className="rounded-[28px] border border-white/[0.15] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 text-center backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3.5 py-1 rounded-full border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Learning Today</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Ready to Build Your Backend Skills?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              Join thousands of developers mastering real-world backend engineering through hands-on code execution, quizzes, and structured paths.
            </p>
            <div className="pt-4 flex justify-center">
              <a
                href={user ? "/dashboard" : "/courses"}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 py-3.5 px-8 text-sm font-bold text-slate-950 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-cyan-500/35 hover:scale-[1.02] cursor-pointer"
              >
                <span>{user ? "Go to Dashboard" : "Start Learning Now"}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
