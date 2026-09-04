import type { Challenge } from "./http";

export const EXPRESS_CHALLENGES: Record<string, Challenge> = {
  basic_express_server: {
    id: "basic_express_server",
    title: "Create a Basic Express Server",
    description: "Build a simple Express server with a single GET route.",
    difficulty: "beginner",
    xpReward: 100,
    category: "Express",
    timeEstimate: 15,
    starterCode: `const express = require('express');
const app = express();

// TODO: Create a GET route for '/'
// TODO: Respond with "Welcome to Express!"

app.listen(3000, () => {
  console.log('App listening on port 3000');
});`,
    expectedOutput: `App listening on port 3000
GET / -> Welcome to Express!`,
    hints: [
      "Use app.get() to create a GET route",
      "The first parameter is the path",
      "Use res.send() to send a response",
    ],
    solution: `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to Express!');
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});`,
    testCases: [
      { name: "Server starts successfully", expectedOutput: "listening" },
      { name: "GET route works", expectedOutput: "GET" },
      { name: "Response is correct", expectedOutput: "Welcome" },
    ],
    learningPoints: ["Express basics", "Route handling", "GET requests"],
  },

  create_rest_api: {
    id: "create_rest_api",
    title: "Create a REST API",
    description: "Build a REST API with GET, POST, and DELETE endpoints for managing items.",
    difficulty: "intermediate",
    xpReward: 250,
    category: "Express",
    timeEstimate: 30,
    starterCode: `const express = require('express');
const app = express();

app.use(express.json());

let items = [];
let nextId = 1;

// TODO: GET /items - Return all items
// TODO: POST /items - Add new item
// TODO: DELETE /items/:id - Delete item by ID

app.listen(3000, () => {
  console.log('API running on port 3000');
});`,
    expectedOutput: `GET /items -> []
POST /items -> {"id":1,"name":"Item"}
DELETE /items/1 -> Item deleted`,
    hints: [
      "Use app.get() for retrieving data",
      "Use app.post() for creating items",
      "Use app.delete() for removing items",
      "Access URL parameters with req.params",
    ],
    solution: `const express = require('express');
const app = express();

app.use(express.json());

let items = [];
let nextId = 1;

app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const item = { id: nextId++, ...req.body };
  items.push(item);
  res.json(item);
});

app.delete('/items/:id', (req, res) => {
  items = items.filter(i => i.id !== parseInt(req.params.id));
  res.json({ message: 'Item deleted' });
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});`,
    testCases: [
      { name: "GET /items works", expectedOutput: "GET" },
      { name: "POST /items works", expectedOutput: "POST" },
      { name: "DELETE /items/:id works", expectedOutput: "DELETE" },
    ],
    learningPoints: ["REST principles", "CRUD operations", "JSON responses"],
  },

  middleware_logging: {
    id: "middleware_logging",
    title: "Create a Logging Middleware",
    description: "Create middleware that logs every incoming HTTP request.",
    difficulty: "intermediate",
    xpReward: 150,
    category: "Express",
    timeEstimate: 20,
    starterCode: `const express = require('express');
const app = express();

// TODO: Create middleware that logs:
// [METHOD] [PATH] - [TIMESTAMP]

// TODO: Register the middleware

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(3000);`,
    expectedOutput: `[GET] / - ${new Date().toISOString()}`,
    hints: [
      "Create a function that logs req.method and req.path",
      "Use app.use() to register middleware",
      "Call next() to pass control to next middleware",
    ],
    solution: `const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(\`[\${req.method}] \${req.path} - \${new Date().toISOString()}\`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(3000);`,
    testCases: [
      { name: "Logs method", expectedOutput: "GET" },
      { name: "Logs path", expectedOutput: "/" },
      { name: "Logs timestamp", expectedOutput: "ISO" },
    ],
    learningPoints: ["Middleware pattern", "Request logging", "Express pipeline"],
  },
};
