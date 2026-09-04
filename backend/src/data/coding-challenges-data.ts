export interface ChallengeSeedItem {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  language: string;
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
  // 1. JavaScript Fundamentals
  {
    title: "Create User Object",
    slug: "create-user-object",
    category: "JavaScript Fundamentals",
    difficulty: "easy",
    language: "javascript",
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
        testCode: `
const u = createUser("Alice", "alice@example.com");
if (!u || u.name !== "Alice" || u.email !== "alice@example.com") {
  throw new Error("Expected name 'Alice' and email 'alice@example.com'");
}
`,
        expectedOutput: true,
      },
      {
        name: "Contains valid createdAt ISO string",
        description: "Checks createdAt timestamp exists and is ISO format",
        testCode: `
const u = createUser("Bob", "bob@example.com");
if (!u.createdAt || isNaN(Date.parse(u.createdAt))) {
  throw new Error("Expected valid createdAt ISO timestamp");
}
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Lowercases and trims email string",
        testCode: `
const u = createUser(" Charlie ", "  Charlie@Domain.COM  ");
if (u.email !== "charlie@domain.com") {
  throw new Error("Email must be trimmed and lowercased");
}
`,
      },
    ],
  },

  // 2. Node.js
  {
    title: "Async User Fetch",
    slug: "async-user-fetch",
    category: "Node.js",
    difficulty: "medium",
    language: "javascript",
    xpReward: 100,
    estimatedMinutes: 15,
    order: 2,
    isPublished: true,
    description: "Write an asynchronous function `getUser(id, db)` that retrieves a record from a simulated async database adapter, returning `{ success: true, user }` on success and `{ success: false, error: 'User not found' }` if missing.",
    instructions: "Implement `async function getUser(id, db)`.\n- `db.findUserById(id)` returns a Promise resolving to a user or `null`.\n- Handle errors safely without crashing.",
    starterCode: `async function getUser(id, db) {
  // Write your code here
}`,
    solutionTemplate: `async function getUser(id, db) {
  try {
    const user = await db.findUserById(id);
    if (!user) {
      return { success: false, error: "User not found" };
    }
    return { success: true, user };
  } catch (err) {
    return { success: false, error: err.message || "Database error" };
  }
}`,
    visibleTests: [
      {
        name: "Returns success and user when found",
        description: "Resolves user object successfully",
        testCode: `
const mockDb = { findUserById: async (id) => ({ id, name: "Ada" }) };
return getUser("1", mockDb).then(res => {
  if (!res || !res.success || res.user.name !== "Ada") {
    throw new Error("Expected { success: true, user: { name: 'Ada' } }");
  }
});
`,
        expectedOutput: true,
      },
      {
        name: "Returns error when user is null",
        description: "Handles missing user gracefully",
        testCode: `
const mockDb = { findUserById: async (id) => null };
return getUser("99", mockDb).then(res => {
  if (!res || res.success !== false || res.error !== "User not found") {
    throw new Error("Expected { success: false, error: 'User not found' }");
  }
});
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Handles database promise rejection cleanly",
        testCode: `
const failingDb = { findUserById: async () => { throw new Error("Connection failed"); } };
return getUser("1", failingDb).then(res => {
  if (!res || res.success !== false) {
    throw new Error("Expected rejected database call to return success: false");
  }
});
`,
      },
    ],
  },

  // 3. Express.js
  {
    title: "Create Hello API Response",
    slug: "create-hello-api-response",
    category: "Express.js",
    difficulty: "easy",
    language: "javascript",
    xpReward: 50,
    estimatedMinutes: 10,
    order: 3,
    isPublished: true,
    description: "Build a standard Express route handler function that returns HTTP status 200 and a JSON payload `{ message: 'Hello Backend' }`.",
    instructions: "Implement `function helloHandler(req, res)`.\n- Call `res.status(200)`.\n- Call `.json({ message: 'Hello Backend' })`.",
    starterCode: `function helloHandler(req, res) {
  // Write your code here
}`,
    solutionTemplate: `function helloHandler(req, res) {
  return res.status(200).json({ message: "Hello Backend" });
}`,
    visibleTests: [
      {
        name: "Sets HTTP status code 200",
        description: "Verifies res.status(200) was called",
        testCode: `
let capturedStatus = null;
const res = {
  status(code) { capturedStatus = code; return this; },
  json(data) { this.data = data; return this; }
};
helloHandler({}, res);
if (capturedStatus !== 200) {
  throw new Error("Expected status 200, got: " + capturedStatus);
}
`,
        expectedOutput: true,
      },
      {
        name: "Returns JSON with message 'Hello Backend'",
        description: "Verifies payload structure",
        testCode: `
const res = {
  status(code) { return this; },
  json(data) { this.data = data; return this; }
};
helloHandler({}, res);
if (!res.data || res.data.message !== "Hello Backend") {
  throw new Error("Expected { message: 'Hello Backend' }");
}
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Returns chained response object",
        testCode: `
const res = {
  status(code) { return this; },
  json(data) { return { sent: true, data }; }
};
const ret = helloHandler({}, res);
if (!ret || !ret.sent) {
  throw new Error("Handler should return the res object or send chain");
}
`,
      },
    ],
  },

  // 4. REST APIs
  {
    title: "Create POST Route",
    slug: "create-post-route",
    category: "REST APIs",
    difficulty: "medium",
    language: "javascript",
    xpReward: 100,
    estimatedMinutes: 15,
    order: 4,
    isPublished: true,
    description: "Write an Express route controller `createUserHandler(req, res)` that validates `req.body.name` and `req.body.email`. If missing, returns 400 Bad Request with `{ error: 'Missing required fields' }`. If valid, returns 201 Created with `{ success: true, user: { name, email } }`.",
    instructions: "Implement `function createUserHandler(req, res)`.\n- Check if `req.body?.name` and `req.body?.email` exist.\n- If invalid: status 400 with `{ error: 'Missing required fields' }`.\n- If valid: status 201 with `{ success: true, user: { name, email } }`.",
    starterCode: `function createUserHandler(req, res) {
  // Write your code here
}`,
    solutionTemplate: `function createUserHandler(req, res) {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  return res.status(201).json({
    success: true,
    user: { name, email }
  });
}`,
    visibleTests: [
      {
        name: "Returns 400 if name or email is missing",
        description: "Validates input payload",
        testCode: `
let status = null; let body = null;
const res = {
  status(s) { status = s; return this; },
  json(b) { body = b; return this; }
};
createUserHandler({ body: { name: "John" } }, res);
if (status !== 400 || !body.error) {
  throw new Error("Expected 400 Bad Request when email is missing");
}
`,
        expectedOutput: true,
      },
      {
        name: "Returns 201 Created with user when valid",
        description: "Handles valid user creation",
        testCode: `
let status = null; let body = null;
const res = {
  status(s) { status = s; return this; },
  json(b) { body = b; return this; }
};
createUserHandler({ body: { name: "Alice", email: "alice@test.com" } }, res);
if (status !== 201 || !body.success || body.user.name !== "Alice") {
  throw new Error("Expected 201 Created with user object");
}
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Handles empty or undefined req.body safely without crashing",
        testCode: `
let status = null;
const res = { status(s) { status = s; return this; }, json() { return this; } };
createUserHandler({}, res);
if (status !== 400) throw new Error("Expected 400 for undefined req.body");
`,
      },
    ],
  },

  // 5. HTTP Methods
  {
    title: "HTTP Status Challenge",
    slug: "http-status-challenge",
    category: "HTTP Methods",
    difficulty: "easy",
    language: "javascript",
    xpReward: 50,
    estimatedMinutes: 10,
    order: 5,
    isPublished: true,
    description: "Build a helper function `getStatusCode(action)` that maps common REST actions ('create', 'read', 'delete', 'not_found', 'unauthorized') to their canonical HTTP status numbers.",
    instructions: "Map actions:\n- 'create' -> 201\n- 'read' -> 200\n- 'delete' -> 204\n- 'not_found' -> 404\n- 'unauthorized' -> 401\n- default -> 400",
    starterCode: `function getStatusCode(action) {
  // Write your code here
}`,
    solutionTemplate: `function getStatusCode(action) {
  switch (String(action).toLowerCase()) {
    case "create": return 201;
    case "read": return 200;
    case "delete": return 204;
    case "not_found": return 404;
    case "unauthorized": return 401;
    default: return 400;
  }
}`,
    visibleTests: [
      {
        name: "Maps create to 201 and read to 200",
        description: "Tests 200 and 201 mappings",
        testCode: `
if (getStatusCode("create") !== 201 || getStatusCode("read") !== 200) {
  throw new Error("Expected create->201, read->200");
}
`,
        expectedOutput: true,
      },
      {
        name: "Maps delete to 204 and not_found to 404",
        description: "Tests 204 and 404 mappings",
        testCode: `
if (getStatusCode("delete") !== 204 || getStatusCode("not_found") !== 404) {
  throw new Error("Expected delete->204, not_found->404");
}
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Maps unauthorized to 401 and unknown action to 400",
        testCode: `
if (getStatusCode("unauthorized") !== 401 || getStatusCode("unknown_action") !== 400) {
  throw new Error("Expected unauthorized->401, fallback->400");
}
`,
      },
    ],
  },

  // 6. HTTP Status Codes
  {
    title: "HTTP Status Handler",
    slug: "http-status-handler",
    category: "HTTP Status Codes",
    difficulty: "easy",
    language: "javascript",
    xpReward: 50,
    estimatedMinutes: 10,
    order: 6,
    isPublished: true,
    description: "Write an Express handler `sendResourceResponse(res, resource)` that responds with 200 OK if resource exists, and 404 Not Found with `{ error: 'Not Found' }` if resource is null or undefined.",
    instructions: "Implement `function sendResourceResponse(res, resource)`.\n- If resource is present: `res.status(200).json(resource)`\n- If resource is null/undefined: `res.status(404).json({ error: 'Not Found' })`.",
    starterCode: `function sendResourceResponse(res, resource) {
  // Write your code here
}`,
    solutionTemplate: `function sendResourceResponse(res, resource) {
  if (resource !== null && resource !== undefined) {
    return res.status(200).json(resource);
  }
  return res.status(404).json({ error: "Not Found" });
}`,
    visibleTests: [
      {
        name: "Returns 200 with resource when present",
        description: "Tests present resource",
        testCode: `
let status = null; let payload = null;
const res = { status(s) { status = s; return this; }, json(p) { payload = p; return this; } };
sendResourceResponse(res, { id: 10, title: "Node" });
if (status !== 200 || payload.title !== "Node") {
  throw new Error("Expected 200 OK with resource data");
}
`,
        expectedOutput: true,
      },
      {
        name: "Returns 404 when resource is null",
        description: "Tests null resource",
        testCode: `
let status = null;
const res = { status(s) { status = s; return this; }, json() { return this; } };
sendResourceResponse(res, null);
if (status !== 404) {
  throw new Error("Expected 404 Not Found for null resource");
}
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Returns 404 when resource is undefined",
        testCode: `
let status = null;
const res = { status(s) { status = s; return this; }, json() { return this; } };
sendResourceResponse(res, undefined);
if (status !== 404) throw new Error("Expected 404 for undefined resource");
`,
      },
    ],
  },

  // 7. Middleware
  {
    title: "Authentication Middleware",
    slug: "authentication-middleware",
    category: "Middleware",
    difficulty: "medium",
    language: "javascript",
    xpReward: 100,
    estimatedMinutes: 15,
    order: 7,
    isPublished: true,
    description: "Create an Express authentication middleware function `authMiddleware(req, res, next)` that inspects the `Authorization` header. If missing or doesn't start with 'Bearer ', return 401 with `{ error: 'Unauthorized' }`. If present, extract the token and attach it to `req.token`, then call `next()`.",
    instructions: "Implement `function authMiddleware(req, res, next)`.\n- Check `req.headers?.authorization`.\n- Must start with `'Bearer '`.\n- If invalid: `res.status(401).json({ error: 'Unauthorized' })`.\n- If valid: `req.token = token`, then call `next()`.",
    starterCode: `function authMiddleware(req, res, next) {
  // Write your code here
}`,
    solutionTemplate: `function authMiddleware(req, res, next) {
  const authHeader = req.headers && req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.token = token;
  next();
}`,
    visibleTests: [
      {
        name: "Blocks requests missing Authorization header with 401",
        description: "Rejects unauthenticated request",
        testCode: `
let status = null;
const res = { status(s) { status = s; return this; }, json() { return this; } };
let calledNext = false;
authMiddleware({ headers: {} }, res, () => { calledNext = true; });
if (status !== 401 || calledNext) {
  throw new Error("Expected 401 Unauthorized and next() should not be called");
}
`,
        expectedOutput: true,
      },
      {
        name: "Extracts token and calls next() when Bearer header is present",
        description: "Approves valid Bearer header",
        testCode: `
const req = { headers: { authorization: "Bearer my-secret-jwt" } };
let calledNext = false;
authMiddleware(req, {}, () => { calledNext = true; });
if (!calledNext || req.token !== "my-secret-jwt") {
  throw new Error("Expected req.token = 'my-secret-jwt' and next() called");
}
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Rejects non-Bearer authorization schemes like Basic auth",
        testCode: `
let status = null;
const res = { status(s) { status = s; return this; }, json() { return this; } };
authMiddleware({ headers: { authorization: "Basic dXNlcjpwYXNz" } }, res, () => {});
if (status !== 401) throw new Error("Expected 401 for non-Bearer auth scheme");
`,
      },
    ],
  },

  // 8. Routing
  {
    title: "Create GET Route",
    slug: "create-get-route",
    category: "Routing",
    difficulty: "easy",
    language: "javascript",
    xpReward: 50,
    estimatedMinutes: 10,
    order: 8,
    isPublished: true,
    description: "Write an Express route controller `getUsersHandler(req, res)` that responds with 200 OK and `{ success: true, users: [] }`.",
    instructions: "Implement `function getUsersHandler(req, res)`.\n- Return HTTP status 200.\n- Response body must be `{ success: true, users: [] }`.",
    starterCode: `function getUsersHandler(req, res) {
  // Write your code here
}`,
    solutionTemplate: `function getUsersHandler(req, res) {
  return res.status(200).json({
    success: true,
    users: []
  });
}`,
    visibleTests: [
      {
        name: "Returns 200 status code",
        description: "Validates 200 status",
        testCode: `
let status = null;
const res = { status(s) { status = s; return this; }, json() { return this; } };
getUsersHandler({}, res);
if (status !== 200) throw new Error("Expected status 200");
`,
        expectedOutput: true,
      },
      {
        name: "Returns success: true and users array",
        description: "Validates response structure",
        testCode: `
let body = null;
const res = { status() { return this; }, json(b) { body = b; return this; } };
getUsersHandler({}, res);
if (!body || !body.success || !Array.isArray(body.users)) {
  throw new Error("Expected { success: true, users: [] }");
}
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Returns users as an empty array",
        testCode: `
let body = null;
const res = { status() { return this; }, json(b) { body = b; return this; } };
getUsersHandler({}, res);
if (body.users.length !== 0) throw new Error("Expected users to be empty array");
`,
      },
    ],
  },

  // 9. Authentication
  {
    title: "Build Login Controller",
    slug: "build-login-controller",
    category: "Authentication",
    difficulty: "hard",
    language: "javascript",
    xpReward: 200,
    estimatedMinutes: 25,
    order: 9,
    isPublished: true,
    description: "Implement a complete login controller function `loginController(req, res, db, authHelper)` that validates input, performs database lookup, verifies password hash, and issues a JWT token.",
    instructions: "Implement `async function loginController(req, res, db, authHelper)`:\n1. Check `req.body.email` and `req.body.password`. If missing -> 400 `{ error: 'Email and password required' }`.\n2. Find user in db `await db.findUser(email)`. If not found -> 401 `{ error: 'Invalid credentials' }`.\n3. Verify password `await authHelper.compare(password, user.passwordHash)`. If false -> 401 `{ error: 'Invalid credentials' }`.\n4. If valid, create token `authHelper.signToken({ userId: user.id })` and return 200 with `{ success: true, token, user: { id: user.id, email: user.email } }`.",
    starterCode: `async function loginController(req, res, db, authHelper) {
  // Write your code here
}`,
    solutionTemplate: `async function loginController(req, res, db, authHelper) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  const user = await db.findUser(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const valid = await authHelper.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = authHelper.signToken({ userId: user.id });
  return res.status(200).json({
    success: true,
    token,
    user: { id: user.id, email: user.email }
  });
}`,
    visibleTests: [
      {
        name: "Returns 400 if credentials are missing",
        description: "Validates body fields",
        testCode: `
let status = null;
const res = { status(s) { status = s; return this; }, json() { return this; } };
return loginController({ body: {} }, res, {}, {}).then(() => {
  if (status !== 400) throw new Error("Expected status 400 for missing credentials");
});
`,
        expectedOutput: true,
      },
      {
        name: "Returns 401 if password check fails",
        description: "Rejects incorrect password",
        testCode: `
let status = null;
const res = { status(s) { status = s; return this; }, json() { return this; } };
const db = { findUser: async () => ({ id: "1", email: "a@b.com", passwordHash: "hash" }) };
const auth = { compare: async () => false };
return loginController({ body: { email: "a@b.com", password: "wrong" } }, res, db, auth).then(() => {
  if (status !== 401) throw new Error("Expected status 401 for wrong password");
});
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Returns 200 with token upon successful authentication",
        testCode: `
let status = null; let body = null;
const res = { status(s) { status = s; return this; }, json(b) { body = b; return this; } };
const db = { findUser: async () => ({ id: "usr_100", email: "a@b.com", passwordHash: "hash" }) };
const auth = { compare: async () => true, signToken: () => "signed-jwt-token" };
return loginController({ body: { email: "a@b.com", password: "correct" } }, res, db, auth).then(() => {
  if (status !== 200 || body.token !== "signed-jwt-token" || body.user.id !== "usr_100") {
    throw new Error("Expected 200 with valid token and user payload");
  }
});
`,
      },
    ],
  },

  // 10. JWT
  {
    title: "JWT Verification",
    slug: "jwt-verification",
    category: "JWT",
    difficulty: "medium",
    language: "javascript",
    xpReward: 100,
    estimatedMinutes: 15,
    order: 10,
    isPublished: true,
    description: "Write a verification helper `verifyAuthToken(token, jwtLib, secret)` that returns `{ valid: true, payload }` if the signature is valid and not expired, or `{ valid: false, error: 'Invalid token' }` if verification throws.",
    instructions: "Implement `function verifyAuthToken(token, jwtLib, secret)`.\n- Call `jwtLib.verify(token, secret)`.\n- If successful: return `{ valid: true, payload }`.\n- If it throws: return `{ valid: false, error: 'Invalid token' }`.",
    starterCode: `function verifyAuthToken(token, jwtLib, secret) {
  // Write your code here
}`,
    solutionTemplate: `function verifyAuthToken(token, jwtLib, secret) {
  try {
    const payload = jwtLib.verify(token, secret);
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: "Invalid token" };
  }
}`,
    visibleTests: [
      {
        name: "Returns valid: true and payload for valid token",
        description: "Checks successful verification",
        testCode: `
const mockJwt = { verify: () => ({ userId: "123", role: "admin" }) };
const res = verifyAuthToken("valid.jwt", mockJwt, "secret");
if (!res.valid || res.payload.userId !== "123") {
  throw new Error("Expected valid: true with payload");
}
`,
        expectedOutput: true,
      },
      {
        name: "Returns valid: false when verify throws",
        description: "Catches token verification errors",
        testCode: `
const mockJwt = { verify: () => { throw new Error("jwt expired"); } };
const res = verifyAuthToken("expired.jwt", mockJwt, "secret");
if (res.valid !== false || res.error !== "Invalid token") {
  throw new Error("Expected valid: false with error 'Invalid token'");
}
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Passes the exact secret parameter to jwtLib.verify",
        testCode: `
let capturedSecret = null;
const mockJwt = { verify: (t, s) => { capturedSecret = s; return {}; } };
verifyAuthToken("tok", mockJwt, "custom-key-99");
if (capturedSecret !== "custom-key-99") {
  throw new Error("Expected secret 'custom-key-99' passed to verify");
}
`,
      },
    ],
  },

  // 11. MongoDB
  {
    title: "MongoDB User Query",
    slug: "mongodb-user-query",
    category: "MongoDB",
    difficulty: "easy",
    language: "javascript",
    xpReward: 50,
    estimatedMinutes: 10,
    order: 11,
    isPublished: true,
    description: "Write an async function `findUserByEmail(usersCollection, email)` that sanitizes the email (trims and lowercases) and executes `usersCollection.findOne({ email: cleanEmail })`.",
    instructions: "Implement `async function findUserByEmail(usersCollection, email)`.\n- Trim and lowercase the email input.\n- Call `await usersCollection.findOne({ email: cleanEmail })`.\n- Return the result.",
    starterCode: `async function findUserByEmail(usersCollection, email) {
  // Write your code here
}`,
    solutionTemplate: `async function findUserByEmail(usersCollection, email) {
  if (!email || typeof email !== "string") return null;
  const cleanEmail = email.trim().toLowerCase();
  return await usersCollection.findOne({ email: cleanEmail });
}`,
    visibleTests: [
      {
        name: "Queries collection with normalized email",
        description: "Verifies findOne query parameter",
        testCode: `
let capturedQuery = null;
const coll = {
  findOne: async (q) => { capturedQuery = q; return { _id: "1", email: q.email }; }
};
return findUserByEmail(coll, "  Alex@Example.COM  ").then(u => {
  if (!capturedQuery || capturedQuery.email !== "alex@example.com") {
    throw new Error("Expected findOne query with 'alex@example.com'");
  }
});
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Safely returns null if email is empty or not a string",
        testCode: `
return findUserByEmail({}, null).then(u => {
  if (u !== null) throw new Error("Expected null for empty email");
});
`,
      },
    ],
  },

  // 12. Mongoose
  {
    title: "Mongoose Schema",
    slug: "mongoose-schema",
    category: "Mongoose",
    difficulty: "medium",
    language: "javascript",
    xpReward: 100,
    estimatedMinutes: 15,
    order: 12,
    isPublished: true,
    description: "Build a function `defineUserSchemaDefinition()` that returns a Mongoose schema definition object containing `name`, `email`, and `password` with appropriate validation rules (required, trim, lowercase).",
    instructions: "Return an object with:\n- `name`: `{ type: String, required: true, trim: true }`\n- `email`: `{ type: String, required: true, unique: true, lowercase: true, trim: true }`\n- `password`: `{ type: String, required: true, minlength: 8 }`.",
    starterCode: `function defineUserSchemaDefinition() {
  // Write your code here
}`,
    solutionTemplate: `function defineUserSchemaDefinition() {
  return {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 }
  };
}`,
    visibleTests: [
      {
        name: "Schema contains name and email with required: true",
        description: "Checks required fields",
        testCode: `
const def = defineUserSchemaDefinition();
if (!def.name?.required || !def.email?.required) {
  throw new Error("name and email must be required: true");
}
`,
        expectedOutput: true,
      },
      {
        name: "Email has unique: true and lowercase: true",
        description: "Checks email uniqueness and normalization",
        testCode: `
const def = defineUserSchemaDefinition();
if (!def.email?.unique || !def.email?.lowercase) {
  throw new Error("email must have unique: true and lowercase: true");
}
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Password has minlength set to at least 8",
        testCode: `
const def = defineUserSchemaDefinition();
if (!def.password || def.password.minlength < 8) {
  throw new Error("password must require minlength >= 8");
}
`,
      },
    ],
  },

  // 13. Error Handling
  {
    title: "Error Handling Middleware",
    slug: "error-handling-middleware",
    category: "Error Handling",
    difficulty: "medium",
    language: "javascript",
    xpReward: 100,
    estimatedMinutes: 15,
    order: 13,
    isPublished: true,
    description: "Create a 4-parameter Express error handling middleware function `errorHandler(err, req, res, next)` that responds with `err.status || 500` and `{ success: false, error: err.message || 'Internal Server Error' }`.",
    instructions: "Implement `function errorHandler(err, req, res, next)`:\n- Function must accept 4 arguments `(err, req, res, next)`.\n- Status code: `err.status || err.statusCode || 500`.\n- JSON body: `{ success: false, error: err.message || 'Internal Server Error' }`.",
    starterCode: `function errorHandler(err, req, res, next) {
  // Write your code here
}`,
    solutionTemplate: `function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    error: message
  });
}`,
    visibleTests: [
      {
        name: "Responds with custom error status and message",
        description: "Handles custom application error",
        testCode: `
let status = null; let body = null;
const res = { status(s) { status = s; return this; }, json(b) { body = b; return this; } };
const customErr = { status: 404, message: "Resource not found" };
errorHandler(customErr, {}, res, () => {});
if (status !== 404 || body.error !== "Resource not found" || body.success !== false) {
  throw new Error("Expected status 404 with error message");
}
`,
        expectedOutput: true,
      },
      {
        name: "Defaults to status 500 when status is missing",
        description: "Handles generic unhandled errors",
        testCode: `
let status = null; let body = null;
const res = { status(s) { status = s; return this; }, json(b) { body = b; return this; } };
errorHandler(new Error("Database crash"), {}, res, () => {});
if (status !== 500 || body.error !== "Database crash") {
  throw new Error("Expected status 500 with 'Database crash'");
}
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Provides fallback message when err.message is empty",
        testCode: `
let body = null;
const res = { status() { return this; }, json(b) { body = b; return this; } };
errorHandler({}, {}, res, () => {});
if (body.error !== "Internal Server Error") {
  throw new Error("Expected 'Internal Server Error' fallback message");
}
`,
      },
    ],
  },

  // 14. Async JavaScript
  {
    title: "Async Promise Handler",
    slug: "async-promise-handler",
    category: "Async JavaScript",
    difficulty: "easy",
    language: "javascript",
    xpReward: 50,
    estimatedMinutes: 10,
    order: 14,
    isPublished: true,
    description: "Write an async wrapper function `safeAsync(promise)` that resolves any Promise into a tuple `[data, null]` on success, or `[null, error]` on rejection (the Go/Rust error-tuple style).",
    instructions: "Implement `async function safeAsync(promise)`:\n- If promise resolves with `val`: return `[val, null]`.\n- If promise rejects with `err`: return `[null, err]`.",
    starterCode: `async function safeAsync(promise) {
  // Write your code here
}`,
    solutionTemplate: `async function safeAsync(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err];
  }
}`,
    visibleTests: [
      {
        name: "Returns [data, null] on resolved promise",
        description: "Tests success resolution",
        testCode: `
return safeAsync(Promise.resolve("hello")).then(([data, err]) => {
  if (data !== "hello" || err !== null) {
    throw new Error("Expected ['hello', null]");
  }
});
`,
        expectedOutput: true,
      },
      {
        name: "Returns [null, error] on rejected promise",
        description: "Tests error capture",
        testCode: `
return safeAsync(Promise.reject(new Error("failed"))).then(([data, err]) => {
  if (data !== null || !err || err.message !== "failed") {
    throw new Error("Expected [null, Error('failed')]");
  }
});
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Handles non-promise values safely",
        testCode: `
return safeAsync(42).then(([data, err]) => {
  if (data !== 42 || err !== null) throw new Error("Expected [42, null]");
});
`,
      },
    ],
  },

  // 15. API Security
  {
    title: "Secure Password Hashing",
    slug: "secure-password-hashing",
    category: "API Security",
    difficulty: "medium",
    language: "javascript",
    xpReward: 100,
    estimatedMinutes: 15,
    order: 15,
    isPublished: true,
    description: "Implement `hashUserPassword(plainPassword, bcryptLib)` that checks if the password meets minimum security standards (at least 8 characters). If too short, throws an Error 'Password must be at least 8 characters'. Otherwise, calls `await bcryptLib.hash(plainPassword, 12)` and returns the hashed string.",
    instructions: "Implement `async function hashUserPassword(plainPassword, bcryptLib)`:\n- Check `plainPassword.length >= 8`.\n- If < 8, throw new Error('Password must be at least 8 characters').\n- Call `await bcryptLib.hash(plainPassword, 12)`.\n- Return the resulting hash.",
    starterCode: `async function hashUserPassword(plainPassword, bcryptLib) {
  // Write your code here
}`,
    solutionTemplate: `async function hashUserPassword(plainPassword, bcryptLib) {
  if (!plainPassword || typeof plainPassword !== "string" || plainPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  return await bcryptLib.hash(plainPassword, 12);
}`,
    visibleTests: [
      {
        name: "Throws error when password is under 8 characters",
        description: "Rejects short passwords",
        testCode: `
let threw = false;
return hashUserPassword("short", {}).catch(err => {
  threw = true;
  if (!err.message.includes("8 characters")) {
    throw new Error("Error message must mention 8 characters");
  }
}).then(() => {
  if (!threw) throw new Error("Expected function to throw for short password");
});
`,
        expectedOutput: true,
      },
      {
        name: "Hashes password with 12 salt rounds when valid",
        description: "Calls bcrypt with salt rounds = 12",
        testCode: `
let capturedRounds = null;
const mockBcrypt = {
  hash: async (pwd, rounds) => { capturedRounds = rounds; return "$2b$12$hashedstring"; }
};
return hashUserPassword("StrongPassword123!", mockBcrypt).then(h => {
  if (capturedRounds !== 12 || h !== "$2b$12$hashedstring") {
    throw new Error("Expected bcrypt.hash called with 12 rounds");
  }
});
`,
        expectedOutput: true,
      },
    ],
    hiddenTests: [
      {
        name: "Rejects null or empty string passwords",
        testCode: `
return hashUserPassword("", {}).then(() => {
  throw new Error("Should reject empty string");
}).catch(e => {
  if (!e.message.includes("8 characters")) throw e;
});
`,
      },
    ],
  },
];
