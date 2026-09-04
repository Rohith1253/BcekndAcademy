export interface ApiLabDefinition {
  slug: string;
  title: string;
  category: "HTTP Methods" | "Headers & Auth" | "Validation & Errors" | "Pagination & Queries" | "Rate Limiting & Security";
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  objective: string;
  scenario: string;
  starterRequest: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    endpoint: string;
    headers: Record<string, string>;
    body?: any;
    queryParams?: Record<string, string>;
  };
  expectedValidation: {
    method: string;
    endpoint: string;
    requiredHeaders?: string[];
    requiredBodyFields?: string[];
    expectedStatusCode: number;
  };
  hints: string[];
  xpReward: number;
  estimatedMinutes: number;
}

export const API_LABS: ApiLabDefinition[] = [
  {
    slug: "restful-post-user-creation",
    title: "RESTful POST User Creation & Validation",
    category: "HTTP Methods",
    difficulty: "beginner",
    description: "Construct a valid HTTP POST request to create a new user entity with JSON payload and Content-Type header.",
    objective: "Send a POST request to /api/v1/users with a valid JSON body containing email, role, and name, returning HTTP 201 Created.",
    scenario: "You are integrating an onboarding client with a microservice API that enforces strict schema validation and HTTP semantics.",
    starterRequest: {
      method: "POST",
      endpoint: "/api/v1/users",
      headers: { "Content-Type": "application/json" },
      body: { name: "Alex Morgan", email: "alex@example.com", role: "developer" },
    },
    expectedValidation: {
      method: "POST",
      endpoint: "/api/v1/users",
      requiredHeaders: ["Content-Type"],
      requiredBodyFields: ["name", "email", "role"],
      expectedStatusCode: 201,
    },
    hints: [
      "Ensure Content-Type header is set to 'application/json'.",
      "Include 'name', 'email', and 'role' in the JSON body.",
      "The server returns 201 Created upon successful resource instantiation.",
    ],
    xpReward: 120,
    estimatedMinutes: 10,
  },
  {
    slug: "jwt-bearer-authorization",
    title: "JWT Bearer Token Authorization",
    category: "Headers & Auth",
    difficulty: "intermediate",
    description: "Inspect protected endpoint requirements and attach a valid Authorization: Bearer <token> header.",
    objective: "Access the protected /api/v1/billing/invoices route by providing a properly structured Bearer token header.",
    scenario: "A backend service rejects unauthenticated requests with HTTP 401. Construct the authorization header to authenticate.",
    starterRequest: {
      method: "GET",
      endpoint: "/api/v1/billing/invoices",
      headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfMTIzIn0.sample" },
    },
    expectedValidation: {
      method: "GET",
      endpoint: "/api/v1/billing/invoices",
      requiredHeaders: ["Authorization"],
      expectedStatusCode: 200,
    },
    hints: [
      "The Authorization header format must be 'Bearer <token>'.",
      "Missing or malformed Authorization headers return HTTP 401 Unauthorized.",
    ],
    xpReward: 140,
    estimatedMinutes: 12,
  },
  {
    slug: "cursor-pagination-query",
    title: "Cursor-Based API Pagination & Query Filtering",
    category: "Pagination & Queries",
    difficulty: "intermediate",
    description: "Implement query parameter filters for limit, cursor, and sorting on high-volume endpoints.",
    objective: "Construct a GET request to /api/v1/events with query parameters limit=20, status=active, and sort=desc.",
    scenario: "Fetch a paginated feed of audit events without overloading the database or transferring unbounded payloads.",
    starterRequest: {
      method: "GET",
      endpoint: "/api/v1/events",
      headers: {},
      queryParams: { limit: "20", status: "active", sort: "desc" },
    },
    expectedValidation: {
      method: "GET",
      endpoint: "/api/v1/events",
      expectedStatusCode: 200,
    },
    hints: [
      "Include query params: limit, status, and sort.",
      "Query parameters are appended to the URL path after the ? character.",
    ],
    xpReward: 130,
    estimatedMinutes: 10,
  },
  {
    slug: "idempotent-put-vs-patch",
    title: "Idempotent PUT vs Partial PATCH Semantics",
    category: "HTTP Methods",
    difficulty: "advanced",
    description: "Differentiate between complete resource replacement (PUT) and delta modifications (PATCH).",
    objective: "Perform a partial status update on /api/v1/orders/ord_889 using the HTTP PATCH method.",
    scenario: "Updating only the shippingStatus field without overwriting other order metadata requires PATCH semantics.",
    starterRequest: {
      method: "PATCH",
      endpoint: "/api/v1/orders/ord_889",
      headers: { "Content-Type": "application/json" },
      body: { shippingStatus: "in_transit" },
    },
    expectedValidation: {
      method: "PATCH",
      endpoint: "/api/v1/orders/ord_889",
      requiredHeaders: ["Content-Type"],
      requiredBodyFields: ["shippingStatus"],
      expectedStatusCode: 200,
    },
    hints: [
      "Use PATCH for updating specific subset fields.",
      "PUT replaces the entire entity state.",
    ],
    xpReward: 150,
    estimatedMinutes: 15,
  },
  {
    slug: "rate-limit-429-handling",
    title: "Rate Limiting & Retry-After 429 Resilience",
    category: "Rate Limiting & Security",
    difficulty: "advanced",
    description: "Test client rate limit backoff headers (X-RateLimit-Remaining, Retry-After).",
    objective: "Simulate a client encountering HTTP 429 Too Many Requests and verify rate limiting headers.",
    scenario: "High-frequency API consumers must parse X-RateLimit headers and gracefully back off.",
    starterRequest: {
      method: "GET",
      endpoint: "/api/v1/public/rate-limit-test",
      headers: { "X-Client-Id": "client_fast_poller" },
    },
    expectedValidation: {
      method: "GET",
      endpoint: "/api/v1/public/rate-limit-test",
      expectedStatusCode: 200,
    },
    hints: [
      "Rate limiters count requests per sliding window or token bucket.",
      "Responses return standard headers: X-RateLimit-Limit, X-RateLimit-Remaining.",
    ],
    xpReward: 150,
    estimatedMinutes: 15,
  },
];
