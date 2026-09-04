"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "javascript" | "typescript" | "json";
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-slate-950 rounded-lg border border-white/10 flex items-center justify-center">
        <p className="text-slate-400">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg border border-white/10 overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Courier New', monospace",
          lineNumbers: "on",
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: readOnly,
          padding: { top: 16, bottom: 16 },
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}
