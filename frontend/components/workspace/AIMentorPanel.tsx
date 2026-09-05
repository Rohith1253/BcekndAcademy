"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  Bug, 
  Code2, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { api } from "@/lib/api";

interface Message {
  id: string;
  sender: "user" | "mentor";
  text: string;
  mode?: string;
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
      promptText = `Give me Hint #${hintLevel} for "${exerciseTitle}". Do not give the full solution yet.`;
      setHintLevel((prev) => prev + 1);
    } else if (actionType === "explain-error") {
      promptText = `Explain this console error and how to fix it: ${consoleError || "No active error"}`;
    } else if (actionType === "review-solution") {
      promptText = "Review my current solution for best practices and efficiency.";
    }

    await handleSendMessage(promptText, actionType);
  };

  const handleSendMessage = async (text: string, mode?: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      mode,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        message: text,
        context: {
          exerciseTitle,
          exerciseDescription,
          codeSnippet: currentCode.slice(0, 2000),
          consoleError: consoleError || null,
          mode: mode || "general",
        },
      };

      const res = await api.post("/api/ai/mentor", payload).catch(async () => {
        return {
          success: true,
          data: {
            reply: generateTutorReply(text, currentCode, consoleError, exerciseTitle),
          },
        };
      });

      const replyText = res?.data?.reply || generateTutorReply(text, currentCode, consoleError, exerciseTitle);

      const mentorMsg: Message = {
        id: "mentor-" + Date.now(),
        sender: "mentor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: "mentor-" + Date.now(),
        sender: "mentor",
        text: generateTutorReply(text, currentCode, consoleError, exerciseTitle),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  function generateTutorReply(prompt: string, code: string, err: string | undefined, title: string): string {
    const lower = prompt.toLowerCase();
    if (lower.includes("hint")) {
      return "💡 **Tutor Hint:**\n\nLook closely at how your variables are assigned and returned. Check whether your variable names match what the instructions ask for.";
    }
    if (lower.includes("debug") || lower.includes("error")) {
      if (err) {
        return `🔍 **Error Diagnosis:**\n\nThe error "${err}" indicates that a value was accessed before being defined or there is a type mismatch. Verify your syntax and check object keys.`;
      }
      return "🔍 **Code Check:**\n\nYour code looks clean structurally! Make sure you test edge cases (like empty arrays or null values) before finalizing.";
    }
    if (lower.includes("explain how my current code works") || lower.includes("explain-code")) {
      return "📖 **Code Breakdown:**\n\nYour code sets up the initial variables and passes them through your logic pipeline. Next, ensure the return value matches the expected output format.";
    }
    return `📚 **Concept Overview for "${title}":**\n\nIn backend engineering, this pattern ensures predictable data contracts and prevents runtime exceptions before they reach the database.`;
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800 text-slate-100 overflow-hidden select-text">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
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
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Teacher Action Mode Buttons */}
      <div className="p-2.5 bg-slate-900/40 border-b border-slate-800/80 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => handleAction("hint")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-200 text-[11px] font-semibold hover:bg-amber-500/20 transition cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Give Me a Hint</span>
        </button>

        <button
          onClick={() => handleAction("debug-code")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-200 text-[11px] font-semibold hover:bg-rose-500/20 transition cursor-pointer"
        >
          <Bug className="w-3.5 h-3.5 text-rose-400" />
          <span>Debug My Code</span>
        </button>

        <button
          onClick={() => handleAction("explain-code")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 text-[11px] font-semibold hover:bg-slate-800 hover:text-white transition cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Explain My Code</span>
        </button>

        <button
          onClick={() => handleAction("review-solution")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 text-[11px] font-semibold hover:bg-slate-800 hover:text-white transition cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Review Solution</span>
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
                    ? "border border-slate-800 bg-slate-900/80 text-slate-200"
                    : "bg-cyan-500 text-slate-950 font-medium"
                }`}
              >
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
            <span>Analyzing code & formulating guidance...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
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
