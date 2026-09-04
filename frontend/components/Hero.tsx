"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import {
  ArrowRight,
  Terminal,
  ShieldCheck,
  Cpu,
  Database,
  Layers,
  Server,
  CheckCircle2,
  Play,
} from "lucide-react";
import { useClient } from "@/lib/store";

export default function Hero() {
  const { user } = useClient();
  const heroRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || !heroRef.current) return;

    const staggerItems = heroRef.current.querySelectorAll(".hero-stagger");

    const anim = anime({
      targets: staggerItems,
      opacity: [0, 1],
      translateY: [24, 0],
      delay: anime.stagger(80, { start: 100 }),
      duration: 800,
      easing: "easeOutCubic",
    });

    // Gentle terminal float animation
    let floatAnim: anime.AnimeInstance | null = null;
    if (terminalRef.current) {
      floatAnim = anime({
        targets: terminalRef.current,
        translateY: [-6, 6],
        duration: 4000,
        easing: "easeInOutSine",
        direction: "alternate",
        loop: true,
      });
    }

    return () => {
      anim.pause();
      if (floatAnim) floatAnim.pause();
      anime.remove(staggerItems);
    };
  }, []);

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left Column: Headline & Action Controls */}
          <div className="flex flex-col items-start">
            {/* Top Pill Badge */}
            <div className="hero-stagger inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md mb-6">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Production-Grade Learning Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-stagger text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Master Backend Development{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                by Building Real Things.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="hero-stagger mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Build production-ready REST APIs, microservices, database schemas, and secure authentication systems with interactive coding challenges and real-time VM evaluation.
            </p>

            {/* CTAs */}
            <div className="hero-stagger mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href={user ? "/dashboard" : "/courses"}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 py-3.5 px-7 text-sm font-bold text-slate-950 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-cyan-500/35 hover:scale-[1.02] cursor-pointer"
              >
                <span>{user ? "Go to Dashboard" : "Explore Courses"}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>

              <a
                href="/roadmap"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] py-3.5 px-7 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] hover:border-white/25 cursor-pointer"
              >
                View Roadmap
              </a>
            </div>

            {/* Real Feature Micro-Pills */}
            <div className="hero-stagger mt-10 pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>JWT & Cookie Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>MongoDB Schemas</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-fuchsia-400 shrink-0" />
                <span>VM Code Sandbox</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400 shrink-0" />
                <span>5 Full Courses</span>
              </div>
            </div>
          </div>

          {/* Right Column: Original Interactive Terminal Card Visual */}
          <div ref={terminalRef} className="hero-stagger relative w-full">
            {/* Dark Glass Container Card */}
            <div className="relative rounded-[24px] sm:rounded-[28px] border border-white/[0.12] bg-white/[0.04] p-5 sm:p-7 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden text-slate-100">
              {/* Inner Top Edge Highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

              {/* Terminal Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1 rounded-lg border border-white/[0.06]">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>backend-learning-platform ~ main</span>
                </div>
              </div>

              {/* Status Indicators List */}
              <div className="space-y-3 font-mono text-xs mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-200">API Pipeline & Controllers</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Online
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-200">MongoDB Database Engine</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-200">Isolated VM Challenge Sandbox</span>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Hardened
                  </span>
                </div>
              </div>

              {/* Terminal Code Input Visual Prompt */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 font-mono text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Play className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>$ npm run learn</span>
                </div>
                <p className="text-slate-400 pl-5 text-[11px] leading-relaxed">
                  ✓ Loading 5 Courses... <br />
                  ✓ Initializing 60 Lessons & 300 Quiz Questions... <br />
                  <span className="text-emerald-400 font-semibold">
                    ready - started server on http://localhost:3000
                  </span>
                </p>
              </div>

              {/* Floating Tech Micro-Badges Grid */}
              <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[11px] font-medium">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center gap-1.5">
                  <Server className="w-3.5 h-3.5" />
                  <span>Node.js</span>
                </div>
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>TypeScript</span>
                </div>
                <div className="p-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Express</span>
                </div>
                <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 flex items-center justify-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>MongoDB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
