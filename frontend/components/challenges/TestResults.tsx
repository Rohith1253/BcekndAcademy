"use client";

import React from "react";
import { CheckCircle2, XCircle, Sparkles, ShieldCheck, AlertCircle } from "lucide-react";
import type { TestRunResult, SubmitSolutionResponse } from "@/lib/challenge-types";

interface TestResultsProps {
  results: TestRunResult[] | null;
  submitOutcome: SubmitSolutionResponse | null;
  isRunning: boolean;
  isSubmitting: boolean;
}

export default function TestResults({
  results,
  submitOutcome,
  isRunning,
  isSubmitting,
}: TestResultsProps) {
  if (isRunning || isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-7 h-7 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
          {isSubmitting ? "Evaluating test harness & hidden test suite..." : "Executing sandbox test runner..."}
        </p>
      </div>
    );
  }

  if (!results && !submitOutcome) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 font-mono">
        Click <strong className="text-cyan-400">Run Code</strong> to test visible assertions, or <strong className="text-cyan-400">Submit Solution</strong> to evaluate full test suite.
      </div>
    );
  }

  const visibleTests = submitOutcome ? submitOutcome.visibleResults : results || [];
  const passedCount = visibleTests.filter((t) => t.passed).length;
  const totalVisible = visibleTests.length;

  return (
    <div className="space-y-4">
      {/* Submit Outcome Banner */}
      {submitOutcome && (
        <div
          className={`rounded-xl border p-4 backdrop-blur-xl ${
            submitOutcome.passed
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {submitOutcome.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-bold text-white">
                  {submitOutcome.passed ? "Challenge Solved!" : "Evaluation Incomplete"}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">{submitOutcome.message}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-lg font-mono font-extrabold text-white">
                {submitOutcome.score}%
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {submitOutcome.testsPassed} / {submitOutcome.totalTests} Total Tests
              </div>
            </div>
          </div>

          {/* XP & Anti-farming Notice */}
          <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-fuchsia-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              +{submitOutcome.earnedXP} XP Awarded
            </span>

            {submitOutcome.alreadyCompleted && (
              <span className="text-[11px] text-amber-300 font-sans">
                (Challenge previously solved — anti-farming active, 0 extra XP)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Hidden Tests Summary Box if Evaluated */}
      {submitOutcome && submitOutcome.hiddenTestsTotal > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-xs text-indigo-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold">Hidden Test Suite (Anti-Cheat)</span>
          </div>
          <span className="font-mono font-bold">
            {submitOutcome.hiddenTestsPassed} / {submitOutcome.hiddenTestsTotal} Passed
          </span>
        </div>
      )}

      {/* Visible Test Case Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>Visible Test Cases</span>
          <span>{passedCount} / {totalVisible} Passed</span>
        </div>

        {visibleTests.map((t, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-3 text-xs transition ${
              t.passed
                ? "border-emerald-500/20 bg-emerald-950/20"
                : "border-rose-500/30 bg-rose-950/30"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {t.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="font-medium text-white">{t.name}</span>
              </div>
              <span
                className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                  t.passed ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {t.passed ? "Passed" : "Failed"}
              </span>
            </div>

            {t.description && (
              <p className="mt-1 text-[11px] text-slate-400 pl-6">{t.description}</p>
            )}

            {/* Error message if test failed */}
            {!t.passed && t.error && (
              <div className="mt-2 ml-6 rounded-lg border border-rose-500/20 bg-rose-950/40 p-2.5 font-mono text-[11px] text-rose-300">
                <span className="text-rose-400 font-semibold block mb-0.5">Assertion Error:</span>
                {t.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
