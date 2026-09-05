"use client";

import { useEffect, useState } from "react";
import { Network, Terminal, CheckCircle2, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { getApiUrl } from "@/lib/http";

export default function ApiLabsCatalogPage() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLabs() {
      try {
        const res = await fetch(getApiUrl("/api/api-labs"));
        const json = await res.json();
        if (json.success && Array.isArray(json.data?.labs)) {
          setLabs(json.data.labs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchLabs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <Network className="h-4 w-4" />
            <span>Interactive Backend Practice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">API Testing & Integration Labs</h1>
          <p className="max-w-3xl text-sm sm:text-base text-slate-400">
            Practice real-world HTTP methods, authorization headers, validation pipelines, pagination query parsing, and rate limiting resilience without external network dependencies.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <div
                key={lab.slug}
                className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 flex flex-col justify-between shadow-xl hover:border-cyan-500/40 transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase text-cyan-300 border border-cyan-500/20">
                      {lab.category}
                    </span>
                    <span className="text-xs text-amber-400 font-semibold font-mono">+{lab.xpReward} XP</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">{lab.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{lab.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {lab.estimatedMinutes} mins
                  </span>
                  <a
                    href={`/api-labs/${lab.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-cyan-400 group-hover:translate-x-1 transition"
                  >
                    <span>Launch Lab</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
