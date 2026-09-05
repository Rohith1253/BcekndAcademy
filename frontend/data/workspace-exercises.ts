export interface WorkspaceExercise {
  id: string;
  slug: string;
  title: string;
  category: "foundation" | "javascript" | "logic" | "async" | "nodejs" | "express" | "rest-apis" | "mongodb" | "auth";
  categoryLabel: string;
  difficulty: "Foundation" | "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  description: string;
  instructions: string[];
  expectedOutput: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  tests: {
    description: string;
    assertionFnString: string;
  }[];
  files: {
    name: string;
    language: string;
    content: string;
  }[];
}

export const WORKSPACE_EXERCISES: WorkspaceExercise[] = [
  // ─── 1. FOUNDATION LEVEL 0 EXERCISES ─────────────────────────────
  {
    id: "foundation-first-output",
    slug: "your-first-program",
    title: "Your Very First Program: Output & console.log",
    category: "foundation",
    categoryLabel: "Foundation (Level 0)",
    difficulty: "Foundation",
    estimatedMinutes: 5,
    description: "Learn how a computer sends messages to the outside world using the standard output console.",
    instructions: [
      "Use `console.log()` to print the message `'Hello, Backend Developer!'`.",
      "Print a second line containing your target year: `2026`.",
      "Click 'Run Code' or press Ctrl + Enter to see your output appear in the console panel below."
    ],
    expectedOutput: "Hello, Backend Developer!\n2026",
    starterCode: `// 1. Send your first message to the console
console.log("Hello, Backend Developer!");

// 2. Output a number
console.log(2026);`,
    solutionCode: `console.log("Hello, Backend Developer!");
console.log(2026);`,
    hints: [
      "Text (strings) must always be wrapped in quotes like \"Hello\" or 'Hello'.",
      "Numbers do not need quotes: console.log(2026);",
      "Each console.log() prints on a new line."
    ],
    tests: [
      {
        description: "Program executes and produces output without syntax errors",
        assertionFnString: "return true;"
      }
    ],
    files: [
      {
        name: "index.js",
        language: "javascript",
        content: `console.log("Hello, Backend Developer!");
console.log(2026);`
      }
    ]
  },
  {
    id: "foundation-variables-math",
    slug: "variables-and-storage",
    title: "Storing Data & Basic Arithmetic",
    category: "foundation",
    categoryLabel: "Foundation (Level 0)",
    difficulty: "Foundation",
    estimatedMinutes: 10,
    description: "Understand variables as named storage containers in computer memory and perform arithmetic calculations.",
    instructions: [
      "Declare a variable `basePrice` and set it to `100`.",
      "Declare a variable `taxRate` and set it to `0.15` (15% tax).",
      "Declare a variable `totalPrice` equal to `basePrice + (basePrice * taxRate)`.",
      "Print `totalPrice` to the console."
    ],
    expectedOutput: "115",
    starterCode: `// 1. Declare the base price
const basePrice = 100;

// 2. Declare the tax rate (15%)
const taxRate = 0.15;

// 3. Compute total price
const totalPrice = basePrice + (basePrice * taxRate);

// 4. Output the result
console.log(totalPrice);`,
    solutionCode: `const basePrice = 100;
const taxRate = 0.15;
const totalPrice = basePrice + (basePrice * taxRate);
console.log(totalPrice);`,
    hints: [
      "Use `const` for values that do not change.",
      "Multiplication uses the asterisk `*` operator in code.",
      "Parentheses `( )` dictate calculation order just like in standard mathematics."
    ],
    tests: [
      {
        description: "basePrice is defined and equal to 100",
        assertionFnString: "return typeof basePrice === 'number' && basePrice === 100;"
      },
      {
        description: "totalPrice correctly calculates 115",
        assertionFnString: "return typeof totalPrice === 'number' && totalPrice === 115;"
      }
    ],
    files: [
      {
        name: "index.js",
        language: "javascript",
        content: `const basePrice = 100;
const taxRate = 0.15;
const totalPrice = basePrice + (basePrice * taxRate);
console.log(totalPrice);`
      }
    ]
  },
  {
    id: "foundation-conditions-decisions",
    slug: "conditions-and-decisions",
    title: "Making Decisions: If & Else Logic",
    category: "foundation",
    categoryLabel: "Foundation (Level 0)",
    difficulty: "Foundation",
    estimatedMinutes: 10,
    description: "Learn how programs make intelligent decisions based on Boolean conditions (true / false).",
    instructions: [
      "Given the `userAge` variable (e.g. `20`), check if the user is at least `18`.",
      "If `userAge >= 18`, assign `'Access Granted'` to `accessStatus`.",
      "Otherwise, assign `'Access Denied'`.",
      "Print `accessStatus`."
    ],
    expectedOutput: "Access Granted",
    starterCode: `const userAge = 20;
let accessStatus = "";

if (userAge >= 18) {
  accessStatus = "Access Granted";
} else {
  accessStatus = "Access Denied";
}

console.log(accessStatus);`,
    solutionCode: `const userAge = 20;
let accessStatus = userAge >= 18 ? "Access Granted" : "Access Denied";
console.log(accessStatus);`,
    hints: [
      "Use `>=` to check if a value is greater than or equal to another.",
      "Code inside the `{ }` after `if` only runs when the condition is `true`.",
      "Code inside `else { }` runs when the condition evaluates to `false`."
    ],
    tests: [
      {
        description: "accessStatus is 'Access Granted' for age 20",
        assertionFnString: "return accessStatus === 'Access Granted';"
      }
    ],
    files: [
      {
        name: "index.js",
        language: "javascript",
        content: `const userAge = 20;
let accessStatus = userAge >= 18 ? "Access Granted" : "Access Denied";
console.log(accessStatus);`
      }
    ]
  },
  {
    id: "foundation-loops-repetition",
    slug: "loops-and-repetition",
    title: "Repetition: Loops & Counters",
    category: "foundation",
    categoryLabel: "Foundation (Level 0)",
    difficulty: "Foundation",
    estimatedMinutes: 10,
    description: "Automate repetitive tasks and iterate over number sequences using for-loops.",
    instructions: [
      "Create a variable `sum` initialized to `0`.",
      "Use a `for` loop to add all numbers from `1` to `5` (inclusive) into `sum`.",
      "Print the final `sum` (1 + 2 + 3 + 4 + 5 = 15)."
    ],
    expectedOutput: "15",
    starterCode: `let sum = 0;

for (let i = 1; i <= 5; i++) {
  sum += i;
}

console.log("Sum:", sum);`,
    solutionCode: `let sum = 0;
for (let i = 1; i <= 5; i++) { sum += i; }
console.log("Sum:", sum);`,
    hints: [
      "Loops start with an initialization (let i = 1), a condition (i <= 5), and a step (i++).",
      "The `+=` operator adds a value to an existing variable: sum += i is equivalent to sum = sum + i.",
      "Make sure your loop condition includes `<="
    ],
    tests: [
      {
        description: "sum is equal to 15",
        assertionFnString: "return typeof sum === 'number' && sum === 15;"
      }
    ],
    files: [
      {
        name: "index.js",
        language: "javascript",
        content: `let sum = 0;
for (let i = 1; i <= 5; i++) {
  sum += i;
}
console.log("Sum:", sum);`
      }
    ]
  },
  {
    id: "foundation-functions-reusable",
    slug: "functions-and-reusability",
    title: "Reusable Logic: Functions & Returns",
    category: "foundation",
    categoryLabel: "Foundation (Level 0)",
    difficulty: "Foundation",
    estimatedMinutes: 10,
    description: "Package repeatable logic into named functions that accept parameters and return computed results.",
    instructions: [
      "Write a function `formatServerLog(service, message)`.",
      "The function must return a formatted string: `'[SERVICE] MESSAGE'`, for example `'[AUTH] User logged in'`.",
      "Call the function with `'DATABASE'` and `'Connected to port 5432'` and print the output."
    ],
    expectedOutput: "[DATABASE] Connected to port 5432",
    starterCode: `function formatServerLog(service, message) {
  return "[" + service + "] " + message;
}

const logMessage = formatServerLog("DATABASE", "Connected to port 5432");
console.log(logMessage);`,
    solutionCode: `function formatServerLog(service, message) {
  return \`[\${service}] \${message}\`;
}
console.log(formatServerLog("DATABASE", "Connected to port 5432"));`,
    hints: [
      "Functions take input parameters inside the parentheses `(service, message)`.",
      "Use the `return` keyword to pass the result back to the caller.",
      "String concatenation can be done with `+` or template literals: `[\${service}] \${message}`."
    ],
    tests: [
      {
        description: "formatServerLog function exists and returns formatted string",
        assertionFnString: "return typeof formatServerLog === 'function' && formatServerLog('API', 'Ready') === '[API] Ready';"
      }
    ],
    files: [
      {
        name: "index.js",
        language: "javascript",
        content: `function formatServerLog(service, message) {
  return "[" + service + "] " + message;
}

const logMessage = formatServerLog("DATABASE", "Connected to port 5432");
console.log(logMessage);`
      }
    ]
  },

  // ─── 2. BEGINNER BACKEND JAVASCRIPT EXERCISES ────────────────────
  {
    id: "js-variables-constants",
    slug: "variables-and-constants",
    title: "Backend Server Configuration Objects",
    category: "javascript",
    categoryLabel: "JavaScript Fundamentals",
    difficulty: "Beginner",
    estimatedMinutes: 10,
    description: "Learn how to declare immutable configuration variables and mutable state in modern JavaScript (ES6+).",
    instructions: [
      "Declare a constant variable `API_PORT` and set it to `5000`.",
      "Declare a variable `serverStatus` and assign the string `'online'`.",
      "Declare an object `serverConfig` containing `port: API_PORT` and `status: serverStatus`.",
      "Print `serverConfig` to the console using `console.log()`."
    ],
    expectedOutput: '{\n  "port": 5000,\n  "status": "online"\n}',
    starterCode: `// 1. Declare API_PORT constant
const API_PORT = 5000;

// 2. Declare serverStatus variable
let serverStatus = "online";

// 3. Create serverConfig object
const serverConfig = {
  port: API_PORT,
  status: serverStatus,
};

// 4. Output configuration
console.log(serverConfig);`,
    solutionCode: `const API_PORT = 5000;
let serverStatus = "online";
const serverConfig = {
  port: API_PORT,
  status: serverStatus,
};
console.log(serverConfig);`,
    hints: [
      "Use `const` for values that never change like port numbers.",
      "Use `let` for values that change over time.",
      "Create an object using curly braces: `{ port: API_PORT, status: serverStatus }`."
    ],
    tests: [
      {
        description: "API_PORT is defined as a number equal to 5000",
        assertionFnString: "return typeof API_PORT === 'number' && API_PORT === 5000;"
      },
      {
        description: "serverConfig object contains correct port and status properties",
        assertionFnString: "return typeof serverConfig === 'object' && serverConfig.port === 5000 && serverConfig.status === 'online';"
      }
    ],
    files: [
      {
        name: "index.js",
        language: "javascript",
        content: `const API_PORT = 5000;
let serverStatus = "online";
const serverConfig = {
  port: API_PORT,
  status: serverStatus,
};
console.log(serverConfig);`
      }
    ]
  },
  {
    id: "logic-array-filtering",
    slug: "filter-active-users",
    title: "Array Filtering & Data Transformation",
    category: "logic",
    categoryLabel: "Programming Logic",
    difficulty: "Beginner",
    estimatedMinutes: 15,
    description: "Process a raw database user array: filter for active accounts and transform them into public profile objects.",
    instructions: [
      "Filter the `users` array to keep only objects where `isActive === true`.",
      "Map each active user into a clean object with only `id`, `username`, and `role` (removing the sensitive `passwordHash`).",
      "Return or print the transformed `activeProfiles` array."
    ],
    expectedOutput: '[ { id: 1, username: "alex", role: "admin" }, { id: 3, username: "sam", role: "user" } ]',
    starterCode: `const users = [
  { id: 1, username: "alex", role: "admin", isActive: true, passwordHash: "x8f$92" },
  { id: 2, username: "jordan", role: "user", isActive: false, passwordHash: "a1b$44" },
  { id: 3, username: "sam", role: "user", isActive: true, passwordHash: "m3k$89" },
];

// Write your filtering and mapping logic here:
const activeProfiles = users
  .filter((u) => u.isActive)
  .map((u) => ({ id: u.id, username: u.username, role: u.role }));

console.log(activeProfiles);`,
    solutionCode: `const activeProfiles = users
  .filter((u) => u.isActive)
  .map((u) => ({ id: u.id, username: u.username, role: u.role }));
console.log(activeProfiles);`,
    hints: [
      "Use `Array.prototype.filter()` with a predicate: `u => u.isActive`.",
      "Use `Array.prototype.map()` to shape each object into the desired output format.",
      "Notice how `passwordHash` is excluded from the returned object for security."
    ],
    tests: [
      {
        description: "activeProfiles contains exactly 2 active users",
        assertionFnString: "return Array.isArray(activeProfiles) && activeProfiles.length === 2;"
      },
      {
        description: "activeProfiles excludes passwordHash property",
        assertionFnString: "return activeProfiles.every(u => !u.passwordHash && u.username && u.role);"
      }
    ],
    files: [
      {
        name: "index.js",
        language: "javascript",
        content: `const users = [
  { id: 1, username: "alex", role: "admin", isActive: true, passwordHash: "x8f$92" },
  { id: 2, username: "jordan", role: "user", isActive: false, passwordHash: "a1b$44" },
  { id: 3, username: "sam", role: "user", isActive: true, passwordHash: "m3k$89" },
];

const activeProfiles = users
  .filter((u) => u.isActive)
  .map((u) => ({ id: u.id, username: u.username, role: u.role }));

console.log(activeProfiles);`
      }
    ]
  },

  // ─── 3. INTERMEDIATE BACKEND EXERCISES ────────────────────────────
  {
    id: "async-promise-fetch",
    slug: "async-await-database-simulation",
    title: "Async / Await Database Query Simulation",
    category: "async",
    categoryLabel: "Asynchronous JavaScript",
    difficulty: "Intermediate",
    estimatedMinutes: 15,
    description: "Master Promises and async/await by simulating asynchronous database queries with error boundaries.",
    instructions: [
      "Implement the `getUserRecord(userId)` async function.",
      "If `userId <= 0`, reject or throw an error: `'Invalid User ID'`.",
      "Otherwise, return an object `{ id: userId, name: 'User ' + userId, verified: true }`.",
      "Call the function with ID `42` and print the result."
    ],
    expectedOutput: '{ id: 42, name: "User 42", verified: true }',
    starterCode: `async function getUserRecord(userId) {
  if (userId <= 0) {
    throw new Error("Invalid User ID");
  }
  return {
    id: userId,
    name: "User " + userId,
    verified: true,
  };
}

// Execute async call:
async function run() {
  try {
    const user = await getUserRecord(42);
    console.log("Fetched User:", user);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();`,
    solutionCode: `async function getUserRecord(userId) {
  if (userId <= 0) throw new Error("Invalid User ID");
  return { id: userId, name: "User " + userId, verified: true };
}`,
    hints: [
      "Mark your function with the `async` keyword so it always returns a Promise.",
      "Use `throw new Error(...)` inside an async function to trigger rejection.",
      "Always wrap asynchronous calls in a `try / catch` block in production backends."
    ],
    tests: [
      {
        description: "getUserRecord returns expected user object for valid ID",
        assertionFnString: "return typeof getUserRecord === 'function';"
      }
    ],
    files: [
      {
        name: "index.js",
        language: "javascript",
        content: `async function getUserRecord(userId) {
  if (userId <= 0) {
    throw new Error("Invalid User ID");
  }
  return {
    id: userId,
    name: "User " + userId,
    verified: true,
  };
}

getUserRecord(42).then(u => console.log(u));`
      }
    ]
  },
  {
    id: "express-middleware-guard",
    slug: "express-auth-middleware",
    title: "Express.js Authentication Middleware Guard",
    category: "express",
    categoryLabel: "Express.js & Middleware",
    difficulty: "Advanced",
    estimatedMinutes: 20,
    description: "Write an Express middleware function that inspects the Authorization header, validates the bearer token, and protects routes.",
    instructions: [
      "Implement the `authMiddleware(req, res, next)` function.",
      "Check if `req.headers.authorization` exists and starts with `'Bearer '`.",
      "If missing or invalid, return `res.status(401).json({ error: 'Unauthorized' })`.",
      "If valid (token === `'secret-backend-token'`), attach `req.user = { id: 101, role: 'admin' }` and call `next()`."
    ],
    expectedOutput: 'Middleware pipeline passes request to protected route handler',
    starterCode: `function authMiddleware(req, res, next) {
  const authHeader = req.headers && req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing Bearer Token" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== "secret-backend-token") {
    return res.status(403).json({ error: "Forbidden: Invalid Token" });
  }

  req.user = { id: 101, role: "admin" };
  next();
}

// Test simulation:
const mockReq = { headers: { authorization: "Bearer secret-backend-token" } };
const mockRes = {
  status(code) { this.statusCode = code; return this; },
  json(data) { this.body = data; return this; }
};

let nextCalled = false;
authMiddleware(mockReq, mockRes, () => {
  nextCalled = true;
});

console.log("Next Called:", nextCalled);
console.log("Attached User:", mockReq.user);`,
    solutionCode: `function authMiddleware(req, res, next) {
  const authHeader = req.headers?.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== "secret-backend-token") {
    return res.status(403).json({ error: "Forbidden" });
  }
  req.user = { id: 101, role: "admin" };
  next();
}`,
    hints: [
      "Middleware receives `(req, res, next)` arguments in Express.",
      "Always call `next()` when validation passes so the request advances to the route controller.",
      "Return early after responding with error statuses like 401 or 403 to prevent double-rendering."
    ],
    tests: [
      {
        description: "authMiddleware function is defined",
        assertionFnString: "return typeof authMiddleware === 'function';"
      },
      {
        description: "Valid token attaches user object and calls next()",
        assertionFnString: "let called = false; const req = { headers: { authorization: 'Bearer secret-backend-token' } }; const res = { status() { return this; }, json() { return this; } }; authMiddleware(req, res, () => { called = true; }); return called === true && req.user && req.user.role === 'admin';"
      }
    ],
    files: [
      {
        name: "middleware.js",
        language: "javascript",
        content: `function authMiddleware(req, res, next) {
  const authHeader = req.headers && req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== "secret-backend-token") {
    return res.status(403).json({ error: "Forbidden" });
  }
  req.user = { id: 101, role: "admin" };
  next();
}`
      }
    ]
  }
];

export function getExerciseById(id: string): WorkspaceExercise | undefined {
  return WORKSPACE_EXERCISES.find((e) => e.id === id || e.slug === id);
}

export function getExercisesByCategory(category: string): WorkspaceExercise[] {
  if (!category || category === "all") return WORKSPACE_EXERCISES;
  return WORKSPACE_EXERCISES.filter((e) => e.category === category);
}
