"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Code2,
  Layers,
  Zap,
  ShieldCheck,
  Clock,
  Send,
  Globe,
  ChevronDown,
  Info,
  Maximize2,
  Minimize2,
  Cpu
} from "lucide-react";
import { PLAYGROUND_LANGUAGES, PlaygroundLanguageConfig } from "@/data/playground-templates";
import { api } from "@/lib/api";

function PlaygroundInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlLang = searchParams?.get("lang") || "javascript";

  const [selectedLanguageKey, setSelectedLanguageKey] = useState<string>(
    PLAYGROUND_LANGUAGES[urlLang] ? urlLang : "javascript"
  );
  const currentLangConfig = PLAYGROUND_LANGUAGES[selectedLanguageKey] || PLAYGROUND_LANGUAGES.javascript;

  const [code, setCode] = useState<string>(currentLangConfig.starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [errorLines, setErrorLines] = useState<string[]>([]);
  const [executionStats, setExecutionStats] = useState<{
    executionTimeMs: number;
    provider: string;
    status: string;
    exitCode: number;
    patterns?: string[];
  } | null>(null);

  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"output" | "http" | "info">("output");
  const [httpMethod, setHttpMethod] = useState<string>("GET");
  const [httpPath, setHttpPath] = useState<string>("/api/users");
  const [httpBody, setHttpBody] = useState<string>('{\n  "name": "David",\n  "role": "Security Engineer"\n}');
  const [httpResponse, setHttpResponse] = useState<any>(null);

  // Sync state when URL parameter or selected language changes
  useEffect(() => {
    if (PLAYGROUND_LANGUAGES[urlLang] && urlLang !== selectedLanguageKey) {
      setSelectedLanguageKey(urlLang);
      setCode(PLAYGROUND_LANGUAGES[urlLang].starterCode);
      setOutputLines([]);
      setErrorLines([]);
      setExecutionStats(null);
    }
  }, [urlLang, selectedLanguageKey]);

  const handleLanguageChange = (langKey: string) => {
    setSelectedLanguageKey(langKey);
    setCode(PLAYGROUND_LANGUAGES[langKey].starterCode);
    setOutputLines([]);
    setErrorLines([]);
    setExecutionStats(null);
    setHttpResponse(null);
    router.push(`/playground?lang=${langKey}`, { scroll: false });
  };

  const handleResetCode = () => {
    setCode(currentLangConfig.starterCode);
    setOutputLines([]);
    setErrorLines([]);
    setExecutionStats(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setErrorLines([]);
    setOutputLines(["⚡ Compiling and analyzing backend script in sandbox..."]);

    try {
      const response = await api.post("/api/code/execute", {
        language: selectedLanguageKey,
        code,
        timeout: 5000,
      });

      if (response.success && response.data) {
        const { stdout, stderr, executionTimeMs, provider, exitCode, status, patterns } = response.data;
        setOutputLines(stdout || ["(No stdout emitted)"]);
        setErrorLines(stderr || []);
        setExecutionStats({
          executionTimeMs: executionTimeMs || 15,
          provider: provider || "mock",
          status: status || "success",
          exitCode: exitCode || 0,
          patterns,
        });
      } else {
        setErrorLines([response.error || "Failed to execute code in sandbox."]);
        setExecutionStats({
          executionTimeMs: 0,
          provider: "mock",
          status: "error",
          exitCode: 1,
        });
      }
    } catch (err: any) {
      setErrorLines([err.message || "Network execution error."]);
      setExecutionStats({
        executionTimeMs: 0,
        provider: "mock",
        status: "error",
        exitCode: 1,
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLanguageKey, isRunning]);

  const handleSendMockHttp = async () => {
    setIsRunning(true);
    try {
      await new Promise((r) => setTimeout(r, 450));
      let parsedBody = null;
      try {
        if (httpMethod !== "GET") parsedBody = JSON.parse(httpBody);
      } catch {}

      if (httpPath.includes("health")) {
        setHttpResponse({
          status: 200,
          statusText: "OK",
          headers: { "content-type": "application/json", "x-powered-by": currentLangConfig.framework },
          data: { status: "healthy", timestamp: new Date().toISOString(), framework: currentLangConfig.framework }
        });
      } else if (httpMethod === "GET") {
        setHttpResponse({
          status: 200,
          statusText: "OK",
          headers: { "content-type": "application/json", "x-powered-by": currentLangConfig.framework },
          data: {
            success: true,
            count: 3,
            data: [
              { id: 1, name: "Alice", role: "Backend Engineer" },
              { id: 2, name: "Bob", role: "DevOps Architect" },
              { id: 3, name: "Charlie", role: "Systems Architect" }
            ]
          }
        });
      } else {
        setHttpResponse({
          status: 201,
          statusText: "Created",
          headers: { "content-type": "application/json", "x-powered-by": currentLangConfig.framework },
          data: {
            success: true,
            id: 4,
            payloadReceived: parsedBody || { name: "David", role: "Security Engineer" },
            message: "Record persisted successfully in simulation database"
          }
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard shortcut Ctrl+Enter to Run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRunCode]);

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col pt-0">
      {/* Top Controls Header */}
      <header className="border-b border-white/10 bg-[#070b1a]/95 backdrop-blur-xl px-4 py-3 sm:px-6 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          {/* Left: Language Stack Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider hidden sm:inline">
                Playground:
              </span>
            </div>

            <div className="relative">
              <select
                value={selectedLanguageKey}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none rounded-xl border border-cyan-500/30 bg-slate-900/90 py-1.5 pl-3.5 pr-9 text-xs sm:text-sm font-semibold text-cyan-300 shadow-lg shadow-cyan-950/40 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
              >
                {Object.values(PLAYGROUND_LANGUAGES).map((lang) => (
                  <option key={lang.id} value={lang.id} className="bg-slate-900 text-white">
                    {lang.name} — {lang.framework}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
            </div>

            <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-mono font-medium hidden md:inline-flex items-center gap-1.5 ${currentLangConfig.badgeColor}`}>
              <Cpu className="h-3 w-3" />
              {currentLangConfig.version}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleResetCode}
              title="Reset Code to Template"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={handleCopyCode}
              title="Copy Code"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold shadow-lg transition ${
                isRunning
                  ? "bg-cyan-600/50 text-slate-300 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 active:scale-95"
              }`}
            >
              {isRunning ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Run Code</span>
                  <kbd className="hidden lg:inline-block rounded bg-slate-950/20 px-1.5 py-0.5 text-[10px] font-mono">
                    Ctrl+Enter
                  </kbd>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Split-Pane Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden">
        {/* Left Column: Code Editor (7 cols) */}
        <section className="lg:col-span-7 flex flex-col rounded-2xl border border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-xl overflow-hidden min-h-[480px]">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/70 px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono font-semibold text-slate-300 pl-2">
                main.{currentLangConfig.extension}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span>{code.split("\n").length} lines</span>
              <span>•</span>
              <span className="text-cyan-400">{currentLangConfig.framework}</span>
            </div>
          </div>

          {/* Text Editor Container */}
          <div className="flex-1 relative flex bg-[#090d1f] font-mono text-sm leading-relaxed overflow-hidden">
            {/* Line Numbers Bar */}
            <div className="w-12 py-3 bg-[#070a18] text-slate-600 text-right pr-3 select-none text-xs border-r border-white/5 flex flex-col overflow-hidden">
              {code.split("\n").map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent text-slate-100 resize-none font-mono text-xs sm:text-sm leading-6 focus:outline-none focus:ring-0 selection:bg-cyan-500/30 overflow-y-auto whitespace-pre tab-4"
              style={{ tabSize: 2 }}
              placeholder={`Write ${currentLangConfig.name} backend code here...`}
            />
          </div>

          {/* Editor Status Footer */}
          <div className="border-t border-white/10 bg-[#070b1a] px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Safe Sandboxed Execution</span>
            </div>
            <div className="text-slate-500 font-mono">UTF-8 • LF</div>
          </div>
        </section>

        {/* Right Column: Console / HTTP / Info Panel (5 cols) */}
        <section className="lg:col-span-5 flex flex-col rounded-2xl border border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-xl overflow-hidden min-h-[480px]">
          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/70 px-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("output")}
                className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                  activeTab === "output"
                    ? "border-cyan-400 text-cyan-300"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Console Output</span>
              </button>

              <button
                onClick={() => setActiveTab("http")}
                className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                  activeTab === "http"
                    ? "border-cyan-400 text-cyan-300"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>HTTP Test Client</span>
              </button>

              <button
                onClick={() => setActiveTab("info")}
                className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                  activeTab === "info"
                    ? "border-cyan-400 text-cyan-300"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Info className="h-3.5 w-3.5" />
                <span>Stack Info</span>
              </button>
            </div>

            {executionStats && (
              <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <Clock className="h-3 w-3 text-cyan-400" />
                <span>{executionStats.executionTimeMs}ms</span>
                <span className="rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-1.5 py-0.2">
                  {executionStats.provider}
                </span>
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed bg-[#080c1d]">
            {activeTab === "output" && (
              <div className="space-y-3">
                {outputLines.length === 0 && errorLines.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-3">
                    <Terminal className="h-8 w-8 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-400">Terminal Ready</p>
                      <p className="text-[11px] text-slate-500">
                        Click &quot;Run Code&quot; or press Ctrl+Enter to execute.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Stdout lines */}
                    {outputLines.length > 0 && (
                      <div className="space-y-1">
                        {outputLines.map((line, idx) => (
                          <div key={idx} className="flex gap-2 text-slate-300">
                            <span className="text-cyan-500 select-none">&gt;</span>
                            <span className="break-all whitespace-pre-wrap">{line}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stderr lines */}
                    {errorLines.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-rose-500/20">
                        {errorLines.map((err, idx) => (
                          <div key={idx} className="flex gap-2 text-rose-400 font-semibold">
                            <span className="text-rose-500 select-none">!</span>
                            <span className="break-all whitespace-pre-wrap">{err}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Execution Footer Summary */}
                    {executionStats && (
                      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                        <span className={executionStats.status === "success" ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                          ● Process finished with exit code {executionStats.exitCode} ({executionStats.status})
                        </span>
                        <span>Execution: {executionStats.executionTimeMs}ms</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "http" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 space-y-3">
                  <p className="text-[11px] font-sans font-semibold text-cyan-300 uppercase tracking-wider">
                    Simulated HTTP Request
                  </p>
                  <div className="flex gap-2">
                    <select
                      value={httpMethod}
                      onChange={(e) => setHttpMethod(e.target.value)}
                      className="rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-cyan-400 focus:outline-none"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <input
                      type="text"
                      value={httpPath}
                      onChange={(e) => setHttpPath(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      placeholder="/api/resource"
                    />
                    <button
                      onClick={handleSendMockHttp}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                    >
                      <Send className="h-3 w-3" />
                      <span>Send</span>
                    </button>
                  </div>

                  {httpMethod !== "GET" && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-sans">Request Body (JSON):</label>
                      <textarea
                        value={httpBody}
                        onChange={(e) => setHttpBody(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-white/10 bg-slate-950 p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  )}
                </div>

                {httpResponse && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400">
                        {httpResponse.status} {httpResponse.statusText}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {httpResponse.headers["x-powered-by"]}
                      </span>
                    </div>
                    <pre className="text-[11px] text-slate-200 overflow-x-auto bg-slate-950/80 p-2.5 rounded-lg border border-white/5">
                      {JSON.stringify(httpResponse.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === "info" && (
              <div className="space-y-4 font-sans text-xs">
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                  <h4 className="font-bold text-white text-sm">{currentLangConfig.name} Backend Overview</h4>
                  <p className="text-slate-300 leading-relaxed">{currentLangConfig.description}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-300">
                    Key Features in {currentLangConfig.framework}
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span>Idiomatic backend patterns for high-concurrency microservices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span>Pre-configured sandbox with realistic simulated I/O</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span>Interoperable REST and JSON payload handling</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function MultiLanguagePlaygroundPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050814] flex items-center justify-center text-cyan-400 font-mono text-sm">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <span>Loading Multi-Language Playground...</span>
          </div>
        </div>
      }
    >
      <PlaygroundInner />
    </Suspense>
  );
}
