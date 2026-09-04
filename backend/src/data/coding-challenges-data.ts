export interface ChallengeSeedItem {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: "beginner" | "easy" | "medium" | "hard" | "advanced";
  language: string;
  supportedLanguages: string[];
  starterCode: string;
  solutionTemplate: string;
  instructions: string;
  visibleTests: Array<{
    name: string;
    description?: string;
    testCode: string;
    expectedOutput?: any;
  }>;
  hiddenTests: Array<{
    name: string;
    testCode: string;
    expectedOutput?: any;
  }>;
  xpReward: number;
  estimatedMinutes: number;
  order: number;
  isPublished: boolean;
}

export const INITIAL_CODING_CHALLENGES: ChallengeSeedItem[] = [
  // ==========================================
  // BEGINNER (10 Challenges)
  // ==========================================
  {
    title: "Create User DTO Factory",
    slug: "create-user-object",
    category: "Backend Fundamentals",
    difficulty: "beginner",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 50,
    estimatedMinutes: 10,
    order: 1,
    isPublished: true,
    description: "Create a factory function called `createUser` that takes `name` and `email` and returns a normalized user object with a `createdAt` ISO timestamp string.",
    instructions: "Implement `function createUser(name, email)`.\n- Returns an object `{ name, email, createdAt }`.\n- `createdAt` must be a valid ISO string.\n- Ensure `email` is lowercased and trimmed.",
    starterCode: `function createUser(name, email) {
  // Write your code here
}`,
    solutionTemplate: `function createUser(name, email) {
  return {
    name: name ? name.trim() : "",
    email: email ? email.trim().toLowerCase() : "",
    createdAt: new Date().toISOString()
  };
}`,
    visibleTests: [
      {
        name: "Returns object with name and email",
        description: "Checks basic name and email assignment",
        testCode: `const u = createUser("Alice", "alice@example.com"); if (!u || u.name !== "Alice" || u.email !== "alice@example.com") throw new Error("Expected name 'Alice' and email 'alice@example.com'");`,
        expectedOutput: true
      },
      {
        name: "Generates valid ISO createdAt timestamp",
        description: "Checks createdAt timestamp validity",
        testCode: `const u = createUser("Bob", "bob@example.com"); if (isNaN(Date.parse(u.createdAt))) throw new Error("Expected valid createdAt ISO timestamp");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Normalizes whitespace and email casing",
        testCode: `const u = createUser("  Charlie  ", "  CHARLIE@domain.COM "); if (u.name !== "Charlie" || u.email !== "charlie@domain.com") throw new Error("Failed trimming/lowercasing");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Validate Email Format & Hygiene",
    slug: "validate-email-format",
    category: "Validation",
    difficulty: "beginner",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go", "php"],
    xpReward: 50,
    estimatedMinutes: 10,
    order: 2,
    isPublished: true,
    description: "Validate client-provided email strings to prevent malformed or invalid inputs before database querying.",
    instructions: "Implement `function isValidEmail(email)`.\n- Return `true` if email contains valid user part, '@', domain name, and TLD.\n- Return `false` for empty, null, or malformed emails.",
    starterCode: `function isValidEmail(email) {
  // Write your code here
}`,
    solutionTemplate: `function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(email.trim());
}`,
    visibleTests: [
      {
        name: "Valid email passes",
        testCode: `if (!isValidEmail("developer@example.com")) throw new Error("Expected valid email to return true");`,
        expectedOutput: true
      },
      {
        name: "Missing @ symbol fails",
        testCode: `if (isValidEmail("developerexample.com")) throw new Error("Expected invalid email to return false");`,
        expectedOutput: false
      }
    ],
    hiddenTests: [
      {
        name: "Missing domain fails",
        testCode: `if (isValidEmail("user@")) throw new Error("Expected incomplete email to return false");`,
        expectedOutput: false
      }
    ]
  },

  {
    title: "Calculate Pagination Offset & Limit",
    slug: "calculate-api-pagination",
    category: "REST APIs",
    difficulty: "beginner",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go", "java"],
    xpReward: 50,
    estimatedMinutes: 10,
    order: 3,
    isPublished: true,
    description: "Build SQL/MongoDB pagination helper to convert client query parameters (`page`, `limit`) into database query parameters (`skip`, `take`, `totalPages`).",
    instructions: "Implement `function calculatePagination(page, limit, totalItems)`.\n- Default `page` = 1, `limit` = 10 if invalid/omitted.\n- Return `{ skip, take, totalPages, currentPage }`.",
    starterCode: `function calculatePagination(page, limit, totalItems) {
  // Write your code here
}`,
    solutionTemplate: `function calculatePagination(page = 1, limit = 10, totalItems = 0) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (p - 1) * l;
  const totalPages = Math.ceil(totalItems / l);
  return { skip, take: l, totalPages, currentPage: p };
}`,
    visibleTests: [
      {
        name: "Calculates first page skip and take",
        testCode: `const p = calculatePagination(1, 20, 100); if (p.skip !== 0 || p.take !== 20 || p.totalPages !== 5) throw new Error("Incorrect calculation for page 1");`,
        expectedOutput: true
      },
      {
        name: "Calculates middle page skip correctly",
        testCode: `const p = calculatePagination(3, 10, 55); if (p.skip !== 20 || p.totalPages !== 6) throw new Error("Incorrect calculation for page 3");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Handles 0 total items safely",
        testCode: `const p = calculatePagination(1, 10, 0); if (p.skip !== 0 || p.totalPages !== 0) throw new Error("Failed handling 0 total items");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Parse HTTP Query String to Object",
    slug: "parse-query-string",
    category: "HTTP",
    difficulty: "beginner",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 50,
    estimatedMinutes: 10,
    order: 4,
    isPublished: true,
    description: "Parse an incoming HTTP URL search query string (e.g. `?sort=desc&limit=25&filter=active`) into a strongly-typed key-value object.",
    instructions: "Implement `function parseQueryString(queryString)`.\n- Strip leading '?' if present.\n- Decode URI-encoded values.\n- Return key-value dictionary.",
    starterCode: `function parseQueryString(queryString) {
  // Write your code here
}`,
    solutionTemplate: `function parseQueryString(queryString) {
  if (!queryString) return {};
  const clean = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  const params = new URLSearchParams(clean);
  const obj = {};
  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }
  return obj;
}`,
    visibleTests: [
      {
        name: "Parses simple query string",
        testCode: `const res = parseQueryString("?sort=desc&limit=25"); if (res.sort !== "desc" || res.limit !== "25") throw new Error("Failed parsing basic query");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Decodes URL encoded characters",
        testCode: `const res = parseQueryString("search=John%20Doe&role=admin"); if (res.search !== "John Doe" || res.role !== "admin") throw new Error("Failed decoding URI characters");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Extract Bearer Token from Authorization Header",
    slug: "extract-bearer-token",
    category: "Authentication",
    difficulty: "beginner",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go", "csharp", "java"],
    xpReward: 50,
    estimatedMinutes: 10,
    order: 5,
    isPublished: true,
    description: "Parse HTTP `Authorization` request headers and cleanly extract the JWT Bearer token string.",
    instructions: "Implement `function extractBearerToken(authHeader)`.\n- Return token string if header starts with 'Bearer ' (case-insensitive).\n- Return `null` if header is missing, malformed, or has another scheme (like Basic).",
    starterCode: `function extractBearerToken(authHeader) {
  // Write your code here
}`,
    solutionTemplate: `function extractBearerToken(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const parts = authHeader.trim().split(/\\s+/);
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer' && parts[1].length > 0) {
    return parts[1];
  }
  return null;
}`,
    visibleTests: [
      {
        name: "Extracts valid Bearer token",
        testCode: `const t = extractBearerToken("Bearer eyJhbGciOiJIUzI1NiJ9"); if (t !== "eyJhbGciOiJIUzI1NiJ9") throw new Error("Failed extracting valid token");`,
        expectedOutput: true
      },
      {
        name: "Rejects Basic auth header",
        testCode: `if (extractBearerToken("Basic dXNlcjpwYXNz") !== null) throw new Error("Expected null for Basic auth");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Handles whitespace edge cases",
        testCode: `if (extractBearerToken("  BEARER   secret-jwt-token  ") !== "secret-jwt-token") throw new Error("Failed case-insensitive or multi-space header");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Standardize API Response Envelope",
    slug: "format-http-response",
    category: "REST APIs",
    difficulty: "beginner",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 50,
    estimatedMinutes: 10,
    order: 6,
    isPublished: true,
    description: "Create a consistent API response formatter that standardizes success responses and error envelopes with metadata.",
    instructions: "Implement `function formatResponse(data, error = null, statusCode = 200)`.\n- If `error` is provided, return `{ success: false, error, statusCode, timestamp }`.\n- Otherwise return `{ success: true, data, statusCode, timestamp }`.",
    starterCode: `function formatResponse(data, error, statusCode) {
  // Write your code here
}`,
    solutionTemplate: `function formatResponse(data, error = null, statusCode = 200) {
  const timestamp = new Date().toISOString();
  if (error) {
    return { success: false, error, statusCode: statusCode >= 400 ? statusCode : 500, timestamp };
  }
  return { success: true, data, statusCode, timestamp };
}`,
    visibleTests: [
      {
        name: "Formats successful payload",
        testCode: `const res = formatResponse({ id: 1, name: "Order" }, null, 201); if (!res.success || res.statusCode !== 201 || !res.data) throw new Error("Malformed success envelope");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Formats error payload",
        testCode: `const res = formatResponse(null, "Not found", 404); if (res.success || res.error !== "Not found" || res.statusCode !== 404) throw new Error("Malformed error envelope");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Sanitize Request Strings against XSS",
    slug: "sanitize-user-input",
    category: "Security",
    difficulty: "beginner",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "php"],
    xpReward: 50,
    estimatedMinutes: 10,
    order: 7,
    isPublished: true,
    description: "Escape raw HTML and script tags from client input strings before rendering or logging to prevent Cross-Site Scripting (XSS).",
    instructions: "Implement `function sanitizeString(str)`.\n- Replace `&`, `<`, `>`, `\"`, `'` with safe HTML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#x27;`).",
    starterCode: `function sanitizeString(str) {
  // Write your code here
}`,
    solutionTemplate: `function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}`,
    visibleTests: [
      {
        name: "Escapes script tag",
        testCode: `const s = sanitizeString("<script>alert(1)</script>"); if (s.includes("<") || s.includes(">")) throw new Error("Tags were not escaped");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Escapes quotes and ampersands",
        testCode: `const s = sanitizeString('Hello & "World"'); if (!s.includes('&amp;') || !s.includes('&quot;')) throw new Error("Failed escaping & or quotes");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Normalize International Phone Numbers",
    slug: "normalize-phone-number",
    category: "Backend Fundamentals",
    difficulty: "beginner",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python"],
    xpReward: 50,
    estimatedMinutes: 10,
    order: 8,
    isPublished: true,
    description: "Clean and normalize messy user-submitted phone numbers into standard E.164 digits-only format.",
    instructions: "Implement `function normalizePhone(rawPhone)`.\n- Strip all parentheses, dashes, dots, and spaces.\n- Prepend '+' if missing.",
    starterCode: `function normalizePhone(rawPhone) {
  // Write your code here
}`,
    solutionTemplate: `function normalizePhone(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') return '';
  const digits = rawPhone.replace(/[^0-9]/g, '');
  return digits ? '+' + digits : '';
}`,
    visibleTests: [
      {
        name: "Normalizes formatted US phone",
        testCode: `const p = normalizePhone("(555) 123-4567"); if (p !== "+5551234567") throw new Error("Expected +5551234567");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Normalizes international number with spaces and dots",
        testCode: `const p = normalizePhone("+44 20.7946.0912"); if (p !== "+442079460912") throw new Error("Expected +442079460912");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "URL Slug Generator for REST Endpoints",
    slug: "slugify-resource-title",
    category: "REST APIs",
    difficulty: "beginner",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "ruby"],
    xpReward: 50,
    estimatedMinutes: 10,
    order: 9,
    isPublished: true,
    description: "Convert article/course titles into clean, URL-safe kebab-case slugs.",
    instructions: "Implement `function slugify(title)`.\n- Lowercase title.\n- Replace spaces and special characters with '-'.\n- Remove consecutive dashes and trim leading/trailing dashes.",
    starterCode: `function slugify(title) {
  // Write your code here
}`,
    solutionTemplate: `function slugify(title) {
  if (!title || typeof title !== 'string') return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/[\\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}`,
    visibleTests: [
      {
        name: "Creates slug from title",
        testCode: `const s = slugify("Building Scalable APIs with Node.js & Docker!"); if (s !== "building-scalable-apis-with-nodejs-docker") throw new Error("Generated: " + s);`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Handles consecutive symbols",
        testCode: `const s = slugify("  FastAPI --- Production Ready!  "); if (s !== "fastapi-production-ready") throw new Error("Generated: " + s);`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "HTTP Status Code & Category Classifier",
    slug: "http-status-mapper",
    category: "HTTP",
    difficulty: "beginner",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 50,
    estimatedMinutes: 10,
    order: 10,
    isPublished: true,
    description: "Classify an HTTP integer status code into its canonical category (Informational, Successful, Redirection, Client Error, Server Error).",
    instructions: "Implement `function getStatusCategory(code)`.\n- 100-199: 'Informational'\n- 200-299: 'Successful'\n- 300-399: 'Redirection'\n- 400-499: 'Client Error'\n- 500-599: 'Server Error'\n- Otherwise: 'Unknown'",
    starterCode: `function getStatusCategory(code) {
  // Write your code here
}`,
    solutionTemplate: `function getStatusCategory(code) {
  const c = parseInt(code, 10);
  if (c >= 100 && c <= 199) return 'Informational';
  if (c >= 200 && c <= 299) return 'Successful';
  if (c >= 300 && c <= 399) return 'Redirection';
  if (c >= 400 && c <= 499) return 'Client Error';
  if (c >= 500 && c <= 599) return 'Server Error';
  return 'Unknown';
}`,
    visibleTests: [
      {
        name: "Classifies 201 as Successful",
        testCode: `if (getStatusCategory(201) !== "Successful") throw new Error("Expected Successful for 201");`,
        expectedOutput: true
      },
      {
        name: "Classifies 404 as Client Error",
        testCode: `if (getStatusCategory(404) !== "Client Error") throw new Error("Expected Client Error for 404");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Classifies 503 as Server Error",
        testCode: `if (getStatusCategory(503) !== "Server Error") throw new Error("Expected Server Error for 503");`,
        expectedOutput: true
      }
    ]
  },

  // ==========================================
  // EASY (8 Challenges)
  // ==========================================
  {
    title: "In-Memory Key-Value Cache with TTL",
    slug: "basic-in-memory-cache",
    category: "Caching",
    difficulty: "easy",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 75,
    estimatedMinutes: 15,
    order: 11,
    isPublished: true,
    description: "Build an in-memory key-value cache class with Time-To-Live (TTL) expiration support.",
    instructions: "Implement `class SimpleCache` with methods:\n- `set(key, value, ttlMs)`: stores value with optional expiry.\n- `get(key)`: returns value if valid, or `null` if expired or missing.\n- `has(key)`: returns boolean indicating validity.",
    starterCode: `class SimpleCache {
  constructor() {
    // Initialize storage
  }

  set(key, value, ttlMs) {
    // Write code
  }

  get(key) {
    // Write code
  }

  has(key) {
    // Write code
  }
}`,
    solutionTemplate: `class SimpleCache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttlMs = null) {
    const expiresAt = ttlMs ? Date.now() + ttlMs : null;
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    if (!this.store.has(key)) return null;
    const item = this.store.get(key);
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }
}`,
    visibleTests: [
      {
        name: "Sets and gets value immediately",
        testCode: `const c = new SimpleCache(); c.set("user:1", "Alice"); if (c.get("user:1") !== "Alice") throw new Error("Expected Alice");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Expires key when TTL has elapsed",
        testCode: `const c = new SimpleCache(); c.set("temp", "value", -100); if (c.get("temp") !== null || c.has("temp")) throw new Error("Expired key did not return null");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Generate Webhook HMAC-SHA256 Signature",
    slug: "generate-hmac-signature",
    category: "Security",
    difficulty: "easy",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 75,
    estimatedMinutes: 15,
    order: 12,
    isPublished: true,
    description: "Generate and verify cryptographically secure HMAC-SHA256 signatures for outgoing payment webhooks (Stripe / GitHub format).",
    instructions: "Implement `function generateWebhookSignature(payload, secret)`.\n- Return hex digest string of HMAC-SHA256.",
    starterCode: `const crypto = require('crypto');

function generateWebhookSignature(payload, secret) {
  // Write your code here
}`,
    solutionTemplate: `const crypto = require('crypto');

function generateWebhookSignature(payload, secret) {
  const data = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}`,
    visibleTests: [
      {
        name: "Generates valid 64-character hex signature",
        testCode: `const sig = generateWebhookSignature("{\"event\":\"payment.success\"}", "secret_key"); if (typeof sig !== "string" || sig.length !== 64) throw new Error("Expected 64 char hex HMAC");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Deterministically matches expected digest",
        testCode: `const s1 = generateWebhookSignature("data", "k"); const s2 = generateWebhookSignature("data", "k"); if (s1 !== s2) throw new Error("HMAC is non-deterministic");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Schema Validator for User Registration",
    slug: "request-payload-validator",
    category: "Validation",
    difficulty: "easy",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python"],
    xpReward: 75,
    estimatedMinutes: 15,
    order: 13,
    isPublished: true,
    description: "Validate a JSON user registration payload: username (3-20 chars), email (valid format), and age (>= 18).",
    instructions: "Implement `function validateRegistration(body)`.\n- Return `{ isValid: true, errors: [] }` if all fields pass.\n- Return `{ isValid: false, errors: string[] }` containing specific failure messages.",
    starterCode: `function validateRegistration(body) {
  // Write your code here
}`,
    solutionTemplate: `function validateRegistration(body) {
  const errors = [];
  if (!body) return { isValid: false, errors: ["Missing body"] };
  if (!body.username || typeof body.username !== 'string' || body.username.length < 3 || body.username.length > 20) {
    errors.push("Username must be between 3 and 20 characters");
  }
  if (!body.email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(body.email)) {
    errors.push("Invalid email address");
  }
  if (typeof body.age !== 'number' || body.age < 18) {
    errors.push("Must be at least 18 years old");
  }
  return { isValid: errors.length === 0, errors };
}`,
    visibleTests: [
      {
        name: "Valid user passes validation",
        testCode: `const r = validateRegistration({ username: "john_doe", email: "john@example.com", age: 25 }); if (!r.isValid || r.errors.length !== 0) throw new Error("Expected valid");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Captures underage and short username errors",
        testCode: `const r = validateRegistration({ username: "a", email: "bad", age: 16 }); if (r.isValid || r.errors.length !== 3) throw new Error("Expected 3 validation errors");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "JWT Token Header & Claims Extractor",
    slug: "jwt-payload-decoder",
    category: "Authentication",
    difficulty: "easy",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 75,
    estimatedMinutes: 15,
    order: 14,
    isPublished: true,
    description: "Safely parse and decode Base64Url-encoded JWT header and payload sections without external dependencies.",
    instructions: "Implement `function decodeJWT(jwtString)`.\n- Return `{ header: object, payload: object }`.\n- Throw or return `null` if token does not have 3 dot-separated segments.",
    starterCode: `function decodeJWT(jwtString) {
  // Write your code here
}`,
    solutionTemplate: `function decodeJWT(jwtString) {
  if (!jwtString || typeof jwtString !== 'string') return null;
  const parts = jwtString.split('.');
  if (parts.length !== 3) return null;
  try {
    const parseBase64 = (b64) => {
      const standard = b64.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(Buffer.from(standard, 'base64').toString('utf8'));
    };
    return {
      header: parseBase64(parts[0]),
      payload: parseBase64(parts[1])
    };
  } catch {
    return null;
  }
}`,
    visibleTests: [
      {
        name: "Decodes valid JWT payload",
        testCode: `const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0NSIsInJvbGUiOiJhZG1pbiJ9.signature"; const decoded = decodeJWT(token); if (decoded.payload.userId !== "12345" || decoded.payload.role !== "admin") throw new Error("Failed decoding payload");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Returns null for malformed string",
        testCode: `if (decodeJWT("not-a-jwt") !== null) throw new Error("Expected null for invalid token");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Password Strength & Entropy Evaluator",
    slug: "password-complexity-checker",
    category: "Security",
    difficulty: "easy",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python"],
    xpReward: 75,
    estimatedMinutes: 15,
    order: 15,
    isPublished: true,
    description: "Evaluate password strength according to NIST guidelines: length >= 8, uppercase, lowercase, numbers, and special symbols.",
    instructions: "Implement `function checkPasswordStrength(password)`.\n- Return `{ score: 0-4, strength: 'weak'|'fair'|'good'|'strong', feedback: string[] }`.",
    starterCode: `function checkPasswordStrength(password) {
  // Write your code here
}`,
    solutionTemplate: `function checkPasswordStrength(password) {
  if (!password) return { score: 0, strength: 'weak', feedback: ['Password is empty'] };
  let score = 0;
  const feedback = [];
  if (password.length >= 8) score++; else feedback.push('Must be at least 8 characters');
  if (/[A-Z]/.test(password)) score++; else feedback.push('Add uppercase letter');
  if (/[0-9]/.test(password)) score++; else feedback.push('Add a number');
  if (/[^A-Za-z0-9]/.test(password)) score++; else feedback.push('Add special character');
  const labels = ['weak', 'weak', 'fair', 'good', 'strong'];
  return { score, strength: labels[score], feedback };
}`,
    visibleTests: [
      {
        name: "Evaluates strong password",
        testCode: `const r = checkPasswordStrength("P@ssw0rd2026!"); if (r.score !== 4 || r.strength !== "strong") throw new Error("Expected strong score of 4");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Evaluates weak password",
        testCode: `const r = checkPasswordStrength("pass"); if (r.score > 1 || r.strength !== "weak") throw new Error("Expected weak score");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "CORS Origin Whitelist Evaluator",
    slug: "cors-origin-validator",
    category: "HTTP",
    difficulty: "easy",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 75,
    estimatedMinutes: 15,
    order: 16,
    isPublished: true,
    description: "Evaluate incoming `Origin` headers against allowed domain rules, supporting wildcard subdomains (e.g., `*.production.com`).",
    instructions: "Implement `function isAllowedOrigin(origin, whitelist)`.\n- Return `true` if origin matches exact domain or wildcard pattern.\n- Return `false` otherwise.",
    starterCode: `function isAllowedOrigin(origin, whitelist) {
  // Write your code here
}`,
    solutionTemplate: `function isAllowedOrigin(origin, whitelist) {
  if (!origin || !Array.isArray(whitelist)) return false;
  return whitelist.some(pattern => {
    if (pattern === '*') return true;
    if (pattern === origin) return true;
    if (pattern.startsWith('*.')) {
      const rootDomain = pattern.slice(2);
      try {
        const url = new URL(origin);
        return url.hostname.endsWith(rootDomain);
      } catch {
        return false;
      }
    }
    return false;
  });
}`,
    visibleTests: [
      {
        name: "Allows exact match",
        testCode: `if (!isAllowedOrigin("https://app.example.com", ["https://app.example.com"])) throw new Error("Failed exact match");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Allows wildcard subdomain match",
        testCode: `if (!isAllowedOrigin("https://api.v1.example.com", ["*.example.com"])) throw new Error("Failed wildcard subdomain match");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Dynamic SQL WHERE Clause Generator",
    slug: "sql-where-clause-builder",
    category: "Databases",
    difficulty: "easy",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python"],
    xpReward: 75,
    estimatedMinutes: 15,
    order: 17,
    isPublished: true,
    description: "Generate parameterized SQL `WHERE` clauses with `$1, $2, ...` positional query placeholders from dynamic filter dictionaries.",
    instructions: "Implement `function buildWhereClause(filters)`.\n- Return `{ sql: string, params: any[] }`.\n- E.g. `{ role: 'admin', active: true }` -> `{ sql: 'WHERE role = $1 AND active = $2', params: ['admin', true] }`.",
    starterCode: `function buildWhereClause(filters) {
  // Write your code here
}`,
    solutionTemplate: `function buildWhereClause(filters) {
  if (!filters || Object.keys(filters).length === 0) {
    return { sql: '', params: [] };
  }
  const keys = Object.keys(filters);
  const clauses = keys.map((key, idx) => \`\${key} = $\${idx + 1}\`);
  const params = keys.map(k => filters[k]);
  return {
    sql: 'WHERE ' + clauses.join(' AND '),
    params
  };
}`,
    visibleTests: [
      {
        name: "Builds 2-parameter WHERE clause",
        testCode: `const res = buildWhereClause({ status: "active", orgId: 101 }); if (res.sql !== "WHERE status = $1 AND orgId = $2" || res.params[0] !== "active") throw new Error("Incorrect clause: " + res.sql);`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Returns empty SQL for empty filters",
        testCode: `const res = buildWhereClause({}); if (res.sql !== "" || res.params.length !== 0) throw new Error("Expected empty SQL");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "HTTP Path Regex & Param Matcher",
    slug: "route-matcher-simple",
    category: "REST APIs",
    difficulty: "easy",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 75,
    estimatedMinutes: 15,
    order: 18,
    isPublished: true,
    description: "Build an express-style router pattern matcher that extracts route parameters (e.g. `/users/:id/orders/:orderId`).",
    instructions: "Implement `function matchRoute(routePattern, requestPath)`.\n- Return `{ matched: true, params: object }` if path matches.\n- Return `{ matched: false, params: {} }` otherwise.",
    starterCode: `function matchRoute(routePattern, requestPath) {
  // Write your code here
}`,
    solutionTemplate: `function matchRoute(routePattern, requestPath) {
  const patternSegments = routePattern.split('/').filter(Boolean);
  const pathSegments = requestPath.split('/').filter(Boolean);
  if (patternSegments.length !== pathSegments.length) {
    return { matched: false, params: {} };
  }
  const params = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const pat = patternSegments[i];
    const actual = pathSegments[i];
    if (pat.startsWith(':')) {
      params[pat.slice(1)] = actual;
    } else if (pat !== actual) {
      return { matched: false, params: {} };
    }
  }
  return { matched: true, params };
}`,
    visibleTests: [
      {
        name: "Extracts :userId and :postId params",
        testCode: `const res = matchRoute("/users/:userId/posts/:postId", "/users/42/posts/108"); if (!res.matched || res.params.userId !== "42" || res.params.postId !== "108") throw new Error("Failed route extraction");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Rejects unmatched route length",
        testCode: `const res = matchRoute("/users/:id", "/users/42/extra"); if (res.matched) throw new Error("Should not match extra segment");`,
        expectedOutput: true
      }
    ]
  },

  // ==========================================
  // MEDIUM (8 Challenges)
  // ==========================================
  {
    title: "Token Bucket Rate Limiting Algorithm",
    slug: "token-bucket-rate-limiter",
    category: "Rate Limiting",
    difficulty: "medium",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go", "rust"],
    xpReward: 100,
    estimatedMinutes: 20,
    order: 19,
    isPublished: true,
    description: "Implement the Token Bucket algorithm used in high-performance API gateways (Nginx, AWS API Gateway) to control request bursts.",
    instructions: "Implement `class TokenBucketRateLimiter` with constructor `(capacity, refillRatePerSec)` and method `allowRequest(cost = 1)` returning boolean.",
    starterCode: `class TokenBucketRateLimiter {
  constructor(capacity, refillRatePerSec) {
    // Write code here
  }

  allowRequest(tokensRequired = 1) {
    // Write code here
  }
}`,
    solutionTemplate: `class TokenBucketRateLimiter {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.refillRate = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRate);
    this.lastRefill = now;
  }

  allowRequest(tokensRequired = 1) {
    this.refill();
    if (this.tokens >= tokensRequired) {
      this.tokens -= tokensRequired;
      return true;
    }
    return false;
  }
}`,
    visibleTests: [
      {
        name: "Allows requests within bucket capacity",
        testCode: `const limiter = new TokenBucketRateLimiter(3, 1); if (!limiter.allowRequest() || !limiter.allowRequest() || !limiter.allowRequest()) throw new Error("Failed allowing 3 capacity tokens"); if (limiter.allowRequest()) throw new Error("Should deny 4th request");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Enforces capacity ceiling",
        testCode: `const limiter = new TokenBucketRateLimiter(2, 5); limiter.refill(); if (limiter.tokens > 2) throw new Error("Tokens exceeded capacity");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Async Operation Retry with Exponential Backoff",
    slug: "async-retry-with-backoff",
    category: "Async Programming",
    difficulty: "medium",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 100,
    estimatedMinutes: 20,
    order: 20,
    isPublished: true,
    description: "Write an async retry utility with exponential backoff and jitter for transient network failures.",
    instructions: "Implement `async function retryWithBackoff(asyncFn, maxRetries = 3, baseDelayMs = 50)`.\n- Retry on rejection.\n- Delay doubles on each attempt: `baseDelayMs * 2^(attempt)`.\n- Throw last error if maxRetries exceeded.",
    starterCode: `async function retryWithBackoff(asyncFn, maxRetries = 3, baseDelayMs = 50) {
  // Write your code here
}`,
    solutionTemplate: `async function retryWithBackoff(asyncFn, maxRetries = 3, baseDelayMs = 50) {
  let attempt = 0;
  while (true) {
    try {
      return await asyncFn();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}`,
    visibleTests: [
      {
        name: "Resolves on first try if successful",
        testCode: `async function test() { const res = await retryWithBackoff(async () => 42); if (res !== 42) throw new Error("Expected 42"); } test();`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Retries and succeeds on 2nd attempt",
        testCode: `async function test() { let count = 0; const res = await retryWithBackoff(async () => { count++; if (count < 2) throw new Error("Fail"); return "OK"; }, 3, 10); if (res !== "OK" || count !== 2) throw new Error("Failed retry on 2nd attempt"); } test();`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Least Recently Used (LRU) Cache Implementation",
    slug: "lru-cache-eviction",
    category: "Caching",
    difficulty: "medium",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "java", "csharp"],
    xpReward: 100,
    estimatedMinutes: 25,
    order: 21,
    isPublished: true,
    description: "Implement a classic LRU (Least Recently Used) cache with O(1) time complexity for get and put operations.",
    instructions: "Implement `class LRUCache` with constructor `(capacity)` and methods `get(key)` and `put(key, value)`.\n- When capacity is reached, evict the least recently accessed item.",
    starterCode: `class LRUCache {
  constructor(capacity) {
    // Write your code here
  }

  get(key) {
    // Write code
  }

  put(key, value) {
    // Write code
  }
}`,
    solutionTemplate: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}`,
    visibleTests: [
      {
        name: "Evicts oldest un-accessed key on overflow",
        testCode: `const lru = new LRUCache(2); lru.put(1, 1); lru.put(2, 2); lru.get(1); lru.put(3, 3); if (lru.get(2) !== -1 || lru.get(1) !== 1) throw new Error("Failed LRU eviction");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Updates existing key value",
        testCode: `const lru = new LRUCache(2); lru.put(1, 10); lru.put(1, 20); if (lru.get(1) !== 20) throw new Error("Failed value overwrite");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Structured JSON Log Formatter with Tracing Context",
    slug: "structured-log-formatter",
    category: "Observability",
    difficulty: "medium",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 100,
    estimatedMinutes: 20,
    order: 22,
    isPublished: true,
    description: "Format application log records into machine-readable JSON with W3C trace IDs, ISO timestamp, log level, and error stack serialization.",
    instructions: "Implement `function formatStructuredLog(level, message, context = {})` returning JSON string.",
    starterCode: `function formatStructuredLog(level, message, context) {
  // Write your code here
}`,
    solutionTemplate: `function formatStructuredLog(level, message, context = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    level: String(level).toUpperCase(),
    message: String(message),
    traceId: context.traceId || 'trace-none',
    spanId: context.spanId || 'span-none',
    ...context
  };
  return JSON.stringify(payload);
}`,
    visibleTests: [
      {
        name: "Formats valid JSON log with metadata",
        testCode: `const json = formatStructuredLog("info", "Order placed", { traceId: "t-101", orderId: "ord_99" }); const obj = JSON.parse(json); if (obj.level !== "INFO" || obj.traceId !== "t-101" || obj.orderId !== "ord_99") throw new Error("Malformed JSON log");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Includes ISO timestamp",
        testCode: `const obj = JSON.parse(formatStructuredLog("error", "DB Timeout")); if (!obj.timestamp || isNaN(Date.parse(obj.timestamp))) throw new Error("Missing valid ISO timestamp");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Circuit Breaker Tripping State Machine",
    slug: "circuit-breaker-state-machine",
    category: "Microservices",
    difficulty: "medium",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "java", "go"],
    xpReward: 100,
    estimatedMinutes: 25,
    order: 23,
    isPublished: true,
    description: "Implement a 3-state Circuit Breaker (CLOSED, OPEN, HALF_OPEN) to prevent cascading failures across downstream services.",
    instructions: "Implement `class CircuitBreaker` with states: CLOSED -> OPEN (on failureThreshold) -> HALF_OPEN (after resetTimeout).",
    starterCode: `class CircuitBreaker {
  constructor(failureThreshold, resetTimeoutMs) {
    // Write your code here
  }

  async execute(action) {
    // Write your code here
  }
}`,
    solutionTemplate: `class CircuitBreaker {
  constructor(failureThreshold = 3, resetTimeoutMs = 1000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.state = "CLOSED";
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }

  async execute(action) {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit is OPEN");
      }
    }

    try {
      const result = await action();
      if (this.state === "HALF_OPEN") {
        this.state = "CLOSED";
        this.failureCount = 0;
      }
      return result;
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      if (this.failureCount >= this.failureThreshold || this.state === "HALF_OPEN") {
        this.state = "OPEN";
      }
      throw err;
    }
  }
}`,
    visibleTests: [
      {
        name: "Trips from CLOSED to OPEN on consecutive failures",
        testCode: `async function test() { const cb = new CircuitBreaker(2, 500); try { await cb.execute(async () => { throw new Error("1"); }); } catch(e){} try { await cb.execute(async () => { throw new Error("2"); }); } catch(e){} if (cb.state !== "OPEN") throw new Error("Expected OPEN state"); } test();`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Recovers to CLOSED on success during HALF_OPEN",
        testCode: `async function test() { const cb = new CircuitBreaker(1, 10); try { await cb.execute(async () => { throw new Error("1"); }); } catch(e){} await new Promise(r => setTimeout(r, 20)); await cb.execute(async () => "recovered"); if (cb.state !== "CLOSED") throw new Error("Expected CLOSED after recovery"); } test();`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Simulated DB Connection Pool Leaser",
    slug: "database-connection-pool",
    category: "Databases",
    difficulty: "medium",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 100,
    estimatedMinutes: 25,
    order: 24,
    isPublished: true,
    description: "Design a resource pool manager that acquires, limits (maxConnections), and releases reusable database client connections.",
    instructions: "Implement `class ConnectionPool` with methods `acquire()` and `release(connection)`.",
    starterCode: `class ConnectionPool {
  constructor(maxSize) {
    // Write code
  }

  async acquire() {
    // Write code
  }

  release(conn) {
    // Write code
  }
}`,
    solutionTemplate: `class ConnectionPool {
  constructor(maxSize = 5) {
    this.maxSize = maxSize;
    this.available = [];
    this.inUse = new Set();
    this.waitingQueue = [];
    for (let i = 1; i <= maxSize; i++) {
      this.available.push({ id: i });
    }
  }

  async acquire() {
    if (this.available.length > 0) {
      const conn = this.available.pop();
      this.inUse.add(conn);
      return conn;
    }
    return new Promise(resolve => this.waitingQueue.push(resolve));
  }

  release(conn) {
    if (!this.inUse.has(conn)) return;
    this.inUse.delete(conn);
    if (this.waitingQueue.length > 0) {
      const nextResolve = this.waitingQueue.shift();
      this.inUse.add(conn);
      nextResolve(conn);
    } else {
      this.available.push(conn);
    }
  }
}`,
    visibleTests: [
      {
        name: "Acquires and releases connection",
        testCode: `async function test() { const pool = new ConnectionPool(2); const c1 = await pool.acquire(); const c2 = await pool.acquire(); if (pool.available.length !== 0) throw new Error("Pool should be empty"); pool.release(c1); if (pool.available.length !== 1) throw new Error("Pool should have 1 available"); } test();`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Queues callers when max connections reached",
        testCode: `async function test() { const pool = new ConnectionPool(1); const c1 = await pool.acquire(); let resolved = false; pool.acquire().then(() => { resolved = true; }); if (resolved) throw new Error("Should be waiting in queue"); pool.release(c1); await new Promise(r => setTimeout(r, 10)); if (!resolved) throw new Error("Queued request should resolve"); } test();`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Bounded Concurrency Worker Queue",
    slug: "async-task-queue-concurrency",
    category: "Concurrency",
    difficulty: "medium",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 100,
    estimatedMinutes: 25,
    order: 25,
    isPublished: true,
    description: "Create an async task runner that limits the number of concurrently executing asynchronous tasks to a maximum of `N`.",
    instructions: "Implement `class TaskQueue` with constructor `(concurrency)` and method `add(asyncFn)` returning a Promise.",
    starterCode: `class TaskQueue {
  constructor(concurrency = 2) {
    // Write code
  }

  add(asyncFn) {
    // Write code
  }
}`,
    solutionTemplate: `class TaskQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  add(asyncFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ asyncFn, resolve, reject });
      this.next();
    });
  }

  next() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { asyncFn, resolve, reject } = this.queue.shift();
      this.running++;
      asyncFn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.running--;
          this.next();
        });
    }
  }
}`,
    visibleTests: [
      {
        name: "Limits concurrent tasks",
        testCode: `async function test() { const q = new TaskQueue(2); let active = 0; let maxActive = 0; const task = async () => { active++; maxActive = Math.max(maxActive, active); await new Promise(r => setTimeout(r, 20)); active--; }; await Promise.all([q.add(task), q.add(task), q.add(task), q.add(task)]); if (maxActive > 2) throw new Error("Exceeded concurrency: " + maxActive); } test();`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Returns correct result values",
        testCode: `async function test() { const q = new TaskQueue(2); const res = await q.add(async () => "done"); if (res !== "done") throw new Error("Failed returning result"); } test();`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "API Versioning & Header Negotiation Router",
    slug: "api-version-header-router",
    category: "REST APIs",
    difficulty: "medium",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python"],
    xpReward: 100,
    estimatedMinutes: 20,
    order: 26,
    isPublished: true,
    description: "Route API requests to appropriate versioned handlers based on `Accept-Version` or `X-API-Version` headers with semantic fallback.",
    instructions: "Implement `function routeVersion(handlers, versionHeader, defaultVersion = 'v1')`.",
    starterCode: `function routeVersion(handlers, versionHeader, defaultVersion = 'v1') {
  // Write your code here
}`,
    solutionTemplate: `function routeVersion(handlers, versionHeader, defaultVersion = 'v1') {
  const v = versionHeader ? String(versionHeader).trim().toLowerCase() : defaultVersion;
  if (handlers[v]) return handlers[v];
  if (handlers[defaultVersion]) return handlers[defaultVersion];
  throw new Error("Unsupported API version");
}`,
    visibleTests: [
      {
        name: "Selects matching version handler",
        testCode: `const handlers = { v1: () => "v1", v2: () => "v2" }; const h = routeVersion(handlers, "v2"); if (h() !== "v2") throw new Error("Expected v2 handler");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Falls back to default version",
        testCode: `const handlers = { v1: () => "v1" }; const h = routeVersion(handlers, null); if (h() !== "v1") throw new Error("Expected fallback v1");`,
        expectedOutput: true
      }
    ]
  },

  // ==========================================
  // HARD (5 Challenges)
  // ==========================================
  {
    title: "Sliding Window Log Distributed Rate Limiter",
    slug: "sliding-window-rate-limiter",
    category: "Rate Limiting",
    difficulty: "hard",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 150,
    estimatedMinutes: 30,
    order: 27,
    isPublished: true,
    description: "Implement a sliding window log rate limiter that tracks individual request timestamps to provide perfectly smooth, burst-free rate limiting.",
    instructions: "Implement `class SlidingWindowLimiter` with constructor `(maxRequests, windowMs)` and method `allow(userId, timestamp)`.",
    starterCode: `class SlidingWindowLimiter {
  constructor(maxRequests, windowMs) {
    // Write code
  }

  allow(userId, timestamp = Date.now()) {
    // Write code
  }
}`,
    solutionTemplate: `class SlidingWindowLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.userLogs = new Map();
  }

  allow(userId, timestamp = Date.now()) {
    if (!this.userLogs.has(userId)) {
      this.userLogs.set(userId, []);
    }
    const timestamps = this.userLogs.get(userId);
    const windowStart = timestamp - this.windowMs;
    const valid = timestamps.filter(t => t > windowStart);
    if (valid.length < this.maxRequests) {
      valid.push(timestamp);
      this.userLogs.set(userId, valid);
      return true;
    }
    this.userLogs.set(userId, valid);
    return false;
  }
}`,
    visibleTests: [
      {
        name: "Allows up to max requests in sliding window",
        testCode: `const lim = new SlidingWindowLimiter(2, 1000); const now = 10000; if (!lim.allow("u1", now) || !lim.allow("u1", now + 100)) throw new Error("Should allow first 2"); if (lim.allow("u1", now + 200)) throw new Error("Should deny 3rd request in same window");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Cleans up old timestamps and allows new requests after window",
        testCode: `const lim = new SlidingWindowLimiter(2, 1000); const now = 10000; lim.allow("u1", now); lim.allow("u1", now + 100); if (!lim.allow("u1", now + 1050)) throw new Error("Should allow request after window slid");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Distributed Mutex Lock with Lease Expiry",
    slug: "distributed-lock-simulator",
    category: "Concurrency",
    difficulty: "hard",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 150,
    estimatedMinutes: 30,
    order: 28,
    isPublished: true,
    description: "Simulate a Redis-style Redlock distributed mutex with unique ownership tokens (fencing tokens) and automatic lease expiration.",
    instructions: "Implement `class DistributedLockManager` with `acquire(resourceKey, ttlMs, ownerId)` and `release(resourceKey, ownerId)`.",
    starterCode: `class DistributedLockManager {
  constructor() {
    // Write code
  }

  acquire(resourceKey, ttlMs, ownerId) {
    // Write code
  }

  release(resourceKey, ownerId) {
    // Write code
  }
}`,
    solutionTemplate: `class DistributedLockManager {
  constructor() {
    this.locks = new Map();
  }

  acquire(resourceKey, ttlMs, ownerId) {
    const now = Date.now();
    if (this.locks.has(resourceKey)) {
      const lock = this.locks.get(resourceKey);
      if (now < lock.expiresAt) {
        return false;
      }
    }
    this.locks.set(resourceKey, { ownerId, expiresAt: now + ttlMs });
    return true;
  }

  release(resourceKey, ownerId) {
    if (!this.locks.has(resourceKey)) return false;
    const lock = this.locks.get(resourceKey);
    if (lock.ownerId === ownerId) {
      this.locks.delete(resourceKey);
      return true;
    }
    return false;
  }
}`,
    visibleTests: [
      {
        name: "Acquires lock and blocks second owner",
        testCode: `const mgr = new DistributedLockManager(); if (!mgr.acquire("res_1", 1000, "node_A")) throw new Error("node_A should acquire"); if (mgr.acquire("res_1", 1000, "node_B")) throw new Error("node_B should be blocked");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Releases lock correctly only for matching owner",
        testCode: `const mgr = new DistributedLockManager(); mgr.acquire("res_1", 1000, "node_A"); if (mgr.release("res_1", "node_B")) throw new Error("Wrong owner should not release"); mgr.release("res_1", "node_A"); if (!mgr.acquire("res_1", 1000, "node_B")) throw new Error("node_B should acquire after release");`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Saga / 2PC Transaction Coordinator",
    slug: "two-phase-commit-coordinator",
    category: "Databases",
    difficulty: "hard",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 150,
    estimatedMinutes: 30,
    order: 29,
    isPublished: true,
    description: "Build a Saga transaction orchestrator that executes a multi-step distributed workflow and invokes compensating rollback actions if any step fails.",
    instructions: "Implement `class SagaCoordinator` with `addStep(name, executeFn, compensateFn)` and `run()`.",
    starterCode: `class SagaCoordinator {
  constructor() {
    // Write code
  }

  addStep(name, executeFn, compensateFn) {
    // Write code
  }

  async run() {
    // Write code
  }
}`,
    solutionTemplate: `class SagaCoordinator {
  constructor() {
    this.steps = [];
  }

  addStep(name, executeFn, compensateFn) {
    this.steps.push({ name, executeFn, compensateFn });
    return this;
  }

  async run() {
    const executed = [];
    for (const step of this.steps) {
      try {
        await step.executeFn();
        executed.push(step);
      } catch (err) {
        for (let i = executed.length - 1; i >= 0; i--) {
          try {
            await executed[i].compensateFn();
          } catch (compErr) {
            console.error("Compensate error:", compErr);
          }
        }
        return { success: false, failedStep: step.name, error: err.message };
      }
    }
    return { success: true, completedSteps: executed.map(s => s.name) };
  }
}`,
    visibleTests: [
      {
        name: "Runs successful multi-step saga",
        testCode: `async function test() { const saga = new SagaCoordinator(); saga.addStep("A", async () => {}, async () => {}); saga.addStep("B", async () => {}, async () => {}); const res = await saga.run(); if (!res.success || res.completedSteps.length !== 2) throw new Error("Saga failed"); } test();`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Rolls back executed steps when step C fails",
        testCode: `async function test() { let rolledBack = false; const saga = new SagaCoordinator(); saga.addStep("A", async () => {}, async () => { rolledBack = true; }); saga.addStep("B", async () => { throw new Error("Payment declined"); }, async () => {}); const res = await saga.run(); if (res.success || !rolledBack) throw new Error("Failed compensation rollback"); } test();`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Async Distributed PubSub Event Bus",
    slug: "event-emitter-pubsub",
    category: "Async Programming",
    difficulty: "hard",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 150,
    estimatedMinutes: 30,
    order: 30,
    isPublished: true,
    description: "Design an asynchronous event bus supporting wildcard topic subscriptions (e.g. `order.*`, `order.created`) with error isolation.",
    instructions: "Implement `class AsyncPubSub` with methods `subscribe(topic, handler)`, `publish(topic, payload)`, and `unsubscribe(topic, handler)`.",
    starterCode: `class AsyncPubSub {
  constructor() {
    // Write code
  }

  subscribe(topic, handler) {
    // Write code
  }

  async publish(topic, payload) {
    // Write code
  }
}`,
    solutionTemplate: `class AsyncPubSub {
  constructor() {
    this.subscribers = new Map();
  }

  subscribe(topic, handler) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic).add(handler);
    return () => this.unsubscribe(topic, handler);
  }

  unsubscribe(topic, handler) {
    if (this.subscribers.has(topic)) {
      this.subscribers.get(topic).delete(handler);
    }
  }

  async publish(topic, payload) {
    const promises = [];
    for (const [subTopic, handlers] of this.subscribers.entries()) {
      if (this.matchTopic(subTopic, topic)) {
        for (const handler of handlers) {
          promises.push(Promise.resolve().then(() => handler(payload, topic)));
        }
      }
    }
    await Promise.allSettled(promises);
  }

  matchTopic(pattern, topic) {
    if (pattern === topic || pattern === '*') return true;
    if (pattern.endsWith('.*')) {
      const prefix = pattern.slice(0, -2);
      return topic.startsWith(prefix);
    }
    return false;
  }
}`,
    visibleTests: [
      {
        name: "Publishes message to subscriber",
        testCode: `async function test() { const bus = new AsyncPubSub(); let received = null; bus.subscribe("order.created", (data) => { received = data; }); await bus.publish("order.created", { id: 101 }); if (!received || received.id !== 101) throw new Error("Message not received"); } test();`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Wildcard topic receives sub-topic messages",
        testCode: `async function test() { const bus = new AsyncPubSub(); let count = 0; bus.subscribe("order.*", () => { count++; }); await bus.publish("order.created", {}); await bus.publish("order.cancelled", {}); if (count !== 2) throw new Error("Wildcard subscriber failed to receive all events"); } test();`,
        expectedOutput: true
      }
    ]
  },

  {
    title: "Bulkhead Pattern Concurrency Isolator",
    slug: "bulkhead-concurrency-isolator",
    category: "System Design",
    difficulty: "hard",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go"],
    xpReward: 150,
    estimatedMinutes: 30,
    order: 31,
    isPublished: true,
    description: "Implement the Bulkhead isolation pattern to segregate critical resource pools, preventing failure in one service from starving other services.",
    instructions: "Implement `class BulkheadIsolator` with `createPool(name, maxConcurrent)` and `execute(poolName, action)`.",
    starterCode: `class BulkheadIsolator {
  constructor() {
    // Write code
  }

  createPool(name, maxConcurrent) {
    // Write code
  }

  async execute(poolName, action) {
    // Write code
  }
}`,
    solutionTemplate: `class BulkheadIsolator {
  constructor() {
    this.pools = new Map();
  }

  createPool(name, maxConcurrent = 5) {
    this.pools.set(name, { maxConcurrent, current: 0 });
  }

  async execute(poolName, action) {
    const pool = this.pools.get(poolName);
    if (!pool) throw new Error("Unknown pool: " + poolName);
    if (pool.current >= pool.maxConcurrent) {
      throw new Error("Bulkhead capacity reached for pool " + poolName);
    }
    pool.current++;
    try {
      return await action();
    } finally {
      pool.current--;
    }
  }
}`,
    visibleTests: [
      {
        name: "Executes action within pool limit",
        testCode: `async function test() { const bh = new BulkheadIsolator(); bh.createPool("billing", 2); const res = await bh.execute("billing", async () => "paid"); if (res !== "paid") throw new Error("Failed execution"); } test();`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Rejects execution when pool saturated without affecting other pools",
        testCode: `async function test() { const bh = new BulkheadIsolator(); bh.createPool("heavy", 1); bh.createPool("light", 5); const p1 = bh.execute("heavy", () => new Promise(r => setTimeout(r, 50))); try { await bh.execute("heavy", async () => {}); throw new Error("Should have thrown capacity error"); } catch(e) { if (!e.message.includes("Bulkhead capacity")) throw e; } const lightRes = await bh.execute("light", async () => "ok"); if (lightRes !== "ok") throw new Error("Light pool should remain unaffected"); await p1; } test();`,
        expectedOutput: true
      }
    ]
  },

  // ==========================================
  // ADVANCED (1 Challenge)
  // ==========================================
  {
    title: "Distributed URL Shortener Base62 System",
    slug: "url-shortener-base62-encoder",
    category: "System Design",
    difficulty: "advanced",
    language: "javascript",
    supportedLanguages: ["javascript", "typescript", "python", "go", "rust"],
    xpReward: 200,
    estimatedMinutes: 35,
    order: 32,
    isPublished: true,
    description: "Build a high-throughput distributed URL Shortener Base62 encoding & decoding engine with unique 64-bit ID mapping.",
    instructions: "Implement `class UrlShortenerService` with `encodeId(numericId)` and `decodeSlug(slug)` using Base62 alphabet `0-9a-zA-Z`.",
    starterCode: `class UrlShortenerService {
  constructor() {
    // Write code
  }

  encodeId(id) {
    // Write code
  }

  decodeSlug(slug) {
    // Write code
  }
}`,
    solutionTemplate: `class UrlShortenerService {
  constructor() {
    this.alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.base = this.alphabet.length;
  }

  encodeId(id) {
    if (id === 0) return this.alphabet[0];
    let num = Number(id);
    let str = "";
    while (num > 0) {
      str = this.alphabet[num % this.base] + str;
      num = Math.floor(num / this.base);
    }
    return str;
  }

  decodeSlug(slug) {
    if (!slug) return 0;
    let num = 0;
    for (let i = 0; i < slug.length; i++) {
      const char = slug[i];
      const idx = this.alphabet.indexOf(char);
      if (idx === -1) throw new Error("Invalid Base62 character");
      num = num * this.base + idx;
    }
    return num;
  }
}`,
    visibleTests: [
      {
        name: "Encodes and decodes numeric ID reliably",
        testCode: `const svc = new UrlShortenerService(); const slug = svc.encodeId(125309); const decoded = svc.decodeSlug(slug); if (decoded !== 125309) throw new Error("Decoded value did not match original ID");`,
        expectedOutput: true
      }
    ],
    hiddenTests: [
      {
        name: "Encodes large integer IDs",
        testCode: `const svc = new UrlShortenerService(); const slug = svc.encodeId(100000000); const decoded = svc.decodeSlug(slug); if (decoded !== 100000000) throw new Error("Failed on large ID");`,
        expectedOutput: true
      }
    ]
  }
];
