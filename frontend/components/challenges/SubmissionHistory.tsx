"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, Sparkles, Code2 } from "lucide-react";
import { api } from "@/lib/api";
import type { SubmissionHistoryItem } from "@/lib/challenge-types";

interface SubmissionHistoryProps {
  challengeSlug: string;
  onRestoreCode: (code: string) => void;
  refreshTrigger: number;
}

export default function SubmissionHistory({
  challengeSlug,
  onRestoreCode,
  refreshTrigger,
}: SubmissionHistoryProps) {
  const [submissions, setSubmissions] = useState<SubmissionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const json = await api.get(`/api/challenges/${challengeSlug}/submissions`);
        if (json.success && json.data?.submissions) {
          setSubmissions(json.data.submissions);
        }
      } catch (err) {
        console.error("Fetch submissions error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [challengeSlug, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 font-mono">
        No submissions yet for this challenge. Write your solution and click <strong>Submit Solution</strong>!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-mono text-slate-400 px-1">
        Your Previous Attempts ({submissions.length})
      </div>

      {submissions.map((sub) => {
        const isPass = sub.status === "passed";
        const dateStr = new Date(sub.submittedAt).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={sub._id}
            className={`rounded-xl border p-3.5 text-xs transition ${
              isPass
                ? "border-emerald-500/20 bg-emerald-950/20"
                : "border-white/[0.08] bg-slate-900/60"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {isPass ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-white">
                    {isPass ? "Passed" : "Failed"} ({sub.score}%)
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{dateStr}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono text-[11px]">
                  <span className="text-slate-300">
                    {sub.testsPassed} / {sub.totalTests} tests
                  </span>
                  {sub.earnedXP > 0 && (
                    <span className="block text-fuchsia-300 font-bold">
                      +{sub.earnedXP} XP
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onRestoreCode(sub.code)}
                  className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
                  title="Load this submission code into editor"
                >
                  <Code2 className="w-3 h-3" /> Restore
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
