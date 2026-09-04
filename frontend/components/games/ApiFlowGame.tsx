"use client";

import React, { useState } from "react";
import { GameScenario } from "@/games/types";
import { CheckCircle2, ArrowRight, RotateCcw, Play } from "lucide-react";

interface ApiFlowGameProps {
  scenarios: GameScenario[];
  onComplete: (answers: Record<string, any>) => void;
}

export default function ApiFlowGame({ scenarios, onComplete }: ApiFlowGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentScenario = scenarios[currentIndex];
  const isLast = currentIndex === scenarios.length - 1;

  if (!currentScenario) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 text-center text-slate-400">
        <p className="text-sm font-medium">No scenarios available for this challenge.</p>
      </div>
    );
  }

  const defaultLayers = currentScenario.options || ["Client", "Route Matcher", "Authentication Middleware", "Controller", "Service / Database", "JSON Response"];
  
  // Shuffled or selectable options
  const availableOptions = defaultLayers.filter((item) => !userOrder.includes(item));

  const handleSelectItem = (item: string) => {
    if (showFeedback) return;
    setUserOrder((prev) => [...prev, item]);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    if (showFeedback) return;
    setUserOrder((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleResetOrder = () => {
    if (showFeedback) return;
    setUserOrder([]);
  };

  const handleSubmitScenario = () => {
    if (userOrder.length === 0) return;
    setShowFeedback(true);
  };

  const handleNext = () => {
    const newAnswers = { ...answers, [currentScenario.id]: userOrder };
    setAnswers(newAnswers);
    setUserOrder([]);
    setShowFeedback(false);

    if (isLast) {
      onComplete(newAnswers);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!currentScenario) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-medium text-slate-400 pb-3 border-b border-white/[0.08]">
        <span>Request Flow Challenge {currentIndex + 1} of {scenarios.length}</span>
        <span className="text-cyan-400 font-mono">Click components in execution order</span>
      </div>

      {/* Scenario Prompt */}
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-5 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded">
          Request Lifecycle Architecture
        </span>
        <p className="text-sm sm:text-base font-semibold text-white">
          {currentScenario.prompt}
        </p>
      </div>

      {/* User Built Sequence Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Your Request Execution Sequence ({userOrder.length}/{defaultLayers.length})</span>
          {userOrder.length > 0 && !showFeedback && (
            <button
              type="button"
              onClick={handleResetOrder}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        <div className="min-h-[90px] rounded-2xl border border-dashed border-white/20 bg-slate-950/60 p-4 flex flex-wrap items-center gap-2">
          {userOrder.length === 0 ? (
            <p className="text-xs text-slate-500 italic mx-auto">
              Click available components below to build the HTTP request pipeline order...
            </p>
          ) : (
            userOrder.map((layer, idx) => (
              <React.Fragment key={layer}>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  disabled={showFeedback}
                  className="rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-3 py-2 text-xs font-mono font-bold text-cyan-300 transition hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 cursor-pointer"
                >
                  <span className="text-[10px] text-slate-400 mr-1.5">{idx + 1}.</span>
                  {layer}
                </button>
                {idx < userOrder.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 animate-pulse" />
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* Available Options Pool */}
      {!showFeedback && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400">Available Components:</span>
          <div className="flex flex-wrap gap-2">
            {availableOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelectItem(item)}
                className="rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs font-mono text-slate-300 hover:border-cyan-400 hover:text-white transition cursor-pointer"
              >
                + {item}
              </button>
            ))}
          </div>

          {userOrder.length === defaultLayers.length && (
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmitScenario}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Simulate & Validate Request Flow</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Feedback Panel */}
      {showFeedback && (
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-5 space-y-3 animate-fadeIn text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Sequence Submitted for Analysis</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{currentScenario.explanation}</p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-2.5 text-xs font-bold text-slate-950 cursor-pointer"
            >
              <span>{isLast ? "View Final Results" : "Next Flow Challenge"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
