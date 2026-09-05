"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, ArrowRight, Plus, Clock, Terminal } from "lucide-react";
import { api } from "@/lib/api";
import type { SavedWorkspace } from "@/lib/coding-lab-types";

export default function CodingLabRecentWidget() {
  const [workspaces, setWorkspaces] = useState<SavedWorkspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        const res = await api.get("/api/coding-lab/workspaces");
        if (res.success && res.data?.workspaces) {
          setWorkspaces(res.data.workspaces);
        }
      } catch (e) {
        console.error("Failed to load recent workspaces:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkspaces();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded mb-4" />
        <div className="h-16 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  const recent = workspaces.slice(0, 3);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">AI-Assisted Sandbox</p>
              <span className="flex items-center gap-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                <Terminal className="w-2.5 h-2.5" />
                Interactive
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Coding Lab Workspaces</h3>
          </div>
        </div>

        <Link
          href="/coding-lab"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
        >
          <span>Open AI Coding Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Content: Either Saved Workspaces or Quick Start Starters */}
      {recent.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((ws) => (
            <Link
              key={ws._id}
              href={`/coding-lab/workspace/${ws.template}?workspaceId=${ws._id}`}
              className="group rounded-2xl border border-white/[0.08] bg-slate-900/80 p-4 hover:border-indigo-500/40 hover:bg-slate-900 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-300 px-2 py-0.5 border border-indigo-500/20">
                    {ws.template}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(ws.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition line-clamp-1">
                  {ws.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {ws.files.length} {ws.files.length === 1 ? "file" : "files"} &bull; active: {ws.activeFile}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-indigo-400 font-medium">
                <span>Resume Coding</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            <Terminal className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-white">No active workspaces saved yet</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Explore 10 curated backend templates including Express APIs, Mongoose Schemas, Middleware pipelines, and error handlers with our interactive AI mentor.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              href="/coding-lab"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-lg shadow-indigo-600/25 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch a Template</span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
