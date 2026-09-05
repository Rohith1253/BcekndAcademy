"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Trophy, 
  Sparkles,
  Layers,
  Server,
  Code2,
  Database,
  ShieldCheck,
  Cpu
} from "lucide-react";

export interface RoadmapLevel {
  id: number;
  level: number;
  slug: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  description: string;
  whyItMatters: string;
  skills: string[];
  prerequisites: string[];
  status: "completed" | "current" | "locked";
}

const ROADMAP_LEVELS: RoadmapLevel[] = [
  {
    id: 1,
    level: 1,
    slug: "javascript-foundations",
    title: "JavaScript Foundations & Core Syntax",
    category: "Foundations",
    difficulty: "Beginner",
    estimatedHours: 6,
    description: "Master variables, data types, control flow, functions, objects, and scope before entering backend programming.",
    whyItMatters: "Backend engines execute code. Without mastering variables, objects, and logic, backend concepts like request handling will be confusing.",
    skills: ["Variables & Scopes", "Control Flow", "Functions & Closures", "Objects & Arrays"],
    prerequisites: [],
    status: "completed",
  },
  {
    id: 2,
    level: 2,
    slug: "programming-logic",
    title: "Programming Logic & Problem Solving",
    category: "Foundations",
    difficulty: "Beginner",
    estimatedHours: 6,
    description: "Learn how to break complex problems into algorithmic steps, handle edge cases, and design clean data flows.",
    whyItMatters: "Every backend endpoint requires processing user data, validating inputs, and filtering database records cleanly.",
    skills: ["Algorithmic Thinking", "Data Transformation", "Edge Case Handling", "Array Methods"],
    prerequisites: ["JavaScript Foundations"],
    status: "completed",
  },
  {
    id: 3,
    level: 3,
    slug: "async-javascript",
    title: "Modern & Asynchronous JavaScript",
    category: "JavaScript",
    difficulty: "Beginner",
    estimatedHours: 7,
    description: "Understand the JavaScript Event Loop, Promises, Async/Await, error handling, and asynchronous data streams.",
    whyItMatters: "Server operations (database queries, network calls, disk I/O) are non-blocking. Async mastery is required for Node.js.",
    skills: ["Event Loop", "Promises", "Async/Await", "Error Propagation"],
    prerequisites: ["Programming Logic"],
    status: "current",
  },
  {
    id: 4,
    level: 4,
    slug: "backend-node-js",
    title: "Backend Development with Node.js",
    category: "Node.js",
    difficulty: "Beginner",
    estimatedHours: 8,
    description: "Master real-world backend engineering with Node.js, HTTP servers, modules, Streams, and file system architecture.",
    whyItMatters: "Node.js connects your code directly to the network and operating system.",
    skills: ["HTTP Protocol", "Node Runtime", "Streams & Buffers", "Module System"],
    prerequisites: ["Async JavaScript"],
    status: "locked",
  },
  {
    id: 5,
    level: 5,
    slug: "express-rest-api",
    title: "REST API Development with Express.js",
    category: "Express",
    difficulty: "Intermediate",
    estimatedHours: 8,
    description: "Design, build, and deploy production-ready RESTful web services with Express, middleware pipelines, and error handling.",
    whyItMatters: "REST APIs power web and mobile applications worldwide. Express is the industry standard routing framework.",
    skills: ["Routing Architecture", "Middleware Pipelines", "Controller Pattern", "HTTP Status Codes"],
    prerequisites: ["Node.js"],
    status: "locked",
  },
  {
    id: 6,
    level: 6,
    slug: "fastify-high-performance-apis",
    title: "High-Throughput APIs with Fastify",
    category: "Framework",
    difficulty: "Intermediate",
    estimatedHours: 7,
    description: "Build blazing-fast, low-overhead Node.js HTTP services with Fastify schema validation, plugins, and hooks.",
    whyItMatters: "High-load systems require low CPU overhead and strict schema compilation for maximum throughput.",
    skills: ["JSON Schema", "High Throughput", "Plugin Architecture", "Lifecycle Hooks"],
    prerequisites: ["Express REST APIs"],
    status: "locked",
  },
  {
    id: 7,
    level: 7,
    slug: "mongodb-database",
    title: "MongoDB & Database Engineering",
    category: "Database",
    difficulty: "Intermediate",
    estimatedHours: 9,
    description: "Design production NoSQL schemas, write complex queries, build aggregation pipelines, and optimize indexing.",
    whyItMatters: "Backends cannot function without persistent data storage. Master schema modeling and indexing.",
    skills: ["NoSQL Schemas", "Mongoose ODM", "Aggregation Pipelines", "Query Indexing"],
    prerequisites: ["Express REST APIs"],
    status: "locked",
  },
  {
    id: 8,
    level: 8,
    slug: "backend-auth-security",
    title: "Backend Authentication & Security",
    category: "Security",
    difficulty: "Intermediate",
    estimatedHours: 8,
    description: "Implement secure JWT authentication, password hashing with bcrypt, role-based access control, and session protection.",
    whyItMatters: "Securing user data and verifying client identity is the most critical responsibility of a backend engineer.",
    skills: ["JWT Authentication", "Bcrypt Hashing", "Role-Based Access", "Secure Cookies"],
    prerequisites: ["MongoDB"],
    status: "locked",
  },
  {
    id: 9,
    level: 9,
    slug: "typescript-backend",
    title: "TypeScript for Backend Engineering",
    category: "TypeScript",
    difficulty: "Intermediate",
    estimatedHours: 8,
    description: "Write type-safe, maintainable backend code with TypeScript interfaces, generics, decorators, and runtime validation with Zod.",
    whyItMatters: "Modern engineering teams use TypeScript to eliminate bugs at compile time.",
    skills: ["Type Contracts", "Generics", "Zod Validation", "DTO Architecture"],
    prerequisites: ["Express REST APIs"],
    status: "locked",
  },
  {
    id: 10,
    level: 10,
    slug: "nestjs-backend-architecture",
    title: "Enterprise Architecture with NestJS",
    category: "Architecture",
    difficulty: "Intermediate",
    estimatedHours: 10,
    description: "Architect scalable enterprise microservices using NestJS dependency injection, controllers, services, and modules.",
    whyItMatters: "Understand how large engineering organizations structure enterprise backend codebases.",
    skills: ["Dependency Injection", "Modular Design", "Repository Pattern", "Microservices"],
    prerequisites: ["TypeScript"],
    status: "locked",
  },
  {
    id: 11,
    level: 11,
    slug: "production-security-hardening",
    title: "Production Security & OWASP Hardening",
    category: "Security",
    difficulty: "Advanced",
    estimatedHours: 8,
    description: "Harden production APIs with CORS policies, Helmet headers, Rate Limiting, input sanitization, and OWASP defenses.",
    whyItMatters: "Protect real-world web applications against malicious attacks, DDoS, and data leaks.",
    skills: ["CORS & Headers", "Rate Limiting", "OWASP Top 10", "Input Sanitization"],
    prerequisites: ["Backend Auth"],
    status: "locked",
  },
  {
    id: 12,
    level: 12,
    slug: "caching-queues-realtime",
    title: "Caching, Message Queues & WebSockets",
    category: "Advanced",
    difficulty: "Advanced",
    estimatedHours: 9,
    description: "Implement high-speed Redis caching, asynchronous job processing with BullMQ, and real-time bidirectional WebSockets.",
    whyItMatters: "Scaling high-traffic applications requires caching and background asynchronous task workers.",
    skills: ["Redis Caching", "BullMQ Queues", "WebSockets", "Pub/Sub Architecture"],
    prerequisites: ["NestJS"],
    status: "locked",
  },
  {
    id: 13,
    level: 13,
    slug: "cloud-microservices-capstone",
    title: "Docker, Cloud Microservices & Capstone",
    category: "Production",
    difficulty: "Advanced",
    estimatedHours: 12,
    description: "Containerize services with Docker, set up CI/CD automation pipelines, and deploy production cloud microservices.",
    whyItMatters: "Ship and deploy production backend systems that scale across distributed cloud infrastructure.",
    skills: ["Docker Containers", "CI/CD Automation", "API Gateways", "Production Deployment"],
    prerequisites: ["Caching & Queues"],
    status: "locked",
  },
];

export default function RoadmapPage() {
  const [selectedId, setSelectedId] = useState<number>(3);
  const selectedLevel = ROADMAP_LEVELS.find((m) => m.id === selectedId) || ROADMAP_LEVELS[2];

  const stats = useMemo(() => {
    const completedCount = ROADMAP_LEVELS.filter((m) => m.status === "completed").length;
    return {
      completion: Math.round((completedCount / ROADMAP_LEVELS.length) * 100),
      completedCount,
      totalHours: ROADMAP_LEVELS.reduce((acc, m) => acc + m.estimatedHours, 0),
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-20 px-4 sm:px-6 lg:px-10 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Summary */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-300">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span className="uppercase tracking-[0.2em] text-[11px]">13-Level Backend Path</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Backend Engineering Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A structured, step-by-step curriculum starting from absolute beginner foundations to distributed cloud microservices.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shrink-0 min-w-[240px]">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                <span>Overall Progress</span>
                <span className="text-cyan-400 font-bold font-mono">{stats.completion}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${stats.completion}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>{stats.completedCount} of 13 Levels Completed</span>
                <span>~{stats.totalHours} Total Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Grid & Active Level Inspector */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          
          {/* Level Progression List */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 px-1">
              Curriculum Levels (1 to 13)
            </p>

            <div className="space-y-3">
              {ROADMAP_LEVELS.map((item) => {
                const isSelected = selectedId === item.id;
                const isDone = item.status === "completed";
                const isCurrent = item.status === "current";

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 mt-0.5 ${
                            isDone
                              ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                              : isCurrent
                              ? "border-cyan-500/40 bg-cyan-500/20 text-cyan-300"
                              : "border-slate-800 bg-slate-950 text-slate-500"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : isCurrent ? (
                            <Circle className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-600" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                              Level {item.level}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-800">
                              {item.difficulty}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-0.5">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.estimatedHours}h
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Level Inspector Card */}
          <div className="lg:sticky lg:top-24 space-y-6 self-start">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-2xl space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Level {selectedLevel.level} Details
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {selectedLevel.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {selectedLevel.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedLevel.description}
                </p>
              </div>

              {/* Why Learn This */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Why this level matters:
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedLevel.whyItMatters}
                </p>
              </div>

              {/* Key Skills Learned */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Key Concepts Mastered:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLevel.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1"
                    >
                      &bull; {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href={`/courses/${selectedLevel.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 text-xs font-bold text-slate-950 transition shadow-lg shadow-cyan-500/20"
                >
                  <span>Open Level {selectedLevel.level} Course</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
