"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import PlaygroundHeader from "@/components/playground/PlaygroundHeader";
import FileExplorer from "@/components/playground/FileExplorer";
import CodeEditor from "@/components/playground/CodeEditor";
import ConsoleLogs from "@/components/playground/ConsoleLogs";
import OutputPanel from "@/components/playground/OutputPanel";
import ChallengePanel from "@/components/playground/ChallengePanel";
import HintPanel from "@/components/playground/HintPanel";
import TestResults from "@/components/playground/TestResults";
import SolutionModal from "@/components/playground/SolutionModal";
import RunButton from "@/components/playground/RunButton";
import { ALL_CHALLENGES, CHALLENGES_BY_CATEGORY } from "@/data/challenges";
import type { Challenge } from "@/data/challenges";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";

type FileNode = {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
};

export default function PlaygroundPage() {
  const client = useClient();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    Object.values(ALL_CHALLENGES)[0]
  );
  const [code, setCode] = useState(selectedChallenge?.starterCode || "");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [rightTab, setRightTab] = useState("challenge");
  const [solvedChallengeIds, setSolvedChallengeIds] = useState<string[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<{ log: string[]; error: string[]; warn: string[] }>({
    log: [],
    error: [],
    warn: [],
  });

  // Fetch user solved challenge history on load if authenticated
  useEffect(() => {
    async function loadUserSubmissions() {
      if (!client.user) return;
      try {
        const json = await api.get("/api/challenges/submissions");
        if (json.success && json.data?.solvedChallengeIds) {
          setSolvedChallengeIds(json.data.solvedChallengeIds);
        }
      } catch (err) {
        console.error("Fetch submissions error:", err);
      }
    }

    loadUserSubmissions();
  }, [client.user]);

  const files: FileNode[] = [
    {
      name: "solution.js",
      type: "file",
      path: "solution.js",
    },
    {
      name: "tests",
      type: "folder",
      path: "tests",
      children: [
        { name: "test.js", type: "file", path: "tests/test.js" },
        { name: "helpers.js", type: "file", path: "tests/helpers.js" },
      ],
    },
    {
      name: "data.json",
      type: "file",
      path: "data.json",
    },
  ];

  const handleChallengeSelect = (challengeId: string) => {
    const challenge = ALL_CHALLENGES[challengeId];
    if (challenge) {
      setSelectedChallenge(challenge);
      setCode(challenge.starterCode);
      setOutput("");
      setError("");
      setHintLevel(0);
      setTestResults([]);
      setConsoleLogs({ log: [], error: [], warn: [] });
    }
  };

  const handleRun = useCallback(async () => {
    if (!selectedChallenge || isRunning) return;

    setIsRunning(true);
    setError("");
    setOutput("");
    setConsoleLogs({ log: [], error: [], warn: [] });

    try {
      if (client.user) {
        // Real server-side code execution via VM sandbox API endpoint
        const json = await api.post("/api/challenges/submit", {
          challengeId: selectedChallenge.id,
          code,
          timeSpent: 30,
        });

        if (json.success && json.data) {
          const { success, testsPassed, totalTests, testResults: serverTests, executionTimeMs, xpEarned, alreadyCompleted } = json.data;

          setTestResults(serverTests || []);
          setOutput(
            success
              ? `✓ Challenge Solved! Passed ${testsPassed}/${totalTests} test cases in ${executionTimeMs || 10}ms.\n${
                  alreadyCompleted ? "(Previously solved, 0 additional XP)" : `+${xpEarned} XP Earned!`
                }`
              : `❌ ${testsPassed}/${totalTests} tests passed. Check test details.`
          );

          setConsoleLogs({
            log: [
              `Execution time: ${executionTimeMs || 5}ms`,
              `Tests Passed: ${testsPassed} / ${totalTests}`,
              ...(serverTests?.map((t: any) => `${t.passed ? '✓' : '✗'} ${t.name}${t.error ? `: ${t.error}` : ''}`) || []),
            ],
            error: success ? [] : ["Some test cases failed."],
            warn: [],
          });

          if (success) {
            setSolvedChallengeIds((prev) => Array.from(new Set([...prev, selectedChallenge.id])));
            await client.refreshUser();
          }

          setRightTab("tests");
        } else {
          setError(json.error || "Execution failed");
        }
      } else {
        // Fallback for unauthenticated preview mode using local evaluation
        const { evaluateChallengeCode } = await import("@/lib/challenge-evaluator");
        const outcome = evaluateChallengeCode(code, selectedChallenge.testCases);

        setTestResults(outcome.testResults);
        setOutput(`Ran ${outcome.testsPassed}/${outcome.totalTests} tests in ${outcome.executionTimeMs}ms.`);
        setConsoleLogs({
          log: outcome.testResults.map((t: any) => `${t.passed ? '✓' : '✗'} ${t.name}`),
          error: [],
          warn: [],
        });
        setRightTab("tests");
      }
    } catch (err: any) {
      console.error("Execution error:", err);
      setError(err?.message || "Execution failed");
    } finally {
      setIsRunning(false);
    }
  }, [selectedChallenge, code, client, isRunning]);

  const handleRequestHint = () => {
    if (hintLevel < (selectedChallenge?.hints.length || 0)) {
      setHintLevel(hintLevel + 1);
    }
  };

  if (!selectedChallenge) {
    return <div className="p-8 text-white">Loading challenge workspace...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PlaygroundHeader />

      <main className="flex-1 overflow-hidden">
        <div className="grid h-full grid-cols-1 gap-4 p-6 lg:grid-cols-5">
          {/* Left: File Explorer */}
          <div className="hidden lg:block lg:col-span-1 h-full overflow-hidden">
            <FileExplorer
              files={files}
              onFileSelect={() => {}}
              selectedFile="solution.js"
            />
          </div>

          {/* Center: Code Editor */}
          <div className="lg:col-span-2 h-full flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="javascript"
              />
            </div>

            {/* Bottom: Console & Output */}
            <div className="grid gap-4 grid-cols-2 h-40 overflow-hidden">
              <ConsoleLogs
                logs={consoleLogs}
                onClear={() => setConsoleLogs({ log: [], error: [], warn: [] })}
              />
              <OutputPanel
                output={output}
                error={error}
                isLoading={isRunning}
              />
            </div>

            {/* Run Button */}
            <div className="flex justify-left pt-2">
              <RunButton
                isLoading={isRunning}
                isRunning={isRunning}
                onClick={handleRun}
                xpReward={selectedChallenge.xpReward}
              />
            </div>
          </div>

          {/* Right: Challenge Panel & Controls */}
          <div className="lg:col-span-2 h-full flex flex-col gap-4 overflow-hidden">
            <div className="flex gap-2 border-b border-white/10">
              <button
                onClick={() => setRightTab("challenge")}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  rightTab === "challenge"
                    ? "text-white border-b-2 border-violet-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Challenge
              </button>
              <button
                onClick={() => setRightTab("hints")}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  rightTab === "hints"
                    ? "text-white border-b-2 border-violet-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Hints ({selectedChallenge.hints.length})
              </button>
              <button
                onClick={() => setRightTab("tests")}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  rightTab === "tests"
                    ? "text-white border-b-2 border-violet-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tests {testResults.length > 0 && `(${testResults.filter(t => t.passed).length}/${testResults.length})`}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {rightTab === "challenge" && (
                <ChallengePanel
                  title={selectedChallenge.title}
                  description={selectedChallenge.description}
                  difficulty={selectedChallenge.difficulty}
                  xpReward={selectedChallenge.xpReward}
                  timeEstimate={selectedChallenge.timeEstimate}
                  learningPoints={selectedChallenge.learningPoints}
                  onRunCode={handleRun}
                  onShowSolution={() => setShowSolution(true)}
                />
              )}

              {rightTab === "hints" && (
                <HintPanel
                  hints={selectedChallenge.hints}
                  currentHintLevel={hintLevel}
                  onRequestHint={handleRequestHint}
                />
              )}

              {rightTab === "tests" && testResults.length > 0 && (
                <TestResults
                  results={testResults}
                  testsPassed={testResults.filter((t) => t.passed).length}
                  totalTests={testResults.length}
                  xpReward={selectedChallenge.xpReward}
                />
              )}

              {rightTab === "tests" && testResults.length === 0 && (
                <div className="flex items-center justify-center h-full text-center p-6">
                  <p className="text-slate-400">Run your solution code to execute test cases in VM sandbox</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Challenge Selection Modal */}
      <div className="fixed bottom-6 right-6 z-40">
        <details className="group">
          <summary className="list-none cursor-pointer">
            <span className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-violet-500 transition">
              🎯 Pick Challenge ({solvedChallengeIds.length} Solved)
            </span>
          </summary>
          <div className="absolute bottom-14 right-0 w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-white/10 bg-slate-900 shadow-xl max-h-96 overflow-y-auto">
            <div className="p-4 space-y-3">
              {Object.entries(CHALLENGES_BY_CATEGORY).map(([category, challenges]) => (
                <div key={category}>
                  <h4 className="px-3 py-1.5 text-xs font-semibold uppercase text-violet-300 border-b border-white/5 mb-1">
                    {category}
                  </h4>
                  {challenges.map((challenge) => {
                    const isSolved = solvedChallengeIds.includes(challenge.id);
                    return (
                      <button
                        key={challenge.id}
                        onClick={(e) => {
                          handleChallengeSelect(challenge.id);
                          (e.target as HTMLElement).closest("details")?.removeAttribute("open");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                          selectedChallenge?.id === challenge.id
                            ? "bg-violet-500/20 text-white font-semibold"
                            : "text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <span className="truncate">{challenge.title}</span>
                        {isSolved && <span className="text-emerald-400 font-bold ml-1">✓</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>

      {/* Solution Modal */}
      <SolutionModal
        isOpen={showSolution}
        solution={selectedChallenge.solution}
        onClose={() => setShowSolution(false)}
      />
    </div>
  );
}
