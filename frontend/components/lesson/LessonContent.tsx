"use client";

import React from "react";
import { AlertCircle, Lightbulb, BookOpen, CheckCircle2, Zap } from "lucide-react";
import type { ContentBlock } from "@/data/lessons/types";
import CodeBlock from "@/components/lesson/CodeBlock";
import InteractiveDiagram from "@/components/lesson/InteractiveDiagram";

interface LessonContentProps {
  blocks: ContentBlock[];
}

function renderContentBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "heading":
      const HeadingTag = (`h${block.level || 2}` as any) as keyof React.JSX.IntrinsicElements;
      return React.createElement(
        HeadingTag,
        {
          key: index,
          className:
            block.level === 1
              ? "text-4xl font-semibold text-white mt-8 mb-4"
              : "text-2xl font-semibold text-white mt-6 mb-3",
        },
        block.content
      );

    case "paragraph":
      return (
        <p key={index} className="text-base leading-8 text-slate-300 mb-4">
          {block.content}
        </p>
      );

    case "code":
      return (
        <CodeBlock
          key={index}
          code={block.code || ""}
          language={block.language || "javascript"}
          filename={block.filename}
        />
      );

    case "diagram":
      return (
        <div key={index} className="my-6">
          {block.title && <h3 className="mb-4 text-lg font-semibold text-white">{block.title}</h3>}
          <InteractiveDiagram items={(block.data?.flow as string[]) || []} />
        </div>
      );

    case "tip":
      return (
        <div key={index} className="not-prose my-6 rounded-[1.75rem] border border-violet-500/20 bg-violet-500/10 p-6 shadow-lg shadow-slate-950/20">
          <div className="flex items-start gap-4">
            <Lightbulb className="h-6 w-6 flex-shrink-0 text-violet-300 mt-1" />
            <div>
              <p className="font-semibold text-white">{block.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{block.content}</p>
            </div>
          </div>
        </div>
      );

    case "warning":
      return (
        <div key={index} className="not-prose my-6 rounded-[1.75rem] border border-rose-500/20 bg-rose-500/10 p-6 shadow-lg shadow-slate-950/20">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 flex-shrink-0 text-rose-300 mt-1" />
            <div>
              <p className="font-semibold text-white">{block.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{block.content}</p>
            </div>
          </div>
        </div>
      );

    case "practice":
      return (
        <div key={index} className="not-prose my-6 rounded-[1.75rem] border border-sky-500/20 bg-sky-500/10 p-6 shadow-lg shadow-slate-950/20">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-sky-300 mt-1" />
            <div>
              <p className="font-semibold text-white mb-3">Key Points</p>
              <ul className="space-y-2">
                {block.items?.map((item, i) => (
                  <li key={i} className="text-sm leading-6 text-slate-300">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );

    case "example":
      return (
        <div key={index} className="not-prose my-6 rounded-[1.75rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-lg shadow-slate-950/20">
          <div className="flex items-start gap-4">
            <Zap className="h-6 w-6 flex-shrink-0 text-emerald-300 mt-1" />
            <div>
              <p className="font-semibold text-white">{block.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{block.content}</p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function LessonContent({ blocks }: LessonContentProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <div className="prose prose-invert max-w-none">
        {blocks.map((block, index) => renderContentBlock(block, index))}
      </div>
    </div>
  );
}
