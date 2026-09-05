"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Play, 
  RotateCcw, 
  Save, 
  Check, 
  ChevronLeft, 
  Layout, 
  Bot, 
  FileCode, 
  Terminal, 
  CheckCircle2, 
  Compass, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import MonacoCodeEditor from "./MonacoCodeEditor";
import WorkspaceExplorer from "./WorkspaceExplorer";
import ConsoleOutputPanel from "./ConsoleOutputPanel";
import AIMentorPanel from "./AIMentorPanel";
import { WORKSPACE_EXERCISES, type WorkspaceExercise, getExerciseById } from "@/data/workspace-exercises";
import { executeCodeSafely, type ExecutionResult } from "@/lib/workspace-executor";

interface CodingWorkspaceProps {
  initialExerciseId?: string;
  courseSlug?: string;
  lessonSlug?: string;
}

export default function CodingWorkspace({
  initialExerciseId,
  courseSlug,
  lessonSlug,
}: CodingWorkspaceProps) {
  const [activeExercise, setActiveExercise] = useState<WorkspaceExercise>(
    getExerciseById(initialExerciseId || "") || WORKSPACE_EXERCISES[0]
  );
  const [activeFileName, setActiveFileName] = useState<string>("index.js");
  const [code, setCode] = useState<string>(activeExercise.starterCode);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showMentorPanel, setShowMentorPanel] = useState(true);
  const [mobileTab, setMobileTab] = useState<"explorer" | "editor" | "output" | "mentor">("editor");

  // Load saved code from localStorage if available
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem(`workspace_code_${activeExercise.id}`);
      if (savedCode) {
        setCode(savedCode);
      } else {
        setCode(activeExercise.starterCode);
      }
    } catch {
      setCode(activeExercise.starterCode);
    }
    setExecutionResult(null);
  }, [activeExercise]);

  // Handle Code Execution
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const result = await executeCodeSafely(code, activeExercise.tests);
      setExecutionResult(result);
    } catch (err: any) {
      setExecutionResult({
        success: false,
        logs: [{ type: "error", message: err.message, timestamp: new Date().toLocaleTimeString() }],
        executionTimeMs: 0,
        testResults: [],
        error: err.message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Handle Save
  const handleSave = () => {
    try {
      localStorage.setItem(`workspace_code_${activeExercise.id}`, code);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch {}
  };

  // Keyboard shortcut Ctrl + Enter to run code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, activeExercise]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* Top Workspace Header Bar */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 z-30 shrink-0">
        
        {/* Left: Breadcrumbs & Back */}
        <div className="flex items-center gap-3">
          <Link
            href={lessonSlug ? `/courses/${courseSlug}/lessons/${lessonSlug}` : "/dashboard"}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-xs text-slate-300 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{lessonSlug ? "Back to Lesson" : "Dashboard"}</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-semibold">{activeExercise.categoryLabel}</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-bold">{activeExercise.title}</span>
          </div>
        </div>

        {/* Right: Actions (Run, Save, Mentor Toggle) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition cursor-pointer"
            title="Save code (Ctrl + S)"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20 cursor-pointer"
            title="Run Code (Ctrl + Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Run Code</span>
          </button>

          <button
            onClick={() => setShowMentorPanel((prev) => !prev)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              showMentorPanel
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
            title="Toggle AI Mentor Panel"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Mentor</span>
          </button>
        </div>

      </header>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden items-center justify-around bg-slate-900 border-b border-slate-800 py-1.5 text-xs font-semibold shrink-0">
        <button
          onClick={() => setMobileTab("explorer")}
          className={`px-3 py-1 rounded-lg ${mobileTab === "explorer" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400"}`}
        >
          Instructions
        </button>
        <button
          onClick={() => setMobileTab("editor")}
          className={`px-3 py-1 rounded-lg ${mobileTab === "editor" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400"}`}
        >
          Code Editor
        </button>
        <button
          onClick={() => setMobileTab("output")}
          className={`px-3 py-1 rounded-lg ${mobileTab === "output" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400"}`}
        >
          Console & Tests
        </button>
        <button
          onClick={() => setMobileTab("mentor")}
          className={`px-3 py-1 rounded-lg ${mobileTab === "mentor" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400"}`}
        >
          AI Mentor
        </button>
      </div>

      {/* Master 3-Panel Desktop Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Explorer & Instructions (280px to 320px) */}
        <aside className={`w-80 shrink-0 hidden lg:block ${mobileTab === "explorer" ? "!block w-full" : ""}`}>
          <WorkspaceExplorer
            exercise={activeExercise}
            activeFile={activeFileName}
            onSelectFile={(f) => setActiveFileName(f)}
            allExercises={WORKSPACE_EXERCISES}
            onSelectExercise={(exId) => {
              const found = getExerciseById(exId);
              if (found) {
                setActiveExercise(found);
                setActiveFileName("index.js");
              }
            }}
          />
        </aside>

        {/* CENTER PANEL: Code Editor + Bottom Console Panel */}
        <main className={`flex-1 flex flex-col min-w-0 ${mobileTab === "editor" || mobileTab === "output" ? "!flex" : "hidden lg:flex"}`}>
          
          {/* Top Half: Code Editor */}
          <div className={`flex-1 min-h-0 ${mobileTab === "output" ? "hidden lg:block" : ""}`}>
            <MonacoCodeEditor
              code={code}
              language="javascript"
              onChange={(val) => setCode(val)}
              onReset={() => setCode(activeExercise.starterCode)}
              fileName={activeFileName}
            />
          </div>

          {/* Bottom Half: Console & Tests Drawer (240px) */}
          <div className={`h-60 shrink-0 ${mobileTab === "editor" ? "hidden lg:block" : ""}`}>
            <ConsoleOutputPanel
              executionResult={executionResult}
              isRunning={isRunning}
              onClear={() => setExecutionResult(null)}
            />
          </div>

        </main>

        {/* RIGHT PANEL: AI Mentor (320px) */}
        {showMentorPanel && (
          <aside className={`w-80 shrink-0 hidden lg:block ${mobileTab === "mentor" ? "!block w-full" : ""}`}>
            <AIMentorPanel
              currentCode={code}
              exerciseTitle={activeExercise.title}
              exerciseDescription={activeExercise.description}
              consoleError={executionResult?.error}
            />
          </aside>
        )}

      </div>

    </div>
  );
}
