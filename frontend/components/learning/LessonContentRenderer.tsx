"use client";

import React, { useMemo } from "react";
import {
  AlertCircle,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Zap,
  Info,
  Quote,
  Table as TableIcon,
  Layers,
} from "lucide-react";
import InteractiveCodeBlock from "@/components/lesson/InteractiveCodeBlock";
import QuickCheck from "@/components/lesson/QuickCheck";
import InteractiveDiagram from "@/components/lesson/InteractiveDiagram";

export type SupportedBlockType =
  | "heading"
  | "paragraph"
  | "text"
  | "code"
  | "interactive_code"
  | "diagram"
  | "callout"
  | "note"
  | "tip"
  | "warning"
  | "danger"
  | "success"
  | "info"
  | "practice"
  | "key_points"
  | "summary"
  | "exercise"
  | "quick_check"
  | "checkpoint"
  | "example"
  | "list"
  | "bullet_list"
  | "numbered_list"
  | "table"
  | "quote"
  | "blockquote"
  | "image"
  | "video";

export interface HeadingBlock {
  type: "heading";
  level?: 1 | 2 | 3 | 4;
  content?: string;
  text?: string;
  title?: string;
}

export interface ParagraphBlock {
  type: "paragraph";
  content?: string;
  text?: string;
  body?: string;
}

export interface TextBlock {
  type: "text";
  title?: string;
  body?: string;
  content?: string;
  text?: string;
  heading?: string;
}

export interface CodeBlockData {
  type: "code" | "interactive_code";
  code?: string;
  content?: string;
  body?: string;
  language?: string;
  title?: string;
  filename?: string;
}

export interface DiagramBlock {
  type: "diagram";
  title?: string;
  caption?: string;
  body?: string;
  content?: string;
  flow?: string[];
  items?: string[];
  data?: {
    flow?: string[];
    [key: string]: unknown;
  };
}

export interface CalloutBlock {
  type: "callout" | "note" | "tip" | "warning" | "danger" | "success" | "info";
  variant?: "info" | "warning" | "success" | "tip" | "danger";
  title?: string;
  body?: string;
  content?: string;
  text?: string;
}

export interface PracticeBlock {
  type: "practice" | "key_points" | "summary";
  title?: string;
  items?: string[];
  content?: string;
  body?: string;
}

export interface ExerciseBlock {
  type: "exercise";
  title?: string;
  body?: string;
  content?: string;
  steps?: string[];
}

export interface QuickCheckBlock {
  type: "quick_check" | "checkpoint";
  title?: string;
  questions?: any[];
  data?: {
    questions?: any[];
  };
}

export interface ExampleBlock {
  type: "example";
  title?: string;
  content?: string;
  body?: string;
}

export interface ListBlock {
  type: "list" | "bullet_list" | "numbered_list";
  title?: string;
  items?: string[];
  ordered?: boolean;
}

export interface TableBlock {
  type: "table";
  title?: string;
  caption?: string;
  headers?: string[];
  rows?: (string | number)[][];
}

export interface QuoteBlock {
  type: "quote" | "blockquote";
  quote?: string;
  text?: string;
  content?: string;
  body?: string;
  author?: string;
  source?: string;
}

export type LessonContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | TextBlock
  | CodeBlockData
  | DiagramBlock
  | CalloutBlock
  | PracticeBlock
  | ExerciseBlock
  | QuickCheckBlock
  | ExampleBlock
  | ListBlock
  | TableBlock
  | QuoteBlock
  | Record<string, any>;

export interface LessonContentRendererProps {
  content: unknown;
  defaultLanguage?: string;
  className?: string;
}

function normalizeContent(rawContent: unknown): LessonContentBlock[] {
  if (rawContent === null || rawContent === undefined) {
    return [];
  }

  if (typeof rawContent === "string") {
    const trimmed = rawContent.trim();
    if (!trimmed) return [];

    if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeContent(parsed);
      } catch {
        // continue
      }
    }

    const chunks = trimmed.split(/\n{2,}/);
    return chunks.map((chunk) => {
      const c = chunk.trim();
      if (c.startsWith("# ")) {
        return { type: "heading", level: 1, content: c.replace(/^#\s+/, "") };
      }
      if (c.startsWith("## ")) {
        return { type: "heading", level: 2, content: c.replace(/^##\s+/, "") };
      }
      if (c.startsWith("### ")) {
        return { type: "heading", level: 3, content: c.replace(/^###\s+/, "") };
      }
      if (c.startsWith("```")) {
        const cLines = c.split("\n");
        const langMatch = cLines[0].replace(/^```/, "").trim();
        const lastLine = cLines[cLines.length - 1];
        const codeLines = cLines.slice(1, lastLine.startsWith("```") ? -1 : undefined);
        return {
          type: "code",
          language: langMatch || "javascript",
          code: codeLines.join("\n"),
        };
      }
      return { type: "paragraph", content: c };
    });
  }

  if (Array.isArray(rawContent)) {
    const result: LessonContentBlock[] = [];
    for (const item of rawContent) {
      if (item === null || item === undefined) continue;
      if (typeof item === "string") {
        result.push({ type: "paragraph", content: item });
      } else if (typeof item === "object") {
        result.push(item as LessonContentBlock);
      }
    }
    return result;
  }

  if (typeof rawContent === "object") {
    return [rawContent as LessonContentBlock];
  }

  return [];
}

function renderBlock(block: LessonContentBlock, index: number, defaultLanguage: string): React.ReactNode {
  if (!block || typeof block !== "object") return null;

  const b = block as any;
  const rawType = (b.type || "").toLowerCase();

  if (rawType === "heading") {
    const level = b.level || 2;
    const text = b.content || b.text || b.title || b.body || "";
    if (!text) return null;

    if (level === 1) {
      return (
        <h1 key={"h1-" + index} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-8 mb-4 border-b border-white/10 pb-3">
          {text}
        </h1>
      );
    }
    if (level === 2) {
      return (
        <h2 key={"h2-" + index} className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight mt-8 mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block" />
          {text}
        </h2>
      );
    }
    if (level === 3) {
      return (
        <h3 key={"h3-" + index} className="text-lg sm:text-xl font-bold text-cyan-200 mt-6 mb-3">
          {text}
        </h3>
      );
    }
    return (
      <h4 key={"h4-" + index} className="text-base sm:text-lg font-semibold text-slate-200 mt-4 mb-2">
        {text}
      </h4>
    );
  }

  if (rawType === "paragraph") {
    const text = b.content || b.text || b.body || "";
    if (!text) return null;

    return (
      <p key={"p-" + index} className="text-base sm:text-lg leading-relaxed sm:leading-8 text-slate-300 mb-5">
        {text}
      </p>
    );
  }

  if (rawType === "text") {
    const title = b.title || b.heading;
    const body = b.body || b.content || b.text || "";

    return (
      <div key={"text-" + index} className="my-6 space-y-4">
        {title && (
          <h3 className="text-xl sm:text-2xl font-bold text-cyan-300 tracking-tight flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            {title}
          </h3>
        )}
        {body && (
          <div className="space-y-3">
            {body.split("\n\n").map((para: string, pIdx: number) => {
              const trimmed = para.trim();
              if (trimmed.startsWith("1.") || trimmed.startsWith("2.") || trimmed.startsWith("3.") || trimmed.startsWith("4.")) {
                const listItems = trimmed.split("\n").map((l: string) => l.replace(/^\d+\.\s*/, "").trim());
                return (
                  <ol key={"ol-" + pIdx} className="list-decimal pl-6 space-y-2 text-base text-slate-300">
                    {listItems.map((item: string, iIdx: number) => (
                      <li key={"li-" + iIdx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ol>
                );
              }
              if (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("+") || trimmed.startsWith("•")) {
                const listItems = trimmed.split("\n").map((l: string) => l.replace(/^[-*+•]\s*/, "").trim());
                return (
                  <ul key={"ul-" + pIdx} className="list-disc pl-6 space-y-2 text-base text-slate-300">
                    {listItems.map((item: string, iIdx: number) => (
                      <li key={"li-" + iIdx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={"p-" + pIdx} className="text-base sm:text-lg leading-relaxed sm:leading-8 text-slate-300">
                  {trimmed}
                </p>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (rawType === "code" || rawType === "interactive_code") {
    const codeString = b.code || b.content || b.body || "";
    const lang = b.language || defaultLanguage || "javascript";

    return (
      <InteractiveCodeBlock
        key={"code-" + index}
        initialCode={codeString}
        language={lang}
        title={b.title}
        filename={b.filename}
      />
    );
  }

  if (
    rawType === "callout" ||
    rawType === "note" ||
    rawType === "tip" ||
    rawType === "warning" ||
    rawType === "danger" ||
    rawType === "success" ||
    rawType === "info"
  ) {
    const variant = (b.variant || (rawType !== "callout" ? rawType : "info")).toLowerCase();
    const isWarn = variant === "warning" || variant === "danger";
    const isSuccess = variant === "success";
    const isTip = variant === "tip";

    const borderClass = isWarn
      ? "border-rose-500/30 bg-rose-500/10"
      : isSuccess
      ? "border-emerald-500/30 bg-emerald-500/10"
      : isTip
      ? "border-violet-500/30 bg-violet-500/10"
      : "border-cyan-500/30 bg-cyan-500/10";

    const iconColor = isWarn
      ? "text-rose-400"
      : isSuccess
      ? "text-emerald-400"
      : isTip
      ? "text-violet-400"
      : "text-cyan-400";

    const title = b.title || (isWarn ? "Warning" : isSuccess ? "Success" : isTip ? "Pro Tip" : "Important Note");
    const body = b.body || b.content || b.text || "";

    return (
      <div
        key={"callout-" + index}
        className={"not-prose my-6 rounded-2xl border p-5 sm:p-6 shadow-lg shadow-slate-950/20 backdrop-blur-md " + borderClass}
      >
        <div className="flex items-start gap-3.5">
          {isWarn ? (
            <AlertCircle className={"h-6 w-6 shrink-0 mt-0.5 " + iconColor} />
          ) : isTip ? (
            <Lightbulb className={"h-6 w-6 shrink-0 mt-0.5 " + iconColor} />
          ) : isSuccess ? (
            <CheckCircle2 className={"h-6 w-6 shrink-0 mt-0.5 " + iconColor} />
          ) : (
            <Info className={"h-6 w-6 shrink-0 mt-0.5 " + iconColor} />
          )}
          <div className="flex-1 min-w-0">
            {title && <p className="font-bold text-white text-base leading-snug">{title}</p>}
            {body && <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-slate-200">{body}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (rawType === "diagram") {
    const title = b.title;
    const flowItems = (b.data?.flow as string[]) || b.flow || (b.items as string[]) || [];

    return (
      <div key={"diagram-" + index} className="my-8 space-y-4">
        {title && (
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
        )}
        {flowItems.length > 0 ? (
          <InteractiveDiagram items={flowItems} />
        ) : (
          <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/80 text-sm leading-relaxed text-slate-300">
            {b.body || b.caption || b.content}
          </div>
        )}
      </div>
    );
  }

  if (rawType === "practice" || rawType === "key_points" || rawType === "summary") {
    const title = b.title || (rawType === "practice" ? "Practice Points" : "Key Takeaways");
    const items = b.items || [];
    const body = b.body || b.content || "";

    return (
      <div
        key={"practice-" + index}
        className="not-prose my-6 rounded-2xl border border-sky-500/30 bg-sky-950/20 p-5 sm:p-6 shadow-lg shadow-slate-950/20"
      >
        <div className="flex items-start gap-3.5">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-sky-400 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-base leading-snug">{title}</p>
            {items.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {items.map((item: string, i: number) => (
                  <li key={"pt-" + i} className="text-sm sm:text-base leading-relaxed text-slate-200 flex items-start gap-2">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : body ? (
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-200">{body}</p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (rawType === "exercise") {
    const title = b.title || "Hands-on Exercise";
    const body = b.body || b.content || "";
    const steps = b.steps || (body ? body.split("\n\n") : []);

    return (
      <div
        key={"exercise-" + index}
        className="not-prose my-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 sm:p-6 shadow-lg shadow-slate-950/20"
      >
        <div className="flex items-start gap-3.5">
          <BookOpen className="h-6 w-6 shrink-0 text-amber-400 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-base leading-snug">{title}</p>
            <div className="mt-3 space-y-2.5">
              {steps.map((step: string, sIdx: number) => (
                <div key={"step-" + sIdx} className="text-sm sm:text-base leading-relaxed text-slate-200 flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-mono font-bold text-amber-300">
                    {sIdx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (rawType === "quick_check" || rawType === "checkpoint") {
    const questions = b.questions || b.data?.questions;
    if (!questions || questions.length === 0) return null;

    return (
      <QuickCheck
        key={"quickcheck-" + index}
        questions={questions}
        title={b.title || "Concept Check"}
      />
    );
  }

  if (rawType === "example") {
    const title = b.title || "Real-World Example";
    const body = b.content || b.body || "";

    return (
      <div
        key={"example-" + index}
        className="not-prose my-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 sm:p-6 shadow-lg shadow-slate-950/20"
      >
        <div className="flex items-start gap-3.5">
          <Zap className="h-6 w-6 shrink-0 text-emerald-400 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-base leading-snug">{title}</p>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-200">{body}</p>
          </div>
        </div>
      </div>
    );
  }

  if (rawType === "list" || rawType === "bullet_list" || rawType === "numbered_list") {
    const isOrdered = b.ordered || rawType === "numbered_list";
    const items = b.items || [];
    const title = b.title;

    return (
      <div key={"list-" + index} className="my-6 space-y-3">
        {title && <h4 className="text-lg font-bold text-white">{title}</h4>}
        {isOrdered ? (
          <ol className="list-decimal pl-6 space-y-2 text-base text-slate-300">
            {items.map((item: string, iIdx: number) => (
              <li key={"oli-" + iIdx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ol>
        ) : (
          <ul className="list-disc pl-6 space-y-2 text-base text-slate-300">
            {items.map((item: string, iIdx: number) => (
              <li key={"uli-" + iIdx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (rawType === "table") {
    const headers = b.headers || [];
    const rows = b.rows || [];
    const title = b.title || b.caption;

    return (
      <div key={"table-" + index} className="my-8 space-y-3">
        {title && (
          <div className="flex items-center gap-2">
            <TableIcon className="h-4 w-4 text-cyan-400" />
            <h4 className="text-base font-bold text-white">{title}</h4>
          </div>
        )}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/80">
          <table className="w-full text-left text-sm text-slate-300">
            {headers.length > 0 && (
              <thead className="bg-slate-950/80 text-xs uppercase font-mono tracking-wider text-cyan-400 border-b border-white/10">
                <tr>
                  {headers.map((h: string, hIdx: number) => (
                    <th key={"th-" + hIdx} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-white/5 font-sans">
              {rows.map((row: (string | number)[], rIdx: number) => (
                <tr key={"tr-" + rIdx} className="hover:bg-slate-800/40 transition">
                  {row.map((cell: string | number, cIdx: number) => (
                    <td key={"td-" + cIdx} className="px-4 py-3 text-slate-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (rawType === "quote" || rawType === "blockquote") {
    const quoteText = b.quote || b.content || b.body || b.text;
    const author = b.author || b.source;

    return (
      <blockquote
        key={"quote-" + index}
        className="my-6 rounded-2xl border-l-4 border-violet-500 bg-violet-950/20 p-5 sm:p-6 shadow-inner"
      >
        <div className="flex items-start gap-3">
          <Quote className="h-6 w-6 text-violet-400 shrink-0 mt-1" />
          <div>
            <p className="text-base sm:text-lg italic text-slate-200 leading-relaxed">\"{quoteText}\"</p>
            {author && <p className="mt-2 text-xs font-mono font-semibold text-violet-300">— {author}</p>}
          </div>
        </div>
      </blockquote>
    );
  }

  const fallbackText = b.content || b.body || b.text || b.description || b.title;
  if (typeof fallbackText === "string" && fallbackText.trim()) {
    return (
      <p key={"fallback-" + index} className="text-base leading-relaxed text-slate-300 mb-4">
        {fallbackText}
      </p>
    );
  }

  return null;
}

export default function LessonContentRenderer({
  content,
  defaultLanguage = "javascript",
  className = "",
}: LessonContentRendererProps) {
  const blocks = useMemo(() => normalizeContent(content), [content]);

  if (!blocks || blocks.length === 0) {
    return (
      <div className={"rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-slate-400 " + className}>
        <BookOpen className="mx-auto h-8 w-8 text-slate-500 mb-2" />
        <p className="text-base font-semibold text-slate-300">No lesson content is available yet.</p>
        <p className="text-xs text-slate-500 mt-1">Content is being prepared for this lesson.</p>
      </div>
    );
  }

  return (
    <div className={"lesson-content-container space-y-4 " + className}>
      {blocks.map((block, index) => renderBlock(block, index, defaultLanguage))}
    </div>
  );
}
