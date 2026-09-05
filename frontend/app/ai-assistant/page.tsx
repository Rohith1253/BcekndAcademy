"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Trash2, 
  Code2, 
  Server, 
  Database, 
  ShieldCheck, 
  HelpCircle,
  Copy,
  Check,
  RotateCcw
} from "lucide-react";
import { api } from "@/lib/api";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: "Explain the Request-Response lifecycle", prompt: "Explain the complete HTTP Request-Response lifecycle from browser click to backend server response in simple beginner terms." },
  { label: "How does JWT Authentication work?", prompt: "Explain how JSON Web Tokens (JWT) work for stateless authentication. Why is it better than traditional server sessions?" },
  { label: "SQL vs MongoDB comparison", prompt: "Compare SQL (relational) vs MongoDB (document) databases. When should a backend engineer choose one over the other?" },
  { label: "Explain Database Indexing", prompt: "What is a database index? Why does indexing speed up queries, and what is the tradeoff?" },
  { label: "Design a REST API for E-commerce", prompt: "Design a clean RESTful API specification (endpoints, HTTP methods, status codes) for an e-commerce order management system." },
  { label: "How to prevent SQL/NoSQL Injection?", prompt: "Explain how SQL and NoSQL injection vulnerabilities occur in backend code, and how to prevent them using parameterized queries and ORMs." }
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "👋 Hello! I am your **Backend Academy Learning Assistant**.\n\nI'm here to help you understand backend architecture, debug code, explain database designs, and master server concepts from JavaScript foundations to distributed systems.\n\nWhat backend topic would you like to explore today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(1);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: "usr-" + (++messageCounterRef.current),
      sender: "user",
      text: textToSend,
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Call backend AI / assist endpoint or simulate structured response
      const res = await api.post("/api/ai/chat", {
        message: textToSend,
        context: "Backend Learning Platform Assistant"
      }).catch(async () => {
        // Fallback simulated intelligent response
        return {
          success: true,
          data: {
            reply: generateEducationalReply(textToSend)
          }
        };
      });

      const replyText = res?.data?.reply || generateEducationalReply(textToSend);

      const aiMsg: Message = {
        id: "ai-" + (++messageCounterRef.current),
        sender: "ai",
        text: replyText,
        timestamp: "Just now"
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: "ai-" + (++messageCounterRef.current),
        sender: "ai",
        text: generateEducationalReply(textToSend),
        timestamp: "Just now"
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  function generateEducationalReply(prompt: string): string {
    const lower = prompt.toLowerCase();
    if (lower.includes("jwt") || lower.includes("auth")) {
      return "### 🔐 JSON Web Token (JWT) Overview\n\nA **JWT** is a compact, URL-safe token representing claims transferred between two parties.\n\n1. **Header**: Specifies the hashing algorithm (e.g., `HS256`).\n2. **Payload**: Contains claims (user ID, role, expiration timestamp).\n3. **Signature**: Verified using a private server secret (`JWT_SECRET`).\n\n**Why it matters for Backend:**\nInstead of querying a session database on every incoming API request, your server verifies the signature cryptographically in microseconds.";
    }
    if (lower.includes("lifecycle") || lower.includes("request")) {
      return "### 🌐 HTTP Request-Response Lifecycle\n\n1. **DNS Lookup**: Browser translates `api.example.com` to an IP address.\n2. **TCP & TLS Handshake**: Establishes a secure connection.\n3. **HTTP Request**: Client sends headers (e.g. `Authorization: Bearer <token>`) and payload.\n4. **Middleware Pipeline**: Backend parses body, logs request, checks authentication.\n5. **Route Controller**: Executes business logic & queries the database.\n6. **Response Generation**: Server returns status code (e.g., `200 OK`, `201 Created`) and JSON data.";
    }
    if (lower.includes("sql") || lower.includes("mongo")) {
      return "### 🗄️ SQL vs MongoDB: Core Differences\n\n| Feature | SQL (PostgreSQL/MySQL) | NoSQL (MongoDB) |\n|---|---|---|\n| **Data Model** | Tables, Rows, Foreign Keys | JSON Documents, Collections |\n| **Schema** | Rigid, Pre-defined | Dynamic, Polymorphic |\n| **ACID Guarantees** | Strict multi-table transactions | Document-level atomicity (multi-doc supported) |\n| **Best For** | Financial data, Complex relations | Fast iteration, Content feeds, Unstructured data |";
    }
    return "### 💡 Backend Engineering Insight\n\nGreat question! In backend architecture, best practices emphasize:\n\n- **Separation of Concerns**: Keep Routes, Controllers, Services, and Data Access Layers in distinct modules.\n- **Validation Early**: Always validate user inputs with schema validators (like Zod or Joi) before hitting database layers.\n- **Graceful Error Handling**: Return consistent JSON error payloads (`{ success: false, error: '...' }`) with accurate HTTP status codes.\n\nFeel free to ask for specific code examples in JavaScript/Node.js, Python, Go, or Java!";
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "ai",
        text: "Chat cleared. What backend engineering topic would you like to explore?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-6 sm:pt-8 pb-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-5xl h-[calc(100vh-5rem)] flex flex-col rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                Backend Learning Assistant
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Dedicated Hub
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Ask architectural questions, debug concepts, and get step-by-step guidance
              </p>
            </div>
          </div>

          <button
            onClick={handleClear}
            title="Clear Chat History"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:text-white text-xs text-slate-400 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
          {messages.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAI ? "justify-start" : "justify-end"}`}
              >
                {isAI && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`relative max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isAI
                      ? "border border-slate-800 bg-slate-950/80 text-slate-200"
                      : "bg-cyan-500 text-slate-950 font-medium"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  <div className={`mt-2 flex items-center justify-between text-[10px] ${isAI ? "text-slate-500" : "text-slate-800"}`}>
                    <span>{msg.timestamp}</span>
                    {isAI && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-slate-300 ml-3 flex items-center gap-1"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Thinking and analyzing backend concepts...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Queries */}
        <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Quick Topics:
          </span>
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-300 text-[11px] text-slate-300 shrink-0 transition"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about Node.js, Express, REST APIs, MongoDB, JWT auth, or debugging..."
            className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
