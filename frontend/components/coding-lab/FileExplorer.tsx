"use client";

import React, { useState } from "react";
import { Folder, FileCode, Plus, Trash2, Edit2, Check, X, RotateCcw } from "lucide-react";
import type { VirtualFile } from "@/lib/coding-lab-types";

interface FileExplorerProps {
  files: VirtualFile[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  onCreateFile: (path: string) => void;
  onDeleteFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
  onResetWorkspace: () => void;
}

export default function FileExplorer({
  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  onResetWorkspace,
}: FileExplorerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    let path = newFileName.trim();
    if (!path.includes("/") && !path.startsWith("src/")) {
      path = `src/${path}`;
    }
    if (!path.includes(".")) {
      path = `${path}.js`;
    }
    onCreateFile(path);
    setNewFileName("");
    setIsCreating(false);
  };

  const handleRenameSubmit = (oldPath: string) => {
    if (!editingName.trim() || editingName === oldPath) {
      setEditingPath(null);
      return;
    }
    onRenameFile(oldPath, editingName.trim());
    setEditingPath(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#070914] text-slate-300 select-none">
      {/* Explorer Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-slate-950/60">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
          <Folder className="w-3.5 h-3.5 text-cyan-400" />
          <span>Files</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
            title="Create New File"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onResetWorkspace}
            className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Reset to Template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* New File Inline Form */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="p-2 border-b border-white/[0.06] bg-slate-900/80">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              autoFocus
              placeholder="e.g. routes/auth.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="flex-1 rounded-lg border border-cyan-500/50 bg-slate-950 px-2 py-1 text-xs text-white outline-none font-mono"
            />
            <button type="submit" className="p-1 text-emerald-400 hover:bg-white/[0.06] rounded">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1 text-slate-400 hover:bg-white/[0.06] rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* File List */}
      <div className="flex-1 p-2 space-y-1 overflow-y-auto font-mono text-xs">
        {files.map((file) => {
          const isActive = file.path === activeFilePath;
          const isEditing = editingPath === file.path;

          return (
            <div
              key={file.path}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              }`}
              onClick={() => onSelectFile(file.path)}
            >
              <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                {isEditing ? (
                  <input
                    type="text"
                    autoFocus
                    value={editingName}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleRenameSubmit(file.path)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSubmit(file.path);
                      if (e.key === "Escape") setEditingPath(null);
                    }}
                    className="w-full bg-slate-950 px-1 py-0.5 rounded border border-cyan-500 text-white outline-none"
                  />
                ) : (
                  <span className="truncate">{file.path}</span>
                )}
              </div>

              {/* Action Buttons (shown on hover or active) */}
              {!isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPath(file.path);
                      setEditingName(file.path);
                    }}
                    className="p-1 text-slate-500 hover:text-slate-300 rounded"
                    title="Rename"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  {files.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(file.path);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded"
                      title="Delete file"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
