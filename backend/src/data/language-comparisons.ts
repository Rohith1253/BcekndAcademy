export interface LanguageComparisonMetric {
  category: string;
  metric: string;
  description: string;
  ratings: Record<string, {
    score: number; // 1 - 10
    label: string;
    details: string;
  }>;
}

export interface LanguageComparisonSummary {
  lang1: string;
  lang2: string;
  overview: string;
  verdict: string;
  whenToChooseFirst: string[];
  whenToChooseSecond: string[];
}

export const LANGUAGE_COMPARISON_METRICS: LanguageComparisonMetric[] = [
  {
    category: "Performance",
    metric: "Raw Execution & Throughput",
    description: "Benchmark HTTP throughput and CPU bound processing capability.",
    ratings: {
      javascript: { score: 7, label: "Good (I/O Bound)", details: "Fast V8 JIT compiler; excellent for async I/O; CPU single-core bounded." },
      typescript: { score: 7, label: "Good (I/O Bound)", details: "Same runtime speed as JavaScript with zero compile-time performance tax." },
      python: { score: 5, label: "Moderate", details: "Interpreted bytecode with GIL; mitigated by async ASGI (FastAPI) and C extensions." },
      java: { score: 9, label: "Very High", details: "Heavily optimized JIT (HotSpot) and Virtual Threads delivering massive throughput." },
      csharp: { score: 9, label: "Very High", details: "ASP.NET Core ranks near the top of TechEmpower benchmarks; hardware-accelerated vectors." },
      go: { score: 9, label: "Very High", details: "Native compiled code with lightweight ~2KB goroutines and low-latency GC." },
      php: { score: 6, label: "Moderate to Good", details: "PHP 8 JIT is fast; PHP-FPM process overhead can be avoided using Laravel Octane." },
      rust: { score: 10, label: "Maximum / Bare Metal", details: "C/C++ tier execution with zero garbage collection pauses and optimal SIMD utilization." },
      ruby: { score: 5, label: "Moderate", details: "Dynamic interpretation; relies on caching and database optimization for high throughput." },
      kotlin: { score: 9, label: "Very High", details: "JVM performance parity with Java, non-blocking Coroutine dispatchers." },
      elixir: { score: 8, label: "High Concurrency", details: "Sub-millisecond per-process latency; exceptional under millions of concurrent connections." },
    },
  },
  {
    category: "Developer Experience",
    metric: "Velocity & Learning Curve",
    description: "Time required to become productive and ship production features.",
    ratings: {
      javascript: { score: 9, label: "Very Fast", details: "Ubiquitous syntax, immediate feedback, massive npm ecosystem." },
      typescript: { score: 8, label: "Fast & Safe", details: "Slight learning curve for advanced types, but saves hundreds of debugging hours." },
      python: { score: 10, label: "Fastest", details: "Clean, intuitive syntax with minimal boilerplate; fastest idea-to-API velocity." },
      java: { score: 6, label: "Moderate", details: "Verbose syntax and large enterprise framework concepts (Spring IoC, JPA, Hibernate)." },
      csharp: { score: 8, label: "Fast to Moderate", details: "Clean modern C# syntax with Minimal APIs and best-in-class IDE tooling." },
      go: { score: 8, label: "Fast", details: "Very simple language with only 25 keywords; fast onboarding for new engineers." },
      php: { score: 9, label: "Very Fast", details: "Laravel is widely regarded as the most productive full-featured web framework." },
      rust: { score: 4, label: "Steep Curve", details: "Borrow checker, lifetimes, and strict compiler require significant initial study." },
      ruby: { score: 9, label: "Very Fast", details: "Convention over configuration with Rails delivers unmatched prototype velocity." },
      kotlin: { score: 8, label: "Fast", details: "Concise modern JVM language with expressive syntax and null safety." },
      elixir: { score: 7, label: "Moderate", details: "Functional paradigm and OTP concepts require paradigm shift from OOP." },
    },
  },
  {
    category: "Architecture",
    metric: "Concurrency & Scaling Model",
    description: "How the runtime handles hundreds of thousands of simultaneous requests.",
    ratings: {
      javascript: { score: 7, label: "Async Event Loop", details: "Non-blocking single thread; scales via Node.js cluster module or containers." },
      typescript: { score: 7, label: "Async Event Loop", details: "Single-threaded event loop with strong type boundaries." },
      python: { score: 6, label: "asyncio / Workers", details: "ASGI event loop with multi-worker Gunicorn/Uvicorn processes." },
      java: { score: 9, label: "Virtual Threads (Loom)", details: "Million-thread lightweight concurrency on top of OS thread pools." },
      csharp: { score: 9, label: "Task Parallel Library", details: "High-performance async state machine with I/O completion ports." },
      go: { score: 10, label: "Goroutines & Channels", details: "Built-in M:N scheduler managing hundreds of thousands of concurrent goroutines." },
      php: { score: 6, label: "Process-per-Request", details: "PHP-FPM worker pools; async event loop enabled by Swoole/RoadRunner." },
      rust: { score: 10, label: "Fearless Concurrency", details: "Send/Sync compiler guarantees eliminate race conditions; Tokio async runtime." },
      ruby: { score: 6, label: "Threaded / Fibers", details: "Puma multi-threaded web server with Ractor parallel processing." },
      kotlin: { score: 9, label: "Structured Coroutines", details: "Lightweight suspended functions without OS thread blocking." },
      elixir: { score: 10, label: "Actor Model (BEAM)", details: "Isolated lightweight processes communicating exclusively via asynchronous messages." },
    },
  },
  {
    category: "Ecosystem",
    metric: "Frameworks & Package Ecosystem",
    description: "Maturity of libraries, ORMs, authentication, and tooling.",
    ratings: {
      javascript: { score: 10, label: "Largest in World", details: "npm has over 2.5 million packages; Express, NestJS, Fastify, Socket.io." },
      typescript: { score: 10, label: "Premier Standard", details: "Virtually all modern npm packages include first-party TypeScript definitions." },
      python: { score: 10, label: "Massive & AI Standard", details: "PyPI with FastAPI, Django, Celery, LangChain, PyTorch, SQLAlchemy." },
      java: { score: 10, label: "Battle-Tested Enterprise", details: "Spring Boot, Hibernate, Apache Kafka, Flyway, Maven/Gradle." },
      csharp: { score: 9, label: "Mature & Unified", details: "NuGet ecosystem with ASP.NET Core, EF Core, Dapper, SignalR." },
      go: { score: 8, label: "Lean Standard Library", details: "Rich standard library, Gin, Fiber, GORM, pgx, gRPC protobuf." },
      php: { score: 9, label: "Complete Web Toolkit", details: "Composer, Laravel ecosystem (Sanctum, Horizon, Eloquent), Symfony." },
      rust: { score: 8, label: "Rapidly Growing", details: "crates.io with Tokio, Axum, Serde, SQLx, Tower." },
      ruby: { score: 8, label: "Gems & Rails", details: "RubyGems with Rails, Devise, Sidekiq, ActiveRecord, Pundit." },
      kotlin: { score: 9, label: "Full JVM Access", details: "Ktor, Spring Boot Kotlin, plus seamless access to all Java libraries." },
      elixir: { score: 8, label: "OTP & Hex.pm", details: "Hex packages with Phoenix Framework, Ecto ORM, Broadway, Absinthe." },
    },
  },
];

export function getComparisonPair(lang1Slug: string, lang2Slug: string): {
  lang1: string;
  lang2: string;
  metrics: Array<{
    category: string;
    metric: string;
    description: string;
    rating1: { score: number; label: string; details: string };
    rating2: { score: number; label: string; details: string };
  }>;
  summary: LanguageComparisonSummary;
} {
  const metrics = LANGUAGE_COMPARISON_METRICS.map((m) => ({
    category: m.category,
    metric: m.metric,
    description: m.description,
    rating1: m.ratings[lang1Slug] || { score: 7, label: "Standard", details: "General backend capabilities" },
    rating2: m.ratings[lang2Slug] || { score: 7, label: "Standard", details: "General backend capabilities" },
  }));

  const lang1Name = lang1Slug.charAt(0).toUpperCase() + lang1Slug.slice(1);
  const lang2Name = lang2Slug.charAt(0).toUpperCase() + lang2Slug.slice(1);

  const summary: LanguageComparisonSummary = {
    lang1: lang1Slug,
    lang2: lang2Slug,
    overview: `Comparing ${lang1Name} with ${lang2Name} highlights key architectural trade-offs between execution throughput, developer velocity, type safety, and concurrency paradigms.`,
    verdict: `Choose ${lang1Name} when optimizing for its specific runtime strengths and team familiarity; choose ${lang2Name} when its concurrency and scaling model aligns with your platform demands.`,
    whenToChooseFirst: [
      `When your team has existing expertise in ${lang1Name} and wants high velocity.`,
      `When the ${lang1Name} package ecosystem offers specialized libraries for your business domain.`,
      `When prioritizing the architectural balance and deployment simplicity of ${lang1Name}.`,
    ],
    whenToChooseSecond: [
      `When your system requires the specific runtime throughput and memory profile of ${lang2Name}.`,
      `When the architectural concurrency pattern of ${lang2Name} directly solves your workload bottleneck.`,
      `When targeting long-term platform scalability with ${lang2Name}.`,
    ],
  };

  return {
    lang1: lang1Slug,
    lang2: lang2Slug,
    metrics,
    summary,
  };
}
