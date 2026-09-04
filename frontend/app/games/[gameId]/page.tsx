"use client";

import React, { useEffect, useState, use } from "react";
import GameShell from "@/components/games/GameShell";
import GameResult from "@/components/games/GameResult";
import HttpStatusGame from "@/components/games/HttpStatusGame";
import ApiFlowGame from "@/components/games/ApiFlowGame";
import RouteMatcherGame from "@/components/games/RouteMatcherGame";
import MiddlewareMazeGame from "@/components/games/MiddlewareMazeGame";
import DatabasePuzzleGame from "@/components/games/DatabasePuzzleGame";
import JwtFlowGame from "@/components/games/JwtFlowGame";
import BugHunterGame from "@/components/games/BugHunterGame";
import SecurityDefenderGame from "@/components/games/SecurityDefenderGame";
import { Sparkles, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { normalizeGameId, getGameScenarios, getGameById } from "@/games/registry";
import type { GameScenario } from "@/games/types";

/**
 * Registry mapping gameType / normalized gameId to React game components.
 */
const GAME_REGISTRY: Record<
  string,
  React.ComponentType<{
    scenarios: GameScenario[];
    onComplete: (answers: Record<string, any>) => void;
  }>
> = {
  "http-status": HttpStatusGame,
  "api-flow": ApiFlowGame,
  "route-matcher": RouteMatcherGame,
  "middleware-maze": MiddlewareMazeGame,
  "database-puzzle": DatabasePuzzleGame,
  "jwt-flow": JwtFlowGame,
  "bug-hunter": BugHunterGame,
  "security-defender": SecurityDefenderGame,
};

function GameRenderer({
  gameTypeOrId,
  scenarios,
  onComplete,
  fallback,
}: {
  gameTypeOrId: string;
  scenarios: GameScenario[];
  onComplete: (answers: Record<string, any>) => void;
  fallback: React.ReactNode;
}) {
  const norm = normalizeGameId(gameTypeOrId);
  const Component = GAME_REGISTRY[norm] || GAME_REGISTRY[gameTypeOrId];
  if (!Component) return <>{fallback}</>;
  return <Component scenarios={scenarios} onComplete={onComplete} />;
}

export default function StandaloneGamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const resolvedParams = use(params);
  const rawGameId = resolvedParams.gameId;
  const normalizedGameId = normalizeGameId(rawGameId);

  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeSpent, setTimeSpent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    async function fetchGameData() {
      try {
        const json = await api.get(`/api/games/${rawGameId}`);

        // Step 3 required debug logs
        console.log("[GAME DEBUG] Game API response:", json);
        console.log("[GAME DEBUG] Requested gameId:", rawGameId);
        console.log("[GAME DEBUG] Normalized gameId:", normalizedGameId);
        console.log("[GAME DEBUG] Registry keys:", Object.keys(GAME_REGISTRY));

        if (json.success && json.data?.game) {
          const apiGame = json.data.game;
          // Ensure scenarios are present (fallback to registry if omitted by API)
          const resolvedScenarios =
            Array.isArray(apiGame.scenarios) && apiGame.scenarios.length > 0
              ? apiGame.scenarios
              : getGameScenarios(normalizedGameId);

          setGame({
            ...apiGame,
            scenarios: resolvedScenarios,
          });
        } else {
          // Local fallback from registry if API returned not found
          const localDef = getGameById(normalizedGameId);
          if (localDef) {
            setGame({
              ...localDef,
              scenarios: getGameScenarios(normalizedGameId),
            });
          } else {
            setError(json.error || "Game not found");
          }
        }
      } catch (err: any) {
        console.error("Fetch game error:", err);
        // Resilient fallback from local registry if network failed
        const localDef = getGameById(normalizedGameId);
        if (localDef) {
          setGame({
            ...localDef,
            scenarios: getGameScenarios(normalizedGameId),
          });
        } else {
          setError(err?.message || "Failed to load educational game");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchGameData();
  }, [rawGameId, normalizedGameId]);

  // Timer interval when game is active and not finished
  useEffect(() => {
    if (loading || error || result) return;
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, error, result]);

  const handleCompleteGame = async (answers: Record<string, any>) => {
    setSubmitting(true);
    try {
      const json = await api.post(`/api/games/${rawGameId}/submit`, { answers, timeSpent });
      if (json.success && json.data) {
        // Support both wrapped { result } and direct evaluation payload
        const evalResult = json.data.result || json.data;
        setResult(evalResult);
      } else {
        alert(json.error || "Failed to submit game answers");
      }
    } catch (err: any) {
      console.error("Submit game error:", err);
      alert(err?.message || "An error occurred while evaluating your game submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setResult(null);
    setTimeSpent(0);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070913] text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <span className="text-xs font-mono uppercase tracking-wider">Loading Educational Game...</span>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#070913] px-6 text-center text-white space-y-4">
        <h1 className="text-3xl font-bold text-rose-400">Game Not Found</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">{error || "The requested game does not exist."}</p>
        <a
          href="/games"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-6 py-3 text-xs font-bold text-cyan-300"
        >
          Return to Games Hub
        </a>
      </div>
    );
  }

  // Resolve scenarios and target game component
  const scenarios: GameScenario[] =
    Array.isArray(game.scenarios) && game.scenarios.length > 0
      ? game.scenarios
      : getGameScenarios(normalizedGameId);



  return (
    <GameShell
      title={game.title}
      category={game.category}
      difficulty={game.difficulty}
      xpReward={game.xpReward}
      timeSpent={timeSpent}
      onRestart={handleRestart}
    >
      {/* 1. Submitting Spinner Overlay */}
      {submitting && (
        <div className="flex min-h-[300px] flex-col items-center justify-center text-slate-300 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-xs font-mono font-bold uppercase tracking-wider">Evaluating Server Submission...</p>
        </div>
      )}

      {/* 2. Active Game Play Stage (Immediately visible & playable) */}
      {!result && !submitting && (
        <div className="space-y-6">
          {/* Quick Context / Instruction Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-slate-950/60 px-4 py-3 text-xs text-slate-300">
            <p className="leading-relaxed">
              <strong className="text-white font-semibold">Mission: </strong>
              {game.instructions || game.description}
            </p>
            <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> ~{game.estimatedMinutes}m
              </span>
              <span className="flex items-center gap-1 text-fuchsia-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" /> +{game.xpReward} XP
              </span>
            </div>
          </div>

          {/* Render selected game component or developer-friendly fallback */}
          <GameRenderer
            gameTypeOrId={game.gameType || game.id || rawGameId}
            scenarios={scenarios}
            onComplete={handleCompleteGame}
            fallback={
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-rose-500/20 text-rose-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-rose-400">Game Component Not Found</h3>
                <p className="text-xs text-slate-300 font-mono">
                  No React component registered for gameType: &quot;{game.gameType}&quot; (requested ID: &quot;{rawGameId}&quot;, normalized: &quot;{normalizedGameId}&quot;).
                </p>
                <p className="text-xs text-slate-400">
                  Available registry keys: {Object.keys(GAME_REGISTRY).join(", ")}
                </p>
              </div>
            }
          />
        </div>
      )}

      {/* 3. Game Result Screen */}
      {result && (
        <GameResult
          score={result.score}
          stars={result.stars}
          xpEarned={result.xpEarned}
          alreadyCompleted={result.alreadyCompleted}
          message={result.message}
          breakdown={result.breakdown || []}
          onPlayAgain={handleRestart}
        />
      )}
    </GameShell>
  );
}
