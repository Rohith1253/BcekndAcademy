"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Send, Terminal, CheckCircle2, History, BookOpen } from "lucide-react";
import ChallengeDescription from "./ChallengeDescription";
import CodeEditor from "./CodeEditor";
import TestResults from "./TestResults";
import ConsolePanel from "./ConsolePanel";
import SubmissionHistory from "./SubmissionHistory";
import { api } from "@/lib/api";
import { useClient } from "@/lib/store";
import type {
  CodingChallengeDetail,
  TestRunResult,
  ExecutionLog,
  SubmitSolutionResponse,
} from "@/lib/challenge-types";

interface ChallengeWorkspaceProps {
  challenge: CodingChallengeDetail;
  initialCompleted?: boolean;
  latestDraftCode?: string | null;
}

export default function ChallengeWorkspace({
  challenge,
  initialCompleted = false,
  latestDraftCode = null,
}: ChallengeWorkspaceProps) {
  const { user, refreshUser } = useClient();

  const storageKey = `backend_coding_draft_${challenge.slug}`;

  // Initialize editor code: LocalStorage draft > latest DB draft > starterCode
  const [code, setCode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) return saved;
    }
    return latestDraftCode || challenge.starterCode || "";
  });

  const [leftTab, setLeftTab] = useState<"description" | "submissions">("description");
  const [bottomTab, setBottomTab] = useState<"results" | "console">("results");

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [testResults, setTestResults] = useState<TestRunResult[] | null>(null);
  const [submitOutcome, setSubmitOutcome] = useState<SubmitSolutionResponse | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<ExecutionLog[]>([]);
  const [executionTime, setExecutionTime] = useState(0);

  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [historyTrigger, setHistoryTrigger] = useState(0);

  // Auto-save draft to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, code);
    } catch {}
  }, [code, storageKey]);

  // Run Code (visible tests only)
  const handleRunCode = async () => {
    setIsRunning(true);
    setBottomTab("results");
    setSubmitOutcome(null);

    try {
      const json = await api.post(`/api/challenges/${challenge.slug}/run`, { code });
      if (json.success && json.data) {
        setTestResults(json.data.results || []);
        setConsoleLogs(json.data.logs || []);
        setExecutionTime(json.data.executionTime || 0);
      } else {
        alert(json.error || "Failed to execute tests");
      }
    } catch (err: any) {
      console.error("Run code error:", err);
      alert(err.message || "Failed to run code");
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution (all tests + XP evaluation)
  const handleSubmitSolution = async () => {
    if (!user) {
      alert("Please log in to submit your solution and record your progress!");
      return;
    }

    setIsSubmitting(true);
    setBottomTab("results");

    try {
      const json = await api.post(`/api/challenges/${challenge.slug}/submit`, { code });
      if (json.success && json.data) {
        const outcome: SubmitSolutionResponse = json.data;
        setSubmitOutcome(outcome);
        setTestResults(outcome.visibleResults || []);
        setConsoleLogs(outcome.logs || []);
        setExecutionTime(outcome.executionTime || 0);

        if (outcome.passed) {
          setIsCompleted(true);
        }

        // Refresh submission history and user XP
        setHistoryTrigger((prev) => prev + 1);
        if (outcome.earnedXP > 0) {
          refreshUser();
        }
      } else {
        alert(json.error || "Failed to submit solution");
      }
    } catch (err: any) {
      console.error("Submit solution error:", err);
      alert(err.message || "Failed to evaluate submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    setCode(challenge.starterCode);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 flex flex-col pt-16">
      {/* Top Workspace Navigation Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/challenges"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Challenges</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono text-cyan-300 font-semibold">{challenge.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/90 hover:bg-slate-700/90 px-4 py-2 text-xs font-semibold text-white shadow-lg transition disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            {isRunning ? "Running..." : "Run Code"}
          </button>

          <button
            type="button"
            onClick={handleSubmitSolution}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2 text-xs font-bold shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? "Evaluating..." : "Submit Solution"}
          </button>
        </div>
      </div>

      {/* Main Workspace Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* LEFT COLUMN: Description & Submissions */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/[0.08] flex flex-col h-full bg-[#080b18]/60 overflow-hidden">
          {/* Left Tabs */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] bg-slate-950/60 shrink-0">
            <button
              type="button"
              onClick={() => setLeftTab("description")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                leftTab === "description"
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Description
            </button>

            <button
              type="button"
              onClick={() => setLeftTab("submissions")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                leftTab === "submissions"
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5 text-fuchsia-400" /> Submissions
            </button>
          </div>

          {/* Left Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {leftTab === "description" ? (
              <ChallengeDescription challenge={challenge} isCompleted={isCompleted} />
            ) : (
              <SubmissionHistory
                challengeSlug={challenge.slug}
                onRestoreCode={(restoredCode) => setCode(restoredCode)}
                refreshTrigger={historyTrigger}
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Code Editor + Bottom Panels */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#050711] overflow-hidden">
          {/* Top: Editor */}
          <div className="flex-1 p-4 overflow-hidden min-h-[360px]">
            <CodeEditor
              code={code}
              onChange={setCode}
              onReset={handleResetCode}
              starterCode={challenge.starterCode}
            />
          </div>

          {/* Bottom: Results & Console Split */}
          <div className="border-t border-white/[0.08] bg-slate-950/80 flex flex-col min-h-[240px] max-h-[320px]">
            {/* Bottom Tabs */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBottomTab("results")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    bottomTab === "results"
                      ? "bg-white/[0.08] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Test Results
                </button>

                <button
                  type="button"
                  onClick={() => setBottomTab("console")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    bottomTab === "console"
                      ? "bg-white/[0.08] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Console Output
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-500">
                {executionTime > 0 ? `Execution: ${executionTime}ms` : "Sandbox Ready"}
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              {bottomTab === "results" ? (
                <TestResults
                  results={testResults}
                  submitOutcome={submitOutcome}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <ConsolePanel
                  logs={consoleLogs}
                  executionTime={executionTime}
                  onClear={() => setConsoleLogs([])}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
