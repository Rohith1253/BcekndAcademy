"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Code2, 
  Layers, 
  FileCode, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  Lightbulb
} from "lucide-react";
import type { WorkspaceExercise } from "@/data/workspace-exercises";

interface WorkspaceExplorerProps {
  exercise: WorkspaceExercise;
  activeFile: string;
  onSelectFile: (fileName: string) => void;
  onSelectExercise?: (exerciseId: string) => void;
  allExercises?: WorkspaceExercise[];
}

export default function WorkspaceExplorer({
  exercise,
  activeFile,
  onSelectFile,
  onSelectExercise,
  allExercises = [],
}: WorkspaceExplorerProps) {
  const [showHints, setShowHints] = useState(false);
  const [unlockedHintIndex, setUnlockedHintIndex] = useState(0);

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 text-slate-100 overflow-y-auto scrollbar-thin">
      
      {/* Topic / Exercise Selector Dropdown */}
      {allExercises.length > 0 && onSelectExercise && (
        <div className="p-3 border-b border-slate-800 bg-slate-900/60">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Select Practice Exercise:
          </label>
          <select
            value={exercise.id}
            onChange={(e) => onSelectExercise(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-cyan-300 font-semibold outline-none focus:border-cyan-400"
          >
            {allExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                [{ex.difficulty}] {ex.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Exercise Title & Difficulty */}
      <div className="p-4 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
            {exercise.categoryLabel}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            {exercise.difficulty}
          </span>
        </div>

        <h2 className="text-base font-bold text-white leading-tight">
          {exercise.title}
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          {exercise.description}
        </p>
      </div>

      {/* Files Section */}
      <div className="p-4 border-b border-slate-800 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5" />
          Workspace Files
        </span>

        <div className="space-y-1">
          {exercise.files.map((file) => (
            <button
              key={file.name}
              onClick={() => onSelectFile(file.name)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition text-left ${
                activeFile === file.name
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Task Instructions
        </span>

        <div className="space-y-2">
          {exercise.instructions.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-cyan-400 shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expected Output */}
      {exercise.expectedOutput && (
        <div className="p-4 border-b border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Expected Output
          </span>
          <pre className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-[11px] font-mono text-emerald-300 leading-relaxed overflow-x-auto">
            {exercise.expectedOutput}
          </pre>
        </div>
      )}

      {/* Progressive Hints Section */}
      {exercise.hints && exercise.hints.length > 0 && (
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Progressive Hints ({unlockedHintIndex + 1}/{exercise.hints.length})
            </span>
          </div>

          <div className="space-y-2">
            {exercise.hints.slice(0, unlockedHintIndex + 1).map((hint, idx) => (
              <div key={idx} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300 block mb-1">Hint {idx + 1}:</strong>
                {hint}
              </div>
            ))}

            {unlockedHintIndex < exercise.hints.length - 1 && (
              <button
                onClick={() => setUnlockedHintIndex((prev) => prev + 1)}
                className="w-full text-center py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-slate-400 hover:text-white transition"
              >
                Unlock Next Hint
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
