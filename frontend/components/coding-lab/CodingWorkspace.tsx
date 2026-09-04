"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, FlaskConical, Save, Bot, PanelLeftClose, PanelLeftOpen, Terminal } from "lucide-react";
import FileExplorer from "./FileExplorer";
import WorkspaceEditor from "./WorkspaceEditor";
import ConsolePanel from "./ConsolePanel";
import TestRunner from "./TestRunner";
import AIAssistant from "./AIAssistant";
import SaveWorkspaceDialog from "./SaveWorkspaceDialog";
import { api } from "@/lib/api";
import { useClient } from "@/lib/store";
import type {
  CodingLabTemplate,
  VirtualFile,
  ExecutionOutcome,
  LabTestCase,
  LabTestResult,
} from "@/lib/coding-lab-types";

interface CodingWorkspaceProps {
  template: CodingLabTemplate;
  initialWorkspaceId?: string | null;
  initialWorkspaceName?: string;
  savedFiles?: VirtualFile[];
}

export default function CodingWorkspace({
  template,
  initialWorkspaceId = null,
  initialWorkspaceName = "",
  savedFiles,
}: CodingWorkspaceProps) {
  const { user } = useClient();
  const storageKey = `coding_lab_draft_${template.id}`;

  // State: Virtual Files
  const [files, setFiles] = useState<VirtualFile[]>(() => {
    if (savedFiles && savedFiles.length > 0) return savedFiles;
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
    }
    return template.files;
  });

  const [activeFilePath, setActiveFilePath] = useState<string>(template.activeFile);
  const [workspaceName, setWorkspaceName] = useState(initialWorkspaceName || template.name);
  const [workspaceId, setWorkspaceId] = useState<string | null>(initialWorkspaceId);

  // Bottom Panel State: console vs tests
  const [bottomTab, setBottomTab] = useState<"console" | "tests">("console");
  const [tests, setTests] = useState<LabTestCase[]>(template.defaultTests || []);
  const [testResults, setTestResults] = useState<LabTestResult[] | null>(null);

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [executionOutcome, setExecutionOutcome] = useState<ExecutionOutcome | null>(null);

  // AI & Sidebars State
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [aiTrigger, setAiTrigger] = useState<{ action: string; error?: string } | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Auto-save to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(files));
    } catch {}
  }, [files, storageKey]);

  const activeFile = files.find((f) => f.path === activeFilePath) || files[0] || null;

  // File Operations
  const handleUpdateActiveFileContent = (newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === activeFilePath ? { ...f, content: newContent } : f))
    );
  };

  const handleCreateFile = (newPath: string) => {
    if (files.some((f) => f.path === newPath)) {
      alert("A file with that path already exists.");
      return;
    }
    const ext = newPath.split(".").pop() || "js";
    const newFile: VirtualFile = {
      path: newPath,
      content: `// ${newPath}\n`,
      language: ext === "json" ? "json" : ext === "md" ? "markdown" : "javascript",
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFilePath(newPath);
  };

  const handleDeleteFile = (pathToDelete: string) => {
    if (files.length <= 1) return;
    const remaining = files.filter((f) => f.path !== pathToDelete);
    setFiles(remaining);
    if (activeFilePath === pathToDelete) {
      setActiveFilePath(remaining[0].path);
    }
  };

  const handleRenameFile = (oldPath: string, newPath: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === oldPath ? { ...f, path: newPath } : f))
    );
    if (activeFilePath === oldPath) {
      setActiveFilePath(newPath);
    }
  };

  const handleResetWorkspace = () => {
    if (confirm("Reset workspace to default template files? Current unsaved edits will be discarded.")) {
      setFiles(template.files);
      setActiveFilePath(template.activeFile);
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
  };

  const handleResetSingleFile = () => {
    const original = template.files.find((f) => f.path === activeFilePath);
    if (original) {
      handleUpdateActiveFileContent(original.content);
    }
  };

  // Run Code
  const handleRunCode = async () => {
    setIsRunning(true);
    setBottomTab("console");

    try {
      const res = await api.post("/api/coding-lab/run", {
        files,
        entryFile: template.activeFile,
      });
      if (res.success && res.data) {
        setExecutionOutcome(res.data);
      } else {
        alert(res.error || "Failed to execute code");
      }
    } catch (err: any) {
      console.error("Run error:", err);
      alert(err.message || "Failed to run code in sandbox");
    } finally {
      setIsRunning(false);
    }
  };

  // Run Tests
  const handleRunTests = async () => {
    setIsRunningTests(true);
    setBottomTab("tests");

    try {
      const res = await api.post("/api/coding-lab/test", {
        files,
        tests,
        entryFile: template.activeFile,
      });
      if (res.success && res.data) {
        setTestResults(res.data.testResults);
      } else {
        alert(res.error || "Failed to run test suite");
      }
    } catch (err: any) {
      console.error("Test error:", err);
      alert(err.message || "Test execution failed");
    } finally {
      setIsRunningTests(false);
    }
  };

  // Ask AI Debug
  const handleAskAiDebug = (errMsg: string) => {
    setShowAiPanel(true);
    setAiTrigger({ action: "debug", error: errMsg });
  };

  // Save Workspace to MongoDB
  const handleSaveToCloud = async (name: string) => {
    if (!user) {
      alert("Please log in to save workspaces to your account!");
      return;
    }

    if (workspaceId) {
      // Update existing
      const res = await api.put(`/api/coding-lab/workspaces/${workspaceId}`, {
        name,
        files,
        activeFile: activeFilePath,
      });
      if (res.success) {
        setWorkspaceName(name);
        alert("Workspace updated successfully!");
      }
    } else {
      // Create new
      const res = await api.post("/api/coding-lab/workspaces", {
        name,
        template: template.id,
        files,
        activeFile: activeFilePath,
      });
      if (res.success && res.data?.workspace) {
        setWorkspaceId(res.data.workspace._id);
        setWorkspaceName(name);
        alert("Workspace saved to cloud!");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050712] text-slate-100 overflow-hidden pt-14">
      {/* Top Workspace Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-slate-950/90 backdrop-blur-xl shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/coding-lab"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Lab Home</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold font-mono text-cyan-300 truncate max-w-[200px]">
            {workspaceName}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning || isRunningTests}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-1.5 text-xs font-bold shadow-md shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isRunning ? "Running..." : "Run"}</span>
          </button>

          <button
            type="button"
            onClick={handleRunTests}
            disabled={isRunning || isRunningTests || tests.length === 0}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-semibold text-white transition disabled:opacity-50"
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            <span>Test</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition"
            title="Save workspace to cloud"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAiPanel(!showAiPanel)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              showAiPanel
                ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                : "border-white/10 bg-slate-900 text-slate-400 hover:text-white"
            }`}
            title="Toggle AI Mentor Panel"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">AI Mentor</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Pane Layout */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left: Virtual File Explorer (2.5 cols on desktop) */}
        <div className="hidden md:block col-span-3 lg:col-span-2 border-r border-white/[0.08] h-full overflow-hidden">
          <FileExplorer
            files={files}
            activeFilePath={activeFilePath}
            onSelectFile={setActiveFilePath}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            onRenameFile={handleRenameFile}
            onResetWorkspace={handleResetWorkspace}
          />
        </div>

        {/* Middle: Code Editor + Bottom Panels */}
        <div
          className={`${
            showAiPanel
              ? "col-span-12 md:col-span-9 lg:col-span-6 xl:col-span-7"
              : "col-span-12 md:col-span-9 lg:col-span-10"
          } flex flex-col h-full overflow-hidden border-r border-white/[0.08]`}
        >
          {/* Top: Editor */}
          <div className="flex-1 overflow-hidden min-h-[360px]">
            <WorkspaceEditor
              file={activeFile}
              onChangeContent={handleUpdateActiveFileContent}
              onResetFile={handleResetSingleFile}
            />
          </div>

          {/* Bottom Panel (Console & Test Runner) */}
          <div className="h-64 border-t border-white/[0.08] bg-slate-950/80 flex flex-col shrink-0">
            {/* Panel Tabs */}
            <div className="flex items-center gap-2 px-4 py-1.5 border-b border-white/[0.06] bg-slate-950 shrink-0">
              <button
                type="button"
                onClick={() => setBottomTab("console")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  bottomTab === "console"
                    ? "bg-white/[0.08] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Output &amp; Console
              </button>

              <button
                type="button"
                onClick={() => setBottomTab("tests")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  bottomTab === "tests"
                    ? "bg-white/[0.08] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-fuchsia-400" /> Tests ({tests.length})
              </button>
            </div>

            {/* Panel Content Area */}
            <div className="flex-1 p-3.5 overflow-y-auto">
              {bottomTab === "console" ? (
                <ConsolePanel
                  outcome={executionOutcome}
                  isRunning={isRunning}
                  onClear={() => setExecutionOutcome(null)}
                  onAskAiDebug={handleAskAiDebug}
                />
              ) : (
                <TestRunner
                  tests={tests}
                  testResults={testResults}
                  isRunningTests={isRunningTests}
                  onRunTests={handleRunTests}
                  onAddTest={(t) => setTests((prev) => [...prev, t])}
                  onDeleteTest={(id) => setTests((prev) => prev.filter((t) => t.id !== id))}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: AI Assistant Panel */}
        {showAiPanel && (
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-full overflow-hidden flex flex-col bg-[#070914]">
            <AIAssistant
              activeFile={activeFile}
              allFiles={files}
              externalTrigger={aiTrigger}
              templateName={template.name}
              executionOutcome={executionOutcome}
              testResults={testResults}
            />
          </div>
        )}
      </div>

      {/* Save Workspace Dialog */}
      <SaveWorkspaceDialog
        isOpen={showSaveDialog}
        defaultName={workspaceName}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveToCloud}
      />
    </div>
  );
}
