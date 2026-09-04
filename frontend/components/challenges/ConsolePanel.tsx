"use client";

import React from "react";
import { Terminal, Clock, Trash2 } from "lucide-react";
import type { ExecutionLog } from "@/lib/challenge-types";

interface ConsolePanelProps {
  logs: ExecutionLog[];
  executionTime: number;
  onClear: () => void;
}

export default function ConsolePanel({ logs, executionTime, onClear }: ConsolePanelProps) {
  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Standard Output / Runtime Logs</span>
        </div>

        <div className="flex items-center gap-3">
          {executionTime > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-cyan-400" /> {executionTime}ms
            </span>
          )}
          {logs.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
              title="Clear console output"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Output Console Log Stream */}
      <div className="flex-1 font-mono text-xs rounded-xl bg-slate-950/60 p-3 overflow-y-auto space-y-1.5 min-h-[140px] max-h-[260px] border border-white/[0.04]">
        {logs.length === 0 ? (
          <p className="text-slate-600 italic">No console logs captured during execution.</p>
        ) : (
          logs.map((log, idx) => {
            const color = {
              log: "text-slate-200",
              error: "text-rose-400 font-semibold",
              warn: "text-amber-300",
              info: "text-cyan-300",
            }[log.type] || "text-slate-200";

            return (
              <div key={idx} className={`leading-relaxed whitespace-pre-wrap break-all ${color}`}>
                <span className="select-none text-slate-600 mr-2 text-[10px]">&gt;</span>
                {log.message}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
