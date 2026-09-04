export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  category: string;
  timeEstimate: number; // minutes
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  solution: string;
  testCases: Array<{
    name: string;
    input?: string;
    expectedOutput: string;
  }>;
  learningPoints: string[];
}

export const HTTP_CHALLENGES: Record<string, Challenge> = {
  create_http_server: {
    id: "create_http_server",
    title: "Create an HTTP Server",
    description:
      "Build a basic HTTP server that listens on port 3000 and responds with 'Hello, World!' when accessed.",
    difficulty: "beginner",
    xpReward: 100,
    category: "HTTP",
    timeEstimate: 15,
    starterCode: `const http = require('http');

// TODO: Create a server that responds with "Hello, World!"
const server = http.createServer((req, res) => {
  // Your code here
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
    expectedOutput: `Server running on port 3000
Response: Hello, World!`,
    hints: [
      "Use http.createServer() to create the server",
      "Use res.writeHead() to set the status code and content type",
      "Use res.end() to send the response body",
    ],
    solution: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
    testCases: [
      {
        name: "Server starts successfully",
        expectedOutput: "Server running on port 3000",
      },
      {
        name: "Returns Hello, World!",
        expectedOutput: "Hello, World!",
      },
      {
        name: "Status code is 200",
        expectedOutput: "200 OK",
      },
    ],
    learningPoints: [
      "HTTP server creation with Node.js",
      "Request/Response handling",
      "Port binding and server listeners",
    ],
  },

  handle_different_routes: {
    id: "handle_different_routes",
    title: "Handle Different Routes",
    description: "Create an HTTP server that responds differently based on the URL path.",
    difficulty: "beginner",
    xpReward: 150,
    category: "HTTP",
    timeEstimate: 20,
    starterCode: `const http = require('http');

const server = http.createServer((req, res) => {
  // TODO: Handle different routes
  // GET / -> respond with "Home"
  // GET /about -> respond with "About"
  // GET /contact -> respond with "Contact"
  // Otherwise -> respond with "404 Not Found"
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
    expectedOutput: `GET / -> Home
GET /about -> About
GET /contact -> Contact
GET /unknown -> 404 Not Found`,
    hints: [
      "Check req.url to get the path",
      "Use if/else if statements or a switch statement",
      "Set appropriate status codes (200 for success, 404 for not found)",
    ],
    solution: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  if (req.url === '/') {
    res.end('Home');
  } else if (req.url === '/about') {
    res.end('About');
  } else if (req.url === '/contact') {
    res.end('Contact');
  } else {
    res.writeHead(404);
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
    testCases: [
      { name: "Root path returns Home", expectedOutput: "Home" },
      { name: "About path returns About", expectedOutput: "About" },
      { name: "Contact path returns Contact", expectedOutput: "Contact" },
      { name: "Unknown path returns 404", expectedOutput: "404" },
    ],
    learningPoints: ["URL routing", "Status codes", "Conditional request handling"],
  },

  parse_json_request: {
    id: "parse_json_request",
    title: "Parse JSON Request Body",
    description:
      "Create a POST endpoint that accepts JSON data and echoes it back with proper parsing.",
    difficulty: "intermediate",
    xpReward: 200,
    category: "HTTP",
    timeEstimate: 25,
    starterCode: `const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/data') {
    // TODO: Parse the JSON body and echo it back
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
    });
    
    req.on('end', () => {
      // Parse and respond
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000);`,
    expectedOutput: `POST /api/data with {"name":"John","age":30}
Response: {"name":"John","age":30}`,
    hints: [
      "Use req.on('data') and req.on('end') to read the body",
      "Use JSON.parse() to convert string to object",
      "Use JSON.stringify() to convert object back to string",
    ],
    solution: `const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/data') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000);`,
    testCases: [
      { name: "Accepts POST requests", expectedOutput: "200" },
      { name: "Parses JSON correctly", expectedOutput: '{"name":"John"}' },
      { name: "Returns valid JSON", expectedOutput: "application/json" },
    ],
    learningPoints: ["JSON parsing", "Request body reading", "Error handling"],
  },
};
