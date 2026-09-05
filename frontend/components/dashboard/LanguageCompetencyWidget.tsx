"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, ArrowUpRight, Layers } from "lucide-react";
import { api } from "@/lib/api";

export default function LanguageCompetencyWidget() {
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLanguages() {
      try {
        const json = await api.get("/api/progress/languages");
        if (json.success && Array.isArray(json.data)) {
          setLanguages(json.data);
        }
      } catch (err) {
        console.error("Failed to load language progress:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLanguages();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-cyan-300 font-semibold">
            <Layers className="h-3.5 w-3.5" />
            <span>Multi-Language Backend Mastery</span>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-white">11 Backend Stacks Competency</h3>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/playground"
            className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition"
          >
            Open Playground
          </Link>
          <Link
            href="/progress"
            className="inline-flex items-center gap-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
          >
            <span>Progress Hub</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {languages.slice(0, 11).map((lang) => (
          <Link
            key={lang.slug}
            href={`/playground?lang=${lang.slug}`}
            className="group rounded-2xl border border-white/5 bg-slate-900/60 p-3.5 hover:border-cyan-500/40 hover:bg-slate-900/90 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition">
                {lang.name}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">
                {lang.progressPercentage}%
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-950">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${lang.progressPercentage}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                {lang.completedLessons}/{lang.totalLessons} Lessons
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
