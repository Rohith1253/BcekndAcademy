"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import ChallengeWorkspace from "@/components/challenges/ChallengeWorkspace";
import { api } from "@/lib/api";
import type { CodingChallengeDetail } from "@/lib/challenge-types";

export default function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [challenge, setChallenge] = useState<CodingChallengeDetail | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [latestDraftCode, setLatestDraftCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadChallenge() {
      try {
        const json = await api.get(`/api/challenges/${slug}`);
        if (json.success && json.data?.challenge) {
          setChallenge(json.data.challenge);
          setIsCompleted(!!json.data.isCompleted);
          setLatestDraftCode(json.data.latestDraftCode || null);
        } else {
          setError(json.error || "Challenge not found");
        }
      } catch (err: any) {
        console.error("Load challenge error:", err);
        setError(err.message || "Failed to load challenge");
      } finally {
        setLoading(false);
      }
    }

    loadChallenge();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070913] text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <span className="text-xs font-mono uppercase tracking-wider">
            Loading Coding Workspace...
          </span>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#070913] px-6 text-center text-white space-y-4">
        <h1 className="text-3xl font-bold text-rose-400">Challenge Not Found</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          {error || "The requested coding challenge does not exist."}
        </p>
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-6 py-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition"
        >
          Return to Challenge Catalog
        </Link>
      </div>
    );
  }

  return (
    <ChallengeWorkspace
      challenge={challenge}
      initialCompleted={isCompleted}
      latestDraftCode={latestDraftCode}
    />
  );
}
