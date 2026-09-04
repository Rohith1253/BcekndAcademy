"use client";

import React, { useState, useRef } from "react";
import { Copy, Check, RotateCcw, Code2 } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onReset: () => void;
  starterCode: string;
}

export default function CodeEditor({ code, onChange, onReset, starterCode }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enable 2-space tab indentation in textarea
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const updated = val.substring(0, start) + "  " + val.substring(end);
      onChange(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const lines = code.split("\n");

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/[0.1] bg-[#070913] overflow-hidden shadow-2xl">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-semibold">solution.js</span>
          <span className="text-[10px] text-slate-500 font-sans">(JavaScript ES2022)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {showResetConfirm ? (
            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg">
              <span className="text-[11px] text-rose-300">Reset code?</span>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setShowResetConfirm(false);
                }}
                className="text-[11px] font-bold text-rose-400 hover:underline px-1"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="text-[11px] text-slate-400 hover:text-white px-1"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Reset code to original starter code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Area with Line Numbers */}
      <div className="relative flex flex-1 overflow-hidden min-h-[360px] sm:min-h-[420px]">
        {/* Line Numbers Column */}
        <div
          aria-hidden="true"
          className="select-none py-3.5 pl-3 pr-2 text-right font-mono text-xs text-slate-600 bg-slate-950/40 border-r border-white/[0.05] min-w-[40px]"
        >
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          className="flex-1 w-full resize-none bg-transparent p-3.5 font-mono text-xs text-cyan-50 leading-6 outline-none selection:bg-cyan-500/30 overflow-y-auto"
          placeholder="// Write your code here..."
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950/90 border-t border-white/[0.05] text-[11px] font-mono text-slate-500">
        <span>Lines: {lines.length}</span>
        <span className="text-cyan-400/80">Draft auto-saved</span>
      </div>
    </div>
  );
}
