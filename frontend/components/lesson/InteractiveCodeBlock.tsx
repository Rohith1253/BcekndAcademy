"use client";

import React, { useState } from "react";
import { Copy, Check, Play, RotateCcw, Terminal, ShieldCheck, Sparkles, Clock, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface InteractiveCodeBlockProps {
  initialCode: string;
  language?: string;
  title?: string;
  filename?: string;
}

export default function InteractiveCodeBlock({
  initialCode,
  language = "javascript",
  title,
  filename,
}: InteractiveCodeBlockProps) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [errorLines, setErrorLines] = useState<string[]>([]);
  const [executionStats, setExecutionStats] = useState<{
    executionTimeMs: number;
    provider: string;
    status: string;
  } | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutputLines([]);
    setErrorLines([]);
    setExecutionStats(null);
  };

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setErrorLines([]);
    setOutputLines(["⚡ Analyzing and executing backend code in safe simulation sandbox..."]);

    try {
      const res = await api.post("/api/code/execute", {
        language: language.toLowerCase(),
        code,
      });

      if (res.success && res.data) {
        setOutputLines(res.data.stdout || ["(No stdout output emitted)"]);
        setErrorLines(res.data.stderr || []);
        setExecutionStats({
          executionTimeMs: res.data.executionTimeMs || 15,
          provider: res.data.provider || "mock",
          status: res.data.status || "success",
        });
      } else {
        setErrorLines([res.error || "Execution failed in sandbox"]);
        setExecutionStats({
          executionTimeMs: 0,
          provider: "mock",
          status: "error",
        });
      }
    } catch (err: any) {
      setErrorLines([err.message || "Network execution error"]);
    } finally {
      setIsRunning(false);
    }
  };

  const lines = code.split("\n");

  return (
    <div className="not-prose my-8 rounded-3xl border border-white/10 bg-[#070b1a] shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-900/80 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-semibold text-slate-300 pl-1">
            {filename || `${language.toLowerCase()}-example.${language === "python" ? "py" : language === "rust" ? "rs" : language === "go" ? "go" : "js"}`}
          </span>
          {title && (
            <span className="text-xs text-slate-400 font-sans hidden sm:inline">
              — {title}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Reset to starter code"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition shadow-md ${
              isRunning
                ? "bg-cyan-600/40 text-slate-300 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 active:scale-95"
            }`}
          >
            {isRunning ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Example</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="relative flex bg-[#060918] font-mono text-xs sm:text-sm leading-relaxed overflow-hidden">
        {/* Line Numbers */}
        <div className="w-10 py-4 bg-[#050713] text-slate-600 text-right pr-2.5 select-none border-r border-white/5 flex flex-col">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editable Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={Math.max(6, Math.min(22, lines.length + 1))}
          className="flex-1 p-4 bg-transparent text-slate-200 resize-none font-mono text-xs sm:text-sm leading-6 focus:outline-none focus:ring-0 selection:bg-cyan-500/30 overflow-x-auto whitespace-pre tab-4"
        />
      </div>

      {/* Safe Simulation Mode Disclaimer Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#080c1d] px-4 py-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">Safe Simulation Mode</span>
          <span className="text-slate-500">• Provider: Mock Execution</span>
        </div>

        {executionStats && (
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <Clock className="h-3 w-3 text-cyan-400" />
            <span>{executionStats.executionTimeMs}ms</span>
            <span className={executionStats.status === "success" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              ● {executionStats.status.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Output Terminal Console */}
      {(outputLines.length > 0 || errorLines.length > 0) && (
        <div className="border-t border-white/10 bg-[#050815] p-4 font-mono text-xs space-y-1.5">
          <div className="flex items-center justify-between pb-1 text-[11px] font-sans font-bold uppercase tracking-wider text-cyan-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              Console Output
            </span>
            <button
              onClick={() => {
                setOutputLines([]);
                setErrorLines([]);
              }}
              className="text-slate-500 hover:text-slate-300 text-[10px] font-mono lowercase"
            >
              clear
            </button>
          </div>

          {outputLines.map((line, idx) => (
            <div key={idx} className="flex gap-2 text-slate-300">
              <span className="text-cyan-500 select-none">&gt;</span>
              <span className="break-all whitespace-pre-wrap">{line}</span>
            </div>
          ))}

          {errorLines.map((err, idx) => (
            <div key={idx} className="flex gap-2 text-rose-400 font-semibold pt-1">
              <span className="text-rose-500 select-none">!</span>
              <span className="break-all whitespace-pre-wrap">{err}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
