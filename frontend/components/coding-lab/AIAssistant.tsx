"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Bug,
  Search,
  CheckCircle2,
  User,
  Loader2,
  Zap,
  Trash2,
} from "lucide-react";
import { api } from "@/lib/api";
import type {
  AIMessageItem,
  VirtualFile,
  ExecutionOutcome,
  LabTestResult,
} from "@/lib/coding-lab-types";

interface AIAssistantProps {
  activeFile: VirtualFile | null;
  allFiles: VirtualFile[];
  externalTrigger?: { action: string; error?: string } | null;
  templateName?: string;
  executionOutcome?: ExecutionOutcome | null;
  testResults?: LabTestResult[] | null;
}

// ─── Simple Markdown Renderer ─────────────────────────────────────

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trimStart().startsWith("```")) {
      const lang = line.trimStart().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={`code-${i}`} className="my-2 rounded-lg overflow-hidden">
          {lang && (
            <div className="px-3 py-1 bg-slate-800 text-[10px] font-mono text-slate-400 border-b border-slate-700">
              {lang}
            </div>
          )}
          <pre className="bg-slate-900/90 px-3 py-2.5 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={`h3-${i}`} className="font-bold text-white mt-2 mb-1 text-[13px]">
          {renderInline(line.slice(4))}
        </h4>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={`h2-${i}`} className="font-bold text-white mt-2.5 mb-1 text-sm">
          {renderInline(line.slice(3))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h2 key={`h1-${i}`} className="font-bold text-white mt-3 mb-1 text-[15px]">
          {renderInline(line.slice(2))}
        </h2>
      );
      i++;
      continue;
    }

    // Bullet lists
    if (line.match(/^[\s]*[-*]\s/)) {
      const indent = line.match(/^(\s*)/)?.[1]?.length || 0;
      elements.push(
        <div key={`li-${i}`} className="flex gap-1.5" style={{ paddingLeft: `${indent * 4 + 4}px` }}>
          <span className="text-cyan-400 shrink-0 mt-0.5">•</span>
          <span>{renderInline(line.replace(/^[\s]*[-*]\s/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Numbered lists
    if (line.match(/^\s*\d+\.\s/)) {
      const match = line.match(/^(\s*)(\d+)\.\s(.*)$/);
      if (match) {
        const indent = match[1].length;
        elements.push(
          <div key={`ol-${i}`} className="flex gap-1.5" style={{ paddingLeft: `${indent * 4 + 4}px` }}>
            <span className="text-cyan-400 shrink-0 font-mono text-[10px] mt-0.5">{match[2]}.</span>
            <span>{renderInline(match[3])}</span>
          </div>
        );
      }
      i++;
      continue;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={`br-${i}`} className="h-1.5" />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

/** Render inline markdown: **bold**, `code`, *italic* */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Regex matches: **bold**, `code`, *italic*
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      parts.push(
        <strong key={key++} className="font-semibold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // `code`
      parts.push(
        <code
          key={key++}
          className="px-1 py-0.5 bg-slate-800 rounded text-emerald-300 font-mono text-[10.5px]"
        >
          {match[3]}
        </code>
      );
    } else if (match[4]) {
      // *italic*
      parts.push(
        <em key={key++} className="italic text-slate-300">
          {match[4]}
        </em>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// ─── Quick Action Shortcuts ───────────────────────────────────────

const QUICK_ACTIONS = [
  {
    id: "explain",
    label: "Explain",
    icon: Search,
    color: "text-cyan-400",
    message: "Explain this code — what does it do, how does the request lifecycle flow, and what are the key backend concepts?",
  },
  {
    id: "hint",
    label: "Hint",
    icon: Sparkles,
    color: "text-amber-400",
    message: "Give me a hint on what to build or fix next, without giving away the complete solution.",
  },
  {
    id: "debug",
    label: "Debug",
    icon: Bug,
    color: "text-rose-400",
    message: "Please debug my current code — find the errors, explain why they happen, and suggest how to fix them.",
  },
  {
    id: "review",
    label: "Review",
    icon: CheckCircle2,
    color: "text-emerald-400",
    message: "Review this code for backend best practices, security, error handling, and architectural cleanliness.",
  },
  {
    id: "optimize",
    label: "Optimize",
    icon: Zap,
    color: "text-fuchsia-400",
    message: "Suggest performance optimizations, async efficiency improvements, and cleaner patterns for this code.",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────

export default function AIAssistant({
  activeFile,
  allFiles,
  externalTrigger,
  templateName,
  executionOutcome,
  testResults,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessageItem[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "👋 Hey there! I'm your **AI Backend Mentor**.\n\nAsk me anything — debug errors, explain concepts, get code reviews, or just chat about backend engineering. I'm here to help!\n\n*Try typing a question or use the quick actions below.*",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [learningMode, setLearningMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: AIMessageItem = {
        id: `u_${Date.now()}`,
        sender: "user",
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        // Build conversation history from existing messages (last 20, exclude welcome)
        const recentHistory = messages
          .filter((m) => m.id !== "welcome")
          .slice(-20)
          .map((m) => ({
            role: (m.sender === "user" ? "user" : "assistant") as "user" | "assistant",
            content: m.text,
          }));

        const res = await api.post("/api/coding-lab/ai/chat", {
          userMessage: text.trim(),
          code: activeFile?.content,
          activeFile: activeFile?.path,
          language: activeFile?.language,
          learningMode,
          template: templateName,
          consoleOutput: executionOutcome?.output,
          testResults: testResults?.map((t) => ({
            name: t.name,
            passed: t.passed,
            error: t.error,
          })),
          projectFiles: allFiles.map((f) => ({
            path: f.path,
            content: f.content.slice(0, 4000),
          })),
          conversationHistory: recentHistory,
        });

        if (res.success && res.data) {
          const aiMsg: AIMessageItem = {
            id: `ai_${Date.now()}`,
            sender: "ai",
            text: res.data.message,
            provider: res.data.provider,
            learningMode: res.data.learningMode,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, aiMsg]);
        } else {
          throw new Error(res.error || "Failed to get AI response");
        }
      } catch (err: any) {
        const errorMsg: AIMessageItem = {
          id: `err_${Date.now()}`,
          sender: "ai",
          text: `⚠️ **Error:** ${err.message || "Failed to reach AI mentor"}.\n\nPlease ensure your AI service configuration is active in your backend environment, or try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
        // Focus back on textarea
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    },
    [
      isLoading,
      messages,
      activeFile,
      learningMode,
      templateName,
      executionOutcome,
      testResults,
      allFiles,
    ]
  );

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle external triggers (e.g. from "Ask AI to Debug" in ConsolePanel)
  useEffect(() => {
    if (externalTrigger) {
      const action = QUICK_ACTIONS.find((a) => a.id === externalTrigger.action);
      const message = externalTrigger.error
        ? `Debug this error: ${externalTrigger.error}`
        : action?.message || `Help me with: ${externalTrigger.action}`;
      sendMessage(message);
    }
  }, [externalTrigger, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter inserts newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: "🔄 Conversation cleared! Ask me anything about backend engineering.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-[#070914] text-slate-200 select-text">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-slate-950/80 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-none">AI Mentor</h4>
            <span className="text-[10px] font-mono text-slate-400">AI · Backend Lab</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Clear Conversation */}
          <button
            type="button"
            onClick={clearConversation}
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-white/10 bg-slate-900 text-slate-400 hover:text-white hover:border-white/20 transition cursor-pointer"
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          {/* Learning Mode Toggle */}
          <button
            type="button"
            onClick={() => setLearningMode(!learningMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition cursor-pointer ${
              learningMode
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-white/10 bg-slate-900 text-slate-400 hover:text-white"
            }`}
            title={
              learningMode
                ? "Learning Mode: AI guides you with concepts instead of giving away full answers"
                : "Direct Mode: Full code answers allowed"
            }
          >
            <BookOpen className="w-3 h-3" />
            <span>{learningMode ? "Learning" : "Direct"}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="flex items-center gap-1.5 p-2 border-b border-white/[0.06] bg-slate-950/40 overflow-x-auto shrink-0 scrollbar-none">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => sendMessage(action.message)}
              disabled={isLoading}
              className="flex items-center gap-1 shrink-0 rounded-md border border-white/[0.08] bg-slate-900/60 hover:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 transition cursor-pointer disabled:opacity-50"
              title={action.message}
            >
              <Icon className={`w-3 h-3 ${action.color}`} />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.sender === "ai" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`rounded-xl px-3.5 py-2.5 max-w-[85%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-cyan-500/20 border border-cyan-500/30 text-white"
                  : "bg-slate-900/90 border border-white/[0.08] text-slate-200"
              }`}
            >
              <div className="whitespace-pre-line break-words">
                {m.sender === "ai" ? renderMarkdown(m.text) : m.text}
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                {m.provider ? (
                  <span className="text-[9px] font-mono text-cyan-400/90 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">
                    {m.provider}
                  </span>
                ) : (
                  <span />
                )}
                <span>{m.timestamp}</span>
              </div>
            </div>

            {m.sender === "user" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-800 text-slate-400 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-white/[0.08] px-3.5 py-2.5 text-xs text-cyan-400 font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>AI Mentor is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSubmit}
        className="p-2.5 border-t border-white/[0.08] bg-slate-950/80 shrink-0"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            placeholder={
              activeFile
                ? "Ask anything about your code..."
                : "Ask anything about backend engineering..."
            }
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            className="flex-1 rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition resize-none min-h-[34px] max-h-[120px]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 transition shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-1 text-[10px] text-slate-600 font-mono px-1">
          Enter to send · Shift+Enter for new line
        </div>
      </form>
    </div>
  );
}
