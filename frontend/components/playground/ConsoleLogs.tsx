"use client";

import { useEffect, useRef } from "react";

interface ConsoleLogs {
  log: string[];
  error: string[];
  warn: string[];
}

interface ConsoloLogsProps {
  logs: ConsoleLogs;
  onClear: () => void;
}

export default function ConsoleLogs({ logs, onClear }: ConsoloLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const allLogs = [
    ...logs.log.map((l) => ({ type: "log", message: l })),
    ...logs.warn.map((l) => ({ type: "warn", message: l })),
    ...logs.error.map((l) => ({ type: "error", message: l })),
  ];

  return (
    <div className="flex h-full flex-col bg-slate-950 rounded-lg border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Console Output</h3>
        <button
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-white transition"
        >
          Clear
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"
      >
        {allLogs.length === 0 ? (
          <p className="text-slate-600">Ready to run code...</p>
        ) : (
          allLogs.map((log, i) => (
            <div
              key={i}
              className={`${
                log.type === "error"
                  ? "text-rose-400"
                  : log.type === "warn"
                    ? "text-amber-400"
                    : "text-slate-300"
              }`}
            >
              {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
