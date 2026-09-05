"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock3, ShieldCheck, Zap } from "lucide-react";
import type { RoadmapModule } from "@/components/roadmap/types";

interface ModuleCardProps {
  module: RoadmapModule;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Selected module</p>
        <h2 className="text-3xl font-semibold text-white">{module.title}</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">{module.description}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
          <div className="flex items-center gap-3 text-slate-300">
            <Clock3 className="h-5 w-5 text-sky-300" />
            <span className="font-medium">Estimated time</span>
          </div>
          <p className="mt-3 text-xl font-semibold text-white">{module.duration}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
          <div className="flex items-center gap-3 text-slate-300">
            <ShieldCheck className="h-5 w-5 text-violet-300" />
            <span className="font-medium">Difficulty</span>
          </div>
          <p className="mt-3 text-xl font-semibold text-white">{module.difficulty}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Skills covered</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {module.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-slate-800/80 px-3 py-1 text-sm text-slate-300">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Prerequisites</p>
          <div className="mt-4 space-y-2 text-sm text-slate-400">
            {module.prerequisites.length > 0 ? (
              module.prerequisites.map((item) => (
                <p key={item}>• {item}</p>
              ))
            ) : (
              <p className="text-slate-300">No prerequisites required.</p>
            )}
          </div>
        </div>
      </div>

      <a
        href={
          module.title.includes("HTTP")
            ? "/learn/http-basics"
            : module.title.includes("Node")
            ? "/learn/nodejs"
            : module.title.includes("Express")
            ? "/learn/nodejs"
            : "/learn/http-basics"
        }
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5"
      >
        Start Learning
        <ArrowRight className="h-4 w-4" />
      </a>

      <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5 text-sm text-slate-300">
        <div className="flex items-center gap-2 text-slate-300">
          <Zap className="h-4 w-4 text-cyan-300" />
          <span>Tip:</span>
        </div>
        <p className="mt-3 leading-7 text-slate-400">Review prior completed modules before moving into advanced topics for better retention.</p>
      </div>
    </motion.div>
  );
}
