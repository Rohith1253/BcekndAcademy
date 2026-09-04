'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getApiUrl, getAuthHeaders } from '@/lib/http';

interface Step {
  step: number;
  from: string;
  to: string;
  action: string;
  status: string;
  details: string;
  latencyMs: number;
}

export default function ArchitectureLabDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [lab, setLab] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [customParams, setCustomParams] = useState<string>('{}');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [userDecisions, setUserDecisions] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<any>(null);

  useEffect(() => {
    fetch(getApiUrl(`/api/architecture-labs/${slug}`))
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.lab) {
          setLab(data.data.lab);
          if (data.data.lab.scenarios?.length > 0) {
            setSelectedScenario(data.data.lab.scenarios[0].id);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleSimulate = async () => {
    if (!selectedScenario) return;
    setSimulating(true);
    setSimulationResult(null);
    setCurrentStepIdx(-1);

    try {
      let parsed = {};
      try {
        parsed = JSON.parse(customParams);
      } catch (e) {}

      const res = await fetch(getApiUrl(`/api/architecture-labs/${slug}/simulate`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectedScenario,
          parameters: parsed
        })
      });
      const data = await res.json();
      if (data.success) {
        setSimulationResult(data.data);
        // Play simulation step-by-step
        const steps = data.data.simulation.steps || [];
        for (let i = 0; i < steps.length; i++) {
          await new Promise(r => setTimeout(r, 400));
          setCurrentStepIdx(i);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(getApiUrl(`/api/architecture-labs/${slug}/submit`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ decisions: userDecisions })
      });
      const data = await res.json();
      setSubmissionFeedback(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-emerald-400 font-mono animate-pulse">Loading Architecture Simulator...</div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <p>Lab not found.</p>
        <Link href="/architecture-labs" className="text-emerald-400 mt-4 inline-block">&larr; Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/architecture-labs" className="text-sm text-slate-400 hover:text-white">
            &larr; Labs
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <h1 className="text-lg font-bold text-white">{lab.title}</h1>
          <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
            {lab.category}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">+{lab.xpReward} XP</span>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Lab Solution'}
          </button>
        </div>
      </header>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Components & Scenario Controls */}
        <div className="lg:col-span-4 border-r border-slate-800 p-6 space-y-6 overflow-y-auto bg-slate-900/30">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Objective</h2>
            <p className="mt-1 text-sm text-slate-300">{lab.description}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">System Architecture Components</h2>
            <div className="space-y-2">
              {lab.components?.map((c: any) => (
                <div key={c.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm text-emerald-300">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.type}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {c.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Simulate Scenario</h2>
            <select
              value={selectedScenario}
              onChange={e => setSelectedScenario(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded-lg p-2.5 mb-3 focus:outline-none focus:border-emerald-500"
            >
              {lab.scenarios?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <label className="text-xs text-slate-400 block mb-1">Scenario Parameters (JSON)</label>
            <textarea
              rows={3}
              value={customParams}
              onChange={e => setCustomParams(e.target.value)}
              className="w-full bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
              placeholder="{}"
            />

            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="mt-3 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              {simulating ? 'Simulating Traffic...' : '▶ Execute Simulation Pipeline'}
            </button>
          </div>
        </div>

        {/* Right Column: Live Pipeline Trace Visualization */}
        <div className="lg:col-span-8 p-6 flex flex-col bg-slate-950 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block" />
              Real-Time Pipeline Execution Trace
            </h2>
            {simulationResult && (
              <span className="text-xs text-slate-400 font-mono">
                Total Latency: {simulationResult.simulation?.totalLatencyMs}ms | Steps: {simulationResult.simulation?.steps?.length}
              </span>
            )}
          </div>

          {submissionFeedback && (
            <div className={`p-4 rounded-lg border ${
              submissionFeedback.data?.passed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <p className="font-bold">{submissionFeedback.message || (submissionFeedback.data?.passed ? 'Lab Completed Successfully!' : 'Lab Submitted')}</p>
              {submissionFeedback.data?.xpAwarded && (
                <p className="text-sm mt-1">🎉 Awarded +{submissionFeedback.data.xpAwarded} XP!</p>
              )}
            </div>
          )}

          {simulationResult ? (
            <div className="space-y-3">
              {simulationResult.simulation?.steps?.map((step: Step, idx: number) => {
                const isActive = idx === currentStepIdx;
                const isPassed = idx <= currentStepIdx;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.01]'
                        : isPassed
                        ? 'bg-slate-900/80 border-slate-700/80'
                        : 'bg-slate-900/20 border-slate-900 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                          Step {step.step}
                        </span>
                        <span className="text-slate-400">
                          {step.from} &rarr; <strong className="text-white">{step.to}</strong>
                        </span>
                      </div>
                      <span className="font-mono text-slate-400">{step.latencyMs}ms</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-200">
                      {step.action}
                    </div>
                    <div className="mt-1 text-xs text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800 font-mono">
                      {step.details}
                    </div>
                  </div>
                );
              })}

              {simulationResult.simulation?.metrics && (
                <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Metrics Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
                    <div className="bg-slate-950 p-2 rounded">
                      <p className="text-xs text-slate-500">Status</p>
                      <p className="text-emerald-400 font-bold">{simulationResult.simulation.metrics.status || 200}</p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded">
                      <p className="text-xs text-slate-500">Cache State</p>
                      <p className="text-blue-400 font-bold">{simulationResult.simulation.metrics.cacheState || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded">
                      <p className="text-xs text-slate-500">Circuit State</p>
                      <p className="text-purple-400 font-bold">{simulationResult.simulation.metrics.circuitState || 'CLOSED'}</p>
                    </div>
                    <div className="bg-slate-950 p-2 rounded">
                      <p className="text-xs text-slate-500">Auth State</p>
                      <p className="text-yellow-400 font-bold">{simulationResult.simulation.metrics.authenticated ? 'Authenticated' : 'Anonymous'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <span className="text-3xl mb-2">⚙️</span>
              <p className="font-semibold text-slate-400">No Simulation Run Yet</p>
              <p className="text-xs mt-1">Select a scenario on the left and click "Execute Simulation Pipeline" to watch the architecture live.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
