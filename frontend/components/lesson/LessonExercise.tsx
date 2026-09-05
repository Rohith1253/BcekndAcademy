"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Code2, Terminal, RotateCcw, Lightbulb, Play, ArrowRight, Bug, HelpCircle } from "lucide-react";
import { api } from "@/lib/api";

export interface ExerciseDefinition {
  id: string;
  type: "multiple-choice" | "predict-output" | "fill-in-blank" | "debug-code" | "code-exercise";
  title: string;
  prompt: string;
  starterCode?: string;
  expectedOutput?: string;
  options?: string[];
  correctOptionIndex?: number;
  expectedBlankAnswer?: string;
  hint?: string;
  explanation?: string;
  language?: string;
}

interface LessonExerciseProps {
  exercise: ExerciseDefinition;
  onComplete?: (exerciseId: string, passed: boolean) => void;
  isCompleted?: boolean;
}

export default function LessonExercise({
  exercise,
  onComplete,
  isCompleted: initialCompleted = false,
}: LessonExerciseProps) {
  const [userCode, setUserCode] = useState(exercise.starterCode || "");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [blankInput, setBlankInput] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">(initialCompleted ? "correct" : "idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  // 1. Multiple Choice / Predict Output Handler
  const handleCheckOption = (optIndex: number) => {
    setSelectedOption(optIndex);
    const isCorrect = optIndex === exercise.correctOptionIndex;
    setStatus(isCorrect ? "correct" : "incorrect");
    setFeedback(isCorrect ? "✓ Correct! Great job identifying the expected output." : "✗ Not quite. Review the concept and try again.");
    if (isCorrect && onComplete) {
      onComplete(exercise.id, true);
    }
  };

  // 2. Fill in the Blank Handler
  const handleCheckBlank = () => {
    const cleanUser = blankInput.trim().toLowerCase();
    const cleanExpected = (exercise.expectedBlankAnswer || "").trim().toLowerCase();
    const isCorrect = cleanUser === cleanExpected;
    setStatus(isCorrect ? "correct" : "incorrect");
    setFeedback(isCorrect ? "✓ Correct keyword!" : `✗ Not quite. Expected "${exercise.expectedBlankAnswer}".`);
    if (isCorrect && onComplete) {
      onComplete(exercise.id, true);
    }
  };

  // 3. Code & Debug Code Handler (Uses safe simulation)
  const handleRunCode = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    setFeedback(null);

    try {
      const res = await api.post("/api/code/execute", {
        language: (exercise.language || "javascript").toLowerCase(),
        code: userCode,
      });

      if (res.success && res.data) {
        const stdout = (res.data.stdout || []).join("\n").trim();
        const expected = (exercise.expectedOutput || "").trim();

        const isMatch = expected ? stdout.includes(expected) : res.data.status === "success";
        setStatus(isMatch ? "correct" : "incorrect");
        setFeedback(
          isMatch
            ? "✓ Output matches expected result! Exercise completed (+30 XP)."
            : `Output: "${stdout}"\nExpected: "${expected}"`
        );

        if (isMatch && onComplete) {
          onComplete(exercise.id, true);
        }
      } else {
        setStatus("incorrect");
        setFeedback(res.error || "Simulation evaluation failed.");
      }
    } catch (err: any) {
      setStatus("incorrect");
      setFeedback(err.message || "Failed to execute exercise code.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setUserCode(exercise.starterCode || "");
    setSelectedOption(null);
    setBlankInput("");
    setStatus("idle");
    setFeedback(null);
    setShowHint(false);
  };

  return (
    <div className="not-prose my-8 rounded-3xl border border-cyan-500/30 bg-[#070b1a] p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {exercise.type === "debug-code" ? <Bug className="h-5 w-5" /> : <Code2 className="h-5 w-5" />}
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Hands-On Exercise • {exercise.type.replace("-", " ")}
            </span>
            <h4 className="text-lg font-bold text-white">{exercise.title}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {exercise.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              <span>Hint</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Prompt */}
      <p className="text-sm text-slate-200 leading-relaxed mb-5">{exercise.prompt}</p>

      {/* Hint Banner */}
      {showHint && exercise.hint && (
        <div className="mb-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
          💡 <strong>Hint:</strong> {exercise.hint}
        </div>
      )}

      {/* Mode 1: Multiple Choice or Predict Output */}
      {(exercise.type === "multiple-choice" || exercise.type === "predict-output") && exercise.options && (
        <div className="space-y-2.5 mb-5">
          {exercise.options.map((opt, idx) => {
            let optStyle = "border-white/10 bg-slate-900/60 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900";
            if (selectedOption !== null) {
              if (idx === exercise.correctOptionIndex) {
                optStyle = "border-emerald-500/50 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/40";
              } else if (idx === selectedOption) {
                optStyle = "border-rose-500/50 bg-rose-950/40 text-rose-200 line-through ring-1 ring-rose-500/40";
              } else {
                optStyle = "border-white/5 bg-slate-950/40 text-slate-500 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={status === "correct"}
                onClick={() => handleCheckOption(idx)}
                className={`w-full text-left rounded-2xl border p-3.5 text-xs sm:text-sm transition flex items-start gap-3 cursor-pointer ${optStyle}`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-slate-950 font-mono text-xs font-bold text-slate-400 border border-white/10">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mode 2: Fill in the Blank */}
      {exercise.type === "fill-in-blank" && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={blankInput}
            onChange={(e) => setBlankInput(e.target.value)}
            placeholder="Type your answer here..."
            className="flex-1 min-w-[200px] rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none"
          />
          <button
            onClick={handleCheckBlank}
            className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition cursor-pointer"
          >
            Check Answer
          </button>
        </div>
      )}

      {/* Mode 3: Code Exercise & Debugging */}
      {(exercise.type === "code-exercise" || exercise.type === "debug-code") && (
        <div className="mb-5 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-[#050815] overflow-hidden">
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              spellCheck={false}
              rows={Math.max(6, userCode.split("\n").length + 1)}
              className="w-full bg-transparent p-4 font-mono text-xs text-slate-200 resize-none focus:outline-none focus:ring-0 leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleRunCode}
              disabled={isEvaluating}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-lg cursor-pointer ${
                isEvaluating
                  ? "bg-cyan-600/40 text-slate-300 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 active:scale-95"
              }`}
            >
              {isEvaluating ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Run & Check Output</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Result Feedback Banner */}
      {status !== "idle" && (
        <div
          className={`rounded-2xl border p-4 text-xs sm:text-sm transition ${
            status === "correct"
              ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
              : "border-rose-500/40 bg-rose-950/30 text-rose-300"
          }`}
        >
          <div className="flex items-start gap-3">
            {status === "correct" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-bold text-white text-sm">
                {status === "correct" ? "Exercise Completed!" : "Check Failed"}
              </p>
              <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">{feedback}</p>
              {exercise.explanation && status === "correct" && (
                <p className="mt-2 text-xs text-slate-400">
                  <strong>Explanation:</strong> {exercise.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
