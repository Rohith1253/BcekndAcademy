export interface ArchitectureLabDefinition {
  slug: string;
  title: string;
  category: "Request Pipelines" | "Security & Auth" | "Database & Storage" | "Resilience & Caching" | "Asynchronous Queues";
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  objective: string;
  initialConfig: Record<string, any>;
  optimalConfig: Record<string, any>;
  stages: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  explanation: string;
  xpReward: number;
  estimatedMinutes: number;
}

export const ARCHITECTURE_LABS: ArchitectureLabDefinition[] = [
  {
    slug: "express-middleware-pipeline",
    title: "Express Request Lifecycle & Middleware Pipeline",
    category: "Request Pipelines",
    difficulty: "beginner",
    description: "Arrange the optimal execution order for CORS, Rate Limiter, Body Parser, Auth Guard, Controller, and Error Handler.",
    objective: "Configure the sequential pipeline so that security guards execute before expensive parsers and controllers.",
    initialConfig: {
      pipelineOrder: ["controller", "bodyParser", "cors", "errorHandler", "rateLimiter", "authGuard"],
    },
    optimalConfig: {
      pipelineOrder: ["cors", "rateLimiter", "bodyParser", "authGuard", "controller", "errorHandler"],
    },
    stages: [
      { id: "cors", name: "1. CORS Preflight & Origin Filter", description: "Rejects disallowed origins before consuming server CPU." },
      { id: "rateLimiter", name: "2. Rate Limiting Guard", description: "Blocks DoS attacks before body deserialization." },
      { id: "bodyParser", name: "3. JSON Body Parser", description: "Safely parses request stream within payload bounds." },
      { id: "authGuard", name: "4. Authentication & JWT Guard", description: "Verifies cryptographically signed bearer tokens." },
      { id: "controller", name: "5. Route Controller & Business Logic", description: "Executes business application queries." },
      { id: "errorHandler", name: "6. Centralized 4-Arg Error Handler", description: "Catches uncaught exceptions and formats clean responses." },
    ],
    explanation: "Executing CORS and Rate Limiting first prevents unauthenticated clients or DDoS floods from forcing expensive JSON deserialization and DB queries.",
    xpReward: 130,
    estimatedMinutes: 12,
  },
  {
    slug: "cache-aside-pattern",
    title: "Cache-Aside & Redis Cache Invalidation",
    category: "Resilience & Caching",
    difficulty: "intermediate",
    description: "Simulate read-through caching with Redis, measuring latency on Cache Hit (1ms) vs Cache Miss (120ms).",
    objective: "Configure TTL (Time-to-Live) and cache invalidation on database mutations to prevent stale data anomalies.",
    initialConfig: {
      ttlSeconds: 0,
      invalidateOnWrite: false,
      cacheStrategy: "none",
    },
    optimalConfig: {
      ttlSeconds: 300,
      invalidateOnWrite: true,
      cacheStrategy: "cache-aside",
    },
    stages: [
      { id: "client_req", name: "1. Client Read Request", description: "Client requests user profile metadata." },
      { id: "cache_check", name: "2. In-Memory Key Lookup", description: "Checks Redis for key 'user:profile:123'." },
      { id: "db_fallback", name: "3. Database Query on Miss", description: "Executes BSON query and populates cache key with TTL." },
      { id: "mutation_sync", name: "4. Cache Invalidation on Write", description: "Deletes cached key upon profile update." },
    ],
    explanation: "Cache-aside with write invalidation gives microsecond read performance while preventing stale cache drift.",
    xpReward: 160,
    estimatedMinutes: 15,
  },
  {
    slug: "circuit-breaker-pattern",
    title: "Circuit Breaker & Fault-Tolerant Microservices",
    category: "Resilience & Caching",
    difficulty: "advanced",
    description: "Configure Closed, Open, and Half-Open states with failure rate thresholds and fallback responses.",
    objective: "Prevent cascading failures when a downstream payment gateway microservice experiences outage.",
    initialConfig: {
      failureThresholdPercent: 100,
      timeoutMs: 10000,
      cooldownSeconds: 5,
    },
    optimalConfig: {
      failureThresholdPercent: 50,
      timeoutMs: 2000,
      cooldownSeconds: 30,
    },
    stages: [
      { id: "closed_state", name: "1. Normal Closed State", description: "Requests pass directly to downstream service." },
      { id: "failure_detect", name: "2. Failure Rate Trigger", description: "Opens circuit when error rate exceeds 50%." },
      { id: "open_fallback", name: "3. Open State (Fail Fast)", description: "Returns immediate fallback without blocking thread pool." },
      { id: "half_open_probe", name: "4. Half-Open Health Probe", description: "Allows canary requests to test downstream recovery." },
    ],
    explanation: "Circuit Breakers prevent threads from hanging indefinitely on dead downstream services.",
    xpReward: 180,
    estimatedMinutes: 18,
  },
  {
    slug: "jwt-token-refresh-rotation",
    title: "JWT Token Refresh & Family Invalidation",
    category: "Security & Auth",
    difficulty: "intermediate",
    description: "Implement silent token refresh with short-lived access tokens (15m) and single-use refresh token rotation.",
    objective: "Protect against token theft by detecting token reuse and instantly invalidating the entire refresh family.",
    initialConfig: {
      accessTokenExpiryMinutes: 1440,
      rotateOnRefresh: false,
      reuseDetection: false,
    },
    optimalConfig: {
      accessTokenExpiryMinutes: 15,
      rotateOnRefresh: true,
      reuseDetection: true,
    },
    stages: [
      { id: "access_token_gen", name: "1. Access Token Issuance", description: "Issue short-lived signed JWT (15 min)." },
      { id: "refresh_store", name: "2. Refresh Token Hash Store", description: "Store cryptographic hash in database family tree." },
      { id: "rotation_event", name: "3. Atomic Token Rotation", description: "Invalidate old refresh token and issue new pair." },
      { id: "theft_detection", name: "4. Reuse Anomaly Trap", description: "Revoke entire session if revoked token is replayed." },
    ],
    explanation: "Short-lived access tokens combined with atomic refresh token rotation eliminates long-term vulnerability windows.",
    xpReward: 170,
    estimatedMinutes: 15,
  },
  {
    slug: "async-job-queue-workers",
    title: "BullMQ / Redis Asynchronous Job Queue",
    category: "Asynchronous Queues",
    difficulty: "advanced",
    description: "Decouple heavy video encoding and PDF generation from HTTP request handlers using worker pools and backpressure.",
    objective: "Offload compute-heavy tasks to background workers with automatic exponential backoff retries and Dead Letter Queue (DLQ).",
    initialConfig: {
      concurrency: 1,
      maxRetries: 0,
      deadLetterQueue: false,
    },
    optimalConfig: {
      concurrency: 5,
      maxRetries: 3,
      deadLetterQueue: true,
    },
    stages: [
      { id: "job_enqueue", name: "1. HTTP Handler Enqueues Job", description: "Producer adds task metadata to Redis queue (O(1))." },
      { id: "fast_202", name: "2. Return HTTP 202 Accepted", description: "Client receives immediate job ID without waiting for compute." },
      { id: "worker_consume", name: "3. Distributed Worker Pool", description: "Workers consume jobs with controlled concurrency." },
      { id: "dlq_fallback", name: "4. Dead Letter Queue Routing", description: "Failed jobs after 3 retries move to DLQ for inspection." },
    ],
    explanation: "Job queues protect API web servers from CPU saturation while providing guaranteed at-least-once task delivery.",
    xpReward: 200,
    estimatedMinutes: 20,
  },
];
