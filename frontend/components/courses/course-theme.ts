import {
  Server,
  Code2,
  Zap,
  Database,
  ShieldCheck,
  Cpu,
  Terminal,
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
};
