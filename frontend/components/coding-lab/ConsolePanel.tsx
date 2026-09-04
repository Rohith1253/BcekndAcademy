"use client";

import React from "react";
import { Terminal, Clock, Trash2, Bot, AlertTriangle } from "lucide-react";
import type { ExecutionOutcome } from "@/lib/coding-lab-types";

interface ConsolePanelProps {
  outcome: ExecutionOutcome | null;
  isRunning: boolean;
  onClear: () => void;
  onAskAiDebug: (errorMessage: string) => void;
}

export default function ConsolePanel({
  outcome,
  isRunning,
  onClear,
  onAskAiDebug,
}: ConsolePanelProps) {
  if (isRunning) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400 font-mono text-xs gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <span>Executing virtual backend environment...</span>
      </div>
    );
  }

  const hasErrors = outcome?.errors && outcome.errors.length > 0;
  const firstError = hasErrors ? outcome!.errors[0] : "";

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Console Top Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Output &amp; Express Pipeline</span>
        </div>

        <div className="flex items-center gap-3">
          {hasErrors && (
            <button
              type="button"
              onClick={() => onAskAiDebug(firstError)}
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/25 transition shadow-sm animate-pulse"
            >
              <Bot className="w-3.5 h-3.5 text-rose-400" />
              <span>Ask AI to Debug</span>
            </button>
          )}

          {outcome && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-cyan-400" /> {outcome.executionTime}ms
            </span>
          )}

          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      {/* Console Stream */}
      <div className="flex-1 font-mono text-xs rounded-xl bg-slate-950/70 p-3 overflow-y-auto space-y-1 min-h-[140px] max-h-[260px] border border-white/[0.05]">
        {!outcome || (outcome.output.length === 0 && outcome.errors.length === 0) ? (
          <p className="text-slate-600 italic">Click Run to execute code in the virtual sandbox.</p>
        ) : (
          <>
            {outcome.output.map((line, idx) => {
              let color = "text-slate-200";
              if (line.startsWith("[HTTP Response]")) color = "text-emerald-400 font-semibold";
              else if (line.startsWith("[Express Route]")) color = "text-cyan-300";
              else if (line.startsWith("[Mock Server]")) color = "text-amber-300";
              else if (line.startsWith("[ERROR]") || line.startsWith("[Runtime Error]"))
                color = "text-rose-400 font-bold";

              return (
                <div key={idx} className={`leading-relaxed whitespace-pre-wrap break-all ${color}`}>
                  <span className="select-none text-slate-600 mr-2 text-[10px]">&gt;</span>
                  {line}
                </div>
              );
            })}

            {hasErrors && (
              <div className="mt-2 pt-2 border-t border-rose-500/20 text-rose-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Error encountered during execution:</span>
                  <p className="mt-0.5 text-xs text-rose-300">{firstError}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
