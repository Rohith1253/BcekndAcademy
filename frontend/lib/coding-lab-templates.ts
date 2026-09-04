import { CodingLabTemplate } from "./coding-lab-types";

export const CODING_LAB_TEMPLATES: CodingLabTemplate[] = [
  // 1. Empty JavaScript File
  {
    id: "empty-js",
    name: "Empty JavaScript File",
    description: "A blank slate to test vanilla JavaScript, functions, algorithms, and logic.",
    category: "JavaScript",
    activeFile: "src/index.js",
    files: [
      {
        path: "src/index.js",
        content: `// Empty JavaScript Scratchpad
console.log("Welcome to the AI Coding Lab!");

function main() {
  const message = "Experiment freely with backend logic";
  console.log(message);
}

main();
`,
        language: "javascript",
      },
    ],
  },

  // 2. Express API
  {
    id: "express-api",
    name: "Express API",
    description: "A complete Express application with route mounting, health check, and JSON responder.",
    category: "Express",
    activeFile: "src/index.js",
    defaultTests: [
      { id: "t1", name: "Returns 200 OK on /health", expectedStatus: 200 },
    ],
    files: [
      {
        path: "src/index.js",
        content: `const express = require('express');
const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: Date.now() });
});

// Hello API
app.get('/api/v1/hello', (req, res) => {
  res.status(200).json({ message: 'Hello from Backend Academy Lab!' });
});

app.listen(3000, () => {
  console.log("Express Lab Server active on port 3000");
});
`,
        language: "javascript",
      },
      {
        path: "package.json",
        content: `{\n  "name": "express-api-lab",\n  "version": "1.0.0",\n  "dependencies": {\n    "express": "^4.19.0"\n  }\n}`,
        language: "json",
      },
    ],
  },

  // 3. REST API Endpoint
  {
    id: "rest-endpoint",
    name: "REST API Endpoint",
    description: "CRUD endpoint handlers with request validation, 201 Created responses, and route matching.",
    category: "REST API",
    activeFile: "src/routes/users.js",
    defaultTests: [
      { id: "t1", name: "GET /api/users returns list", expectedStatus: 200 },
      { id: "t2", name: "POST /api/users creates record", expectedStatus: 201 },
    ],
    files: [
      {
        path: "src/index.js",
        content: `const express = require('express');
const app = express();
const usersRouter = require('./routes/users');

app.use(express.json());
app.use('/api/users', usersRouter);

app.listen(3000);
`,
        language: "javascript",
      },
      {
        path: "src/routes/users.js",
        content: `const express = require('express');
const router = express.Router();

const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'developer' }
];

router.get('/', (req, res) => {
  res.status(200).json({ success: true, count: users.length, data: users });
});

router.post('/', (req, res) => {
  const { name, role } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newUser = { id: users.length + 1, name, role: role || 'user' };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

module.exports = router;
`,
        language: "javascript",
      },
    ],
  },

  // 4. Authentication Controller
  {
    id: "auth-controller",
    name: "Authentication Controller",
    description: "Login and Registration handler functions with credential verification and token issuance.",
    category: "Authentication",
    activeFile: "src/controllers/authController.js",
    files: [
      {
        path: "src/index.js",
        content: `const express = require('express');
const app = express();
const { login, register } = require('./controllers/authController');

app.use(express.json());

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

app.listen(3000);
`,
        language: "javascript",
      },
      {
        path: "src/controllers/authController.js",
        content: `// Simulated Auth Controller
const usersDb = new Map();

function register(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (usersDb.has(email.toLowerCase())) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const user = { id: 'usr_' + Date.now(), email: email.toLowerCase() };
  usersDb.set(email.toLowerCase(), { ...user, passwordHash: 'hashed_' + password });

  return res.status(201).json({ success: true, user, message: 'Account created' });
}

function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existing = usersDb.get(email.toLowerCase());
  if (!existing || existing.passwordHash !== 'hashed_' + password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  return res.status(200).json({
    success: true,
    token: 'jwt.mock.token.signature',
    user: { id: existing.id, email: existing.email }
  });
}

module.exports = { register, login };
`,
        language: "javascript",
      },
    ],
  },

  // 5. Middleware
  {
    id: "middleware-pipeline",
    name: "Middleware Pipeline",
    description: "Custom logger, rate limiter, request timer, and auth guard middleware flow.",
    category: "Middleware",
    activeFile: "src/middleware/authGuard.js",
    files: [
      {
        path: "src/index.js",
        content: `const express = require('express');
const app = express();
const { authGuard } = require('./middleware/authGuard');

// Request Timer Middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  console.log('[Middleware] Incoming request:', req.method, req.url);
  if (next) next();
});

// Protected Route with auth guard
app.get('/api/admin/dashboard', authGuard, (req, res) => {
  res.status(200).json({ message: 'Welcome to the Admin Chamber' });
});

app.listen(3000);
`,
        language: "javascript",
      },
      {
        path: "src/middleware/authGuard.js",
        content: `function authGuard(req, res, next) {
  const auth = req.headers && req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Bearer token required' });
  }
  req.token = auth.split(' ')[1];
  if (next) next();
}

module.exports = { authGuard };
`,
        language: "javascript",
      },
    ],
  },

  // 6. MongoDB Query
  {
    id: "mongodb-query",
    name: "MongoDB Query",
    description: "MongoDB query logic with filter sanitization, aggregation, and projections.",
    category: "Database",
    activeFile: "src/queries.js",
    files: [
      {
        path: "src/queries.js",
        content: `// Simulated MongoDB Collection Query Operations
const mockDatabase = [
  { _id: '1', title: 'Node.js Deep Dive', tags: ['backend', 'js'], score: 95 },
  { _id: '2', title: 'Mongoose Patterns', tags: ['database', 'mongo'], score: 88 },
  { _id: '3', title: 'HTTP & REST APIs', tags: ['backend', 'http'], score: 92 }
];

function findCoursesByTag(tag) {
  return mockDatabase.filter(c => c.tags.includes(tag.toLowerCase()));
}

function calculateAverageScore() {
  const total = mockDatabase.reduce((acc, c) => acc + c.score, 0);
  return (total / mockDatabase.length).toFixed(1);
}

console.log("Backend courses:", findCoursesByTag("backend"));
console.log("Average course score:", calculateAverageScore());
`,
        language: "javascript",
      },
    ],
  },

  // 7. Mongoose Schema
  {
    id: "mongoose-schema",
    name: "Mongoose Schema",
    description: "Data modeling with field validations, virtuals, custom methods, and index definitions.",
    category: "Mongoose",
    activeFile: "src/models/Course.js",
    files: [
      {
        path: "src/models/Course.js",
        content: `// Mongoose Schema Definition Pattern
const CourseSchemaDefinition = {
  title: {
    type: 'String',
    required: [true, 'Course title is mandatory'],
    trim: true,
    minlength: 3
  },
  slug: {
    type: 'String',
    required: true,
    unique: true,
    lowercase: true
  },
  price: {
    type: 'Number',
    default: 0,
    min: 0
  },
  isPublished: {
    type: 'Boolean',
    default: false
  }
};

function validateCourse(data) {
  const errors = [];
  if (!data.title || data.title.length < 3) errors.push('Title must be at least 3 characters');
  if (!data.slug) errors.push('Slug is required');
  if (data.price !== undefined && data.price < 0) errors.push('Price cannot be negative');
  return { valid: errors.length === 0, errors };
}

console.log("Validating valid course:", validateCourse({ title: "Node Architecture", slug: "node-arch", price: 49 }));
console.log("Validating invalid course:", validateCourse({ title: "N", price: -10 }));
`,
        language: "javascript",
      },
    ],
  },

  // 8. Async JavaScript
  {
    id: "async-javascript",
    name: "Async JavaScript",
    description: "Promises, async/await, Promise.all concurrency, and error handling patterns.",
    category: "Async JS",
    activeFile: "src/asyncFlow.js",
    files: [
      {
        path: "src/asyncFlow.js",
        content: `// Concurrent Data Fetching with Async/Await
async function fetchUser(id) {
  return { id, username: 'dev_' + id, active: true };
}

async function fetchStats(id) {
  return { userId: id, commits: 142, streak: 12 };
}

async function getDashboardData(userId) {
  console.log("Fetching parallel data for user:", userId);
  const [user, stats] = await Promise.all([
    fetchUser(userId),
    fetchStats(userId)
  ]);
  return { ...user, stats };
}

getDashboardData('101').then(data => {
  console.log("Assembled Dashboard Record:", JSON.stringify(data));
});
`,
        language: "javascript",
      },
    ],
  },

  // 9. Error Handling
  {
    id: "error-handling",
    name: "Error Handling",
    description: "Centralized Express 4-argument error handler, custom AppError classes, and async wrappers.",
    category: "Express",
    activeFile: "src/index.js",
    files: [
      {
        path: "src/index.js",
        content: `const express = require('express');
const app = express();

app.use(express.json());

// Simulated route with runtime condition
app.get('/api/divide', (req, res, next) => {
  const a = Number(req.query.a || 10);
  const b = Number(req.query.b || 0);

  if (b === 0) {
    const error = new Error("Cannot divide by zero");
    error.status = 400;
    return next(error);
  }

  res.status(200).json({ result: a / b });
});

// Centralized Express Error Handler (4 arguments)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.log("[Error Handler Triggered]", err.message);
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(3000);
`,
        language: "javascript",
      },
    ],
  },

  // 10. Custom Sandbox
  {
    id: "custom-sandbox",
    name: "Custom Sandbox",
    description: "A multi-file project with modular helpers, utilities, and entry script.",
    category: "Custom",
    activeFile: "src/index.js",
    files: [
      {
        path: "src/index.js",
        content: `const { add, multiply } = require('./utils/math');

console.log("Custom Sandbox Initialized");
console.log("Add(10, 5) =", add(10, 5));
console.log("Multiply(4, 7) =", multiply(4, 7));
`,
        language: "javascript",
      },
      {
        path: "src/utils/math.js",
        content: `function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };
`,
        language: "javascript",
      },
      {
        path: "README.md",
        content: `# Custom Sandbox Project\n\nBuild and experiment freely across multiple files.\nUse require('./relative/path') to import modules.`,
        language: "markdown",
      },
    ],
  },
];

export function getTemplateById(id: string): CodingLabTemplate {
  return (
    CODING_LAB_TEMPLATES.find((t) => t.id === id) ||
    CODING_LAB_TEMPLATES[0]
  );
}
