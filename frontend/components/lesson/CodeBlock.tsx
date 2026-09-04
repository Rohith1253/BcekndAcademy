"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export default function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="not-prose my-6 rounded-[1.75rem] border border-white/10 bg-slate-950/90 shadow-2xl shadow-slate-950/30">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          {filename || language}
        </p>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-300" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-6 py-5 text-sm leading-7">
        <code className="text-slate-300">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              <span className="mr-4 inline-block w-8 text-right text-slate-600 select-none">
                {index + 1}
              </span>
              <span>{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
