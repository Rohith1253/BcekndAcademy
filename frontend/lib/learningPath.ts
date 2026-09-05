/**
 * learningPath.ts
 *
 * The unified linear 10-level learning progression path for Backend Academy.
 * Starts from Level 0 (Zero Knowledge) up to Level 9 (Advanced Distributed Architecture).
 */

export interface LearningPathStep {
  slug: string;
  step: number;
  positionLabel: string;
  title: string;
  level: "Foundation" | "Beginner" | "Intermediate" | "Advanced";
  levelNumber: number;
  levelGroup: string;
  levelColor: {
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    dotColor: string;
  };
  isStartHere: boolean;
  whyLearn: string;
  whatYouWillLearn: string[];
  whereYouWillUseThis: string[];
  whatYouCanBuild: string;
  prerequisites: {
    title: string;
    slug?: string;
  } | null;
  nextCourse: {
    title: string;
    slug: string;
  } | null;
  courseSlug: string;
  courseTitle: string;
  stepNumber: number;
  levelName: string;
  difficulty: "Foundation" | "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  skillsGained: string[];
  realWorldBuild: string;
  nextCourseSlug?: string;
  nextCourseTitle?: string;
}

export const BACKEND_LEARNING_PATH: LearningPathStep[] = [
  // ── LEVEL 0: ZERO KNOWLEDGE FOUNDATION ────────────────────────────────────
  {
    slug: "computer-software-foundations",
    step: 0,
    stepNumber: 0,
    positionLabel: "Step 0 (Start Here)",
    title: "How Computers & Software Actually Work",
    courseTitle: "How Computers & Software Actually Work",
    courseSlug: "computer-software-foundations",
    level: "Foundation",
    levelNumber: 0,
    levelName: "Level 0 — Computer & Software Foundations",
    levelGroup: "Level 0 — Foundations",
    difficulty: "Foundation",
    estimatedHours: 4,
    levelColor: {
      badgeBg: "bg-emerald-500/10",
      badgeBorder: "border-emerald-500/30",
      badgeText: "text-emerald-400",
      dotColor: "bg-emerald-400",
    },
    isStartHere: true,
    whyLearn: "Understand hardware, CPU, RAM, operating systems, and compilation before writing a single line of code.",
    whatYouWillLearn: [
      "How CPU clock cycles, registers, and RAM interact",
      "Operating system processes, memory spaces, and system calls",
      "Compilers vs interpreters vs JIT runtimes",
      "Terminal commands and filesystem directory trees",
    ],
    whereYouWillUseThis: [
      "Every backend server environment",
      "Linux terminal operations & deployments",
      "Debugging out-of-memory and high-CPU server alerts",
    ],
    skillsGained: ["Hardware basics", "RAM vs Storage", "Operating systems", "Terminal navigation"],
    whatYouCanBuild: "A mental model of how computing machines execute instructions without magic.",
    realWorldBuild: "A solid computational foundation to master any programming language.",
    prerequisites: null,
    nextCourse: {
      title: "Universal Programming Fundamentals & Logic",
      slug: "universal-programming-fundamentals",
    },
    nextCourseSlug: "universal-programming-fundamentals",
    nextCourseTitle: "Universal Programming Fundamentals & Logic",
  },

  // ── LEVEL 1: UNIVERSAL PROGRAMMING FUNDAMENTALS ───────────────────────────
  {
    slug: "universal-programming-fundamentals",
    step: 1,
    stepNumber: 1,
    positionLabel: "Step 1 of 9",
    title: "Universal Programming Fundamentals & Logic",
    courseTitle: "Universal Programming Fundamentals & Logic",
    courseSlug: "universal-programming-fundamentals",
    level: "Foundation",
    levelNumber: 1,
    levelName: "Level 1 — Universal Fundamentals",
    levelGroup: "Level 1 — Fundamentals",
    difficulty: "Foundation",
    estimatedHours: 6,
    levelColor: {
      badgeBg: "bg-cyan-500/10",
      badgeBorder: "border-cyan-500/30",
      badgeText: "text-cyan-400",
      dotColor: "bg-cyan-400",
    },
    isStartHere: false,
    whyLearn: "Programming syntax differs between languages, but logic, algorithms, conditions, and loops are universal.",
    whatYouWillLearn: [
      "Algorithmic thinking and step-by-step decomposition",
      "Variables, memory allocation, and universal data types",
      "Branching logic (if/else) and boolean operators",
      "Reusable functions, parameter passing, and return values",
    ],
    whereYouWillUseThis: [
      "All backend languages (JavaScript, Python, Java, PHP, Go)",
      "API request validation logic",
      "Database filtering and sorting algorithms",
    ],
    skillsGained: ["Algorithms", "Pseudocode", "Conditions", "Loops", "Functions"],
    whatYouCanBuild: "Language-agnostic algorithms that solve real computational problems.",
    realWorldBuild: "Reusable problem-solving logic ready to be translated into any programming language.",
    prerequisites: {
      title: "How Computers & Software Actually Work",
      slug: "computer-software-foundations",
    },
    nextCourse: {
      title: "JavaScript Foundations & Core Syntax",
      slug: "javascript-foundations",
    },
    nextCourseSlug: "javascript-foundations",
    nextCourseTitle: "JavaScript Foundations & Core Syntax",
  },

  // ── LEVEL 2: JAVASCRIPT LANGUAGE FOUNDATIONS ──────────────────────────────
  {
    slug: "javascript-foundations",
    step: 2,
    stepNumber: 2,
    positionLabel: "Step 2 of 9",
    title: "JavaScript Foundations & Core Syntax",
    courseTitle: "JavaScript Foundations & Core Syntax",
    courseSlug: "javascript-foundations",
    level: "Beginner",
    levelNumber: 2,
    levelName: "Level 2 — Language Syntax",
    levelGroup: "Level 2 — Language Syntax",
    difficulty: "Beginner",
    estimatedHours: 6,
    levelColor: {
      badgeBg: "bg-amber-500/10",
      badgeBorder: "border-amber-500/30",
      badgeText: "text-amber-400",
      dotColor: "bg-amber-400",
    },
    isStartHere: false,
    whyLearn: "Translate universal programming logic into JavaScript syntax: variables, objects, arrays, and functions.",
    whatYouWillLearn: [
      "Modern ES6+ const, let, and primitive data types",
      "Object key-value manipulation and array iteration",
      "Function declaration styles and block scoping rules",
    ],
    whereYouWillUseThis: ["Node.js Backends", "API Controllers", "Serverless Scripts"],
    skillsGained: ["JavaScript ES6+", "Object manipulation", "Array methods"],
    whatYouCanBuild: "Data transformation utilities and server configuration objects.",
    realWorldBuild: "Clean, error-free JavaScript scripts with correct scoping and syntax.",
    prerequisites: {
      title: "Universal Programming Fundamentals & Logic",
      slug: "universal-programming-fundamentals",
    },
    nextCourse: {
      title: "Modern & Asynchronous JavaScript",
      slug: "async-javascript",
    },
    nextCourseSlug: "async-javascript",
    nextCourseTitle: "Modern & Asynchronous JavaScript",
  },

  // ── LEVEL 3: ASYNC JAVASCRIPT & EVENT LOOP ────────────────────────────────
  {
    slug: "async-javascript",
    step: 3,
    stepNumber: 3,
    positionLabel: "Step 3 of 9",
    title: "Modern & Asynchronous JavaScript",
    courseTitle: "Modern & Asynchronous JavaScript",
    courseSlug: "async-javascript",
    level: "Intermediate",
    levelNumber: 3,
    levelName: "Level 3 — Non-Blocking I/O",
    levelGroup: "Level 3 — Non-Blocking I/O",
    difficulty: "Intermediate",
    estimatedHours: 7,
    levelColor: {
      badgeBg: "bg-purple-500/10",
      badgeBorder: "border-purple-500/30",
      badgeText: "text-purple-400",
      dotColor: "bg-purple-400",
    },
    isStartHere: false,
    whyLearn: "Servers perform database queries and network calls that are asynchronous. Master the Event Loop, Promises, and async/await.",
    whatYouWillLearn: [
      "The JavaScript Event Loop, Call Stack, and Task Queues",
      "Promise lifecycle (pending, fulfilled, rejected)",
      "Async/Await syntax with clean try/catch error boundaries",
    ],
    whereYouWillUseThis: ["Database Operations", "HTTP API Requests", "File System I/O"],
    skillsGained: ["Async/Await", "Promises", "Event Loop", "Error Boundaries"],
    whatYouCanBuild: "Non-blocking data fetchers and simulated asynchronous database clients.",
    realWorldBuild: "Asynchronous backend utilities that handle concurrent data streams without blocking the thread.",
    prerequisites: {
      title: "JavaScript Foundations & Core Syntax",
      slug: "javascript-foundations",
    },
    nextCourse: {
      title: "Node.js Core Architecture & Modules",
      slug: "backend-node-js",
    },
    nextCourseSlug: "backend-node-js",
    nextCourseTitle: "Node.js Core Architecture & Modules",
  },

  // ── LEVEL 4: NODE.JS CORE RUNTIME ─────────────────────────────────────────
  {
    slug: "backend-node-js",
    step: 4,
    stepNumber: 4,
    positionLabel: "Step 4 of 9",
    title: "Node.js Core Architecture & Modules",
    courseTitle: "Node.js Core Architecture & Modules",
    courseSlug: "backend-node-js",
    level: "Intermediate",
    levelNumber: 4,
    levelName: "Level 4 — Server Runtime",
    levelGroup: "Level 4 — Server Runtime",
    difficulty: "Intermediate",
    estimatedHours: 8,
    levelColor: {
      badgeBg: "bg-emerald-500/10",
      badgeBorder: "border-emerald-500/30",
      badgeText: "text-emerald-400",
      dotColor: "bg-emerald-400",
    },
    isStartHere: false,
    whyLearn: "Node.js connects your code to the network. Master Libuv threads, Buffers, Streams, and HTTP server listeners.",
    whatYouWillLearn: [
      "Node.js architecture and Libuv worker pool",
      "Building native HTTP servers with req/res streams",
      "Handling buffers and high-volume file streams",
    ],
    whereYouWillUseThis: ["Network Servers", "Microservices", "Real-Time APIs"],
    skillsGained: ["Node.js", "Streams", "Buffers", "EventEmitter", "HTTP Server"],
    whatYouCanBuild: "A native Node.js HTTP server handling incoming requests and file streams.",
    realWorldBuild: "Production HTTP listeners parsing query parameters and streaming JSON responses.",
    prerequisites: {
      title: "Modern & Asynchronous JavaScript",
      slug: "async-javascript",
    },
    nextCourse: {
      title: "REST API Design & Express.js Engineering",
      slug: "express-rest-apis",
    },
    nextCourseSlug: "express-rest-apis",
    nextCourseTitle: "REST API Design & Express.js Engineering",
  },

  // ── LEVEL 5: EXPRESS.JS REST APIS ────────────────────────────────────────
  {
    slug: "express-rest-apis",
    step: 5,
    stepNumber: 5,
    positionLabel: "Step 5 of 9",
    title: "REST API Design & Express.js Engineering",
    courseTitle: "REST API Design & Express.js Engineering",
    courseSlug: "express-rest-apis",
    level: "Intermediate",
    levelNumber: 5,
    levelName: "Level 5 — API Engineering",
    levelGroup: "Level 5 — API Engineering",
    difficulty: "Intermediate",
    estimatedHours: 9,
    levelColor: {
      badgeBg: "bg-indigo-500/10",
      badgeBorder: "border-indigo-500/30",
      badgeText: "text-indigo-400",
      dotColor: "bg-indigo-400",
    },
    isStartHere: false,
    whyLearn: "REST APIs are the communication backbone of the web. Learn router modularity, middleware chains, and validation schemas.",
    whatYouWillLearn: [
      "Express Router design and controller separation",
      "Middleware execution order & custom error handlers",
      "Zod request validation and pagination queries",
    ],
    whereYouWillUseThis: ["SaaS Backend APIs", "Mobile App Backends", "Microservices"],
    skillsGained: ["Express.js", "REST APIs", "Middleware", "Input Validation"],
    whatYouCanBuild: "A production REST API featuring authentication middleware and validation pipelines.",
    realWorldBuild: "An enterprise REST API with controller-service architecture and pagination.",
    prerequisites: {
      title: "Node.js Core Architecture & Modules",
      slug: "backend-node-js",
    },
    nextCourse: {
      title: "Database Modeling, Indexing & MongoDB",
      slug: "mongodb-aggregation-design",
    },
    nextCourseSlug: "mongodb-aggregation-design",
    nextCourseTitle: "Database Modeling, Indexing & MongoDB",
  },

  // ── LEVEL 6: DATABASE & MONGODB ──────────────────────────────────────────
  {
    slug: "mongodb-aggregation-design",
    step: 6,
    stepNumber: 6,
    positionLabel: "Step 6 of 9",
    title: "Database Modeling, Indexing & MongoDB",
    courseTitle: "Database Modeling, Indexing & MongoDB",
    courseSlug: "mongodb-aggregation-design",
    level: "Intermediate",
    levelNumber: 6,
    levelName: "Level 6 — Database Tier",
    levelGroup: "Level 6 — Database Tier",
    difficulty: "Intermediate",
    estimatedHours: 8,
    levelColor: {
      badgeBg: "bg-amber-500/10",
      badgeBorder: "border-amber-500/30",
      badgeText: "text-amber-400",
      dotColor: "bg-amber-400",
    },
    isStartHere: false,
    whyLearn: "Databases hold business data. Learn schema design, indexing strategies, and multi-stage aggregation pipelines.",
    whatYouWillLearn: [
      "Document data modeling (Embedding vs Referencing)",
      "Compound and TTL indexes for sub-millisecond queries",
      "Mongoose schemas and multi-stage aggregation pipelines",
    ],
    whereYouWillUseThis: ["E-Commerce Databases", "Analytics Systems", "Document Stores"],
    skillsGained: ["MongoDB", "Mongoose", "Indexes", "Aggregation Pipelines"],
    whatYouCanBuild: "A persistent database tier with optimized indexes and aggregation pipelines.",
    realWorldBuild: "High-performance queries processing analytics over large collections.",
    prerequisites: {
      title: "REST API Design & Express.js Engineering",
      slug: "express-rest-apis",
    },
    nextCourse: {
      title: "Production Authentication, JWT & Web Security",
      slug: "authentication-security",
    },
    nextCourseSlug: "authentication-security",
    nextCourseTitle: "Production Authentication, JWT & Web Security",
  },

  // ── LEVEL 7: AUTHENTICATION & SECURITY ───────────────────────────────────
  {
    slug: "authentication-security",
    step: 7,
    stepNumber: 7,
    positionLabel: "Step 7 of 9",
    title: "Production Authentication, JWT & Web Security",
    courseTitle: "Production Authentication, JWT & Web Security",
    courseSlug: "authentication-security",
    level: "Advanced",
    levelNumber: 7,
    levelName: "Level 7 — AppSec & Defense",
    levelGroup: "Level 7 — AppSec & Defense",
    difficulty: "Advanced",
    estimatedHours: 8,
    levelColor: {
      badgeBg: "bg-rose-500/10",
      badgeBorder: "border-rose-500/30",
      badgeText: "text-rose-400",
      dotColor: "bg-rose-400",
    },
    isStartHere: false,
    whyLearn: "Protect systems against OWASP Top 10 vulnerabilities, session hijacking, and data breaches.",
    whatYouWillLearn: [
      "Bcrypt password hashing and salt rounds",
      "Stateless JWT token verification & refresh token rotation",
      "Role-Based Access Control (RBAC) and OWASP defenses",
    ],
    whereYouWillUseThis: ["Fintech APIs", "Enterprise Access Portals", "Security Audits"],
    skillsGained: ["JWT", "Bcrypt", "RBAC", "OWASP Defenses", "CORS & Helmet"],
    whatYouCanBuild: "An enterprise authentication server with short/long token rotation and role guards.",
    realWorldBuild: "A secure authentication boundary resistant to injection, CSRF, and timing attacks.",
    prerequisites: {
      title: "Database Modeling, Indexing & MongoDB",
      slug: "mongodb-aggregation-design",
    },
    nextCourse: {
      title: "Microservices, Caching & Distributed Systems",
      slug: "system-architecture-microservices",
    },
    nextCourseSlug: "system-architecture-microservices",
    nextCourseTitle: "Microservices, Caching & Distributed Systems",
  },

  // ── LEVEL 8: DISTRIBUTED SYSTEMS & ARCHITECTURE ──────────────────────────
  {
    slug: "system-architecture-microservices",
    step: 8,
    stepNumber: 8,
    positionLabel: "Step 8 of 9",
    title: "Microservices, Caching & Distributed Systems",
    courseTitle: "Microservices, Caching & Distributed Systems",
    courseSlug: "system-architecture-microservices",
    level: "Advanced",
    levelNumber: 8,
    levelName: "Level 8 — Distributed Systems",
    levelGroup: "Level 8 — Distributed Systems",
    difficulty: "Advanced",
    estimatedHours: 10,
    levelColor: {
      badgeBg: "bg-fuchsia-500/10",
      badgeBorder: "border-fuchsia-500/30",
      badgeText: "text-fuchsia-400",
      dotColor: "bg-fuchsia-400",
    },
    isStartHere: false,
    whyLearn: "When systems scale to millions of users, single servers fail. Master Redis caching, message queues, and microservices.",
    whatYouWillLearn: [
      "Redis caching strategies (Cache-Aside, Write-Through)",
      "Asynchronous message queues (RabbitMQ / Kafka)",
      "API Gateway routing and horizontal Docker clustering",
    ],
    whereYouWillUseThis: ["High-Traffic Web Platforms", "Distributed Microservices", "Cloud Architectures"],
    skillsGained: ["Redis", "Message Queues", "Microservices", "Docker", "Load Balancing"],
    whatYouCanBuild: "A distributed backend architecture capable of handling high concurrency with caching.",
    realWorldBuild: "A fault-tolerant microservices cluster with message broker decoupling.",
    prerequisites: {
      title: "Production Authentication, JWT & Web Security",
      slug: "authentication-security",
    },
    nextCourse: null,
  },
];

export function getLearningPathStep(slug: string): LearningPathStep | undefined {
  return BACKEND_LEARNING_PATH.find((item) => item.slug === slug || item.courseSlug === slug);
}

export function getLearningPathLevels() {
  return [
    {
      levelNumber: 0,
      title: "Level 0 — Foundations",
      description: "Understand computers, software, memory, and runtime systems before coding.",
      badgeColor: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
      steps: BACKEND_LEARNING_PATH.filter((s) => s.levelNumber === 0),
    },
    {
      levelNumber: 1,
      title: "Level 1 — Universal Fundamentals",
      description: "Master algorithms, pseudocode, conditions, and functions without syntax lock-in.",
      badgeColor: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
      steps: BACKEND_LEARNING_PATH.filter((s) => s.levelNumber === 1),
    },
    {
      levelNumber: 2,
      title: "Level 2–5 — JavaScript & Node.js",
      description: "Master modern JavaScript, asynchronous event loops, and Node.js server runtimes.",
      badgeColor: "bg-amber-500/15 border-amber-500/30 text-amber-300",
      steps: BACKEND_LEARNING_PATH.filter((s) => s.levelNumber >= 2 && s.levelNumber <= 5),
    },
    {
      levelNumber: 6,
      title: "Level 6–8 — Database, Auth & Architecture",
      description: "Build production REST APIs, MongoDB databases, JWT auth, and distributed caching.",
      badgeColor: "bg-rose-500/15 border-rose-500/30 text-rose-300",
      steps: BACKEND_LEARNING_PATH.filter((s) => s.levelNumber >= 6),
    },
  ];
}
