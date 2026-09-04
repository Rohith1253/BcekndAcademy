export interface MultiLanguageLessonDefinition {
  slug: string;
  title: string;
  courseSlug: string;
  moduleSlug: string;
  moduleName: string;
  order: number;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  duration: number;
  summary: string;
  description: string;
  learningPoints: string[];
  content: Array<{
    type: "text" | "code" | "callout" | "diagram" | "exercise";
    title?: string;
    body?: string;
    language?: string;
    code?: string;
    caption?: string;
    variant?: "info" | "warning" | "success" | "tip";
  }>;
  quiz?: Array<{
    id: string;
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation?: string;
  }>;
}

export const MULTI_LANGUAGE_LESSONS: MultiLanguageLessonDefinition[] = [
  // ==================== PYTHON FUNDAMENTALS ====================
  {
    slug: "py-syntax-type-hints",
    title: "Python 3 Syntax, Strong Types & Type Hints",
    courseSlug: "python-backend-fundamentals",
    moduleSlug: "py-core-foundations",
    moduleName: "Python Core Server Architecture",
    order: 1,
    category: "Python",
    difficulty: "beginner",
    xpReward: 100,
    duration: 12,
    summary: "Master modern Python 3.11+ type annotations, Union syntax, and strict typing for backend services.",
    description: "Learn how modern Python type hints enable static analysis, IDE autocompletion, and runtime schema validation.",
    learningPoints: [
      "Understand modern Python type annotations (int, str, list[str], dict[str, Any])",
      "Use PEP 604 pipe union syntax (str | None instead of Optional[str])",
      "Apply TypedDict and Generic types for structured server data dictionaries",
    ],
    content: [
      {
        type: "text",
        title: "Why Type Annotations Matter in Backend Python",
        body: "Python is dynamically typed at runtime, but modern backend frameworks like FastAPI and Pydantic use type hints at startup to generate OpenAPI schemas, validate incoming JSON payloads, and deserialize database results automatically.",
      },
      {
        type: "code",
        title: "Modern Python Type Hints Example",
        language: "python",
        code: `from typing import TypeVar, Generic
from dataclasses import dataclass

T = TypeVar('T')

@dataclass
class APIResponse(Generic[T]):
    success: bool
    data: T | None
    error: str | None = None

def get_user_profile(user_id: int) -> APIResponse[dict[str, str]]:
    if user_id <= 0:
        return APIResponse(success=False, data=None, error="Invalid user ID")
    return APIResponse(success=True, data={"id": str(user_id), "name": "Elena Rostova"})`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "Common Mistake",
        body: "Avoid using raw un-parameterized 'list' or 'dict'. Always specify element types such as 'list[int]' or 'dict[str, Any]' to enable full type checker verification with Mypy.",
      },
    ],
    quiz: [
      {
        id: "py-th-1",
        question: "Which syntax represents an optional string in modern Python 3.10+?",
        options: ["str | None", "Optional<string>", "string?", "maybe(str)"],
        correctOptionIndex: 0,
        explanation: "Python 3.10 introduced PEP 604 union syntax allowing 'str | None' without importing Optional from typing.",
      },
    ],
  },
  {
    slug: "py-asyncio-event-loop",
    title: "Asyncio Event Loop & Asynchronous Server Flow",
    courseSlug: "python-backend-fundamentals",
    moduleSlug: "py-core-foundations",
    moduleName: "Python Core Server Architecture",
    order: 2,
    category: "Python",
    difficulty: "beginner",
    xpReward: 120,
    duration: 15,
    summary: "Understand Python's asyncio cooperative multitasking model, coroutines, and task gathering.",
    description: "Learn how non-blocking async/await enables Python backends to handle thousands of concurrent I/O operations.",
    learningPoints: [
      "Distinguish between synchronous blocking calls and async coroutines",
      "Execute multiple independent network operations concurrently using asyncio.gather",
      "Avoid blocking the single-threaded asyncio event loop with CPU-heavy tasks",
    ],
    content: [
      {
        type: "text",
        title: "The Asyncio Cooperative Concurrency Model",
        body: "Unlike OS threads which are preemptively scheduled by the operating system, asyncio uses cooperative multitasking. When a coroutine executes 'await', it yields control back to the event loop, allowing other tasks to progress while waiting for network or disk I/O.",
      },
      {
        type: "code",
        title: "Concurrent Task Execution with asyncio.gather",
        language: "python",
        code: `import asyncio
import time

async def fetch_user_data(user_id: int) -> dict:
    await asyncio.sleep(0.05)  # Simulates async database read
    return {"user_id": user_id, "plan": "pro"}

async def fetch_billing_status(user_id: int) -> dict:
    await asyncio.sleep(0.05)  # Simulates async payment gateway
    return {"status": "paid", "balance": 0.00}

async def get_dashboard(user_id: int):
    # Both I/O calls execute concurrently in ~0.05s total instead of 0.10s
    user, billing = await asyncio.gather(
        fetch_user_data(user_id),
        fetch_billing_status(user_id)
    )
    return {"user": user, "billing": billing}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Critical Pitfall: Blocking the Event Loop",
        body: "Never call time.sleep() or synchronous requests.get() inside an async def function. Use asyncio.sleep() or async HTTP clients like httpx.AsyncClient.",
      },
    ],
    quiz: [
      {
        id: "py-async-1",
        question: "What happens if you execute synchronous time.sleep(5) inside an async FastAPI route?",
        options: [
          "It blocks the entire event loop, freezing all other incoming requests for 5 seconds",
          "FastAPI automatically converts it to a background thread",
          "The request terminates immediately with a timeout",
          "Nothing, Python runs it in parallel automatically",
        ],
        correctOptionIndex: 0,
        explanation: "Synchronous blocking calls hold the thread and freeze the entire asyncio event loop for all concurrent requests on that worker process.",
      },
    ],
  },
  {
    slug: "py-dataclasses-pydantic",
    title: "Data Modeling with Pydantic & Data Classes",
    courseSlug: "python-backend-fundamentals",
    moduleSlug: "py-core-foundations",
    moduleName: "Python Core Server Architecture",
    order: 3,
    category: "Python",
    difficulty: "beginner",
    xpReward: 110,
    duration: 14,
    summary: "Enforce strict schema contracts and data validation with Pydantic V2 BaseModel.",
    description: "Learn how Pydantic validates, coerces, and serializes server inputs and outputs with high-speed Rust-powered internals.",
    learningPoints: [
      "Define validated request and response models with Pydantic BaseModel",
      "Implement custom field validators and field constraints (gt, le, regex)",
      "Serialize models to JSON and dict structures with model_dump() and model_dump_json()",
    ],
    content: [
      {
        type: "text",
        title: "Pydantic V2 Validation Engine",
        body: "Pydantic V2 is written in Rust (pydantic-core) and provides blazing-fast data parsing and validation. It guarantees that data entering your controllers matches your exact schema specifications.",
      },
      {
        type: "code",
        title: "Pydantic Schema with Custom Field Validation",
        language: "python",
        code: `from pydantic import BaseModel, EmailStr, Field, field_validator

class CreateProductDTO(BaseModel):
    title: str = Field(min_length=3, max_length=100)
    price_cents: int = Field(gt=0, description="Price in USD cents")
    sku: str = Field(pattern=r"^[A-Z]{3}-[0-9]{4}$")
    tags: list[str] = []

    @field_validator('sku')
    @classmethod
    def validate_sku_format(cls, v: str) -> str:
        return v.upper()`,
      },
    ],
    quiz: [
      {
        id: "py-pyd-1",
        question: "Which method exports a Pydantic V2 model to a Python dictionary?",
        options: ["model.model_dump()", "model.to_dict()", "model.dict_export()", "model.json_to_obj()"],
        correctOptionIndex: 0,
        explanation: "Pydantic V2 standardized on model_dump() for dictionary conversion and model_dump_json() for JSON serialization.",
      },
    ],
  },

  // ==================== FASTAPI APIS ====================
  {
    slug: "fastapi-routing-parameters",
    title: "FastAPI Routing, Path & Query Validation",
    courseSlug: "fastapi-modern-apis",
    moduleSlug: "fastapi-core",
    moduleName: "FastAPI Service Engineering",
    order: 1,
    category: "Framework",
    difficulty: "beginner",
    xpReward: 120,
    duration: 15,
    summary: "Build clean, typed API endpoints with FastAPI APIRouter, path parameters, and query filtering.",
    description: "Master FastAPI request parsing, HTTP status codes, and automatic Swagger OpenAPI documentation.",
    learningPoints: [
      "Structure multi-file API routes with APIRouter",
      "Validate path parameters and query strings with Path() and Query()",
      "Return standardized HTTP status codes and responses",
    ],
    content: [
      {
        type: "text",
        title: "FastAPI Routing and APIRouter Modularity",
        body: "FastAPI builds on Starlette for high-speed ASGI routing. By organizing endpoints into modular APIRouters with prefixes and tags, you create clean, maintainable microservice architectures.",
      },
      {
        type: "code",
        title: "Modular FastAPI Router Example",
        language: "python",
        code: `from fastapi import APIRouter, Path, Query, status
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/orders", tags=["Orders"])

class OrderResponse(BaseModel):
    id: int
    status: str
    total: float

@router.get("/{order_id}", response_model=OrderResponse, status_code=status.HTTP_200_OK)
async def get_order(
    order_id: int = Path(..., gt=0, description="The positive order ID"),
    include_details: bool = Query(default=False, description="Include line items")
):
    return {"id": order_id, "status": "completed", "total": 149.99}`,
      },
    ],
    quiz: [
      {
        id: "fastapi-1",
        question: "Where does FastAPI automatically serve interactive Swagger UI documentation by default?",
        options: ["/docs", "/swagger", "/api/v1/help", "/api-explorer"],
        correctOptionIndex: 0,
        explanation: "FastAPI automatically hosts interactive Swagger UI at /docs and ReDoc at /redoc based on OpenAPI schemas.",
      },
    ],
  },
  {
    slug: "fastapi-dependency-injection",
    title: "FastAPI Dependency Injection Architecture",
    courseSlug: "fastapi-modern-apis",
    moduleSlug: "fastapi-core",
    moduleName: "FastAPI Service Engineering",
    order: 2,
    category: "Framework",
    difficulty: "intermediate",
    xpReward: 140,
    duration: 16,
    summary: "Master FastAPI's Depends() system for database sessions, authentication, and service isolation.",
    description: "Learn how FastAPI resolves dependencies hierarchically, manages resource cleanup with yield, and enforces security guards.",
    learningPoints: [
      "Inject database sessions safely into route handlers",
      "Use yield in dependencies for automatic connection cleanup and rollback",
      "Compose reusable authentication and role authorization dependencies",
    ],
    content: [
      {
        type: "text",
        title: "Hierarchical Dependency Injection with Depends",
        body: "Dependency Injection in FastAPI allows shared logic (such as extracting JWT tokens or acquiring database transactions) to be declared declaratively in route signatures without polluting controller business logic.",
      },
      {
        type: "code",
        title: "Database Session & Auth Dependency Example",
        language: "python",
        code: `from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_db_session():
    session = AsyncDatabaseSession()
    try:
        yield session
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()

async def require_current_user(creds: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = creds.credentials
    if token != "valid-dev-token":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return {"user_id": 42, "role": "admin"}`,
      },
    ],
    quiz: [
      {
        id: "fastapi-dep-1",
        question: "How do you ensure a database session is always closed after a FastAPI request finishes?",
        options: [
          "Use 'yield session' inside a dependency with a finally block",
          "Manually call session.close() at the end of every route handler",
          "Rely on garbage collection to close the socket connection",
          "FastAPI closes all global variables automatically",
        ],
        correctOptionIndex: 0,
        explanation: "Dependencies with 'yield' execute the teardown code (after yield) when the HTTP response has finished sending, guaranteeing resource cleanup.",
      },
    ],
  },
  {
    slug: "fastapi-sqlalchemy-async",
    title: "Async Database Engineering with SQLAlchemy 2.0",
    courseSlug: "fastapi-modern-apis",
    moduleSlug: "fastapi-core",
    moduleName: "FastAPI Service Engineering",
    order: 3,
    category: "Framework",
    difficulty: "intermediate",
    xpReward: 150,
    duration: 18,
    summary: "Build production async relational databases with SQLAlchemy 2.0 mapped columns and asyncpg.",
    description: "Master DeclarativeBase, Mapped types, relationship loading strategies, and connection pooling for PostgreSQL.",
    learningPoints: [
      "Define type-safe database models using SQLAlchemy 2.0 Mapped syntax",
      "Execute asynchronous select queries with scalars() and execute()",
      "Avoid N+1 query bottlenecks with selectinload and joinedload",
    ],
    content: [
      {
        type: "text",
        title: "Modern SQLAlchemy 2.0 Async Paradigm",
        body: "SQLAlchemy 2.0 provides first-class asyncio support using drivers like asyncpg. It separates connection engine creation, session factory management, and typed query execution into explicit, predictable layers.",
      },
      {
        type: "code",
        title: "SQLAlchemy 2.0 Model & Async Query Example",
        language: "python",
        code: `from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import select, String, ForeignKey
from sqlalchemy.ext.asyncio import AsyncSession

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    is_active: Mapped[bool] = mapped_column(default=True)

async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()`,
      },
    ],
    quiz: [
      {
        id: "fastapi-sql-1",
        question: "Which SQLAlchemy method returns a single model instance or None if not found?",
        options: ["result.scalar_one_or_none()", "result.first_or_fail()", "result.get_single()", "result.one()"],
        correctOptionIndex: 0,
        explanation: "result.scalar_one_or_none() returns the single mapped object if matched, None if 0 matches, and raises an exception if multiple matches occur.",
      },
    ],
  },

  // ==================== GO CONCURRENCY & GIN ====================
  {
    slug: "go-goroutines-channels",
    title: "Goroutines, Channels & Communicating Sequential Processes (CSP)",
    courseSlug: "go-backend-fundamentals",
    moduleSlug: "go-core",
    moduleName: "Go Language & Concurrency Engine",
    order: 1,
    category: "Go",
    difficulty: "beginner",
    xpReward: 120,
    duration: 15,
    summary: "Master Go's ~2KB goroutines, buffered channels, select multiplexing, and race condition prevention.",
    description: "Learn how Go achieves massive concurrency using the M:N scheduler and channel communication instead of shared memory locks.",
    learningPoints: [
      "Spawn lightweight goroutines using the 'go' keyword",
      "Coordinate asynchronous data exchange with buffered and unbuffered channels",
      "Multiplex channel operations with the select statement and context cancellation",
    ],
    content: [
      {
        type: "text",
        title: "Do Not Communicate by Sharing Memory; Share Memory by Communicating",
        body: "Go's concurrency model is based on Hoare's Communicating Sequential Processes (CSP). Goroutines are user-space threads multiplexed onto OS threads by the Go runtime, consuming only ~2KB initial stack space that grows and shrinks dynamically.",
      },
      {
        type: "code",
        title: "Channel Pipeline & Select Multiplexing Example",
        language: "go",
        code: `package main

import (
	"context"
	"fmt"
	"time"
)

func worker(ctx context.Context, id int, jobs <-chan int, results chan<- int) {
	for {
		select {
		case <-ctx.Done():
			return
		case job, ok := <-jobs:
			if !ok {
				return
			}
			// Process job
			results <- job * 2
		}
	}
}`,
      },
    ],
    quiz: [
      {
        id: "go-conc-1",
        question: "What is the initial stack size of a Goroutine in Go?",
        options: ["Approximately 2 KB", "1 MB", "64 KB", "4 MB"],
        correctOptionIndex: 0,
        explanation: "Goroutines start with an initial stack size of only ~2KB, allowing millions of concurrent routines on a single machine.",
      },
    ],
  },
  {
    slug: "go-gin-rest-apis",
    title: "High-Throughput Web Services with Gin",
    courseSlug: "gin-high-performance-apis",
    moduleSlug: "gin-core",
    moduleName: "Production Go REST APIs",
    order: 1,
    category: "Framework",
    difficulty: "intermediate",
    xpReward: 130,
    duration: 16,
    summary: "Build fast HTTP services with Gin routing, custom middleware, JSON binding, and error handling.",
    description: "Learn how Gin's radix tree router delivers sub-microsecond routing performance with zero memory allocations.",
    learningPoints: [
      "Initialize and configure the Gin engine and router groups",
      "Validate incoming JSON payloads with ShouldBindJSON and validator tags",
      "Write custom logging, authentication, and recovery middleware",
    ],
    content: [
      {
        type: "text",
        title: "Gin Radix Tree Router Architecture",
        body: "Gin utilizes a customized radix tree router that achieves zero allocation request dispatching. It handles path parameters, wildcards, and middleware chaining with industry-leading throughput.",
      },
      {
        type: "code",
        title: "Gin REST Controller with Struct Validation",
        language: "go",
        code: `package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type CreateUserRequest struct {
	Name  string \`json:"name" binding:"required,min=2"\`
	Email string \`json:"email" binding:"required,email"\`
}

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")
	{
		api.POST("/users", func(c *gin.Context) {
			var req CreateUserRequest
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusCreated, gin.H{"status": "created", "email": req.Email})
		})
	}
}`,
      },
    ],
    quiz: [
      {
        id: "go-gin-1",
        question: "Which Gin method binds and validates a JSON request body without crashing the handler on error?",
        options: ["c.ShouldBindJSON(&struct)", "c.BindJSON(&struct)", "c.ParseJSON(&struct)", "c.ReadBody(&struct)"],
        correctOptionIndex: 0,
        explanation: "ShouldBindJSON returns an error for the caller to handle, unlike BindJSON which automatically writes a 400 Bad Request if validation fails.",
      },
    ],
  },

  // ==================== JAVA & SPRING BOOT ====================
  {
    slug: "java-virtual-threads",
    title: "Java 21 Virtual Threads & Concurrency (Project Loom)",
    courseSlug: "java-backend-fundamentals",
    moduleSlug: "java-core",
    moduleName: "Modern Java & JVM Concurrency",
    order: 1,
    category: "Java",
    difficulty: "beginner",
    xpReward: 120,
    duration: 15,
    summary: "Master Virtual Threads in Java 21 to achieve lightweight thread-per-request concurrency.",
    description: "Learn how Project Loom eliminates reactive callback complexity by allowing millions of synchronous blocking threads on the JVM.",
    learningPoints: [
      "Understand the difference between platform (OS) threads and virtual (carrier) threads",
      "Create virtual thread executors with Executors.newVirtualThreadPerTaskExecutor()",
      "Avoid thread pinning by replacing synchronized blocks with ReentrantLock",
    ],
    content: [
      {
        type: "text",
        title: "Project Loom: Million-Thread Scalability",
        body: "Prior to Java 21, every Java Thread was mapped 1:1 to an operating system thread, limiting server concurrency to a few thousand threads. Virtual Threads are lightweight JVM-managed threads that unmount from OS carrier threads during blocking I/O operations.",
      },
      {
        type: "code",
        title: "Virtual Thread Executor in Java 21",
        language: "java",
        code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.Executors;

public class VirtualThreadServer {
    public static void main(String[] args) throws Exception {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 10_000; i++) {
                final int taskId = i;
                executor.submit(() -> {
                    // Blocking HTTP call unmounts the virtual thread without blocking the OS thread
                    System.out.println("Processing task " + taskId + " on " + Thread.currentThread());
                });
            }
        } // Auto-closes and awaits all virtual tasks
    }
}`,
      },
    ],
    quiz: [
      {
        id: "java-loom-1",
        question: "What happens when a Java 21 Virtual Thread encounters a blocking I/O operation?",
        options: [
          "The JVM unmounts the virtual thread from its OS carrier thread so other tasks can run",
          "The entire OS thread is blocked until I/O finishes",
          "The task throws an IllegalThreadStateException",
          "The JVM terminates the connection",
        ],
        correctOptionIndex: 0,
        explanation: "Virtual threads unmount from their carrier OS thread during blocking I/O (like network or disk reads), freeing the underlying OS thread for other virtual tasks.",
      },
    ],
  },
  {
    slug: "spring-boot-rest-controllers",
    title: "Spring Boot 3 REST Controllers & Dependency Injection",
    courseSlug: "spring-boot-microservices",
    moduleSlug: "spring-core",
    moduleName: "Spring Boot Microservice Engineering",
    order: 1,
    category: "Framework",
    difficulty: "intermediate",
    xpReward: 140,
    duration: 18,
    summary: "Architect enterprise REST services with Spring Boot @RestController, @Service, and IoC container injection.",
    description: "Master Spring Boot dependency injection, request validation with Jakarta Validation, and standardized error responses.",
    learningPoints: [
      "Build RESTful controllers with @GetMapping, @PostMapping, and @RequestBody",
      "Inject service and repository beans using constructor injection",
      "Handle exceptions globally using @RestControllerAdvice and ProblemDetail",
    ],
    content: [
      {
        type: "text",
        title: "Spring Inversion of Control & Controller Design",
        body: "Spring Boot's IoC container manages bean lifecycles and provides loose coupling through constructor dependency injection. Combined with Spring MVC, it provides enterprise-grade routing, content negotiation, and security filters.",
      },
      {
        type: "code",
        title: "Spring Boot 3 REST Controller & Service Example",
        language: "java",
        code: `package com.backendacademy.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;

    // Preferred: Constructor Dependency Injection
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        CustomerDTO created = customerService.registerCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}`,
      },
    ],
    quiz: [
      {
        id: "spring-1",
        question: "What is the recommended method of dependency injection in modern Spring Boot?",
        options: [
          "Constructor injection (declaring dependencies in the class constructor)",
          "Field injection with @Autowired on private fields",
          "Setter injection on public methods",
          "Manual instantiation with the 'new' keyword inside methods",
        ],
        correctOptionIndex: 0,
        explanation: "Constructor injection allows immutable final fields, ensures dependencies are ready upon instantiation, and makes unit testing simple without Spring contexts.",
      },
    ],
  },

  // ==================== C# (.NET) ====================
  {
    slug: "csharp-minimal-apis",
    title: "High-Performance Minimal APIs in ASP.NET Core",
    courseSlug: "aspnet-core-web-apis",
    moduleSlug: "dotnet-core",
    moduleName: "ASP.NET Core Web Engineering",
    order: 1,
    category: "Framework",
    difficulty: "intermediate",
    xpReward: 130,
    duration: 16,
    summary: "Build ultra-fast, lightweight HTTP endpoints in .NET with Minimal APIs, endpoint filters, and OpenAPI.",
    description: "Learn how Minimal APIs eliminate controller boilerplate while achieving world-class request throughput on Kestrel.",
    learningPoints: [
      "Configure the ASP.NET Core WebApplication host and middleware pipeline",
      "Map typed HTTP endpoints with MapGet, MapPost, and TypedResults",
      "Apply cross-cutting validation filters with EndpointFilter",
    ],
    content: [
      {
        type: "text",
        title: "Minimal APIs in .NET 8/9",
        body: "Minimal APIs in ASP.NET Core provide a direct, low-overhead way to build HTTP APIs using lambda expressions and direct dependency injection, yielding near-zero allocation routing on the Kestrel web server.",
      },
      {
        type: "code",
        title: "ASP.NET Core Minimal API Example",
        language: "csharp",
        code: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapGet("/api/v1/health", () => TypedResults.Ok(new {
    Status = "Healthy",
    Runtime = ".NET 8 CLR",
    Timestamp = DateTime.UtcNow
}));

app.MapPost("/api/v1/orders", async (CreateOrderDTO dto, OrderService service) => {
    var order = await service.CreateAsync(dto);
    return TypedResults.Created($"/api/v1/orders/{order.Id}", order);
});

app.Run();`,
      },
    ],
    quiz: [
      {
        id: "csharp-1",
        question: "What is the high-performance, cross-platform web server included with ASP.NET Core?",
        options: ["Kestrel", "IIS Express", "Tomcat", "Puma"],
        correctOptionIndex: 0,
        explanation: "Kestrel is ASP.NET Core's event-driven, asynchronous I/O web server that delivers benchmark-leading throughput on Linux and Windows.",
      },
    ],
  },

  // ==================== RUST & AXUM ====================
  {
    slug: "rust-ownership-borrowing",
    title: "Rust Ownership, Borrowing & Compile-Time Memory Safety",
    courseSlug: "rust-backend-fundamentals",
    moduleSlug: "rust-core",
    moduleName: "Rust Systems & Memory Architecture",
    order: 1,
    category: "Rust",
    difficulty: "intermediate",
    xpReward: 150,
    duration: 20,
    summary: "Master Rust's borrow checker, affine type system, move semantics, and shared vs mutable references.",
    description: "Understand how Rust guarantees memory safety and data-race prevention at compile time with zero garbage collection overhead.",
    learningPoints: [
      "Master the three core rules of Rust Ownership",
      "Differentiate between Move semantics and Copy semantics",
      "Apply the borrow rules: multiple immutable borrows OR exactly one mutable borrow",
    ],
    content: [
      {
        type: "text",
        title: "The Three Laws of Rust Ownership",
        body: "1. Each value in Rust has an owner.\n2. There can only be one owner at a time.\n3. When the owner goes out of scope, the value is dropped (freed from memory) automatically.",
      },
      {
        type: "code",
        title: "Rust Borrowing & Reference Safety Example",
        language: "rust",
        code: `fn calculate_payload_length(payload: &String) -> usize {
    // payload is an immutable reference; the caller retains ownership
    payload.len()
}

fn append_header(buffer: &mut String, header: &str) {
    // buffer is a mutable reference; exclusive write access guaranteed
    buffer.push_str(header);
    buffer.push_str("\\r\\n");
}`,
      },
    ],
    quiz: [
      {
        id: "rust-own-1",
        question: "How many mutable references to a piece of data can exist in a given scope in safe Rust?",
        options: ["Exactly one", "Unlimited", "Up to 8 per thread", "Two"],
        correctOptionIndex: 0,
        explanation: "Rust's borrow checker enforces that you can have either any number of immutable references (&T) OR exactly one mutable reference (&mut T) to prevent data races.",
      },
    ],
  },
  {
    slug: "axum-typed-routing",
    title: "Blazing-Fast Web Services with Axum & Tokio",
    courseSlug: "axum-high-performance-apis",
    moduleSlug: "axum-core",
    moduleName: "High-Performance Rust Web Services",
    order: 1,
    category: "Framework",
    difficulty: "advanced",
    xpReward: 160,
    duration: 22,
    summary: "Build microsecond-latency REST APIs using Axum extractors, state sharing with Arc, and Tokio async runtime.",
    description: "Learn how Axum's type-safe extractor model validates path, query, and JSON payloads at compile time.",
    learningPoints: [
      "Define type-safe routes with Axum Router and routing macros",
      "Extract request parameters safely using Path<T>, Query<T>, and Json<T>",
      "Share database pools and application state across threads using Arc<AppState>",
    ],
    content: [
      {
        type: "text",
        title: "Axum Type-Safe Extractor Paradigm",
        body: "In Axum, handler arguments are 'Extractors'. If an extractor fails to parse (e.g. invalid JSON or missing header), Axum automatically returns an appropriate HTTP error status without ever calling the handler body.",
      },
      {
        type: "code",
        title: "Axum Web Service with Shared State Example",
        language: "rust",
        code: `use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Serialize, Deserialize)]
struct UserResponse {
    id: u64,
    username: String,
}

struct AppState {
    db_pool_name: String,
}

async fn get_user(
    Path(user_id): Path<u64>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<UserResponse>, StatusCode> {
    if user_id == 0 {
        return Err(StatusCode::BAD_REQUEST);
    }
    Ok(Json(UserResponse {
        id: user_id,
        username: format!("User_{}", user_id),
    }))
}`,
      },
    ],
    quiz: [
      {
        id: "axum-1",
        question: "What happens in Axum if a request sends malformed JSON to a handler with a Json<T> argument?",
        options: [
          "Axum automatically rejects the request with HTTP 422 / 400 before executing the handler",
          "The handler receives null and crashes",
          "The server triggers an unhandled panic",
          "Axum converts the malformed JSON to an empty struct",
        ],
        correctOptionIndex: 0,
        explanation: "Axum extractors enforce contract validation before handler invocation, automatically returning 422 Unprocessable Entity on deserialization failure.",
      },
    ],
  },

  // ==================== PHP & LARAVEL ====================
  {
    slug: "php-modern-features",
    title: "PHP 8+ Object-Oriented Architecture & Type Safety",
    courseSlug: "php-backend-fundamentals",
    moduleSlug: "php-core",
    moduleName: "Modern PHP 8 Server Architecture",
    order: 1,
    category: "PHP",
    difficulty: "beginner",
    xpReward: 110,
    duration: 14,
    summary: "Master PHP 8.2+ typed properties, constructor property promotion, match expressions, and enums.",
    description: "Learn how modern PHP delivers clean, expressive, and type-safe server-side code.",
    learningPoints: [
      "Use constructor property promotion to eliminate class boilerplate",
      "Leverage backed Enums for type-safe status and role constants",
      "Apply match expressions for exhaustive pattern matching",
    ],
    content: [
      {
        type: "text",
        title: "Modern PHP 8 Evolution",
        body: "PHP 8.0 through 8.3 introduced significant modernization to the language, including JIT compilation, union types, intersection types, readonly classes, and first-class attributes.",
      },
      {
        type: "code",
        title: "Modern PHP 8.2 Class with Enums and Match",
        language: "php",
        code: `<?php

declare(strict_types=1);

namespace App\\DTO;

enum OrderStatus: string {
    case Pending = 'pending';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
}

final readonly class OrderResponse {
    public function __construct(
        public int $id,
        public float $amount,
        public OrderStatus $status
    ) {}

    public function getStatusLabel(): string {
        return match($this->status) {
            OrderStatus::Pending => 'Awaiting Payment',
            OrderStatus::Paid => 'Order Confirmed',
            OrderStatus::Cancelled => 'Order Voided',
        };
    }
}`,
      },
    ],
    quiz: [
      {
        id: "php-1",
        question: "Which PHP 8 feature allows declaring and assigning class properties directly inside constructor parameters?",
        options: [
          "Constructor Property Promotion",
          "Auto-Properties",
          "Dynamic Properties",
          "Trait Assignment",
        ],
        correctOptionIndex: 0,
        explanation: "Constructor Property Promotion allows visibility keywords (public, private, protected) inside the __construct signature to automatically declare and assign properties.",
      },
    ],
  },
  {
    slug: "laravel-eloquent-api",
    title: "Production REST APIs with Laravel 11 & Eloquent ORM",
    courseSlug: "laravel-web-apis",
    moduleSlug: "laravel-core",
    moduleName: "Laravel API Engineering",
    order: 1,
    category: "Framework",
    difficulty: "intermediate",
    xpReward: 140,
    duration: 16,
    summary: "Build scalable RESTful services with Laravel API resources, Eloquent relationships, and Sanctum token auth.",
    description: "Master database migrations, eager loading to prevent N+1 queries, and FormRequest validation in Laravel.",
    learningPoints: [
      "Structure API controllers and Resource classes for clean JSON transformations",
      "Prevent N+1 query bottlenecks with Eloquent eager loading (with())",
      "Validate incoming requests using dedicated FormRequest classes",
    ],
    content: [
      {
        type: "text",
        title: "Laravel Eloquent ORM & API Resources",
        body: "Eloquent Active Record ORM simplifies complex database relationships. Coupled with API Resource transformations, it ensures database schema internals are never accidentally leaked into API responses.",
      },
      {
        type: "code",
        title: "Laravel Controller & Eloquent Query Example",
        language: "php",
        code: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\StoreArticleRequest;
use App\\Http\\Resources\\ArticleResource;
use App\\Models\\Article;
use Illuminate\\Http\\Resources\\Json\\AnonymousResourceCollection;

class ArticleController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        // Eager load author to prevent N+1 queries
        $articles = Article::with('author')->published()->paginate(20);
        return ArticleResource::collection($articles);
    }
}`,
      },
    ],
    quiz: [
      {
        id: "laravel-1",
        question: "How do you prevent the N+1 query problem when fetching related models in Eloquent?",
        options: [
          "Use eager loading with the with('relationship') method",
          "Disable foreign keys in MySQL",
          "Use lazy loading on every loop iteration",
          "Wrap the query in a DB::transaction()",
        ],
        correctOptionIndex: 0,
        explanation: "Eager loading with with('relation') executes two batched queries (e.g. SELECT * FROM articles; SELECT * FROM authors WHERE id IN (...)) instead of N separate queries inside a loop.",
      },
    ],
  },

  // ==================== RUBY ON RAILS ====================
  {
    slug: "ruby-blocks-enumerable",
    title: "Ruby Object-Oriented Architecture, Blocks & Enumerables",
    courseSlug: "ruby-backend-fundamentals",
    moduleSlug: "ruby-core",
    moduleName: "Ruby Server Architecture",
    order: 1,
    category: "Ruby",
    difficulty: "beginner",
    xpReward: 110,
    duration: 14,
    summary: "Master Ruby blocks, yield, procs, lambdas, and powerful Enumerable functional algorithms.",
    description: "Learn how Ruby's elegant syntax and block architecture enable expressive, human-readable backend code.",
    learningPoints: [
      "Understand block execution and the 'yield' keyword in custom methods",
      "Leverage Enumerable methods: map, select, reject, reduce, and flat_map",
      "Structure reusable domain logic with Modules and Mixins",
    ],
    content: [
      {
        type: "text",
        title: "Ruby's Block & Enumerable Philosophy",
        body: "Ruby treats functions as first-class citizens through blocks, procs, and lambdas. The Enumerable module provides over 50 built-in transformation and traversal algorithms that make data manipulation concise and clean.",
      },
      {
        type: "code",
        title: "Ruby Block & Enumerable Pipeline Example",
        language: "ruby",
        code: `class MetricsCollector
  def self.benchmark(action_name)
    start_time = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    result = yield # Executes the passed block
    duration = (Process.clock_gettime(Process::CLOCK_MONOTONIC) - start_time) * 1000
    puts "[METRIC] #{action_name} executed in #{duration.round(2)}ms"
    result
  end
end

# Usage:
data = MetricsCollector.benchmark("Compute Top Customers") do
  users.select(&:active?).map { |u| { id: u.id, total: u.orders.sum(&:amount) } }
end`,
      },
    ],
    quiz: [
      {
        id: "ruby-1",
        question: "Which keyword is used inside a Ruby method to execute a block passed by the caller?",
        options: ["yield", "call_block", "execute", "invoke"],
        correctOptionIndex: 0,
        explanation: "The 'yield' keyword executes the block passed to the method and returns its evaluated value.",
      },
    ],
  },
  {
    slug: "rails-active-record-apis",
    title: "Rapid REST API Engineering with Ruby on Rails",
    courseSlug: "rails-rapid-api-development",
    moduleSlug: "rails-core",
    moduleName: "Rails API Architecture",
    order: 1,
    category: "Framework",
    difficulty: "intermediate",
    xpReward: 135,
    duration: 16,
    summary: "Build robust REST APIs using Rails API mode, ActiveRecord scopes, migrations, and Sidekiq jobs.",
    description: "Master convention over configuration, database associations, and strong parameter defense in Rails.",
    learningPoints: [
      "Configure Rails in lightweight '--api' mode for backend-only services",
      "Define associations, scopes, and database migrations with ActiveRecord",
      "Defend against mass assignment vulnerabilities with strong parameters",
    ],
    content: [
      {
        type: "text",
        title: "Rails API-Only Architecture",
        body: "Rails API mode strips out asset pipelines and view renderers to provide a lightweight, high-performance JSON API server with ActiveRecord, ActionMailer, and ActiveJob out of the box.",
      },
      {
        type: "code",
        title: "Rails API Controller with Strong Parameters",
        language: "ruby",
        code: `class Api::V1::UsersController < ApplicationController
  def index
    users = User.active.recent.page(params[:page])
    render json: users
  end

  def create
    user = User.new(user_params)
    if user.save
      render json: user, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end`,
      },
    ],
    quiz: [
      {
        id: "rails-1",
        question: "What security mechanism in Rails controllers prevents mass-assignment parameter vulnerabilities?",
        options: ["Strong Parameters (params.require.permit)", "CSRF Tokens", "ActiveRecord Guard", "Rack Sanitizer"],
        correctOptionIndex: 0,
        explanation: "Strong Parameters force developers to explicitly declare which HTTP parameters are permitted for model assignment.",
      },
    ],
  },

  // ==================== KOTLIN & KTOR ====================
  {
    slug: "kotlin-coroutines-flow",
    title: "Kotlin Coroutines & Asynchronous Structured Concurrency",
    courseSlug: "kotlin-backend-fundamentals",
    moduleSlug: "kotlin-core",
    moduleName: "Kotlin JVM Architecture",
    order: 1,
    category: "Kotlin",
    difficulty: "beginner",
    xpReward: 120,
    duration: 15,
    summary: "Master Kotlin Coroutines, suspended functions, CoroutineScope, and asynchronous Flow streams.",
    description: "Learn how Kotlin Coroutines provide non-blocking asynchronous execution with sequential, readable code.",
    learningPoints: [
      "Write non-blocking asynchronous logic using 'suspend' functions",
      "Manage thread pools with Dispatchers.IO, Dispatchers.Default, and Dispatchers.Unconfined",
      "Handle asynchronous streams with cold Kotlin Flows",
    ],
    content: [
      {
        type: "text",
        title: "Structured Concurrency in Kotlin",
        body: "Kotlin Coroutines are computations that can be suspended without blocking the underlying thread. Structured concurrency ensures that if a parent coroutine is cancelled, all child tasks are cancelled automatically, preventing thread leaks.",
      },
      {
        type: "code",
        title: "Kotlin Coroutine & Flow Pipeline Example",
        language: "kotlin",
        code: `import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

suspend fun fetchAccountMetrics(accountId: String): Map<String, Any> = coroutineScope {
    // Run two async calls in parallel within the coroutine scope
    val balanceDeferred = async(Dispatchers.IO) { queryBalance(accountId) }
    val transactionsDeferred = async(Dispatchers.IO) { queryTransactions(accountId) }

    mapOf(
        "balance" to balanceDeferred.await(),
        "transactions" to transactionsDeferred.await()
    )
}`,
      },
    ],
    quiz: [
      {
        id: "kotlin-1",
        question: "Which keyword marks a Kotlin function as non-blocking and capable of pausing execution?",
        options: ["suspend", "async", "coroutine", "defer"],
        correctOptionIndex: 0,
        explanation: "The 'suspend' modifier indicates that a function can pause its execution and resume later without blocking the underlying thread.",
      },
    ],
  },
  {
    slug: "ktor-routing-plugins",
    title: "Lightweight Asynchronous Microservices with Ktor",
    courseSlug: "ktor-cloud-native-apis",
    moduleSlug: "ktor-core",
    moduleName: "Ktor Microservice Engineering",
    order: 1,
    category: "Framework",
    difficulty: "intermediate",
    xpReward: 140,
    duration: 16,
    summary: "Build non-blocking HTTP microservices using Ktor routing DSL, ContentNegotiation, and StatusPages plugins.",
    description: "Learn how Ktor's un-opinionated, lightweight plugin architecture allows minimal-overhead JVM server deployments.",
    learningPoints: [
      "Configure Ktor server routing using Kotlin idiomatic DSLs",
      "Install and configure ContentNegotiation with kotlinx.serialization",
      "Handle exceptions globally using the StatusPages plugin",
    ],
    content: [
      {
        type: "text",
        title: "Ktor Plugin & Routing DSL Architecture",
        body: "Ktor is a 100% asynchronous framework developed by JetBrains. It does not impose heavy container models or reflection; features are installed explicitly as lightweight plugins into the application pipeline.",
      },
      {
        type: "code",
        title: "Ktor REST Server with Routing DSL Example",
        language: "kotlin",
        code: `package com.backendacademy.server

import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.HttpStatusCode
import kotlinx.serialization.Serializable

@Serializable
data class ServerHealth(val status: String, val activeConnections: Int)

fun Application.module() {
    install(ContentNegotiation) {
        json()
    }

    routing {
        get("/api/v1/health") {
            call.respond(HttpStatusCode.OK, ServerHealth(status = "UP", activeConnections = 42))
        }
    }
}`,
      },
    ],
    quiz: [
      {
        id: "ktor-1",
        question: "How are features like JSON serialization and authentication added to a Ktor application?",
        options: [
          "Installed as lightweight plugins using the install() DSL",
          "Configured via XML descriptor files",
          "Auto-scanned using classpath annotations",
          "Imported as global static singletons",
        ],
        correctOptionIndex: 0,
        explanation: "Ktor features (ContentNegotiation, StatusPages, Authentication) are explicitly registered into the server pipeline using the install() DSL function.",
      },
    ],
  },

  // ==================== ELIXIR & PHOENIX ====================
  {
    slug: "elixir-processes-genserver",
    title: "BEAM Concurrency, Processes & OTP GenServer",
    courseSlug: "elixir-backend-fundamentals",
    moduleSlug: "elixir-core",
    moduleName: "Erlang BEAM Concurrency & OTP",
    order: 1,
    category: "Elixir",
    difficulty: "intermediate",
    xpReward: 140,
    duration: 18,
    summary: "Master lightweight BEAM processes, asynchronous message passing, GenServer state machines, and Supervision Trees.",
    description: "Understand the Actor Model where processes hold isolated state, communicate via mailboxes, and recover automatically on error.",
    learningPoints: [
      "Spawn isolated BEAM processes with spawn() and send/receive message passing",
      "Implement stateful client-server abstractions using OTP GenServer",
      "Build self-healing systems with Supervision Trees and restart strategies",
    ],
    content: [
      {
        type: "text",
        title: "The BEAM Virtual Machine & Actor Model",
        body: "On the Erlang BEAM VM, processes are not OS threads. They take only ~300 words of memory to initialize. Each process has its own isolated heap and garbage collector, meaning one crashing process can never corrupt memory in another process.",
      },
      {
        type: "code",
        title: "OTP GenServer Stateful Cache Example",
        language: "elixir",
        code: `defmodule BackendAcademy.CacheServer do
  use GenServer

  # Client API
  def start_link(default_state \\\\ %{}) do
    GenServer.start_link(__MODULE__, default_state, name: __MODULE__)
  end

  def put(key, value) do
    GenServer.cast(__MODULE__, {:put, key, value})
  end

  def get(key) do
    GenServer.call(__MODULE__, {:get, key})
  end

  # Server Callbacks
  @impl true
  def init(state), do: {:ok, state}

  @impl true
  def handle_cast({:put, key, value}, state) do
    {:noreply, Map.put(state, key, value)}
  end

  @impl true
  def handle_call({:get, key}, _from, state) do
    {:reply, Map.get(state, key), state}
  end
end`,
      },
    ],
    quiz: [
      {
        id: "elixir-1",
        question: "What is the primary communication mechanism between concurrent processes in Elixir and Erlang?",
        options: [
          "Asynchronous message passing through process mailboxes",
          "Shared mutable variables protected by mutex locks",
          "Thread-safe static singletons",
          "Direct pointer manipulation",
        ],
        correctOptionIndex: 0,
        explanation: "Processes in Elixir have completely isolated memory heaps and communicate solely by sending immutable asynchronous messages to other processes' mailboxes.",
      },
    ],
  },
  {
    slug: "phoenix-channels-realtime",
    title: "Real-Time Channels & REST APIs with Phoenix Framework",
    courseSlug: "phoenix-realtime-distributed-systems",
    moduleSlug: "phoenix-core",
    moduleName: "Phoenix Real-Time Web Services",
    order: 1,
    category: "Framework",
    difficulty: "intermediate",
    xpReward: 150,
    duration: 20,
    summary: "Build sub-millisecond REST APIs and scale real-time WebSockets to 2 million connections with Phoenix Channels.",
    description: "Learn how Phoenix leverages BEAM clustering, Ecto changesets, and PubSub to deliver unprecedented real-time scale.",
    learningPoints: [
      "Structure Phoenix REST controllers and JSON views",
      "Handle real-time bidirectional WebSocket events with Phoenix Channels",
      "Manage database validations and transactions with Ecto Changesets",
    ],
    content: [
      {
        type: "text",
        title: "Phoenix Framework & Million-WebSocket Scalability",
        body: "Phoenix is famous for handling over 2 million simultaneous active WebSocket connections on a single multi-core server with sub-millisecond broadcast latency. Its built-in Phoenix.PubSub coordinates real-time events across distributed BEAM cluster nodes seamlessly.",
      },
      {
        type: "code",
        title: "Phoenix Real-Time Channel Example",
        language: "elixir",
        code: `defmodule BackendAcademyWeb.RoomChannel do
  use BackendAcademyWeb, :channel

  def join("room:lobby", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    # Broadcast to all connected clients on this topic across the cluster
    broadcast!(socket, "new_msg", %{body: body, timestamp: DateTime.utc_now()})
    {:noreply, socket}
  end
end`,
      },
    ],
    quiz: [
      {
        id: "phoenix-1",
        question: "Which database library and data mapping tool is standard in Phoenix applications?",
        options: ["Ecto", "ActiveRecord", "Hibernate", "Prisma"],
        correctOptionIndex: 0,
        explanation: "Ecto is the standard toolkit for data mapping, schema definition, changesets validation, and database queries in Elixir.",
      },
    ],
  },
];
