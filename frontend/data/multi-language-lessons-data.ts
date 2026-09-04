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
  {
    "slug": "java-spring-boot-architecture",
    "title": "Spring Boot 3 Architecture, IoC & Dependency Injection",
    "courseSlug": "java-backend-fundamentals",
    "moduleSlug": "java-spring-foundations",
    "moduleName": "Spring Boot Enterprise Foundations",
    "order": 1,
    "category": "Java",
    "difficulty": "beginner",
    "xpReward": 120,
    "duration": 18,
    "summary": "Master Spring Boot 3 architecture, Inversion of Control (IoC), and ApplicationContext container lifecycle.",
    "description": "Understand how Spring Framework manages bean lifecycles, configuration injection, and modular enterprise architecture.",
    "learningPoints": [
      "Inversion of Control (IoC) and Dependency Injection (DI) principles",
      "ApplicationContext container, component scanning, and @Configuration beans",
      "Constructor injection vs field injection best practices",
      "Spring Boot 3 auto-configuration and application.yml properties"
    ],
    "content": [
      {
        "type": "text",
        "title": "Introduction & Why IoC Matters in Enterprise Backends",
        "body": "Enterprise backend applications consist of hundreds of interdependent services: repositories, payment gateways, cache managers, and notification dispatchers. Without Inversion of Control, classes tightly instantiate their dependencies, resulting in brittle code that is impossible to unit test. Spring's IoC container centralizes dependency lifecycle and injection."
      },
      {
        "type": "text",
        "title": "Core Concept: ApplicationContext & Constructor Injection",
        "body": "Spring Boot initializes an ApplicationContext at startup. Classes annotated with @Service, @Repository, or @Component are scanned and registered as singleton beans. Modern Spring strictly recommends constructor injection because it ensures immutability and makes unit testing trivial without reflection."
      },
      {
        "type": "code",
        "title": "Production Spring Boot Service with Constructor Injection",
        "language": "java",
        "code": "package com.backend.platform.service;\n\nimport org.springframework.stereotype.Service;\nimport java.util.UUID;\n\npublic interface PaymentGateway {\n    boolean processPayment(String transactionId, double amount);\n}\n\n@Service\npublic class OrderProcessingService {\n\n    private final PaymentGateway paymentGateway;\n    private final NotificationService notificationService;\n\n    // Strict constructor-based dependency injection\n    public OrderProcessingService(PaymentGateway paymentGateway, NotificationService notificationService) {\n        this.paymentGateway = paymentGateway;\n        this.notificationService = notificationService;\n    }\n\n    public OrderResult executeOrder(String userId, double amount) {\n        String txId = UUID.randomUUID().toString();\n        boolean success = paymentGateway.processPayment(txId, amount);\n        \n        if (success) {\n            notificationService.sendReceipt(userId, txId, amount);\n            return new OrderResult(txId, OrderStatus.CONFIRMED);\n        }\n        return new OrderResult(txId, OrderStatus.PAYMENT_FAILED);\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Common Mistake: Field Injection with @Autowired",
        "body": "Avoid using @Autowired directly on private fields. Field injection hides dependencies from constructors, prevents creating immutable (final) fields, and forces tests to rely on slow reflection-based Spring runners rather than fast POJO unit tests."
      },
      {
        "type": "text",
        "title": "Key Takeaways",
        "body": "1. Spring IoC container creates and wires singletons at startup.\\n2. Prefer constructor injection over field injection.\\n3. Use interfaces for high-level business boundaries to facilitate mocking in unit tests."
      }
    ],
    "quiz": [
      {
        "id": "java-sb-1",
        "question": "Why is constructor-based dependency injection preferred over @Autowired field injection in modern Spring Boot?",
        "options": [
          "It enables final immutable fields and simplifies POJO unit testing without Spring context",
          "It automatically compiles Java bytecode to native C++ binaries",
          "It bypasses the JVM garbage collector for faster execution",
          "It is required by the HTTP 1.1 protocol specification"
        ],
        "correctOptionIndex": 0,
        "explanation": "Constructor injection allows dependencies to be marked 'final', guarantees that objects cannot be instantiated in an invalid half-initialized state, and allows easy mocking in unit tests without starting the Spring container."
      }
    ]
  },
  {
    "slug": "java-rest-controllers-dto",
    "title": "REST Controllers, DTOs & Jakarta Bean Validation",
    "courseSlug": "java-backend-fundamentals",
    "moduleSlug": "java-spring-foundations",
    "moduleName": "Spring Boot Enterprise Foundations",
    "order": 2,
    "category": "Java",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Build hardened REST endpoints using @RestController, ResponseEntity, and declarative Jakarta Validation (@Valid).",
    "description": "Learn how to isolate internal domain entities from public APIs using Data Transfer Objects (DTOs) and request validation pipelines.",
    "learningPoints": [
      "Designing clean REST controllers with @RestController and @RequestMapping",
      "Using Java Records for immutable, boilerplate-free DTOs",
      "Applying Jakarta Bean Validation (@NotNull, @Email, @Size, @Pattern)",
      "Global error handling using @RestControllerAdvice and ProblemDetail (RFC 7807)"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why DTOs and Request Validation are Critical",
        "body": "Exposing internal JPA database entities directly in API controllers creates severe security vulnerabilities, such as over-posting attacks and accidental leakage of sensitive fields. Data Transfer Objects (DTOs) decoupled by validation ensure only vetted inputs reach business services."
      },
      {
        "type": "code",
        "title": "Spring Boot REST Controller with Java Record DTO & Validation",
        "language": "java",
        "code": "package com.backend.platform.controller;\n\nimport jakarta.validation.Valid;\nimport jakarta.validation.constraints.Email;\nimport jakarta.validation.constraints.NotBlank;\nimport jakarta.validation.constraints.Positive;\nimport org.springframework.http.HttpStatus;\nimport org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.*;\n\npublic record CreateUserRequest(\n    @NotBlank(message = \"Username cannot be empty\")\n    String username,\n\n    @NotBlank(message = \"Email is required\")\n    @Email(message = \"Invalid email format\")\n    String email,\n\n    @Positive(message = \"Age must be positive\")\n    int age\n) {}\n\npublic record UserResponse(String id, String username, String email) {}\n\n@RestController\n@RequestMapping(\"/api/v1/users\")\npublic class UserController {\n\n    private final UserService userService;\n\n    public UserController(UserService userService) {\n        this.userService = userService;\n    }\n\n    @PostMapping\n    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {\n        UserResponse response = userService.registerUser(request);\n        return ResponseEntity.status(HttpStatus.CREATED).body(response);\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Best Practice: RFC 7807 Problem Details",
        "body": "Spring Boot 3 natively supports RFC 7807 ProblemDetail. Implement a @RestControllerAdvice class that catches MethodArgumentNotValidException and converts validation errors into standard machine-readable JSON error objects."
      }
    ],
    "quiz": [
      {
        "id": "java-dto-1",
        "question": "What is the primary architectural purpose of using DTOs instead of exposing JPA Entities directly in REST controllers?",
        "options": [
          "To prevent over-posting vulnerabilities and decouple API contracts from the database schema",
          "To automatically compress HTTP responses using GZIP",
          "To convert SQL queries into NoSQL MongoDB documents",
          "To speed up JVM garbage collection cycles"
        ],
        "correctOptionIndex": 0,
        "explanation": "DTOs prevent mass-assignment/over-posting attacks, safeguard database internals from direct external modification, and allow API schemas to evolve independently from the underlying database tables."
      }
    ]
  },
  {
    "slug": "java-spring-data-jpa",
    "title": "Spring Data JPA, Hibernate ORM & Transaction Management",
    "courseSlug": "spring-boot-microservices",
    "moduleSlug": "java-spring-data",
    "moduleName": "Data Persistence & Transaction Management",
    "order": 3,
    "category": "Java",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 22,
    "summary": "Master high-performance database persistence with Spring Data JPA, Hibernate ORM, and @Transactional boundaries.",
    "description": "Learn how to write optimized repository queries, prevent N+1 select bottlenecks, and manage ACID transaction isolation.",
    "learningPoints": [
      "Spring Data JpaRepository and custom @Query methods",
      "Managing entity life cycles, detached states, and dirty checking",
      "Preventing the N+1 query problem using JOIN FETCH and EntityGraphs",
      "Understanding @Transactional isolation levels and rollback propagation rules"
    ],
    "content": [
      {
        "type": "text",
        "title": "Understanding JPA Repositories and Hibernate Lifecycle",
        "body": "Spring Data JPA drastically reduces boilerplate by auto-generating CRUD queries from interface signatures. However, naive ORM usage often leads to performance killers like the N+1 query problem. Mastering JOIN FETCH and explicit transaction boundaries is mandatory for production Java backends."
      },
      {
        "type": "code",
        "title": "Optimized Spring Data JPA Repository with JOIN FETCH",
        "language": "java",
        "code": "package com.backend.platform.repository;\n\nimport com.backend.platform.entity.Account;\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.data.jpa.repository.Query;\nimport org.springframework.data.repository.query.Param;\nimport org.springframework.stereotype.Repository;\nimport org.springframework.transaction.annotation.Transactional;\nimport java.util.Optional;\n\n@Repository\npublic interface AccountRepository extends JpaRepository<Account, Long> {\n\n    @Query(\"SELECT a FROM Account a JOIN FETCH a.roles WHERE a.email = :email\")\n    Optional<Account> findByEmailWithRoles(@Param(\"email\") String email);\n\n    @Transactional(readOnly = true)\n    boolean existsByEmail(String email);\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Common Pitfall: Self-Invocation of @Transactional",
        "body": "Spring @Transactional relies on dynamic proxies. If method A calls @Transactional method B within the same class (self-invocation), the proxy is bypassed and no database transaction is opened."
      }
    ],
    "quiz": [
      {
        "id": "java-jpa-1",
        "question": "How does the JPQL 'JOIN FETCH' clause eliminate the notorious N+1 query problem in Hibernate?",
        "options": [
          "It forces Hibernate to retrieve the parent entity and its child relations in a single SQL query",
          "It caches the entire SQL database in Redis memory",
          "It disables foreign key constraints in the database engine",
          "It runs each child query on a separate background thread concurrently"
        ],
        "correctOptionIndex": 0,
        "explanation": "'JOIN FETCH' instructs Hibernate to perform an inner/left join and populate the related collection or entity immediately in the initial SELECT query, avoiding separate queries for each record."
      }
    ]
  },
  {
    "slug": "java-spring-security-jwt",
    "title": "Spring Security 6, JWT Authentication & Role-Based Access",
    "courseSlug": "spring-boot-microservices",
    "moduleSlug": "java-spring-security",
    "moduleName": "Enterprise Security & Identity",
    "order": 4,
    "category": "Java",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 25,
    "summary": "Harden Spring Boot APIs with Spring Security 6, OncePerRequestFilter, JWT validation, and Method-Level Authorization.",
    "description": "Implement a stateless token-based authentication filter pipeline with granular role-based authorization rules.",
    "learningPoints": [
      "Spring Security 6 filter chain architecture and SecurityFilterChain bean definition",
      "Implementing custom OncePerRequestFilter for JWT parsing and verification",
      "Populating the SecurityContextHolder with UsernamePasswordAuthenticationToken",
      "Applying @PreAuthorize and @Secured for role-based endpoint protection"
    ],
    "content": [
      {
        "type": "text",
        "title": "Stateless Security in Modern Microservices",
        "body": "Modern cloud microservices do not use HTTP sessions. Instead, each request carries a cryptographic JSON Web Token (JWT). Spring Security interceptors validate the signature, parse user claims, and populate the thread-local SecurityContext before the request reaches controller endpoints."
      },
      {
        "type": "code",
        "title": "Spring Security 6 SecurityFilterChain Configuration",
        "language": "java",
        "code": "package com.backend.platform.config;\n\nimport com.backend.platform.security.JwtAuthenticationFilter;\nimport org.springframework.context.annotation.Bean;\nimport org.springframework.context.annotation.Configuration;\nimport org.springframework.security.config.annotation.web.builders.HttpSecurity;\nimport org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;\nimport org.springframework.security.config.http.SessionCreationPolicy;\nimport org.springframework.security.web.SecurityFilterChain;\nimport org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;\n\n@Configuration\n@EnableWebSecurity\npublic class SecurityConfig {\n\n    private final JwtAuthenticationFilter jwtAuthFilter;\n\n    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {\n        this.jwtAuthFilter = jwtAuthFilter;\n    }\n\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n        http\n            .csrf(csrf -> csrf.disable())\n            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers(\"/api/v1/auth/**\", \"/actuator/health\").permitAll()\n                .requestMatchers(\"/api/v1/admin/**\").hasRole(\"ADMIN\")\n                .anyRequest().authenticated()\n            )\n            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);\n\n        return http.build();\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Key Takeaway",
        "body": "Always set SessionCreationPolicy.STATELESS in microservice APIs so Spring Security does not waste memory creating HttpSession objects on the server."
      }
    ],
    "quiz": [
      {
        "id": "java-sec-1",
        "question": "Why must SessionCreationPolicy be set to STATELESS in a JWT-secured Spring Boot microservice?",
        "options": [
          "To prevent the server from storing server-side session state and ensure every request is independently verified by token",
          "To disable SSL/TLS encryption for higher throughput",
          "To bypass CORS preflight checks automatically",
          "To allow anonymous users full write access to the database"
        ],
        "correctOptionIndex": 0,
        "explanation": "Stateless session policy ensures that the server does not retain session cookies in memory, making services easily horizontally scalable across multiple Kubernetes pods."
      }
    ]
  },
  {
    "slug": "java-virtual-threads-loom",
    "title": "Java 21 Virtual Threads (Project Loom) & High-Throughput Concurrency",
    "courseSlug": "java-backend-fundamentals",
    "moduleSlug": "java-reactive-foundations",
    "moduleName": "Reactive Systems & Virtual Threads",
    "order": 1,
    "category": "Java",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Scale Java servers to millions of concurrent requests using Java 21 Virtual Threads without complex reactive callbacks.",
    "description": "Learn how lightweight virtual threads unmount from carrier OS threads during blocking I/O, providing thread-per-request simplicity with reactive throughput.",
    "learningPoints": [
      "Virtual Threads vs Platform (OS) Threads architecture",
      "Executors.newVirtualThreadPerTaskExecutor() usage",
      "Avoiding synchronized keyword pinning in carrier threads",
      "StructuredTaskScope for coordinating concurrent asynchronous subtasks"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Virtual Thread Revolution in Java",
        "body": "Traditional Java web servers allocate 1 OS thread per request (2MB stack per thread), capping server concurrency at roughly 5,000 active connections. Virtual threads are managed by the JVM (a few hundred bytes each). When a virtual thread performs a blocking I/O call (database, HTTP, file), the JVM unmounts it from its carrier OS thread, freeing the OS thread to execute other work."
      },
      {
        "type": "code",
        "title": "Java 21 Virtual Thread Executor and StructuredTaskScope",
        "language": "java",
        "code": "package com.backend.platform.reactive;\n\nimport java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\nimport java.util.concurrent.Executors;\n\npublic class HighConcurrencyGateway {\n\n    private final HttpClient client = HttpClient.newBuilder()\n        .executor(Executors.newVirtualThreadPerTaskExecutor())\n        .build();\n\n    public String fetchAggregatedData(String userId) throws Exception {\n        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n            var userTask = executor.submit(() -> callService(\"https://api.internal/users/\" + userId));\n            var orderTask = executor.submit(() -> callService(\"https://api.internal/orders/\" + userId));\n\n            // Blocking join is virtually zero cost with Loom!\n            String userData = userTask.get();\n            String orderData = orderTask.get();\n\n            return \"{\\\"user\\\": \" + userData + \", \\\"orders\\\": \" + orderData + \"}\";\n        }\n    }\n\n    private String callService(String url) throws Exception {\n        var request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();\n        return client.send(request, HttpResponse.BodyHandlers.ofString()).body();\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Carrier Thread Pinning Hazard",
        "body": "Avoid holding 'synchronized' locks during blocking I/O operations in Java 21. Synchronized blocks pin the virtual thread to the underlying carrier OS thread, preventing the JVM from unmounting it. Use ReentrantLock instead."
      }
    ],
    "quiz": [
      {
        "id": "java-loom-1",
        "question": "What happens when a Java 21 Virtual Thread encounters a blocking I/O operation (e.g., database query or HTTP call)?",
        "options": [
          "The JVM unmounts the virtual thread, freeing the underlying carrier OS thread to process other tasks",
          "The operating system halts all CPU cores until the query completes",
          "The JVM throws a ThreadBlockedException and terminates the connection",
          "The JVM spawns a new physical OS process"
        ],
        "correctOptionIndex": 0,
        "explanation": "Virtual threads unmount from their carrier OS thread during blocking operations, allowing a small pool of OS threads to power hundreds of thousands of concurrent I/O requests."
      }
    ]
  },
  {
    "slug": "java-quarkus-panache-reactive",
    "title": "Quarkus Reactive Engine, Mutiny Streams & GraalVM Native Compilation",
    "courseSlug": "java-backend-fundamentals",
    "moduleSlug": "java-reactive-foundations",
    "moduleName": "Reactive Systems & Virtual Threads",
    "order": 2,
    "category": "Java",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Build supersonic, sub-millisecond cloud microservices with Quarkus, Mutiny Uni/Multi streams, and GraalVM Native Image.",
    "description": "Master reactive stream composition, Panache reactive repositories, and compiling Java to ultra-fast native binaries.",
    "learningPoints": [
      "Quarkus non-blocking architecture powered by Eclipse Vert.x",
      "Mutiny reactive types: Uni (0 or 1 item) and Multi (stream of items)",
      "Panache Reactive entities with Hibernate Reactive and PostgreSQL",
      "GraalVM ahead-of-time (AOT) compilation for 10ms startup times and 25MB RSS memory"
    ],
    "content": [
      {
        "type": "text",
        "title": "Supersonic Subatomic Java with Quarkus",
        "body": "Quarkus is engineered specifically for containers and Kubernetes. By shifting framework build-time work (reflection, annotation scanning, bytecode generation) to compile time, Quarkus applications boot in milliseconds with a fraction of Spring's memory consumption."
      },
      {
        "type": "code",
        "title": "Reactive Quarkus Resource with Mutiny & Panache",
        "language": "java",
        "code": "package com.backend.platform.quarkus;\n\nimport io.quarkus.hibernate.reactive.panache.PanacheEntity;\nimport io.quarkus.hibernate.reactive.panache.PanacheRepository;\nimport io.smallrye.mutiny.Uni;\nimport jakarta.enterprise.context.ApplicationScoped;\nimport jakarta.persistence.Entity;\nimport jakarta.ws.rs.*;\nimport jakarta.ws.rs.core.MediaType;\nimport java.util.List;\n\n@Entity\npublic class Product extends PanacheEntity {\n    public String name;\n    public double price;\n    public int stock;\n}\n\n@ApplicationScoped\npublic class ProductRepository implements PanacheRepository<Product> {\n    public Uni<List<Product>> findInStock() {\n        return list(\"stock > 0\");\n    }\n}\n\n@Path(\"/api/v1/products\")\n@Produces(MediaType.APPLICATION_JSON)\n@Consumes(MediaType.APPLICATION_JSON)\npublic class ProductResource {\n\n    private final ProductRepository repository;\n\n    public ProductResource(ProductRepository repository) {\n        this.repository = repository;\n    }\n\n    @GET\n    public Uni<List<Product>> getAvailableProducts() {\n        return repository.findInStock();\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "GraalVM Native Image Optimization",
        "body": "Compile Quarkus with './mvnw package -Dnative' to generate a standalone Linux ELF binary that boots in under 15 milliseconds and uses only 28MB of RAM in production."
      }
    ],
    "quiz": [
      {
        "id": "java-qk-1",
        "question": "How does Quarkus achieve sub-15ms startup times compared to traditional Java enterprise frameworks?",
        "options": [
          "It performs reflection scanning and dependency analysis at build-time rather than runtime",
          "It replaces Java with Python scripts inside the container",
          "It ignores database connection pool initialization",
          "It disables type safety checks across all endpoints"
        ],
        "correctOptionIndex": 0,
        "explanation": "Quarkus shifts class reflection, annotation parsing, and proxy generation from startup time to compile/build time, producing minimal dead-code-eliminated bytecode or native GraalVM binaries."
      }
    ]
  },
  {
    "slug": "java-distributed-resilience",
    "title": "Distributed Resilience: Circuit Breakers, Retries & Fallbacks (Resilience4j)",
    "courseSlug": "spring-boot-microservices",
    "moduleSlug": "java-microservice-resilience",
    "moduleName": "Microservice Resilience & Observability",
    "order": 3,
    "category": "Java",
    "difficulty": "advanced",
    "xpReward": 160,
    "duration": 25,
    "summary": "Prevent cascading failures in distributed Java microservices using Resilience4j Circuit Breakers, Rate Limiters, and Bulkheads.",
    "description": "Learn how to protect upstream microservices from downstream outages using closed/open/half-open state machines and fallback degradation.",
    "learningPoints": [
      "Circuit Breaker state transitions: CLOSED -> OPEN -> HALF-OPEN",
      "Configuring sliding window failure rate thresholds and slow call durations",
      "Implementing graceful fallback methods for degraded service continuity",
      "Bulkhead pattern for thread pool and concurrent execution isolation"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Distributed Resilience is Essential",
        "body": "In a microservice mesh, if payment-service becomes slow, order-service threads will pile up waiting for responses until the entire order-service crashes from thread pool exhaustion. A Circuit Breaker trips OPEN when failure rates exceed a threshold, failing fast immediately and invoking cached fallbacks without overwhelming downstream services."
      },
      {
        "type": "code",
        "title": "Spring Boot Service Hardened with Resilience4j @CircuitBreaker",
        "language": "java",
        "code": "package com.backend.platform.resilience;\n\nimport io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;\nimport io.github.resilience4j.retry.annotation.Retry;\nimport org.slf4j.Logger;\nimport org.slf4j.LoggerFactory;\nimport org.springframework.stereotype.Service;\nimport org.springframework.web.client.RestTemplate;\n\n@Service\npublic class CurrencyConversionService {\n\n    private static final Logger log = LoggerFactory.getLogger(CurrencyConversionService.class);\n    private final RestTemplate restTemplate;\n\n    public CurrencyConversionService(RestTemplate restTemplate) {\n        this.restTemplate = restTemplate;\n    }\n\n    @CircuitBreaker(name = \"forexService\", fallbackMethod = \"getCachedExchangeRate\")\n    @Retry(name = \"forexService\")\n    public double getExchangeRate(String from, String to) {\n        String url = \"https://forex.internal.api/rate?from=\" + from + \"&to=\" + to;\n        return restTemplate.getForObject(url, Double.class);\n    }\n\n    public double getCachedExchangeRate(String from, String to, Throwable exception) {\n        log.warn(\"Forex service unavailable ({}). Falling back to cached baseline rate.\", exception.getMessage());\n        return 1.08;\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Fallback Method Signature Rule",
        "body": "In Resilience4j, fallback methods must match the exact parameter types of the original method, with an additional final Throwable argument capturing the failure reason."
      }
    ],
    "quiz": [
      {
        "id": "java-res-1",
        "question": "When a Circuit Breaker is in the OPEN state, what action does it take upon receiving a new incoming request?",
        "options": [
          "It immediately invokes the fallback method without attempting the remote network call",
          "It retries the network call 100 times with exponential delay",
          "It terminates the JVM process with exit code 1",
          "It drops the TCP connection silently"
        ],
        "correctOptionIndex": 0,
        "explanation": "When in the OPEN state, the circuit breaker fails fast immediately, shielding the struggling downstream service and returning the fallback response without creating network traffic."
      }
    ]
  },
  {
    "slug": "java-production-observability",
    "title": "Production Observability: Micrometer, Prometheus & Distributed Tracing",
    "courseSlug": "spring-boot-microservices",
    "moduleSlug": "java-microservice-resilience",
    "moduleName": "Microservice Resilience & Observability",
    "order": 4,
    "category": "Java",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Instrument Java backends with Spring Boot Actuator, Micrometer custom metrics, Prometheus scraping, and OpenTelemetry distributed tracing.",
    "description": "Learn how to expose operational telemetry, track P99 latency SLAs, and trace requests across distributed microservice hops.",
    "learningPoints": [
      "Spring Boot Actuator health endpoints and readiness/liveness probes for Kubernetes",
      "Instrumenting custom business metrics with Micrometer Counter and Timer",
      "Exporting dimensional metrics to Prometheus format",
      "Propagating W3C TraceContext headers for OpenTelemetry distributed tracing"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Pillars of Backend Observability in Java",
        "body": "You cannot manage what you cannot measure. Production Java applications require granular telemetry: JVM heap memory, garbage collection pause durations, database connection pool saturation (HikariCP), and custom business event metrics."
      },
      {
        "type": "code",
        "title": "Custom Metrics Instrumentation with Micrometer MeterRegistry",
        "language": "java",
        "code": "package com.backend.platform.metrics;\n\nimport io.micrometer.core.instrument.Counter;\nimport io.micrometer.core.instrument.MeterRegistry;\nimport io.micrometer.core.instrument.Timer;\nimport org.springframework.stereotype.Component;\nimport java.time.Duration;\n\n@Component\npublic class PaymentMetricsTracker {\n\n    private final Counter paymentSuccessCounter;\n    private final Counter paymentFailureCounter;\n    private final Timer paymentProcessingTimer;\n\n    public PaymentMetricsTracker(MeterRegistry registry) {\n        this.paymentSuccessCounter = Counter.builder(\"payments.processed.total\")\n            .tag(\"status\", \"success\")\n            .description(\"Total successful customer payments\")\n            .register(registry);\n\n        this.paymentFailureCounter = Counter.builder(\"payments.processed.total\")\n            .tag(\"status\", \"failure\")\n            .description(\"Total failed customer payments\")\n            .register(registry);\n\n        this.paymentProcessingTimer = Timer.builder(\"payments.latency\")\n            .description(\"Payment gateway processing latency\")\n            .publishPercentiles(0.5, 0.95, 0.99)\n            .register(registry);\n    }\n\n    public void recordSuccess(Duration duration) {\n        paymentSuccessCounter.increment();\n        paymentProcessingTimer.record(duration);\n    }\n\n    public void recordFailure() {\n        paymentFailureCounter.increment();\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Kubernetes Health Probes",
        "body": "Expose '/actuator/health/liveness' and '/actuator/health/readiness' to Kubernetes so container orchestrators know when to route traffic and when to restart unhealthy pods."
      }
    ],
    "quiz": [
      {
        "id": "java-obs-1",
        "question": "Why are P99 (99th percentile) latency metrics more valuable than average latency for evaluating backend performance?",
        "options": [
          "Averages mask severe latency spikes experienced by the slowest 1% of users under heavy load",
          "Averages cannot be calculated by mathematical algorithms",
          "Prometheus only supports percentile metrics",
          "P99 latency is required by the HTTP 2.0 protocol standard"
        ],
        "correctOptionIndex": 0,
        "explanation": "Average latency creates a false sense of stability because 90% fast requests mask outliers. P99 reveals the true worst-case experience under database locks and network stalls."
      }
    ]
  },
  {
    "slug": "csharp-aspnet-minimal-apis",
    "title": "ASP.NET Core 8 Minimal APIs, Routing & Dependency Injection",
    "courseSlug": "csharp-backend-fundamentals",
    "moduleSlug": "csharp-web-api-foundations",
    "moduleName": "ASP.NET Core API Engineering",
    "order": 1,
    "category": "C#",
    "difficulty": "beginner",
    "xpReward": 120,
    "duration": 18,
    "summary": "Build high-throughput, low-overhead HTTP services using ASP.NET Core Minimal APIs and built-in Microsoft.Extensions.DependencyInjection.",
    "description": "Master the modern WebApplicationBuilder pipeline, endpoint routing with TypedResults, and service lifetime scopes (Transient, Scoped, Singleton).",
    "learningPoints": [
      "WebApplication.CreateBuilder() architecture and middleware pipeline",
      "Endpoint definition with MapGet, MapPost, and TypedResults HTTP responses",
      "Dependency injection lifetimes: AddTransient, AddScoped, AddSingleton",
      "Configuration binding with IConfiguration and strongly-typed Options pattern"
    ],
    "content": [
      {
        "type": "text",
        "title": "Minimal APIs vs Traditional MVC Controllers",
        "body": "ASP.NET Core Minimal APIs remove ceremony and boilerplate. Instead of heavy Controller classes with reflection overhead, endpoints are mapped directly to lambda delegates using source generators and direct route matching, achieving top-tier performance on the TechEmpower benchmarks."
      },
      {
        "type": "code",
        "title": "Production ASP.NET Core 8 Minimal API with Scoped DI",
        "language": "csharp",
        "code": "using Microsoft.AspNetCore.Http.HttpResults;\n\nvar builder = WebApplication.CreateBuilder(args);\n\n// Register application service lifetimes\nbuilder.Services.AddScoped<IOrderService, OrderService>();\nbuilder.Services.AddSingleton<IPaymentGateway, StripePaymentGateway>();\n\nvar app = builder.Build();\n\napp.UseHttpsRedirection();\n\n// Typed endpoint with direct DTO parameter binding and IResult return\napp.MapPost(\"/api/v1/orders\", async Task<Results<Created<OrderResponse>, BadRequest<string>>> (\n    CreateOrderDto dto,\n    IOrderService orderService,\n    CancellationToken ct) =>\n{\n    if (dto.Amount <= 0)\n        return TypedResults.BadRequest(\"Order amount must be greater than zero.\");\n\n    var result = await orderService.CreateOrderAsync(dto, ct);\n    return TypedResults.Created($\"/api/v1/orders/{result.Id}\", result);\n});\n\napp.Run();\n\npublic record CreateOrderDto(string CustomerId, decimal Amount, List<string> Items);\npublic record OrderResponse(Guid Id, string Status, decimal Amount);\npublic interface IOrderService { Task<OrderResponse> CreateOrderAsync(CreateOrderDto dto, CancellationToken ct); }"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Scoped vs Singleton DI Pitfall (Captive Dependencies)",
        "body": "Never inject a Scoped service (like DbContext) into a Singleton service. This creates a 'captive dependency', holding the database connection open for the entire lifetime of the process and causing thread-safety crashes."
      }
    ],
    "quiz": [
      {
        "id": "cs-api-1",
        "question": "What is a 'captive dependency' bug in ASP.NET Core Dependency Injection?",
        "options": [
          "A Singleton service improperly referencing and keeping alive a Scoped service instance",
          "A Docker container unable to capture incoming TCP traffic",
          "A database deadlocked by two concurrent transactions",
          "An async task running without a CancellationToken"
        ],
        "correctOptionIndex": 0,
        "explanation": "Captive dependencies occur when a long-lived Singleton service receives a shorter-lived Scoped service via constructor injection, extending the Scoped object's life indefinitely."
      }
    ]
  },
  {
    "slug": "csharp-efcore-data-layer",
    "title": "Entity Framework Core 8, DbContext & AsNoTracking Optimization",
    "courseSlug": "csharp-backend-fundamentals",
    "moduleSlug": "csharp-web-api-foundations",
    "moduleName": "ASP.NET Core API Engineering",
    "order": 2,
    "category": "C#",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Design high-performance database layers using EF Core 8, migrations, LINQ projections, and Change Tracker optimizations.",
    "description": "Learn how to configure database contexts, apply AsNoTracking for read-heavy queries, and prevent N+1 queries with eager loading.",
    "learningPoints": [
      "Configuring DbContext with PostgreSQL or SQL Server connection pools",
      "Writing type-safe LINQ queries and compiled queries",
      "Using AsNoTracking() to bypass change tracker overhead on read queries",
      "Eager loading with Include/ThenInclude and explicit projections"
    ],
    "content": [
      {
        "type": "text",
        "title": "High-Performance EF Core Data Access",
        "body": "Entity Framework Core's Change Tracker observes every entity queried to detect updates upon SaveChangesAsync(). For read-only API requests, this tracking allocates substantial memory. Using .AsNoTracking() or direct .Select() projections drops memory usage by up to 70% and doubles throughput."
      },
      {
        "type": "code",
        "title": "Optimized EF Core 8 DbContext and LINQ Projection",
        "language": "csharp",
        "code": "using Microsoft.EntityFrameworkCore;\n\npublic class AppDbContext : DbContext\n{\n    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}\n\n    public DbSet<Product> Products => Set<Product>();\n    public DbSet<Category> Categories => Set<Category>();\n\n    protected override void OnModelCreating(ModelBuilder modelBuilder)\n    {\n        modelBuilder.Entity<Product>(b =>\n        {\n            b.HasKey(p => p.Id);\n            b.Property(p => p.Name).HasMaxLength(150).IsRequired();\n            b.Property(p => p.Price).HasPrecision(18, 2);\n            b.HasIndex(p => p.Sku).IsUnique();\n        });\n    }\n}\n\npublic class ProductRepository\n{\n    private final AppDbContext _db;\n    public ProductRepository(AppDbContext db) => _db = db;\n\n    // High-performance read projection bypassing change tracking\n    public async Task<List<ProductDto>> GetActiveProductsAsync(Guid categoryId, CancellationToken ct)\n    {\n        return await _db.Products\n            .AsNoTracking()\n            .Where(p => p.CategoryId == categoryId && p.IsActive)\n            .Select(p => new ProductDto(p.Id, p.Name, p.Price, p.Sku))\n            .ToListAsync(ct);\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Use Split Queries for Deep Relationships",
        "body": "When using multiple .Include() calls, EF Core generates massive SQL Cartesian products. Add .AsSplitQuery() to split relational loads into separate SQL SELECT statements."
      }
    ],
    "quiz": [
      {
        "id": "cs-ef-1",
        "question": "Why should .AsNoTracking() be applied to read-only queries in Entity Framework Core?",
        "options": [
          "It disables entity state tracking in memory, significantly lowering RAM allocations and CPU overhead",
          "It forces SQL Server to run in unindexed mode",
          "It prevents other users from connecting to the database",
          "It encrypts database columns in transit"
        ],
        "correctOptionIndex": 0,
        "explanation": "AsNoTracking tells EF Core not to store snapshot copies in the ChangeTracker, reducing memory consumption and speeding up query execution for read-only APIs."
      }
    ]
  },
  {
    "slug": "csharp-jwt-auth-middleware",
    "title": "ASP.NET Core JWT Authentication & Claims-Based Authorization",
    "courseSlug": "csharp-backend-fundamentals",
    "moduleSlug": "csharp-security-identity",
    "moduleName": "Security, Validation & Architecture",
    "order": 3,
    "category": "C#",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Secure ASP.NET Core endpoints with Microsoft.AspNetCore.Authentication.JwtBearer, TokenValidationParameters, and Custom Authorization Policies.",
    "description": "Implement stateless JWT verification, claims extraction, role guards, and requirement handlers.",
    "learningPoints": [
      "Configuring AddAuthentication and AddJwtBearer with symmetric/asymmetric keys",
      "TokenValidationParameters (Issuer, Audience, Lifetime, ClockSkew)",
      "ClaimsPrincipal extraction in Minimal APIs and controllers",
      "Role and Policy-based authorization guards with [Authorize(Policy = '...')] "
    ],
    "content": [
      {
        "type": "text",
        "title": "Stateless JWT Pipeline in .NET 8",
        "body": "ASP.NET Core features a built-in authentication middleware pipeline. Incoming Authorization headers containing Bearer JWT tokens are cryptographically verified against symmetric signing keys. Valid claims are transformed into a ClaimsPrincipal attached to the HttpContext."
      },
      {
        "type": "code",
        "title": "Configuring JWT Bearer Authentication in Program.cs",
        "language": "csharp",
        "code": "using System.Text;\nusing Microsoft.AspNetCore.Authentication.JwtBearer;\nusing Microsoft.IdentityModel.Tokens;\n\nvar builder = WebApplication.CreateBuilder(args);\n\nvar jwtSecret = builder.Configuration[\"Jwt:SecretKey\"] ?? throw new InvalidOperationException(\"JWT Secret missing\");\n\nbuilder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)\n    .AddJwtBearer(options =>\n    {\n        options.TokenValidationParameters = new TokenValidationParameters\n        {\n            ValidateIssuer = true,\n            ValidIssuer = builder.Configuration[\"Jwt:Issuer\"],\n            ValidateAudience = true,\n            ValidAudience = builder.Configuration[\"Jwt:Audience\"],\n            ValidateIssuerSigningKey = true,\n            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),\n            ValidateLifetime = true,\n            ClockSkew = TimeSpan.Zero // Strict expiry check without 5min default grace\n        };\n    });\n\nbuilder.Services.AddAuthorization(options =>\n{\n    options.AddPolicy(\"AdminOnly\", policy => policy.RequireRole(\"Admin\"));\n});\n\nvar app = builder.Build();\napp.UseAuthentication();\napp.UseAuthorization();\n\napp.MapGet(\"/api/v1/admin/metrics\", [Microsoft.AspNetCore.Authorization.Authorize(\"AdminOnly\")] () =>\n    Results.Ok(new { SystemStatus = \"Optimal\", ActiveNodes = 8 }));\n\napp.Run();"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "ClockSkew Grace Period Notice",
        "body": "By default, Microsoft's TokenValidationParameters adds a 5-minute ClockSkew allowance. For strict token expiry enforcement, always explicitly set options.TokenValidationParameters.ClockSkew = TimeSpan.Zero."
      }
    ],
    "quiz": [
      {
        "id": "cs-jwt-1",
        "question": "What is the consequence of leaving TokenValidationParameters.ClockSkew at its default setting in ASP.NET Core?",
        "options": [
          "Tokens remain valid for up to 5 minutes after their explicit 'exp' timestamp",
          "All incoming tokens are rejected as expired immediately",
          "The server clock is synchronized over NTP on every HTTP call",
          "JWT tokens are automatically converted into cookies"
        ],
        "correctOptionIndex": 0,
        "explanation": "Default ClockSkew is 5 minutes to accommodate clock drift across distributed servers. Explicitly setting ClockSkew = TimeSpan.Zero ensures immediate token expiry."
      }
    ]
  },
  {
    "slug": "csharp-fluent-validation-pipeline",
    "title": "Request Pipeline Middleware, FluentValidation & RFC 7807 Errors",
    "courseSlug": "csharp-backend-fundamentals",
    "moduleSlug": "csharp-security-identity",
    "moduleName": "Security, Validation & Architecture",
    "order": 4,
    "category": "C#",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Implement clean validation and centralized error handling using FluentValidation and custom ASP.NET Core Middleware.",
    "description": "Learn how to decouple validation logic from business models and handle unhandled exceptions cleanly with standard ProblemDetails.",
    "learningPoints": [
      "FluentValidation AbstractValidator<T> rules and cascade modes",
      "Endpoint filter validation pattern in Minimal APIs (IEndpointFilter)",
      "Global exception handling middleware and IExceptionHandler (.NET 8)",
      "Standardizing error responses with ProblemDetails (RFC 7807)"
    ],
    "content": [
      {
        "type": "text",
        "title": "Validation Architecture & Global Exception Handling",
        "body": "Clean architecture dictates that validation rules live outside domain models. FluentValidation provides expressive, strongly-typed rules. Combined with .NET 8 IExceptionHandler, invalid requests are rejected with consistent RFC 7807 problem details before hitting database layers."
      },
      {
        "type": "code",
        "title": "FluentValidation Rules & Endpoint Filter Integration",
        "language": "csharp",
        "code": "using FluentValidation;\n\npublic record RegisterUserDto(string Email, string Password, int Age);\n\npublic class RegisterUserValidator : AbstractValidator<RegisterUserDto>\n{\n    public RegisterUserValidator()\n    {\n        RuleFor(x => x.Email)\n            .NotEmpty().WithMessage(\"Email address is mandatory.\")\n            .EmailAddress().WithMessage(\"A valid email is required.\");\n\n        RuleFor(x => x.Password)\n            .NotEmpty()\n            .MinimumLength(8).WithMessage(\"Password must be at least 8 characters.\")\n            .Matches(@\"[A-Z]\").WithMessage(\"Must contain an uppercase letter.\")\n            .Matches(@\"[0-9]\").WithMessage(\"Must contain a numeric digit.\");\n\n        RuleFor(x => x.Age)\n            .InclusiveBetween(18, 120).WithMessage(\"User must be of legal age.\");\n    }\n}\n\n// Endpoint Filter for auto-validating DTOs in Minimal APIs\npublic class ValidationFilter<T> : IEndpointFilter where T : class\n{\n    private readonly IValidator<T> _validator;\n    public ValidationFilter(IValidator<T> validator) => _validator = validator;\n\n    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)\n    {\n        var arg = context.Arguments.OfType<T>().FirstOrDefault();\n        if (arg is not null)\n        {\n            var result = await _validator.ValidateAsync(arg);\n            if (!result.IsValid)\n                return TypedResults.ValidationProblem(result.ToDictionary());\n        }\n        return await next(context);\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Key Takeaway",
        "body": "Use endpoint filters to automatically apply validation across Minimal API endpoints without repeating 'if (!validation.IsValid)' blocks."
      }
    ],
    "quiz": [
      {
        "id": "cs-val-1",
        "question": "What standard format does TypedResults.ValidationProblem() produce in ASP.NET Core 8?",
        "options": [
          "RFC 7807 Problem Details for HTTP APIs (application/problem+json)",
          "Plain XML text document",
          "Raw SQL syntax error trace",
          "SOAP envelope message"
        ],
        "correctOptionIndex": 0,
        "explanation": "TypedResults.ValidationProblem returns RFC 7807 compliant JSON containing standardized status code, title, type, and field-specific error dictionaries."
      }
    ]
  },
  {
    "slug": "csharp-async-await-task",
    "title": "Advanced Async/Await, ValueTask & SynchronizationContext",
    "courseSlug": "aspnet-core-web-apis",
    "moduleSlug": "csharp-core-runtime",
    "moduleName": "C# Concurrency & Runtime Architecture",
    "order": 1,
    "category": "C#",
    "difficulty": "advanced",
    "xpReward": 140,
    "duration": 20,
    "summary": "Master C# asynchronous programming internals, Task vs ValueTask allocation, thread-pool scheduling, and CancellationToken propagation.",
    "description": "Understand how the .NET async state machine transforms code, when to use ValueTask for zero-allocation paths, and how to avoid thread pool starvation.",
    "learningPoints": [
      "Async state machine lowering and MoveNext() mechanics",
      "Task vs ValueTask: when to optimize zero-allocation paths",
      "Thread pool starvation: avoiding .Result and .Wait() synchronous blocking",
      "Cooperative cancellation using CancellationToken"
    ],
    "content": [
      {
        "type": "text",
        "title": "Under the Hood of .NET Async/Await",
        "body": "When a method is marked 'async', the C# compiler synthesizes an internal struct implementing IAsyncStateMachine. Calling .Result or .Wait() on a Task forces the thread pool worker to block synchronously, leading to catastrophic thread pool starvation under high concurrent traffic."
      },
      {
        "type": "code",
        "title": "Zero-Allocation Asynchronous Path using ValueTask",
        "language": "csharp",
        "code": "using System.Collections.Concurrent;\n\npublic class MemoryCacheService<TKey, TValue> where TKey : notnull\n{\n    private readonly ConcurrentDictionary<TKey, TValue> _cache = new();\n    private readonly Func<TKey, CancellationToken, Task<TValue>> _factory;\n\n    public MemoryCacheService(Func<TKey, CancellationToken, Task<TValue>> factory)\n    {\n        _factory = factory;\n    }\n\n    // Returns ValueTask to eliminate Task heap allocation on cache hits!\n    public ValueTask<TValue> GetOrCreateAsync(TKey key, CancellationToken ct = default)\n    {\n        if (_cache.TryGetValue(key, out var cachedValue))\n        {\n            return new ValueTask<TValue>(cachedValue); // Synchronous zero-allocation path\n        }\n\n        return new ValueTask<TValue>(FetchAndCacheAsync(key, ct)); // Asynchronous fallback\n    }\n\n    private async Task<TValue> FetchAndCacheAsync(TKey key, CancellationToken ct)\n    {\n        var value = await _factory(key, ct).ConfigureAwait(false);\n        _cache[key] = value;\n        return value;\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Thread Pool Starvation Warning",
        "body": "Never use Task.Result or Task.Wait() in ASP.NET Core. Doing so blocks the thread pool worker, causing request queues to spike from 0ms to 30,000ms within seconds under load."
      }
    ],
    "quiz": [
      {
        "id": "cs-async-1",
        "question": "What is the primary performance advantage of returning ValueTask<T> instead of Task<T> in hot-path methods?",
        "options": [
          "It avoids heap-allocating a Task object when the operation completes synchronously (e.g. cache hit)",
          "It runs the code directly on the GPU",
          "It converts the method from multi-threaded to single-threaded",
          "It automatically compresses network packets"
        ],
        "correctOptionIndex": 0,
        "explanation": "ValueTask is a discriminated union struct. When data is immediately available in memory (synchronous path), it returns without allocating any object on the garbage-collected heap."
      }
    ]
  },
  {
    "slug": "csharp-background-services",
    "title": "Background Processing in .NET: IHostedService & Channel Queues",
    "courseSlug": "aspnet-core-web-apis",
    "moduleSlug": "csharp-core-runtime",
    "moduleName": "C# Concurrency & Runtime Architecture",
    "order": 2,
    "category": "C#",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 22,
    "summary": "Build resilient background workers and in-memory producer-consumer pipelines using System.Threading.Channels and BackgroundService.",
    "description": "Learn how to offload heavy operations (email dispatch, report generation, video transcoding) from HTTP request threads using unbounded/bounded channels.",
    "learningPoints": [
      "BackgroundService and IHostedService lifecycle in Generic Host",
      "High-performance producer-consumer queues using System.Threading.Channels",
      "Graceful shutdown handling and stoppingToken coordination",
      "Creating isolated dependency injection scopes inside singleton workers"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Offload Work to Background Services",
        "body": "HTTP endpoints should respond in under 50ms. Heavy tasks like image resizing or transactional emails should be queued and processed by background worker loops. System.Threading.Channels provides a lock-free, zero-allocation in-memory queue for high-throughput task handoff."
      },
      {
        "type": "code",
        "title": "Thread-Safe Channel Worker with Scoped Services",
        "language": "csharp",
        "code": "using System.Threading.Channels;\n\npublic record BackgroundTask(string TaskId, string Payload);\n\npublic class TaskQueue\n{\n    private readonly Channel<BackgroundTask> _channel = Channel.CreateBounded<BackgroundTask>(new BoundedChannelOptions(1000)\n    {\n        FullMode = BoundedChannelFullMode.Wait\n    });\n\n    public async ValueTask EnqueueAsync(BackgroundTask task, CancellationToken ct) =>\n        await _channel.Writer.WriteAsync(task, ct);\n\n    public IAsyncEnumerable<BackgroundTask> ReadAllAsync(CancellationToken ct) =>\n        _channel.Reader.ReadAllAsync(ct);\n}\n\npublic class WorkerService : BackgroundService\n{\n    private readonly TaskQueue _queue;\n    private readonly IServiceScopeFactory _scopeFactory;\n    private readonly ILogger<WorkerService> _logger;\n\n    public WorkerService(TaskQueue queue, IServiceScopeFactory scopeFactory, ILogger<WorkerService> logger)\n    {\n        _queue = queue;\n        _scopeFactory = scopeFactory;\n        _logger = logger;\n    }\n\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        _logger.LogInformation(\"Background queue worker started.\");\n\n        await foreach (var task in _queue.ReadAllAsync(stoppingToken))\n        {\n            try\n            {\n                using var scope = _scopeFactory.CreateScope();\n                var processor = scope.ServiceProvider.GetRequiredService<ITaskProcessor>();\n                await processor.ProcessAsync(task, stoppingToken);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Failed to process task {TaskId}\", task.TaskId);\n            }\n        }\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Resolving Scoped Services in BackgroundService",
        "body": "Because BackgroundService is a Singleton, always use IServiceScopeFactory.CreateScope() to instantiate scoped services (like DbContext) per work item, ensuring proper disposal."
      }
    ],
    "quiz": [
      {
        "id": "cs-bg-1",
        "question": "Why must IServiceScopeFactory be used when accessing database services inside a BackgroundService in .NET?",
        "options": [
          "Because BackgroundService is a Singleton and cannot directly consume Scoped DbContext instances without creating a scope",
          "Because C# does not allow SQL queries on background threads",
          "Because BackgroundService automatically disables database connection pooling",
          "Because Entity Framework requires administrative Windows permissions"
        ],
        "correctOptionIndex": 0,
        "explanation": "DbContext is registered as Scoped. Injecting it directly into a Singleton BackgroundService causes concurrency issues and memory leaks. Creating a manual scope per task ensures clean instantiation and disposal."
      }
    ]
  },
  {
    "slug": "csharp-dapper-micro-orm",
    "title": "High-Performance Data Access with Dapper Micro-ORM & Raw SQL",
    "courseSlug": "aspnet-core-web-apis",
    "moduleSlug": "csharp-data-infrastructure",
    "moduleName": "Data Infrastructure & Deployment",
    "order": 3,
    "category": "C#",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 18,
    "summary": "Maximize query throughput using Dapper micro-ORM, raw parameterized SQL, multi-mapping, and connection resilience.",
    "description": "Learn how Dapper extends IDbConnection with lightning-fast IL emit deserialization, outperforming full-featured ORMs on read paths.",
    "learningPoints": [
      "Dapper vs EF Core architectural tradeoffs (speed vs productivity)",
      "Parameterized queries to eliminate SQL injection vulnerabilities",
      "QueryMultipleAsync for batching multiple SELECT results in a single roundtrip",
      "Multi-mapping complex nested domain objects (1:N relations)"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Micro-ORM Philosophy with Dapper",
        "body": "Dapper was built by Stack Overflow to handle billions of queries per day. It adds lightweight extension methods to standard IDbConnection, executing raw SQL and deserializing results directly into C# records with virtually zero reflection overhead."
      },
      {
        "type": "code",
        "title": "Dapper Parameterized Query with Multi-Mapping",
        "language": "csharp",
        "code": "using System.Data;\nusing Dapper;\nusing Npgsql;\n\npublic record UserProfile(Guid Id, string Username, string Email, Address UserAddress);\npublic record Address(string Street, string City, string Country);\n\npublic class UserQueryService\n{\n    private readonly string _connectionString;\n    public UserQueryService(IConfiguration config) =>\n        _connectionString = config.GetConnectionString(\"Default\")!;\n\n    public async Task<UserProfile?> GetUserProfileAsync(Guid userId)\n    {\n        using IDbConnection db = new NpgsqlConnection(_connectionString);\n\n        const string sql = @\"\n            SELECT u.id, u.username, u.email, \n                   a.street, a.city, a.country\n            FROM users u\n            LEFT JOIN addresses a ON u.id = a.user_id\n            WHERE u.id = @UserId\";\n\n        var result = await db.QueryAsync<UserProfile, Address, UserProfile>(\n            sql,\n            (user, address) => user with { UserAddress = address },\n            new { UserId = userId },\n            splitOn: \"street\"\n        );\n\n        return result.FirstOrDefault();\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Always Parameterize Queries",
        "body": "Never concatenate user input strings directly into SQL statements ('SELECT * FROM users WHERE id = ' + id). Always use Dapper anonymous parameter objects (new { UserId = id }) to prevent SQL injection."
      }
    ],
    "quiz": [
      {
        "id": "cs-dap-1",
        "question": "How does Dapper achieve query deserialization speeds comparable to raw hand-written ADO.NET DataReader code?",
        "options": [
          "It uses dynamic IL (Intermediate Language) generation to compile and cache custom deserializer delegates at runtime",
          "It disables all TCP network verification",
          "It converts relational database tables into binary JSON files",
          "It bypasses SQL query planning on the database server"
        ],
        "correctOptionIndex": 0,
        "explanation": "Dapper generates dynamic IL bytecode on the first query execution and caches the compiled delegate, allowing subsequent deserializations to execute at pure native machine speed without reflection penalty."
      }
    ]
  },
  {
    "slug": "csharp-docker-production",
    "title": "Multi-Stage Docker Containerization, Health Probes & Readiness",
    "courseSlug": "aspnet-core-web-apis",
    "moduleSlug": "csharp-data-infrastructure",
    "moduleName": "Data Infrastructure & Deployment",
    "order": 4,
    "category": "C#",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 20,
    "summary": "Package .NET 8 applications into minimal, secure Linux containers with multi-stage Dockerfiles and ASP.NET Core Health Checks.",
    "description": "Learn how to reduce container image size from 800MB to 120MB using Alpine/Chiseled images and configure liveness/readiness probes.",
    "learningPoints": [
      "Multi-stage Dockerfile architecture (SDK build vs ASP.NET runtime)",
      "Chiseled Ubuntu and Alpine runtime base images for minimal attack surface",
      "Configuring Microsoft.Extensions.Diagnostics.HealthChecks",
      "Mapping /healthz/live and /healthz/ready probes for Kubernetes"
    ],
    "content": [
      {
        "type": "text",
        "title": "Production Containerization Best Practices for .NET",
        "body": "A full .NET SDK image contains compilers and CLI tools that should never exist in production. Multi-stage builds compile artifacts in an SDK container and copy only the compiled binaries into a lightweight, non-root runtime image, drastically minimizing CVE vulnerabilities."
      },
      {
        "type": "code",
        "title": "Multi-Stage Dockerfile for .NET 8 Web API",
        "language": "dockerfile",
        "code": "# Stage 1: Build & Publish\nFROM mcr.microsoft.com/dotnet/sdk:8.0 AS build\nWORKDIR /src\n\nCOPY [\"Platform.Api/Platform.Api.csproj\", \"Platform.Api/\"]\nRUN dotnet restore \"Platform.Api/Platform.Api.csproj\"\n\nCOPY . .\nWORKDIR \"/src/Platform.Api\"\nRUN dotnet publish \"Platform.Api.csproj\" -c Release -o /app/publish /p:UseAppHost=false\n\n# Stage 2: Minimal Non-Root Runtime Image\nFROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final\nWORKDIR /app\nEXPOSE 8080\n\nENV ASPNETCORE_HTTP_PORTS=8080\nENV DOTNET_EnableDiagnostics=0\n\n# Run as built-in non-root user\nUSER app\nCOPY --from=build /app/publish .\nENTRYPOINT [\"dotnet\", \"Platform.Api.dll\"]"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Always Run as Non-Root User",
        "body": ".NET 8 container images provide a built-in 'app' non-root user (UID 1654). Always include 'USER app' to protect host systems against container breakout vulnerabilities."
      }
    ],
    "quiz": [
      {
        "id": "cs-doc-1",
        "question": "Why is multi-stage building standard practice when creating Docker containers for .NET applications?",
        "options": [
          "It ensures the large .NET SDK compiler tools are excluded from the final production container, reducing image size and security surface",
          "It forces the container to run in multi-threaded CPU mode",
          "It converts the C# code into Node.js JavaScript at runtime",
          "It allows the container to bypass Docker daemon security policies"
        ],
        "correctOptionIndex": 0,
        "explanation": "Multi-stage builds compile code inside an SDK image and transfer only compiled binaries into a clean, minimal runtime image, shrinking container sizes from ~800MB down to ~100MB."
      }
    ]
  },
  {
    "slug": "go-project-layout-modules",
    "title": "Standard Go Project Layout, Modules & Package Architecture",
    "courseSlug": "go-backend-fundamentals",
    "moduleSlug": "go-microservices-foundations",
    "moduleName": "Go Microservice Architecture & APIs",
    "order": 1,
    "category": "Go",
    "difficulty": "beginner",
    "xpReward": 120,
    "duration": 18,
    "summary": "Structure enterprise Go backend applications using the Standard Go Project Layout (/cmd, /internal, /pkg), Go Modules, and dependency encapsulation.",
    "description": "Learn how the Go compiler enforces internal package encapsulation, package naming conventions, and idiomatic error handling.",
    "learningPoints": [
      "Standard Go directory layout: /cmd/server, /internal/domain, /pkg",
      "The role of the /internal package boundary enforced by the Go compiler",
      "Dependency management with go.mod and go.sum",
      "Defining domain interfaces for clean boundary separation"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Project Layout Matters in Go",
        "body": "In Go, code visibility is governed by directory structure and identifier capitalization. Code placed in the '/internal' directory cannot be imported by external modules, allowing backend teams to refactor private database logic and service helpers safely without breaking external API consumers."
      },
      {
        "type": "code",
        "title": "Idiomatic Go Service Interface & Repository Pattern",
        "language": "go",
        "code": "package service\n\nimport (\n\t\"context\"\n\t\"errors\"\n\t\"time\"\n)\n\nvar (\n\tErrUserNotFound = errors.New(\"user not found\")\n\tErrInvalidEmail = errors.New(\"invalid email address\")\n)\n\ntype User struct {\n\tID        string    `json:\"id\"`\n\tEmail     string    `json:\"email\"`\n\tRole      string    `json:\"role\"`\n\tCreatedAt time.Time `json:\"created_at\"`\n}\n\ntype UserRepository interface {\n\tGetByID(ctx context.Context, id string) (*User, error)\n\tCreate(ctx context.Context, user *User) error\n}\n\ntype UserService struct {\n\trepo UserRepository\n}\n\nfunc NewUserService(repo UserRepository) *UserService {\n\treturn &UserService{repo: repo}\n}\n\nfunc (s *UserService) FetchProfile(ctx context.Context, id string) (*User, error) {\n\tif id == \"\" {\n\t\treturn nil, ErrUserNotFound\n\t}\n\treturn s.repo.GetByID(ctx, id)\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Avoid Global Package State",
        "body": "Never declare package-level global database connections ('var DB *sql.DB'). Always inject dependencies via constructor functions (NewService, NewRepository) to ensure thread-safety and testability."
      }
    ],
    "quiz": [
      {
        "id": "go-layout-1",
        "question": "What special behavior does the Go toolchain enforce for packages located inside the '/internal' directory?",
        "options": [
          "They cannot be imported by any module outside the parent directory tree",
          "They are automatically compiled without garbage collection",
          "They run exclusively on a single operating system thread",
          "They can only communicate using UDP sockets"
        ],
        "correctOptionIndex": 0,
        "explanation": "The Go compiler strictly forbids external modules from importing code from an internal package, enforcing encapsulation for proprietary domain logic."
      }
    ]
  },
  {
    "slug": "go-gin-routing-middleware",
    "title": "High-Throughput REST APIs with Gin Engine & Custom Middleware",
    "courseSlug": "gin-high-performance-apis",
    "moduleSlug": "go-microservices-foundations",
    "moduleName": "Go Microservice Architecture & APIs",
    "order": 2,
    "category": "Go",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Build high-speed RESTful services using the Gin web framework, custom middleware pipelines, and structured JSON binding.",
    "description": "Master Gin route grouping, Context error handling, request binding with validator tags, and recovery middleware.",
    "learningPoints": [
      "Gin Engine setup, route grouping (/api/v1), and static asset serving",
      "Structured request validation using `binding:\"required,email\"` struct tags",
      "Writing composable middleware functions with `c.Next()` and `c.AbortWithStatusJSON()`",
      "Centralized error recovery using `gin.Recovery()`"
    ],
    "content": [
      {
        "type": "text",
        "title": "Building Blazing-Fast APIs with Gin",
        "body": "Gin uses a custom radix tree router based on httprouter, delivering near zero-memory-allocation routing. Middleware functions wrap handler execution, providing request timing, logging, authentication, and error recovery."
      },
      {
        "type": "code",
        "title": "Gin REST API Controller with Validation Middleware",
        "language": "go",
        "code": "package main\n\nimport (\n\t\"net/http\"\n\t\"time\"\n\n\t\"github.com/gin-gonic/gin\"\n)\n\ntype CreateOrderRequest struct {\n\tCustomerID string  `json:\"customer_id\" binding:\"required,uuid\"`\n\tAmount     float64 `json:\"amount\" binding:\"required,gt=0\"`\n\tCurrency   string  `json:\"currency\" binding:\"required,oneof=USD EUR GBP\"`\n}\n\nfunc RequestLoggerMiddleware() gin.HandlerFunc {\n\treturn func(c *gin.Context) {\n\t\tstart := time.Now()\n\t\tc.Next() // Process handler\n\t\tlatency := time.Since(start)\n\t\tstatus := c.Writer.Status()\n\t\t// Log structured request latency\n\t\tif status >= 400 {\n\t\t\tc.Header(\"X-Error-Logged\", \"true\")\n\t\t}\n\t\t_ = latency\n\t}\n}\n\nfunc main() {\n\tr := gin.New()\n\tr.Use(gin.Recovery(), RequestLoggerMiddleware())\n\n\tv1 := r.Group(\"/api/v1\")\n\t{\n\t\tv1.POST(\"/orders\", func(c *gin.Context) {\n\t\t\tvar req CreateOrderRequest\n\t\t\tif err := c.ShouldBindJSON(&req); err != nil {\n\t\t\t\tc.JSON(http.StatusBadRequest, gin.H{\"error\": err.Error()})\n\t\t\t\treturn\n\t\t\t}\n\n\t\t\tc.JSON(http.StatusCreated, gin.H{\n\t\t\t\t\"status\":      \"confirmed\",\n\t\t\t\t\"customer_id\": req.CustomerID,\n\t\t\t\t\"amount\":      req.Amount,\n\t\t\t})\n\t\t})\n\t}\n\n\tr.Run(\":8080\")\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Use c.AbortWithStatusJSON in Middleware",
        "body": "When a middleware check fails (e.g., unauthorized request), always call `c.AbortWithStatusJSON()` to stop subsequent handlers in the chain from executing."
      }
    ],
    "quiz": [
      {
        "id": "go-gin-1",
        "question": "What happens if a Gin authentication middleware fails to call c.Abort() when returning an HTTP 401 response?",
        "options": [
          "Gin will continue executing the downstream route handler despite the 401 status",
          "The Go runtime triggers a fatal panic",
          "The TCP connection is forcibly severed",
          "The response is automatically converted into HTTP 200 OK"
        ],
        "correctOptionIndex": 0,
        "explanation": "In Gin, returning a response from middleware does not halt execution by default; calling c.Abort() or c.AbortWithStatusJSON() is required to stop downstream handlers."
      }
    ]
  },
  {
    "slug": "go-sqlx-database-pool",
    "title": "Database Connection Pooling & Transactions with Sqlx & PostgreSQL",
    "courseSlug": "gin-high-performance-apis",
    "moduleSlug": "go-microservices-foundations",
    "moduleName": "Go Microservice Architecture & APIs",
    "order": 3,
    "category": "Go",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 22,
    "summary": "Manage database connection pools, ACID transactions, and struct scanning using database/sql and jmoiron/sqlx.",
    "description": "Learn how to configure MaxOpenConns, MaxIdleConns, and ConnMaxLifetime to prevent connection starvation under high load.",
    "learningPoints": [
      "Configuring database/sql connection pool parameters for high throughput",
      "Using sqlx struct tags (`db:\"column_name\"`) for zero-boilerplate query scanning",
      "Executing ACID transactions with context propagation and rollback deferral",
      "Prepared statements and parameterized queries for SQL injection immunity"
    ],
    "content": [
      {
        "type": "text",
        "title": "Mastering Go Database Connection Pools",
        "body": "Go's standard library database/sql provides a thread-safe connection pool. Naive defaults can overwhelm PostgreSQL or cause deadlocks. Tuning SetMaxOpenConns, SetMaxIdleConns, and SetConnMaxLifetime is mandatory for production reliability."
      },
      {
        "type": "code",
        "title": "Production Postgres Database Pool and Transaction with Sqlx",
        "language": "go",
        "code": "package db\n\nimport (\n\t\"context\"\n\t\"time\"\n\n\t\"github.com/jmoiron/sqlx\"\n\t_ \"github.com/lib/pq\"\n)\n\ntype Account struct {\n\tID        string    `db:\"id\" json:\"id\"`\n\tBalance   float64   `db:\"balance\" json:\"balance\"`\n\tUpdatedAt time.Time `db:\"updated_at\" json:\"updated_at\"`\n}\n\nfunc InitDBPool(dsn string) (*sqlx.DB, error) {\n\tdb, err := sqlx.Connect(\"postgres\", dsn)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\t// Production connection pool tuning\n\tdb.SetMaxOpenConns(50)                  // Max active connections\n\tdb.SetMaxIdleConns(25)                  // Idle connections ready for reuse\n\tdb.SetConnMaxLifetime(15 * time.Minute) // Retire old connections\n\tdb.SetConnMaxIdleTime(5 * time.Minute)\n\n\treturn db, nil\n}\n\nfunc TransferFunds(ctx context.Context, db *sqlx.DB, fromID, toID string, amount float64) error {\n\ttx, err := db.BeginTxx(ctx, nil)\n\tif err != nil {\n\t\treturn err\n\t}\n\tdefer tx.Rollback() // Safe rollback if commit is not reached\n\n\t_, err = tx.ExecContext(ctx, \"UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1\", amount, fromID)\n\tif err != nil {\n\t\treturn err\n\t}\n\n\t_, err = tx.ExecContext(ctx, \"UPDATE accounts SET balance = balance + $1 WHERE id = $2\", amount, toID)\n\tif err != nil {\n\t\treturn err\n\t}\n\n\treturn tx.Commit()\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Always Defer tx.Rollback()",
        "body": "Calling 'defer tx.Rollback()' immediately after BeginTxx ensures that if any error or panic occurs, the transaction is safely rolled back. If tx.Commit() succeeds, the deferred rollback is a harmless no-op."
      }
    ],
    "quiz": [
      {
        "id": "go-db-1",
        "question": "Why is it critical to set SetConnMaxLifetime on database/sql connection pools in containerized cloud environments?",
        "options": [
          "To gracefully close and replace stale connections before cloud load balancers or firewalls terminate them silently",
          "To force the database to re-index all tables every hour",
          "To prevent Go from garbage collecting SQL queries",
          "To automatically backup the database to S3 storage"
        ],
        "correctOptionIndex": 0,
        "explanation": "Cloud load balancers and AWS RDS firewalls terminate idle TCP sockets after a timeout. Setting ConnMaxLifetime closes connections before network firewalls drop them, preventing 'broken pipe' errors."
      }
    ]
  },
  {
    "slug": "go-jwt-auth-middleware",
    "title": "Stateless JWT Authentication & Context Parameter Injection",
    "courseSlug": "gin-high-performance-apis",
    "moduleSlug": "go-microservices-foundations",
    "moduleName": "Go Microservice Architecture & APIs",
    "order": 4,
    "category": "Go",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Implement secure JWT authentication middleware in Go with golang-jwt/jwt, claims verification, and request context injection.",
    "description": "Learn how to parse cryptographic tokens, extract user roles, and pass authenticated user contexts safely through HTTP handler chains.",
    "learningPoints": [
      "Signing and verifying JWT tokens using HMAC-SHA256 (HS256) or RSA (RS256)",
      "Custom claims definition implementing jwt.RegisteredClaims",
      "Extracting and validating Bearer tokens in Gin middleware",
      "Injecting authenticated user identity into gin.Context and context.Context"
    ],
    "content": [
      {
        "type": "text",
        "title": "JWT Security Architecture in Go Services",
        "body": "Go microservices authenticate requests by validating digital signatures on JWT tokens. Middleware decodes claims, verifies expiration, and stores the user identity in the request context for downstream handlers."
      },
      {
        "type": "code",
        "title": "JWT Authentication Middleware with golang-jwt in Go",
        "language": "go",
        "code": "package auth\n\nimport (\n\t\"errors\"\n\t\"net/http\"\n\t\"strings\"\n\t\"time\"\n\n\t\"github.com/gin-gonic/gin\"\n\t\"github.com/golang-jwt/jwt/v5\"\n)\n\ntype CustomClaims struct {\n\tUserID string `json:\"user_id\"`\n\tRole   string `json:\"role\"`\n\tjwt.RegisteredClaims\n}\n\nfunc GenerateToken(userID, role, secretKey string) (string, error) {\n\tclaims := CustomClaims{\n\t\tUserID: userID,\n\t\tRole:   role,\n\t\tRegisteredClaims: jwt.RegisteredClaims{\n\t\t\tExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),\n\t\t\tIssuedAt:  jwt.NewNumericDate(time.Now()),\n\t\t\tIssuer:    \"backend-academy-go\",\n\t\t},\n\t}\n\ttoken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)\n\treturn token.SignedString([]byte(secretKey))\n}\n\nfunc AuthMiddleware(secretKey string) gin.HandlerFunc {\n\treturn func(c *gin.Context) {\n\t\tauthHeader := c.GetHeader(\"Authorization\")\n\t\tif authHeader == \"\" || !strings.HasPrefix(authHeader, \"Bearer \") {\n\t\t\tc.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{\"error\": \"Missing or malformed token\"})\n\t\t\treturn\n\t\t}\n\n\t\ttokenString := strings.TrimPrefix(authHeader, \"Bearer \")\n\t\ttoken, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(t *jwt.Token) (interface{}, error) {\n\t\t\tif _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {\n\t\t\t\treturn nil, errors.New(\"unexpected signing method\")\n\t\t\t}\n\t\t\treturn []byte(secretKey), nil\n\t\t})\n\n\t\tif err != nil || !token.Valid {\n\t\t\tc.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{\"error\": \"Invalid or expired token\"})\n\t\t\treturn\n\t\t}\n\n\t\tclaims, ok := token.Claims.(*CustomClaims)\n\t\tif !ok {\n\t\t\tc.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{\"error\": \"Invalid token claims\"})\n\t\t\treturn\n\t\t}\n\n\t\tc.Set(\"userID\", claims.UserID)\n\t\tc.Set(\"role\", claims.Role)\n\t\tc.Next()\n\t}\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Always Validate Signing Algorithm",
        "body": "Always check `t.Method.(*jwt.SigningMethodHMAC)` inside the key function. This prevents attackers from exploiting the 'none' algorithm or RSA-to-HMAC key substitution attacks."
      }
    ],
    "quiz": [
      {
        "id": "go-jwt-1",
        "question": "Why must the JWT key function in Go explicitly verify that token.Method matches the expected HMAC algorithm?",
        "options": [
          "To prevent algorithm switching attacks where an attacker crafts a token with the 'none' or public RSA key algorithm",
          "To speed up string parsing in the Go runtime",
          "To automatically convert the token into JSON format",
          "To notify the database of the user's login timestamp"
        ],
        "correctOptionIndex": 0,
        "explanation": "Without verifying token.Method, a malicious user could sign a token using a public RSA key as an HMAC secret or supply the 'none' algorithm to bypass signature validation entirely."
      }
    ]
  },
  {
    "slug": "go-goroutines-channels-concurrency",
    "title": "Concurrency Mastery: Goroutines, Buffered Channels & Worker Pools",
    "courseSlug": "go-backend-fundamentals",
    "moduleSlug": "go-distributed-systems",
    "moduleName": "Distributed Systems & High Concurrency",
    "order": 1,
    "category": "Go",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 22,
    "summary": "Master Go's Communicating Sequential Processes (CSP) concurrency model using goroutines, buffered channels, select statements, and worker pools.",
    "description": "Learn how to coordinate concurrent pipelines, prevent race conditions with sync.Mutex, and bound background concurrency with worker pool queues.",
    "learningPoints": [
      "Goroutine lightweight memory footprint (2KB initial stack)",
      "Unbuffered vs Buffered channels for synchronization and buffering",
      "Implementing fixed-size Worker Pools to prevent CPU and memory exhaustion",
      "Using sync.WaitGroup and select default cases for non-blocking channel reads"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Power of Go Concurrency",
        "body": "Unlike OS threads that require 2MB of memory, Goroutines start with a tiny 2KB contiguous stack that dynamically grows. Instead of sharing memory with complex locks, Go follows the CSP mantra: 'Do not communicate by sharing memory; instead, share memory by communicating.'"
      },
      {
        "type": "code",
        "title": "Production Worker Pool with Buffered Channels & WaitGroup",
        "language": "go",
        "code": "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n\t\"time\"\n)\n\ntype Job struct {\n\tID    int\n\tData  string\n}\n\ntype Result struct {\n\tJob    Job\n\tOutput string\n\tErr    error\n}\n\nfunc worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {\n\tdefer wg.Done()\n\tfor job := range jobs {\n\t\t// Simulate processing payload\n\t\ttime.Sleep(10 * time.Millisecond)\n\t\tresults <- Result{\n\t\t\tJob:    job,\n\t\t\tOutput: fmt.Sprintf(\"Worker %d processed job %d (%s)\", id, job.ID, job.Data),\n\t\t\tErr:    nil,\n\t\t}\n\t}\n}\n\nfunc main() {\n\tconst numJobs = 50\n\tconst numWorkers = 5\n\n\tjobs := make(chan Job, numJobs)\n\tresults := make(chan Result, numJobs)\n\n\tvar wg sync.WaitGroup\n\n\t// Launch worker pool\n\tfor w := 1; w <= numWorkers; w++ {\n\t\twg.Add(1)\n\t\tgo worker(w, jobs, results, &wg)\n\t}\n\n\t// Enqueue jobs\n\tfor j := 1; j <= numJobs; j++ {\n\t\tjobs <- Job{ID: j, Data: fmt.Sprintf(\"Payload_%d\", j)}\n\t}\n\tclose(jobs) // Notify workers that no more jobs will be sent\n\n\twg.Wait()\n\tclose(results)\n\n\tfor res := range results {\n\t\tfmt.Println(res.Output)\n\t}\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Always Close Senders, Never Receivers",
        "body": "In Go, only the sender should close a channel. Closing a channel from a receiver or closing an already closed channel causes a runtime panic."
      }
    ],
    "quiz": [
      {
        "id": "go-conc-1",
        "question": "What is the primary architectural purpose of implementing a Worker Pool rather than spawning an unbounded goroutine per incoming job?",
        "options": [
          "To bound memory and CPU consumption and prevent exhausting downstream database connection limits",
          "To disable garbage collection on background threads",
          "To convert asynchronous code into synchronous C code",
          "To encrypt channel messages in transit"
        ],
        "correctOptionIndex": 0,
        "explanation": "Spawning millions of unbounded goroutines can overwhelm database pools and exhaust memory. Worker pools restrict concurrency to a healthy, controlled ceiling."
      }
    ]
  },
  {
    "slug": "go-context-cancellation-timeout",
    "title": "Context Propagation, Deadlines & Goroutine Leak Prevention",
    "courseSlug": "go-backend-fundamentals",
    "moduleSlug": "go-distributed-systems",
    "moduleName": "Distributed Systems & High Concurrency",
    "order": 2,
    "category": "Go",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 20,
    "summary": "Master context.Context propagation across microservice RPCs, deadline timeouts, and preventing silent goroutine memory leaks.",
    "description": "Learn how context.WithTimeout, context.WithCancel, and select ctx.Done() enable graceful request termination when clients disconnect.",
    "learningPoints": [
      "context.Context tree propagation through HTTP and gRPC layers",
      "Setting strict timeouts with context.WithTimeout and context.WithDeadline",
      "Selecting on <-ctx.Done() to abort long-running SQL queries and HTTP requests",
      "Detecting and preventing orphaned goroutine memory leaks"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Context Propagation is Critical in Distributed Go",
        "body": "When a web user closes their browser or an upstream gateway times out, continuing to execute expensive database queries wastes precious server resources. Passing context.Context through every function allows Go services to halt immediately upon cancellation."
      },
      {
        "type": "code",
        "title": "Context Timeout & Goroutine Cancellation Pattern",
        "language": "go",
        "code": "package client\n\nimport (\n\t\"context\"\n\t\"errors\"\n\t\"net/http\"\n\t\"time\"\n)\n\nfunc FetchExternalServiceData(parentCtx context.Context, url string) (*http.Response, error) {\n\t// Derive child context with 2-second hard timeout\n\tctx, cancel := context.WithTimeout(parentCtx, 2*time.Second)\n\tdefer cancel() // Release context resources upon return\n\n\treq, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tif errors.Is(ctx.Err(), context.DeadlineExceeded) {\n\t\t\treturn nil, errors.New(\"external service request timed out after 2s\")\n\t\t}\n\t\tif errors.Is(ctx.Err(), context.Canceled) {\n\t\t\treturn nil, errors.New(\"client canceled request\")\n\t\t}\n\t\treturn nil, err\n\t}\n\n\treturn resp, nil\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Always Defer cancel()",
        "body": "Always call `defer cancel()` when creating contexts with timeout or cancel. If the work finishes before the timeout, calling cancel() immediately stops internal timers and releases memory."
      }
    ],
    "quiz": [
      {
        "id": "go-ctx-1",
        "question": "What happens if a Go function creates a context.WithTimeout() but forgets to invoke the returned cancel() function?",
        "options": [
          "The internal timer goroutine remains active in memory until the full duration expires, causing a transient resource leak",
          "The program crashes with a fatal segmentation fault",
          "The HTTP request hangs forever and never completes",
          "The Go compiler fails to build the binary"
        ],
        "correctOptionIndex": 0,
        "explanation": "If cancel() is not invoked upon function return, the context's internal timer and child pointers linger in memory until the deadline expires, causing memory churn."
      }
    ]
  },
  {
    "slug": "go-grpc-protobuf-services",
    "title": "High-Performance Distributed Microservices with gRPC & Protocol Buffers",
    "courseSlug": "gin-high-performance-apis",
    "moduleSlug": "go-distributed-systems",
    "moduleName": "Distributed Systems & High Concurrency",
    "order": 3,
    "category": "Go",
    "difficulty": "advanced",
    "xpReward": 160,
    "duration": 25,
    "summary": "Build ultra-low-latency inter-service communication with Protocol Buffers (Protobuf), HTTP/2 multiplexing, and gRPC servers in Go.",
    "description": "Master .proto schema definition, protoc-gen-go code generation, unary and bidirectional streaming RPCs, and gRPC interceptors.",
    "learningPoints": [
      "Defining strongly-typed API schemas with Protocol Buffers v3",
      "Unary RPCs vs Server/Client Streaming RPCs",
      "Implementing gRPC server handlers and error status codes with status.Error",
      "UnaryServerInterceptor for logging, tracing, and authentication"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why gRPC Outperforms REST in Microservices",
        "body": "REST APIs rely on bulky JSON text serialization and HTTP 1.1 head-of-line blocking. gRPC utilizes compact binary Protocol Buffer serialization over HTTP/2 persistent multiplexed connections, reducing network payload sizes by up to 80% and latency by 10x."
      },
      {
        "type": "code",
        "title": "Go gRPC Server Implementation with Protobuf",
        "language": "go",
        "code": "package main\n\nimport (\n\t\"context\"\n\t\"fmt\"\n\t\"net\"\n\n\t\"google.golang.org/grpc\"\n\t\"google.golang.org/grpc/codes\"\n\t\"google.golang.org/grpc/status\"\n)\n\n// Simplified mock interface representing generated protobuf service\ntype OrderRequest struct {\n\tOrderID string\n}\ntype OrderResponse struct {\n\tOrderID string\n\tStatus  string\n\tAmount  float64\n}\n\ntype OrderServiceServer struct{}\n\nfunc (s *OrderServiceServer) GetOrder(ctx context.Context, req *OrderRequest) (*OrderResponse, error) {\n\tif req.OrderID == \"\" {\n\t\treturn nil, status.Error(codes.InvalidArgument, \"OrderID cannot be empty\")\n\t}\n\n\treturn &OrderResponse{\n\t\tOrderID: req.OrderID,\n\t\tStatus:  \"DELIVERED\",\n\t\tAmount:  199.99,\n\t}, nil\n}\n\nfunc main() {\n\tlis, err := net.Listen(\"tcp\", \":50051\")\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n\tgrpcServer := grpc.NewServer()\n\t// Register service with server\n\tfmt.Println(\"gRPC Server listening on port 50051 over HTTP/2...\")\n\tif err := grpcServer.Serve(lis); err != nil {\n\t\tpanic(err)\n\t}\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Use Canonical gRPC Status Codes",
        "body": "Never return generic Go errors from gRPC handlers. Always return `status.Error(codes.NotFound, ...)` or `status.Error(codes.Unauthenticated, ...)` so client SDKs map errors reliably."
      }
    ],
    "quiz": [
      {
        "id": "go-grpc-1",
        "question": "What transport protocol does gRPC use by default for multiplexed bi-directional communication?",
        "options": [
          "HTTP/2 over persistent TCP connections",
          "HTTP/1.0 with raw text sockets",
          "WebSockets over TLS",
          "UDP datagram broadcast"
        ],
        "correctOptionIndex": 0,
        "explanation": "gRPC leverages HTTP/2 features including binary framing, header compression (HPACK), and multiplexing multiple concurrent RPCs over a single TCP connection."
      }
    ]
  },
  {
    "slug": "go-graceful-shutdown-monitoring",
    "title": "Graceful Shutdown, OS Signal Handling & Structured Logging (slog)",
    "courseSlug": "go-backend-fundamentals",
    "moduleSlug": "go-distributed-systems",
    "moduleName": "Distributed Systems & High Concurrency",
    "order": 4,
    "category": "Go",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 18,
    "summary": "Implement zero-downtime rolling deployments in Go using OS signal interception (SIGTERM/SIGINT), graceful server shutdown, and log/slog structured telemetry.",
    "description": "Learn how to drain in-flight HTTP requests gracefully when Kubernetes terminates pods, preventing dropped connections during deployments.",
    "learningPoints": [
      "Interception of POSIX OS signals (os.Interrupt, syscall.SIGTERM) with os/signal",
      "Graceful HTTP server draining using srv.Shutdown(ctx)",
      "High-performance structured logging with Go 1.21+ log/slog",
      "Prometheus metrics exposition with client_golang"
    ],
    "content": [
      {
        "type": "text",
        "title": "Zero-Downtime Deployments with Graceful Shutdown",
        "body": "When Kubernetes rolls out a new container version, it sends a SIGTERM signal to old pods. If the server terminates abruptly, ongoing customer checkout transactions will fail. Graceful shutdown stops accepting new TCP connections while allowing in-flight requests up to 30 seconds to finish."
      },
      {
        "type": "code",
        "title": "Graceful Server Shutdown & Structured slog Logging",
        "language": "go",
        "code": "package main\n\nimport (\n\t\"context\"\n\t\"log/slog\"\n\t\"net/http\"\n\t\"os\"\n\t\"os/signal\"\n\t\"syscall\"\n\t\"time\"\n)\n\nfunc main() {\n\t// Initialize structured JSON logger (standard library Go 1.21+)\n\tlogger := slog.New(slog.NewJSONHandler(os.Stdout, nil))\n\tslog.SetDefault(logger)\n\n\tmux := http.NewServeMux()\n\tmux.HandleFunc(\"/health\", func(w http.ResponseWriter, r *http.Request) {\n\t\tw.WriteHeader(http.StatusOK)\n\t\tw.Write([]byte(`{\"status\":\"ok\"}`))\n\t})\n\n\tserver := &http.Server{\n\t\tAddr:    \":8080\",\n\t\tHandler: mux,\n\t}\n\n\t// Run server in background goroutine\n\tgo func() {\n\t\tslog.Info(\"Server starting\", \"port\", 8080)\n\t\tif err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {\n\t\t\tslog.Error(\"Server error\", \"err\", err)\n\t\t\tos.Exit(1)\n\t\t}\n\t}()\n\n\t// Listen for termination signals\n\tstop := make(chan os.Signal, 1)\n\tsignal.Notify(stop, os.Interrupt, syscall.SIGTERM)\n\t<-stop\n\n\tslog.Info(\"Shutting down server gracefully...\")\n\n\t// 15-second grace period for in-flight requests\n\tctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)\n\tdefer cancel()\n\n\tif err := server.Shutdown(ctx); err != nil {\n\t\tslog.Error(\"Server forced to shutdown\", \"err\", err)\n\t} else {\n\t\tslog.Info(\"Server exited cleanly.\")\n\t}\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Use Structured slog Over fmt.Printf",
        "body": "Avoid using fmt.Println or raw log.Printf for backend logs. Use log/slog.Info() so log collectors (Elasticsearch, Datadog, Loki) can index JSON fields like 'userId' and 'duration' for instant querying."
      }
    ],
    "quiz": [
      {
        "id": "go-shut-1",
        "question": "What happens when srv.Shutdown(ctx) is called on a Go http.Server instance?",
        "options": [
          "It stops listening for new connections and waits for active in-flight requests to complete before closing",
          "It immediately kills all active goroutines and unmaps memory",
          "It reboots the operating system kernel",
          "It forwards active connections to port 443"
        ],
        "correctOptionIndex": 0,
        "explanation": "srv.Shutdown() closes the listener to prevent new requests, then waits for in-flight requests to return until the timeout context expires."
      }
    ]
  },
  {
    "slug": "php-laravel-api-architecture",
    "title": "Laravel 11 Application Architecture, Service Providers & Form Requests",
    "courseSlug": "laravel-web-apis",
    "moduleSlug": "php-laravel-foundations",
    "moduleName": "Laravel 11 REST API Engineering",
    "order": 1,
    "category": "PHP",
    "difficulty": "beginner",
    "xpReward": 120,
    "duration": 18,
    "summary": "Master modern Laravel 11 streamlined architecture, Service Container bindings, and declarative FormRequest validation.",
    "description": "Understand how Laravel 11 bootstrap files (bootstrap/app.php), Service Providers, and Form Requests isolate business logic from HTTP controller layers.",
    "learningPoints": [
      "Laravel 11 lightweight directory layout and middleware configuration in bootstrap/app.php",
      "Binding services into the IoC Service Container using AppServiceProvider",
      "Validating incoming API payloads cleanly using dedicated FormRequest classes",
      "API Resource transformation for consistent JSON output formatting"
    ],
    "content": [
      {
        "type": "text",
        "title": "Modern PHP & Laravel 11 API Architecture",
        "body": "Modern PHP 8.2+ is strongly typed with just-in-time (JIT) compilation. Laravel 11 streamlines configuration into a unified bootstrap pipeline. Dedicated FormRequest classes validate incoming data before the controller method executes, eliminating repetitive validation boilerplate."
      },
      {
        "type": "code",
        "title": "Laravel 11 Controller & FormRequest Validation",
        "language": "php",
        "code": "<?php\n\nnamespace App\\Http\\Requests;\n\nuse Illuminate\\Foundation\\Http\\FormRequest;\n\nclass StoreOrderRequest extends FormRequest\n{\n    public function authorize(): bool\n    {\n        return $this->user() !== null;\n    }\n\n    public function rules(): array\n    {\n        return [\n            'product_id' => ['required', 'uuid', 'exists:products,id'],\n            'quantity'   => ['required', 'integer', 'min:1', 'max:100'],\n            'currency'   => ['required', 'string', 'in:USD,EUR,GBP'],\n        ];\n    }\n}\n\nnamespace App\\Http\\Controllers\\Api;\n\nuse App\\Http\\Controllers\\Controller;\nuse App\\Http\\Requests\\StoreOrderRequest;\nuse App\\Http\\Resources\\OrderResource;\nuse App\\Services\\OrderService;\nuse Illuminate\\Http\\JsonResponse;\nuse Symfony\\Component\\HttpFoundation\\Response;\n\nclass OrderController extends Controller\n{\n    public function __construct(private readonly OrderService $orderService) {}\n\n    public function store(StoreOrderRequest $request): JsonResponse\n    {\n        $order = $this->orderService->createOrder(\n            $request->user(),\n            $request->validated()\n        );\n\n        return (new OrderResource($order))\n            ->response()\n            ->setStatusCode(Response::HTTP_CREATED);\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Always Use API Resources",
        "body": "Never return Eloquent models directly from controller actions. Always wrap models in JsonResource classes (OrderResource) to protect sensitive database columns (like password hashes or internal foreign keys) from accidental exposure."
      }
    ],
    "quiz": [
      {
        "id": "php-lar-1",
        "question": "What is the primary architectural purpose of using Laravel FormRequest classes instead of calling $request->validate() inside controllers?",
        "options": [
          "To separate authorization and validation rules from controller actions into single-responsibility classes",
          "To disable SQL queries for faster responses",
          "To convert PHP scripts into C++ binaries automatically",
          "To store form data in browser cookies"
        ],
        "correctOptionIndex": 0,
        "explanation": "FormRequests encapsulate authorization checks and validation rules cleanly, keeping controllers focused purely on delegating to business services."
      }
    ]
  },
  {
    "slug": "php-eloquent-relationships-eager",
    "title": "Eloquent ORM Masterclass: Eager Loading & Preventing N+1 Queries",
    "courseSlug": "laravel-web-apis",
    "moduleSlug": "php-laravel-foundations",
    "moduleName": "Laravel 11 REST API Engineering",
    "order": 2,
    "category": "PHP",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Master Eloquent ORM relationships (hasMany, belongsToMany, morphTo), query scopes, and eager loading with `with()` to prevent performance degradation.",
    "description": "Learn how naive lazy loading generates hundreds of database queries per request and how to enforce Model::preventLazyLoading() in development.",
    "learningPoints": [
      "Defining typed Eloquent relationships (HasMany, BelongsTo, BelongsToMany)",
      "Eliminating the N+1 query trap using `User::with(['orders.items'])` eager loading",
      "Constrained eager loading and subquery selects for high performance",
      "Enforcing strict database safety with `Model::preventLazyLoading()`"
    ],
    "content": [
      {
        "type": "text",
        "title": "Eliminating N+1 Queries in Eloquent",
        "body": "When iterating over 100 users and accessing `$user->profile->avatar`, Eloquent performs 1 initial query for users, followed by 100 individual queries for profiles (101 queries total). Eager loading with `User::with('profile')` loads all 100 profiles in a single `WHERE IN (...)` query (2 queries total)."
      },
      {
        "type": "code",
        "title": "Optimized Eloquent Model and Eager Loaded Query",
        "language": "php",
        "code": "<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\nuse Illuminate\\Database\\Eloquent\\Relations\\HasMany;\nuse Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;\nuse Illuminate\\Database\\Eloquent\\Builder;\n\nclass User extends Model\n{\n    protected $fillable = ['name', 'email', 'is_active'];\n\n    public function orders(): HasMany\n    {\n        return $this->hasMany(Order::class);\n    }\n\n    // Local query scope for reusable filtering\n    public function scopeActive(Builder $query): Builder\n    {\n        return $query->where('is_active', true);\n    }\n}\n\n// Controller Query Service\nnamespace App\\Services;\n\nuse App\\Models\\User;\nuse Illuminate\\Contracts\\Pagination\\LengthAwarePaginator;\n\nclass UserQueryService\n{\n    public function getActiveUsersWithRecentOrders(): LengthAwarePaginator\n    {\n        // Eager load related orders preventing N+1 bottleneck\n        return User::query()\n            ->active()\n            ->with(['orders' => function ($query) {\n                $query->latest()->limit(5);\n            }])\n            ->paginate(25);\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Enable preventLazyLoading in Development",
        "body": "Add `Model::preventLazyLoading(!app()->isProduction());` in AppServiceProvider. This throws an exception immediately whenever an un-eager-loaded relationship is accessed during local development."
      }
    ],
    "quiz": [
      {
        "id": "php-elo-1",
        "question": "How does calling User::with('orders')->get() resolve the N+1 query problem compared to lazy loading?",
        "options": [
          "It executes 2 SQL queries total: one for users, and one using WHERE user_id IN (...) for all associated orders",
          "It stores the entire SQL database in browser LocalStorage",
          "It converts relational tables into flat CSV files",
          "It disables foreign key verification"
        ],
        "correctOptionIndex": 0,
        "explanation": "Eager loading aggregates all parent primary keys and retrieves all matching children in a single indexed WHERE IN query, reducing total queries from N+1 down to 2."
      }
    ]
  },
  {
    "slug": "php-sanctum-token-auth",
    "title": "Stateless API Authentication with Laravel Sanctum & Token Abilities",
    "courseSlug": "laravel-web-apis",
    "moduleSlug": "php-laravel-foundations",
    "moduleName": "Laravel 11 REST API Engineering",
    "order": 3,
    "category": "PHP",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Secure Laravel APIs with Laravel Sanctum personal access tokens, token abilities, password hashing with Argon2id, and rate limiting.",
    "description": "Implement token issuance, token expiration, revocation on logout, and ability guards with `tokenCan('orders:create')`.",
    "learningPoints": [
      "Laravel Sanctum architecture for mobile and SPA authentication",
      "Issuing personal access tokens with granular abilities",
      "Restricting endpoints with `abilities` middleware (`auth:sanctum`, `ability:orders:create`)",
      "Revoking active tokens upon logout or password reset"
    ],
    "content": [
      {
        "type": "text",
        "title": "Sanctum Token Authentication Flow",
        "body": "Laravel Sanctum provides lightweight token authentication for APIs. Upon valid credentials verification, Sanctum issues a SHA-256 hashed bearer token stored in the database. Clients present this token in the `Authorization: Bearer <token>` header on subsequent requests."
      },
      {
        "type": "code",
        "title": "Sanctum Token Generation & Ability Guards",
        "language": "php",
        "code": "<?php\n\nnamespace App\\Http\\Controllers\\Api;\n\nuse App\\Http\\Controllers\\Controller;\nuse App\\Models\\User;\nuse Illuminate\\Http\\Request;\nuse Illuminate\\Support\\Facades\\Hash;\nuse Illuminate\\Validation\\ValidationException;\nuse Symfony\\Component\\HttpFoundation\\Response;\n\nclass AuthController extends Controller\n{\n    public function login(Request $request)\n    {\n        $request->validate([\n            'email'    => 'required|email',\n            'password' => 'required|string',\n        ]);\n\n        $user = User::where('email', $request->email)->first();\n\n        if (!$user || !Hash::check($request->password, $user->password)) {\n            throw ValidationException::withMessages([\n                'email' => ['The provided credentials do not match our records.'],\n            ]);\n        }\n\n        // Issue token with specific abilities and 7-day expiry\n        $token = $user->createToken('api-token', ['orders:create', 'orders:read'], now()->addDays(7));\n\n        return response()->json([\n            'token'      => $token->plainTextToken,\n            'token_type' => 'Bearer',\n            'expires_at' => now()->addDays(7)->toIso8601String(),\n            'user'       => [\n                'id'    => $user->id,\n                'email' => $user->email,\n            ]\n        ], Response::HTTP_OK);\n    }\n\n    public function logout(Request $request)\n    {\n        // Revoke the current token used for this request\n        $request->user()->currentAccessToken()->delete();\n        return response()->json(['message' => 'Logged out successfully']);\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Token Ability Enforcement",
        "body": "Protect sensitive routes with middleware: `Route::post('/orders', [...])->middleware(['auth:sanctum', 'ability:orders:create']);` to ensure tokens only execute permitted actions."
      }
    ],
    "quiz": [
      {
        "id": "php-sanc-1",
        "question": "How are Laravel Sanctum API tokens stored in the database for security?",
        "options": [
          "As one-way SHA-256 cryptographic hashes; the plaintext token is only shown once upon creation",
          "In plain unencrypted text",
          "Encrypted with Base64 encoding only",
          "In a public browser cookie"
        ],
        "correctOptionIndex": 0,
        "explanation": "Sanctum hashes the token with SHA-256 before saving it to the database, ensuring that a database compromise does not reveal valid user tokens."
      }
    ]
  },
  {
    "slug": "php-laravel-queues-redis",
    "title": "Asynchronous Background Jobs & Distributed Queues with Laravel & Redis",
    "courseSlug": "laravel-web-apis",
    "moduleSlug": "php-laravel-foundations",
    "moduleName": "Laravel 11 REST API Engineering",
    "order": 4,
    "category": "PHP",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Offload long-running tasks using Laravel Queue architecture, Redis drivers, job retries, backoff strategies, and Horizon monitoring.",
    "description": "Learn how to build idempotent background jobs, configure failed job dead-letter queues, and scale queue workers with Supervisor.",
    "learningPoints": [
      "Job dispatching with `ShouldQueue` interface and `dispatch()` helper",
      "Configuring Redis queue connection drivers for high throughput",
      "Exponential backoff retries ($backoff = [10, 60, 300]) and rate limiting",
      "Dead letter queue management and failed job alerting with Laravel Horizon"
    ],
    "content": [
      {
        "type": "text",
        "title": "High-Throughput Asynchronous Processing in PHP",
        "body": "Sending confirmation emails, generating PDF invoices, or calling third-party payment webhooks synchronously will stall PHP-FPM worker threads. Offloading these tasks to Redis queues ensures instantaneous API responses under 30ms."
      },
      {
        "type": "code",
        "title": "Production Laravel Queued Job with Exponential Backoff",
        "language": "php",
        "code": "<?php\n\nnamespace App\\Jobs;\n\nuse App\\Models\\Order;\nuse App\\Services\\PaymentGateway;\nuse Illuminate\\Bus\\Queueable;\nuse Illuminate\\Contracts\\Queue\\ShouldQueue;\nuse Illuminate\\Foundation\\Bus\\Dispatchable;\nuse Illuminate\\Queue\\InteractsWithQueue;\nuse Illuminate\\Queue\\SerializesModels;\nuse Illuminate\\Support\\Facades\\Log;\nuse Throwable;\n\nclass ProcessOrderPayment implements ShouldQueue\n{\n    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;\n\n    public int $tries = 3;\n    public array $backoff = [15, 60, 300]; // Exponential backoff in seconds\n    public int $timeout = 60;\n\n    public function __construct(public readonly Order $order) {}\n\n    public function handle(PaymentGateway $gateway): void\n    {\n        Log::info(\"Processing payment for Order #{$this->order->id}\");\n        \n        $success = $gateway->charge($this->order->customer_id, $this->order->total_cents);\n\n        if (!$success) {\n            throw new \\RuntimeException(\"Payment gateway declined transaction for Order #{$this->order->id}\");\n        }\n\n        $this->order->update(['status' => 'paid']);\n    }\n\n    public function failed(Throwable $exception): void\n    {\n        Log::error(\"Order #{$this->order->id} payment permanently failed: {$exception->getMessage()}\");\n        $this->order->update(['status' => 'payment_failed']);\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Always Use Idempotent Job Logic",
        "body": "Because queue workers may retry failed jobs, ensure jobs are idempotent (e.g. check if order is already marked 'paid' before recharging credit cards)."
      }
    ],
    "quiz": [
      {
        "id": "php-queue-1",
        "question": "What is the purpose of setting '$backoff = [15, 60, 300]' on a Laravel Queue Job class?",
        "options": [
          "It instructs the worker to wait 15s on first retry, 60s on second retry, and 300s on third retry before failing permanently",
          "It limits the maximum file size of PDF uploads",
          "It sets the database connection timeout to 15 milliseconds",
          "It pauses all API requests globally for 300 seconds"
        ],
        "correctOptionIndex": 0,
        "explanation": "Exponential backoff delays successive retries, giving transient third-party outages or rate limit windows time to recover before retrying."
      }
    ]
  },
  {
    "slug": "php-symfony-dependency-injection",
    "title": "Symfony Service Container, Autowiring & Compiler Passes",
    "courseSlug": "php-backend-fundamentals",
    "moduleSlug": "php-symfony-architecture",
    "moduleName": "Enterprise Symfony & Doctrine Engineering",
    "order": 1,
    "category": "PHP",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Master Symfony 7 Service Container architecture, autowiring, compiler passes, and environment-specific service configurations.",
    "description": "Learn how Symfony compiles its Dependency Injection container into optimized PHP classes at build-time, delivering micro-framework speed with enterprise flexibility.",
    "learningPoints": [
      "Symfony Service Container and autowiring resolution",
      "Constructor parameter binding using `#[Autowire]` and `#[TaggedIterator]` attributes",
      "Creating custom Compiler Passes for dynamic service registration",
      "Compiling the container for production performance"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Power of the Symfony Service Container",
        "body": "Symfony's Dependency Injection Component is widely considered the industry gold standard in PHP. At deployment time, Symfony analyzes the entire dependency graph and compiles it into a single highly-optimized static PHP class, eliminating runtime reflection overhead completely."
      },
      {
        "type": "code",
        "title": "Symfony Service with Autowiring & Tagged Iterators",
        "language": "php",
        "code": "<?php\n\nnamespace App\\Service;\n\nuse App\\Contract\\PaymentProviderInterface;\nuse Psr\\Log\\LoggerInterface;\nuse Symfony\\Component\\DependencyInjection\\Attribute\\TaggedIterator;\n\nclass PaymentManager\n{\n    /**\n     * @param iterable<PaymentProviderInterface> $providers\n     */\n    public function __construct(\n        #[TaggedIterator('app.payment_provider')]\n        private readonly iterable $providers,\n        private readonly LoggerInterface $logger\n    ) {}\n\n    public function process(string $gatewayName, float $amount): bool\n    {\n        foreach ($this->providers as $provider) {\n            if ($provider->supports($gatewayName)) {\n                $this->logger->info(\"Routing payment of \\${$amount} through {$gatewayName}\");\n                return $provider->charge($amount);\n            }\n        }\n\n        throw new \\InvalidArgumentException(\"Unsupported payment gateway: {$gatewayName}\");\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Zero-Overhead Compiled Container",
        "body": "In production, Symfony pre-compiles all DI definitions in `var/cache/prod/App_KernelProdContainer.php`. Direct PHP instantiation is executed without any runtime reflection."
      }
    ],
    "quiz": [
      {
        "id": "php-sym-1",
        "question": "How does Symfony achieve near zero runtime overhead for its Dependency Injection container in production?",
        "options": [
          "It pre-compiles the entire service dependency tree into a single static PHP class during cache warmup",
          "It disables type checking across all controllers",
          "It converts PHP into interpreted Bash scripts",
          "It uses global variables for all services"
        ],
        "correctOptionIndex": 0,
        "explanation": "Symfony compiles the container into raw, direct PHP constructor instantiation calls during the 'cache:warmup' build step, avoiding runtime reflection entirely."
      }
    ]
  },
  {
    "slug": "php-doctrine-orm-data-mapper",
    "title": "Doctrine 2 ORM: Data Mapper Pattern, Unit of Work & Repositories",
    "courseSlug": "php-backend-fundamentals",
    "moduleSlug": "php-symfony-architecture",
    "moduleName": "Enterprise Symfony & Doctrine Engineering",
    "order": 2,
    "category": "PHP",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Master Doctrine 2 ORM Data Mapper architecture, EntityManager lifecycle, Unit of Work transaction batching, and Repository design patterns.",
    "description": "Understand how the Data Mapper pattern decouples pure domain entities from database schemas, preventing database persistence logic from polluting domain objects.",
    "learningPoints": [
      "Data Mapper pattern vs Active Record architectural tradeoffs",
      "EntityManager and Unit of Work dirty-checking lifecycle (persist vs flush)",
      "Optimized DQL (Doctrine Query Language) and QueryBuilder execution",
      "Custom Entity Repositories and transactional isolation"
    ],
    "content": [
      {
        "type": "text",
        "title": "Data Mapper vs Active Record in Enterprise PHP",
        "body": "While Active Record (Eloquent) couples database operations directly onto model classes (`$user->save()`), Doctrine's Data Mapper maintains clean separation. Domain entities are pure PHP objects (POPOs) with no knowledge of SQL. The EntityManager manages persistence and executes batched updates during `$em->flush()`."
      },
      {
        "type": "code",
        "title": "Doctrine Entity Mapping with PHP 8.2 Attributes",
        "language": "php",
        "code": "<?php\n\nnamespace App\\Entity;\n\nuse App\\Repository\\CustomerRepository;\nuse Doctrine\\DBAL\\Types\\Types;\nuse Doctrine\\ORM\\Mapping as ORM;\n\n#[ORM\\Entity(repositoryClass: CustomerRepository::class)]\n#[ORM\\Table(name: 'customers')]\n#[ORM\\Index(columns: ['email'], name: 'idx_customer_email')]\nclass Customer\n{\n    #[ORM\\Id]\n    #[ORM\\GeneratedValue(strategy: 'IDENTITY')]\n    #[ORM\\Column(type: Types::INTEGER)]\n    private ?int $id = null;\n\n    #[ORM\\Column(type: Types::STRING, length: 180, unique: true)]\n    private string $email;\n\n    #[ORM\\Column(type: Types::DECIMAL, precision: 10, scale: 2)]\n    private string $creditBalance;\n\n    public function __construct(string $email, float $initialCredit = 0.0)\n    {\n        $this->email = $email;\n        $this->creditBalance = number_format($initialCredit, 2, '.', '');\n    }\n\n    public function getId(): ?int { return $this->id; }\n    public function getEmail(): string { return $this->email; }\n    public function getCreditBalance(): float { return (float) $this->creditBalance; }\n\n    public function deductCredit(float $amount): void\n    {\n        if ($this->getCreditBalance() < $amount) {\n            throw new \\DomainException(\"Insufficient credit balance.\");\n        }\n        $this->creditBalance = number_format($this->getCreditBalance() - $amount, 2, '.', '');\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Batching Flush Operations",
        "body": "Never call `$em->flush()` inside a high-iteration loop. Accumulate entity modifications with `$em->persist()` and call `$em->flush()` once per batch (e.g. every 500 records) to execute batched SQL statements."
      }
    ],
    "quiz": [
      {
        "id": "php-doc-1",
        "question": "What is the primary difference between the Data Mapper pattern (Doctrine) and the Active Record pattern (Eloquent)?",
        "options": [
          "Data Mapper keeps entity classes decoupled from database queries; Active Record models inherit direct database persistence methods",
          "Data Mapper only works with SQLite databases",
          "Active Record is written in C++ while Data Mapper is in Python",
          "Data Mapper requires disabling database indexes"
        ],
        "correctOptionIndex": 0,
        "explanation": "In Data Mapper, entities are pure domain objects with no database code. In Active Record, model objects represent a single database row and have built-in save(), delete(), and find() methods."
      }
    ]
  },
  {
    "slug": "php-composer-psr-standards",
    "title": "Modern PHP 8.2+ Standards: PSR-4, PSR-7, PSR-15 & Strict Typing",
    "courseSlug": "php-backend-fundamentals",
    "moduleSlug": "php-symfony-architecture",
    "moduleName": "Enterprise Symfony & Doctrine Engineering",
    "order": 3,
    "category": "PHP",
    "difficulty": "intermediate",
    "xpReward": 120,
    "duration": 18,
    "summary": "Master PHP-FIG standards (PSR-4 autoloading, PSR-7 HTTP messages, PSR-15 HTTP middleware) and PHP 8.2+ strict typing.",
    "description": "Learn how PSR standards enable interoperability between framework packages and how strict typing prevents runtime bugs.",
    "learningPoints": [
      "declare(strict_types=1) enforcement in production codebases",
      "PSR-4 autoloading rules and composer.json namespace mapping",
      "PSR-7 immutable ServerRequestInterface and ResponseInterface",
      "PSR-15 MiddlewareInterface pipeline execution"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Evolution of Modern PHP Standards",
        "body": "PHP-FIG (PHP Framework Interop Group) standards ensure that libraries written for Symfony, Laravel, or Slim work together seamlessly. PSR-7 defines immutable HTTP messages, while PSR-15 standardizes HTTP server middleware handlers."
      },
      {
        "type": "code",
        "title": "PSR-15 Compliant HTTP Middleware in PHP 8.2+",
        "language": "php",
        "code": "<?php\n\ndeclare(strict_types=1);\n\nnamespace App\\Middleware;\n\nuse Psr\\Http\\Message\\ResponseInterface;\nuse Psr\\Http\\Message\\ServerRequestInterface;\nuse Psr\\Http\\Server\\MiddlewareInterface;\nuse Psr\\Http\\Server\\RequestHandlerInterface;\nuse Nyholm\\Psr7\\Response;\n\nclass SecurityHeadersMiddleware implements MiddlewareInterface\n{\n    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface\n    {\n        // Execute downstream handler\n        $response = $handler->handle($request);\n\n        // Inject standard security hardening headers\n        return $response\n            ->withHeader('X-Frame-Options', 'DENY')\n            ->withHeader('X-Content-Type-Options', 'nosniff')\n            ->withHeader('Referrer-Policy', 'strict-origin-when-cross-origin')\n            ->withHeader('Content-Security-Policy', \"default-src 'self'\");\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Always Declare Strict Types",
        "body": "Add `declare(strict_types=1);` as the first line in every PHP file. This forces the PHP engine to reject type coercions (e.g. passing a string '123' to an int parameter), catching type mismatches at compile time."
      }
    ],
    "quiz": [
      {
        "id": "php-psr-1",
        "question": "What is the primary benefit of declaring 'declare(strict_types=1);' in PHP 8.2+ source files?",
        "options": [
          "It disables automatic type coercion and throws TypeError if argument types do not match function declarations exactly",
          "It forces PHP to run on a single CPU thread",
          "It compiles PHP scripts into Apache configuration files",
          "It prevents the server from logging errors"
        ],
        "correctOptionIndex": 0,
        "explanation": "Strict types ensure scalar parameters (string, int, float, bool) are not silently coerced by the engine, preventing subtle data corruption bugs."
      }
    ]
  },
  {
    "slug": "php-api-caching-redis",
    "title": "High-Performance Response Caching & Invalidation with Redis",
    "courseSlug": "php-backend-fundamentals",
    "moduleSlug": "php-symfony-architecture",
    "moduleName": "Enterprise Symfony & Doctrine Engineering",
    "order": 4,
    "category": "PHP",
    "difficulty": "advanced",
    "xpReward": 140,
    "duration": 20,
    "summary": "Implement sub-millisecond API response caching, tag-based invalidation, and distributed locks using Symfony Cache and Redis.",
    "description": "Learn how to use Redis cache tags to invalidate related entity collections instantly upon updates without flushing the entire cache.",
    "learningPoints": [
      "Symfony Cache Component with Redis adapter (Predis / phpredis)",
      "Tag-based cache invalidation (Invalidating all 'products' tags on update)",
      "Cache stampede prevention using probabilistic early expiration (Beta parameter)",
      "Distributed locks with Symfony Lock Component to prevent duplicate expensive calculations"
    ],
    "content": [
      {
        "type": "text",
        "title": "Sub-Millisecond Caching with Tagged Invalidation",
        "body": "For read-heavy microservice APIs, hitting PostgreSQL for catalog queries wastes CPU. Storing pre-rendered JSON in Redis drops response latency from 60ms to 2ms. Using Cache Tags allows instant targeted invalidation of only affected product caches when an item price changes."
      },
      {
        "type": "code",
        "title": "Tagged Redis Cache with Symfony TagAwareAdapter",
        "language": "php",
        "code": "<?php\n\nnamespace App\\Service;\n\nuse App\\Repository\\ProductRepository;\nuse Symfony\\Contracts\\Cache\\ItemInterface;\nuse Symfony\\Contracts\\Cache\\TagAwareCacheInterface;\n\nclass CachedProductCatalog\n{\n    public function __construct(\n        private readonly ProductRepository $repository,\n        private readonly TagAwareCacheInterface $cache\n    ) {}\n\n    public function getCategoryProducts(string $categoryId): array\n    {\n        $cacheKey = \"products_category_{$categoryId}\";\n\n        return $this->cache->get($cacheKey, function (ItemInterface $item) use ($categoryId) {\n            $item->expiresAfter(3600); // 1-hour TTL\n            $item->tag(['products', \"category_{$categoryId}\"]);\n\n            return $this->repository->findActiveByCategoryId($categoryId);\n        });\n    }\n\n    public function invalidateProductCategory(string $categoryId): void\n    {\n        // Instantly invalidates all cached keys associated with this category tag\n        $this->cache->invalidateTags([\"category_{$categoryId}\"]);\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Prevent Cache Stampedes",
        "body": "When a hot cache key expires, thousands of concurrent requests might hit the database simultaneously. Symfony Cache provides probabilistic early expiration to recompute cache keys in background threads before hard expiration."
      }
    ],
    "quiz": [
      {
        "id": "php-cache-1",
        "question": "What is the primary advantage of tag-based cache invalidation over simple key-based expiration in Redis?",
        "options": [
          "It allows invalidating multiple related cached items simultaneously using a shared tag name without knowing their exact individual keys",
          "It disables Redis memory persistence to disk",
          "It converts Redis memory into relational SQL tables",
          "It bypasses the operating system network stack"
        ],
        "correctOptionIndex": 0,
        "explanation": "Cache tagging associates multiple distinct cache entries with common tags, allowing instant invalidation of an entire collection (e.g. all products in Category 4) with a single call."
      }
    ]
  },
  {
    "slug": "rust-ownership-backend-safety",
    "title": "Rust Ownership, Borrowing & Thread Safety (Arc<Mutex<T>>)",
    "courseSlug": "rust-backend-fundamentals",
    "moduleSlug": "rust-systems-foundations",
    "moduleName": "Async Rust & Axum Microservices",
    "order": 1,
    "category": "Rust",
    "difficulty": "beginner",
    "xpReward": 130,
    "duration": 20,
    "summary": "Master Rust ownership, borrow checker lifetimes, and thread-safe shared state primitives (Arc, Mutex, RwLock) in backend architectures.",
    "description": "Understand how Rust guarantees memory safety and data-race freedom at compile time without a garbage collector.",
    "learningPoints": [
      "Ownership rules: single owner, move semantics, and Drop trait",
      "Borrow checker: mutable (&mut T) vs immutable (&T) reference invariants",
      "Thread-safe shared state using Arc<tokio::sync::RwLock<T>>",
      "Send and Sync traits for multi-threaded async task scheduling"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Rust Ownership Eliminates Backend CVEs",
        "body": "Traditional backend languages like C/C++ suffer from use-after-free bugs and data races, while Java/Go rely on garbage collectors that introduce unpredictable latency spikes. Rust's compile-time ownership system enforces memory safety with zero runtime overhead."
      },
      {
        "type": "code",
        "title": "Thread-Safe Shared Application State with Arc & Tokio RwLock",
        "language": "rust",
        "code": "use std::collections::HashMap;\nuse std::sync::Arc;\nuse tokio::sync::RwLock;\n\n#[derive(Debug, Clone)]\npub struct UserSession {\n    pub user_id: String,\n    pub role: String,\n}\n\n#[derive(Clone)]\npub struct AppState {\n    // Thread-safe shared in-memory session store across all worker threads\n    pub sessions: Arc<RwLock<HashMap<String, UserSession>>>,\n}\n\nimpl AppState {\n    pub fn new() -> Self {\n        Self {\n            sessions: Arc::new(RwLock::new(HashMap::new())),\n        }\n    }\n\n    pub async fn insert_session(&self, token: String, session: UserSession) {\n        let mut write_guard = self.sessions.write().await;\n        write_guard.insert(token, session);\n    }\n\n    pub async fn get_session(&self, token: &str) -> Option<UserSession> {\n        let read_guard = self.sessions.read().await;\n        read_guard.get(token).cloned()\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Use Tokio Async Locks, Not Std Mutex",
        "body": "In asynchronous Rust (Tokio/Axum), never hold a `std::sync::Mutex` guard across an `.await` point. Doing so blocks the Tokio worker thread. Always use `tokio::sync::Mutex` or `tokio::sync::RwLock`."
      }
    ],
    "quiz": [
      {
        "id": "rs-own-1",
        "question": "What is the primary architectural purpose of wrapping a shared data structure in Arc<RwLock<T>> in an async Rust web server?",
        "options": [
          "Arc provides atomic thread-safe reference counting; RwLock permits multiple concurrent async readers while enforcing exclusive write access",
          "It converts Rust data into JSON strings automatically",
          "It tells the Linux kernel to run the code in single-core mode",
          "It disables the borrow checker for faster compilation"
        ],
        "correctOptionIndex": 0,
        "explanation": "Arc (Atomic Reference Counted) allows multiple threads to hold references to the same heap allocation, while RwLock guarantees memory safety by permitting concurrent reads and exclusive writes."
      }
    ]
  },
  {
    "slug": "rust-tokio-async-runtime",
    "title": "Tokio Async Runtime, Tasks & Non-Blocking I/O Architecture",
    "courseSlug": "rust-backend-fundamentals",
    "moduleSlug": "rust-systems-foundations",
    "moduleName": "Async Rust & Axum Microservices",
    "order": 2,
    "category": "Rust",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 22,
    "summary": "Master the Tokio async runtime, green-thread task spawning (tokio::spawn), cooperative scheduling, and non-blocking TCP socket handling.",
    "description": "Learn how Tokio's multi-threaded work-stealing scheduler drives thousands of concurrent asynchronous tasks with zero CPU waste.",
    "learningPoints": [
      "Tokio multi-threaded scheduler architecture and reactor pattern",
      "Spawning background tasks with `tokio::spawn` and managing JoinHandle",
      "Coordinating async tasks using `tokio::select!` and `tokio::join!`",
      "Offloading CPU-bound blocking work with `tokio::task::spawn_blocking`"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Tokio Asynchronous Engine",
        "body": "In Rust, async functions compile into state machines implementing the `Future` trait. Futures do nothing unless polled by an executor. Tokio provides a multi-threaded work-stealing executor that polls futures when OS epoll/kqueue events notify that sockets are ready for reading or writing."
      },
      {
        "type": "code",
        "title": "High-Concurrency Async Worker Pipeline with Tokio",
        "language": "rust",
        "code": "use std::time::Duration;\nuse tokio::time::sleep;\n\nasync fn process_item(item_id: u32) -> Result<String, String> {\n    // Simulate non-blocking I/O network call\n    sleep(Duration::from_millis(50)).await;\n    Ok(format!(\"Item {} processed successfully\", item_id))\n}\n\n#[tokio::main]\nasync fn main() {\n    let mut handles = Vec::new();\n\n    // Spawn 100 lightweight concurrent async tasks\n    for id in 1..=100 {\n        let handle = tokio::spawn(async move {\n            match process_item(id).await {\n                Ok(msg) => msg,\n                Err(err) => format!(\"Error on {}: {}\", id, err),\n            }\n        });\n        handles.push(handle);\n    }\n\n    // Await all concurrent tasks\n    for handle in handles {\n        if let Ok(result) = handle.await {\n            println!(\"{}\", result);\n        }\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Never Block in Async Contexts",
        "body": "If you need to perform heavy CPU computations (e.g. image hashing, cryptographic keygen) or synchronous file I/O, wrap the code in `tokio::task::spawn_blocking()` to prevent stalling the async executor event loop."
      }
    ],
    "quiz": [
      {
        "id": "rs-tok-1",
        "question": "What is the recommended approach in Tokio for executing a CPU-intensive synchronous task without stalling the async worker thread pool?",
        "options": [
          "Wrap the synchronous computation in tokio::task::spawn_blocking()",
          "Call thread::sleep() inside the async function",
          "Disable Tokio and use raw Linux pthreads",
          "Convert the code into an infinite loop"
        ],
        "correctOptionIndex": 0,
        "explanation": "tokio::task::spawn_blocking dispatches blocking CPU work to a dedicated secondary thread pool, keeping the primary async event loop free to handle network I/O."
      }
    ]
  },
  {
    "slug": "rust-axum-routing-extractors",
    "title": "REST API Engineering with Axum, Extractors & Fallible Handlers",
    "courseSlug": "axum-high-performance-apis",
    "moduleSlug": "rust-systems-foundations",
    "moduleName": "Async Rust & Axum Microservices",
    "order": 3,
    "category": "Rust",
    "difficulty": "intermediate",
    "xpReward": 150,
    "duration": 22,
    "summary": "Build modular web services with Axum, strongly typed extractors (Path, Query, Json, State), and custom error handling using IntoResponse.",
    "description": "Learn how Axum leverages Tower middleware, macro-free routing, and compile-time extractor validation for high-speed APIs.",
    "learningPoints": [
      "Axum Router setup, nesting, and fallback handlers",
      "Type-safe request extraction with `Json<T>`, `Path<T>`, `Query<T>`, and `State<T>`",
      "Building a centralized error enum with `thiserror` and `IntoResponse`",
      "Adding CORS, Tracing, and Compression middleware with Tower"
    ],
    "content": [
      {
        "type": "text",
        "title": "Type-Safe Web Routing with Axum",
        "body": "Axum is the premier web framework from the Tokio team. Unlike frameworks that rely on heavy procedural macros, Axum handlers are standard async Rust functions. If an extractor argument (like `Json<CreateUserDto>`) fails deserialization, Axum rejects the request before the handler body is entered."
      },
      {
        "type": "code",
        "title": "Production Axum REST Controller with Error Conversion",
        "language": "rust",
        "code": "use axum::{\n    extract::{Path, State},\n    http::StatusCode,\n    response::{IntoResponse, Response},\n    routing::{get, post},\n    Json, Router,\n};\nuse serde::{Deserialize, Serialize};\nuse std::sync::Arc;\n\n#[derive(Serialize, Deserialize)]\npub struct CreateUserDto {\n    pub username: String,\n    pub email: String,\n}\n\n#[derive(Serialize)]\npub struct UserResponse {\n    pub id: String,\n    pub username: String,\n    pub email: String,\n}\n\npub enum AppError {\n    UserNotFound,\n    InvalidInput(String),\n}\n\nimpl IntoResponse for AppError {\n    fn into_response(self) -> Response {\n        let (status, msg) = match self {\n            AppError::UserNotFound => (StatusCode::NOT_FOUND, \"User not found\"),\n            AppError::InvalidInput(ref err) => (StatusCode::BAD_REQUEST, err.as_str()),\n        };\n        (status, Json(serde_json::json!({ \"error\": msg }))).into_response()\n    }\n}\n\nasync fn create_user_handler(\n    Json(payload): Json<CreateUserDto>,\n) -> Result<(StatusCode, Json<UserResponse>), AppError> {\n    if payload.email.is_empty() {\n        return Err(AppError::InvalidInput(\"Email is required\".into()));\n    }\n\n    let response = UserResponse {\n        id: uuid::Uuid::new_v4().to_string(),\n        username: payload.username,\n        email: payload.email,\n    };\n\n    Ok((StatusCode::CREATED, Json(response)))\n}\n\npub fn app_router() -> Router {\n    Router::new()\n        .route(\"/api/v1/users\", post(create_user_handler))\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Extractor Ordering Rule in Axum",
        "body": "In Axum, extractors that consume the request body (e.g. `Json<T>` or `Bytes`) must always be the final parameter in the handler function signature."
      }
    ],
    "quiz": [
      {
        "id": "rs-axum-1",
        "question": "Why must body-consuming extractors like Json<T> be placed as the last parameter in an Axum handler signature?",
        "options": [
          "Because the HTTP request body stream can only be consumed once; subsequent extractors would find the body empty",
          "Because Rust does not support functions with more than two arguments",
          "Because Tokio compiles handlers from right to left",
          "Because the JSON parser requires alphabetical argument ordering"
        ],
        "correctOptionIndex": 0,
        "explanation": "HTTP request bodies are streaming buffers. Axum consumes the stream to parse JSON; placing another extractor after Json<T> would result in a missing body error."
      }
    ]
  },
  {
    "slug": "rust-sqlx-async-postgres",
    "title": "Compile-Time Verified SQL Queries with SQLx & Async PostgreSQL",
    "courseSlug": "axum-high-performance-apis",
    "moduleSlug": "rust-systems-foundations",
    "moduleName": "Async Rust & Axum Microservices",
    "order": 4,
    "category": "Rust",
    "difficulty": "advanced",
    "xpReward": 160,
    "duration": 25,
    "summary": "Master compile-time verified SQL queries, async connection pooling (PgPool), and ACID transactions using SQLx in Rust.",
    "description": "Learn how SQLx connects to PostgreSQL during `cargo build` to verify query syntax and column types against the real database schema.",
    "learningPoints": [
      "Configuring `sqlx::PgPool` connection pooling with SSL/TLS options",
      "Compile-time query verification using `sqlx::query_as!` macro",
      "Executing transactional operations with `pool.begin().await?`",
      "Running database schema migrations automatically at application startup"
    ],
    "content": [
      {
        "type": "text",
        "title": "Compile-Time Verified SQL: No More Runtime Column Typo Crashes",
        "body": "Unlike ORMs that introduce translation overhead or raw drivers that fail at runtime when a column name is misspelled, SQLx validates raw SQL queries against your database schema during compilation. If a column type or name is invalid, `cargo build` fails immediately."
      },
      {
        "type": "code",
        "title": "Compile-Time Verified SQLx Repository in Rust",
        "language": "rust",
        "code": "use sqlx::{PgPool, FromRow};\nuse uuid::Uuid;\n\n#[derive(Debug, FromRow, serde::Serialize)]\npub struct Account {\n    pub id: Uuid,\n    pub email: String,\n    pub balance: f64,\n}\n\npub struct AccountRepository {\n    pool: PgPool,\n}\n\nimpl AccountRepository {\n    pub fn new(pool: PgPool) -> Self {\n        Self { pool }\n    }\n\n    pub async fn find_by_email(&self, email: &str) -> Result<Option<Account>, sqlx::Error> {\n        let account = sqlx::query_as!(\n            Account,\n            r#\"\n            SELECT id, email, balance\n            FROM accounts\n            WHERE email = $1\n            \"#,\n            email\n        )\n        .fetch_optional(&self.pool)\n        .await?;\n\n        Ok(account)\n    }\n\n    pub async fn transfer_funds(&self, from: Uuid, to: Uuid, amount: f64) -> Result<(), sqlx::Error> {\n        let mut tx = self.pool.begin().await?;\n\n        sqlx::query!(\n            \"UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1\",\n            amount,\n            from\n        )\n        .execute(&mut *tx)\n        .await?;\n\n        sqlx::query!(\n            \"UPDATE accounts SET balance = balance + $1 WHERE id = $2\",\n            amount,\n            to\n        )\n        .execute(&mut *tx)\n        .await?;\n\n        tx.commit().await?;\n        Ok(())\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Offline Query Caching with sqlx-data.json",
        "body": "Run `cargo sqlx prepare` to generate a `sqlx-data.json` cache. This allows CI/CD deployment pipelines to compile your application with full type verification without needing a live database connection."
      }
    ],
    "quiz": [
      {
        "id": "rs-sqlx-1",
        "question": "How does the sqlx::query_as! macro ensure type safety for SQL queries in Rust?",
        "options": [
          "It connects to the database schema during 'cargo build' to verify SQL syntax and map PostgreSQL types directly to Rust struct fields",
          "It translates SQL into MongoDB JavaScript commands",
          "It converts all database tables into flat memory buffers",
          "It disables SQL transactions"
        ],
        "correctOptionIndex": 0,
        "explanation": "SQLx queries the real database schema at compile time, ensuring that column names, types, and nullability match the Rust struct fields exactly before emitting binary code."
      }
    ]
  },
  {
    "slug": "rust-actix-actor-model",
    "title": "Actix Web Architecture, App State & Multi-Threaded Workers",
    "courseSlug": "axum-high-performance-apis",
    "moduleSlug": "rust-actix-architecture",
    "moduleName": "Memory-Safe Distributed Systems with Actix",
    "order": 1,
    "category": "Rust",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Master Actix Web architecture, per-worker App state factories (web::Data), multi-threaded HTTP server pipelines, and request routing.",
    "description": "Understand how Actix Web runs multiple independent worker threads, each with its own local App instance, achieving millions of requests per second.",
    "learningPoints": [
      "Actix Web multi-threaded worker model (1 worker per CPU core)",
      "App state management with `web::Data<T>`",
      "Route definitions using `web::resource` and service macros (`#[get]`, `#[post]`)",
      "Graceful server shutdown with `HttpServer::run` and OS signal binding"
    ],
    "content": [
      {
        "type": "text",
        "title": "Actix Web Multi-Core Architecture",
        "body": "Actix Web spawns an event-loop worker per logical CPU core. The closure passed to `HttpServer::new(|| App::new()...)` executes once per worker. Wrapping shared resources in `web::Data<T>` (internally an Arc) provides thread-safe access across all core workers."
      },
      {
        "type": "code",
        "title": "High-Throughput Actix Web Application with Shared State",
        "language": "rust",
        "code": "use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};\nuse serde::{Deserialize, Serialize};\nuse std::sync::atomic::{AtomicUsize, Ordering};\n\npub struct ServerMetrics {\n    pub request_count: AtomicUsize,\n}\n\n#[derive(Serialize)]\nstruct HealthStatus {\n    status: &'static str,\n    total_requests: usize,\n}\n\n#[get(\"/health\")]\nasync fn health_check(data: web::Data<ServerMetrics>) -> impl Responder {\n    let count = data.request_count.fetch_add(1, Ordering::Relaxed);\n    HttpResponse::Ok().json(HealthStatus {\n        status: \"healthy\",\n        total_requests: count + 1,\n    })\n}\n\n#[actix_web::main]\nasync fn main() -> std::io::Result<()> {\n    let metrics = web::Data::new(ServerMetrics {\n        request_count: AtomicUsize::new(0),\n    });\n\n    println!(\"Starting Actix Web server on http://127.0.0.1:8080\");\n\n    HttpServer::new(move || {\n        App::new()\n            .app_data(metrics.clone())\n            .service(health_check)\n    })\n    .bind((\"127.0.0.1\", 8080))?\n    .run()\n    .await\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Clone web::Data Outside the Closure",
        "body": "Instantiate `web::Data::new(...)` outside `HttpServer::new`, and clone the handle inside the closure. This shares the same underlying atomic instance across all worker threads."
      }
    ],
    "quiz": [
      {
        "id": "rs-act-1",
        "question": "Why does HttpServer::new take a closure rather than a direct App instance in Actix Web?",
        "options": [
          "To construct an isolated App instance for each worker thread, maximizing thread-local performance",
          "To force the server to restart every 10 seconds",
          "To bypass the Rust borrow checker",
          "To allow multiple versions of Rust to run concurrently"
        ],
        "correctOptionIndex": 0,
        "explanation": "Actix Web runs a dedicated event loop per CPU core. The closure runs once per worker thread, initializing thread-local resources for peak parallel throughput."
      }
    ]
  },
  {
    "slug": "rust-jwt-auth-tower-middleware",
    "title": "Tower Service Trait & Custom Authentication Middleware in Rust",
    "courseSlug": "axum-high-performance-apis",
    "moduleSlug": "rust-actix-architecture",
    "moduleName": "Memory-Safe Distributed Systems with Actix",
    "order": 2,
    "category": "Rust",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Build composable, reusable authentication and security middleware using the Tower Service trait and jsonwebtoken in Rust.",
    "description": "Learn how the Tower abstraction (`Service<Request> -> Future<Response>`) powers the entire Rust networking ecosystem across Axum, Actix, and Tonic.",
    "learningPoints": [
      "The Tower `Service` trait mechanics: `poll_ready` and `call`",
      "Building a custom JWT verification Layer and Service",
      "Extracting cryptographic claims and attaching them to Request extensions",
      "Short-circuiting unauthorized requests with immediate HTTP 401 responses"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Unified Tower Ecosystem in Rust",
        "body": "Tower standardizes asynchronous request/response processing in Rust. A Layer decorates a Service, allowing developers to compose rate limiting, timeout handling, authentication, and logging into clean, reusable pipelines."
      },
      {
        "type": "code",
        "title": "Stateless JWT Claims Validation with jsonwebtoken",
        "language": "rust",
        "code": "use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};\nuse serde::{Deserialize, Serialize};\n\n#[derive(Debug, Serialize, Deserialize, Clone)]\npub struct Claims {\n    pub sub: String,\n    pub role: String,\n    pub exp: usize,\n}\n\npub fn verify_jwt(token: &str, secret: &[u8]) -> Result<Claims, jsonwebtoken::errors::Error> {\n    let mut validation = Validation::new(Algorithm::HS256);\n    validation.validate_exp = true;\n\n    let token_data = decode::<Claims>(\n        token,\n        &DecodingKey::from_secret(secret),\n        &validation,\n    )?;\n\n    Ok(token_data.claims)\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Always Validate Expiration",
        "body": "Ensure `validation.validate_exp = true` is enabled (default in jsonwebtoken) and avoid accepting tokens signed with unverified asymmetric algorithms."
      }
    ],
    "quiz": [
      {
        "id": "rs-tow-1",
        "question": "What is the primary role of the Tower crate in the Rust backend ecosystem?",
        "options": [
          "Providing a standardized Service trait abstraction for composing asynchronous middleware layers",
          "Translating Rust into Python bytecode",
          "Managing Linux kernel virtual memory pages",
          "Automating database table backups"
        ],
        "correctOptionIndex": 0,
        "explanation": "Tower defines standard interfaces for async clients and servers, allowing middleware like rate limiters, tracing, and auth guards to be shared across Axum, Tonic, and Hyper."
      }
    ]
  },
  {
    "slug": "rust-serde-json-serialization",
    "title": "High-Performance JSON Serialization & Zero-Copy Deserialization with Serde",
    "courseSlug": "rust-backend-fundamentals",
    "moduleSlug": "rust-actix-architecture",
    "moduleName": "Memory-Safe Distributed Systems with Actix",
    "order": 3,
    "category": "Rust",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 18,
    "summary": "Master Serde serialization and deserialization, zero-copy borrowing with `&'de str`, custom visitors, and schema transformations.",
    "description": "Learn how Serde achieves near-instantaneous JSON parsing without runtime reflection by generating compile-time serializer/deserializer code.",
    "learningPoints": [
      "Serde derive macros: `#[derive(Serialize, Deserialize)]`",
      "Zero-copy string borrowing using `&'a str` and `Cow<'a, str>` to eliminate heap allocations",
      "Serde attributes: `rename_all = \"camelCase\"`, `default`, `skip_serializing_if`",
      "Custom serializer and deserializer functions for custom timestamp and enum formats"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Serde is Unrivaled in Speed",
        "body": "Traditional JSON parsers (like Python's json module or Jackson in Java) perform runtime reflection and allocate intermediate objects. Serde generates static compile-time deserialization code, directly parsing bytes into struct memory. By using `&'de str`, Serde references the original HTTP byte buffer directly without allocating new `String` objects on the heap."
      },
      {
        "type": "code",
        "title": "Zero-Copy Serde JSON Struct with Strict Validation Attributes",
        "language": "rust",
        "code": "use serde::{Deserialize, Serialize};\nuse std::borrow::Cow;\n\n#[derive(Serialize, Deserialize, Debug)]\n#[serde(rename_all = \"camelCase\")]\npub struct PaymentWebhook<'a> {\n    // Zero-copy string slice referencing incoming payload bytes directly!\n    pub event_id: &'a str,\n    pub event_type: Cow<'a, str>,\n    pub amount_cents: u64,\n    pub currency: &'a str,\n\n    #[serde(default)]\n    pub is_test_mode: bool,\n\n    #[serde(skip_serializing_if = \"Option::is_none\")]\n    pub metadata: Option<serde_json::Value>,\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Zero-Copy Lifetime Rule",
        "body": "When using `&'a str` in a Serde struct, the struct cannot outlive the raw byte buffer from which it was parsed. If the struct must be stored across async task boundaries, use `String` or `Cow<'a, str>`."
      }
    ],
    "quiz": [
      {
        "id": "rs-serde-1",
        "question": "How does zero-copy deserialization in Serde improve JSON parsing performance in Rust?",
        "options": [
          "It borrows string slices (&'de str) directly from the incoming input byte buffer without allocating heap memory for new String instances",
          "It ignores invalid JSON syntax to speed up parsing",
          "It forces the CPU to run at double clock speed",
          "It disables UTF-8 string encoding verification"
        ],
        "correctOptionIndex": 0,
        "explanation": "Zero-copy deserialization references byte ranges within the input buffer directly, completely eliminating memory allocation overhead on the heap."
      }
    ]
  },
  {
    "slug": "rust-production-distroless-docker",
    "title": "Ultra-Minimal Distroless Docker Builds & Microservice Deployment",
    "courseSlug": "rust-backend-fundamentals",
    "moduleSlug": "rust-actix-architecture",
    "moduleName": "Memory-Safe Distributed Systems with Actix",
    "order": 4,
    "category": "Rust",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 20,
    "summary": "Package Rust microservices into ultra-minimal, hardened 15MB container images using multi-stage builds and Google Distroless base images.",
    "description": "Learn how to strip debug symbols, statically link with musl/glibc, and run non-root containers with zero shell or package manager vulnerabilities.",
    "learningPoints": [
      "Multi-stage Dockerfile architecture for compiled Rust binaries",
      "Static linking with `x86_64-unknown-linux-musl` target",
      "Stripping binary symbols with `strip` to reduce binary size by 70%",
      "Deploying onto `gcr.io/distroless/cc-debian12` or `scratch` with non-root UID"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Gold Standard for Microservice Security",
        "body": "Because Rust compiles to standalone native machine code, a production container does not need Python, Node.js, bash, or apt. Using Google Distroless or Docker `scratch` creates a tiny 15MB container containing only your binary and TLS CA certificates, eliminating 99% of container CVEs."
      },
      {
        "type": "code",
        "title": "Multi-Stage Distroless Dockerfile for Rust Microservices",
        "language": "dockerfile",
        "code": "# Stage 1: Build & Compile\nFROM rust:1.77-slim AS builder\nWORKDIR /app\n\n# Cache dependencies by copying Cargo files first\nCOPY Cargo.toml Cargo.lock ./\nRUN mkdir src && echo \"fn main() {}\" > src/main.rs && cargo build --release && rm -rf src\n\n# Copy real source and compile release binary\nCOPY src ./src\nRUN cargo build --release --locked && strip target/release/server\n\n# Stage 2: Minimal Distroless Production Image\nFROM gcr.io/distroless/cc-debian12:nonroot\nWORKDIR /app\n\n# Copy stripped native binary\nCOPY --from=builder /app/target/release/server /app/server\n\nEXPOSE 8080\nUSER nonroot:nonroot\n\nENTRYPOINT [\"/app/server\"]"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Dependency Caching Trick",
        "body": "Always build a dummy `src/main.rs` with `cargo build --release` before copying your actual source files. This ensures Docker caches heavy crate compilations when only your business logic changes."
      }
    ],
    "quiz": [
      {
        "id": "rs-doc-1",
        "question": "What is the major security advantage of using Google Distroless or scratch Docker images for Rust services?",
        "options": [
          "They contain no shell (bash/sh), package managers (apt), or system utilities, drastically reducing the vulnerability attack surface",
          "They automatically compress database tables",
          "They disable network firewalls inside the container",
          "They allow Rust code to run without memory safety"
        ],
        "correctOptionIndex": 0,
        "explanation": "Distroless images contain only the compiled application and minimal runtime libraries, making it nearly impossible for attackers to execute arbitrary shell commands."
      }
    ]
  },
  {
    "slug": "ruby-rails-api-mode",
    "title": "Rails 7 API-Only Architecture & Resource Routing",
    "courseSlug": "rails-rapid-api-development",
    "moduleSlug": "ruby-rails-api-foundations",
    "moduleName": "Ruby on Rails 7 API Architecture",
    "order": 1,
    "category": "Ruby",
    "difficulty": "beginner",
    "xpReward": 120,
    "duration": 18,
    "summary": "Master Rails 7 in API-only mode (`rails new my_api --api`), ActionController::API lightweight middleware stack, and RESTful resource routing.",
    "description": "Learn how Rails API mode strips away heavy view generation and cookie middleware, providing a streamlined JSON backend engine.",
    "learningPoints": [
      "Rails API-only mode architecture and stripped Rack middleware stack",
      "ActionController::API vs ActionController::Base differences",
      "RESTful routing with `namespace :api do namespace :v1 do resources ...`",
      "Strong Parameters pattern for mass-assignment attack prevention"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Rails API Mode Excels for Modern Backends",
        "body": "Traditional Rails includes asset compilation, ERB view engines, and session cookies. Running Rails in API mode (`--api`) removes over 20 unnecessary Rack middleware layers, giving you Active Record ORM power and convention-over-configuration speed with low memory footprint."
      },
      {
        "type": "code",
        "title": "Rails 7 API Controller with Strong Parameters",
        "language": "ruby",
        "code": "# app/controllers/api/v1/orders_controller.rb\nmodule Api\n  module V1\n    class OrdersController < ActionController::API\n      before_action :set_order, only: [:show, :update, :destroy]\n\n      # GET /api/v1/orders\n      def index\n        @orders = Order.where(user_id: current_user.id).limit(20)\n        render json: @orders, status: :ok\n      end\n\n      # POST /api/v1/orders\n      def create\n        @order = Order.new(order_params.merge(user_id: current_user.id))\n\n        if @order.save\n          render json: @order, status: :created\n        else\n          render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity\n        end\n      end\n\n      private\n\n      def set_order\n        @order = Order.find_by!(id: params[:id], user_id: current_user.id)\n      rescue ActiveRecord::RecordNotFound\n        render json: { error: \"Order not found\" }, status: :not_found\n      end\n\n      # Strong parameters prevent mass-assignment vulnerabilities\n      def order_params\n        params.require(:order).permit(:total_amount, :currency, items_attributes: [:product_id, :quantity])\n      end\n    end\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Always Use Strong Parameters",
        "body": "Never pass raw `params` or `params[:order]` directly to Active Record `.create()` or `.update()`. Attackers can inject forbidden fields like `is_admin: true` to escalate privileges."
      }
    ],
    "quiz": [
      {
        "id": "rb-api-1",
        "question": "What is the primary architectural purpose of the Strong Parameters pattern in Rails controllers?",
        "options": [
          "To explicitly whitelist permitted request parameters and prevent malicious mass-assignment vulnerability attacks",
          "To encrypt database passwords with AES-256",
          "To speed up Ruby string interpolation",
          "To translate Ruby into C++ code"
        ],
        "correctOptionIndex": 0,
        "explanation": "Strong Parameters require developers to declare exactly which keys are permitted (`permit(:title, :body)`), preventing users from modifying protected database columns."
      }
    ]
  },
  {
    "slug": "ruby-active-record-optimizations",
    "title": "Active Record Deep Dive: Query Optimization & strict_loading",
    "courseSlug": "rails-rapid-api-development",
    "moduleSlug": "ruby-rails-api-foundations",
    "moduleName": "Ruby on Rails 7 API Architecture",
    "order": 2,
    "category": "Ruby",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Master Active Record query performance, eliminating N+1 queries with `includes()` and enforcing zero-lazy-loading with `strict_loading`.",
    "description": "Learn how Active Record executes SQL queries, when to use `preload` vs `eager_load`, and how to optimize large datasets with `find_each` batching.",
    "learningPoints": [
      "Understanding Active Record query generation: `includes`, `preload`, and `eager_load`",
      "Enforcing zero-N+1 query safety using Rails 7 `strict_loading` mode",
      "Processing millions of records without memory bloat using `find_each` and `in_batches`",
      "Database transaction callbacks (`after_commit` vs `after_save`)"
    ],
    "content": [
      {
        "type": "text",
        "title": "High-Performance Active Record Queries",
        "body": "Active Record provides incredible productivity, but naive association traversal can execute hundreds of SQL queries. Rails 7 introduced `strict_loading`, which raises an `ActiveRecord::StrictLoadingViolationError` whenever code attempts to lazy-load an un-eager-loaded association."
      },
      {
        "type": "code",
        "title": "Optimized Active Record Query Service with strict_loading",
        "language": "ruby",
        "code": "# app/services/order_report_service.rb\nclass OrderReportService\n  def self.generate_daily_summary(date)\n    # strict_loading guarantees that accessing .customer or .items won't trigger hidden N+1 queries\n    Order.strict_loading\n         .includes(:customer, order_items: :product)\n         .where(created_at: date.all_day)\n         .where(status: 'completed')\n         .find_each(batch_size: 500) do |order|\n           # Process batch in memory without exhausting RAM\n           puts \"Order ##{order.id} for #{order.customer.email}: Total $#{order.total_amount}\"\n         end\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Always Use find_each for Large Datasets",
        "body": "Never call `User.all.each` on large database tables. `User.all` loads all rows into memory simultaneously, causing Ruby memory bloat. `User.find_each` loads records in batches of 1,000 using primary key cursor pagination."
      }
    ],
    "quiz": [
      {
        "id": "rb-ar-1",
        "question": "What happens when you enable 'strict_loading' on an Active Record relation in Rails 7?",
        "options": [
          "Rails raises an error if code attempts to lazy-load any association that was not explicitly eager-loaded with includes/preload",
          "Rails deletes unindexed database records",
          "The PostgreSQL server forces single-user mode",
          "Ruby disables garbage collection during query execution"
        ],
        "correctOptionIndex": 0,
        "explanation": "strict_loading enforces compile-time/runtime discipline by halting execution if an association is accessed without being preloaded, preventing hidden N+1 performance regressions."
      }
    ]
  },
  {
    "slug": "ruby-jwt-devise-api",
    "title": "Stateless JWT Authentication with Devise-JWT & Token Revocation",
    "courseSlug": "rails-rapid-api-development",
    "moduleSlug": "ruby-rails-api-foundations",
    "moduleName": "Ruby on Rails 7 API Architecture",
    "order": 3,
    "category": "Ruby",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Secure Rails APIs using Devise, Warden, devise-jwt, and the Denylist token revocation strategy.",
    "description": "Implement stateless JWT authentication in Rails without sessions, complete with secure password hashing (BCrypt) and revocation tracking.",
    "learningPoints": [
      "Configuring Devise with devise-jwt in API-only mode",
      "JWT dispatching on sign-in and verification via Warden hooks",
      "Token revocation strategies: Denylist vs JTIMatcher",
      "Role-based authorization and policy objects with Pundit"
    ],
    "content": [
      {
        "type": "text",
        "title": "Token-Based Authentication in Rails",
        "body": "Devise is the de facto authentication framework in Ruby. Combining Devise with devise-jwt allows Rails to issue signed JWT tokens upon login in the `Authorization: Bearer` response header, verifying credentials on every subsequent request without relying on browser cookies."
      },
      {
        "type": "code",
        "title": "Devise User Model with JWT Revocation Strategy",
        "language": "ruby",
        "code": "# app/models/user.rb\nclass User < ApplicationRecord\n  # Include default devise modules\n  devise :database_authenticatable, :registerable,\n         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist\n\n  validates :email, presence: true, uniqueness: true\n  validates :role, inclusion: { in: %w[admin member viewer] }\n\n  def admin?\n    role == 'admin'\n  end\nend\n\n# app/controllers/api/v1/sessions_controller.rb\nmodule Api\n  module V1\n    class SessionsController < Devise::SessionsController\n      respond_to :json\n\n      private\n\n      def respond_with(resource, _opts = {})\n        render json: {\n          message: 'Logged in successfully.',\n          user: { id: resource.id, email: resource.email, role: resource.role }\n        }, status: :ok\n      end\n\n      def respond_to_on_destroy\n        render json: { message: 'Logged out successfully.' }, status: :ok\n      end\n    end\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Denylist Cleanup Cron Job",
        "body": "When using a JWT Denylist table, set up a recurring cron worker (e.g. using Sidekiq-Cron) to delete expired tokens from the denylist table periodically."
      }
    ],
    "quiz": [
      {
        "id": "rb-jwt-1",
        "question": "How does the devise-jwt Denylist strategy handle user logout in a stateless JWT architecture?",
        "options": [
          "It writes the unique token JTI and expiry timestamp to a database denylist table, rejecting future requests with that token until it expires",
          "It deletes the user's database account",
          "It shuts down the Rails server instance",
          "It forces the client's computer to reboot"
        ],
        "correctOptionIndex": 0,
        "explanation": "Because JWTs are stateless and cannot be 'deleted' from the client, the server records logged-out token identifiers in a fast denylist table, checking incoming tokens against this list."
      }
    ]
  },
  {
    "slug": "ruby-sidekiq-redis-jobs",
    "title": "High-Throughput Background Jobs with Sidekiq & Redis",
    "courseSlug": "rails-rapid-api-development",
    "moduleSlug": "ruby-rails-api-foundations",
    "moduleName": "Ruby on Rails 7 API Architecture",
    "order": 4,
    "category": "Ruby",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Master multithreaded asynchronous background job execution with Sidekiq, Redis connection pooling, exponential backoff retries, and job idempotency.",
    "description": "Learn how Sidekiq processes thousands of jobs per second using Ruby threads, and how to structure resilient background workers.",
    "learningPoints": [
      "Sidekiq multithreaded architecture and Redis backend queues",
      "Defining workers with `include Sidekiq::Job` and `sidekiq_options`",
      "Exponential retries, dead-letter queues, and error alerting (Sentry)",
      "Job idempotency patterns to prevent double-charging or duplicate emails"
    ],
    "content": [
      {
        "type": "text",
        "title": "High-Performance Background Processing with Sidekiq",
        "body": "Sidekiq is the backbone of asynchronous processing in Ruby. Unlike old multi-process queue runners, Sidekiq uses a single process with multiple lightweight threads, reducing server RAM consumption by 80% while processing tens of thousands of jobs per minute."
      },
      {
        "type": "code",
        "title": "Production Sidekiq Worker with Idempotency Guard",
        "language": "ruby",
        "code": "# app/workers/payment_charge_worker.rb\nclass PaymentChargeWorker\n  include Sidekiq::Job\n  sidekiq_options queue: 'payments', retry: 5, dead: true\n\n  def perform(order_id)\n    order = Order.find_by(id: order_id)\n    return unless order # Guard against deleted records\n\n    # Idempotency check: Never charge an order that is already processed!\n    if order.status == 'paid'\n      logger.warn \"Order ##{order_id} already marked paid. Skipping duplicate charge.\"\n      return\n    end\n\n    logger.info \"Initiating credit card charge for Order ##{order_id}\"\n    gateway_response = StripeGateway.charge(\n      amount: order.total_cents,\n      customer_token: order.customer.stripe_token\n    )\n\n    if gateway_response.success?\n      order.update!(status: 'paid', transaction_id: gateway_response.tx_id)\n      # Trigger follow-up async email receipt\n      EmailReceiptWorker.perform_async(order.id)\n    else\n      raise \"Stripe payment failed: #{gateway_response.error_message}\"\n    end\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Pass IDs, Not Objects to Workers",
        "body": "Never pass complex Ruby objects (`PaymentChargeWorker.perform_async(order)`) to Sidekiq. Objects are serialized to JSON in Redis and may become stale. Always pass simple IDs (`order.id`) and reload the fresh record from the database inside the worker."
      }
    ],
    "quiz": [
      {
        "id": "rb-side-1",
        "question": "Why should you pass database record IDs (e.g. order.id) rather than full model objects to Sidekiq.perform_async()?",
        "options": [
          "Sidekiq serializes arguments to JSON in Redis; passing IDs prevents stale data and serialization bloat by loading fresh state at execution time",
          "Because Redis does not support numbers",
          "Because Active Record models cannot be converted into text",
          "Because Ruby forbids passing objects across functions"
        ],
        "correctOptionIndex": 0,
        "explanation": "Passing IDs ensures the background worker fetches the latest database state when it runs, preventing race conditions where stale in-memory attributes overwrite newer database modifications."
      }
    ]
  },
  {
    "slug": "ruby-sinatra-microservice-design",
    "title": "Lightweight Microservice Architecture with Sinatra & Modular Apps",
    "courseSlug": "ruby-backend-fundamentals",
    "moduleSlug": "ruby-sinatra-architecture",
    "moduleName": "Lightweight Ruby Microservices & Performance",
    "order": 1,
    "category": "Ruby",
    "difficulty": "beginner",
    "xpReward": 120,
    "duration": 18,
    "summary": "Build high-speed, minimal Ruby microservices with Sinatra, Modular Application architecture, and custom Rack filters.",
    "description": "Learn how Sinatra provides zero-bloat HTTP routing with sub-5ms latency for dedicated microservice workloads.",
    "learningPoints": [
      "Sinatra Modular Application style (`Sinatra::Base` inheritance)",
      "HTTP route definitions (GET, POST, PUT, DELETE) and JSON serialization",
      "Rack middleware integration (`use Rack::Deflater`, `use Rack::Cors`)",
      "Error handling with `error do ... end` and `not_found do ... end`"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Sinatra for Targeted Microservices",
        "body": "When building specialized services like a currency converter, health-check collector, or webhook receiver, the full Rails framework is unnecessary. Sinatra boots in under 100 milliseconds and requires less than 30MB of RAM, making it ideal for microservice clusters."
      },
      {
        "type": "code",
        "title": "Sinatra Modular Microservice API in Ruby",
        "language": "ruby",
        "code": "require 'sinatra/base'\nrequire 'json'\n\nclass CurrencyExchangeApi < Sinatra::Base\n  configure do\n    set :show_exceptions, false\n    set :dump_errors, false\n  end\n\n  before do\n    content_type :json\n  end\n\n  get '/api/v1/rates/:pair' do\n    pair = params[:pair].upcase\n    rates = {\n      'EURUSD' => 1.085,\n      'GBPUSD' => 1.265,\n      'USDJPY' => 151.20\n    }\n\n    if rates.key?(pair)\n      { pair: pair, rate: rates[pair], timestamp: Time.now.to_i }.to_json\n    else\n      status 404\n      { error: \"Currency pair '#{pair}' not found\" }.to_json\n    end\n  end\n\n  error do\n    status 500\n    { error: \"Internal service error: #{env['sinatra.error'].message}\" }.to_json\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Use Modular Style in Production",
        "body": "Always inherit from `Sinatra::Base` (Modular style) rather than using top-level DSL `get '/'`. Modular style prevents polluting the global Ruby namespace and allows mounting multiple apps on Puma."
      }
    ],
    "quiz": [
      {
        "id": "rb-sin-1",
        "question": "What is the primary advantage of writing Sinatra applications using the Modular style (subclassing Sinatra::Base)?",
        "options": [
          "It prevents polluting the global Object namespace and allows mounting multiple independent Sinatra apps in the same Rack process",
          "It automatically compiles Ruby into Rust code",
          "It disables HTTP request logging",
          "It forces the server to use HTTPS exclusively"
        ],
        "correctOptionIndex": 0,
        "explanation": "Modular Sinatra keeps routes and helper methods encapsulated within the class, making it clean to test, package into gems, and mount in config.ru."
      }
    ]
  },
  {
    "slug": "ruby-sequel-database-layer",
    "title": "Fast SQL Data Access with Sequel ORM & Connection Pooling",
    "courseSlug": "ruby-backend-fundamentals",
    "moduleSlug": "ruby-sinatra-architecture",
    "moduleName": "Lightweight Ruby Microservices & Performance",
    "order": 2,
    "category": "Ruby",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Master Sequel ORM for high-performance SQL querying, connection pool tuning, migration scripts, and database transactions in Ruby.",
    "description": "Understand why Sequel is the preferred database toolkit for high-throughput Sinatra microservices, outperforming Active Record on complex queries.",
    "learningPoints": [
      "Sequel Database connection setup and connection pool configuration",
      "Writing composable SQL dataset queries with Sequel DSL",
      "Atomic database transactions with `DB.transaction do ... end`",
      "Model plugins and validation frameworks in Sequel"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Speed and Precision of Sequel",
        "body": "Sequel is a lightweight, thread-safe database toolkit for Ruby. Unlike Active Record which creates heavy object instances for every record, Sequel datasets represent pure SQL queries that can return lightweight raw Ruby Hashes or validated models with minimal GC overhead."
      },
      {
        "type": "code",
        "title": "Sequel Database Connection & Transaction Example",
        "language": "ruby",
        "code": "require 'sequel'\n\n# Initialize thread-safe connection pool to PostgreSQL\nDB = Sequel.connect(\n  ENV.fetch('DATABASE_URL', 'postgres://postgres:secret@localhost:5432/platform_db'),\n  max_connections: 20,\n  pool_timeout: 5\n)\n\nclass AccountRepository\n  def self.transfer(from_id, to_id, amount)\n    DB.transaction do\n      # Deduct with atomic balance constraint\n      updated = DB[:accounts]\n        .where(id: from_id)\n        .where { balance >= amount }\n        .update(balance: Sequel[:balance] - amount)\n\n      raise \"Insufficient funds\" if updated == 0\n\n      # Credit destination account\n      DB[:accounts]\n        .where(id: to_id)\n        .update(balance: Sequel[:balance] + amount)\n    end\n  end\n\n  def self.top_accounts(limit = 10)\n    DB[:accounts]\n      .select(:id, :email, :balance)\n      .order(Sequel.desc(:balance))\n      .limit(limit)\n      .all # Returns array of raw fast Hashes!\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Raw Hash Datasets for API Speed",
        "body": "Calling `DB[:table].all` returns pure Ruby Hashes directly from the libpq driver, bypassing ORM object instantiation entirely for blazing-fast JSON serialization."
      }
    ],
    "quiz": [
      {
        "id": "rb-seq-1",
        "question": "Why is Sequel often chosen over Active Record for high-concurrency microservices in Ruby?",
        "options": [
          "It has significantly lower memory allocation overhead, superior connection pool controls, and can return raw hashes without model instantiation",
          "It only supports SQLite databases",
          "It converts SQL queries into GraphQL automatically",
          "It disables database indexing for speed"
        ],
        "correctOptionIndex": 0,
        "explanation": "Sequel is lean and thread-safe by design, providing exceptional raw SQL control with a fraction of Active Record's memory allocations."
      }
    ]
  },
  {
    "slug": "ruby-concurrency-yjit",
    "title": "Modern Ruby 3.3+ Performance: YJIT Compiler & Fiber Concurrency",
    "courseSlug": "ruby-backend-fundamentals",
    "moduleSlug": "ruby-sinatra-architecture",
    "moduleName": "Lightweight Ruby Microservices & Performance",
    "order": 3,
    "category": "Ruby",
    "difficulty": "advanced",
    "xpReward": 140,
    "duration": 20,
    "summary": "Maximize Ruby throughput with the YJIT (Yet Another JIT) compiler, Fiber non-blocking scheduler, and GVL (Giant VM Lock) optimization.",
    "description": "Learn how Ruby 3.3 YJIT delivers 25-40% speedups for Rails/Sinatra web applications in production with zero code changes.",
    "learningPoints": [
      "How the YJIT compiler generates native machine code for hot Ruby bytecode",
      "Enabling and tuning YJIT in production (`--yjit --yjit-exec-mem-size=64`)",
      "Understanding GVL (Giant VM Lock) behavior during I/O and C extensions",
      "Fiber non-blocking scheduler (Async gem) for million-connection WebSockets"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Ruby 3 Performance Revolution",
        "body": "Ruby 3.3's YJIT is a production-ready Just-In-Time compiler written in Rust. It monitors running bytecode, compiles frequently executed paths into native x86/ARM machine code, and optimizes method dispatch, boosting Rails and Sinatra API throughput by up to 40%."
      },
      {
        "type": "code",
        "title": "Verifying YJIT Status & Production Configuration",
        "language": "ruby",
        "code": "# config/initializers/yjit_telemetry.rb\nif defined?(RubyVM::YJIT) && RubyVM::YJIT.enabled?\n  puts \"🚀 YJIT is ACTIVE: Compiling Ruby bytecode to native machine code.\"\n\n  # Expose YJIT performance stats to monitoring endpoint\n  stats = RubyVM::YJIT.runtime_stats\n  puts \"YJIT Compiled Methods: #{stats[:compiled_iseq_count]}\"\n  puts \"YJIT Code Size: #{stats[:code_region_size] / 1024} KB\"\nelse\n  puts \"⚠️ YJIT is disabled. Run with 'ruby --yjit' for 30% higher throughput.\"\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Enable YJIT in Production Environment",
        "body": "Set the environment variable `RUBY_YJIT_ENABLE=1` in your Dockerfile or Kubernetes deployment manifest to activate YJIT across all worker processes."
      }
    ],
    "quiz": [
      {
        "id": "rb-yjit-1",
        "question": "What is the primary benefit of enabling YJIT (RUBY_YJIT_ENABLE=1) in modern Ruby 3.3 web servers?",
        "options": [
          "It dynamically compiles hot Ruby bytecode into native CPU machine instructions, delivering a 25-40% boost in request throughput",
          "It disables all memory garbage collection",
          "It forces Ruby to execute on the GPU",
          "It converts Ruby source files into Python"
        ],
        "correctOptionIndex": 0,
        "explanation": "YJIT (Yet Another JIT) compiles heavily executed Ruby methods into native machine code at runtime, significantly reducing interpreter overhead."
      }
    ]
  },
  {
    "slug": "ruby-production-puma-deployment",
    "title": "Puma Server Optimization: Clustered Mode, Worker Threads & Zero-Downtime",
    "courseSlug": "ruby-backend-fundamentals",
    "moduleSlug": "ruby-sinatra-architecture",
    "moduleName": "Lightweight Ruby Microservices & Performance",
    "order": 4,
    "category": "Ruby",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Configure Puma application servers for production with Clustered Mode, thread tuning, Copy-on-Write memory sharing, and phased restarts.",
    "description": "Learn how Puma combines multi-process clustering with multi-threaded request execution to utilize all CPU cores while maximizing RAM efficiency.",
    "learningPoints": [
      "Puma Clustered Mode: worker processes (multi-core) vs thread pools",
      "Copy-on-Write (CoW) friendly memory allocation with `preload_app!`",
      "Tuning `RAILS_MAX_THREADS` and database connection pool sizes",
      "Zero-downtime phased restarts with `puma/control` and rolling deployment signals"
    ],
    "content": [
      {
        "type": "text",
        "title": "Puma Production Architecture",
        "body": "Puma is the standard HTTP web server for Ruby. By using Clustered Mode, Puma forks multiple worker processes to bypass the GVL across CPU cores, while each worker runs 5-10 threads to handle concurrent I/O operations simultaneously."
      },
      {
        "type": "code",
        "title": "Production puma.rb Configuration File",
        "language": "ruby",
        "code": "# config/puma.rb\n\n# Threads per worker process (min, max)\nmax_threads_count = ENV.fetch(\"RAILS_MAX_THREADS\") { 5 }\nmin_threads_count = ENV.fetch(\"RAILS_MIN_THREADS\") { max_threads_count }\nthreads min_threads_count, max_threads_count\n\n# Bind port\nport ENV.fetch(\"PORT\") { 3000 }\nenvironment ENV.fetch(\"RAILS_ENV\") { \"production\" }\n\n# Clustered Mode: 1 worker process per CPU core\nworker_count = Integer(ENV.fetch(\"WEB_CONCURRENCY\") { 2 })\nif worker_count > 1\n  workers worker_count\n\n  # Copy-on-Write memory sharing optimization\n  preload_app!\n\n  on_worker_boot do\n    # Reconnect Active Record database connection pool per forked process\n    ActiveRecord::Base.establish_connection if defined?(ActiveRecord)\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Match DB Pool Size to Puma Threads",
        "body": "Ensure your database pool size (`DB_POOL=5`) is at least equal to `RAILS_MAX_THREADS`. If Puma spawns 5 threads but the DB pool only allows 3 connections, threads will block waiting for database sockets."
      }
    ],
    "quiz": [
      {
        "id": "rb-puma-1",
        "question": "Why is 'preload_app!' enabled in Puma Clustered Mode before forking worker processes?",
        "options": [
          "It leverages OS Copy-on-Write (CoW) to share preloaded application memory across worker processes, saving hundreds of megabytes of RAM",
          "It disables all network security rules",
          "It forces workers to run without database connections",
          "It restarts the server on every incoming request"
        ],
        "correctOptionIndex": 0,
        "explanation": "preload_app! loads the entire application codebase into master process memory before forking, allowing child workers to share the same physical RAM pages via OS Copy-on-Write."
      }
    ]
  },
  {
    "slug": "kotlin-coroutines-backend",
    "title": "Kotlin Coroutines Masterclass: Structured Concurrency & Dispatchers",
    "courseSlug": "kotlin-backend-fundamentals",
    "moduleSlug": "kotlin-ktor-foundations",
    "moduleName": "Asynchronous Kotlin & Ktor Engineering",
    "order": 1,
    "category": "Kotlin",
    "difficulty": "beginner",
    "xpReward": 120,
    "duration": 18,
    "summary": "Master Kotlin Coroutines for asynchronous backend services: suspend functions, CoroutineScope, Dispatchers.IO, and Flow streams.",
    "description": "Learn how Kotlin coroutines deliver non-blocking asynchronous execution with standard sequential code readability.",
    "learningPoints": [
      "The mechanics of suspend functions and continuation passing style (CPS)",
      "Structured concurrency and parent-child coroutine cancellation rules",
      "Selecting the right Dispatcher: Dispatchers.IO vs Dispatchers.Default",
      "Streaming asynchronous events with Kotlin Flow and Channel primitives"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Power of Kotlin Coroutines in Server Backends",
        "body": "Unlike traditional thread-per-request models or complex reactive chains (Project Reactor / RxJava), Kotlin Coroutines allow developers to write clean, sequential-looking code that executes asynchronously. When a coroutine suspends during an I/O call, the underlying thread is released back to the thread pool."
      },
      {
        "type": "code",
        "title": "Concurrent Asynchronous Service with Kotlin Coroutines",
        "language": "kotlin",
        "code": "package com.backend.platform.service\n\nimport kotlinx.coroutines.*\nimport java.time.Instant\n\ndata class UserSummary(val id: String, val profile: String, val ordersCount: Int)\n\nclass DashboardAggregatorService(\n    private val userClient: UserServiceClient,\n    private val orderClient: OrderServiceClient\n) {\n    suspend fun getDashboardData(userId: String): UserSummary = coroutineScope {\n        // Run two asynchronous remote calls concurrently in parallel!\n        val profileDeferred = async(Dispatchers.IO) {\n            userClient.fetchProfile(userId)\n        }\n        val ordersDeferred = async(Dispatchers.IO) {\n            orderClient.fetchOrderCount(userId)\n        }\n\n        // Await both results without blocking any OS thread\n        val profile = profileDeferred.await()\n        val ordersCount = ordersDeferred.await()\n\n        UserSummary(\n            id = userId,\n            profile = profile.name,\n            ordersCount = ordersCount\n        )\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Always Use coroutineScope for Concurrent Decomposition",
        "body": "Use `coroutineScope { }` to encapsulate concurrent child coroutines (`async`). If one child task fails with an exception, structured concurrency automatically cancels all sibling tasks to prevent leaked background work."
      }
    ],
    "quiz": [
      {
        "id": "kt-cor-1",
        "question": "What happens under the hood when a Kotlin suspend function encounters an asynchronous I/O operation?",
        "options": [
          "The coroutine saves its state and yields the underlying OS thread back to the pool without blocking",
          "The JVM process terminates the operating system thread",
          "The CPU executes an infinite busy-wait loop",
          "The Java Virtual Machine reboots"
        ],
        "correctOptionIndex": 0,
        "explanation": "Suspension allows the thread to execute other requests while the asynchronous I/O (database, network) is pending, resuming the coroutine once data arrives."
      }
    ]
  },
  {
    "slug": "kotlin-ktor-routing-plugins",
    "title": "Building Microservices with Ktor 3, Routing DSL & StatusPages",
    "courseSlug": "ktor-cloud-native-apis",
    "moduleSlug": "kotlin-ktor-foundations",
    "moduleName": "Asynchronous Kotlin & Ktor Engineering",
    "order": 2,
    "category": "Kotlin",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Build lightning-fast asynchronous HTTP microservices using Ktor 3, routing DSL, ContentNegotiation, and StatusPages error handling.",
    "description": "Master Ktor's un-opinionated, lightweight plugin architecture and learn how to construct modular HTTP routes with automatic JSON serialization.",
    "learningPoints": [
      "Ktor 3 Application structure and Netty embedded server configuration",
      "Routing DSL with route grouping, path parameters, and query extraction",
      "ContentNegotiation plugin with Kotlinx.serialization for zero-reflection JSON",
      "Centralized error recovery using the StatusPages plugin"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Lightweight Ktor 3 Philosophy",
        "body": "Ktor is JetBrains' asynchronous web framework built from the ground up on Kotlin Coroutines. Everything in Ktor is a plugin. You only install what you need (Routing, JSON Serialization, Authentication), resulting in tiny memory footprints and rapid startup."
      },
      {
        "type": "code",
        "title": "Ktor 3 Application Module with Routing & StatusPages",
        "language": "kotlin",
        "code": "package com.backend.platform\n\nimport io.ktor.http.*\nimport io.ktor.serialization.kotlinx.json.*\nimport io.ktor.server.application.*\nimport io.ktor.server.plugins.contentnegotiation.*\nimport io.ktor.server.plugins.statuspages.*\nimport io.ktor.server.request.*\nimport io.ktor.server.response.*\nimport io.ktor.server.routing.*\nimport kotlinx.serialization.Serializable\nimport java.util.UUID\n\n@Serializable\ndata class CreateUserRequest(val username: String, val email: String)\n\n@Serializable\ndata class UserResponse(val id: String, val username: String, val email: String)\n\nfun Application.module() {\n    install(ContentNegotiation) {\n        json()\n    }\n\n    install(StatusPages) {\n        exception<IllegalArgumentException> { call, cause ->\n            call.respond(HttpStatusCode.BadRequest, mapOf(\"error\" to (cause.message ?: \"Invalid request\")))\n        }\n        exception<Throwable> { call, cause ->\n            call.respond(HttpStatusCode.InternalServerError, mapOf(\"error\" to \"Internal server error\"))\n        }\n    }\n\n    routing {\n        route(\"/api/v1/users\") {\n            post {\n                val req = call.receive<CreateUserRequest>()\n                require(req.email.contains(\"@\")) { \"Invalid email format\" }\n\n                val response = UserResponse(\n                    id = UUID.randomUUID().toString(),\n                    username = req.username,\n                    email = req.email\n                )\n                call.respond(HttpStatusCode.Created, response)\n            }\n        }\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Use StatusPages for Error Normalization",
        "body": "Install the StatusPages plugin to map custom business exceptions (e.g. `UserNotFoundException`) to appropriate HTTP status codes (404) globally across all routes."
      }
    ],
    "quiz": [
      {
        "id": "kt-ktor-1",
        "question": "How does Ktor's plugin architecture differ from traditional monolithic Java web frameworks?",
        "options": [
          "Ktor includes zero mandatory features out of the box; developers install only the specific plugins (JSON, Auth, CORS) required by the microservice",
          "Ktor cannot connect to SQL databases",
          "Ktor compiles Kotlin into PHP scripts",
          "Ktor requires running inside an Apache Tomcat server container"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ktor is modular by design; every capability is an optional lightweight plugin, keeping the application lightweight and memory-efficient."
      }
    ]
  },
  {
    "slug": "kotlin-exposed-sql-orm",
    "title": "Type-Safe Database Modeling with JetBrains Exposed SQL Framework",
    "courseSlug": "kotlin-backend-fundamentals",
    "moduleSlug": "kotlin-ktor-foundations",
    "moduleName": "Asynchronous Kotlin & Ktor Engineering",
    "order": 3,
    "category": "Kotlin",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 22,
    "summary": "Master type-safe SQL persistence using JetBrains Exposed ORM (DSL & DAO), connection pooling with HikariCP, and coroutine transactions.",
    "description": "Learn how Exposed provides Kotlin type safety for database schemas, table joins, and transactions without JPA/Hibernate reflection overhead.",
    "learningPoints": [
      "Exposed SQL DSL: defining Tables, Columns, and Primary Keys",
      "Executing queries inside `newSuspendedTransaction(Dispatchers.IO)`",
      "Relational queries, Foreign Keys, and Inner/Left Joins",
      "Configuring HikariCP connection pool parameters for maximum throughput"
    ],
    "content": [
      {
        "type": "text",
        "title": "Type-Safe Database Queries in Kotlin",
        "body": "JetBrains Exposed provides two layers: a type-safe SQL DSL and an intuitive DAO layer. Unlike Hibernate, which relies on heavy runtime reflection and proxy objects, Exposed uses Kotlin compiler type checking to ensure column names and types are verified at compile time."
      },
      {
        "type": "code",
        "title": "Exposed Table Schema & Suspended Transaction Repository",
        "language": "kotlin",
        "code": "package com.backend.platform.database\n\nimport kotlinx.coroutines.Dispatchers\nimport org.jetbrains.exposed.sql.*\nimport org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction\nimport java.util.UUID\n\nobject UsersTable : Table(\"users\") {\n    val id = uuid(\"id\")\n    val email = varchar(\"email\", 255).uniqueIndex()\n    val username = varchar(\"username\", 100)\n    val balance = double(\"balance\").default(0.0)\n\n    override val primaryKey = PrimaryKey(id)\n}\n\ndata class UserRecord(val id: UUID, val email: String, val username: String, val balance: Double)\n\nclass UserRepository(private val database: Database) {\n\n    suspend fun findByEmail(email: String): UserRecord? =\n        newSuspendedTransaction(Dispatchers.IO, database) {\n            UsersTable\n                .selectAll()\n                .where { UsersTable.email eq email }\n                .map { row ->\n                    UserRecord(\n                        id = row[UsersTable.id],\n                        email = row[UsersTable.email],\n                        username = row[UsersTable.username],\n                        balance = row[UsersTable.balance]\n                    )\n                }\n                .singleOrNull()\n        }\n\n    suspend fun transferCredit(fromId: UUID, toId: UUID, amount: Double): Boolean =\n        newSuspendedTransaction(Dispatchers.IO, database) {\n            val fromBalance = UsersTable\n                .select(UsersTable.balance)\n                .where { UsersTable.id eq fromId }\n                .single()[UsersTable.balance]\n\n            if (fromBalance < amount) return@newSuspendedTransaction false\n\n            UsersTable.update({ UsersTable.id eq fromId }) {\n                it[balance] = fromBalance - amount\n            }\n            UsersTable.update({ UsersTable.id eq toId }) {\n                with(SqlExpressionBuilder) {\n                    it.update(balance, balance + amount)\n                }\n            }\n            true\n        }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Always Use newSuspendedTransaction",
        "body": "In asynchronous Ktor/Kotlin services, always execute Exposed queries inside `newSuspendedTransaction(Dispatchers.IO)`. This prevents blocking the primary coroutine dispatcher."
      }
    ],
    "quiz": [
      {
        "id": "kt-exp-1",
        "question": "Why is newSuspendedTransaction(Dispatchers.IO) used when executing Exposed database queries in Kotlin?",
        "options": [
          "It shifts blocking JDBC database calls onto the background I/O dispatcher without blocking the web server event loop",
          "It encrypts the SQL database schema",
          "It converts the database from PostgreSQL to MongoDB",
          "It disables SQL transactions"
        ],
        "correctOptionIndex": 0,
        "explanation": "Standard JDBC drivers are synchronous and blocking. newSuspendedTransaction runs the query on the dedicated Dispatchers.IO worker pool and suspends the caller cleanly."
      }
    ]
  },
  {
    "slug": "kotlin-jwt-auth-ktor",
    "title": "Ktor JWT Authentication Provider, Principal Verification & RBAC",
    "courseSlug": "ktor-cloud-native-apis",
    "moduleSlug": "kotlin-ktor-foundations",
    "moduleName": "Asynchronous Kotlin & Ktor Engineering",
    "order": 4,
    "category": "Kotlin",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Implement JWT authentication in Ktor with the Authentication plugin, Auth0 JWT verifier, Principal validation, and Role guards.",
    "description": "Learn how to secure Ktor route hierarchies using authenticated route blocks (`authenticate(\"auth-jwt\") { ... }`) and role interceptors.",
    "learningPoints": [
      "Configuring the Ktor Authentication plugin with `jwt(\"auth-jwt\")`",
      "Verifying JWT token signatures using HMAC256 and custom Claim extractors",
      "Attaching `JWTPrincipal` to call context and retrieving user details",
      "Building route authorization extensions for role-based endpoint gating"
    ],
    "content": [
      {
        "type": "text",
        "title": "JWT Security in Ktor Microservices",
        "body": "Ktor provides a declarative authentication DSL. When a client sends an `Authorization: Bearer <token>` header, Ktor validates the token against your cryptographic verifier and injects a `JWTPrincipal` into the call context, shielding protected routes from unauthorized access."
      },
      {
        "type": "code",
        "title": "Ktor JWT Authentication Configuration & Protected Routes",
        "language": "kotlin",
        "code": "package com.backend.platform.auth\n\nimport com.auth0.jwt.JWT\nimport com.auth0.jwt.algorithms.Algorithm\nimport io.ktor.http.*\nimport io.ktor.server.application.*\nimport io.ktor.server.auth.*\nimport io.ktor.server.auth.jwt.*\nimport io.ktor.server.response.*\nimport io.ktor.server.routing.*\n\nfun Application.configureSecurity(secret: String, issuer: String) {\n    val jwtVerifier = JWT.require(Algorithm.HMAC256(secret))\n        .withIssuer(issuer)\n        .build()\n\n    install(Authentication) {\n        jwt(\"auth-jwt\") {\n            verifier(jwtVerifier)\n            validate { credential ->\n                val userId = credential.payload.getClaim(\"userId\").asString()\n                val role = credential.payload.getClaim(\"role\").asString()\n                if (!userId.isNullOrEmpty()) {\n                    JWTPrincipal(credential.payload)\n                } else {\n                    null\n                }\n            }\n            challenge { defaultScheme, realm ->\n                call.respond(HttpStatusCode.Unauthorized, mapOf(\"error\" to \"Token is invalid or expired\"))\n            }\n        }\n    }\n\n    routing {\n        authenticate(\"auth-jwt\") {\n            get(\"/api/v1/profile\") {\n                val principal = call.principal<JWTPrincipal>()\n                val userId = principal!!.payload.getClaim(\"userId\").asString()\n                val role = principal.payload.getClaim(\"role\").asString()\n\n                call.respond(mapOf(\"userId\" to userId, \"role\" to role))\n            }\n        }\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Nested Route Protection",
        "body": "Wrap entire route sub-trees with `authenticate(\"auth-jwt\") { ... }` to automatically apply authentication checks to all nested endpoints."
      }
    ],
    "quiz": [
      {
        "id": "kt-jwt-1",
        "question": "How does Ktor handle requests to routes wrapped inside authenticate('auth-jwt') when no valid Bearer token is provided?",
        "options": [
          "It executes the challenge block and returns HTTP 401 Unauthorized, never calling the inner route handler",
          "It permits the request with an empty anonymous user",
          "It crashes the server with a NullPointerException",
          "It redirects the client to the Google login page"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ktor's authentication interceptor halts request processing immediately and invokes the challenge handler (HTTP 401) before the inner endpoint handler can execute."
      }
    ]
  },
  {
    "slug": "kotlin-spring-boot-coroutines",
    "title": "Reactive Spring Boot 3 with Kotlin Coroutines & Flow API",
    "courseSlug": "ktor-cloud-native-apis",
    "moduleSlug": "kotlin-cloud-architecture",
    "moduleName": "Cloud-Native Kotlin & Microservices",
    "order": 1,
    "category": "Kotlin",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Build high-throughput reactive microservices with Spring Boot 3, Spring WebFlux, and first-class Kotlin Coroutines / Flow API integration.",
    "description": "Learn how Spring WebFlux natively supports Kotlin `suspend` controller methods and reactive streams with `Flow<T>`.",
    "learningPoints": [
      "Spring WebFlux architecture and Netty non-blocking event loop",
      "Writing suspend functions in @RestController classes",
      "Streaming server-sent events (SSE) using Kotlin `Flow<T>`",
      "R2DBC reactive database drivers with Spring Data R2DBC"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Spring WebFlux with Kotlin Coroutines",
        "body": "Traditional Spring MVC uses blocking servlets. Spring WebFlux uses reactive non-blocking streams. When paired with Kotlin Coroutines, you get the performance of reactive programming with the clean, linear syntax of standard imperative code."
      },
      {
        "type": "code",
        "title": "Spring WebFlux Controller with Kotlin Coroutines & Flow",
        "language": "kotlin",
        "code": "package com.backend.platform.controller\n\nimport kotlinx.coroutines.delay\nimport kotlinx.coroutines.flow.Flow\nimport kotlinx.coroutines.flow.flow\nimport org.springframework.http.MediaType\nimport org.springframework.web.bind.annotation.*\nimport java.time.Instant\n\ndata class StockPrice(val symbol: String, val price: Double, val timestamp: Instant)\n\n@RestController\n@RequestMapping(\"/api/v1/stocks\")\nclass StockTickerController {\n\n    @GetMapping(\"/{symbol}\")\n    suspend fun getPrice(@PathVariable symbol: String): StockPrice {\n        // Non-blocking asynchronous retrieval\n        delay(10) // Simulates non-blocking async network fetch\n        return StockPrice(symbol.uppercase(), 175.50, Instant.now())\n    }\n\n    // Stream real-time prices using Server-Sent Events (SSE) and Kotlin Flow!\n    @GetMapping(\"/{symbol}/stream\", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])\n    fun streamPrices(@PathVariable symbol: String): Flow<StockPrice> = flow {\n        var currentPrice = 150.0\n        while (true) {\n            currentPrice += (Math.random() - 0.5) * 2.0\n            emit(StockPrice(symbol.uppercase(), currentPrice, Instant.now()))\n            delay(1000) // Emit price every second\n        }\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "First-Class Coroutine Support",
        "body": "Spring Framework 6+ has native built-in support for Kotlin Coroutines. You can declare `@GetMapping suspend fun ...` directly without converting to Mono or Flux."
      }
    ],
    "quiz": [
      {
        "id": "kt-flx-1",
        "question": "What is the key advantage of returning Kotlin Flow<T> from a Spring WebFlux controller endpoint?",
        "options": [
          "It enables non-blocking reactive streaming (e.g. Server-Sent Events) with simple imperative-style emit() calls",
          "It converts Java bytecode to JavaScript in real time",
          "It disables HTTP connection timeouts permanently",
          "It automatically creates SQL tables in PostgreSQL"
        ],
        "correctOptionIndex": 0,
        "explanation": "Kotlin Flow seamlessly integrates with reactive publisher streams, allowing continuous event emission without thread blocking or complex callback chains."
      }
    ]
  },
  {
    "slug": "kotlin-serialization-json",
    "title": "Zero-Reflection Serialization with kotlinx.serialization",
    "courseSlug": "kotlin-backend-fundamentals",
    "moduleSlug": "kotlin-cloud-architecture",
    "moduleName": "Cloud-Native Kotlin & Microservices",
    "order": 2,
    "category": "Kotlin",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 18,
    "summary": "Master compile-time JSON and Protocol Buffer serialization using JetBrains kotlinx.serialization, polymorphic serializers, and strict null safety.",
    "description": "Learn how kotlinx.serialization generates static serializer code during `kotlinc` compilation, eliminating slow runtime reflection (Jackson/Gson).",
    "learningPoints": [
      "The `@Serializable` annotation and compiler plugin mechanics",
      "Polymorphic serialization for sealed class hierarchies",
      "Custom serializer implementation using KSerializer<T>",
      "Strict null-safety enforcement and default parameter omission (`encodeDefaults = false`)"
    ],
    "content": [
      {
        "type": "text",
        "title": "Compile-Time Serialization vs Runtime Reflection",
        "body": "Traditional JVM libraries like Jackson rely on heavy reflection to inspect private fields at runtime, degrading startup time and memory footprint. `kotlinx.serialization` uses a compiler plugin to generate static byte-level serializers at compile time."
      },
      {
        "type": "code",
        "title": "Polymorphic Serialization with Sealed Classes in Kotlin",
        "language": "kotlin",
        "code": "package com.backend.platform.events\n\nimport kotlinx.serialization.Polymorphic\nimport kotlinx.serialization.SerialName\nimport kotlinx.serialization.Serializable\nimport kotlinx.serialization.json.Json\n\n@Serializable\nsealed class WebhookEvent {\n    abstract val eventId: String\n    abstract val timestamp: Long\n}\n\n@Serializable\n@SerialName(\"payment_succeeded\")\ndata class PaymentSucceededEvent(\n    override val eventId: String,\n    override val timestamp: Long,\n    val amountCents: Long,\n    val currency: String\n) : WebhookEvent()\n\n@Serializable\n@SerialName(\"order_cancelled\")\ndata class OrderCancelledEvent(\n    override val eventId: String,\n    override val timestamp: Long,\n    val reason: String\n) : WebhookEvent()\n\nval jsonConfig = Json {\n    ignoreUnknownKeys = true\n    encodeDefaults = true\n    prettyPrint = false\n}\n\nfun serializeEvent(event: WebhookEvent): String =\n    jsonConfig.encodeToString(WebhookEvent.serializer(), event)"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Sealed Class Discriminator",
        "body": "Using `@SerialName(\"payment_succeeded\")` on sealed subclasses instructs the serializer to automatically inject a `\"type\": \"payment_succeeded\"` field into the JSON payload."
      }
    ],
    "quiz": [
      {
        "id": "kt-ser-1",
        "question": "How does kotlinx.serialization differ in performance from reflection-based serializers like Jackson?",
        "options": [
          "It generates static compile-time serializer classes during build, eliminating runtime reflection and speeding up deserialization",
          "It disables type validation completely",
          "It stores JSON in binary zip files",
          "It forces all JSON keys to be uppercase"
        ],
        "correctOptionIndex": 0,
        "explanation": "By generating serializer code at compile time, kotlinx.serialization avoids JVM reflection overhead and works seamlessly on GraalVM Native Image."
      }
    ]
  },
  {
    "slug": "kotlin-resilient-microservices",
    "title": "Cloud Resilience: Circuit Breakers, Retries & Distributed Config",
    "courseSlug": "ktor-cloud-native-apis",
    "moduleSlug": "kotlin-cloud-architecture",
    "moduleName": "Cloud-Native Kotlin & Microservices",
    "order": 3,
    "category": "Kotlin",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Build fault-tolerant Kotlin microservices with Spring Cloud, Resilience4j Kotlin coroutine integration, and distributed tracing.",
    "description": "Learn how to wrap suspend functions with CircuitBreakers, implement graceful fallback degradation, and manage dynamic configuration.",
    "learningPoints": [
      "Integrating Resilience4j with Kotlin Coroutines (`suspend` functions)",
      "Configuring sliding window failure thresholds and automatic fallback execution",
      "Dynamic configuration refresh with Spring Cloud Config",
      "Distributed tracing with Micrometer Tracing and OpenTelemetry"
    ],
    "content": [
      {
        "type": "text",
        "title": "Fault Tolerance in Kotlin Microservice Meshes",
        "body": "In high-throughput microservices, downstream failures must be isolated. Combining Resilience4j with Kotlin Coroutines ensures that failing downstream calls fail fast without consuming thread resources or cascading into upstream outages."
      },
      {
        "type": "code",
        "title": "Resilient Suspend Service with Resilience4j Decorators",
        "language": "kotlin",
        "code": "package com.backend.platform.resilience\n\nimport io.github.resilience4j.circuitbreaker.CircuitBreaker\nimport io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry\nimport io.github.resilience4j.kotlin.circuitbreaker.executeSuspendFunction\nimport org.slf4j.LoggerFactory\nimport org.springframework.stereotype.Service\nimport org.springframework.web.reactive.function.client.WebClient\nimport org.springframework.web.reactive.function.client.awaitBody\n\n@Service\nclass ExternalPricingService(\n    private val webClient: WebClient,\n    circuitBreakerRegistry: CircuitBreakerRegistry\n) {\n    private val logger = LoggerFactory.getLogger(javaClass)\n    private val circuitBreaker: CircuitBreaker = circuitBreakerRegistry.circuitBreaker(\"pricingService\")\n\n    suspend fun getExchangeRate(currency: String): Double {\n        return circuitBreaker.executeSuspendFunction {\n            try {\n                webClient.get()\n                    .uri(\"https://forex.internal/api/rate?currency={c}\", currency)\n                    .retrieve()\n                    .awaitBody<Double>()\n            } catch (ex: Exception) {\n                logger.warn(\"Forex service failed. Executing fallback.\")\n                1.0 // Safe fallback exchange rate\n            }\n        }\n    }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Use resilience4j-kotlin Extension",
        "body": "Include the `io.github.resilience4j:resilience4j-kotlin` dependency to get native coroutine extension functions like `executeSuspendFunction`."
      }
    ],
    "quiz": [
      {
        "id": "kt-res-1",
        "question": "What is the benefit of using Resilience4j's executeSuspendFunction over standard Java circuit breaker wrappers in Kotlin?",
        "options": [
          "It preserves coroutine suspension semantics, ensuring threads are not blocked during circuit breaker evaluation or delayed retries",
          "It increases JVM memory allocation limits automatically",
          "It disables network firewalls for fast transfers",
          "It forces the CPU to run at higher voltages"
        ],
        "correctOptionIndex": 0,
        "explanation": "executeSuspendFunction allows coroutines to suspend naturally without holding physical carrier threads during circuit breaker checks or exponential retry backoffs."
      }
    ]
  },
  {
    "slug": "kotlin-graalvm-native-docker",
    "title": "Compiling Kotlin to Native Binaries with GraalVM & Minimal Docker",
    "courseSlug": "kotlin-backend-fundamentals",
    "moduleSlug": "kotlin-cloud-architecture",
    "moduleName": "Cloud-Native Kotlin & Microservices",
    "order": 4,
    "category": "Kotlin",
    "difficulty": "advanced",
    "xpReward": 160,
    "duration": 22,
    "summary": "Compile Kotlin backend applications into standalone Linux ELF native binaries using GraalVM Native Image and multi-stage Dockerfiles.",
    "description": "Learn how Ahead-of-Time (AOT) compilation eliminates the JVM startup penalty, reducing boot times to 15ms and memory usage to 30MB.",
    "learningPoints": [
      "Ahead-of-Time (AOT) compilation architecture with GraalVM Native Image",
      "Configuring reachability metadata for reflection and dynamic serialization",
      "Building multi-stage Dockerfiles with GraalVM Native Build Tools",
      "Deploying onto minimal Alpine/Distroless Linux containers"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Native Image Revolution for JVM Backends",
        "body": "Traditional JVM services require hundreds of megabytes of RAM and several seconds to start due to bytecode interpretation and JIT warm-up. GraalVM AOT compilation analyzes the application at build time, compiles bytecode directly into native machine code, and packages it with the Substrate VM for instant startup."
      },
      {
        "type": "code",
        "title": "Multi-Stage GraalVM Dockerfile for Kotlin Services",
        "language": "dockerfile",
        "code": "# Stage 1: Build Native Binary with GraalVM JDK 21\nFROM ghcr.io/graalvm/native-image-community:21 AS builder\nWORKDIR /build\n\nCOPY gradlew settings.gradle.kts build.gradle.kts ./\nCOPY gradle ./gradle\nRUN ./gradlew dependencies --no-daemon\n\nCOPY src ./src\nRUN ./gradlew nativeCompile --no-daemon\n\n# Stage 2: Ultra-Fast Minimal Production Container\nFROM alpine:3.19\nWORKDIR /app\nEXPOSE 8080\n\nRUN apk add --no-cache libstdc++ gcompat\n\nCOPY --from=builder /build/build/native/nativeCompile/server /app/server\n\nUSER 10001:10001\nENTRYPOINT [\"/app/server\"]"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Instant Container Autoscaling",
        "body": "GraalVM native binaries boot in under 20ms, allowing Kubernetes Horizontal Pod Autoscalers (HPA) to spin up new pods instantaneously in response to traffic surges."
      }
    ],
    "quiz": [
      {
        "id": "kt-grl-1",
        "question": "What is the primary operational benefit of compiling Kotlin backend microservices with GraalVM Native Image?",
        "options": [
          "Sub-20 millisecond container cold-boot times and drastically lower memory consumption (30-40MB RSS)",
          "It automatically increases database CPU speed",
          "It disables type checking during runtime",
          "It converts relational databases to text files"
        ],
        "correctOptionIndex": 0,
        "explanation": "AOT compilation eliminates JVM startup latency and JIT warmup overhead, producing compact native executables that start in milliseconds."
      }
    ]
  },
  {
    "slug": "elixir-functional-patterns-beam",
    "title": "Functional Backend Architecture, Pattern Matching & BEAM VM",
    "courseSlug": "elixir-backend-fundamentals",
    "moduleSlug": "elixir-phoenix-foundations",
    "moduleName": "Fault-Tolerant Distributed APIs with Phoenix",
    "order": 1,
    "category": "Elixir",
    "difficulty": "beginner",
    "xpReward": 120,
    "duration": 18,
    "summary": "Master Elixir functional programming, pattern matching, the pipe operator (`|>`), and the Erlang BEAM Virtual Machine architecture.",
    "description": "Understand how immutable data structures, share-nothing processes, and pattern matching create fault-tolerant backend architectures.",
    "learningPoints": [
      "The BEAM Virtual Machine: isolated preemptive processes with private heaps",
      "Pattern matching on structs, tuples, and function signatures",
      "Function pipeline composition using the pipe operator (`|>`)",
      "Handling success/failure tuples (`{:ok, result}` vs `{:error, reason}`) with `with` syntax"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Power of the BEAM Virtual Machine",
        "body": "The BEAM VM was built by Ericsson for telecom switches that require nine-nines (99.9999999%) availability. Unlike Node.js or Java where an unhandled exception in one request can crash the entire process, BEAM runs every request inside an isolated, lightweight process (only 300 words of memory) with its own garbage collector."
      },
      {
        "type": "code",
        "title": "Idiomatic Functional Pipeline with Pattern Matching in Elixir",
        "language": "elixir",
        "code": "defmodule Platform.OrderPipeline do\n  @moduledoc \"\"\"\n  Handles end-to-end order validation, tax calculation, and payment processing.\n  \"\"\"\n\n  def process_order(params) do\n    with {:ok, order} <- validate_params(params),\n         {:ok, taxed_order} <- calculate_tax(order),\n         {:ok, receipt} <- charge_payment(taxed_order) do\n      {:ok, %{status: :confirmed, receipt_id: receipt.id, total: taxed_order.total}}\n    else\n      {:error, :invalid_params} -> {:error, :bad_request}\n      {:error, :payment_declined} -> {:error, :payment_failed}\n      {:error, reason} -> {:error, reason}\n    end\n  end\n\n  defp validate_params(%{\"amount\" => amount, \"user_id\" => user_id}) when amount > 0 do\n    {:ok, %{amount: amount, user_id: user_id}}\n  end\n  defp validate_params(_invalid), do: {:error, :invalid_params}\n\n  defp calculate_tax(%{amount: amount} = order) do\n    tax = amount * 0.08\n    {:ok, Map.put(order, :total, amount + tax)}\n  end\n\n  defp charge_payment(%{total: total, user_id: uid}) do\n    # Simulated payment charging\n    {:ok, %{id: \"tx_\" <> uid, amount: total}}\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Use 'with' for Clean Fallible Chains",
        "body": "Use the `with` special form to chain fallible operations that return `{:ok, val}` or `{:error, err}` tuples, eliminating deeply nested 'case' statements."
      }
    ],
    "quiz": [
      {
        "id": "ex-func-1",
        "question": "What is the primary architectural advantage of the BEAM Virtual Machine process model in Elixir?",
        "options": [
          "Processes are completely isolated with private heaps, meaning a crash in one process cannot corrupt or terminate other running requests",
          "It converts all Elixir code into Python scripts",
          "It eliminates the need for TCP networking",
          "It runs exclusively on single-core CPUs"
        ],
        "correctOptionIndex": 0,
        "explanation": "BEAM processes do not share memory. If a process crashes due to an unhandled exception, its private memory is reclaimed immediately without affecting other active requests."
      }
    ]
  },
  {
    "slug": "elixir-phoenix-rest-pipeline",
    "title": "Phoenix 1.7 REST API Architecture, Plugs & JSON Views",
    "courseSlug": "phoenix-realtime-distributed-systems",
    "moduleSlug": "elixir-phoenix-foundations",
    "moduleName": "Fault-Tolerant Distributed APIs with Phoenix",
    "order": 2,
    "category": "Elixir",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Build high-throughput REST APIs using Phoenix 1.7, Endpoint and Router pipelines, composable Plugs, and JSON rendering modules.",
    "description": "Master Phoenix's functional request lifecycle where `conn` (Plug.Conn) is transformed through a pipeline of pure functions.",
    "learningPoints": [
      "The `Plug.Conn` pipeline model: transformation of immutable connection structs",
      "Endpoint, Router, and Controller pipeline composition (`pipeline :api do ...`)",
      "Building custom Plugs for authentication and request header validation",
      "Phoenix 1.7 JSON rendering with embedded JSON components"
    ],
    "content": [
      {
        "type": "text",
        "title": "The Phoenix Request Pipeline",
        "body": "In Phoenix, web applications are clean pipelines of functions called Plugs. A request begins as an immutable `%Plug.Conn{}` struct at the Endpoint, flows through router pipelines (parsers, security headers, auth), and is finally rendered by the controller as JSON."
      },
      {
        "type": "code",
        "title": "Phoenix 1.7 API Controller & JSON View Module",
        "language": "elixir",
        "code": "defmodule PlatformWeb.UserController do\n  use PlatformWeb, :controller\n\n  alias Platform.Accounts\n  alias Platform.Accounts.User\n\n  action_fallback PlatformWeb.FallbackController\n\n  def index(conn, _params) do\n    users = Accounts.list_users()\n    render(conn, :index, users: users)\n  end\n\n  def create(conn, %{\"user\" => user_params}) do\n    with {:ok, %User{} = user} <- Accounts.create_user(user_params) do\n      conn\n      |> put_status(:created)\n      |> put_resp_header(\"location\", ~p\"/api/v1/users/#{user}\")\n      |> render(:show, user: user)\n    end\n  end\nend\n\ndefmodule PlatformWeb.UserJSON do\n  def index(%{users: users}) do\n    %{data: for(user <- users, do: data(user))}\n  end\n\n  def show(%{user: user}) do\n    %{data: data(user)}\n  end\n\n  defp data(%User{} = user) do\n    %{\n      id: user.id,\n      email: user.email,\n      username: user.username,\n      inserted_at: user.inserted_at\n    }\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Action Fallback Controller Pattern",
        "body": "Use `action_fallback PlatformWeb.FallbackController` to centralize error mapping. When a controller action returns `{:error, %Ecto.Changeset{}}`, the fallback controller automatically formats it as a 422 Unprocessable Entity."
      }
    ],
    "quiz": [
      {
        "id": "ex-phx-1",
        "question": "What is the core data structure transformed throughout the entire Phoenix web request lifecycle?",
        "options": [
          "Plug.Conn struct (%Plug.Conn{})",
          "Java HttpServletRequest object",
          "Global environment hash table",
          "SQL database transaction pointer"
        ],
        "correctOptionIndex": 0,
        "explanation": "Plug.Conn is the foundational immutable struct representing the HTTP request and response in Phoenix, passed and modified sequentially through function pipelines."
      }
    ]
  },
  {
    "slug": "elixir-ecto-changesets-queries",
    "title": "Ecto Schema, Changesets, Composability & Ecto.Multi Transactions",
    "courseSlug": "phoenix-realtime-distributed-systems",
    "moduleSlug": "elixir-phoenix-foundations",
    "moduleName": "Fault-Tolerant Distributed APIs with Phoenix",
    "order": 3,
    "category": "Elixir",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 22,
    "summary": "Master database persistence with Ecto schemas, casting, validation Changesets, composable Ecto.Query pipelines, and ACID transactions with Ecto.Multi.",
    "description": "Learn how Ecto decouples data validation from database persistence, and how Ecto.Multi coordinates multi-table atomic operations.",
    "learningPoints": [
      "Defining Ecto schemas with typed fields and associations",
      "Changeset validation pipelines (`cast`, `validate_required`, `validate_format`, `unique_constraint`)",
      "Writing composable database queries with `Ecto.Query`",
      "Executing complex ACID transactions with `Ecto.Multi`"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Ecto Changesets are Superior to ORM Models",
        "body": "Traditional ORMs merge validation, persistence, and state into a single mutable model. Ecto separates schemas (data definitions) from Changesets (data transformations and validation rules). A changeset explicitly tracks what was cast, what changed, and whether the data is valid before attempting any SQL query."
      },
      {
        "type": "code",
        "title": "Ecto Schema with Changeset Validation & Ecto.Multi Transaction",
        "language": "elixir",
        "code": "defmodule Platform.Accounts.User do\n  use Ecto.Schema\n  import Ecto.Changeset\n\n  @primary_key {:id, :binary_id, autogenerate: true}\n  schema \"users\" do\n    field :email, :string\n    field :balance, :decimal, default: 0.0\n    field :role, :string, default: \"member\"\n\n    timestamps()\n  end\n\n  def changeset(user, attrs) do\n    user\n    |> cast(attrs, [:email, :role, :balance])\n    |> validate_required([:email])\n    |> validate_format(:email, ~r/^[^\\s]+@[^\\s]+$/, message: \"must have the @ sign and no spaces\")\n    |> unique_constraint(:email)\n  end\nend\n\ndefmodule Platform.Banking do\n  alias Platform.Repo\n  alias Platform.Accounts.User\n  alias Ecto.Multi\n\n  def transfer_funds(from_user, to_user, amount) do\n    Multi.new()\n    |> Multi.update(:debit_sender, User.changeset(from_user, %{balance: Decimal.sub(from_user.balance, amount)}))\n    |> Multi.update(:credit_recipient, User.changeset(to_user, %{balance: Decimal.add(to_user.balance, amount)}))\n    |> Repo.transaction()\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Always Handle Database Constraints in Changesets",
        "body": "Functions like `unique_constraint(:email)` do not perform an expensive SELECT query; instead, they catch the PostgreSQL unique violation error during INSERT and convert it gracefully into a readable changeset error."
      }
    ],
    "quiz": [
      {
        "id": "ex-ecto-1",
        "question": "What is the primary benefit of using Ecto.Multi for multi-step database operations in Elixir?",
        "options": [
          "It packages multiple distinct database mutations into a single atomic ACID transaction with named rollback steps",
          "It converts PostgreSQL into MongoDB at runtime",
          "It forces queries to execute without database locks",
          "It caches all database tables in Redis automatically"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ecto.Multi allows you to compose multiple database operations (inserts, updates, deletes, custom functions) and execute them within a single atomic database transaction."
      }
    ]
  },
  {
    "slug": "elixir-phoenix-channels-websockets",
    "title": "Real-Time WebSocket Architecture with Phoenix Channels & PubSub",
    "courseSlug": "phoenix-realtime-distributed-systems",
    "moduleSlug": "elixir-phoenix-foundations",
    "moduleName": "Fault-Tolerant Distributed APIs with Phoenix",
    "order": 4,
    "category": "Elixir",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Build real-time distributed WebSockets with Phoenix Channels, Phoenix.PubSub, and multi-node Presence tracking.",
    "description": "Learn how Phoenix scales to over 2 million concurrent WebSocket connections on a single server, delivering sub-millisecond broadcast latency.",
    "learningPoints": [
      "Phoenix Channels architecture: Socket, Channel, and Topic multiplexing",
      "Distributed broadcasting using Phoenix.PubSub across clustered BEAM nodes",
      "Handling incoming events with `handle_in/3` and pushing with `push/3`",
      "Conflict-free distributed presence tracking with `Phoenix.Presence`"
    ],
    "content": [
      {
        "type": "text",
        "title": "The 2-Million Connection Benchmark",
        "body": "Phoenix famously established 2 million simultaneous active WebSocket connections on a single server while maintaining sub-millisecond broadcast latency. Because each connection is a lightweight BEAM process, servers easily manage millions of live chat rooms, trading feeds, and IoT updates."
      },
      {
        "type": "code",
        "title": "Phoenix Channel Implementation with Real-Time Broadcasting",
        "language": "elixir",
        "code": "defmodule PlatformWeb.RoomChannel do\n  use PlatformWeb, :channel\n  alias PlatformWeb.Presence\n\n  @doc \"\"\"\n  Clients join a chat topic: \"room:general\"\n  \"\"\"\n  def join(\"room:\" <> room_id, _payload, socket) do\n    send(self(), :after_join)\n    {:ok, assign(socket, :room_id, room_id)}\n  end\n\n  def handle_info(:after_join, socket) do\n    # Track user in distributed Presence registry\n    {:ok, _} = Presence.track(socket, socket.assigns.user_id, %{\n      online_at: inspect(System.system_time(:second))\n    })\n    push(socket, \"presence_state\", Presence.list(socket))\n    {:noreply, socket}\n  end\n\n  # Handle incoming messages and broadcast to all connected subscribers\n  def handle_in(\"new_msg\", %{\"body\" => body}, socket) do\n    broadcast!(socket, \"new_msg\", %{\n      user_id: socket.assigns.user_id,\n      body: body,\n      timestamp: DateTime.utc_now()\n    })\n    {:noreply, socket}\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Zero-Configuration Clustering with PubSub",
        "body": "When multiple Phoenix servers are connected via Distributed Erlang, `Phoenix.PubSub` automatically synchronizes channel broadcasts across all cluster nodes without needing external Redis bridges."
      }
    ],
    "quiz": [
      {
        "id": "ex-chan-1",
        "question": "How does Phoenix manage millions of active WebSocket connections on a single physical machine?",
        "options": [
          "Each WebSocket client connection is powered by an independent, lightweight BEAM process that uses only ~2KB of memory",
          "It opens a physical OS thread per client connection",
          "It polls the client using HTTP GET every 5 seconds",
          "It saves socket messages to disk files"
        ],
        "correctOptionIndex": 0,
        "explanation": "BEAM processes are ultra-lightweight (starting at a few kilobytes of RAM), allowing Phoenix to run millions of concurrent WebSocket processes on standard commodity hardware."
      }
    ]
  },
  {
    "slug": "elixir-genserver-state-machine",
    "title": "OTP GenServer: Stateful Concurrent Processes, Calls & Casts",
    "courseSlug": "elixir-backend-fundamentals",
    "moduleSlug": "elixir-otp-architecture",
    "moduleName": "OTP Distributed Systems & Concurrency",
    "order": 1,
    "category": "Elixir",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Master OTP GenServer architecture: client-server separation, state management, synchronous `call/3`, and asynchronous `cast/2`.",
    "description": "Learn how to build stateful concurrent background workers, in-memory caches, and rate-limiting processes using GenServer.",
    "learningPoints": [
      "The Actor model in Elixir and OTP GenServer abstraction",
      "Client API functions vs Server callback implementations (`init/1`, `handle_call/3`, `handle_cast/2`)",
      "Synchronous blocking requests with `GenServer.call` vs fire-and-forget `GenServer.cast`",
      "Managing state evolution safely without mutexes or race conditions"
    ],
    "content": [
      {
        "type": "text",
        "title": "The GenServer Architecture",
        "body": "A GenServer (Generic Server) is an OTP process that manages state, executes code asynchronously, and receives messages through its process mailbox. Because each GenServer processes incoming messages sequentially one at a time, state mutations are inherently thread-safe without needing mutex locks."
      },
      {
        "type": "code",
        "title": "In-Memory Rate Limiting GenServer in Elixir",
        "language": "elixir",
        "code": "defmodule Platform.RateLimiter do\n  use GenServer\n\n  # Client API\n  def start_link(opts \\\\ []) do\n    GenServer.start_link(__MODULE__, %{}, name: opts[:name] || __MODULE__)\n  end\n\n  def allow_request?(ip_address, max_requests \\\\ 100) do\n    GenServer.call(__MODULE__, {:check_rate, ip_address, max_requests})\n  end\n\n  def reset_limits do\n    GenServer.cast(__MODULE__, :reset_all)\n  end\n\n  # Server Callbacks\n  @impl true\n  def init(_opts) do\n    {:ok, %{}} # Initial state: empty map of {ip => count}\n  end\n\n  @impl true\n  def handle_call({:check_rate, ip, max_limit}, _from, state) do\n    current_count = Map.get(state, ip, 0)\n\n    if current_count < max_limit do\n      new_state = Map.put(state, ip, current_count + 1)\n      {:reply, {:allow, max_limit - current_count - 1}, new_state}\n    else\n      {:reply, {:deny, :rate_exceeded}, state}\n    end\n  end\n\n  @impl true\n  def handle_cast(:reset_all, _state) do\n    {:noreply, %{}} # Reset state to empty map\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Avoid Bottlenecks in GenServers",
        "body": "Because a GenServer processes messages sequentially, never perform slow synchronous operations (like long HTTP calls) inside a `handle_call`. Offload slow work to a `Task.async` or a pool of workers."
      }
    ],
    "quiz": [
      {
        "id": "ex-gen-1",
        "question": "Why are state modifications inside an Elixir GenServer guaranteed to be free of race conditions without using mutex locks?",
        "options": [
          "Because the GenServer process dequeues and handles messages from its process mailbox sequentially in a single process loop",
          "Because Elixir disables multi-core CPU usage",
          "Because the Erlang VM runs on quantum computers",
          "Because state is saved to a PostgreSQL database table after every function"
        ],
        "correctOptionIndex": 0,
        "explanation": "A GenServer has a single thread of execution that processes messages from its mailbox one at a time, ensuring absolute serial consistency without lock contention."
      }
    ]
  },
  {
    "slug": "elixir-supervisors-fault-tolerance",
    "title": "Supervision Trees, 'Let It Crash' Philosophy & Restart Strategies",
    "courseSlug": "elixir-backend-fundamentals",
    "moduleSlug": "elixir-otp-architecture",
    "moduleName": "OTP Distributed Systems & Concurrency",
    "order": 2,
    "category": "Elixir",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Master OTP Supervision Trees, the 'Let It Crash' design philosophy, and restart strategies (:one_for_one, :one_for_all, :rest_for_one).",
    "description": "Learn how self-healing supervision trees detect process crashes, isolate failures, and restore systems to clean initial states automatically.",
    "learningPoints": [
      "The 'Let It Crash' philosophy: why defensive try/catch code is anti-pattern in Erlang/Elixir",
      "Supervisor restart strategies: `:one_for_one`, `:one_for_all`, `:rest_for_one`",
      "Child specifications (`child_spec`), shutdown timeouts, and restart types (:permanent, :transient, :temporary)",
      "Designing resilient nested application supervision trees"
    ],
    "content": [
      {
        "type": "text",
        "title": "The 'Let It Crash' Philosophy",
        "body": "In traditional languages, developers clutter code with defensive error handlers to prevent process crashes. In Elixir, if an unexpected error occurs, you let the process crash. The supervisor instantly restarts the process in a known, pristine state, clearing corrupted memory."
      },
      {
        "type": "code",
        "title": "Application Supervision Tree with Multiple Restart Strategies",
        "language": "elixir",
        "code": "defmodule Platform.Application do\n  use Application\n\n  @impl true\n  def start(_type, _args) do\n    children = [\n      # Database Connection Pool\n      Platform.Repo,\n      # Distributed PubSub\n      {Phoenix.PubSub, name: Platform.PubSub},\n      # Real-Time Presence\n      PlatformWeb.Presence,\n      # In-Memory Rate Limiter GenServer\n      Platform.RateLimiter,\n      # Web Endpoint\n      PlatformWeb.Endpoint\n    ]\n\n    # :one_for_one: If one child crashes, only that specific child is restarted\n    opts = [strategy: :one_for_one, name: Platform.Supervisor]\n    Supervisor.start_link(children, opts)\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Restart Strategy Cheatsheet",
        "body": "1. `:one_for_one` — Restarts only the crashed child.\\n2. `:one_for_all` — Restarts all siblings if one crashes.\\n3. `:rest_for_one` — Restarts the crashed child and any sibling started after it."
      }
    ],
    "quiz": [
      {
        "id": "ex-sup-1",
        "question": "What occurs when a worker supervised with the ':one_for_one' strategy crashes due to an unhandled exception?",
        "options": [
          "The supervisor catches the exit signal and restarts only the crashed process, leaving other sibling processes unaffected",
          "The entire operating system reboots",
          "The application terminates permanently with exit code 1",
          "The supervisor logs an error and deletes the database"
        ],
        "correctOptionIndex": 0,
        "explanation": "With the :one_for_one strategy, the supervisor isolates the failure and restarts only the affected child process back into its clean initial state."
      }
    ]
  },
  {
    "slug": "elixir-guardian-jwt-auth",
    "title": "Stateless API Authentication with Guardian & JWT Tokens",
    "courseSlug": "phoenix-realtime-distributed-systems",
    "moduleSlug": "elixir-otp-architecture",
    "moduleName": "OTP Distributed Systems & Concurrency",
    "order": 3,
    "category": "Elixir",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Secure Phoenix APIs using the Guardian JWT library, Plug pipeline interceptors, claims verification, and Argon2 password hashing.",
    "description": "Learn how Guardian serializes subjects to JWT tokens and validates signatures across HTTP headers and WebSocket channel handshakes.",
    "learningPoints": [
      "Implementing Guardian callbacks (`subject_for_token/2` and `resource_from_claims/1`)",
      "Building authentication Plug pipelines (`Guardian.Plug.VerifyHeader`, `EnsureAuthenticated`)",
      "Password hashing with Comeonin and Argon2 in Elixir",
      "Extracting the current authenticated user resource using `Guardian.Plug.current_resource(conn)`"
    ],
    "content": [
      {
        "type": "text",
        "title": "Stateless JWT Authentication with Guardian",
        "body": "Guardian is the leading authentication library for Elixir. By implementing the `Guardian` behaviour module, you define how user entities are converted into cryptographic JWT claims and deserialized back into `%User{}` structs during request pipeline execution."
      },
      {
        "type": "code",
        "title": "Guardian Implementation Module and Auth Pipeline Plugs",
        "language": "elixir",
        "code": "defmodule Platform.Guardian do\n  use Guardian, otp_app: :platform\n\n  alias Platform.Accounts\n  alias Platform.Accounts.User\n\n  def subject_for_token(%User{id: id}, _claims) do\n    {:ok, to_string(id)}\n  end\n\n  def resource_from_claims(%{\"sub\" => id}) do\n    case Accounts.get_user(id) do\n      nil -> {:error, :resource_not_found}\n      user -> {:ok, user}\n    end\n  end\nend\n\ndefmodule PlatformWeb.AuthPipeline do\n  use Guardian.Plug.Pipeline,\n    otp_app: :platform,\n    module: Platform.Guardian,\n    error_handler: PlatformWeb.AuthErrorHandler\n\n  plug Guardian.Plug.VerifyHeader, scheme: \"Bearer\"\n  plug Guardian.Plug.EnsureAuthenticated\n  plug Guardian.Plug.LoadResource\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Mount AuthPipeline in Router",
        "body": "Attach the pipeline to private route groups: `pipe_through [:api, :authenticated_api]` to guarantee only requests with valid bearer tokens reach downstream controllers."
      }
    ],
    "quiz": [
      {
        "id": "ex-grd-1",
        "question": "What is the role of resource_from_claims/1 in an Elixir Guardian module?",
        "options": [
          "It extracts the user ID from the verified JWT 'sub' claim and fetches the corresponding User database struct",
          "It creates new database tables for every incoming request",
          "It encrypts the entire PostgreSQL database",
          "It validates HTML template syntax"
        ],
        "correctOptionIndex": 0,
        "explanation": "resource_from_claims takes the decoded JWT claims map and loads the user entity from database/memory, making it accessible via Guardian.Plug.current_resource(conn)."
      }
    ]
  },
  {
    "slug": "elixir-telemetry-production",
    "title": "Production Observability: BEAM Telemetry, LiveDashboard & Releases",
    "courseSlug": "elixir-backend-fundamentals",
    "moduleSlug": "elixir-otp-architecture",
    "moduleName": "OTP Distributed Systems & Concurrency",
    "order": 4,
    "category": "Elixir",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Instrument Elixir backends with :telemetry, Phoenix LiveDashboard real-time memory metrics, Prometheus exporters, and standalone Mix releases.",
    "description": "Learn how to monitor BEAM process queues, scheduler utilization, ETS memory tables, and package zero-dependency production releases with `mix release`.",
    "learningPoints": [
      "The Erlang/Elixir `:telemetry` event dispatching architecture",
      "Monitoring BEAM runtime internals: Scheduler utilization, Process count, ETS tables",
      "Integrating Phoenix LiveDashboard for live production inspection",
      "Packaging self-contained Linux releases with `mix release` and multi-stage Docker"
    ],
    "content": [
      {
        "type": "text",
        "title": "Real-Time Telemetry on the BEAM",
        "body": "The BEAM VM provides unprecedented runtime visibility. Using `:telemetry`, every database query, HTTP request, and GenServer call emits dimensional metrics with zero performance penalty. Phoenix LiveDashboard visualizes process counts, memory fragmentation, and garbage collection in real time."
      },
      {
        "type": "code",
        "title": "Telemetry Metrics Configuration & Handler Attachment",
        "language": "elixir",
        "code": "defmodule PlatformWeb.Telemetry do\n  use Supervisor\n  import Telemetry.Metrics\n\n  def start_link(arg) do\n    Supervisor.start_link(__MODULE__, arg, name: __MODULE__)\n  end\n\n  @impl true\n  def init(_arg) do\n    children = [\n      {:telemetry_poller, measurements: periodic_measurements(), period: 10_000}\n    ]\n\n    Supervisor.init(children, strategy: :one_for_one)\n  end\n\n  def metrics do\n    [\n      # Phoenix Metrics\n      summary(\"phoenix.endpoint.stop.duration\", unit: {:native, :millisecond}),\n      summary(\"phoenix.router_dispatch.stop.duration\", tags: [:route], unit: {:native, :millisecond}),\n\n      # Database Metrics\n      summary(\"platform.repo.query.total_time\", unit: {:native, :millisecond}),\n\n      # VM Memory Metrics\n      last_value(\"vm.memory.total\", unit: :byte),\n      last_value(\"vm.total_run_queue_lengths.total\")\n    ]\n  end\n\n  defp periodic_measurements do\n    [\n      {PlatformWeb.Telemetry, :measure_custom_stats, []}\n    ]\n  end\nend"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Standalone Mix Releases",
        "body": "Run `mix release` to package your application and the Erlang runtime into a self-contained tarball. The resulting container does not require Elixir or Erlang installed on the host."
      }
    ],
    "quiz": [
      {
        "id": "ex-tel-1",
        "question": "What is the primary benefit of packaging an Elixir application with 'mix release' for production deployment?",
        "options": [
          "It produces a standalone, self-contained executable bundle containing the compiled bytecode and the minimal Erlang runtime, requiring no Elixir/Erlang installed on the server",
          "It converts Elixir code to compiled C++",
          "It disables all logging to save disk space",
          "It eliminates the need for database storage"
        ],
        "correctOptionIndex": 0,
        "explanation": "Mix releases package only the required BEAM bytecode and minimal ERTS runtime into an immutable directory, enabling clean Docker deployments without build tools."
      }
    ]
  },
  {
    "slug": "py-asyncio-event-loop",
    "title": "Asyncio Event Loop, Coroutines & Non-Blocking I/O in Python 3",
    "courseSlug": "python-backend-fundamentals",
    "moduleSlug": "python-async-concurrency",
    "moduleName": "Async Concurrency & GIL Internals",
    "order": 1,
    "category": "Python",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 18,
    "summary": "Master Python's asyncio single-threaded event loop, task scheduling, cooperative multitasking, and non-blocking network I/O.",
    "description": "Understand how async def, await, asyncio.gather, and TaskGroups execute high-throughput I/O operations without thread blocking.",
    "learningPoints": [
      "Understanding the asyncio event loop and cooperative yield mechanism",
      "Executing concurrent coroutines with asyncio.gather and asyncio.TaskGroup",
      "Preventing blocking CPU calls from freezing the event loop using run_in_executor",
      "Handling cancellation signals, timeouts, and exception propagation"
    ],
    "content": [
      {
        "type": "text",
        "title": "Asynchronous Concurrency in Python",
        "body": "Python uses a single-threaded event loop to drive cooperative multitasking. When a coroutine awaits an I/O operation (like a database query or external HTTP call), execution yields back to the loop, allowing other tasks to progress concurrently."
      },
      {
        "type": "code",
        "title": "High-Throughput Concurrent Fetcher with TaskGroup",
        "language": "python",
        "code": "import asyncio\nimport httpx\nimport logging\n\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger(\"async_pipeline\")\n\nasync def fetch_service_health(client: httpx.AsyncClient, service_name: str, url: str) -> dict:\n    try:\n        response = await client.get(url, timeout=5.0)\n        return {\"service\": service_name, \"status\": response.status_code, \"healthy\": response.status_code == 200}\n    except httpx.RequestError as exc:\n        logger.error(f\"Failed to check {service_name}: {exc}\")\n        return {\"service\": service_name, \"status\": 503, \"healthy\": False}\n\nasync def check_all_services(endpoints: dict[str, str]) -> list[dict]:\n    async with httpx.AsyncClient() as client:\n        # Python 3.11+ TaskGroup for structured concurrency\n        async with asyncio.TaskGroup() as tg:\n            tasks = [\n                tg.create_task(fetch_service_health(client, name, url))\n                for name, url in endpoints.items()\n            ]\n        return [task.result() for task in tasks]\n\nif __name__ == \"__main__\":\n    endpoints = {\n        \"auth\": \"https://auth.internal/health\",\n        \"billing\": \"https://billing.internal/health\",\n        \"orders\": \"https://orders.internal/health\"\n    }\n    results = asyncio.run(check_all_services(endpoints))\n    logger.info(f\"Health check results: {results}\")"
      },
      {
        "type": "callout",
        "title": "The Golden Rule of Asyncio",
        "variant": "warning",
        "body": "Never invoke blocking CPU-bound loops or synchronous I/O libraries (like `requests` or `time.sleep`) inside an async coroutine. Doing so freezes the entire event loop, stopping all active HTTP requests!"
      }
    ],
    "quiz": [
      {
        "id": "py-async-q1",
        "question": "What occurs when a blocking synchronous call like time.sleep(5) is executed inside an async def coroutine?",
        "options": [
          "The entire event loop is blocked, freezing all concurrent requests for 5 seconds",
          "Asyncio automatically moves the sleep call to a background OS thread",
          "The coroutine yields execution to other tasks automatically",
          "Python throws an UnhandledConcurrencyException"
        ],
        "correctOptionIndex": 0,
        "explanation": "Synchronous blocking calls hold the thread and prevent the event loop from scheduling other tasks until they complete."
      },
      {
        "id": "py-async-q2",
        "question": "Which Python 3.11+ feature provides structured concurrency where any failed task cleanly cancels its siblings?",
        "options": [
          "asyncio.TaskGroup",
          "asyncio.wait_for_all",
          "threading.ThreadPool",
          "multiprocessing.ProcessPool"
        ],
        "correctOptionIndex": 0,
        "explanation": "asyncio.TaskGroup guarantees structured concurrency and cleans up pending child tasks on unhandled exceptions."
      }
    ]
  },
  {
    "slug": "py-multiprocessing-workers",
    "title": "Multi-Process Architecture, GIL Bypass & Gunicorn Worker Model",
    "courseSlug": "python-backend-fundamentals",
    "moduleSlug": "python-async-concurrency",
    "moduleName": "Async Concurrency & GIL Internals",
    "order": 2,
    "category": "Python",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 18,
    "summary": "Bypass CPython's Global Interpreter Lock (GIL) using multi-process worker architectures with Gunicorn, Uvicorn workers, and IPC shared memory.",
    "description": "Scale Python backend workloads across all CPU cores with pre-fork worker models and master-worker lifecycle management.",
    "learningPoints": [
      "Understanding the Global Interpreter Lock (GIL) and CPU parallelism limitations",
      "Configuring Gunicorn pre-fork master process with UvicornWorker workers",
      "Calculating optimal worker count: (2 x $num_cores) + 1",
      "Sharing state across processes safely using Redis or shared memory"
    ],
    "content": [
      {
        "type": "text",
        "title": "Scaling Beyond the GIL with Pre-Forking",
        "body": "The CPython GIL permits only one thread to execute Python bytecode at a time. To utilize all physical cores on a multi-core backend server, production deployments use pre-forking process models where a master process forks worker processes."
      },
      {
        "type": "code",
        "title": "Production Gunicorn + Uvicorn Configuration (gunicorn.conf.py)",
        "language": "python",
        "code": "import multiprocessing\nimport os\n\n# Calculate optimal workers: (2 * CPU cores) + 1\nworkers = int(os.getenv(\"WEB_CONCURRENCY\", multiprocessing.cpu_count() * 2 + 1))\nworker_class = \"uvicorn.workers.UvicornWorker\"\nbind = \"0.0.0.0:8000\"\n\n# Timeouts and keepalive for high-traffic load balancers\nkeepalive = 65\ntimeout = 30\ngraceful_timeout = 30\n\n# Worker recycling to prevent memory leak degradation\nmax_requests = 10000\nmax_requests_jitter = 500\n\n# Access logging\naccesslog = \"-\"\nerrorlog = \"-\"\nloglevel = \"info\"\n\ndef on_starting(server):\n    server.log.info(f\"Master starting with {workers} Uvicorn worker processes...\")"
      },
      {
        "type": "callout",
        "title": "Worker Recycling Strategy",
        "variant": "info",
        "body": "Setting `max_requests` with `max_requests_jitter` automatically restarts worker processes after serving a set number of requests, mitigating long-term memory leaks in C-extensions."
      }
    ],
    "quiz": [
      {
        "id": "py-mp-q1",
        "question": "What is the standard formula for sizing Gunicorn worker processes on a dedicated backend server?",
        "options": [
          "(2 * CPU Cores) + 1",
          "1 worker per gigabyte of RAM",
          "Exactly 1 worker per server",
          "100 workers per CPU core"
        ],
        "correctOptionIndex": 0,
        "explanation": "(2 * CPU Cores) + 1 provides the optimal balance of CPU saturation while waiting on disk/network I/O."
      }
    ]
  },
  {
    "slug": "py-context-managers-decorators",
    "title": "Advanced Python Meta-Programming: Decorators & Async Context Managers",
    "courseSlug": "python-backend-fundamentals",
    "moduleSlug": "python-core-architecture",
    "moduleName": "Advanced Python Architecture",
    "order": 3,
    "category": "Python",
    "difficulty": "advanced",
    "xpReward": 140,
    "duration": 20,
    "summary": "Build production middleware decorators, timing interceptors, and robust async context managers for resource acquisition (DB connections, locks).",
    "description": "Master functools.wraps, parameter-accepting decorators, and asynccontextmanager for deterministic teardown.",
    "learningPoints": [
      "Constructing parametric function decorators preserving metadata with functools.wraps",
      "Creating transactional async context managers with @asynccontextmanager",
      "Deterministic resource cleanup (RAII pattern) in asynchronous Python backends",
      "Building automatic retry decorators with exponential backoff"
    ],
    "content": [
      {
        "type": "text",
        "title": "Enterprise Python Metaprogramming",
        "body": "Decorators and context managers encapsulate cross-cutting concerns like database transaction boundaries, execution metrics, distributed locks, and retry policies."
      },
      {
        "type": "code",
        "title": "Async Transaction Manager & Retry Decorator",
        "language": "python",
        "code": "import asyncio\nimport functools\nimport logging\nfrom contextlib import asynccontextmanager\nfrom typing import AsyncGenerator, Callable, Any\n\nlogger = logging.getLogger(\"decorators\")\n\ndef retry(max_attempts: int = 3, base_delay: float = 0.5):\n    # Parametric retry decorator with exponential backoff.\n    def decorator(func: Callable[..., Any]):\n        @functools.wraps(func)\n        async def wrapper(*args: Any, **kwargs: Any):\n            attempt = 1\n            while True:\n                try:\n                    return await func(*args, **kwargs)\n                except Exception as exc:\n                    if attempt >= max_attempts:\n                        logger.error(f\"Function {func.__name__} failed after {max_attempts} attempts: {exc}\")\n                        raise\n                    delay = base_delay * (2 ** (attempt - 1))\n                    logger.warning(f\"Attempt {attempt} failed for {func.__name__}. Retrying in {delay}s...\")\n                    await asyncio.sleep(delay)\n                    attempt += 1\n        return wrapper\n    return decorator\n\n@asynccontextmanager\nasync def transactional_scope(session_factory) -> AsyncGenerator:\n    # Async context manager for atomic database units of work.\n    session = session_factory()\n    try:\n        yield session\n        await session.commit()\n    except Exception:\n        await session.rollback()\n        raise\n    finally:\n        await session.close()"
      }
    ],
    "quiz": [
      {
        "id": "py-meta-q1",
        "question": "Why is @functools.wraps(func) critical when implementing custom decorators in Python?",
        "options": [
          "It preserves the original function's name, docstring, and signature metadata",
          "It makes the wrapped function run 50% faster in CPython",
          "It converts synchronous functions into coroutines automatically",
          "It prevents syntax errors when passing keyword arguments"
        ],
        "correctOptionIndex": 0,
        "explanation": "Without functools.wraps, the decorated function loses its __name__ and __doc__, corrupting introspection and debugging tools."
      }
    ]
  },
  {
    "slug": "py-logging-observability",
    "title": "Structured JSON Logging, Correlation IDs & Sentry Tracing",
    "courseSlug": "python-backend-fundamentals",
    "moduleSlug": "python-core-architecture",
    "moduleName": "Advanced Python Architecture",
    "order": 4,
    "category": "Python",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 18,
    "summary": "Implement enterprise structured logging with structlog, request contextvars for trace correlation, and exception reporting.",
    "description": "Ensure every log message is JSON formatted with distributed correlation IDs for Datadog, Elasticsearch, and CloudWatch.",
    "learningPoints": [
      "Using contextvars to store request-scoped correlation IDs across async calls",
      "Configuring structlog for JSON log emission in production",
      "Capturing uncaught exceptions with full stack traces and contextual tags",
      "Measuring and emitting function latency metrics"
    ],
    "content": [
      {
        "type": "text",
        "title": "Production Observability in Python",
        "body": "Plain text logs are difficult to index across high-volume microservices. Emitting structured JSON logs with contextvars allows correlating all log entries belonging to a single client HTTP request."
      },
      {
        "type": "code",
        "title": "ContextVar Request Tracing & Structured Logging",
        "language": "python",
        "code": "import contextvars\nimport json\nimport logging\nimport uuid\nfrom typing import Any\n\n# Context variable stored per async execution context\nrequest_id_ctx: contextvars.ContextVar[str] = contextvars.ContextVar(\"request_id\", default=\"system\")\n\nclass StructuredJsonFormatter(logging.Formatter):\n    def format(self, record: logging.LogRecord) -> str:\n        log_payload = {\n            \"timestamp\": self.formatTime(record, self.datefmt),\n            \"level\": record.levelname,\n            \"message\": record.getMessage(),\n            \"logger\": record.name,\n            \"request_id\": request_id_ctx.get(),\n            \"module\": record.module,\n            \"line\": record.lineno\n        }\n        if record.exc_info:\n            log_payload[\"exception\"] = self.formatException(record.exc_info)\n        return json.dumps(log_payload)\n\n# Example usage in FastAPI / ASGI middleware\nasync def trace_middleware(request, call_next):\n    req_id = request.headers.get(\"X-Request-ID\", str(uuid.uuid4()))\n    token = request_id_ctx.set(req_id)\n    try:\n        response = await call_next(request)\n        response.headers[\"X-Request-ID\"] = req_id\n        return response\n    finally:\n        request_id_ctx.reset(token)"
      }
    ],
    "quiz": [
      {
        "id": "py-log-q1",
        "question": "Which Python standard library module allows storing request-scoped metadata (like trace IDs) safely across async coroutines?",
        "options": [
          "contextvars",
          "threading.local",
          "globals()",
          "sys.trace"
        ],
        "correctOptionIndex": 0,
        "explanation": "contextvars provides context-local storage that correctly tracks asynchronous task branches, unlike threading.local."
      }
    ]
  },
  {
    "slug": "py-fastapi-core-architecture",
    "title": "FastAPI Architecture: Dependency Injection, Async Handlers & OpenAPI",
    "courseSlug": "fastapi-modern-apis",
    "moduleSlug": "fastapi-core",
    "moduleName": "FastAPI Core Architecture",
    "order": 1,
    "category": "Python",
    "difficulty": "beginner",
    "xpReward": 120,
    "duration": 15,
    "summary": "Master FastAPI ASGI architecture, Depends dependency injection system, automatic OpenAPI documentation, and asynchronous route execution.",
    "description": "Build high-performance REST APIs with FastAPI, understanding its ASGI foundation on Starlette and Pydantic validation engine.",
    "learningPoints": [
      "Understanding FastAPI ASGI application architecture with Starlette",
      "Using the Depends dependency injection system for modular auth and database sessions",
      "Automatic interactive OpenAPI documentation generation (/docs and /redoc)",
      "Configuring CORS, security headers, and global exception handlers"
    ],
    "content": [
      {
        "type": "text",
        "title": "FastAPI: The Modern Standard for Python Web Services",
        "body": "FastAPI is built on Starlette (ASGI toolkit) and Pydantic (data parsing). It offers native async support, automatic OpenAPI schema generation, and an expressive dependency injection system."
      },
      {
        "type": "code",
        "title": "FastAPI App with Dependency Injection Pipeline",
        "language": "python",
        "code": "from fastapi import FastAPI, Depends, HTTPException, status\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom pydantic import BaseModel, EmailStr\nfrom typing import Annotated\n\napp = FastAPI(title=\"Production Orders API\", version=\"1.0.0\")\n\n# Enable CORS for frontend clients\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=[\"http://localhost:3000\", \"https://app.production.com\"],\n    allow_credentials=True,\n    allow_methods=[\"*\"],\n    allow_headers=[\"*\"],\n)\n\nclass UserDTO(BaseModel):\n    id: str\n    email: EmailStr\n    is_active: bool\n\nasync def get_current_user(token: str = \"bearer-demo-token\") -> UserDTO:\n    # Dependency for authenticating client JWTs.\n    if token != \"bearer-demo-token\":\n        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=\"Invalid token\")\n    return UserDTO(id=\"usr_101\", email=\"engineer@backend.org\", is_active=True)\n\n@app.get(\"/api/v1/profile\", response_model=UserDTO)\nasync def get_profile(user: Annotated[UserDTO, Depends(get_current_user)]):\n    return user"
      }
    ],
    "quiz": [
      {
        "id": "fa-arch-q1",
        "question": "What is the primary underlying ASGI framework that powers FastAPI's HTTP routing and middleware?",
        "options": [
          "Starlette",
          "Flask",
          "Tornado",
          "Django Core"
        ],
        "correctOptionIndex": 0,
        "explanation": "FastAPI is built directly on top of Starlette for high-performance ASGI routing and middleware."
      }
    ]
  },
  {
    "slug": "py-pydantic-validation-dtos",
    "title": "Pydantic V2: Schema Validation, Serializers & Field Constraints",
    "courseSlug": "fastapi-modern-apis",
    "moduleSlug": "fastapi-core",
    "moduleName": "FastAPI Core Architecture",
    "order": 2,
    "category": "Python",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 18,
    "summary": "Leverage Pydantic V2's Rust-backed core for ultra-fast request parsing, custom validators, computed fields, and nested data schemas.",
    "description": "Master model_validator, field_validator, ConfigDict, and strict mode parsing to guarantee input hygiene.",
    "learningPoints": [
      "Pydantic V2 architecture with pydantic-core written in Rust",
      "Enforcing constraints with Field(min_length=..., ge=..., pattern=...)",
      "Writing reusable validators using @field_validator and @model_validator",
      "Handling nested polymorphic models and custom JSON serializers"
    ],
    "content": [
      {
        "type": "text",
        "title": "Type Safety & Input Validation with Pydantic V2",
        "body": "Pydantic V2 processes JSON validation in compiled Rust, achieving up to 20x speedups over V1 while providing strict type coercion rules."
      },
      {
        "type": "code",
        "title": "Pydantic V2 Production Schema Definitions",
        "language": "python",
        "code": "from pydantic import BaseModel, Field, EmailStr, field_validator, model_validator, ConfigDict\nfrom decimal import Decimal\nfrom typing import Annotated\n\nclass CreateOrderRequest(BaseModel):\n    model_config = ConfigDict(strict=True, str_strip_whitespace=True)\n\n    customer_email: EmailStr\n    sku: Annotated[str, Field(pattern=r\"^[A-Z]{3}-\\d{4}$\", description=\"Format: ABC-1234\")]\n    quantity: Annotated[int, Field(ge=1, le=100)]\n    unit_price: Annotated[Decimal, Field(gt=Decimal(\"0.00\"))]\n    notes: str | None = Field(default=None, max_length=500)\n\n    @field_validator(\"sku\")\n    @classmethod\n    def validate_sku_prefix(cls, v: str) -> str:\n        if v.startswith(\"TST\"):\n            raise ValueError(\"Test SKUs cannot be processed in live orders\")\n        return v\n\n    @property\n    def total_amount(self) -> Decimal:\n        return self.quantity * self.unit_price"
      }
    ],
    "quiz": [
      {
        "id": "py-pyd-q1",
        "question": "Which language powers the high-performance validation engine (pydantic-core) in Pydantic V2?",
        "options": [
          "Rust",
          "C++",
          "Cython",
          "Go"
        ],
        "correctOptionIndex": 0,
        "explanation": "Pydantic V2 rewrote its validation core in Rust for near C-level performance."
      }
    ]
  },
  {
    "slug": "py-sqlalchemy-async-session",
    "title": "Async SQLAlchemy 2.0 & Alembic Database Migrations",
    "courseSlug": "fastapi-modern-apis",
    "moduleSlug": "fastapi-data-layer",
    "moduleName": "FastAPI Data Layer & Auth",
    "order": 3,
    "category": "Python",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Integrate Async SQLAlchemy 2.0 with asyncpg connection pools, DeclarativeBase mapped columns, and Alembic schema migrations.",
    "description": "Master AsyncEngine, AsyncSession dependency scopes, select() queries, and relational joinedload in FastAPI.",
    "learningPoints": [
      "Configuring AsyncEngine with asyncpg driver and connection pool recycling",
      "Defining Mapped models using SQLAlchemy 2.0 type annotations",
      "Executing async select(), insert(), and update() statements without lazy loading errors",
      "Managing zero-downtime database migrations with Alembic"
    ],
    "content": [
      {
        "type": "text",
        "title": "SQLAlchemy 2.0 Async Architecture",
        "body": "SQLAlchemy 2.0 provides first-class async/await support with asyncpg. In async mode, lazy loading relationships on un-eager loaded models will throw an error, enforcing explicit joinedload queries."
      },
      {
        "type": "code",
        "title": "SQLAlchemy 2.0 Async Session & Repository",
        "language": "python",
        "code": "from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship\nfrom sqlalchemy import String, Integer, select\nfrom typing import AsyncGenerator\n\nDATABASE_URL = \"postgresql+asyncpg://postgres:secret@localhost:5432/backend_prod\"\n\nengine = create_async_engine(DATABASE_URL, pool_size=20, max_overflow=10, pool_recycle=1800)\nAsyncSessionFactory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)\n\nclass Base(DeclarativeBase):\n    pass\n\nclass Product(Base):\n    __tablename__ = \"products\"\n    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)\n    name: Mapped[str] = mapped_column(String(150), index=True)\n    stock: Mapped[int] = mapped_column(Integer, default=0)\n\nasync def get_db_session() -> AsyncGenerator[AsyncSession, None]:\n    async with AsyncSessionFactory() as session:\n        yield session\n\nasync def find_available_products(session: AsyncSession) -> list[Product]:\n    query = select(Product).where(Product.stock > 0).order_by(Product.name)\n    result = await session.execute(query)\n    return list(result.scalars().all())"
      }
    ],
    "quiz": [
      {
        "id": "py-sql-q1",
        "question": "Why is expire_on_commit=False recommended for async_sessionmaker in FastAPI?",
        "options": [
          "To prevent unexpected lazy load IO queries when accessing model attributes after commit",
          "To disable database transactions completely",
          "To convert all database columns to string types",
          "To allow concurrent writes to the same row"
        ],
        "correctOptionIndex": 0,
        "explanation": "With expire_on_commit=False, committed model instances retain their attribute values in memory without triggering forbidden async lazy loads."
      }
    ]
  },
  {
    "slug": "py-jwt-fastapi-oauth2",
    "title": "OAuth2 Password Flow & JWT Security in FastAPI",
    "courseSlug": "fastapi-modern-apis",
    "moduleSlug": "fastapi-data-layer",
    "moduleName": "FastAPI Data Layer & Auth",
    "order": 4,
    "category": "Python",
    "difficulty": "advanced",
    "xpReward": 140,
    "duration": 20,
    "summary": "Build production OAuth2 password bearer authentication with PyJWT, Passlib Argon2 password hashing, and role-based access control.",
    "description": "Implement token generation, signature validation, expiration enforcement, and permission guards in FastAPI.",
    "learningPoints": [
      "Implementing OAuth2PasswordBearer flow for OpenAPI Swagger UI integration",
      "Hashing passwords securely using Argon2id / bcrypt with passlib",
      "Signing and verifying RS256 / HS256 JWTs with pyjwt",
      "Creating fine-grained Role-Based Access Control (RBAC) dependencies"
    ],
    "content": [
      {
        "type": "text",
        "title": "Stateless Authentication with JWT in FastAPI",
        "body": "FastAPI's OAuth2PasswordBearer integrates directly with Swagger UI, providing an 'Authorize' button that automatically attaches Bearer tokens to API test requests."
      },
      {
        "type": "code",
        "title": "Production JWT Authentication Pipeline",
        "language": "python",
        "code": "from datetime import datetime, timedelta, timezone\nimport jwt\nfrom fastapi import FastAPI, Depends, HTTPException, status\nfrom fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm\nfrom passlib.context import CryptContext\n\nSECRET_KEY = \"prod-super-secret-key-change-in-env\"\nALGORITHM = \"HS256\"\nACCESS_TOKEN_EXPIRE_MINUTES = 30\n\npwd_context = CryptContext(schemes=[\"argon2\", \"bcrypt\"], deprecated=\"auto\")\noauth2_scheme = OAuth2PasswordBearer(tokenUrl=\"/api/v1/auth/token\")\n\ndef create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:\n    to_encode = data.copy()\n    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))\n    to_encode.update({\"exp\": expire, \"iat\": datetime.now(timezone.utc)})\n    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)\n\nasync def require_admin_user(token: str = Depends(oauth2_scheme)) -> dict:\n    try:\n        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n        if payload.get(\"role\") != \"admin\":\n            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=\"Admin permissions required\")\n        return payload\n    except jwt.PyJWTError:\n        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=\"Invalid or expired token\")"
      }
    ],
    "quiz": [
      {
        "id": "py-jwt-q1",
        "question": "Which password hashing algorithm represents the modern cryptographic standard recommended by OWASP over raw SHA-256?",
        "options": [
          "Argon2id",
          "MD5",
          "Base64",
          "DES"
        ],
        "correctOptionIndex": 0,
        "explanation": "Argon2id is memory-hard and computationally intensive, providing state-of-the-art resistance to GPU cracking."
      }
    ]
  },
  {
    "slug": "py-django-orm-prefetching",
    "title": "Django ORM: select_related, prefetch_related & Query Optimization",
    "courseSlug": "django-enterprise-backend",
    "moduleSlug": "django-orm-perf",
    "moduleName": "Django ORM & Performance",
    "order": 1,
    "category": "Python",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 18,
    "summary": "Eliminate the N+1 query catastrophe in Django ORM using select_related (SQL JOIN) and prefetch_related (batch querying) with Prefetch objects.",
    "description": "Master Django database performance profiling, query evaluation caching, and database index tuning.",
    "learningPoints": [
      "Understanding the N+1 database problem in relational ORMs",
      "Using select_related for single-valued relationships (ForeignKey, OneToOne)",
      "Using prefetch_related with Prefetch() for multi-valued relationships (ManyToMany, Reverse FK)",
      "Auditing SQL statements with django.db.connection.queries"
    ],
    "content": [
      {
        "type": "text",
        "title": "Optimizing Relational Queries in Django",
        "body": "Iterating over related objects without eager loading executes 1 query for the parent list plus N queries for each related child record. In large datasets, this degrades latency from 20ms to 2000ms."
      },
      {
        "type": "code",
        "title": "Zero N+1 Query Optimization in Django",
        "language": "python",
        "code": "from django.db.models import Prefetch\nfrom myapp.models import Organization, Department, Employee\n\n# BAD: Triggers 1 + N + (N * M) SQL queries\n# for org in Organization.objects.all():\n#     for dept in org.departments.all():\n#         for emp in dept.employees.all():\n#             print(emp.email)\n\n# OPTIMAL: Triggers exactly 3 SQL queries regardless of dataset size\noptimized_orgs = Organization.objects.all().select_related(\n    \"billing_plan\"\n).prefetch_related(\n    Prefetch(\n        \"departments\",\n        queryset=Department.objects.filter(is_active=True).prefetch_related(\"employees\")\n    )\n)\n\nfor org in optimized_orgs:\n    print(f\"Org: {org.name} ({org.billing_plan.name})\")\n    for dept in org.departments.all():\n        print(f\" - Dept: {dept.name} ({dept.employees.count()} staff)\")"
      }
    ],
    "quiz": [
      {
        "id": "dj-orm-q1",
        "question": "When should you use select_related instead of prefetch_related in Django ORM?",
        "options": [
          "For single-valued relationships (ForeignKey and OneToOne) to create an SQL JOIN",
          "For ManyToMany relationships only",
          "When querying NoSQL MongoDB collections",
          "When caching data in Redis memory"
        ],
        "correctOptionIndex": 0,
        "explanation": "select_related performs an SQL JOIN in a single query, which is ideal for single-valued ForeignKey relationships."
      }
    ]
  },
  {
    "slug": "py-drf-serializers-viewsets",
    "title": "Django REST Framework: ModelViewSets, Custom Serializers & Permissions",
    "courseSlug": "django-enterprise-backend",
    "moduleSlug": "django-orm-perf",
    "moduleName": "Django ORM & Performance",
    "order": 2,
    "category": "Python",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Build scalable enterprise REST APIs using Django REST Framework (DRF) ModelViewSet, ModelSerializer, and IsAuthenticated custom permissions.",
    "description": "Master serializer validation hooks, nested relationships, and viewset action decorators.",
    "learningPoints": [
      "Constructing DRF ModelSerializer with field-level validate_<field> methods",
      "Implementing CRUD endpoints using ModelViewSet and DefaultRouter",
      "Creating custom permissions inheriting BasePermission (e.g., IsOwnerOrReadOnly)",
      "Configuring pagination classes (PageNumberPagination and CursorPagination)"
    ],
    "content": [
      {
        "type": "text",
        "title": "Enterprise APIs with Django REST Framework",
        "body": "DRF pairs Django's ORM with serialization pipelines, pluggable permission systems, and viewset abstractions."
      },
      {
        "type": "code",
        "title": "DRF ModelViewSet with Custom Permissions & Actions",
        "language": "python",
        "code": "from rest_framework import viewsets, permissions, serializers, status\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\nfrom myapp.models import Project\n\nclass ProjectSerializer(serializers.ModelSerializer):\n    owner_email = serializers.ReadOnlyField(source=\"owner.email\")\n\n    class Meta:\n        model = Project\n        fields = [\"id\", \"title\", \"description\", \"status\", \"owner_email\", \"created_at\"]\n\n    def validate_title(self, value: str) -> str:\n        if len(value.strip()) < 3:\n            raise serializers.ValidationError(\"Title must contain at least 3 characters.\")\n        return value.strip()\n\nclass IsProjectOwner(permissions.BasePermission):\n    def has_object_permission(self, request, view, obj):\n        return obj.owner == request.user\n\nclass ProjectViewSet(viewsets.ModelViewSet):\n    queryset = Project.objects.all().select_related(\"owner\")\n    serializer_class = ProjectSerializer\n    permission_classes = [permissions.IsAuthenticated, IsProjectOwner]\n\n    @action(detail=True, methods=[\"post\"], url_path=\"archive\")\n    def archive_project(self, request, pk=None):\n        project = self.get_object()\n        project.status = \"archived\"\n        project.save(update_fields=[\"status\"])\n        return Response({\"status\": \"archived\", \"id\": project.id}, status=status.HTTP_200_OK)"
      }
    ],
    "quiz": [
      {
        "id": "drf-vs-q1",
        "question": "Which DRF class automatically provides default implementation for list, create, retrieve, update, and destroy actions?",
        "options": [
          "ModelViewSet",
          "APIView",
          "GenericAPIView",
          "SimpleView"
        ],
        "correctOptionIndex": 0,
        "explanation": "ModelViewSet bundles all standard CRUD handler logic out of the box."
      }
    ]
  },
  {
    "slug": "py-celery-tasks-redis-broker",
    "title": "Celery Distributed Task Queue & Redis Broker Integration",
    "courseSlug": "django-enterprise-backend",
    "moduleSlug": "django-async-tasks",
    "moduleName": "Distributed Async Tasks",
    "order": 3,
    "category": "Python",
    "difficulty": "advanced",
    "xpReward": 140,
    "duration": 20,
    "summary": "Offload long-running operations (email dispatch, PDF report generation, video transcoding) to Celery workers backed by Redis broker.",
    "description": "Master task definition, async execution with .delay(), task retries with exponential backoff, and result backends.",
    "learningPoints": [
      "Architecting asynchronous worker queues with Celery and Redis",
      "Dispatching background tasks non-blockingly using task.delay() and apply_async()",
      "Configuring automatic task retries with autoretry_for and exponential backoff",
      "Monitoring task execution with Flower"
    ],
    "content": [
      {
        "type": "text",
        "title": "Asynchronous Background Processing with Celery",
        "body": "Web request handlers must respond in sub-200ms. Operations like sending transactional emails or generating reports should be offloaded to Celery worker processes asynchronously."
      },
      {
        "type": "code",
        "title": "Celery Task with Automatic Retry Policies",
        "language": "python",
        "code": "from celery import Celery\nimport smtplib\nimport logging\n\napp = Celery(\"backend_tasks\")\napp.config_from_object({\n    \"broker_url\": \"redis://localhost:6379/0\",\n    \"result_backend\": \"redis://localhost:6379/1\",\n    \"task_serializer\": \"json\",\n    \"result_serializer\": \"json\",\n    \"accept_content\": [\"json\"],\n    \"task_acks_late\": True,\n    \"worker_prefetch_multiplier\": 1\n})\n\nlogger = logging.getLogger(\"celery_tasks\")\n\n@app.task(\n    bind=True,\n    autoretry_for=(smtplib.SMTPException, ConnectionError),\n    retry_backoff=True,\n    retry_kwargs={\"max_retries\": 5},\n    name=\"tasks.send_welcome_email\"\n)\ndef send_welcome_email(self, user_email: str, user_name: str) -> dict:\n    logger.info(f\"Sending welcome email to {user_email} (Attempt: {self.request.retries + 1})\")\n    # Simulate network email transport\n    return {\"status\": \"sent\", \"recipient\": user_email}"
      }
    ],
    "quiz": [
      {
        "id": "cel-tk-q1",
        "question": "What is the purpose of task_acks_late=True in production Celery configurations?",
        "options": [
          "The task is acknowledged only after execution completes, ensuring task re-delivery if a worker crashes midway",
          "Tasks are executed only at night during off-peak hours",
          "It causes tasks to delay execution by 60 seconds",
          "It forces tasks to run synchronously in the web thread"
        ],
        "correctOptionIndex": 0,
        "explanation": "task_acks_late guarantees task durability: if the worker dies while executing, another worker will pick up the unacknowledged task."
      }
    ]
  },
  {
    "slug": "py-celery-scheduled-beat",
    "title": "Periodic Cron Tasks with Celery Beat & Lock Management",
    "courseSlug": "django-enterprise-backend",
    "moduleSlug": "django-async-tasks",
    "moduleName": "Distributed Async Tasks",
    "order": 4,
    "category": "Python",
    "difficulty": "advanced",
    "xpReward": 140,
    "duration": 20,
    "summary": "Schedule recurring backend cron jobs using Celery Beat, Redis distributed locks (Redlock), and database cleanup routines.",
    "description": "Master crontab scheduling, preventing duplicate task executions across clustered workers, and dead letter queue routing.",
    "learningPoints": [
      "Configuring Celery Beat schedule using crontab and solar schedules",
      "Preventing duplicate concurrent task executions using Redis distributed locks",
      "Purging stale database records and expired user sessions on schedule",
      "Handling task failure routing to Dead Letter Queues (DLQ)"
    ],
    "content": [
      {
        "type": "text",
        "title": "Scheduled Task Orchestration with Celery Beat",
        "body": "Celery Beat runs a periodic scheduler that enqueues tasks into Redis at predefined intervals or cron expressions for distributed workers to execute."
      },
      {
        "type": "code",
        "title": "Celery Beat Schedule & Redis Distributed Locking",
        "language": "python",
        "code": "from celery.schedules import crontab\nfrom celery import Celery\nimport redis\n\napp = Celery(\"scheduled_ops\", broker=\"redis://localhost:6379/0\")\nredis_client = redis.Redis(host=\"localhost\", port=6379, db=0)\n\napp.conf.beat_schedule = {\n    \"daily-database-cleanup\": {\n        \"task\": \"tasks.cleanup_expired_sessions\",\n        \"schedule\": crontab(hour=2, minute=0), # Run daily at 02:00 AM\n    },\n    \"hourly-metric-aggregation\": {\n        \"task\": \"tasks.aggregate_system_metrics\",\n        \"schedule\": crontab(minute=0), # Top of every hour\n    }\n}\n\n@app.task(name=\"tasks.cleanup_expired_sessions\")\ndef cleanup_expired_sessions():\n    # Acquire distributed lock for 10 minutes to prevent multi-worker concurrency\n    lock = redis_client.lock(\"locks:cleanup_expired_sessions\", timeout=600)\n    have_lock = lock.acquire(blocking=False)\n    if not have_lock:\n        return {\"status\": \"skipped\", \"reason\": \"Job already running on another node\"}\n    try:\n        # Perform cleanup\n        return {\"status\": \"success\", \"purged\": 1420}\n    finally:\n        try:\n            lock.release()\n        except redis.exceptions.LockError:\n            pass"
      }
    ],
    "quiz": [
      {
        "id": "cel-bt-q1",
        "question": "Why should a distributed lock (e.g., Redis lock) be acquired when executing periodic maintenance tasks across multiple worker servers?",
        "options": [
          "To prevent multiple worker instances from running the exact same batch cleanup simultaneously and causing database deadlocks",
          "To encrypt the data sent to Redis",
          "To speed up database index generation",
          "Because Celery Beat cannot run on Linux without Redis locks"
        ],
        "correctOptionIndex": 0,
        "explanation": "A distributed lock prevents race conditions and duplicate executions if multiple worker nodes attempt to process the periodic job at once."
      }
    ]
  },
  {
    "slug": "ts-nestjs-modules-di",
    "title": "NestJS Modular Architecture, Controllers & Dependency Injection",
    "courseSlug": "nestjs-backend-architecture",
    "moduleSlug": "ts-nestjs-core",
    "moduleName": "Enterprise NestJS Microservices",
    "order": 1,
    "category": "TypeScript",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Master NestJS architectural fundamentals: @Module encapsulation, @Controller routing, and constructor-based Dependency Injection providers.",
    "description": "Learn how NestJS brings Angular-inspired enterprise architectural patterns to server-side TypeScript on top of Express and Fastify.",
    "learningPoints": [
      "NestJS application structure: Modules, Controllers, and Providers",
      "The @Injectable() decorator and IoC container resolution",
      "Dynamic modules (forRoot, forFeature) and global modules",
      "Configuring environment variables with @nestjs/config"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why NestJS is the Standard for Enterprise TypeScript",
        "body": "While raw Express applications often degrade into spaghetti code as teams scale, NestJS enforces strict architectural boundaries. By organizing code into cohesive modules with explicit imports, exports, and dependency injection, NestJS applications remain maintainable across large engineering teams."
      },
      {
        "type": "code",
        "title": "Production NestJS Module, Service & Controller",
        "language": "typescript",
        "code": "import { Module, Injectable, Controller, Get, Post, Body, Param } from '@nestjs/common';\n\nexport interface Order {\n  id: string;\n  total: number;\n  status: string;\n}\n\n@Injectable()\nexport class OrdersService {\n  private readonly orders: Order[] = [];\n\n  create(total: number): Order {\n    const order: Order = { id: 'ord_' + Date.now(), total, status: 'confirmed' };\n    this.orders.push(order);\n    return order;\n  }\n\n  findAll(): Order[] {\n    return this.orders;\n  }\n}\n\n@Controller('api/v1/orders')\nexport class OrdersController {\n  constructor(private readonly ordersService: OrdersService) {}\n\n  @Post()\n  createOrder(@Body('total') total: number): Order {\n    return this.ordersService.create(total);\n  }\n\n  @Get()\n  getAllOrders(): Order[] {\n    return this.ordersService.findAll();\n  }\n}\n\n@Module({\n  controllers: [OrdersController],\n  providers: [OrdersService],\n  exports: [OrdersService],\n})\nexport class OrdersModule {}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Constructor-Based Injection",
        "body": "Using constructor(private readonly ordersService: OrdersService) {} leverages TypeScript parameter properties to declare and initialize the injected provider in a single line."
      }
    ],
    "quiz": [
      {
        "id": "ts-nest-1",
        "question": "What decorator must be added to a class in NestJS to make it injectable as a provider by the IoC container?",
        "options": [
          "@Injectable()",
          "@Component()",
          "@ServiceBean()",
          "@ModuleScope()"
        ],
        "correctOptionIndex": 0,
        "explanation": "@Injectable() informs the NestJS IoC container that the class can be managed, instantiated, and injected into other controllers or services."
      }
    ]
  },
  {
    "slug": "ts-nestjs-pipes-guards-interceptors",
    "title": "Request Lifecycle Hardening: ValidationPipes, AuthGuards & Interceptors",
    "courseSlug": "nestjs-backend-architecture",
    "moduleSlug": "ts-nestjs-core",
    "moduleName": "Enterprise NestJS Microservices",
    "order": 2,
    "category": "TypeScript",
    "difficulty": "advanced",
    "xpReward": 140,
    "duration": 22,
    "summary": "Harden NestJS APIs using global ValidationPipes (class-validator), CanActivate AuthGuards, and Logging Interceptors.",
    "description": "Understand the exact NestJS request execution lifecycle: Middleware -> Guards -> Interceptors (Pre) -> Pipes -> Handler -> Interceptors (Post) -> Exception Filters.",
    "learningPoints": [
      "The complete NestJS request lifecycle pipeline order",
      "Automated payload validation with ValidationPipe and class-validator / class-transformer",
      "Authentication and authorization guards implementing CanActivate and ExecutionContext",
      "Response transformation and performance timing with NestInterceptor and RxJS"
    ],
    "content": [
      {
        "type": "text",
        "title": "The NestJS Request Lifecycle",
        "body": "NestJS provides a multi-layer defense pipeline. Incoming requests pass through Guards (is the user authenticated?), Interceptors (start timer), and Pipes (validate payload). If validation fails, Pipes reject the request with HTTP 400 before the controller code is touched."
      },
      {
        "type": "code",
        "title": "JWT AuthGuard & Global ValidationPipe Setup",
        "language": "typescript",
        "code": "import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';\nimport { Observable } from 'rxjs';\n\n@Injectable()\nexport class JwtAuthGuard implements CanActivate {\n  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {\n    const request = context.switchToHttp().getRequest();\n    const authHeader = request.headers['authorization'];\n\n    if (!authHeader || !authHeader.startsWith('Bearer ')) {\n      throw new UnauthorizedException('Missing or malformed Bearer token');\n    }\n\n    const token = authHeader.split(' ')[1];\n    if (token === 'valid-secret-token') {\n      request.user = { id: 'usr_123', role: 'admin' };\n      return true;\n    }\n\n    throw new UnauthorizedException('Invalid token');\n  }\n}"
      },
      {
        "type": "callout",
        "variant": "warning",
        "title": "Whitelist Forbidden Properties in ValidationPipe",
        "body": "Always configure new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }) in main.ts to strip out or reject any undeclared properties from incoming request payloads."
      }
    ],
    "quiz": [
      {
        "id": "ts-guard-1",
        "question": "In what order does NestJS execute its request lifecycle components for an incoming HTTP request?",
        "options": [
          "Middleware -> Guards -> Interceptors (Pre) -> Pipes -> Controller Handler -> Interceptors (Post) -> Exception Filters",
          "Controller Handler -> Guards -> Pipes -> Middleware",
          "Exception Filters -> Pipes -> Guards -> Controller Handler",
          "Interceptors -> Middleware -> Controller Handler"
        ],
        "correctOptionIndex": 0,
        "explanation": "Guards execute before Interceptors and Pipes to ensure unauthorized requests are rejected immediately without wasting CPU on deserialization or pipeline timing."
      }
    ]
  },
  {
    "slug": "ts-nestjs-prisma-database",
    "title": "Type-Safe Database Integration with Prisma ORM in NestJS",
    "courseSlug": "nestjs-backend-architecture",
    "moduleSlug": "ts-nestjs-core",
    "moduleName": "Enterprise NestJS Microservices",
    "order": 3,
    "category": "TypeScript",
    "difficulty": "intermediate",
    "xpReward": 140,
    "duration": 20,
    "summary": "Integrate Prisma ORM into NestJS, managing database lifecycles (onModuleInit, onModuleDestroy), schema migrations, and type-safe CRUD operations.",
    "description": "Learn how Prisma generates TypeScript types from your schema.prisma file, delivering end-to-end type safety between your database and API DTOs.",
    "learningPoints": [
      "Building a dedicated PrismaService extending PrismaClient",
      "Managing database connection lifecycle with OnModuleInit and OnModuleDestroy",
      "Writing type-safe Prisma queries with relations (include, select)",
      "Handling database exceptions and unique constraint violations cleanly"
    ],
    "content": [
      {
        "type": "text",
        "title": "Type Safety from Database to API with Prisma",
        "body": "Prisma auto-generates TypeScript types directly from your relational database schema. When integrated into NestJS as an injectable singleton service, Prisma provides compile-time auto-completion for database queries, preventing SQL syntax errors and type drift."
      },
      {
        "type": "code",
        "title": "PrismaService & Repository in NestJS",
        "language": "typescript",
        "code": "import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';\n\nclass MockPrismaClient {\n  user = {\n    findUnique: async (args: any) => ({ id: 'usr_1', email: 'alex@example.com', role: 'admin' }),\n    create: async (args: any) => ({ id: 'usr_2', ...args.data }),\n  };\n  async $connect() {}\n  async $disconnect() {}\n}\n\n@Injectable()\nexport class PrismaService extends MockPrismaClient implements OnModuleInit, OnModuleDestroy {\n  async onModuleInit() {\n    await this.$connect();\n  }\n\n  async onModuleDestroy() {\n    await this.$disconnect();\n  }\n}\n\n@Injectable()\nexport class UsersService {\n  constructor(private readonly prisma: PrismaService) {}\n\n  async findByEmail(email: string) {\n    return this.prisma.user.findUnique({ where: { email } });\n  }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Graceful DB Connection Shutdown",
        "body": "Implementing OnModuleDestroy ensures that when Kubernetes terminates the container, all active database connection sockets are gracefully closed."
      }
    ],
    "quiz": [
      {
        "id": "ts-prisma-1",
        "question": "What lifecycle interface should PrismaService implement in NestJS to ensure database connections are cleanly closed upon application termination?",
        "options": [
          "OnModuleDestroy",
          "AfterContentChecked",
          "OnInitClient",
          "OnDatabaseTerminated"
        ],
        "correctOptionIndex": 0,
        "explanation": "Implementing OnModuleDestroy allows PrismaService to execute this.$disconnect() when the NestJS application shuts down."
      }
    ]
  },
  {
    "slug": "ts-nestjs-microservices-redis",
    "title": "Distributed Event-Driven Microservices with NestJS & Redis Pub/Sub",
    "courseSlug": "nestjs-backend-architecture",
    "moduleSlug": "ts-nestjs-core",
    "moduleName": "Enterprise NestJS Microservices",
    "order": 4,
    "category": "TypeScript",
    "difficulty": "advanced",
    "xpReward": 150,
    "duration": 22,
    "summary": "Build distributed microservices in TypeScript using @nestjs/microservices, Redis Pub/Sub transport, MessagePatterns, and EventPatterns.",
    "description": "Learn how NestJS abstracts transport layers (TCP, Redis, RabbitMQ, Kafka, gRPC), allowing microservices to switch protocols with zero changes to business logic.",
    "learningPoints": [
      "NestJS microservice transport architecture (Transport.REDIS / Transport.TCP)",
      "Request-response pattern with @MessagePattern() and ClientProxy.send()",
      "Event-driven fire-and-forget messaging with @EventPattern() and ClientProxy.emit()",
      "Microservice error handling and serialization"
    ],
    "content": [
      {
        "type": "text",
        "title": "Event-Driven Microservices in NestJS",
        "body": "NestJS provides a unified Microservice framework. By switching the transport enum (Transport.REDIS, Transport.KAFKA, Transport.GRPC), your controllers receive messages via @MessagePattern or asynchronous event notifications via @EventPattern seamlessly."
      },
      {
        "type": "code",
        "title": "NestJS Microservice Controller with MessagePattern",
        "language": "typescript",
        "code": "import { Controller } from '@nestjs/common';\n\nconst MessagePattern = (pattern: string) => (target: any, key: string, desc: any) => desc;\nconst EventPattern = (event: string) => (target: any, key: string, desc: any) => desc;\nconst Payload = () => (target: any, key: string, index: number) => {};\n\n@Controller()\nexport class OrdersMicroserviceController {\n  \n  @MessagePattern('get_order_status')\n  getOrderStatus(@Payload() data: { orderId: string }) {\n    return { orderId: data.orderId, status: 'DELIVERED', updatedAt: new Date().toISOString() };\n  }\n\n  @EventPattern('order_created')\n  handleOrderCreated(@Payload() order: any) {\n    console.log('Received order_created event for Order #' + order.id);\n  }\n}"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "MessagePattern vs EventPattern",
        "body": "Use @MessagePattern when the caller expects a response (RPC). Use @EventPattern for asynchronous fire-and-forget event broadcasting where no response is needed."
      }
    ],
    "quiz": [
      {
        "id": "ts-msg-1",
        "question": "What is the key difference between @MessagePattern and @EventPattern in NestJS Microservices?",
        "options": [
          "@MessagePattern is for synchronous Request-Response RPC calls that return a value; @EventPattern is for asynchronous fire-and-forget event broadcasts",
          "@MessagePattern only works with HTTP",
          "@EventPattern only works in web browsers",
          "@MessagePattern converts JavaScript into C#"
        ],
        "correctOptionIndex": 0,
        "explanation": "MessagePattern expects a response observable to send back to the caller, while EventPattern is purely one-way event notification."
      }
    ]
  },
  {
    "slug": "js-fastify-core-plugins",
    "title": "Fastify Architecture: Plugin Encapsulation, Hooks & Lifecycle",
    "courseSlug": "fastify-high-performance-apis",
    "moduleSlug": "js-fastify-foundations",
    "moduleName": "High-Throughput Fastify Architecture",
    "order": 1,
    "category": "JavaScript",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 20,
    "summary": "Master Fastify's plugin architecture, encapsulation context trees, fastify-plugin (fp), and request lifecycle hooks (onRequest, preHandler).",
    "description": "Learn how Fastify achieves 2x-4x higher throughput than Express through plugin encapsulation and non-blocking asynchronous hooks.",
    "learningPoints": [
      "Fastify plugin hierarchy and lexical encapsulation",
      "Using fastify-plugin (fp) to break encapsulation for global singletons (DB, Auth)",
      "Fastify request lifecycle hooks: onRequest, preParsing, preValidation, preHandler, onSend, onResponse",
      "Structured Pino logging integration out of the box"
    ],
    "content": [
      {
        "type": "text",
        "title": "Why Fastify Outperforms Express",
        "body": "Express relies on sequential middleware arrays where every middleware executes on every request. Fastify uses radix tree route compilation and an explicit plugin hierarchy. Plugins inherit decorators and hooks from parent scopes but remain encapsulated from siblings, preventing accidental state contamination."
      },
      {
        "type": "code",
        "title": "Fastify Plugin with Encapsulation & Lifecycle Hooks",
        "language": "javascript",
        "code": "const Fastify = require('fastify');\nconst app = Fastify({ logger: true });\n\nasync function orderRoutes(fastify, options) {\n  fastify.addHook('preHandler', async (request, reply) => {\n    request.log.info({ path: request.url }, 'Executing order route preHandler hook');\n  });\n\n  fastify.get('/api/v1/orders', async (request, reply) => {\n    return { status: 'ok', orders: [{ id: 1, total: 99.50 }] };\n  });\n}\n\napp.register(orderRoutes);\n\nconst start = async () => {\n  try {\n    await app.listen({ port: 5000, host: '0.0.0.0' });\n  } catch (err) {\n    app.log.error(err);\n    process.exit(1);\n  }\n};\nstart();"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Break Encapsulation with fastify-plugin",
        "body": "To register global decorators or database connections accessible to all routes, wrap the plugin function with const fp = require('fastify-plugin'); module.exports = fp(dbPlugin);"
      }
    ],
    "quiz": [
      {
        "id": "js-fst-1",
        "question": "What is the role of the 'fastify-plugin' (fp) wrapper in Fastify?",
        "options": [
          "It breaks plugin encapsulation, allowing decorators, hooks, and database pools to be exposed globally across all sibling routes",
          "It disables JSON schema validation",
          "It converts Fastify into Express",
          "It forces the server to run in single-threaded mode"
        ],
        "correctOptionIndex": 0,
        "explanation": "By default, Fastify plugins create a new encapsulated scope. Wrapping a plugin in fastify-plugin exposes its registered decorators to parent and sibling contexts."
      }
    ]
  },
  {
    "slug": "js-fastify-schema-compilation",
    "title": "High-Speed JSON Serialization with Ajv & fast-json-stringify",
    "courseSlug": "fastify-high-performance-apis",
    "moduleSlug": "js-fastify-foundations",
    "moduleName": "High-Throughput Fastify Architecture",
    "order": 2,
    "category": "JavaScript",
    "difficulty": "intermediate",
    "xpReward": 130,
    "duration": 18,
    "summary": "Maximize HTTP throughput using Fastify JSON Schema compilation with Ajv for incoming payload validation and fast-json-stringify for output serialization.",
    "description": "Learn how compile-time JSON schema serialization is up to 2x faster than JSON.stringify by compiling optimized string concatenation functions.",
    "learningPoints": [
      "Defining JSON Schema for body, querystring, params, and headers",
      "Ajv high-performance input validation and coercion rules",
      "Response schema declaration with response: { 200: schema }",
      "How fast-json-stringify strips un-declared fields for security and speed"
    ],
    "content": [
      {
        "type": "text",
        "title": "Compile-Time JSON Serialization",
        "body": "Standard JSON.stringify() inspects every property of an object dynamically at runtime. Fastify uses fast-json-stringify, compiling a custom, optimized C++ / JS string-concatenation function for your exact schema at server startup. This doubles output serialization throughput and strips unauthorized internal fields automatically."
      },
      {
        "type": "code",
        "title": "Fastify Route with Compiled Input & Output JSON Schemas",
        "language": "javascript",
        "code": "const userSchema = {\n  schema: {\n    body: {\n      type: 'object',\n      required: ['username', 'email'],\n      properties: {\n        username: { type: 'string', minLength: 3 },\n        email: { type: 'string', format: 'email' },\n        password: { type: 'string', minLength: 8 }\n      }\n    },\n    response: {\n      201: {\n        type: 'object',\n        properties: {\n          id: { type: 'string' },\n          username: { type: 'string' },\n          email: { type: 'string' }\n        }\n      }\n    }\n  }\n};\n\nfastify.post('/api/v1/users', userSchema, async (request, reply) => {\n  const { username, email, password } = request.body;\n  \n  reply.code(201).send({\n    id: 'usr_123',\n    username,\n    email,\n    password // Auto-stripped by fast-json-stringify!\n  });\n});"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Security by Default",
        "body": "Declaring a response schema guarantees that internal properties (like password hashes or internal foreign keys) are never sent over the wire, even if accidentally returned by the route handler."
      }
    ],
    "quiz": [
      {
        "id": "js-sch-1",
        "question": "What is the dual benefit of declaring response JSON schemas in Fastify routes?",
        "options": [
          "It speeds up serialization throughput using compiled fast-json-stringify and prevents security leaks by stripping un-declared fields",
          "It encrypts the entire SQL database with AES-256",
          "It forces the browser to reload the page",
          "It disables the HTTP 200 status code"
        ],
        "correctOptionIndex": 0,
        "explanation": "Response schemas compile optimized string serializing functions and automatically omit any fields not explicitly listed in the schema, protecting sensitive data."
      }
    ]
  },
  {
    "slug": "js-fastify-jwt-database",
    "title": "Stateless JWT Authentication & Database Connection in Fastify",
    "courseSlug": "fastify-high-performance-apis",
    "moduleSlug": "js-fastify-foundations",
    "moduleName": "High-Throughput Fastify Architecture",
    "order": 3,
    "category": "JavaScript",
    "difficulty": "advanced",
    "xpReward": 140,
    "duration": 20,
    "summary": "Secure Fastify services with @fastify/jwt, decorator-based authentication guards, and PostgreSQL connection pooling with @fastify/postgres.",
    "description": "Learn how to decorate the Fastify instance with auth guards and database pools for sub-millisecond query execution.",
    "learningPoints": [
      "Integrating @fastify/jwt and signing cryptographic tokens",
      "Decorating fastify with custom authenticate hook helper",
      "Connecting to PostgreSQL using @fastify/postgres connection pool",
      "Role-based access control in Fastify preHandler hooks"
    ],
    "content": [
      {
        "type": "text",
        "title": "Fastify Authentication & Database Ecosystem",
        "body": "Fastify's official plugin ecosystem provides @fastify/jwt for stateless token verification and @fastify/postgres for connection pooling. Decorators attach helper methods (fastify.authenticate) directly onto the request object with zero middleware overhead."
      },
      {
        "type": "code",
        "title": "Fastify JWT Authentication & Protected Endpoint",
        "language": "javascript",
        "code": "const Fastify = require('fastify');\nconst fastifyJwt = require('@fastify/jwt');\n\nconst app = Fastify();\n\napp.register(fastifyJwt, {\n  secret: 'super-secret-jwt-key'\n});\n\napp.decorate('authenticate', async function (request, reply) {\n  try {\n    await request.jwtVerify();\n  } catch (err) {\n    reply.status(401).send({ error: 'Unauthorized: Invalid or expired token' });\n  }\n});\n\napp.get(\n  '/api/v1/profile',\n  { preHandler: [app.authenticate] },\n  async (request, reply) => {\n    return {\n      message: 'Authenticated profile access',\n      user: request.user\n    };\n  }\n);"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Decorator Efficiency",
        "body": "Fastify decorators are attached at startup using hidden classes, ensuring V8 can optimize property access without de-optimizing the request prototype."
      }
    ],
    "quiz": [
      {
        "id": "js-jwt-1",
        "question": "How do you protect a specific route in Fastify using an authentication guard?",
        "options": [
          "Pass the guard function in the route configuration options: { preHandler: [app.authenticate] }",
          "Add 'secure: true' in package.json",
          "Change the HTTP port from 80 to 443",
          "Restart the Node.js process on every request"
        ],
        "correctOptionIndex": 0,
        "explanation": "Fastify executes functions in the preHandler hook array before running the route handler, allowing guards to halt unauthorized requests immediately."
      }
    ]
  },
  {
    "slug": "js-fastify-production-benchmarks",
    "title": "Production Hardening, Pino Logging & Autocannon Benchmarking",
    "courseSlug": "fastify-high-performance-apis",
    "moduleSlug": "js-fastify-foundations",
    "moduleName": "High-Throughput Fastify Architecture",
    "order": 4,
    "category": "JavaScript",
    "difficulty": "advanced",
    "xpReward": 140,
    "duration": 20,
    "summary": "Benchmark and harden Fastify APIs for production: asynchronous Pino logging, graceful shutdown with close(), and load testing with Autocannon.",
    "description": "Learn how to achieve 40,000+ requests per second on a single Node.js instance with proper logging configuration and worker thread clustering.",
    "learningPoints": [
      "Asynchronous high-speed logging with Pino and pino-pretty",
      "Graceful server shutdown on SIGINT/SIGTERM with app.close()",
      "Benchmarking HTTP latency and throughput with autocannon",
      "Clustering across CPU cores using Node.js cluster module"
    ],
    "content": [
      {
        "type": "text",
        "title": "Production Hardening for Fastify",
        "body": "Fastify is built for raw performance. Using synchronous console.log can degrade API throughput by 80%. Fastify bundles Pino, a zero-overhead JSON logger that writes asynchronously. Combined with signal interception, Fastify provides graceful draining during rolling container updates."
      },
      {
        "type": "code",
        "title": "Production Fastify Server with Signal Draining & Pino",
        "language": "javascript",
        "code": "const Fastify = require('fastify');\n\nconst app = Fastify({\n  logger: {\n    level: process.env.LOG_LEVEL || 'info',\n    timestamp: () => ',\"time\":\"' + new Date().toISOString() + '\"'\n  }\n});\n\napp.get('/health', async () => ({ status: 'healthy', timestamp: Date.now() }));\n\nconst signals = ['SIGINT', 'SIGTERM'];\nsignals.forEach((signal) => {\n  process.on(signal, async () => {\n    app.log.info('Received ' + signal + '. Draining active connections...');\n    try {\n      await app.close();\n      app.log.info('Fastify server closed cleanly.');\n      process.exit(0);\n    } catch (err) {\n      app.log.error('Error during shutdown:', err);\n      process.exit(1);\n    }\n  });\n});\n\napp.listen({ port: 3000, host: '0.0.0.0' });"
      },
      {
        "type": "callout",
        "variant": "tip",
        "title": "Autocannon Load Testing Command",
        "body": "Benchmark your Fastify endpoints locally using: npx autocannon -c 100 -d 10 http://localhost:3000/health to measure P99 latency under 100 concurrent connections."
      }
    ],
    "quiz": [
      {
        "id": "js-pino-1",
        "question": "Why does Fastify use Pino as its default logger rather than console.log?",
        "options": [
          "Pino is an asynchronous JSON logger designed for minimum overhead, whereas console.log is synchronous and blocks the Node.js event loop",
          "Pino only works on Linux",
          "Pino disables HTTP headers",
          "console.log is deprecated in Node.js"
        ],
        "correctOptionIndex": 0,
        "explanation": "Synchronous console.log blocks the single-threaded Node.js event loop. Pino formats JSON logs asynchronously with virtually zero CPU latency penalty."
      }
    ]
  }
];
