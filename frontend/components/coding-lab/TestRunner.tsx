"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Plus, Trash2, Play, FlaskConical } from "lucide-react";
import type { LabTestCase, LabTestResult } from "@/lib/coding-lab-types";

interface TestRunnerProps {
  tests: LabTestCase[];
  testResults: LabTestResult[] | null;
  isRunningTests: boolean;
  onRunTests: () => void;
  onAddTest: (test: LabTestCase) => void;
  onDeleteTest: (id: string) => void;
}

export default function TestRunner({
  tests,
  testResults,
  isRunningTests,
  onRunTests,
  onAddTest,
  onDeleteTest,
}: TestRunnerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTestName, setNewTestName] = useState("");
  const [expectedStatus, setExpectedStatus] = useState("200");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;
    onAddTest({
      id: `custom_${Date.now()}`,
      name: newTestName.trim(),
      expectedStatus: Number(expectedStatus) || 200,
    });
    setNewTestName("");
    setIsAdding(false);
  };

  const passedCount = testResults?.filter((t) => t.passed).length || 0;
  const totalCount = testResults?.length || tests.length;

  return (
    <div className="space-y-4">
      {/* Test Controls Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Test Suite ({tests.length})</span>
          {testResults && (
            <span className="font-bold text-white ml-2">
              {passedCount} / {totalCount} Passed
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 rounded-md px-2.5 py-1 text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <Plus className="w-3 h-3" /> Add Test
          </button>

          <button
            type="button"
            onClick={onRunTests}
            disabled={isRunningTests || tests.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/15 hover:bg-cyan-500/25 px-3 py-1 text-xs font-semibold text-cyan-300 transition disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-cyan-400" />
            {isRunningTests ? "Testing..." : "Run Tests"}
          </button>
        </div>
      </div>

      {/* Inline Add Test Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="rounded-xl border border-white/10 bg-slate-950/80 p-3 text-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Test description (e.g. Health returns 200 OK)"
              value={newTestName}
              onChange={(e) => setNewTestName(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-white outline-none focus:border-cyan-500/50"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px]">Expected:</span>
              <select
                value={expectedStatus}
                onChange={(e) => setExpectedStatus(e.target.value)}
                className="rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 text-white font-mono outline-none"
              >
                <option value="200">200 OK</option>
                <option value="201">201 Created</option>
                <option value="204">204 No Content</option>
                <option value="400">400 Bad Request</option>
                <option value="401">401 Unauthorized</option>
                <option value="404">404 Not Found</option>
                <option value="500">500 Server Error</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 rounded text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400"
            >
              Save Test
            </button>
          </div>
        </form>
      )}

      {/* Tests List / Results */}
      <div className="space-y-2">
        {tests.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-500 font-mono">
            No test cases defined yet. Click <strong>Add Test</strong> to define expected responses.
          </p>
        ) : (
          tests.map((test) => {
            const res = testResults?.find((r) => r.id === test.id);

            return (
              <div
                key={test.id}
                className={`rounded-xl border p-3 text-xs transition ${
                  res
                    ? res.passed
                      ? "border-emerald-500/30 bg-emerald-950/20"
                      : "border-rose-500/30 bg-rose-950/20"
                    : "border-white/[0.06] bg-slate-950/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {res ? (
                      res.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )
                    ) : (
                      <FlaskConical className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="font-medium text-white">{test.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {test.expectedStatus && (
                      <span className="font-mono text-[11px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        Status {test.expectedStatus}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteTest(test.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Delete test"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {res && !res.passed && (
                  <div className="mt-2 ml-6 font-mono text-[11px] text-rose-300 space-y-0.5 bg-rose-950/40 p-2 rounded border border-rose-500/20">
                    <div>Expected: {res.expected}</div>
                    <div>Received: {res.received}</div>
                    {res.error && <div className="text-rose-400 mt-1">{res.error}</div>}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
