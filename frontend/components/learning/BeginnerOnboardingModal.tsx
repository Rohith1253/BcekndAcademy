"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Server, 
  Database, 
  X,
  GraduationCap
} from "lucide-react";

export interface LearnerProfile {
  id: "beginner" | "basic-js" | "ready-backend" | "testing-skills";
  title: string;
  subtitle: string;
  description: string;
  recommendedCourseSlug: string;
  recommendedCourseTitle: string;
  recommendedLevel: string;
  icon: string;
  color: string;
}

export const LEARNER_STAGES: LearnerProfile[] = [
  {
    id: "beginner",
    title: "Complete Beginner",
    subtitle: "Never written code before",
    description: "Start from absolute scratch with JavaScript syntax, variables, conditionals, and programming logic.",
    recommendedCourseSlug: "javascript-foundations",
    recommendedCourseTitle: "Level 1: JavaScript Foundations",
    recommendedLevel: "Level 1",
    icon: "GraduationCap",
    color: "emerald"
  },
  {
    id: "basic-js",
    title: "Know Basic JavaScript",
    subtitle: "Know variables and basic functions",
    description: "Deep dive into asynchronous JavaScript, event loops, promises, and preparing for server runtime.",
    recommendedCourseSlug: "async-javascript",
    recommendedCourseTitle: "Level 3: Modern and Asynchronous JavaScript",
    recommendedLevel: "Level 3",
    icon: "Code2",
    color: "cyan"
  },
  {
    id: "ready-backend",
    title: "Ready for Backend Engineering",
    subtitle: "Solid in JavaScript or TypeScript",
    description: "Build production HTTP servers, Express middleware, REST APIs, and database models.",
    recommendedCourseSlug: "backend-node-js",
    recommendedCourseTitle: "Level 4: Backend Development with Node.js",
    recommendedLevel: "Level 4",
    icon: "Server",
    color: "indigo"
  },
  {
    id: "testing-skills",
    title: "Experienced Developer",
    subtitle: "Ready to test and build systems",
    description: "Tackle real-world backend challenges, distributed architectures, caching, and microservices.",
    recommendedCourseSlug: "challenges",
    recommendedCourseTitle: "Backend Coding Challenges and Architecture Labs",
    recommendedLevel: "Challenges",
    icon: "Database",
    color: "purple"
  }
];

interface BeginnerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStage: (stage: LearnerProfile) => void;
  currentStageId?: string;
}

export default function BeginnerOnboardingModal({
  isOpen,
  onClose,
  onSelectStage,
  currentStageId = "beginner"
}: BeginnerOnboardingModalProps) {
  const [selected, setSelected] = useState<string>(currentStageId);

  useEffect(() => {
    setSelected(currentStageId);
  }, [currentStageId]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const stage = LEARNER_STAGES.find((s) => s.id === selected) || LEARNER_STAGES[0];
    try {
      localStorage.setItem("backend_academy_learner_stage", stage.id);
      window.dispatchEvent(new CustomEvent("learner_stage_updated", { detail: stage }));
    } catch {}
    onSelectStage(stage);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl text-slate-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close onboarding dialog"
            className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Personalized Learning Path</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Where are you in your coding journey?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              We will customize your learning experience so you always know exactly what to learn next without feeling lost.
            </p>
          </div>

          {/* Stage Cards */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {LEARNER_STAGES.map((stage) => {
              const isChosen = selected === stage.id;
              return (
                <div
                  key={stage.id}
                  onClick={() => setSelected(stage.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    isChosen
                      ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                        {stage.recommendedLevel}
                      </span>
                      <h3 className="text-base font-bold text-white">{stage.title}</h3>
                      <p className="text-xs text-slate-400 font-medium">{stage.subtitle}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isChosen
                          ? "border-cyan-400 bg-cyan-500 text-slate-950"
                          : "border-slate-700 bg-slate-900"
                      }`}
                    >
                      {isChosen && <CheckCircle2 className="w-4 h-4 fill-slate-950 text-cyan-400" />}
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              You can change this anytime from your dashboard.
            </p>
            <button
              onClick={handleConfirm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-2.5 text-xs font-bold text-slate-950 transition cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Set My Learning Path</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
