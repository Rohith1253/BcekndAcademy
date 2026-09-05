"use client";

import { useEffect, useState, use } from "react";
import { Network, Play, CheckCircle2, RotateCcw, ArrowLeft, Shield } from "lucide-react";
import { getApiUrl } from "@/lib/http";
import { api } from "@/lib/api";
import { useClient } from "@/lib/store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ApiLabWorkspacePage({ params }: PageProps) {
  const { slug } = use(params);
  const { user, refreshUser } = useClient();
  const [lab, setLab] = useState<any>(null);
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("");
  const [headersJson, setHeadersJson] = useState("{}");
  const [bodyJson, setBodyJson] = useState("{}");
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    async function loadLab() {
      try {
        const res = await fetch(getApiUrl(`/api/api-labs/${slug}`));
        const json = await res.json();
        if (json.success && json.data) {
          setLab(json.data);
          setMethod(json.data.starterRequest.method);
          setEndpoint(json.data.starterRequest.endpoint);
          setHeadersJson(JSON.stringify(json.data.starterRequest.headers || {}, null, 2));
          if (json.data.starterRequest.body) {
            setBodyJson(JSON.stringify(json.data.starterRequest.body, null, 2));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadLab();
  }, [slug]);

  const handleRun = async () => {
    setRunning(true);
    try {
      let parsedHeaders = {};
      let parsedBody = undefined;
      try { parsedHeaders = JSON.parse(headersJson); } catch (e) {}
      try { if (bodyJson.trim()) parsedBody = JSON.parse(bodyJson); } catch (e) {}

      const res = await api.post(`/api/api-labs/${slug}/run`, {
        method,
        endpoint,
        headers: parsedHeaders,
        body: parsedBody,
      });

      if (res.success) {
        setResponseOutput(res.data);
      }
    } catch (err: any) {
      setResponseOutput({ error: err.message });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      let parsedHeaders = {};
      let parsedBody = undefined;
      try { parsedHeaders = JSON.parse(headersJson); } catch (e) {}
      try { if (bodyJson.trim()) parsedBody = JSON.parse(bodyJson); } catch (e) {}

      const res = await api.post(`/api/api-labs/${slug}/submit`, {
        method,
        endpoint,
        headers: parsedHeaders,
        body: parsedBody,
      });

      if (res.success) {
        setSubmissionResult(res.data);
        if (refreshUser) refreshUser();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!lab) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <a href="/api-labs" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to API Labs</span>
          </a>
          <span className="text-xs font-mono text-cyan-400">+{lab.xpReward} XP Reward</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Instructions Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold uppercase text-cyan-300 border border-cyan-500/30">
                {lab.category}
              </span>
              <h1 className="text-2xl font-bold text-white">{lab.title}</h1>
              <p className="text-xs text-slate-300 leading-relaxed">{lab.description}</p>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                <div className="text-xs font-bold uppercase text-cyan-400">Objective</div>
                <p className="text-xs text-slate-300">{lab.objective}</p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase text-slate-400">Hints</div>
                <ul className="text-xs text-slate-400 list-disc pl-5 space-y-1">
                  {lab.hints?.map((h: string, idx: number) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>

            {submissionResult && (
              <div className={`p-5 rounded-2xl border text-xs space-y-2 ${
                submissionResult.passed
                  ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200"
                  : "border-rose-500/40 bg-rose-950/30 text-rose-200"
              }`}>
                <div className="font-bold text-sm flex items-center gap-2">
                  {submissionResult.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : null}
                  <span>{submissionResult.passed ? "Lab Completed Successfully!" : "Validation Incomplete"}</span>
                </div>
                <p>{submissionResult.passed ? `You earned +${submissionResult.xpEarned || lab.xpReward} XP!` : submissionResult.message}</p>
              </div>
            )}
          </div>

          {/* Request Builder & Response Inspector */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Request Construction</h3>

              <div className="flex gap-3">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-cyan-400 focus:outline-none"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>PATCH</option>
                  <option>DELETE</option>
                </select>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-xs font-mono text-white focus:outline-none"
                  placeholder="/api/v1/..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Headers (JSON)</label>
                <textarea
                  rows={3}
                  value={headersJson}
                  onChange={(e) => setHeadersJson(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>

              {method !== "GET" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Body Payload (JSON)</label>
                  <textarea
                    rows={4}
                    value={bodyJson}
                    onChange={(e) => setBodyJson(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs font-mono text-slate-200 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700 transition"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>{running ? "Sending..." : "Test Request"}</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !user}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-xs font-semibold text-slate-950 hover:opacity-90 transition shadow-md disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{submitting ? "Evaluating..." : "Submit Solution"}</span>
                </button>
              </div>
            </div>

            {/* Response Output */}
            {responseOutput && (
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400 font-bold">Simulated Response</span>
                  <span className={`font-bold ${responseOutput.simulatedResponse?.statusCode < 300 ? "text-emerald-400" : "text-rose-400"}`}>
                    HTTP {responseOutput.simulatedResponse?.statusCode} {responseOutput.simulatedResponse?.statusMessage}
                  </span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-white/5 overflow-x-auto text-slate-300">
                  {JSON.stringify(responseOutput.simulatedResponse?.data || responseOutput, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
