import {
  Server,
  Code2,
  Zap,
  Database,
  ShieldCheck,
  Cpu,
  Terminal,
  FileCode2,
  Coffee,
  Hash,
  Layers,
  ShieldAlert,
  Gem,
  Compass,
  Activity,
  type LucideIcon,
} from "lucide-react";

export interface CourseThemeConfig {
  icon: LucideIcon;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  cardBorderHover: string;
  cardBgGradient: string;
  glowColor: string;
  progressBarGradient: string;
  textColor: string;
  buttonGradient: string;
}

export const COURSE_THEMES: Record<string, CourseThemeConfig> = {
  // JavaScript / Node.js
  "backend-node-js": {
    icon: Server,
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-400",
    cardBorderHover: "hover:border-emerald-400/50 hover:shadow-emerald-500/10",
    cardBgGradient: "from-emerald-950/20 via-slate-900/90 to-cyan-950/15",
    glowColor: "rgba(16, 185, 129, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-emerald-400 to-cyan-400",
    textColor: "text-emerald-300",
    buttonGradient: "from-emerald-500 to-cyan-500 text-slate-950",
  },
  "express-rest-api": {
    icon: Zap,
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-400",
    cardBorderHover: "hover:border-amber-400/50 hover:shadow-amber-500/10",
    cardBgGradient: "from-amber-950/20 via-slate-900/90 to-orange-950/15",
    glowColor: "rgba(245, 158, 11, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-amber-400 to-orange-400",
    textColor: "text-amber-300",
    buttonGradient: "from-amber-500 to-orange-500 text-slate-950",
  },
  "fastify-high-performance-apis": {
    icon: Zap,
    badgeBg: "bg-teal-500/10",
    badgeBorder: "border-teal-500/30",
    badgeText: "text-teal-400",
    cardBorderHover: "hover:border-teal-400/50 hover:shadow-teal-500/10",
    cardBgGradient: "from-teal-950/20 via-slate-900/90 to-cyan-950/15",
    glowColor: "rgba(20, 184, 166, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-teal-400 to-cyan-400",
    textColor: "text-teal-300",
    buttonGradient: "from-teal-500 to-cyan-500 text-slate-950",
  },
  "mongodb-database": {
    icon: Database,
    badgeBg: "bg-teal-500/10",
    badgeBorder: "border-teal-500/30",
    badgeText: "text-teal-400",
    cardBorderHover: "hover:border-teal-400/50 hover:shadow-teal-500/10",
    cardBgGradient: "from-teal-950/20 via-slate-900/90 to-emerald-950/15",
    glowColor: "rgba(20, 184, 166, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-teal-400 to-emerald-400",
    textColor: "text-teal-300",
    buttonGradient: "from-teal-500 to-emerald-500 text-slate-950",
  },
  "backend-auth-security": {
    icon: ShieldCheck,
    badgeBg: "bg-violet-500/10",
    badgeBorder: "border-violet-500/30",
    badgeText: "text-violet-400",
    cardBorderHover: "hover:border-violet-400/50 hover:shadow-violet-500/10",
    cardBgGradient: "from-violet-950/20 via-slate-900/90 to-rose-950/15",
    glowColor: "rgba(139, 92, 246, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-violet-400 to-fuchsia-400",
    textColor: "text-violet-300",
    buttonGradient: "from-violet-500 to-rose-500 text-slate-950",
  },

  // TypeScript
  "typescript-backend": {
    icon: Code2,
    badgeBg: "bg-sky-500/10",
    badgeBorder: "border-sky-500/30",
    badgeText: "text-sky-400",
    cardBorderHover: "hover:border-sky-400/50 hover:shadow-sky-500/10",
    cardBgGradient: "from-sky-950/20 via-slate-900/90 to-indigo-950/15",
    glowColor: "rgba(14, 165, 233, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-sky-400 to-indigo-400",
    textColor: "text-sky-300",
    buttonGradient: "from-sky-500 to-indigo-500 text-slate-950",
  },
  "nestjs-backend-architecture": {
    icon: FileCode2,
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-500/30",
    badgeText: "text-rose-400",
    cardBorderHover: "hover:border-rose-400/50 hover:shadow-rose-500/10",
    cardBgGradient: "from-rose-950/20 via-slate-900/90 to-red-950/15",
    glowColor: "rgba(244, 63, 94, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-rose-400 to-red-400",
    textColor: "text-rose-300",
    buttonGradient: "from-rose-500 to-red-500 text-slate-950",
  },

  // Python
  "python-backend-fundamentals": {
    icon: Cpu,
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-400",
    cardBorderHover: "hover:border-emerald-400/50 hover:shadow-emerald-500/10",
    cardBgGradient: "from-emerald-950/20 via-slate-900/90 to-cyan-950/15",
    glowColor: "rgba(16, 185, 129, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-emerald-400 to-teal-400",
    textColor: "text-emerald-300",
    buttonGradient: "from-emerald-500 to-teal-500 text-slate-950",
  },
  "fastapi-modern-apis": {
    icon: Zap,
    badgeBg: "bg-teal-500/10",
    badgeBorder: "border-teal-500/30",
    badgeText: "text-teal-400",
    cardBorderHover: "hover:border-teal-400/50 hover:shadow-teal-500/10",
    cardBgGradient: "from-teal-950/20 via-slate-900/90 to-emerald-950/15",
    glowColor: "rgba(20, 184, 166, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-teal-400 to-emerald-400",
    textColor: "text-teal-300",
    buttonGradient: "from-teal-500 to-emerald-500 text-slate-950",
  },
  "django-enterprise-backend": {
    icon: Server,
    badgeBg: "bg-green-500/10",
    badgeBorder: "border-green-500/30",
    badgeText: "text-green-400",
    cardBorderHover: "hover:border-green-400/50 hover:shadow-green-500/10",
    cardBgGradient: "from-green-950/20 via-slate-900/90 to-emerald-950/15",
    glowColor: "rgba(34, 197, 94, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-green-400 to-emerald-400",
    textColor: "text-green-300",
    buttonGradient: "from-green-500 to-emerald-500 text-slate-950",
  },

  // Java
  "java-backend-fundamentals": {
    icon: Coffee,
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-500/30",
    badgeText: "text-rose-400",
    cardBorderHover: "hover:border-rose-400/50 hover:shadow-rose-500/10",
    cardBgGradient: "from-rose-950/20 via-slate-900/90 to-red-950/15",
    glowColor: "rgba(244, 63, 94, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-rose-400 to-amber-400",
    textColor: "text-rose-300",
    buttonGradient: "from-rose-500 to-amber-500 text-slate-950",
  },
  "spring-boot-microservices": {
    icon: Server,
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-400",
    cardBorderHover: "hover:border-emerald-400/50 hover:shadow-emerald-500/10",
    cardBgGradient: "from-emerald-950/20 via-slate-900/90 to-green-950/15",
    glowColor: "rgba(16, 185, 129, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-emerald-400 to-green-400",
    textColor: "text-emerald-300",
    buttonGradient: "from-emerald-500 to-green-500 text-slate-950",
  },

  // C# (.NET)
  "csharp-backend-fundamentals": {
    icon: Hash,
    badgeBg: "bg-purple-500/10",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-400",
    cardBorderHover: "hover:border-purple-400/50 hover:shadow-purple-500/10",
    cardBgGradient: "from-purple-950/20 via-slate-900/90 to-indigo-950/15",
    glowColor: "rgba(168, 85, 247, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-purple-400 to-indigo-400",
    textColor: "text-purple-300",
    buttonGradient: "from-purple-500 to-indigo-500 text-slate-950",
  },
  "aspnet-core-web-apis": {
    icon: Zap,
    badgeBg: "bg-indigo-500/10",
    badgeBorder: "border-indigo-500/30",
    badgeText: "text-indigo-400",
    cardBorderHover: "hover:border-indigo-400/50 hover:shadow-indigo-500/10",
    cardBgGradient: "from-indigo-950/20 via-slate-900/90 to-violet-950/15",
    glowColor: "rgba(99, 102, 241, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-indigo-400 to-cyan-400",
    textColor: "text-indigo-300",
    buttonGradient: "from-indigo-500 to-cyan-500 text-slate-950",
  },

  // Go
  "go-backend-fundamentals": {
    icon: Zap,
    badgeBg: "bg-cyan-500/10",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-400",
    cardBorderHover: "hover:border-cyan-400/50 hover:shadow-cyan-500/10",
    cardBgGradient: "from-cyan-950/20 via-slate-900/90 to-blue-950/15",
    glowColor: "rgba(6, 182, 212, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-cyan-400 to-blue-400",
    textColor: "text-cyan-300",
    buttonGradient: "from-cyan-500 to-blue-500 text-slate-950",
  },
  "gin-high-performance-apis": {
    icon: Cpu,
    badgeBg: "bg-sky-500/10",
    badgeBorder: "border-sky-500/30",
    badgeText: "text-sky-400",
    cardBorderHover: "hover:border-sky-400/50 hover:shadow-sky-500/10",
    cardBgGradient: "from-sky-950/20 via-slate-900/90 to-cyan-950/15",
    glowColor: "rgba(14, 165, 233, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-sky-400 to-teal-400",
    textColor: "text-sky-300",
    buttonGradient: "from-sky-500 to-teal-500 text-slate-950",
  },

  // PHP
  "php-backend-fundamentals": {
    icon: Layers,
    badgeBg: "bg-indigo-500/10",
    badgeBorder: "border-indigo-500/30",
    badgeText: "text-indigo-400",
    cardBorderHover: "hover:border-indigo-400/50 hover:shadow-indigo-500/10",
    cardBgGradient: "from-indigo-950/20 via-slate-900/90 to-blue-950/15",
    glowColor: "rgba(99, 102, 241, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-indigo-400 to-sky-400",
    textColor: "text-indigo-300",
    buttonGradient: "from-indigo-500 to-sky-500 text-slate-950",
  },
  "laravel-web-apis": {
    icon: Zap,
    badgeBg: "bg-red-500/10",
    badgeBorder: "border-red-500/30",
    badgeText: "text-red-400",
    cardBorderHover: "hover:border-red-400/50 hover:shadow-red-500/10",
    cardBgGradient: "from-red-950/20 via-slate-900/90 to-rose-950/15",
    glowColor: "rgba(239, 68, 68, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-red-400 to-rose-400",
    textColor: "text-red-300",
    buttonGradient: "from-red-500 to-rose-500 text-slate-950",
  },

  // Rust
  "rust-backend-fundamentals": {
    icon: ShieldAlert,
    badgeBg: "bg-orange-500/10",
    badgeBorder: "border-orange-500/30",
    badgeText: "text-orange-400",
    cardBorderHover: "hover:border-orange-400/50 hover:shadow-orange-500/10",
    cardBgGradient: "from-orange-950/20 via-slate-900/90 to-amber-950/15",
    glowColor: "rgba(249, 115, 22, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-orange-400 to-amber-400",
    textColor: "text-orange-300",
    buttonGradient: "from-orange-500 to-amber-500 text-slate-950",
  },
  "axum-high-performance-apis": {
    icon: Zap,
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-400",
    cardBorderHover: "hover:border-amber-400/50 hover:shadow-amber-500/10",
    cardBgGradient: "from-amber-950/20 via-slate-900/90 to-orange-950/15",
    glowColor: "rgba(245, 158, 11, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-amber-400 to-orange-400",
    textColor: "text-amber-300",
    buttonGradient: "from-amber-500 to-orange-500 text-slate-950",
  },

  // Ruby
  "ruby-backend-fundamentals": {
    icon: Gem,
    badgeBg: "bg-red-500/10",
    badgeBorder: "border-red-500/30",
    badgeText: "text-red-400",
    cardBorderHover: "hover:border-red-400/50 hover:shadow-red-500/10",
    cardBgGradient: "from-red-950/20 via-slate-900/90 to-rose-950/15",
    glowColor: "rgba(239, 68, 68, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-red-400 to-pink-400",
    textColor: "text-red-300",
    buttonGradient: "from-red-500 to-pink-500 text-slate-950",
  },
  "rails-rapid-api-development": {
    icon: Server,
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-500/30",
    badgeText: "text-rose-400",
    cardBorderHover: "hover:border-rose-400/50 hover:shadow-rose-500/10",
    cardBgGradient: "from-rose-950/20 via-slate-900/90 to-red-950/15",
    glowColor: "rgba(244, 63, 94, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-rose-400 to-red-400",
    textColor: "text-rose-300",
    buttonGradient: "from-rose-500 to-red-500 text-slate-950",
  },

  // Kotlin
  "kotlin-backend-fundamentals": {
    icon: Compass,
    badgeBg: "bg-pink-500/10",
    badgeBorder: "border-pink-500/30",
    badgeText: "text-pink-400",
    cardBorderHover: "hover:border-pink-400/50 hover:shadow-pink-500/10",
    cardBgGradient: "from-pink-950/20 via-slate-900/90 to-purple-950/15",
    glowColor: "rgba(236, 72, 153, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-pink-400 to-purple-400",
    textColor: "text-pink-300",
    buttonGradient: "from-pink-500 to-purple-500 text-slate-950",
  },
  "ktor-cloud-native-apis": {
    icon: Zap,
    badgeBg: "bg-fuchsia-500/10",
    badgeBorder: "border-fuchsia-500/30",
    badgeText: "text-fuchsia-400",
    cardBorderHover: "hover:border-fuchsia-400/50 hover:shadow-fuchsia-500/10",
    cardBgGradient: "from-fuchsia-950/20 via-slate-900/90 to-pink-950/15",
    glowColor: "rgba(217, 70, 239, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-fuchsia-400 to-pink-400",
    textColor: "text-fuchsia-300",
    buttonGradient: "from-fuchsia-500 to-pink-500 text-slate-950",
  },

  // Elixir
  "elixir-backend-fundamentals": {
    icon: Activity,
    badgeBg: "bg-fuchsia-500/10",
    badgeBorder: "border-fuchsia-500/30",
    badgeText: "text-fuchsia-400",
    cardBorderHover: "hover:border-fuchsia-400/50 hover:shadow-fuchsia-500/10",
    cardBgGradient: "from-fuchsia-950/20 via-slate-900/90 to-violet-950/15",
    glowColor: "rgba(217, 70, 239, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-fuchsia-400 to-violet-400",
    textColor: "text-fuchsia-300",
    buttonGradient: "from-fuchsia-500 to-violet-500 text-slate-950",
  },
  "phoenix-realtime-distributed-systems": {
    icon: Zap,
    badgeBg: "bg-purple-500/10",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-400",
    cardBorderHover: "hover:border-purple-400/50 hover:shadow-purple-500/10",
    cardBgGradient: "from-purple-950/20 via-slate-900/90 to-indigo-950/15",
    glowColor: "rgba(168, 85, 247, 0.15)",
    progressBarGradient: "bg-gradient-to-r from-purple-400 to-indigo-400",
    textColor: "text-purple-300",
    buttonGradient: "from-purple-500 to-indigo-500 text-slate-950",
  },
};

// Fallback theme for any arbitrary course slug
export const DEFAULT_COURSE_THEME: CourseThemeConfig = {
  icon: Cpu,
  badgeBg: "bg-cyan-500/10",
  badgeBorder: "border-cyan-500/30",
  badgeText: "text-cyan-400",
  cardBorderHover: "hover:border-cyan-400/50 hover:shadow-cyan-500/10",
  cardBgGradient: "from-indigo-950/20 via-slate-900/90 to-cyan-950/15",
  glowColor: "rgba(6, 182, 212, 0.15)",
  progressBarGradient: "bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500",
  textColor: "text-cyan-300",
  buttonGradient: "from-cyan-400 to-indigo-500 text-slate-950",
};

export function getCourseTheme(slug: string): CourseThemeConfig {
  return COURSE_THEMES[slug] || DEFAULT_COURSE_THEME;
}

export function getLanguageColorBadge(language: string): { bg: string; text: string; border: string } {
  switch ((language || "").toLowerCase()) {
    case "javascript":
    case "js":
      return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" };
    case "typescript":
    case "ts":
      return { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/30" };
    case "python":
    case "py":
      return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" };
    case "java":
      return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" };
    case "csharp":
    case "c#":
    case "dotnet":
      return { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" };
    case "go":
    case "golang":
      return { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" };
    case "php":
      return { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" };
    case "rust":
      return { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" };
    case "ruby":
      return { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" };
    case "kotlin":
      return { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" };
    case "elixir":
    case "erlang":
      return { bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", border: "border-fuchsia-500/30" };
    default:
      return { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" };
  }
}

// Authentic syllabus preview topics from our actual course curriculum
export const COURSE_SYLLABUS_PREVIEWS: Record<string, string[]> = {
  "backend-node-js": [
    "Web & HTTP Fundamentals (Status codes, headers, client-server)",
    "Node.js Runtime Architecture, Event Loop & Core Modules",
    "Express.js Server, Routing & Controller Design Pattern",
    "MongoDB NoSQL Collections, Mongoose Schemas & CRUD APIs",
  ],
  "typescript-backend": [
    "TypeScript Type Inference, Strict Types & Generics",
    "Advanced Object-Oriented Design & Discriminated Unions",
    "Typed Express APIs, Async Flow & Environment Config",
    "API Data Transfer Objects (DTOs) & Zod Runtime Validation",
  ],
  "express-rest-api": [
    "Express Server Architecture & Request-Response Lifecycle",
    "REST Resource Conventions & Status Code Strategy",
    "Pagination, Filtering, Sorting & Rate Limiting Defense",
    "Service Layer Isolation & Centralized Error Handling",
  ],
  "mongodb-database": [
    "MongoDB BSON Documents, Operators & Query Syntax",
    "Embedding vs Referencing & Schema Validation Rules",
    "Compound Indexes & Query Performance Optimization",
    "Aggregation Pipeline Mastery & ACID Transactions",
  ],
  "backend-auth-security": [
    "Authentication vs Authorization & bcrypt Password Salting",
    "JWT Signing, Verification & Refresh Token Rotation",
    "Input Sanitization, NoSQL Injection Defense & CSP",
    "Role-Based Access Control (RBAC) & Ownership Authorization",
  ],
  "python-backend-fundamentals": [
    "Python 3 Syntax & Modern Asynchronous Flow",
    "Asyncio Event Loop, Coroutines & Tasks",
    "Pydantic Data Models & Type Validation",
    "Virtual Environments & Backend Project Structure",
  ],
  "fastapi-modern-apis": [
    "FastAPI Routing, Path/Query Parameters & Dependency Injection",
    "Pydantic Request/Response DTO Validation",
    "Async SQLAlchemy 2.0 ORM & Database Sessions",
    "OAuth2 Password Flow & JWT Authentication",
  ],
  "django-enterprise-backend": [
    "Django Architecture, Apps & Model Definitions",
    "Django REST Framework ViewSets & Serializers",
    "PostgreSQL Database Migrations & Query Optimization",
    "Celery Asynchronous Tasks & Redis Message Queue",
  ],
  "java-backend-fundamentals": [
    "Java 21 Records, Pattern Matching & Sealed Classes",
    "Streams API & Object-Oriented Domain Modeling",
    "Lightweight Virtual Threads (Project Loom) Concurrency",
    "JVM Garbage Collection & Memory Management",
  ],
  "spring-boot-microservices": [
    "Spring Boot Starter Architecture & @RestController APIs",
    "Spring Data JPA, Hibernate ORM & Flyway Migrations",
    "Spring Security with Stateless JWT Authentication",
    "Distributed Messaging with Apache Kafka & Resilience4j",
  ],
  "csharp-backend-fundamentals": [
    "Modern C# 12 Records, Pattern Matching & LINQ Queries",
    "Task Parallel Library (TPL) & Asynchronous Flow",
    "Memory Structs, Span<T> & High-Efficiency Allocations",
    "Dependency Injection & Service Lifetime Management",
  ],
  "aspnet-core-web-apis": [
    "Minimal APIs vs Controller Architecture in ASP.NET Core",
    "Entity Framework Core Code-First Migrations & Queries",
    "JWT Authentication & ASP.NET Core Identity",
    "Distributed Redis Caching & High-Throughput Pipelines",
  ],
  "go-backend-fundamentals": [
    "Go Syntax, Structs, Interfaces & Pointer Semantics",
    "Goroutines (~2KB) & Channel Synchronization Patterns",
    "Standard Library net/http Server Architecture",
    "Error Handling Conventions & Custom Error Types",
  ],
  "gin-high-performance-apis": [
    "Gin Framework Routing, Groups & Custom Middleware",
    "PostgreSQL Integration with pgx & GORM ORM",
    "Clean Architecture & Domain Repository Pattern",
    "Multi-Stage Docker Containerization & Benchmarks",
  ],
  "php-backend-fundamentals": [
    "Modern PHP 8.2+ Strict Typing, Enums & Attributes",
    "Composer Dependency Management & PSR Standards",
    "Object-Oriented Design Patterns & SOLID Principles",
    "Zend Engine & Request Lifecycle Architecture",
  ],
  "laravel-web-apis": [
    "Laravel 11 Service Container & Dependency Injection",
    "Eloquent ORM Relationships, Migrations & Eager Loading",
    "Laravel Sanctum API Token Authentication",
    "Asynchronous Job Queues with Redis & Horizon",
  ],
  "rust-backend-fundamentals": [
    "Rust Ownership, Move Semantics & Borrowing Rules",
    "Traits, Generics & Strong Algebraic Data Types",
    "Error Handling with Result<T, E> & Option<T>",
    "Tokio Asynchronous Runtime & Multi-Threading",
  ],
  "axum-high-performance-apis": [
    "Axum Web Routing, Extractors & State Sharing",
    "Compile-Time Checked SQL with SQLx & PostgreSQL",
    "Tower Middleware Pipelines & Rate Limiting",
    "Zero-Copy Serialization with Serde & Docker Builds",
  ],
  "ruby-backend-fundamentals": [
    "Ruby Syntax, Blocks, Procs & Enumerable Mastery",
    "Object-Oriented Architecture, Modules & Mixins",
    "Metaprogramming & Dynamic Method Dispatch",
    "Bundler Dependency Management & Gem Ecosystem",
  ],
  "rails-rapid-api-development": [
    "Rails API-Only Mode, Resource Routing & Controllers",
    "ActiveRecord Associations, Scopes & Migrations",
    "Background Job Processing with Sidekiq & Redis",
    "JWT Authentication & RSpec Automated Testing",
  ],
  "kotlin-backend-fundamentals": [
    "Kotlin Compile-Time Null Safety & Data Classes",
    "Extension Functions, Sealed Interfaces & Generics",
    "Kotlin Coroutines, Dispatchers & Suspended Functions",
    "Reactive Asynchronous Streams with Flow API",
  ],
  "ktor-cloud-native-apis": [
    "Ktor Routing, Application Modules & Plugins",
    "Content Negotiation & kotlinx.serialization",
    "Database Persistence with Exposed ORM / R2DBC",
    "Lightweight Native JVM Docker Packaging",
  ],
  "elixir-backend-fundamentals": [
    "Functional Programming, Immutability & Pattern Matching",
    "The Pipe Operator (|>) & Recursion Algorithms",
    "BEAM Lightweight Processes & Message Passing",
    "OTP GenServer & Fault-Tolerant Supervision Trees",
  ],
  "phoenix-realtime-distributed-systems": [
    "Phoenix Router, Controllers & Plug Pipelines",
    "Ecto Schemas, Changesets & Database Migrations",
    "Real-Time WebSockets with Phoenix Channels",
    "Telemetry Monitoring & Distributed BEAM Clustering",
  ],
  "fastify-high-performance-apis": [
    "Fastify Plugin Encapsulation & Request Lifecycle",
    "Fast JSON Stringify & JSON Schema Validation",
    "Hooks (onRequest, preHandler, onSend) Architecture",
    "High-Throughput Benchmarking & Clustering",
  ],
  "nestjs-backend-architecture": [
    "NestJS Modules, Controllers & Providers Architecture",
    "Dependency Injection & Inversion of Control Container",
    "Guards, Interceptors & Global Exception Filters",
    "TypeORM Database Modeling & Microservice Transports",
  ],
};

