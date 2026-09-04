"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Layers,
  ShieldCheck,
  Search,
  Plus,
  Clock,
  Trash2,
  FolderCode,
  ArrowRight,
  Code2,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import TemplateCard from "@/components/coding-lab/TemplateCard";
import { CODING_LAB_TEMPLATES } from "@/lib/coding-lab-templates";
import { api } from "@/lib/api";
import type { SavedWorkspace } from "@/lib/coding-lab-types";

const CATEGORIES = ["All", "Fundamentals", "Express", "Database", "Advanced"];

export default function CodingLabCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [workspaces, setWorkspaces] = useState<SavedWorkspace[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch saved workspaces
  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const res = await api.get("/api/coding-lab/workspaces");
        if (res.success && res.data?.workspaces) {
          setWorkspaces(res.data.workspaces);
        }
      } catch (e) {
        console.error("Failed to load workspaces:", e);
      } finally {
        setLoadingWorkspaces(false);
      }
    }
    loadWorkspaces();
  }, []);

  // Handle workspace deletion
  const handleDeleteWorkspace = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this workspace?")) return;

    setDeletingId(id);
    try {
      const res = await api.delete(`/api/coding-lab/workspaces/${id}`);
      if (res.success) {
        setWorkspaces((prev) => prev.filter((w) => w._id !== id));
      } else {
        alert(res.error || "Failed to delete workspace");
      }
    } catch {
      alert("Error deleting workspace");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter templates
  const filteredTemplates = CODING_LAB_TEMPLATES.filter((template) => {
    const matchesCategory =
      selectedCategory === "All" ||
      template.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Boolean(template.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-20 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl flex flex-col gap-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-cyan-950/30 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-8 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Bot className="h-3.5 w-3.5 text-indigo-400" />
              <span>Next-Gen Full-Stack AI Sandbox</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              AI Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Lab</span>
            </h1>

            <p className="mt-4 text-base text-slate-300 leading-relaxed sm:text-lg">
              Develop, experiment, and test real Node.js and Express backend architectures in a sandboxed, multi-file environment. Get intelligent guidance from an AI mentor configured in pedagogical <span className="font-semibold text-cyan-300">Learning Mode</span>.
            </p>

            {/* Feature Badges */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
                <FolderCode className="h-5 w-5 text-indigo-400 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Multi-File FS</p>
                  <p className="text-[11px] text-slate-400">Virtual tree</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Secure Sandbox</p>
                  <p className="text-[11px] text-slate-400">Isolated Node VM</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
                <Sparkles className="h-5 w-5 text-cyan-400 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Learning Mode</p>
                  <p className="text-[11px] text-slate-400">Pedagogical hints</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
                <Layers className="h-5 w-5 text-fuchsia-400 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Cloud Workspaces</p>
                  <p className="text-[11px] text-slate-400">MongoDB storage</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Saved Workspaces Section (if user has any) */}
        {!loadingWorkspaces && workspaces.length > 0 && (
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Your Cloud Projects</p>
                <h2 className="text-2xl font-bold text-white mt-1">Saved Workspaces ({workspaces.length})</h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((ws) => (
                <div
                  key={ws._id}
                  className="group relative rounded-2xl border border-white/10 bg-slate-900/80 p-5 hover:border-indigo-500/40 hover:bg-slate-900 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 border border-indigo-500/20">
                        {ws.template}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteWorkspace(e, ws._id)}
                        disabled={deletingId === ws._id}
                        className="rounded-lg p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Delete Workspace"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                      {ws.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {ws.files.length} {ws.files.length === 1 ? "file" : "files"} &bull; active: {ws.activeFile}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>Updated {new Date(ws.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <Link
                      href={`/coding-lab/workspace/${ws.template}?workspaceId=${ws._id}`}
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white py-2 text-xs font-semibold transition"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick-Start Templates Catalog */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Interactive Starters</p>
              <h2 className="text-2xl font-bold text-white mt-1">Quick-Start Lab Templates</h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates & tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-1.5 text-xs font-medium transition cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "border border-indigo-500/40 bg-indigo-500/15 text-indigo-300 shadow-sm"
                    : "border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <Code2 className="mx-auto h-10 w-10 text-slate-500" />
              <h3 className="mt-3 text-base font-semibold text-white">No templates found</h3>
              <p className="mt-1 text-xs text-slate-400">
                Try adjusting your search query or category filter.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
