export interface BackendLanguage {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  level: string;
  primaryFrameworks: string[];
  useCases: string[];
  learningPath: string;
  order: number;
  runtimeOrCompiler: string;
  typing: string;
  concurrencyModel: string;
  memoryManagement: string;
  sampleCode: string;
  strengths: string[];
  limitations: string[];
  roadmapSteps: Array<{
    step: number;
    title: string;
    description: string;
    topics: string[];
  }>;
}

export const BACKEND_LANGUAGES: BackendLanguage[] = [
  {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    tagline: "Event-driven asynchronous server-side programming",
    description:
      "JavaScript powers modern non-blocking backend architectures using Node.js and Fastify. It excels in real-time WebSockets, high I/O throughput REST APIs, and microservices.",
    icon: "Code2",
    color: "amber",
    difficulty: "beginner",
    level: "Beginner to Advanced",
    primaryFrameworks: ["Node.js", "Express.js", "Fastify", "NestJS"],
    useCases: ["REST APIs", "Real-time Chat", "WebSockets", "API Gateways", "Serverless Functions"],
    learningPath: "backend-javascript",
    order: 1,
    runtimeOrCompiler: "V8 Engine (Node.js / Bun / Deno)",
    typing: "Dynamic",
    concurrencyModel: "Single-threaded Event Loop with Libuv worker pool",
    memoryManagement: "V8 Generational Garbage Collector",
    sampleCode: `const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(5000, () => console.log('Server active on port 5000'));`,
    strengths: [
      "Vast npm ecosystem (over 2 million packages)",
      "Universal language across frontend and backend",
      "High I/O throughput for lightweight asynchronous requests",
    ],
    limitations: [
      "Single-threaded CPU bottlenecks without clustering",
      "Lack of compile-time static types without TypeScript",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "JavaScript Engine & Asynchronous Foundations",
        description: "Master event loop phases, microtasks, promises, and async/await.",
        topics: ["Event Loop", "Call Stack", "Promises", "Async/Await", "Buffers & Streams"],
      },
      {
        step: 2,
        title: "Node.js Core Architecture",
        description: "Learn Node.js internal modules, file system operations, and process management.",
        topics: ["fs/promises", "http module", "events", "child_process", "cluster"],
      },
      {
        step: 3,
        title: "REST APIs with Express & Fastify",
        description: "Build robust routing, middleware pipelines, validation, and error handlers.",
        topics: ["Routing", "Middleware", "Zod Validation", "Error Handling", "Rate Limiting"],
      },
      {
        step: 4,
        title: "Data Persistence & Mongoose ODM",
        description: "Connect to databases, design schemas, indexes, and transactions.",
        topics: ["MongoDB", "Mongoose", "PostgreSQL with Knex", "ACID Transactions", "Indexing"],
      },
      {
        step: 5,
        title: "Production Architecture & Microservices",
        description: "Implement JWT rotation, WebSockets, caching, and Docker containerization.",
        topics: ["JWT Auth", "Redis Caching", "Socket.io", "Docker", "Winston Logging"],
      },
    ],
  },
  {
    id: "typescript",
    name: "TypeScript",
    slug: "typescript",
    tagline: "Type-safe, scalable enterprise backend engineering",
    description:
      "TypeScript adds static type checking, interfaces, and compile-time correctness to JavaScript backends. It is the premier choice for large-scale Node.js and NestJS enterprise backends.",
    icon: "FileCode2",
    color: "sky",
    difficulty: "beginner",
    level: "Beginner to Intermediate",
    primaryFrameworks: ["NestJS", "Express (TypeScript)", "Fastify", "tRPC"],
    useCases: ["Enterprise Microservices", "Typed REST APIs", "GraphQL Servers", "Domain-Driven Design"],
    learningPath: "backend-typescript",
    order: 2,
    runtimeOrCompiler: "TypeScript Compiler (tsc) -> Node.js Runtime",
    typing: "Static (Compile-time)",
    concurrencyModel: "Event Loop with Strict Type Boundaries",
    memoryManagement: "V8 Generational Garbage Collector",
    sampleCode: `import express, { Request, Response } from 'express';
import { z } from 'zod';

const userSchema = z.object({ email: z.string().email(), name: z.string().min(2) });
type CreateUserDTO = z.infer<typeof userSchema>;

const app = express();
app.post('/api/users', (req: Request<{}, {}, CreateUserDTO>, res: Response) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error);
  return res.status(201).json({ id: 'usr_1', ...result.data });
});`,
    strengths: [
      "Eliminates entire classes of runtime type errors at compile time",
      "Superior developer ergonomics, autocompletion, and refactoring safety",
      "Native support for Enterprise patterns (DTOs, Decorators, Dependency Injection)",
    ],
    limitations: [
      "Compilation step required before execution",
      "Types are erased at runtime; schema validation libraries (Zod) needed for user input",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "TypeScript Core for Server Applications",
        description: "Master generics, utility types, discriminated unions, and strict compiler flags.",
        topics: ["Generics", "Type Narrowing", "Interfaces vs Types", "tsconfig strict mode", "Utility Types"],
      },
      {
        step: 2,
        title: "Typed REST & Request DTOs",
        description: "Enforce contract boundaries with Zod, TypeBox, and Express/Fastify request typing.",
        topics: ["Express Request Generics", "Zod DTOs", "Runtime Validation", "Typed Error Handlers"],
      },
      {
        step: 3,
        title: "Enterprise Architecture with NestJS",
        description: "Structure modular services with Dependency Injection, Controllers, and Guards.",
        topics: ["Modules & Providers", "Dependency Injection", "Guards & Interceptors", "TypeORM / Prisma"],
      },
      {
        step: 4,
        title: "Production Testing & Deployment",
        description: "Write unit tests with Jest, integration tests, and multi-stage Docker builds.",
        topics: ["Jest Unit Tests", "Supertest API Tests", "Multi-stage Docker", "CI/CD Pipelines"],
      },
    ],
  },
  {
    id: "python",
    name: "Python",
    slug: "python",
    tagline: "Rapid API development, data engineering, and AI integration",
    description:
      "Python provides clean, readable syntax paired with powerful asynchronous frameworks like FastAPI and batteries-included web frameworks like Django. It is the undisputed standard for AI/ML backends and data pipelines.",
    icon: "Cpu",
    color: "emerald",
    difficulty: "beginner",
    level: "Beginner to Advanced",
    primaryFrameworks: ["FastAPI", "Django", "Flask", "Celery"],
    useCases: ["REST APIs", "AI/LLM Backends", "Data Pipelines", "E-commerce", "Background Task Workers"],
    learningPath: "backend-python",
    order: 3,
    runtimeOrCompiler: "CPython / PyPy / Uvicorn (ASGI)",
    typing: "Gradual (Type Hints via Pydantic & Mypy)",
    concurrencyModel: "asyncio Event Loop with Uvicorn worker processes (GIL)",
    memoryManagement: "Reference Counting with Generational Garbage Collector",
    sampleCode: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI(title="Backend Academy API")

class UserCreate(BaseModel):
    name: str
    email: EmailStr

@app.post("/api/users", status_code=201)
async def create_user(user: UserCreate):
    return {"id": "usr_py_1", "name": user.name, "email": user.email}`,
    strengths: [
      "Incredible developer velocity and readable standard library",
      "Native compatibility with all AI/ML models (PyTorch, TensorFlow, LangChain)",
      "FastAPI delivers automatic OpenAPI documentation and Pydantic validation",
    ],
    limitations: [
      "Global Interpreter Lock (GIL) limits raw CPU-bound multithreading in CPython",
      "Higher memory footprint compared to compiled languages like Go and Rust",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "Python 3 Syntax & Modern Asynchronous Flow",
        description: "Master type hints, virtual environments, asyncio, and generators.",
        topics: ["Type Hints", "Asyncio", "Decorators", "Context Managers", "Poetry / venv"],
      },
      {
        step: 2,
        title: "Modern REST APIs with FastAPI",
        description: "Build fast, auto-documented web services with Pydantic and Dependency Injection.",
        topics: ["Pydantic Models", "Dependency Injection", "Path/Query Parameters", "OAuth2 & JWT", "Error Handlers"],
      },
      {
        step: 3,
        title: "Database Layer with SQLAlchemy & Alembic",
        description: "Master async ORM modeling, relationship querying, and database migrations.",
        topics: ["Async SQLAlchemy 2.0", "Alembic Migrations", "PostgreSQL", "Session Management"],
      },
      {
        step: 4,
        title: "Background Tasks & Production Deployment",
        description: "Scale with Celery, Redis message brokers, Uvicorn, and Docker.",
        topics: ["Celery Workers", "Redis Queue", "Gunicorn + Uvicorn Workers", "Docker", "Pytest Async"],
      },
    ],
  },
  {
    id: "java",
    name: "Java",
    slug: "java",
    tagline: "Rock-solid enterprise architectures and large-scale microservices",
    description:
      "Java powers the world's most critical financial, banking, and enterprise platforms. With Spring Boot, Virtual Threads (Project Loom), and strong JVM garbage collectors, it provides unparalleled reliability at scale.",
    icon: "Coffee",
    color: "rose",
    difficulty: "intermediate",
    level: "Intermediate to Advanced",
    primaryFrameworks: ["Spring Boot", "Micronaut", "Quarkus", "Jakarta EE"],
    useCases: ["Financial Systems", "High-Volume Transaction Processing", "Enterprise Microservices", "Cloud-Native JVM"],
    learningPath: "backend-java",
    order: 4,
    runtimeOrCompiler: "Java Virtual Machine (JVM) / OpenJDK",
    typing: "Static (Strong)",
    concurrencyModel: "Virtual Threads (Loom) & Thread Pool Concurrency",
    memoryManagement: "Advanced JVM Collectors (ZGC, G1GC)",
    sampleCode: `@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> getAccount(@PathVariable String id) {
        AccountDTO account = new AccountDTO(id, "Active", new BigDecimal("50000.00"));
        return ResponseEntity.ok(account);
    }
}`,
    strengths: [
      "Legendary backward compatibility and massive enterprise support",
      "Virtual Threads enable millions of lightweight concurrent requests",
      "Spring Boot ecosystem provides mature security, ORM, and batching tools",
    ],
    limitations: [
      "More verbose boilerplate syntax compared to Python or Go",
      "JVM cold start latency (mitigated by GraalVM native images)",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "Java 21+ Object-Oriented & Concurrency Fundamentals",
        description: "Master records, pattern matching, streams, and Virtual Threads.",
        topics: ["Records & Sealed Classes", "Streams API", "Virtual Threads", "Generics & Collections"],
      },
      {
        step: 2,
        title: "Spring Boot Microservices & Spring MVC",
        description: "Build REST controllers, dependency injection, and configuration management.",
        topics: ["@RestController", "Spring IoC / DI", "Spring Data JPA", "Hibernate ORM", "Flyway Migrations"],
      },
      {
        step: 3,
        title: "Enterprise Security & Distributed Messaging",
        description: "Implement Spring Security, OAuth2, Kafka event streaming, and resilience.",
        topics: ["Spring Security", "JWT Authentication", "Apache Kafka", "Resilience4j Circuit Breakers"],
      },
      {
        step: 4,
        title: "Cloud-Native JVM & GraalVM",
        description: "Containerize with multi-stage Docker and compile to GraalVM native binaries.",
        topics: ["GraalVM Native Image", "Docker Containerization", "Kubernetes Readiness", "JUnit 5 & Mockito"],
      },
    ],
  },
  {
    id: "csharp",
    name: "C# (.NET)",
    slug: "csharp",
    tagline: "High-performance enterprise cloud services with ASP.NET Core",
    description:
      "C# and .NET 8/9 deliver exceptional performance, cross-platform deployment, and first-class cloud integration. ASP.NET Core consistently ranks among the fastest web frameworks in the world.",
    icon: "Hash",
    color: "purple",
    difficulty: "intermediate",
    level: "Intermediate to Advanced",
    primaryFrameworks: ["ASP.NET Core", "Entity Framework Core", "Dapper", "Minimal APIs"],
    useCases: ["Enterprise Cloud Apps", "High-Throughput APIs", "Azure Cloud Services", "Fintech Systems"],
    learningPath: "backend-csharp",
    order: 5,
    runtimeOrCompiler: "Cross-Platform .NET CLR (Common Language Runtime)",
    typing: "Static (Strong)",
    concurrencyModel: "async/await Task Parallel Library (TPL) with I/O Completion Ports",
    memoryManagement: "Generational Server Garbage Collector (.NET GC)",
    sampleCode: `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/api/health", () => Results.Ok(new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow 
}));

app.Run();`,
    strengths: [
      "Consistently tops TechEmpower performance benchmarks",
      "Unified development experience across Windows, Linux, and macOS",
      "Entity Framework Core provides premier LINQ querying and migration tooling",
    ],
    limitations: [
      "Historically Windows-focused (though modern .NET is fully open source and cross-platform)",
      "Broader ecosystem can be deeply tied to Microsoft Azure paradigms",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "C# Modern Language Features & TPL",
        description: "Master pattern matching, records, LINQ, async/await, and memory structs.",
        topics: ["Records & Structs", "LINQ", "Async/Await Tasks", "Span<T> & Memory<T>", "Dependency Injection"],
      },
      {
        step: 2,
        title: "ASP.NET Core Web APIs & Minimal APIs",
        description: "Build clean, fast API endpoints with middleware pipelines and validation.",
        topics: ["Minimal APIs", "Controllers & ActionFilters", "FluentValidation", "Middleware Pipeline"],
      },
      {
        step: 3,
        title: "Data Access with EF Core & Dapper",
        description: "Model databases with Code-First migrations, indexing, and micro-ORM queries.",
        topics: ["Entity Framework Core", "Code-First Migrations", "Dapper Micro-ORM", "PostgreSQL / SQL Server"],
      },
      {
        step: 4,
        title: "Security, gRPC & Microservices",
        description: "Implement JWT, Identity, gRPC communication, and containerized deployment.",
        topics: ["ASP.NET Core Identity", "gRPC Services", "Redis Caching", "Docker & xUnit"],
      },
    ],
  },
  {
    id: "go",
    name: "Go (Golang)",
    slug: "go",
    tagline: "Lightweight concurrency, fast compilation, and cloud-native microservices",
    description:
      "Created at Google, Go is the language of cloud infrastructure (Docker, Kubernetes). With goroutines, channels, and zero runtime dependencies, it is ideal for scalable microservices and high-throughput networking.",
    icon: "Zap",
    color: "cyan",
    difficulty: "beginner",
    level: "Beginner to Intermediate",
    primaryFrameworks: ["Gin", "Fiber", "Echo", "Chi", "Standard Library net/http"],
    useCases: ["Cloud Infrastructure", "High-Concurrency Microservices", "API Gateways", "Distributed Systems", "DevOps Tooling"],
    learningPath: "backend-go",
    order: 6,
    runtimeOrCompiler: "Go Compiler (compiles to single static binary)",
    typing: "Static (Strong)",
    concurrencyModel: "Goroutines (M:N scheduler) with CSP Channels",
    memoryManagement: "Low-latency concurrent tri-color mark-sweep Garbage Collector",
    sampleCode: `package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "online",
			"runtime": "go",
		})
	})
	r.Run(":5000")
}`,
    strengths: [
      "Ultra-fast compilation into standalone static binaries with zero external dependencies",
      "Goroutines require only ~2KB memory, allowing hundreds of thousands of concurrent tasks",
      "Simple, unbloated language design with strict formatting (gofmt)",
    ],
    limitations: [
      "No traditional object-oriented inheritance (uses composition and interfaces)",
      "Explicit error checking (if err != nil) can lead to repetitive code patterns",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "Go Syntax, Pointers & Goroutines",
        description: "Master structs, interfaces, pointers, goroutines, and channels.",
        topics: ["Structs & Interfaces", "Pointers & Memory", "Goroutines & Channels", "Sync Package", "Error Handling"],
      },
      {
        step: 2,
        title: "Standard Library HTTP & Gin Framework",
        description: "Build clean HTTP handlers, custom middleware, JSON serialization, and routing.",
        topics: ["net/http", "Gin Routing", "Context Management", "Middleware", "JSON Binding"],
      },
      {
        step: 3,
        title: "Database Drivers & Clean Architecture",
        description: "Connect to PostgreSQL with pgx/GORM and structure domain repository layers.",
        topics: ["pgx Driver", "GORM / SQLC", "Repository Pattern", "Connection Pooling", "Transactions"],
      },
      {
        step: 4,
        title: "gRPC, Concurrency Patterns & Docker",
        description: "Build high-speed RPC services, worker pools, and lean Docker images.",
        topics: ["gRPC & Protobuf", "Worker Pool Pattern", "Multi-stage Scratch Docker", "Go Test & Benchmarking"],
      },
    ],
  },
  {
    id: "php",
    name: "PHP",
    slug: "php",
    tagline: "Productive web development powered by modern PHP 8 and Laravel",
    description:
      "Modern PHP (PHP 8.2+) is fast, strongly typed, and powers over 75% of the web. With Laravel, developers get the most complete web ecosystem in existence, featuring Eloquent ORM, Queues, Auth, and WebSockets.",
    icon: "Layers",
    color: "indigo",
    difficulty: "beginner",
    level: "Beginner to Intermediate",
    primaryFrameworks: ["Laravel", "Symfony", "Slim", "Laminas"],
    useCases: ["Dynamic Web Applications", "E-commerce Platforms", "SaaS Backends", "Content Management Systems"],
    learningPath: "backend-php",
    order: 7,
    runtimeOrCompiler: "Zend Engine (PHP-FPM) / Octane (Swoole / RoadRunner)",
    typing: "Gradual to Static (Strong type declarations)",
    concurrencyModel: "Process-per-request (PHP-FPM) or Async Event Loop (Laravel Octane)",
    memoryManagement: "Request-scoped Reference Counting Garbage Collector",
    sampleCode: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class HealthController extends Controller
{
    public function check(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'php_version' => PHP_VERSION,
        ]);
    }
}`,
    strengths: [
      "Laravel is widely regarded as the most productive developer framework in the industry",
      "Stateless process-per-request model prevents memory leaks from crashing entire servers",
      "Massive deployment simplicity with universal hosting availability",
    ],
    limitations: [
      "Traditional PHP-FPM incurs framework boot overhead per request (solved by Octane)",
      "Legacy PHP reputation overshadows the modern, elegant PHP 8 language features",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "Modern PHP 8+ Language Foundations",
        description: "Master typed properties, enums, attributes, match expressions, and Composer.",
        topics: ["Type Declarations", "Enums & Attributes", "Match Expressions", "Composer & PSR Standards"],
      },
      {
        step: 2,
        title: "Laravel Core Architecture & Routing",
        description: "Master the Service Container, Service Providers, Request Lifecycle, and Controllers.",
        topics: ["Service Container", "Routing & Controllers", "Form Requests", "Middleware", "API Resources"],
      },
      {
        step: 3,
        title: "Database Modeling with Eloquent ORM",
        description: "Master database migrations, relationships, eager loading, and query scopes.",
        topics: ["Eloquent Models", "Migrations & Seeders", "Eager Loading (N+1 Defense)", "Query Scopes"],
      },
      {
        step: 4,
        title: "Queues, Authentication & API Hardening",
        description: "Implement Sanctum token auth, background jobs with Redis, and rate limiting.",
        topics: ["Laravel Sanctum", "Queues & Redis Jobs", "Laravel Horizon", "Pest PHP Testing"],
      },
    ],
  },
  {
    id: "rust",
    name: "Rust",
    slug: "rust",
    tagline: "Blazing speed, zero-cost abstractions, and guaranteed memory safety",
    description:
      "Rust delivers bare-metal C/C++ performance without garbage collection pauses, while preventing null pointer dereferences and data races through its borrow checker. It is the premier choice for mission-critical, performance-demanding backends.",
    icon: "ShieldAlert",
    color: "orange",
    difficulty: "advanced",
    level: "Intermediate to Advanced",
    primaryFrameworks: ["Axum", "Actix Web", "Tide", "Rocket"],
    useCases: ["Ultra-High Performance APIs", "Cryptographic & Security Systems", "Real-Time Trading Engines", "Embedded IoT Backends"],
    learningPath: "backend-rust",
    order: 8,
    runtimeOrCompiler: "rustc (LLVM compiler to native machine code)",
    typing: "Static (Strict Type System with Affine Types)",
    concurrencyModel: "Fearless Concurrency (Send/Sync traits) with Tokio async runtime",
    memoryManagement: "Compile-Time Ownership & Borrow Checker (Zero GC)",
    sampleCode: `use axum::{routing::get, Json, Router};
use serde::Serialize;

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    memory_safe: bool,
}

async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ok", memory_safe: true })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/api/health", get(health_check));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:5000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}`,
    strengths: [
      "Zero garbage collection pauses for deterministic microsecond latency",
      "Borrow checker guarantees memory safety and prevents data races at compile time",
      "Axum and Actix Web deliver world-class throughput on multi-core servers",
    ],
    limitations: [
      "Steep learning curve due to ownership, lifetimes, and borrow checker rules",
      "Longer compilation times compared to Go or Node.js",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "Ownership, Borrowing & Lifetimes",
        description: "Master Rust's core memory model, traits, error handling with Result/Option.",
        topics: ["Ownership & Move Semantics", "Borrowing & References", "Traits & Generics", "Result<T, E>", "Pattern Matching"],
      },
      {
        step: 2,
        title: "Async Rust with Tokio & Serde",
        description: "Learn asynchronous execution, tasks, channels, and JSON serialization.",
        topics: ["Tokio Runtime", "Futures & Tasks", "Serde JSON", "Tracing & Logging"],
      },
      {
        step: 3,
        title: "High-Performance APIs with Axum",
        description: "Build typed web services, extractors, state sharing, and middleware.",
        topics: ["Axum Routing", "Extractors (Path, Query, Json)", "State Sharing (Arc)", "Tower Middleware"],
      },
      {
        step: 4,
        title: "Database Access with SQLx & Security",
        description: "Execute compile-time checked SQL queries with SQLx and deploy minimal Docker containers.",
        topics: ["SQLx (Compile-Time Checked SQL)", "Connection Pooling", "JWT Authentication", "Scratch Docker Containers"],
      },
    ],
  },
  {
    id: "ruby",
    name: "Ruby",
    slug: "ruby",
    tagline: "Developer happiness and rapid startup MVP development with Rails",
    description:
      "Ruby is designed for developer productivity and happiness. Paired with Ruby on Rails, it invented the modern convention-over-configuration paradigm that powered GitHub, Shopify, Airbnb, and Stripe.",
    icon: "Gem",
    color: "red",
    difficulty: "beginner",
    level: "Beginner to Intermediate",
    primaryFrameworks: ["Ruby on Rails", "Sinatra", "Hanami"],
    useCases: ["Startup MVPs", "SaaS Platforms", "Rapid Prototyping", "E-commerce APIs"],
    learningPath: "backend-ruby",
    order: 9,
    runtimeOrCompiler: "YARV (Yet Another Ruby VM) / Puma Web Server",
    typing: "Dynamic (Duck Typing)",
    concurrencyModel: "Multi-threaded (Puma) with Ractor / Fibers",
    memoryManagement: "Generational Garbage Collector with Compaction",
    sampleCode: `class Api::HealthController < ApplicationController
  def show
    render json: {
      status: 'operational',
      framework: 'Ruby on Rails',
      timestamp: Time.current.iso8601
    }
  end
end`,
    strengths: [
      "Unrivaled speed for prototyping and shipping production-ready web products",
      "Extremely rich ecosystem of Gems for authentication, billing, and admin panels",
      "ActiveRecord ORM provides the gold standard for intuitive data queries",
    ],
    limitations: [
      "Higher raw execution overhead compared to compiled languages",
      "Scalability requires architectural discipline in caching and database index design",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "Ruby Syntax & Object-Oriented Elegance",
        description: "Master blocks, procs, lambdas, metaprogramming, and Bundler.",
        topics: ["Blocks & Yield", "Modules & Mixins", "Enumerable Methods", "Metaprogramming", "Bundler"],
      },
      {
        step: 2,
        title: "Rails API Mode & Routing",
        description: "Build RESTful APIs with Rails routing, strong parameters, and serializers.",
        topics: ["Rails API Mode", "Resourceful Routing", "Strong Parameters", "ActiveModelSerializers"],
      },
      {
        step: 3,
        title: "ActiveRecord Mastery & Database Optimization",
        description: "Master associations, callbacks, database scopes, and query performance.",
        topics: ["Associations (1:N, M:N)", "Scopes & Callbacks", "Eager Loading (includes)", "PostgreSQL Migrations"],
      },
      {
        step: 4,
        title: "Sidekiq Background Jobs & Token Authentication",
        description: "Implement JWT auth, background queues with Sidekiq and Redis, and RSpec testing.",
        topics: ["Devise / JWT Auth", "Sidekiq & Redis Jobs", "RSpec API Testing", "Docker & Puma Config"],
      },
    ],
  },
  {
    id: "kotlin",
    name: "Kotlin",
    slug: "kotlin",
    tagline: "Modern, concise, and asynchronous backend development on the JVM",
    description:
      "Kotlin combines modern language ergonomics, null safety, and first-class Coroutines with full interoperability with the JVM ecosystem. It is the premier modern alternative to Java for Spring Boot and Ktor services.",
    icon: "Compass",
    color: "pink",
    difficulty: "intermediate",
    level: "Beginner to Advanced",
    primaryFrameworks: ["Ktor", "Spring Boot (Kotlin)", "Micronaut", "Quarkus"],
    useCases: ["Modern JVM Microservices", "Lightweight Asynchronous APIs", "Android Backend Services", "Multiplatform Systems"],
    learningPath: "backend-kotlin",
    order: 10,
    runtimeOrCompiler: "Kotlin Compiler (kotlinc) targeting JVM Bytecode",
    typing: "Static (Strong with Null Safety)",
    concurrencyModel: "Kotlin Coroutines (Structured Concurrency with Suspended Functions)",
    memoryManagement: "JVM Generational Garbage Collector (G1GC, ZGC)",
    sampleCode: `import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.serialization.Serializable

@Serializable
data class HealthStatus(val status: String, val language: String)

fun main() {
    embeddedServer(Netty, port = 5000) {
        routing {
            get("/api/health") {
                call.respond(HealthStatus(status = "online", language = "Kotlin"))
            }
        }
    }.start(wait = true)
}`,
    strengths: [
      "Eliminates NullPointerExceptions at compile-time with native nullability types",
      "Coroutines provide non-blocking asynchronous code with synchronous readability",
      "100% interoperable with all existing Java enterprise libraries and Spring ecosystems",
    ],
    limitations: [
      "Slightly smaller community compared to core Java and JavaScript",
      "Build times can be slower with heavy annotation processors and kapt",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "Kotlin Language & Coroutines Fundamentals",
        description: "Master null safety, data classes, extension functions, and Coroutine dispatchers.",
        topics: ["Null Safety", "Data Classes & Sealed Interfaces", "Extension Functions", "Coroutines & Suspended Functions", "Flow API"],
      },
      {
        step: 2,
        title: "Asynchronous Web Services with Ktor",
        description: "Build lightweight, modular REST APIs with Ktor routing and content negotiation.",
        topics: ["Ktor Routing", "Content Negotiation (kotlinx.serialization)", "StatusPages Error Handling", "Authentication Plugins"],
      },
      {
        step: 3,
        title: "Spring Boot with Kotlin",
        description: "Use Spring Boot with Kotlin idioms, Coroutine repositories, and Spring Security.",
        topics: ["Spring Boot Kotlin DSL", "Spring Data R2DBC (Reactive SQL)", "Spring Security", "Flyway"],
      },
      {
        step: 4,
        title: "Testing, Containerization & Microservices",
        description: "Write tests with MockK, Kotest, and package native JVM Docker images.",
        topics: ["MockK & Kotest", "Testcontainers", "Gradle Build Optimization", "Docker Deployment"],
      },
    ],
  },
  {
    id: "elixir",
    name: "Elixir / Erlang",
    slug: "elixir",
    tagline: "Massive concurrency, extreme fault tolerance, and real-time messaging",
    description:
      "Running on the battle-tested Erlang BEAM virtual machine, Elixir powers high-concurrency systems handling millions of concurrent connections with sub-millisecond response times and self-healing supervision trees.",
    icon: "Activity",
    color: "fuchsia",
    difficulty: "intermediate",
    level: "Intermediate to Advanced",
    primaryFrameworks: ["Phoenix Framework", "Plug", "Absinthe (GraphQL)", "Broadway"],
    useCases: ["Telecom & Messaging", "Real-Time Collaborative Apps", "High-Concurrency IoT", "Live Streaming Backends"],
    learningPath: "backend-elixir",
    order: 11,
    runtimeOrCompiler: "Erlang BEAM Virtual Machine (OTP)",
    typing: "Dynamic (Strong with Pattern Matching & Type Specs)",
    concurrencyModel: "Actor Model (Isolated BEAM Processes communicating via Messages)",
    memoryManagement: "Per-Process Isolated Garbage Collection (No Global Stop-the-World)",
    sampleCode: `defmodule BackendAcademyWeb.HealthController do
  use BackendAcademyWeb, :controller

  def check(conn, _params) do
    json(conn, %{
      status: "online",
      vm: "Erlang BEAM",
      concurrency: "Actor Model"
    })
  end
end`,
    strengths: [
      "Actor model allows millions of concurrent lightweight processes running simultaneously",
      "Per-process garbage collection eliminates global application latency spikes",
      "Supervision trees provide automatic fault-recovery ('Let It Crash' philosophy)",
    ],
    limitations: [
      "Pure functional programming paradigm requires a shift from object-oriented patterns",
      "Not designed for raw CPU-intensive mathematical number crunching",
    ],
    roadmapSteps: [
      {
        step: 1,
        title: "Functional Programming & Pattern Matching",
        description: "Master immutability, pattern matching, recursion, pipe operator (|>), and Mix.",
        topics: ["Pattern Matching", "Pipe Operator", "Recursion & Enums", "Mix Tooling", "Modules & Structs"],
      },
      {
        step: 2,
        title: "BEAM Concurrency, Processes & OTP",
        description: "Master GenServer, Agents, Tasks, and Supervision Trees for fault recovery.",
        topics: ["BEAM Processes", "Message Passing", "GenServer", "Supervision Trees", "Application Lifecycle"],
      },
      {
        step: 3,
        title: "Phoenix Framework & Real-Time Channels",
        description: "Build robust REST APIs, WebSockets, and database persistence with Ecto.",
        topics: ["Phoenix Router & Controllers", "Ecto Schemas & Changesets", "PostgreSQL Queries", "Phoenix Channels"],
      },
      {
        step: 4,
        title: "Production Telemetry & Distributed Nodes",
        description: "Monitor BEAM performance with Telemetry, cluster nodes, and deploy releases.",
        topics: ["Erlang Clustering", "Telemetry & LiveDashboard", "Mix Release", "Docker & ExUnit Testing"],
      },
    ],
  },
];

export function getBackendLanguage(slug: string): BackendLanguage | undefined {
  return BACKEND_LANGUAGES.find((lang) => lang.slug === slug || lang.id === slug);
}
