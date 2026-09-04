export interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: "junior" | "intermediate" | "senior" | "lead";
  title: string;
  type: "multiple-choice" | "scenario" | "debugging" | "architecture";
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  hints: string[];
  xpReward: number;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "node_event_loop_phases",
    category: "Node.js & Concurrency",
    difficulty: "intermediate",
    title: "Node.js Event Loop Microtasks vs Macrotasks",
    type: "multiple-choice",
    question: "In what order will process.nextTick, Promise.then, setTimeout(..., 0), and setImmediate execute when queued synchronously?",
    options: [
      "setTimeout -> setImmediate -> Promise.then -> process.nextTick",
      "process.nextTick -> Promise.then -> setTimeout -> setImmediate",
      "Promise.then -> process.nextTick -> setImmediate -> setTimeout",
      "setImmediate -> setTimeout -> process.nextTick -> Promise.then",
    ],
    correctOptionIndex: 1,
    explanation: "process.nextTick has the highest priority microtask queue, followed by Promise microtasks, then Macrotasks: Timers (setTimeout) and Check phase (setImmediate).",
    hints: ["Microtasks execute immediately after the current operation before the event loop advances to the next phase."],
    xpReward: 50,
  },
  {
    id: "mongodb_compound_index_prefix",
    category: "MongoDB & Indexing",
    difficulty: "senior",
    title: "MongoDB Compound Index Prefix Rule",
    type: "multiple-choice",
    question: "Given a compound index { status: 1, createdAt: -1, userId: 1 }, which of the following queries CANNOT efficiently utilize the index?",
    options: [
      "db.orders.find({ status: 'pending' })",
      "db.orders.find({ status: 'shipped', createdAt: { $gt: new Date() } })",
      "db.orders.find({ createdAt: { $gt: new Date() }, userId: 'u1' })",
      "db.orders.find({ status: 'delivered', createdAt: { $gt: new Date() }, userId: 'u2' })",
    ],
    correctOptionIndex: 2,
    explanation: "MongoDB compound indexes require queries to match a leading index prefix. A query starting on 'createdAt' without 'status' cannot use the compound index effectively.",
    hints: ["Compound indexes must match left-to-right starting with the very first indexed key."],
    xpReward: 60,
  },
  {
    id: "jwt_signature_vs_encryption",
    category: "Auth & Security",
    difficulty: "intermediate",
    title: "JWT Integrity vs Confidentiality",
    type: "scenario",
    question: "A developer stores a user's plaintext password inside a standard HMAC-SHA256 signed JWT payload. What is the critical security vulnerability?",
    options: [
      "The token cannot be verified by the backend.",
      "The signature prevents the token from being decoded.",
      "The JWT payload is only Base64Url-encoded, NOT encrypted; anyone with the token can read the password.",
      "HMAC-SHA256 requires asymmetric public keys.",
    ],
    correctOptionIndex: 2,
    explanation: "Standard JWS tokens provide cryptographic integrity (tamper detection), but the payload is plaintext Base64Url. Secrets must never be stored in standard JWT claims.",
    hints: ["Base64 encoding is not encryption."],
    xpReward: 50,
  },
  {
    id: "sql_vs_nosql_acid",
    category: "Databases & Transactions",
    difficulty: "senior",
    title: "Distributed Transactions & Two-Phase Commits",
    type: "architecture",
    question: "When orchestrating monetary transfers across partitioned microservices, why is the SAGA pattern preferred over distributed 2-Phase Commit (2PC)?",
    options: [
      "2PC requires synchronous locking across nodes, hurting availability and throughput in distributed environments.",
      "SAGA patterns do not require compensating transactions.",
      "2PC is only supported in SQLite.",
      "SAGA patterns provide strict centralized blocking locks.",
    ],
    correctOptionIndex: 0,
    explanation: "Two-Phase Commit requires distributed synchronous locking which suffers high latency and single-point-of-failure bottlenecks. SAGA uses asynchronous local transactions with compensating rollbacks.",
    hints: ["Consider the CAP theorem and the performance impact of holding network locks."],
    xpReward: 70,
  },
  {
    id: "rest_idempotency_semantics",
    category: "REST & API Design",
    difficulty: "intermediate",
    title: "HTTP Method Idempotency Semantics",
    type: "multiple-choice",
    question: "Which of the following HTTP methods is defined by the RFC 7231 specification as NOT idempotent?",
    options: [
      "GET",
      "PUT",
      "DELETE",
      "POST",
    ],
    correctOptionIndex: 3,
    explanation: "POST is non-idempotent because executing multiple identical POST requests typically creates multiple distinct resource instances.",
    hints: ["Idempotent means making N identical requests yields the same side-effect on the server as making 1 request."],
    xpReward: 50,
  },
  {
    id: "cache_stampede_dogpiling",
    category: "Systems Architecture & Caching",
    difficulty: "senior",
    title: "Cache Stampede (Dogpiling) Prevention",
    type: "architecture",
    question: "When a high-traffic cache key expires simultaneously for 50,000 concurrent users, causing database overload, which technique best prevents the outage?",
    options: [
      "Disabling TTL expiration entirely.",
      "Using distributed mutex locking (single-flight) or probabilistic early expiration (XFetch).",
      "Switching from Redis to SQLite.",
      "Increasing the database connection pool limit to 100,000.",
    ],
    correctOptionIndex: 1,
    explanation: "Distributed mutex locks or probabilistic early background cache recomputation (XFetch) ensures only 1 worker regenerates the cache while others receive stale data or await lock resolution.",
    hints: ["You need to prevent all concurrent workers from hitting the database simultaneously when a key expires."],
    xpReward: 75,
  },
];
