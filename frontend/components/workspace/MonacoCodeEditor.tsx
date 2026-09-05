"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Copy, Check, RotateCcw, Code2 } from "lucide-react";

// Monaco Editor MUST be loaded client-side only.
// Direct import causes SSR to attempt rendering Monaco's Worker API on the server,
// which produces a silent [object Event] initialization failure at runtime.
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#070913]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        <span className="text-xs font-mono text-slate-500">Loading editor...</span>
      </div>
    </div>
  ),
});

interface MonacoCodeEditorProps {
  code: string;
  language?: string;
  onChange: (value: string) => void;
  onReset: () => void;
  fileName?: string;
}

export default function MonacoCodeEditor({
  code,
  language = "javascript",
  onChange,
  onReset,
  fileName = "index.js",
}: MonacoCodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable in some environments — silently skip
    }
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#070913] border-r border-slate-800 select-text overflow-hidden">

      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white">{fileName}</span>
          <span className="text-[10px] text-slate-500 font-sans uppercase">({language})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Format Code (Shift + Alt + F)"
          >
            Format
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer"
            title="Reset code to starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Banner */}
      {showResetConfirm && (
        <div className="flex items-center justify-between px-4 py-2 bg-rose-500/10 border-b border-rose-500/30 text-xs text-rose-200">
          <span>Are you sure you want to reset your code to the starter state?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onReset();
                setShowResetConfirm(false);
              }}
              className="px-2.5 py-0.5 rounded bg-rose-500 text-slate-950 font-bold hover:bg-rose-400 transition"
            >
              Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Monaco Editor Component */}
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          language={language === "js" ? "javascript" : language}
          value={code}
          theme="vs-dark"
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            minimap: { enabled: false },
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

    </div>
  );
}
