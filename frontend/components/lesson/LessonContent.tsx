"use client";

import React from "react";
import LessonContentRenderer, { LessonContentBlock } from "@/components/learning/LessonContentRenderer";

export interface LessonContentProps {
  blocks?: LessonContentBlock[] | unknown;
  content?: LessonContentBlock[] | unknown;
  defaultLanguage?: string;
  className?: string;
}

export default function LessonContent({
  blocks,
  content,
  defaultLanguage = "javascript",
  className = "",
}: LessonContentProps) {
  const data = content !== undefined ? content : blocks;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 sm:p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <LessonContentRenderer
        content={data}
        defaultLanguage={defaultLanguage}
        className={className}
      />
    </div>
  );
}

