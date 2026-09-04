"use client";

import React, { useRef, useState } from "react";
import { Copy, Check, RotateCcw, Code2 } from "lucide-react";
import type { VirtualFile } from "@/lib/coding-lab-types";

interface WorkspaceEditorProps {
  file: VirtualFile | null;
  onChangeContent: (content: string) => void;
  onResetFile: () => void;
}

export default function WorkspaceEditor({
  file,
  onChangeContent,
  onResetFile,
}: WorkspaceEditorProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">
        Select a file from the explorer to view and edit.
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const updated = val.substring(0, start) + "  " + val.substring(end);
      onChangeContent(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const lines = file.content.split("\n");

  return (
    <div className="flex flex-col h-full bg-[#050712] select-text">
      {/* Editor Tab Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-white">{file.path}</span>
          <span className="text-[10px] text-slate-500 uppercase">({file.language})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
            title="Copy code"
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

          <button
            type="button"
            onClick={onResetFile}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Reset this file"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative flex flex-1 overflow-hidden min-h-[360px]">
        {/* Line Numbers */}
        <div
          aria-hidden="true"
          className="select-none py-3.5 pl-3 pr-2 text-right font-mono text-xs text-slate-600 bg-slate-950/50 border-r border-white/[0.05] min-w-[42px]"
        >
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={file.content}
          onChange={(e) => onChangeContent(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          className="flex-1 w-full resize-none bg-transparent p-3.5 font-mono text-xs text-cyan-50 leading-6 outline-none selection:bg-cyan-500/30 overflow-y-auto"
          placeholder="// Write your code here..."
        />
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-t border-white/[0.06] text-[11px] font-mono text-slate-500 shrink-0">
        <span>Lines: {lines.length}</span>
        <span className="text-cyan-400/80">Draft Auto-Saved</span>
      </div>
    </div>
  );
}
