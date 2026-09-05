"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  HelpCircle, 
  Lightbulb, 
  Bug, 
  Code2, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  BookOpen,
  RefreshCw,
  Info
} from "lucide-react";
import { api } from "@/lib/api";

interface Message {
  id: string;
  sender: "user" | "mentor";
  text: string;
  mode?: string;
  isOfflineFallback?: boolean;
  isErrorState?: boolean;
  timestamp: string;
}

interface AIMentorPanelProps {
  currentCode: string;
  exerciseTitle: string;
  exerciseDescription: string;
  consoleError?: string;
}

export default function AIMentorPanel({
  currentCode,
  exerciseTitle,
  exerciseDescription,
  consoleError,
}: AIMentorPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-m",
      sender: "mentor",
      text: "👋 I'm your **Backend Academy Code Mentor**.\n\nI can explain concepts, help you debug errors, and provide progressive hints to guide your solution without giving away answers immediately.\n\nChoose an action below or ask any question!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const msgCounterRef = useRef(1);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAction = async (actionType: string) => {
    let promptText = "";
    if (actionType === "explain-concept") {
      promptText = `Explain the core concepts behind "${exerciseTitle}" in clear, simple terms.`;
    } else if (actionType === "explain-code") {
      promptText = "Explain how my current code works line by line.";
    } else if (actionType === "debug-code") {
      promptText = "Analyze my code for potential bugs or logic errors. Give me guidance on where to look.";
    } else if (actionType === "hint") {
      promptText = `Give me Hint Level ${hintLevel} for "${exerciseTitle}". (Level 1=Concept, Level 2=Logic direction, Level 3=Implementation).`;
      setHintLevel((prev) => (prev >= 3 ? 1 : prev + 1));
    } else if (actionType === "explain-error") {
      promptText = `Explain this runtime error and how to fix it: ${consoleError || "No active runtime error reported."}`;
    } else if (actionType === "review-solution") {
      promptText = "Review my current code for backend best practices, edge cases, and code efficiency.";
    }

    await handleSendMessage(promptText, actionType);
  };

  const handleSendMessage = async (text: string, mode?: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: "user-" + (++msgCounterRef.current),
      sender: "user",
      text,
      mode,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const backendAction = mode || "chat";
      const payload = {
        action: backendAction,
        code: currentCode.slice(0, 4000),
        userMessage: text,
        language: "javascript",
        learningMode: true,
        context: {
          exerciseTitle,
          exerciseDescription,
          consoleError: consoleError || null,
        },
      };

      // Call backend AI endpoint: POST /api/coding-lab/ai
      const res = await api.post("/api/coding-lab/ai", payload);

      if (res && res.data && res.data.message) {
        const mentorMsg: Message = {
          id: "mentor-" + (++msgCounterRef.current),
          sender: "mentor",
          text: res.data.message,
          timestamp: "Just now",
        };
        setMessages((prev) => [...prev, mentorMsg]);
      } else {
        throw new Error("Invalid response format from AI service");
      }
    } catch (err: any) {
      // Clear failure handling: do NOT pretend offline text is an AI response
      const offlineGuidance = generateOfflineGuidance(text, currentCode, consoleError, exerciseTitle, hintLevel);

      const fallbackMsg: Message = {
        id: "mentor-" + (++msgCounterRef.current),
        sender: "mentor",
        text: offlineGuidance,
        isOfflineFallback: true,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Structured Offline Guidance (clearly labeled as non-AI local guidance)
  function generateOfflineGuidance(
    prompt: string,
    code: string,
    err: string | undefined,
    title: string,
    level: number
  ): string {
    const lower = prompt.toLowerCase();
    if (lower.includes("hint")) {
      if (level === 1) {
        return `💡 **[Offline Guidance — Hint Level 1: Concept Direction]**\n\nFor **${title}**, focus on what inputs are being provided and what output structure is expected. Check the instructions on the left panel.`;
      } else if (level === 2) {
        return `💡 **[Offline Guidance — Hint Level 2: Logic Direction]**\n\nCheck your variable names and assignments. Ensure your conditions or return statements handle the exact criteria specified in the tests.`;
      } else {
        return `💡 **[Offline Guidance — Hint Level 3: Implementation Direction]**\n\nVerify that you are using the correct return type (e.g. an object, array, or number). Compare your output against the "Expected Output" section.`;
      }
    }
    if (lower.includes("debug") || lower.includes("error")) {
      if (err) {
        return `🔍 **[Offline Guidance — Error Analysis]**\n\nReported error: \`${err}\`.\nCheck for undefined variables, mismatched object keys, or syntax errors around the reported line.`;
      }
      return `🔍 **[Offline Guidance — Code Inspection]**\n\nEnsure all variables used in your code are properly declared with \`const\` or \`let\`, and that your function returns the expected value.`;
    }
    if (lower.includes("explain-code") || lower.includes("explain how")) {
      return `📖 **[Offline Guidance — Code Structure]**\n\nYour code initializes data and applies logic steps. Test each step individually with \`console.log()\` to verify intermediate values.`;
    }
    return `📚 **[Offline Guidance — Concept Overview: ${title}]**\n\nIn backend engineering, this pattern ensures predictable data contracts, prevents runtime errors, and isolates business logic.`;
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800 text-slate-100 overflow-hidden select-text">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">AI Mentor Mode</h3>
            <p className="text-[10px] text-slate-400">Context-aware teaching tutor</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6 AI Action Mode Buttons Grid */}
      <div className="p-2.5 bg-slate-900/40 border-b border-slate-800/80 grid grid-cols-2 gap-1.5 shrink-0">
        
        {/* Mode 1: Explain Concept */}
        <button
          onClick={() => handleAction("explain-concept")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-200 text-[11px] font-semibold hover:bg-indigo-500/20 transition cursor-pointer text-left"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">Explain Concept</span>
        </button>

        {/* Mode 2: Explain Code */}
        <button
          onClick={() => handleAction("explain-code")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-200 text-[11px] font-semibold hover:bg-cyan-500/20 transition cursor-pointer text-left"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">Explain My Code</span>
        </button>

        {/* Mode 3: Debug Code */}
        <button
          onClick={() => handleAction("debug-code")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-200 text-[11px] font-semibold hover:bg-rose-500/20 transition cursor-pointer text-left"
        >
          <Bug className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">Debug My Code</span>
        </button>

        {/* Mode 4: Progressive Hint */}
        <button
          onClick={() => handleAction("hint")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-200 text-[11px] font-semibold hover:bg-amber-500/20 transition cursor-pointer text-left"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Hint (Lvl {hintLevel})</span>
        </button>

        {/* Mode 5: Explain Error */}
        <button
          onClick={() => handleAction("explain-error")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-200 text-[11px] font-semibold hover:bg-amber-500/20 transition cursor-pointer text-left"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Explain Error</span>
        </button>

        {/* Mode 6: Review Solution */}
        <button
          onClick={() => handleAction("review-solution")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-200 text-[11px] font-semibold hover:bg-emerald-500/20 transition cursor-pointer text-left"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Review Solution</span>
        </button>

      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.map((msg) => {
          const isMentor = msg.sender === "mentor";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isMentor ? "justify-start" : "justify-end"}`}
            >
              {isMentor && (
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isMentor
                    ? msg.isOfflineFallback
                      ? "border border-amber-500/30 bg-amber-500/5 text-amber-100"
                      : "border border-slate-800 bg-slate-900/80 text-slate-200"
                    : "bg-cyan-500 text-slate-950 font-medium"
                }`}
              >
                {msg.isOfflineFallback && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 mb-1.5 uppercase tracking-wider">
                    <Info className="w-3 h-3" />
                    <span>AI Server Offline — Showing Local Guidance</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span className={`mt-1.5 block text-[9px] ${isMentor ? "text-slate-500" : "text-slate-800"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 py-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Analyzing code & formulating mentor guidance...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage(input)}
          placeholder="Ask a question about this exercise..."
          className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
        />
        <button
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim() || loading}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
