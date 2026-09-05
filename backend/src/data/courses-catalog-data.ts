export interface CatalogCourse {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  language: string;
  frameworks: string[];
  learningPath: string;
  codeSnippet?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  level: string;
  levelNumber: number;
  instructor: string;
  estimatedHours: number;
  totalModules: number;
  totalLessons: number;
  totalXP: number;
  tags: string[];
  prerequisites: string[];
  whyItMatters: string;
  nextCourseSlug?: string;
  published: boolean;
  order: number;
  executionSupport: "interactive" | "learning-content-available";
}

export const ALL_CATALOG_COURSES: CatalogCourse[] = [
  // ─── LEVEL 0: ABSOLUTE BEGINNER COMPUTER & SOFTWARE FOUNDATION ───
  {
    title: "How Computers & Software Actually Work",
    slug: "computer-software-foundations",
    description: "Start here with zero coding knowledge. Understand hardware, CPU, RAM, operating systems, how code executes, and essential developer tools.",
    shortDescription: "Zero-knowledge starting point: hardware, memory, compilation, runtimes, and how software works.",
    category: "Foundation (Level 0)",
    language: "agnostic",
    frameworks: ["Computer Architecture", "Runtime Systems", "Terminal Basics"],
    learningPath: "universal-foundations",
    codeSnippet: "// Conceptual Model:\nInput (Keyboard/Network) -> CPU (Compute) + RAM (State) -> Output (Display/Disk)",
    difficulty: "beginner",
    level: "Level 0: Foundation",
    levelNumber: 0,
    instructor: "Platform Foundations Team",
    estimatedHours: 4,
    totalModules: 5,
    totalLessons: 15,
    totalXP: 1000,
    tags: ["Hardware", "CPU", "RAM", "Operating Systems", "Compilers", "Terminal"],
    prerequisites: [],
    whyItMatters: "Before writing code, you must understand what a computer is doing when it runs your instructions. This removes the mystery of servers and memory.",
    nextCourseSlug: "universal-programming-fundamentals",
    published: true,
    order: 0,
    executionSupport: "interactive"
  },

  // ─── LEVEL 1: UNIVERSAL PROGRAMMING FUNDAMENTALS (LANGUAGE INDEPENDENT) ───
  {
    title: "Universal Programming Fundamentals & Logic",
    slug: "universal-programming-fundamentals",
    description: "Master algorithms, pseudocode, variables, data types, conditions, loops, functions, and debugging without tying yourself to a single syntax.",
    shortDescription: "Language-independent logic, algorithms, control flow, and computational problem solving.",
    category: "Universal Fundamentals",
    language: "agnostic",
    frameworks: ["Pseudocode", "Flowcharts", "Algorithmic Logic"],
    learningPath: "universal-foundations",
    codeSnippet: "ALGORITHM CalculateDiscount(price, userRole):\n  IF userRole == 'VIP' THEN\n    RETURN price * 0.8\n  ELSE\n    RETURN price\n  END IF",
    difficulty: "beginner",
    level: "Level 1: Fundamentals",
    levelNumber: 1,
    instructor: "Universal Curriculum Team",
    estimatedHours: 6,
    totalModules: 14,
    totalLessons: 28,
    totalXP: 1800,
    tags: ["Logic", "Algorithms", "Flowcharts", "Pseudocode", "Conditions", "Loops", "Functions"],
    prerequisites: ["computer-software-foundations"],
    whyItMatters: "Programming syntax changes between languages, but logic, algorithms, and data structures are universal. Learn these once and apply them anywhere.",
    nextCourseSlug: "javascript-foundations",
    published: true,
    order: 1,
    executionSupport: "interactive"
  },

  // ─── LEVEL 2: JAVASCRIPT LANGUAGE FOUNDATIONS ────────────────────
  {
    title: "JavaScript Foundations & Core Syntax",
    slug: "javascript-foundations",
    description: "Master variables, data types, control flow, functions, objects, and scope before entering backend server development.",
    shortDescription: "The essential starting point for JS: variables, functions, objects, arrays, and ES6+ syntax.",
    category: "JavaScript Path",
    language: "javascript",
    frameworks: ["JavaScript (ES6+)"],
    learningPath: "backend-javascript",
    codeSnippet: "function calculateTax(subtotal) {\n  const taxRate = 0.08;\n  return subtotal * (1 + taxRate);\n}",
    difficulty: "beginner",
    level: "Level 2: Beginner",
    levelNumber: 2,
    instructor: "Foundations Engineering Team",
    estimatedHours: 6,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1500,
    tags: ["JavaScript", "Variables", "Functions", "Objects", "Arrays", "Control Flow"],
    prerequisites: ["universal-programming-fundamentals"],
    whyItMatters: "Backend engines execute code. Without mastering variables, objects, and functions, backend concepts like request handling will be confusing.",
    nextCourseSlug: "programming-logic",
    published: true,
    order: 2,
    executionSupport: "interactive"
  },

  // ─── LEVEL 3: PROGRAMMING LOGIC & DATA TRANSFORMATION ─────────────
  {
    title: "Programming Logic & Data Transformation",
    slug: "programming-logic",
    description: "Learn how to break complex problems into algorithmic steps, handle edge cases, and transform collections cleanly.",
    shortDescription: "Develop developer intuition: data manipulation, error boundary planning, and array filtering.",
    category: "JavaScript Path",
    language: "javascript",
    frameworks: ["JavaScript Logic"],
    learningPath: "backend-javascript",
    codeSnippet: "function findUserByEmail(users, targetEmail) {\n  return users.find(u => u.email === targetEmail) || null;\n}",
    difficulty: "beginner",
    level: "Level 3: Beginner",
    levelNumber: 3,
    instructor: "Algorithms & Logic Team",
    estimatedHours: 6,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1600,
    tags: ["Logic", "Data Structures", "Algorithms", "Array Methods", "Edge Cases"],
    prerequisites: ["javascript-foundations"],
    whyItMatters: "Every backend endpoint requires processing user data, validating inputs, and filtering database records cleanly.",
    nextCourseSlug: "async-javascript",
    published: true,
    order: 3,
    executionSupport: "interactive"
  },

  // ─── LEVEL 4: ASYNCHRONOUS JAVASCRIPT & EVENT LOOP ───────────────
  {
    title: "Modern & Asynchronous JavaScript",
    slug: "async-javascript",
    description: "Understand the JavaScript Event Loop, Promises, Async/Await, error handling, and non-blocking I/O.",
    shortDescription: "Master non-blocking I/O, Promises, async/await, and the JavaScript runtime event loop.",
    category: "JavaScript Path",
    language: "javascript",
    frameworks: ["Async/Await", "Promises", "ES2024"],
    learningPath: "backend-javascript",
    codeSnippet: "async function fetchDatabaseUser(id) {\n  const user = await db.users.findById(id);\n  return user;\n}",
    difficulty: "beginner",
    level: "Level 4: Intermediate",
    levelNumber: 4,
    instructor: "Runtime Architecture Team",
    estimatedHours: 7,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1700,
    tags: ["Async", "Promises", "Event Loop", "Callbacks", "Error Handling"],
    prerequisites: ["programming-logic"],
    whyItMatters: "Server operations (database queries, network calls, disk I/O) are non-blocking. Async mastery is required for Node.js.",
    nextCourseSlug: "backend-node-js",
    published: true,
    order: 4,
    executionSupport: "interactive"
  },

  // ─── LEVEL 5: NODE.JS RUNTIME & ARCHITECTURE ─────────────────────
  {
    title: "Node.js Core Architecture & Modules",
    slug: "backend-node-js",
    description: "Deep dive into the Node.js runtime, Libuv thread pool, Buffers, Streams, EventEmitter, and file system I/O.",
    shortDescription: "Build scalable network servers, manage streams, handle buffers, and understand the Libuv engine.",
    category: "Backend Engineering",
    language: "javascript",
    frameworks: ["Node.js", "Libuv", "Streams"],
    learningPath: "backend-javascript",
    codeSnippet: "const fs = require('fs/promises');\nconst data = await fs.readFile('/etc/config.json', 'utf8');",
    difficulty: "intermediate",
    level: "Level 5: Intermediate",
    levelNumber: 5,
    instructor: "Node.js Core Team",
    estimatedHours: 8,
    totalModules: 5,
    totalLessons: 15,
    totalXP: 2000,
    tags: ["Node.js", "Streams", "Buffers", "File System", "Event Loop", "Modules"],
    prerequisites: ["async-javascript"],
    whyItMatters: "Node.js powers the server runtime. Understanding event loops and streams prevents performance bottlenecks under high user traffic.",
    nextCourseSlug: "express-rest-apis",
    published: true,
    order: 5,
    executionSupport: "interactive"
  },

  // ─── LEVEL 6: EXPRESS.JS & REST API DEVELOPMENT ─────────────────
  {
    title: "REST API Design & Express.js Engineering",
    slug: "express-rest-apis",
    description: "Design production-grade REST APIs: routing, middleware chains, controller architecture, validation schemas, and error boundaries.",
    shortDescription: "Build production REST APIs with routing, middleware pipelines, error handlers, and input validation.",
    category: "Backend Engineering",
    language: "javascript",
    frameworks: ["Express.js", "Zod", "REST APIs"],
    learningPath: "backend-javascript",
    codeSnippet: "app.post('/api/orders', authGuard, validateOrder, createOrderController);",
    difficulty: "intermediate",
    level: "Level 6: Intermediate",
    levelNumber: 6,
    instructor: "API Design Guild",
    estimatedHours: 9,
    totalModules: 6,
    totalLessons: 18,
    totalXP: 2200,
    tags: ["Express", "REST APIs", "Middleware", "HTTP Status Codes", "Routing", "Controllers"],
    prerequisites: ["backend-node-js"],
    whyItMatters: "REST APIs are how mobile apps, web frontends, and external services communicate with your database.",
    nextCourseSlug: "mongodb-aggregation-design",
    published: true,
    order: 6,
    executionSupport: "interactive"
  },

  // ─── LEVEL 7: DATABASE DESIGN & MONGODB AGGREGATIONS ──────────────
  {
    title: "Database Modeling, Indexing & MongoDB",
    slug: "mongodb-aggregation-design",
    description: "Master document data modeling, BSON data types, compound indexes, execution plans (explain), and multi-stage aggregation pipelines.",
    shortDescription: "Design scalable schemas, optimize queries with compound indexes, and build aggregation pipelines.",
    category: "Databases",
    language: "javascript",
    frameworks: ["MongoDB", "Mongoose", "NoSQL"],
    learningPath: "backend-javascript",
    codeSnippet: "db.orders.aggregate([\n  { $match: { status: 'completed' } },\n  { $group: { _id: '$userId', totalSpent: { $sum: '$amount' } } }\n]);",
    difficulty: "intermediate",
    level: "Level 7: Intermediate",
    levelNumber: 7,
    instructor: "Database Infrastructure Team",
    estimatedHours: 8,
    totalModules: 5,
    totalLessons: 15,
    totalXP: 2100,
    tags: ["MongoDB", "Aggregation", "Indexes", "Schema Design", "Mongoose", "Database"],
    prerequisites: ["express-rest-apis"],
    whyItMatters: "Poor database queries crash servers. Mastering schema design and indexing ensures sub-millisecond query responses at scale.",
    nextCourseSlug: "authentication-security",
    published: true,
    order: 7,
    executionSupport: "interactive"
  },

  // ─── LEVEL 8: BACKEND AUTHENTICATION & SECURITY ──────────────────
  {
    title: "Production Authentication, JWT & Web Security",
    slug: "authentication-security",
    description: "Implement secure authentication: password hashing (bcrypt/argon2), JWT tokens, refresh token rotation, CORS, and OWASP defense.",
    shortDescription: "Implement JWT, refresh token rotation, bcrypt hashing, RBAC authorization, and OWASP defenses.",
    category: "Security",
    language: "javascript",
    frameworks: ["JWT", "Bcrypt", "Helmet", "OWASP"],
    learningPath: "backend-javascript",
    codeSnippet: "const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });",
    difficulty: "advanced",
    level: "Level 8: Advanced",
    levelNumber: 8,
    instructor: "AppSec Engineering Team",
    estimatedHours: 8,
    totalModules: 5,
    totalLessons: 15,
    totalXP: 2300,
    tags: ["Auth", "JWT", "Security", "Bcrypt", "CORS", "Rate Limiting", "OWASP"],
    prerequisites: ["mongodb-aggregation-design"],
    whyItMatters: "Security is non-negotiable. A backend engineer must protect user credentials and prevent unauthorized data access.",
    nextCourseSlug: "system-architecture-microservices",
    published: true,
    order: 8,
    executionSupport: "interactive"
  },

  // ─── LEVEL 9: SYSTEM ARCHITECTURE & MICROSERVICES ────────────────
  {
    title: "Microservices, Caching & Distributed Systems",
    slug: "system-architecture-microservices",
    description: "Scale backend systems using Redis caching, message queues (RabbitMQ/Kafka), API gateways, and horizontal load balancing.",
    shortDescription: "Architect resilient distributed systems: Redis caching, message queues, Docker, and horizontal scaling.",
    category: "Architecture",
    language: "javascript",
    frameworks: ["Redis", "RabbitMQ", "Docker", "Nginx"],
    learningPath: "backend-javascript",
    codeSnippet: "await redisClient.setEx(`user:${id}`, 3600, JSON.stringify(userData));",
    difficulty: "advanced",
    level: "Level 9: Advanced",
    levelNumber: 9,
    instructor: "Principal Systems Architect",
    estimatedHours: 10,
    totalModules: 6,
    totalLessons: 18,
    totalXP: 2600,
    tags: ["Microservices", "Redis", "Message Queues", "Caching", "Docker", "Architecture"],
    prerequisites: ["authentication-security"],
    whyItMatters: "When millions of users hit an API, single-server setups fail. Distributed architecture ensures 99.99% uptime.",
    published: true,
    order: 9,
    executionSupport: "interactive"
  },

  // ─── MULTI-LANGUAGE PATH: PYTHON ─────────────────────────────────
  {
    title: "Python Backend Foundations & Fast APIs",
    slug: "python-backend-foundations",
    description: "Learn Python fundamentals, typing, virtual environments, data structures, and build high-performance APIs with FastAPI.",
    shortDescription: "Python syntax, typing, virtual environments, and asynchronous REST APIs with FastAPI.",
    category: "Python Path",
    language: "python",
    frameworks: ["Python 3.12", "FastAPI", "Pydantic", "Uvicorn"],
    learningPath: "backend-python",
    codeSnippet: "from fastapi import FastAPI\napp = FastAPI()\n\n@app.get('/health')\ndef health():\n    return {'status': 'healthy'}",
    difficulty: "beginner",
    level: "Level 1: Beginner",
    levelNumber: 1,
    instructor: "Python Guild",
    estimatedHours: 8,
    totalModules: 5,
    totalLessons: 15,
    totalXP: 1900,
    tags: ["Python", "FastAPI", "Pydantic", "REST APIs", "Async Python"],
    prerequisites: ["universal-programming-fundamentals"],
    whyItMatters: "Python is one of the most popular backend languages, powering high-throughput APIs, AI integration pipelines, and data services.",
    nextCourseSlug: "fastapi-backend-architecture",
    published: true,
    order: 20,
    executionSupport: "learning-content-available"
  },

  // ─── MULTI-LANGUAGE PATH: JAVA ───────────────────────────────────
  {
    title: "Java Enterprise Architecture & Spring Boot",
    slug: "java-backend-foundations",
    description: "Master Java OOP, strong static typing, JVM memory management, and enterprise REST microservices with Spring Boot.",
    shortDescription: "Strongly typed enterprise backend engineering with Java, Maven, and Spring Boot 3.",
    category: "Java Path",
    language: "java",
    frameworks: ["Java 21", "Spring Boot 3", "Hibernate", "Maven"],
    learningPath: "backend-java",
    codeSnippet: "@RestController\n@RequestMapping(\"/api/health\")\npublic class HealthController {\n    @GetMapping\n    public Map<String, String> check() { return Map.of(\"status\", \"up\"); }\n}",
    difficulty: "intermediate",
    level: "Level 1: Intermediate",
    levelNumber: 1,
    instructor: "Java Enterprise Architects",
    estimatedHours: 10,
    totalModules: 6,
    totalLessons: 18,
    totalXP: 2400,
    tags: ["Java", "Spring Boot", "JVM", "Enterprise", "Hibernate"],
    prerequisites: ["universal-programming-fundamentals"],
    whyItMatters: "Java and Spring Boot run the backend infrastructure for Fortune 500 banks, airlines, and large-scale enterprise services.",
    published: true,
    order: 30,
    executionSupport: "learning-content-available"
  },

  // ─── MULTI-LANGUAGE PATH: PHP ────────────────────────────────────
  {
    title: "Modern PHP & Laravel Web Services",
    slug: "php-backend-foundations",
    description: "Understand modern PHP 8.3 typing, composer package management, routing, Eloquent ORM, and rapid API engineering with Laravel.",
    shortDescription: "Modern PHP 8+ object-oriented architecture, Eloquent ORM, and REST APIs with Laravel.",
    category: "PHP Path",
    language: "php",
    frameworks: ["PHP 8.3", "Laravel 11", "Eloquent ORM", "Composer"],
    learningPath: "backend-php",
    codeSnippet: "Route::get('/api/health', function () {\n    return response()->json(['status' => 'operational']);\n});",
    difficulty: "beginner",
    level: "Level 1: Beginner",
    levelNumber: 1,
    instructor: "PHP Guild",
    estimatedHours: 8,
    totalModules: 5,
    totalLessons: 15,
    totalXP: 1900,
    tags: ["PHP", "Laravel", "Eloquent", "REST APIs", "Composer"],
    prerequisites: ["universal-programming-fundamentals"],
    whyItMatters: "PHP powers over 70% of the web. Modern PHP with Laravel offers unmatched developer velocity for web services and APIs.",
    published: true,
    order: 40,
    executionSupport: "learning-content-available"
  },

  // ─── MULTI-LANGUAGE PATH: GO ─────────────────────────────────────
  {
    title: "Go Concurrency, Goroutines & Microservices",
    slug: "go-backend-foundations",
    description: "Master Go's lightweight Goroutines, Channels, strict compiler checks, standard library HTTP server, and bare-metal microservices.",
    shortDescription: "Ultra-fast compiled backend microservices with Go, Goroutines, Channels, and standard net/http.",
    category: "Go Path",
    language: "go",
    frameworks: ["Go 1.22", "Goroutines", "net/http", "Gin"],
    learningPath: "backend-go",
    codeSnippet: "http.HandleFunc(\"/api/health\", func(w http.ResponseWriter, r *http.Request) {\n    w.Header().Set(\"Content-Type\", \"application/json\")\n    w.Write([]byte(`{\"status\":\"ready\"}`))\n})",
    difficulty: "intermediate",
    level: "Level 1: Intermediate",
    levelNumber: 1,
    instructor: "Go Systems Engineers",
    estimatedHours: 9,
    totalModules: 6,
    totalLessons: 18,
    totalXP: 2300,
    tags: ["Go", "Goroutines", "Concurrency", "Microservices", "Gin"],
    prerequisites: ["universal-programming-fundamentals"],
    whyItMatters: "Go is the industry choice for cloud-native infrastructure (Docker, Kubernetes), low-latency API gateways, and high-concurrency microservices.",
    published: true,
    order: 50,
    executionSupport: "learning-content-available"
  }
];

export function getCatalogCourseBySlug(slug: string): CatalogCourse | undefined {
  return ALL_CATALOG_COURSES.find((c) => c.slug === slug);
}

export function getCoursesByLanguage(language: string): CatalogCourse[] {
  if (!language || language === "all") return ALL_CATALOG_COURSES;
  return ALL_CATALOG_COURSES.filter((c) => c.language === language || c.language === "agnostic");
}
