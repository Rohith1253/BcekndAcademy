export default function RoadmapLegend() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 text-sm text-slate-300 shadow-lg shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Completed</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-300">✓</span>
          <p>Finished modules with strong completion status.</p>
        </div>
      </div>
      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 text-sm text-slate-300 shadow-lg shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-300">→</span>
          <p>Your active lesson in the roadmap sequence.</p>
        </div>
      </div>
      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 text-sm text-slate-300 shadow-lg shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Locked</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-700/70 text-slate-400">🔒</span>
          <p>Complete prerequisites to unlock later modules.</p>
        </div>
      </div>
    </div>
  );
}
