"use client";

import React, { useState } from "react";
import { 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Trash2, 
  Clock, 
  ArrowRight,
  Server,
  Activity
} from "lucide-react";
import type { ExecutionResult, TestResult } from "@/lib/workspace-executor";

interface ConsoleOutputPanelProps {
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  onClear: () => void;
}

export default function ConsoleOutputPanel({
  executionResult,
  isRunning,
  onClear,
}: ConsoleOutputPanelProps) {
  const [activeTab, setActiveTab] = useState<"console" | "tests" | "simulator">("console");

  const logs = executionResult?.logs || [];
  const testResults = executionResult?.testResults || [];
  const testsPassed = testResults.filter((t) => t.passed).length;

  return (
    <div className="flex flex-col h-full bg-[#050712] border-t border-slate-800 text-slate-100 overflow-hidden select-text">
      
      {/* Panel Tabs Header */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setActiveTab("console")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === "console"
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console Output</span>
            {logs.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {logs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === "tests"
                ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Test Results</span>
            {testResults.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                testsPassed === testResults.length
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/20 text-rose-300"
              }`}>
                {testsPassed}/{testResults.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === "simulator"
                ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Request Flow Simulator</span>
          </button>

        </div>

        <div className="flex items-center gap-3">
          {executionResult && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{executionResult.executionTimeMs}ms</span>
            </div>
          )}

          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Clear console output"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs scrollbar-thin">
        
        {/* Loading Spinner */}
        {isRunning && (
          <div className="flex items-center gap-2 text-cyan-400 py-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Executing code in safe sandbox...</span>
          </div>
        )}

        {/* TAB 1: Console Logs */}
        {activeTab === "console" && (
          <div className="space-y-1.5">
            {!isRunning && logs.length === 0 && !executionResult?.error && (
              <p className="text-slate-500 italic py-2">
                Click "Run Code" or press Ctrl + Enter to execute and view console output.
              </p>
            )}

            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 py-0.5 leading-relaxed ${
                  log.type === "error"
                    ? "text-rose-400 bg-rose-500/10 px-2 rounded"
                    : log.type === "warn"
                    ? "text-amber-300"
                    : "text-slate-200"
                }`}
              >
                <span className="text-[10px] text-slate-600 select-none">{log.timestamp}</span>
                <span className="whitespace-pre-wrap flex-1">{log.message}</span>
              </div>
            ))}

            {executionResult?.error && (
              <div className="mt-2 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
                <strong>Runtime Error:</strong> {executionResult.error}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Test Results */}
        {activeTab === "tests" && (
          <div className="space-y-2">
            {testResults.length === 0 ? (
              <p className="text-slate-500 italic py-2">
                No automated test results recorded yet. Click "Run Code" to evaluate your solution.
              </p>
            ) : (
              testResults.map((t, idx) => (
                <div
                  key={idx}
                  className={`flex items-start justify-between p-3 rounded-xl border ${
                    t.passed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-200"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {t.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-semibold">{t.description}</p>
                      {t.error && (
                        <p className="text-[11px] text-rose-400 font-mono mt-0.5">{t.error}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    t.passed ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                  }`}>
                    {t.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: Request Flow Simulator */}
        {activeTab === "simulator" && (
          <div className="p-3 space-y-4 font-sans">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Backend Request Pipeline Visualization</span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80">
                <span className="text-[10px] font-mono text-cyan-400 block">1. Client</span>
                <span className="text-white font-bold text-[11px]">HTTP Request</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80">
                <span className="text-[10px] font-mono text-purple-400 block">2. Middleware</span>
                <span className="text-white font-bold text-[11px]">Auth & Parser</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80">
                <span className="text-[10px] font-mono text-indigo-400 block">3. Router</span>
                <span className="text-white font-bold text-[11px]">Route Match</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80">
                <span className="text-[10px] font-mono text-amber-400 block">4. Controller</span>
                <span className="text-white font-bold text-[11px]">Business Logic</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80">
                <span className="text-[10px] font-mono text-emerald-400 block">5. Response</span>
                <span className="text-white font-bold text-[11px]">JSON (200 OK)</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
