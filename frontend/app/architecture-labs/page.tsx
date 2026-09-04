'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ArchitectureLab {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  description: string;
  xpReward: number;
  components: { id: string; name: string; type: string }[];
  scenarios: { id: string; name: string; description: string }[];
}

export default function ArchitectureLabsPage() {
  const [labs, setLabs] = useState<ArchitectureLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/architecture-labs')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLabs(data.data.labs || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['all', ...Array.from(new Set(labs.map(l => l.category)))];
  const filtered = selectedCategory === 'all' ? labs : labs.filter(l => l.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              Interactive System Simulator
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              Zero SSRF Risk
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Backend Architecture Labs
          </h1>
          <p className="mt-2 text-slate-400 max-w-2xl">
            Simulate real distributed backend architectures step-by-step: request lifecycles, middleware pipelines, JWT auth, Redis cache-aside, and circuit breakers.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-900/60 rounded-xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(lab => (
              <div
                key={lab.id}
                className="group relative bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {lab.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      +{lab.xpReward} XP
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {lab.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                    {lab.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {lab.components?.map(c => (
                      <span key={c.id} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/50">
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">⏱️ {lab.estimatedMinutes} mins</span>
                  <Link
                    href={`/architecture-labs/${lab.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Launch Lab &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
