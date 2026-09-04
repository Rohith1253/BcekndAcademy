import { GameDefinition, GameScenario } from "./types";

export const GAME_DEFINITIONS: GameDefinition[] = [
  {
    id: "http-status",
    slug: "http-status",
    title: "HTTP Status Code Challenge",
    description: "Master when to use 200, 201, 204, 400, 401, 403, 404, 409, and 500 status codes in real REST APIs.",
    category: "HTTP & APIs",
    difficulty: "beginner",
    xpReward: 150,
    estimatedMinutes: 5,
    moduleId: "web-http-fundamentals",
    courseSlug: "backend-node-js",
    lessonSlug: "http-methods-status-codes",
    instructions: "Read each backend API scenario and select the most appropriate HTTP status code. Learn why alternative codes are incorrect.",
    gameType: "http-status",
  },
  {
    id: "api-flow",
    slug: "api-flow",
    title: "API Request Flow Game",
    description: "Arrange the layers of a production API request (Client -> Route -> Middleware -> Controller -> Service -> DB -> Response).",
    category: "HTTP & APIs",
    difficulty: "beginner",
    xpReward: 150,
    estimatedMinutes: 5,
    moduleId: "express-architecture",
    courseSlug: "backend-node-js",
    lessonSlug: "express-fundamentals",
    instructions: "Drag or tap the request lifecycle components into the correct execution order from initial HTTP client dispatch to database query and final JSON response.",
    gameType: "api-flow",
  },
  {
    id: "route-matcher",
    slug: "route-matcher",
    title: "Route Matcher Game",
    description: "Match HTTP methods (GET, POST, PUT, PATCH, DELETE) and path patterns to their correct Express controller handlers.",
    category: "Express & Routing",
    difficulty: "beginner",
    xpReward: 150,
    estimatedMinutes: 5,
    moduleId: "express-foundations",
    courseSlug: "express-rest-api",
    lessonSlug: "express-routing-controllers",
    instructions: "Match incoming HTTP request signatures (method + URI path) to the proper REST controller action and HTTP verb.",
    gameType: "route-matcher",
  },
  {
    id: "middleware-maze",
    slug: "middleware-maze",
    title: "Middleware Pipeline Order Game",
    description: "Solve Express middleware execution order puzzles (Logger -> Auth -> Validation -> Controller -> Error Handler).",
    category: "Express & Routing",
    difficulty: "intermediate",
    xpReward: 175,
    estimatedMinutes: 6,
    moduleId: "api-architecture",
    courseSlug: "express-rest-api",
    lessonSlug: "express-middleware",
    instructions: "Order Express middleware functions so validation runs before controllers, authentication runs before authorization, and error middleware catches unhandled exceptions.",
    gameType: "middleware-maze",
  },
  {
    id: "database-puzzle",
    slug: "database-puzzle",
    title: "MongoDB Query Puzzle",
    description: "Assemble Mongoose queries (findOne, create, findByIdAndUpdate, aggregate) to solve real database retrieval scenarios.",
    category: "Database",
    difficulty: "intermediate",
    xpReward: 175,
    estimatedMinutes: 6,
    moduleId: "mongodb-engineering",
    courseSlug: "mongodb-database",
    lessonSlug: "mongodb-crud-operations",
    instructions: "Select or arrange Mongoose ODM methods and query operators ($elemMatch, $set, $near) to safely retrieve or update document schemas.",
    gameType: "database-puzzle",
  },
  {
    id: "jwt-flow",
    slug: "jwt-flow",
    title: "JWT Authentication Flow Game",
    description: "Trace the step-by-step authentication lifecycle from password hashing to token signing, HttpOnly cookies, and route guards.",
    category: "Authentication",
    difficulty: "intermediate",
    xpReward: 200,
    estimatedMinutes: 7,
    moduleId: "jwt-authentication",
    courseSlug: "backend-auth-security",
    lessonSlug: "jwt-structure-verification",
    instructions: "Order authentication lifecycle steps and identify security breakage points (expired signatures, tampered payloads, missing cookies).",
    gameType: "jwt-flow",
  },
  {
    id: "bug-hunter",
    slug: "bug-hunter",
    title: "Backend Bug Hunter",
    description: "Spot and fix critical backend bugs in Node.js and TypeScript snippets (missing await, unhandled exceptions, exposed secrets).",
    category: "Debugging",
    difficulty: "advanced",
    xpReward: 200,
    estimatedMinutes: 7,
    moduleId: "production-ts",
    courseSlug: "typescript-backend",
    lessonSlug: "ts-async-typed-apis",
    instructions: "Inspect backend code snippets, locate logical errors or unhandled async promises, and select the correct patch.",
    gameType: "bug-hunter",
  },
  {
    id: "security-defender",
    slug: "security-defender",
    title: "Security Defender Challenge",
    description: "Defend backend APIs against NoSQL injection, missing rate limiting, CORS misconfigurations, and credential leaks.",
    category: "Security",
    difficulty: "advanced",
    xpReward: 225,
    estimatedMinutes: 8,
    moduleId: "api-security-hardening",
    courseSlug: "backend-auth-security",
    lessonSlug: "input-sanitization-validation",
    instructions: "Identify security vulnerabilities in API definitions and select the defense mechanism required to harden the server.",
    gameType: "security-defender",
  },
];

export const GAME_SCENARIOS: Record<string, GameScenario[]> = {
  "http-status": [
    {
      id: "s1",
      prompt: "A student successfully registers a new user account on your API endpoint POST /api/auth/register.",
      options: ["200 OK", "201 Created", "204 No Content", "400 Bad Request"],
      correctAnswer: "201 Created",
      explanation: "HTTP 201 Created indicates that the request succeeded and a new resource (user document) was created.",
      wrongOptionExplanations: {
        "200 OK": "200 is for standard successful GET/PUT calls where no new resource was instantiated.",
        "204 No Content": "204 means success with an empty body, but user registration returns the new user object.",
        "400 Bad Request": "400 indicates client validation errors, but this request succeeded.",
      },
    },
    {
      id: "s2",
      prompt: "A client submits a login request without an email address.",
      options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
      correctAnswer: "400 Bad Request",
      explanation: "HTTP 400 Bad Request indicates that the client payload failed input validation (missing required email field).",
      wrongOptionExplanations: {
        "401 Unauthorized": "401 is for missing or invalid authentication credentials (e.g. bad password).",
        "403 Forbidden": "403 is for authenticated users who lack authorization privileges.",
        "404 Not Found": "404 is for non-existent endpoints or resources.",
      },
    },
    {
      id: "s3",
      prompt: "An unauthenticated user attempts to access a protected route GET /api/dashboard.",
      options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "500 Server Error"],
      correctAnswer: "401 Unauthorized",
      explanation: "HTTP 401 Unauthorized means the request lacks valid authentication credentials (e.g. missing HTTP-only JWT token).",
      wrongOptionExplanations: {
        "400 Bad Request": "The request format is valid; the user is missing authentication.",
        "403 Forbidden": "403 implies the server knows who the user is, but they lack permission.",
        "500 Server Error": "Unauthenticated access is expected client behavior, not a server crash.",
      },
    },
    {
      id: "s4",
      prompt: "A user tries to register with an email address that already exists in the database.",
      options: ["400 Bad Request", "401 Unauthorized", "409 Conflict", "422 Unprocessable Entity"],
      correctAnswer: "409 Conflict",
      explanation: "HTTP 409 Conflict indicates a state conflict with the target resource (unique index collision on duplicate email).",
      wrongOptionExplanations: {
        "400 Bad Request": "409 Conflict specifically targets duplicate database constraint violations.",
        "401 Unauthorized": "Registration does not require existing credentials.",
        "422 Unprocessable Entity": "422 is for semantic errors, whereas email uniqueness violates database state constraints.",
      },
    },
    {
      id: "s5",
      prompt: "A client sends a DELETE /api/bookmarks/123 request. The server deletes the record and returns an empty body.",
      options: ["200 OK", "201 Created", "204 No Content", "304 Not Modified"],
      correctAnswer: "204 No Content",
      explanation: "HTTP 204 No Content indicates that the request succeeded and the server intentionally returns no message body.",
      wrongOptionExplanations: {
        "200 OK": "200 is used when returning data in the response body.",
        "201 Created": "No new resource was created; a record was deleted.",
        "304 Not Modified": "304 is for HTTP caching.",
      },
    },
  ],

  "api-flow": [
    {
      id: "s1",
      prompt: "Arrange the 6 primary layers of an API request lifecycle in correct execution order.",
      options: ["Client", "Route Matcher", "Authentication Middleware", "Controller", "Service / Database", "JSON Response"],
      correctAnswer: ["Client", "Route Matcher", "Authentication Middleware", "Controller", "Service / Database", "JSON Response"],
      explanation: "Requests start at the HTTP Client, get matched by Route handlers, pass through Auth Middleware, get processed by Controllers, interact with the Database, and return a JSON Response.",
    },
    {
      id: "s2",
      prompt: "Where should input schema validation (Zod) execute in the request pipeline?",
      options: ["Before Authentication", "After Auth Middleware, Before Controller Logic", "Inside Database Query", "After Controller Response"],
      correctAnswer: "After Auth Middleware, Before Controller Logic",
      explanation: "Input validation must execute after identity verification but before expensive database or controller operations.",
    },
    {
      id: "s3",
      prompt: "Which layer is responsible for converting raw Mongoose documents into DTO HTTP response payloads?",
      options: ["Express Router", "Controller Layer", "Node Event Loop", "Reverse Proxy"],
      correctAnswer: "Controller Layer",
      explanation: "The Controller layer coordinates business logic, formats DTO responses, and dispatches HTTP status codes.",
    },
    {
      id: "s4",
      prompt: "When an unhandled exception occurs inside a controller async handler, where should it be caught?",
      options: ["Global Centralized Error Middleware", "HTTP Client", "Database Index", "Reverse Proxy"],
      correctAnswer: "Global Centralized Error Middleware",
      explanation: "Express centralized error middleware (`(err, req, res, next)`) catches uncaught exceptions and prevents server crashes.",
    },
  ],

  "route-matcher": [
    {
      id: "s1",
      prompt: "Which HTTP verb and path signature should be used to fetch paginated courses?",
      options: ["GET /api/courses", "POST /api/courses", "PUT /api/courses", "DELETE /api/courses"],
      correctAnswer: "GET /api/courses",
      explanation: "GET /api/courses is idempotent and standard for retrieving catalog collections.",
    },
    {
      id: "s2",
      prompt: "Which HTTP method should be used for full resource updates versus partial updates?",
      options: ["PUT for full replacement, PATCH for partial updates", "POST for full replacement, GET for partial", "DELETE for full, PUT for partial", "PATCH for full, PUT for partial"],
      correctAnswer: "PUT for full replacement, PATCH for partial updates",
      explanation: "HTTP PUT replaces the target resource entirely, while PATCH applies partial modifications.",
    },
    {
      id: "s3",
      prompt: "How should a route parameter for retrieving a specific lesson by slug be defined in Express?",
      options: ["GET /api/lessons/:slug", "GET /api/lessons?slug=", "POST /api/lessons/slug", "GET /api/lessons/*"],
      correctAnswer: "GET /api/lessons/:slug",
      explanation: ":slug creates a named URL parameter accessible via `req.params.slug`.",
    },
    {
      id: "s4",
      prompt: "Which endpoint is correctly formatted to submit code for challenge evaluation?",
      options: ["POST /api/challenges/submit", "GET /api/challenges/submit", "DELETE /api/challenges/submit", "PUT /api/challenges/submit"],
      correctAnswer: "POST /api/challenges/submit",
      explanation: "POST is used for non-idempotent operations that submit payloads for server-side evaluation.",
    },
    {
      id: "s5",
      prompt: "Which route pattern safely removes a user's bookmark by lesson ID?",
      options: ["DELETE /api/bookmarks/:lessonId", "GET /api/bookmarks/delete", "POST /api/bookmarks/remove", "PUT /api/bookmarks/:lessonId"],
      correctAnswer: "DELETE /api/bookmarks/:lessonId",
      explanation: "DELETE with resource identifier path parameter follows RESTful resource removal conventions.",
    },
  ],

  "middleware-maze": [
    {
      id: "s1",
      prompt: "Order the Express middleware pipeline for POST /api/notes correctly.",
      options: ["requestLogger", "authenticateToken", "validate(NoteSchema)", "createNoteController", "errorHandler"],
      correctAnswer: ["requestLogger", "authenticateToken", "validate(NoteSchema)", "createNoteController", "errorHandler"],
      explanation: "Logging runs first, followed by authentication, Zod input validation, the controller handler, and error middleware.",
    },
    {
      id: "s2",
      prompt: "Why is placing input validation middleware AFTER the controller handler invalid?",
      options: ["The response has already been sent to the client", "Validation requires database connection", "Zod does not support post-middleware", "Express forbids error functions"],
      correctAnswer: "The response has already been sent to the client",
      explanation: "Once a controller calls `res.json()`, the response headers are sent, so subsequent validation middleware cannot execute.",
    },
    {
      id: "s3",
      prompt: "What must every Express non-error middleware call to pass control to the next handler?",
      options: ["next()", "continue()", "res.send()", "return true"],
      correctAnswer: "next()",
      explanation: "Calling `next()` signals Express to execute the next middleware in the stack pipeline.",
    },
    {
      id: "s4",
      prompt: "How many parameters must an Express centralized error handling middleware have?",
      options: ["4 parameters: (err, req, res, next)", "2 parameters: (req, res)", "3 parameters: (req, res, next)", "1 parameter: (err)"],
      correctAnswer: "4 parameters: (err, req, res, next)",
      explanation: "Express identifies error middleware specifically by checking for 4 parameters `(err, req, res, next)`.",
    },
  ],

  "database-puzzle": [
    {
      id: "s1",
      prompt: "Which Mongoose call safely finds a single user document by normalized email address?",
      options: ["User.findOne({ email: normalizedEmail })", "User.find({ email: normalizedEmail })", "User.get({ email })", "User.select(email)"],
      correctAnswer: "User.findOne({ email: normalizedEmail })",
      explanation: "`findOne()` returns a single document matching the query criteria or null if not found.",
    },
    {
      id: "s2",
      prompt: "Which query updates a progress document and returns the newly updated object?",
      options: ["Progress.findOneAndUpdate(query, update, { returnDocument: 'after' })", "Progress.update(query, update)", "Progress.save(update)", "Progress.replaceOne(query)"],
      correctAnswer: "Progress.findOneAndUpdate(query, update, { returnDocument: 'after' })",
      explanation: "`returnDocument: 'after'` (or `{ new: true }`) ensures Mongoose returns the updated document instead of the original.",
    },
    {
      id: "s3",
      prompt: "What method converts a Mongoose document query into a lightweight plain JavaScript object for fast read performance?",
      options: [".lean()", ".toPlain()", ".serialize()", ".raw()"],
      correctAnswer: ".lean()",
      explanation: "Calling `.lean()` skips Mongoose document hydration, dramatically improving query performance for read operations.",
    },
    {
      id: "s4",
      prompt: "Which MongoDB operator applies partial document field updates without overwriting unmentioned properties?",
      options: ["$set", "$push", "$replace", "$update"],
      correctAnswer: "$set",
      explanation: "The `$set` operator replaces only specified fields, preserving the rest of the document.",
    },
    {
      id: "s5",
      prompt: "How do you enforce unique email addresses at the MongoDB collection index layer in Mongoose?",
      options: ["email: { type: String, unique: true }", "email: { type: String, primary: true }", "email: { type: String, key: true }", "email: { type: String, distinct: true }"],
      correctAnswer: "email: { type: String, unique: true }",
      explanation: "`unique: true` creates a unique index in MongoDB, rejecting duplicate insertions at the database level.",
    },
  ],

  "jwt-flow": [
    {
      id: "s1",
      prompt: "Arrange the 5 steps of JWT Authentication from registration to protected route access.",
      options: ["Password Hashed with bcrypt", "JWT Signed with Secret", "Token Stored in HttpOnly Cookie", "Middleware Extract & Verify", "Route Controller Grants Access"],
      correctAnswer: ["Password Hashed with bcrypt", "JWT Signed with Secret", "Token Stored in HttpOnly Cookie", "Middleware Extract & Verify", "Route Controller Grants Access"],
      explanation: "Passwords are hashed, JWTs are signed with a secret, stored in HttpOnly cookies, verified by Edge/API middleware, and passed to route controllers.",
    },
    {
      id: "s2",
      prompt: "Why should JWT session tokens be stored in HttpOnly cookies rather than localStorage?",
      options: ["HttpOnly cookies cannot be accessed by client-side JavaScript (protects against XSS)", "Cookies hold more data than localStorage", "localStorage is deprecated", "Cookies do not require HTTPS"],
      correctAnswer: "HttpOnly cookies cannot be accessed by client-side JavaScript (protects against XSS)",
      explanation: "HttpOnly cookies prevent malicious XSS scripts from reading sensitive JWT tokens.",
    },
    {
      id: "s3",
      prompt: "What are the 3 component parts of a JSON Web Token?",
      options: ["Header, Payload, Signature", "User, Password, Salt", "Key, Value, Timestamp", "Cookie, Session, Token"],
      correctAnswer: "Header, Payload, Signature",
      explanation: "A JWT consists of 3 dot-separated Base64URL encoded strings: Header, Payload, and Signature.",
    },
    {
      id: "s4",
      prompt: "What happens when an incoming JWT payload contains `exp: 1600000000` (a past timestamp)?",
      options: ["Token validation fails as expired", "Token is automatically renewed", "Server ignores expiration", "User receives HTTP 200"],
      correctAnswer: "Token validation fails as expired",
      explanation: "When `Date.now() >= exp * 1000`, cryptographic verification rejects the token as expired.",
    },
    {
      id: "s5",
      prompt: "What security flag ensures cookies are only transmitted over encrypted HTTPS connections?",
      options: ["secure: true", "httpOnly: true", "sameSite: 'strict'", "path: '/'"],
      correctAnswer: "secure: true",
      explanation: "Setting `secure: true` guarantees the browser only sends the cookie over HTTPS channels.",
    },
  ],

  "bug-hunter": [
    {
      id: "s1",
      prompt: "Locate the bug in this async controller function:\n\nconst user = User.findOne({ email });\nif (!user) return res.status(404).json({ error: 'Not found' });",
      options: ["Missing `await` keyword before `User.findOne`", "Missing `new` operator", "Incorrect status code 404", "Invalid JSON syntax"],
      correctAnswer: "Missing `await` keyword before `User.findOne`",
      explanation: "Without `await`, `user` is an unfulfilled Promise object (truthy), causing the `if (!user)` check to always fail!",
      codeSnippet: "async function getUser(req, res) {\n  const user = User.findOne({ email: req.query.email }); // 🐛 BUG HERE\n  if (!user) return res.status(404).json({ error: 'Not found' });\n  res.json(user);\n}",
    },
    {
      id: "s2",
      prompt: "Locate the vulnerability in this code:\n\nres.json({ token, user: userDoc });",
      options: ["The password field must be removed from `userDoc` before returning JSON", "Missing status code 201", "Invalid token name", "JSON requires arrays"],
      correctAnswer: "The password field must be removed from `userDoc` before returning JSON",
      explanation: "Returning raw user documents exposes bcrypt password hashes to the client!",
      codeSnippet: "const user = await User.create({ email, password: hashedPassword });\nres.json({ user }); // 🐛 EXPOSES HASHED PASSWORD",
    },
    {
      id: "s3",
      prompt: "Identify why this MongoDB query fails to update the user name:\n\nUser.updateOne({ _id }, { name: 'Alex' })",
      options: ["Missing `$set` operator in update document", "Missing `await`", "Wrong collection name", "Invalid ID format"],
      correctAnswer: "Missing `$set` operator in update document",
      explanation: "In MongoDB driver calls, omitting `$set` can overwrite the entire document structure.",
      codeSnippet: "await db.collection('users').updateOne({ _id }, { name: 'Alex' }); // 🐛 OVERWRITES DOCUMENT",
    },
    {
      id: "s4",
      prompt: "Spot the error in this Express error-handling middleware:\n\napp.use((req, res, next) => { res.status(500).json({ error: err.message }); })",
      options: ["Missing `err` parameter as the first argument", "Missing return statement", "Wrong HTTP 500 status", "Express forbids error functions"],
      correctAnswer: "Missing `err` parameter as the first argument",
      explanation: "Express error handlers MUST declare 4 parameters `(err, req, res, next)` to be recognized by the router.",
      codeSnippet: "app.use((req, res, next) => { // 🐛 MISSING 'err' PARAMETER\n  res.status(500).json({ error: 'Server Error' });\n});",
    },
    {
      id: "s5",
      prompt: "Identify the bug causing infinite requests in React useEffect:\n\nuseEffect(() => { fetchUser(); }, [user]);",
      options: ["`user` dependency changes on every fetch, causing an infinite loop", "Missing dependency array", "fetchUser is async", "useEffect is deprecated"],
      correctAnswer: "`user` dependency changes on every fetch, causing an infinite loop",
      explanation: "Setting `user` inside `fetchUser()` triggers `useEffect` again, creating an unconstrained re-render loop.",
      codeSnippet: "useEffect(() => {\n  fetchUser().then(u => setUser(u)); // 🐛 INFINITE RENDER LOOP\n}, [user]);",
    },
  ],

  "security-defender": [
    {
      id: "s1",
      prompt: "An API endpoint POST /api/auth/login allows unlimited login attempts per second. What attack is it vulnerable to?",
      options: ["Brute-Force Credential Stuffing Attack", "XSS Attack", "CSRF Attack", "Buffer Overflow"],
      correctAnswer: "Brute-Force Credential Stuffing Attack",
      explanation: "Without rate limiting, attackers can run automated scripts testing millions of password combinations per minute.",
    },
    {
      id: "s2",
      prompt: "How do you defend a Node.js endpoint against NoSQL query object injection (`req.body = { email: { $ne: null } }`)?",
      options: ["Sanitize inputs to ensure parameters are strict strings", "Disable MongoDB indexing", "Use GET requests only", "Encrypt database fields"],
      correctAnswer: "Sanitize inputs to ensure parameters are strict strings",
      explanation: "Sanitizing input parameters (`typeof input === 'string'`) prevents attackers from passing raw query objects with `$ne` or `$gt` operators.",
    },
    {
      id: "s3",
      prompt: "A developer logs `console.log('Login payload:', req.body)` in production. What security vulnerability does this introduce?",
      options: ["Sensitive credential logging in server logs", "NoSQL injection", "XSS execution", "CORS violation"],
      correctAnswer: "Sensitive credential logging in server logs",
      explanation: "Logging raw request bodies writes plaintext passwords to log files and monitoring aggregators.",
    },
    {
      id: "s4",
      prompt: "Which security header prevents browsers from MIME-sniffing response content types?",
      options: ["X-Content-Type-Options: nosniff", "Strict-Transport-Security", "X-Frame-Options: DENY", "Access-Control-Allow-Origin"],
      correctAnswer: "X-Content-Type-Options: nosniff",
      explanation: "`nosniff` prevents browsers from interpreting non-executable MIME types as executable JavaScript.",
    },
    {
      id: "s5",
      prompt: "What is the primary defense against CSRF attacks when using cookies for session authentication?",
      options: ["SameSite: 'lax' or 'strict' cookie attributes", "Using basic auth headers", "Disabling cookies", "Increasing JWT key length"],
      correctAnswer: "SameSite: 'lax' or 'strict' cookie attributes",
      explanation: "The `SameSite` cookie attribute restricts browsers from sending cookies on cross-site requests.",
    },
  ],
};

export function normalizeGameId(id: string): string {
  if (!id) return "";
  return id
    .toLowerCase()
    .trim()
    .replace(/_/g, "-")
    .replace(/-game$/, "");
}

export function getGameById(gameId: string): GameDefinition | undefined {
  const norm = normalizeGameId(gameId);
  return GAME_DEFINITIONS.find((g) => {
    const gNorm = normalizeGameId(g.id);
    const gSlugNorm = normalizeGameId(g.slug);
    return gNorm === norm || gSlugNorm === norm || g.id === gameId || g.slug === gameId;
  });
}

export function getGameScenarios(gameId: string): GameScenario[] {
  const norm = normalizeGameId(gameId);
  return GAME_SCENARIOS[norm] || GAME_SCENARIOS[gameId] || GAME_SCENARIOS["http-status"] || [];
}

export function getGameForModule(moduleId: string): GameDefinition | undefined {
  return GAME_DEFINITIONS.find((g) => g.moduleId === moduleId);
}
