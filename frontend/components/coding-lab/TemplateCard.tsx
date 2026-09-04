"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Server, Database, Shield, Cpu } from "lucide-react";
import type { CodingLabTemplate } from "@/lib/coding-lab-types";

interface TemplateCardProps {
  template: CodingLabTemplate;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "express":
      case "rest api":
        return <Server className="w-4 h-4 text-cyan-400" />;
      case "database":
      case "mongoose":
        return <Database className="w-4 h-4 text-emerald-400" />;
      case "authentication":
      case "middleware":
        return <Shield className="w-4 h-4 text-fuchsia-400" />;
      default:
        return <Code2 className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-cyan-950/20">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1 text-[11px] font-mono text-slate-300 uppercase">
            {getCategoryIcon(template.category)}
            <span>{template.category}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {template.files.length} file{template.files.length > 1 ? "s" : ""}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
          {template.name}
        </h3>

        <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
          {template.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500">
          Entry: {template.activeFile}
        </span>

        <Link
          href={`/coding-lab/workspace/${template.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition"
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
