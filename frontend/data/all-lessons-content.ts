import type { ContentBlock, QuizQuestion } from "@/data/lessons/types";
import { ADDITIONAL_COURSES_LESSONS } from "./additional-courses-content";

export interface RealLessonDefinition {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  xpReward: number;
  moduleId: number;
  moduleName: string;
  moduleSlug: string;
  order: number;
  learningPoints: string[];
  content: ContentBlock[];
  quiz: QuizQuestion[];
}

const COURSE1_LESSONS: RealLessonDefinition[] = [
  // =========================================================================
  // MODULE 1: Web & HTTP Fundamentals
  // =========================================================================
  {
    slug: "http-basics",
    title: "HTTP Basics & Client-Server Flow",
    description: "Master HTTP networking protocol, request-response cycles, headers, and client-server architecture.",
    category: "HTTP Protocol",
    difficulty: "beginner",
    duration: 30,
    xpReward: 150,
    moduleId: 1,
    moduleName: "Web & HTTP Fundamentals",
    moduleSlug: "web-http-fundamentals",
    order: 1,
    learningPoints: [
      "Client-Server Architecture",
      "Stateless Protocol Nature",
      "Request & Response Structure",
      "Headers and MIME Types",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "Understanding HTTP: The Backbone of Web Engineering",
      },
      {
        type: "paragraph",
        content:
          "HyperText Transfer Protocol (HTTP) is an application-layer network protocol that powers modern web communication. Whenever a web app fetches data, loads images, or submits a form, an HTTP request-response cycle takes place between the client (e.g. Browser/Mobile App) and the server.",
      },
      {
        type: "diagram",
        title: "HTTP Request-Response Lifecycle",
        data: {
          flow: [
            "Client sends HTTP Request -> TCP Socket",
            "DNS resolves domain -> IP Address",
            "Server receives request -> Express Router",
            "Controller processes request -> Database Query",
            "Server returns HTTP Response -> Status + Headers + JSON Body",
          ],
        },
      },
      {
        type: "heading",
        level: 2,
        content: "Anatomy of an HTTP Request",
      },
      {
        type: "paragraph",
        content:
          "An HTTP request consists of three critical sections: the Request Line (Method, Path, HTTP Version), Request Headers (metadata like Authorization, Content-Type, User-Agent), and an optional Request Body.",
      },
      {
        type: "code",
        filename: "http-request-example.txt",
        language: "http",
        code: `POST /api/v1/users HTTP/1.1
Host: api.learningplatform.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
User-Agent: Mozilla/5.0

{
  "name": "Jane Developer",
  "email": "jane@example.com",
  "role": "engineer"
}`,
      },
      {
        type: "heading",
        level: 2,
        content: "Anatomy of an HTTP Response",
      },
      {
        type: "paragraph",
        content:
          "The server evaluates the request, executes business logic, and sends back an HTTP Response containing a Status Line (HTTP Version, Status Code, Status Message), Response Headers, and the Response Body (JSON, HTML, text).",
      },
      {
        type: "code",
        filename: "http-response-example.txt",
        language: "http",
        code: `HTTP/1.1 201 Created
Date: Sun, 30 Aug 2026 12:00:00 GMT
Content-Type: application/json; charset=utf-8
Set-Cookie: token=abc123xyz; HttpOnly; Secure; SameSite=Lax

{
  "success": true,
  "data": {
    "id": "usr_99812",
    "name": "Jane Developer",
    "createdAt": "2026-08-30T12:00:00.000Z"
  }
}`,
      },
      {
        type: "tip",
        title: "Statelessness in HTTP",
        content:
          "HTTP is inherently stateless—each request is executed in isolation without knowing previous requests. Backend engineers use HTTP-only cookies, Session IDs, or JWT Bearer tokens to simulate stateful user authentication.",
      },
      {
        type: "practice",
        items: [
          "HTTP operates on top of TCP/IP at the Application Layer (Port 80 for HTTP, Port 443 for HTTPS).",
          "Every HTTP request contains a Method (GET, POST, etc.), Path, Headers, and optional Body.",
          "Response headers inform the browser how to cache, render, or secure the incoming payload.",
        ],
      },
    ],
    quiz: [
      {
        id: "http-q1",
        question: "Which layer of the OSI model does HTTP operate on?",
        options: ["Network Layer", "Transport Layer", "Application Layer", "Data Link Layer"],
        correct: 2,
        correctOptionIndex: 2,
        explanation: "HTTP operates at the Application Layer (Layer 7) of the OSI model, utilizing TCP at the Transport Layer.",
      },
      {
        id: "http-q2",
        question: "What does it mean for HTTP to be 'stateless'?",
        options: [
          "Servers store user sessions automatically",
          "Each request is executed independently without inherent memory of previous requests",
          "HTTP requests cannot transmit data payloads",
          "The connection remains permanently open",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "HTTP is stateless because the protocol itself does not retain session memory between distinct requests.",
      },
      {
        id: "http-q3",
        question: "Which HTTP header specifies the format of the data payload sent in the body?",
        options: ["Accept-Encoding", "Content-Type", "User-Agent", "Host"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "The Content-Type header tells the server or client the media type (e.g. application/json) of the body.",
      },
      {
        id: "http-q4",
        question: "Which standard default port does secure HTTPS use?",
        options: ["80", "8080", "443", "3000"],
        correct: 2,
        correctOptionIndex: 2,
        explanation: "HTTPS uses TLS/SSL encryption over standard port 443, whereas unencrypted HTTP uses port 80.",
      },
      {
        id: "http-q5",
        question: "What is the primary role of an HTTP Response Status Code?",
        options: [
          "To identify the client browser version",
          "To communicate the outcome of the request processing to the client",
          "To encrypt the response payload",
          "To compress the network traffic",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Status codes (e.g. 200, 201, 400, 404, 500) inform the client of request processing success or error status.",
      },
    ],
  },
  {
    slug: "rest-apis",
    title: "REST APIs Architecture & Design Patterns",
    description: "Design clean, scalable RESTful web APIs following resource orientation, uniform interfaces, and HATEOAS principles.",
    category: "HTTP Protocol",
    difficulty: "beginner",
    duration: 30,
    xpReward: 140,
    moduleId: 1,
    moduleName: "Web & HTTP Fundamentals",
    moduleSlug: "web-http-fundamentals",
    order: 2,
    learningPoints: [
      "Resource-Oriented Architecture (ROA)",
      "Nouns vs Verbs in API URLs",
      "Stateless Communication Constraints",
      "API Versioning Strategies",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "REST API Architecture: Designing Clean Web Interfaces",
      },
      {
        type: "paragraph",
        content:
          "REpresentational State Transfer (REST) is an architectural style designed by Roy Fielding in 2000. In REST APIs, system abstractions are exposed as 'Resources' identified by clean URIs (nouns), manipulated using standard HTTP verbs.",
      },
      {
        type: "heading",
        level: 2,
        content: "Core Principles of RESTful API Design",
      },
      {
        type: "practice",
        items: [
          "Resource Orientation: URIs model nouns (/users, /orders), NEVER verbs (/getUser, /createOrder).",
          "Uniform Interface: Standard HTTP methods (GET, POST, PUT, PATCH, DELETE) define action semantics.",
          "Stateless Server: Every request carries all authentication credentials required to process it.",
          "Cacheability: Responses explicitly declare caching policies via Cache-Control headers.",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "RESTful URL Naming Best Practices",
      },
      {
        type: "code",
        filename: "rest-endpoints-guidelines.ts",
        language: "typescript",
        code: `// ✅ GOOD REST Endpoint Naming (Plural Nouns & Nested Resources)
GET    /api/v1/courses             // List all courses
POST   /api/v1/courses             // Create a new course
GET    /api/v1/courses/:id         // Fetch course by ID
PUT    /api/v1/courses/:id         // Full replace course by ID
PATCH  /api/v1/courses/:id         // Partial update course by ID
DELETE /api/v1/courses/:id         // Delete course by ID
GET    /api/v1/courses/:id/lessons // Fetch lessons under specific course

// ❌ BAD API Endpoints (Avoid verbs in URLs)
GET /api/getAllCourses
POST /api/createNewCourse
GET /api/deleteCourseById?id=102`,
      },
      {
        type: "example",
        title: "JSON Response Payload Structure",
        content:
          "Always return consistent JSON response envelopes containing `success: true/false`, `data` for resources, and informative `error` messages for failures.",
      },
      {
        type: "code",
        filename: "response-envelope.json",
        language: "json",
        code: `{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "crs_101",
        "slug": "backend-node-js",
        "title": "Backend Development with Node.js",
        "totalModules": 4
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}`,
      },
    ],
    quiz: [
      {
        id: "rest-q1",
        question: "What does REST stand for in web API architecture?",
        options: [
          "Remote Execution Socket Protocol",
          "REpresentational State Transfer",
          "Resource Engine Status Transfer",
          "Routing Endpoint Standard Format",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "REST stands for REpresentational State Transfer, introduced by Roy Fielding.",
      },
      {
        id: "rest-q2",
        question: "Which URL follows proper RESTful resource naming conventions?",
        options: ["GET /api/v1/getAllUsers", "POST /api/v1/createUser", "GET /api/v1/users", "POST /api/v1/user/delete"],
        correct: 2,
        correctOptionIndex: 2,
        explanation: "RESTful URLs should use plural nouns representing resource collections, such as `/api/v1/users`.",
      },
      {
        id: "rest-q3",
        question: "Which HTTP method should be used for partial updates to an existing resource?",
        options: ["PUT", "PATCH", "POST", "GET"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "PATCH is used for partial resource updates, whereas PUT represents a full resource replacement.",
      },
      {
        id: "rest-q4",
        question: "Why should REST API endpoints avoid containing actions/verbs in their path?",
        options: [
          "Verbs are prohibited by HTTP compilers",
          "Actions are already defined by standard HTTP methods (GET, POST, PUT, DELETE)",
          "Verbs slow down database index queries",
          "URLs can only contain numbers",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "HTTP methods provide the action semantics, so resource paths should remain purely noun-based.",
      },
      {
        id: "rest-q5",
        question: "What is API Versioning (e.g. `/api/v1/...`) essential for?",
        options: [
          "Compressing API responses",
          "Preventing breaking changes for existing API clients when introducing updates",
          "Enabling MongoDB connection pooling",
          "Encrypting JSON payloads",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Versioning ensures backward compatibility so client apps aren't broken when APIs evolve.",
      },
    ],
  },
  {
    slug: "http-methods-status-codes",
    title: "HTTP Methods & Status Codes Masterclass",
    description: "Deep dive into HTTP method idempotency, safe methods, and exact HTTP status code ranges (2xx, 3xx, 4xx, 5xx).",
    category: "HTTP Protocol",
    difficulty: "beginner",
    duration: 30,
    xpReward: 140,
    moduleId: 1,
    moduleName: "Web & HTTP Fundamentals",
    moduleSlug: "web-http-fundamentals",
    order: 3,
    learningPoints: [
      "Safe vs Idempotent HTTP Methods",
      "Success Codes (200, 201, 204)",
      "Client Error Codes (400, 401, 403, 404, 429)",
      "Server Error Codes (500, 502, 503, 504)",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "HTTP Methods Semantics & Idempotency",
      },
      {
        type: "paragraph",
        content:
          "HTTP methods define the semantic action executed on a resource. Understanding 'Safe' methods (read-only, no side effects) and 'Idempotent' methods (executing N times yields identical server state) is mandatory for backend engineers.",
      },
      {
        type: "practice",
        items: [
          "GET: Safe & Idempotent. Fetches data without side effects.",
          "POST: Neither Safe nor Idempotent. Creates new records; repeated calls create multiple resources.",
          "PUT: Idempotent. Replaces the target resource state completely.",
          "PATCH: Non-idempotent by default. Applies partial modifications.",
          "DELETE: Idempotent. Deleting an ID once or 10 times results in the resource being gone.",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "HTTP Status Code Ranges Breakdown",
      },
      {
        type: "code",
        filename: "status-codes-reference.ts",
        language: "typescript",
        code: `// 🟢 2xx SUCCESS
200 OK           // Successful GET, PUT, or PATCH
201 Created      // Successful POST creating a resource
204 No Content   // Successful DELETE with no body

// 🟡 3xx REDIRECTION
301 Moved Permanently
304 Not Modified // Client cache is up to date

// 🔴 4xx CLIENT ERRORS (Client provided bad input/credentials)
400 Bad Request        // Invalid JSON body / schema validation failure
401 Unauthorized       // Missing or invalid authentication token
403 Forbidden          // Authenticated but lacks resource ownership/permission
404 Not Found          // Resource ID does not exist in database
409 Conflict           // Duplicate email / database constraint violation
429 Too Many Requests  // Rate limit quota exceeded

// 💥 5xx SERVER ERRORS (Uncaught exception or infrastructure failure)
500 Internal Error     // Uncaught exception in code
502 Bad Gateway        // Upstream reverse proxy failure (e.g. Nginx)
503 Service Unavailable// DB connection pool exhausted or server maintenance
504 Gateway Timeout    // Upstream service did not respond in time`,
      },
      {
        type: "warning",
        title: "Common Junior Developer Mistake: 401 vs 403",
        content:
          "Use 401 Unauthorized when the client is NOT authenticated (missing/invalid token). Use 403 Forbidden when the client IS logged in, but tries to modify data belonging to another user.",
      },
    ],
    quiz: [
      {
        id: "status-q1",
        question: "Which HTTP method is considered 'Idempotent'?",
        options: ["POST", "DELETE", "PATCH (with relative operations)", "CONNECT"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "DELETE is idempotent because executing it multiple times leaves the resource deleted without further side effects.",
      },
      {
        id: "status-q2",
        question: "Which HTTP status code should be returned after successfully creating a new user record?",
        options: ["200 OK", "201 Created", "204 No Content", "302 Found"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "HTTP 201 Created explicitly signals successful resource creation.",
      },
      {
        id: "status-q3",
        question: "What is the key difference between status 401 and status 403?",
        options: [
          "401 means server error, 403 means client error",
          "401 means unauthenticated (who are you?), 403 means unauthorized/forbidden (you don't own this resource)",
          "401 is for GET requests, 403 is for POST requests",
          "There is no difference",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "401 indicates missing/invalid login credentials; 403 indicates authenticated user lacks permission.",
      },
      {
        id: "status-q4",
        question: "Which 4xx status code should an API return when a client exceeds rate limits?",
        options: ["400 Bad Request", "403 Forbidden", "429 Too Many Requests", "409 Conflict"],
        correct: 2,
        correctOptionIndex: 2,
        explanation: "429 Too Many Requests is the standard status code returned when rate limits are exceeded.",
      },
      {
        id: "status-q5",
        question: "What does status code 500 Internal Server Error signify?",
        options: [
          "The client sent invalid JSON format",
          "An uncaught error or runtime failure occurred on the server",
          "The requested endpoint URL was not found",
          "The client certificate expired",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "500 Internal Server Error signifies an unhandled exception or crash on the server side.",
      },
    ],
  },

  // =========================================================================
  // MODULE 2: Node.js Fundamentals
  // =========================================================================
  {
    slug: "nodejs",
    title: "Node.js Runtime & Event Loop Architecture",
    description: "Understand the V8 JavaScript Engine, Single-threaded Event Loop, libuv, and Asynchronous I/O execution.",
    category: "Node.js",
    difficulty: "intermediate",
    duration: 35,
    xpReward: 150,
    moduleId: 2,
    moduleName: "Node.js Fundamentals",
    moduleSlug: "nodejs-fundamentals",
    order: 1,
    learningPoints: [
      "V8 Execution Engine",
      "Single-Threaded Event Loop Phases",
      "libuv C++ Worker Threadpool",
      "Non-Blocking I/O vs CPU Blocking Code",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "Inside Node.js: V8, libuv, and the Event Loop",
      },
      {
        type: "paragraph",
        content:
          "Node.js is an asynchronous event-driven JavaScript runtime built on Google's V8 engine and libuv library. Unlike traditional multi-threaded servers (e.g. Apache/Java Tomcat) that spawn a new thread per request, Node.js uses a single main thread for JavaScript execution, delegating I/O operations to OS kernel mechanisms and libuv thread pool.",
      },
      {
        type: "diagram",
        title: "Node.js Architecture & Event Loop Flow",
        data: {
          flow: [
            "JS Call Stack -> V8 executes synchronous code",
            "Async I/O (fs, net, crypto) -> Offloaded to libuv Thread Pool",
            "OS Kernel / libuv notifies completion -> Pushes callback to Queue",
            "Event Loop checks Call Stack -> When empty, moves callback to Call Stack",
            "V8 executes callback function -> Response returned to client",
          ],
        },
      },
      {
        type: "heading",
        level: 2,
        content: "Phases of the Event Loop",
      },
      {
        type: "practice",
        items: [
          "Timers Phase: Executes callbacks scheduled by setTimeout() and setInterval().",
          "Pending Callbacks Phase: Executes I/O callbacks deferred to the next loop iteration.",
          "Idle, Prepare Phase: Internal Node.js engine processing.",
          "Poll Phase: Retrieves new I/O events (incoming HTTP connections, DB sockets, disk reads).",
          "Check Phase: Executes setImmediate() callbacks.",
          "Close Callbacks Phase: Executes socket/handle close handlers (e.g. socket.on('close')).",
        ],
      },
      {
        type: "warning",
        title: "Never Block the Main Event Loop!",
        content:
          "Because Node.js runs JavaScript on a single thread, CPU-heavy operations (like synchronous JSON parsing of 500MB strings, heavy regex processing, or sync crypto loops) block ALL incoming requests for all users!",
      },
      {
        type: "code",
        filename: "non-blocking-demo.js",
        language: "javascript",
        code: `const fs = require('fs');

console.log("1. Starting script");

// Non-blocking asynchronous file read (libuv worker thread)
fs.readFile('large-dataset.json', 'utf8', (err, data) => {
  if (err) throw err;
  console.log("3. File loaded asynchronously!");
});

console.log("2. Script continuing without waiting...");

// Output Order:
// 1. Starting script
// 2. Script continuing without waiting...
// 3. File loaded asynchronously!`,
      },
    ],
    quiz: [
      {
        id: "node-q1",
        question: "Which C++ library provides the asynchronous event-driven I/O thread pool in Node.js?",
        options: ["V8", "libuv", "OpenSSL", "zlib"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "libuv is the multi-platform C++ library that powers Node.js asynchronous I/O and worker thread pool.",
      },
      {
        id: "node-q2",
        question: "How does Node.js handle concurrent incoming HTTP requests on a single main thread?",
        options: [
          "By creating a new OS process per request",
          "By offloading asynchronous I/O tasks to libuv/kernel and processing callbacks via the Event Loop",
          "By converting JavaScript into multi-threaded Assembly code",
          "By rejecting requests if more than one arrives at a time",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Node.js offloads I/O operations and resumes execution when callbacks are ready in the Event Loop queue.",
      },
      {
        id: "node-q3",
        question: "What happens if a developer runs a CPU-bound 10-second synchronous loop in an Express route handler?",
        options: [
          "Node.js automatically moves the loop to a background thread",
          "The main thread is blocked, freezing ALL incoming requests for ALL users for 10 seconds",
          "Only that specific request is delayed while others process normally",
          "The browser crashes immediately",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Because Node.js executes JS on a single main thread, CPU-bound sync tasks block the entire event loop.",
      },
      {
        id: "node-q4",
        question: "In which Event Loop phase do `setImmediate()` callbacks execute?",
        options: ["Timers Phase", "Poll Phase", "Check Phase", "Close Callbacks Phase"],
        correct: 2,
        correctOptionIndex: 2,
        explanation: "`setImmediate()` callbacks are executed specifically in the Check Phase of the Event Loop.",
      },
      {
        id: "node-q5",
        question: "Which engine compiles JavaScript code into native machine code inside Node.js?",
        options: ["SpiderMonkey", "V8", "JavaScriptCore", "Chakra"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Google's V8 open-source engine compiles and executes JavaScript code inside Node.js.",
      },
    ],
  },
  {
    slug: "nodejs-modules",
    title: "Node.js Core Modules & Standard Library",
    description: "Explore essential built-in modules: fs, path, http, events, and stream processing for high-performance servers.",
    category: "Node.js",
    difficulty: "intermediate",
    duration: 35,
    xpReward: 140,
    moduleId: 2,
    moduleName: "Node.js Fundamentals",
    moduleSlug: "nodejs-fundamentals",
    order: 2,
    learningPoints: [
      "CommonJS (require) vs ES Modules (import)",
      "File System (`fs/promises`) Operations",
      "Path Resolution with `path.join` and `path.resolve`",
      "EventEmitter Pattern",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "Node.js Standard Library & Built-in Modules",
      },
      {
        type: "paragraph",
        content:
          "Node.js includes a rich set of built-in modules accessible without external installations. Understanding core modules like `fs`, `path`, `http`, `events`, and `crypto` is essential for building robust backend systems.",
      },
      {
        type: "heading",
        level: 2,
        content: "CommonJS vs ES Modules Syntax",
      },
      {
        type: "code",
        filename: "modules-comparison.ts",
        language: "typescript",
        code: `// CommonJS (Default in legacy Node.js)
const fs = require('fs/promises');
const path = require('path');
module.exports = { myFunction };

// ES Modules (Modern Standard)
import fs from 'fs/promises';
import path from 'path';
export { myFunction };`,
      },
      {
        type: "heading",
        level: 2,
        content: "Safe File Path Manipulation with `path` Module",
      },
      {
        type: "code",
        filename: "path-demo.ts",
        language: "typescript",
        code: `import path from 'path';
import fs from 'fs/promises';

// ❌ NEVER concatenate paths manually using string concatenation ('/' vs '\\\\')
// const filePath = __dirname + '/data/' + filename;

// ✅ ALWAYS use path.join() or path.resolve() for cross-platform compatibility (Windows & Linux)
const safePath = path.join(__dirname, 'data', 'config.json');
console.log("Resolved Path:", safePath);

async function loadConfig() {
  const rawData = await fs.readFile(safePath, 'utf-8');
  return JSON.parse(rawData);
}`,
      },
      {
        type: "tip",
        title: "EventEmitter Pattern",
        content:
          "Many Node.js core objects (like HTTP request streams, DB sockets, process objects) inherit from `EventEmitter`. You can listen to custom events using `.on('event', callback)` and trigger them using `.emit('event', payload)`.",
      },
    ],
    quiz: [
      {
        id: "mod-q1",
        question: "Why should developers use `path.join()` instead of manually concatenating path strings with '/'?",
        options: [
          "path.join() automatically encrypts the file path",
          "It ensures cross-platform compatibility across Windows (\\\\) and Linux/macOS (/)",
          "It speeds up database read queries",
          "It converts file contents to uppercase",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Windows uses backslashes while POSIX systems use forward slashes. `path.join()` handles OS variations automatically.",
      },
      {
        id: "mod-q2",
        question: "Which core module is used to handle asynchronous file reads and writes?",
        options: ["net", "fs", "http", "url"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "The `fs` (File System) module handles file operations in Node.js.",
      },
      {
        id: "mod-q3",
        question: "Which module method subscribes a listener function to a custom event in Node.js EventEmitter?",
        options: ["emitter.subscribe()", "emitter.on()", "emitter.listen()", "emitter.catch()"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "`emitter.on(eventName, listener)` registers an event listener callback function.",
      },
      {
        id: "mod-q4",
        question: "What is the key difference between `fs.readFileSync` and `fs.promises.readFile`?",
        options: [
          "fs.readFileSync is non-blocking, fs.promises.readFile blocks the event loop",
          "fs.readFileSync blocks the event loop thread, while fs.promises.readFile executes asynchronously",
          "fs.promises.readFile only works on Windows",
          "There is no difference",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "`fs.readFileSync` freezes the single main thread during execution, whereas promise-based methods are non-blocking.",
      },
      {
        id: "mod-q5",
        question: "Which built-in global variable in CommonJS provides the absolute path of the directory containing the currently executing file?",
        options: ["__filename", "__dirname", "process.cwd()", "module.path"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "`__dirname` holds the absolute directory path of the current file in CommonJS.",
      },
    ],
  },
  {
    slug: "npm-package-management",
    title: "npm & Package Management Architecture",
    description: "Understand package.json, package-lock.json, Semantic Versioning rules (^ vs ~), and dependency vulnerability auditing.",
    category: "Node.js",
    difficulty: "intermediate",
    duration: 35,
    xpReward: 140,
    moduleId: 2,
    moduleName: "Node.js Fundamentals",
    moduleSlug: "nodejs-fundamentals",
    order: 3,
    learningPoints: [
      "package.json vs package-lock.json",
      "Semantic Versioning (MAJOR.MINOR.PATCH)",
      "Dependencies vs devDependencies",
      "npm audit & vulnerability management",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "Mastering Node Package Manager (npm)",
      },
      {
        type: "paragraph",
        content:
          "npm is the default package manager for Node.js and the largest software registry in the world. Proper management of dependencies, lockfiles, and semantic versioning protects applications against production outages and supply-chain attacks.",
      },
      {
        type: "heading",
        level: 2,
        content: "Semantic Versioning (SemVer) Demystified",
      },
      {
        type: "code",
        filename: "semver-rules.json",
        language: "json",
        code: `// Version format: MAJOR.MINOR.PATCH (e.g. 1.4.2)
// MAJOR: Breaking API changes (e.g. 2.0.0)
// MINOR: New backward-compatible features (e.g. 1.5.0)
// PATCH: Backward-compatible bug fixes (e.g. 1.4.3)

{
  "dependencies": {
    "express": "^4.18.2",  // Caret (^): Allows MINOR and PATCH updates (>=4.18.2 <5.0.0)
    "mongoose": "~7.0.3",  // Tilde (~): Allows ONLY PATCH updates (>=7.0.3 <7.1.0)
    "dotenv": "16.0.3"     // Exact Version: Locks to exact version ONLY
  },
  "devDependencies": {
    "typescript": "^5.0.4", // Required ONLY during development & build
    "@types/node": "^20.0.0"
  }
}`,
      },
      {
        type: "warning",
        title: "Role of package-lock.json in CI/CD Production Builds",
        content:
          "Never delete `package-lock.json`! While `package.json` contains version ranges, `package-lock.json` pins the exact dependency tree hash down to sub-dependencies, ensuring deterministic builds across local machines and production servers.",
      },
    ],
    quiz: [
      {
        id: "npm-q1",
        question: "What does the 'MAJOR' number represent in Semantic Versioning (e.g. 2.0.0)?",
        options: [
          "Backward-compatible bug fixes",
          "New backward-compatible features",
          "Incompatible breaking API changes",
          "Development release build number",
        ],
        correct: 2,
        correctOptionIndex: 2,
        explanation: "MAJOR version increments signal breaking changes that may require code modifications.",
      },
      {
        id: "npm-q2",
        question: "What range of versions does `^4.18.2` permit during `npm install`?",
        options: [
          "Only exact version 4.18.2",
          "Any version including major breaking changes (>=4.18.2 <6.0.0)",
          "Backward-compatible minor and patch updates (>=4.18.2 <5.0.0)",
          "Only patch updates (>=4.18.2 <4.19.0)",
        ],
        correct: 2,
        correctOptionIndex: 2,
        explanation: "The caret (^) allows minor and patch updates up to, but not including, the next major version.",
      },
      {
        id: "npm-q3",
        question: "Why is `package-lock.json` critical for production deployments?",
        options: [
          "It speeds up MongoDB connection latency",
          "It locks the exact tree of installed dependencies and sub-dependencies for deterministic builds",
          "It compiles TypeScript files to JavaScript",
          "It encrypts secret keys",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "`package-lock.json` guarantees exact identical dependency installation across environments.",
      },
      {
        id: "npm-q4",
        question: "Where should build tools like TypeScript, ESLint, or Jest be placed in `package.json`?",
        options: ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Tools required only during development and testing belong in `devDependencies`.",
      },
      {
        id: "npm-q5",
        question: "Which npm command scans installed dependencies for known security vulnerabilities?",
        options: ["npm check", "npm audit", "npm verify", "npm secure"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "`npm audit` checks dependencies against the advisory database for known security risks.",
      },
    ],
  },

  // =========================================================================
  // MODULE 3: Express.js Architecture
  // =========================================================================
  {
    slug: "express-fundamentals",
    title: "Express.js Fundamentals & Web Server Creation",
    description: "Build production HTTP web servers with Express, configure JSON parsers, and structure HTTP endpoints.",
    category: "Express.js",
    difficulty: "intermediate",
    duration: 35,
    xpReward: 150,
    moduleId: 3,
    moduleName: "Express.js Architecture",
    moduleSlug: "express-architecture",
    order: 1,
    learningPoints: [
      "Initializing Express Instance (`express()`)",
      "Parsing JSON Payloads (`express.json()`)",
      "Configuring Environment Ports",
      "Handling GET and POST Endpoints",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "Building Production Web Servers with Express.js",
      },
      {
        type: "paragraph",
        content:
          "Express is the de facto standard web framework for Node.js. It provides a lightweight layer of web application features (routing, middleware, request parsing) on top of Node.js `http` module.",
      },
      {
        type: "heading",
        level: 2,
        content: "Complete Minimal Express Server Example",
      },
      {
        type: "code",
        filename: "server.ts",
        language: "typescript",
        code: `import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Built-in body parser middleware for JSON payloads
app.use(express.json());

// 2. Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// 3. Resource POST endpoint
app.post('/api/v1/echo', (req: Request, res: Response) => {
  const payload = req.body;
  res.status(201).json({
    success: true,
    received: payload
  });
});

// 4. Start HTTP listener
app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});`,
      },
      {
        type: "tip",
        title: "Always Use express.json() Middleware",
        content:
          "Without `app.use(express.json())`, incoming `req.body` payloads will be `undefined` when clients send JSON POST/PUT requests!",
      },
    ],
    quiz: [
      {
        id: "exp-q1",
        question: "Which method initializes a new Express application instance?",
        options: ["express.createApp()", "express()", "new Express()", "express.init()"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Calling `const app = express()` instantiates an Express application.",
      },
      {
        id: "exp-q2",
        question: "What occurs if `app.use(express.json())` is omitted before handling POST routes?",
        options: [
          "Express throws a syntax error on startup",
          "Incoming `req.body` will be `undefined` when reading JSON payloads",
          "The database deletes all tables",
          "The server automatically crashes",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "`express.json()` is required to parse incoming JSON request bodies into `req.body`.",
      },
      {
        id: "exp-q3",
        question: "How do you set a custom HTTP response status code (e.g. 201 Created) in Express?",
        options: ["res.code(201)", "res.status(201)", "res.setStatus(201)", "res.setHTTP(201)"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "`res.status(code)` sets the HTTP response status code.",
      },
      {
        id: "exp-q4",
        question: "Which method binds and listens for connections on a specified host and port?",
        options: ["app.start()", "app.listen()", "app.run()", "app.connect()"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "`app.listen(port, callback)` starts the HTTP server listening on the specified port.",
      },
      {
        id: "exp-q5",
        question: "What is the default data type of `process.env.PORT` in Node.js?",
        options: ["number", "string (or undefined)", "boolean", "object"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Environment variables in `process.env` are always stored as string values or undefined.",
      },
    ],
  },
  {
    slug: "express-routing",
    title: "Express Routing & Controller Design Pattern",
    description: "Structure modular route files using express.Router(), extract route params and query strings, and implement Controllers.",
    category: "Express.js",
    difficulty: "intermediate",
    duration: 35,
    xpReward: 150,
    moduleId: 3,
    moduleName: "Express.js Architecture",
    moduleSlug: "express-architecture",
    order: 2,
    learningPoints: [
      "Modular Routing with `express.Router()`",
      "Route Parameters (`req.params`) vs Query Parameters (`req.query`)",
      "Controller Separation Pattern",
      "RESTful API File Organization",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "Modular Express Routing & Clean Controller Architecture",
      },
      {
        type: "paragraph",
        content:
          "In enterprise applications, putting all route handlers in a single `server.ts` file leads to unmaintainable code. Express provides `express.Router()` to decompose endpoint definitions into modular files.",
      },
      {
        type: "heading",
        level: 2,
        content: "Controller Separation Example",
      },
      {
        type: "code",
        filename: "user.controller.ts",
        language: "typescript",
        code: `import { Request, Response } from 'express';

// Controller layer contains business logic & database queries
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params; // Path parameter e.g. /api/users/usr_100
  const { includeProfile } = req.query; // Query parameter e.g. ?includeProfile=true

  res.status(200).json({
    success: true,
    data: {
      userId: id,
      includeProfile: includeProfile === 'true'
    }
  });
};`,
      },
      {
        type: "heading",
        level: 2,
        content: "Modular Route Definition using `express.Router()`",
      },
      {
        type: "code",
        filename: "user.routes.ts",
        language: "typescript",
        code: `import { Router } from 'express';
import { getUserById } from './user.controller';

const router = Router();

// Define route parameters using colon syntax (:id)
router.get('/:id', getUserById);

export default router;`,
      },
    ],
    quiz: [
      {
        id: "route-q1",
        question: "Which Express class creates modular, mountable route handlers?",
        options: ["express.Router()", "express.Controller()", "express.Route()", "express.Dispatcher()"],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "`express.Router()` creates isolated router instances that can be mounted as middleware.",
      },
      {
        id: "route-q2",
        question: "Given URL `/api/v1/users/99812`, how do you access the value `99812` defined on route `/api/v1/users/:id`?",
        options: ["req.body.id", "req.query.id", "req.params.id", "req.headers.id"],
        correct: 2,
        correctOptionIndex: 2,
        explanation: "URL path parameters defined with `:id` are accessed via `req.params.id`.",
      },
      {
        id: "route-q3",
        question: "Given URL `/api/v1/lessons?category=backend&page=2`, how do you access `category`?",
        options: ["req.params.category", "req.query.category", "req.body.category", "req.url.category"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "URL query strings following `?` are parsed into the `req.query` object.",
      },
      {
        id: "route-q4",
        question: "What is the primary benefit of separating Route definitions from Controller logic?",
        options: [
          "It speeds up Node.js V8 execution",
          "It improves code maintainability, testability, and separation of concerns",
          "It automatically encrypts HTTP responses",
          "It removes the need for database indexes",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Separating routes from controllers isolates HTTP routing mapping from underlying business logic.",
      },
      {
        id: "route-q5",
        question: "How do you mount a sub-router module onto `/api/v1/users` in `app.ts`?",
        options: [
          "app.use('/api/v1/users', userRoutes)",
          "app.get('/api/v1/users', userRoutes)",
          "app.mount('/api/v1/users', userRoutes)",
          "app.add('/api/v1/users', userRoutes)",
        ],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "`app.use(path, router)` mounts the router module at the specified path prefix.",
      },
    ],
  },
  {
    slug: "express-middleware",
    title: "Express Middleware Pipeline & Error Handling",
    description: "Master request pipelines, custom authentication guards, input validation, and 4-argument centralized error middleware.",
    category: "Express.js",
    difficulty: "intermediate",
    duration: 40,
    xpReward: 160,
    moduleId: 3,
    moduleName: "Express.js Architecture",
    moduleSlug: "express-architecture",
    order: 3,
    learningPoints: [
      "Middleware Function Signature `(req, res, next)`",
      "Custom Authentication Guards",
      "4-Argument Centralized Error Middleware `(err, req, res, next)`",
      "Preventing Hanging Requests with `next()`",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "Express Middleware Pipeline Architecture",
      },
      {
        type: "paragraph",
        content:
          "Middleware functions are the core building blocks of Express applications. A middleware function has access to the Request object (`req`), Response object (`res`), and the `next` function in the application's request-response cycle.",
      },
      {
        type: "diagram",
        title: "Express Middleware Execution Chain",
        data: {
          flow: [
            "Incoming Request -> Rate Limiter Middleware",
            "Passes next() -> Auth Guard (Token Verification)",
            "Passes next() -> Input Validation Middleware (Zod)",
            "Passes next() -> Controller (DB Operations)",
            "Errors caught -> Centralized Error Middleware (err, req, res, next)",
          ],
        },
      },
      {
        type: "heading",
        level: 2,
        content: "Writing a Custom Authentication Guard Middleware",
      },
      {
        type: "code",
        filename: "auth.middleware.ts",
        language: "typescript",
        code: `import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    // Stop pipeline and return 401 Unauthorized
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Access token missing"
    });
  }

  // If token is valid, pass control to the NEXT middleware in chain
  next();
};`,
      },
      {
        type: "heading",
        level: 2,
        content: "Centralized Error Handling Middleware (4 Arguments)",
      },
      {
        type: "code",
        filename: "error.middleware.ts",
        language: "typescript",
        code: `import { Request, Response, NextFunction } from 'express';

// Express identifies error handlers by EXPLICITLY having 4 arguments
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Unhandled Server Error:", err);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? "Internal server error" 
    : err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    error: message
  });
};`,
      },
      {
        type: "warning",
        title: "Always Call next() or Send a Response",
        content:
          "If a middleware neither calls `next()` nor sends a response (e.g. `res.json()`), the request will hang indefinitely until client timeout!",
      },
    ],
    quiz: [
      {
        id: "mid-q1",
        question: "What function must be invoked inside middleware to pass execution to the next handler?",
        options: ["next()", "continue()", "forward()", "proceed()"],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "`next()` passes control to the next middleware function in the execution pipeline.",
      },
      {
        id: "mid-q2",
        question: "How does Express distinguish a Centralized Error Handling Middleware from normal middleware?",
        options: [
          "By decorating it with `@ErrorHandler`",
          "By declaring exactly 4 arguments in its function signature: `(err, req, res, next)`",
          "By returning a boolean false value",
          "By placing it at the top of the file",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Express checks function arity (`fn.length === 4`) to identify error handling middleware.",
      },
      {
        id: "mid-q3",
        question: "What happens if a middleware function does NOT call `next()` and does NOT send a response?",
        options: [
          "The server restarts automatically",
          "The client request hangs indefinitely until a network timeout occurs",
          "Express throws a compile warning",
          "The route redirects to home page",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Failing to invoke `next()` or return a response causes request promises to hang indefinitely.",
      },
      {
        id: "mid-q4",
        question: "Where should the Centralized Error Middleware (`app.use(errorHandler)`) be registered in Express?",
        options: [
          "Before any routes are registered",
          "AFTER all route handlers and other middleware have been registered",
          "Inside `package.json`",
          "Inside a controller loop",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Error handling middleware must be placed LAST after all routes so caught errors propagate down to it.",
      },
      {
        id: "mid-q5",
        question: "How do you pass an asynchronous error caught in a try/catch block to Express error middleware?",
        options: ["next(error)", "throw new Error()", "res.send(error)", "process.emit(error)"],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "Passing an error to `next(error)` instructs Express to skip remaining routes and trigger error handlers.",
      },
    ],
  },

  // =========================================================================
  // MODULE 4: MongoDB & Database Engineering
  // =========================================================================
  {
    slug: "mongodb-fundamentals",
    title: "MongoDB Fundamentals & NoSQL Document Architecture",
    description: "Learn NoSQL database principles, JSON/BSON document storage, collections, dynamic schema flexibility, and indexing.",
    category: "Database",
    difficulty: "intermediate",
    duration: 40,
    xpReward: 150,
    moduleId: 4,
    moduleName: "MongoDB & Database Engineering",
    moduleSlug: "mongodb-engineering",
    order: 1,
    learningPoints: [
      "Relational Databases (SQL) vs Document Databases (NoSQL)",
      "JSON vs BSON Binary Document Storage",
      "Collections, Documents, and ObjectId Anatomy",
      "Indexing Strategies for Fast Lookup",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "MongoDB: High-Performance NoSQL Document Database",
      },
      {
        type: "paragraph",
        content:
          "MongoDB is a source-available, document-oriented NoSQL database. Instead of storing data in rigid tables and rows like SQL databases (PostgreSQL, MySQL), MongoDB stores data in flexible, hierarchical JSON-like documents called BSON (Binary JSON).",
      },
      {
        type: "heading",
        level: 2,
        content: "Comparing Relational SQL vs NoSQL MongoDB Terminology",
      },
      {
        type: "practice",
        items: [
          "Database -> Database",
          "Table -> Collection",
          "Row -> Document",
          "Column -> Field",
          "Primary Key (id) -> _id (12-byte ObjectId)",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "12-Byte MongoDB ObjectId Structure",
      },
      {
        type: "code",
        filename: "objectid-structure.txt",
        language: "text",
        code: `ObjectId("650000000000000000000100")
│ 4-byte Timestamp  │ 5-byte Random Value │ 3-byte Counter  │
│ (Seconds since    │ (Process & Host ID) │ (Incremental)   │
│  Unix Epoch)      │                     │                 │`,
      },
      {
        type: "tip",
        title: "MongoDB Indexing for Query Performance",
        content:
          "Without indexes, MongoDB performs a Collection Scan (examining every document in a collection). Adding indexes (e.g. `db.users.createIndex({ email: 1 })`) transforms query complexity from O(N) linear time to O(log N) B-Tree search time!",
      },
    ],
    quiz: [
      {
        id: "mongo-q1",
        question: "In what binary-encoded format does MongoDB store documents internally?",
        options: ["BSON (Binary JSON)", "XML", "YAML", "Protocol Buffers"],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "MongoDB stores records as BSON, an efficient binary representation of JSON documents.",
      },
      {
        id: "mongo-q2",
        question: "What is the MongoDB equivalent of a Relational SQL 'Table'?",
        options: ["Document", "Collection", "Schema", "Row"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "A Collection in MongoDB groups related BSON documents together, similar to a SQL Table.",
      },
      {
        id: "mongo-q3",
        question: "What is the total byte size of a standard MongoDB `_id` ObjectId?",
        options: ["4 bytes", "8 bytes", "12 bytes", "32 bytes"],
        correct: 2,
        correctOptionIndex: 2,
        explanation: "MongoDB ObjectIds are 12-byte binary values composed of timestamp, random value, and counter.",
      },
      {
        id: "mongo-q4",
        question: "What is the performance consequence of querying a non-indexed field in a collection of 5 million documents?",
        options: [
          "Query executes instantly in O(1) time",
          "MongoDB performs a full Collection Scan (inspecting 5M records), causing high latency",
          "MongoDB drops the connection",
          "Query automatically returns 404",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Without indexes, MongoDB must scan every document in the collection to match filters.",
      },
      {
        id: "mongo-q5",
        question: "Which index type is best for ensuring email addresses remain unique across a user collection?",
        options: ["Compound Index", "Unique Single Field Index", "Text Index", "TTL Index"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Creating a Unique Index on `{ email: 1 }` prevents insertion of duplicate email records.",
      },
    ],
  },
  {
    slug: "mongoose-odm",
    title: "Mongoose ODM & Schema Modeling",
    description: "Model application data using Mongoose Schemas, strong TypeScript interfaces, validation rules, and instance methods.",
    category: "Database",
    difficulty: "intermediate",
    duration: 40,
    xpReward: 150,
    moduleId: 4,
    moduleName: "MongoDB & Database Engineering",
    moduleSlug: "mongodb-engineering",
    order: 2,
    learningPoints: [
      "Mongoose Schema Definition",
      "TypeScript Interface Integration",
      "Built-in Validation & Custom Validators",
      "Automatic Timestamps (`createdAt`, `updatedAt`)",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "Data Modeling with Mongoose Object Data Modeling (ODM)",
      },
      {
        type: "paragraph",
        content:
          "Mongoose provides a straightforward, schema-based solution to model application data in Node.js. It includes built-in type casting, schema validation, query building, and middleware hooks.",
      },
      {
        type: "heading",
        level: 2,
        content: "Production Mongoose Model Definition Example",
      },
      {
        type: "code",
        filename: "User.ts",
        language: "typescript",
        code: `import mongoose, { Schema, Document } from 'mongoose';

// 1. TypeScript Interface for Compile-Time Safety
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  totalXP: number;
  role: 'student' | 'instructor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema for Runtime Validation & DB Rules
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    totalXP: {
      type: Number,
      default: 0,
      min: [0, "XP cannot be negative"],
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
  },
  { timestamps: true } // Auto-generates createdAt & updatedAt
);

// 3. Compile Model
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);`,
      },
      {
        type: "warning",
        title: "Preventing Mongoose Over-Overwrite in Next.js Hot Reloading",
        content:
          "In Next.js development, files re-evaluate on save. Always use `mongoose.models.User || mongoose.model('User', userSchema)` to avoid `Cannot overwrite 'User' model once compiled` errors!",
      },
    ],
    quiz: [
      {
        id: "mng-q1",
        question: "What is the primary role of Mongoose in a Node.js application?",
        options: [
          "To compile TypeScript to Assembly",
          "To provide a schema-based Object Data Modeling (ODM) layer for MongoDB",
          "To route incoming HTTP requests",
          "To encrypt SSL certificates",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Mongoose serves as an ODM layer, enabling typed schemas, validation, and queries for MongoDB.",
      },
      {
        id: "mng-q2",
        question: "How do you enable automatic `createdAt` and `updatedAt` field generation in Mongoose schemas?",
        options: [
          "Set `{ timestamps: true }` in schema options",
          "Manually call `Date.now()` inside a setInterval",
          "Timestamps are automatically created by Windows OS",
          "Add `useTimestamps()` in controller",
        ],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "Passing `{ timestamps: true }` as the second argument to `new Schema(...)` auto-manages timestamp fields.",
      },
      {
        id: "mng-q3",
        question: "Why is `mongoose.models.User || mongoose.model('User', userSchema)` used when instantiating models?",
        options: [
          "To prevent model re-compilation errors during hot module reloading in development",
          "To allow SQL queries on MongoDB",
          "To disable schema validation",
          "To compress database writes",
        ],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "It reuses existing compiled Mongoose models during serverless / hot-reload environments.",
      },
      {
        id: "mng-q4",
        question: "Which schema property enforces that a string field must match a predefined set of values?",
        options: ["enum", "choices", "matchList", "options"],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "The `enum` validation property restricts string inputs to a fixed array of allowed values.",
      },
      {
        id: "mng-q5",
        question: "Which Mongoose query option returns plain JavaScript objects instead of heavy Mongoose Hydrated Documents?",
        options: [".lean()", ".raw()", ".plain()", ".toObject()"],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "Calling `.lean()` bypasses Mongoose document overhead for significantly faster read-only queries.",
      },
    ],
  },
  {
    slug: "crud-apis",
    title: "CRUD API Integration & Complete Backend Pipeline",
    description: "Build production-grade Create, Read, Update, and Delete REST APIs connecting Express controllers to Mongoose models.",
    category: "Database",
    difficulty: "advanced",
    duration: 40,
    xpReward: 160,
    moduleId: 4,
    moduleName: "MongoDB & Database Engineering",
    moduleSlug: "mongodb-engineering",
    order: 3,
    learningPoints: [
      "Complete Request-to-Database Pipeline",
      "Mongoose CRUD Query Execution",
      "Input Validation with Zod before Database Operations",
      "Error Handling & Clean Status Code Responses",
    ],
    content: [
      {
        type: "heading",
        level: 1,
        content: "Connecting the Dots: Client -> Express -> Mongoose -> MongoDB",
      },
      {
        type: "paragraph",
        content:
          "In this final lesson, we assemble all concepts learned across the course into a complete, enterprise-ready CRUD backend pipeline.",
      },
      {
        type: "diagram",
        title: "Full-Stack Backend Request Pipeline",
        data: {
          flow: [
            "Client sends HTTP Request -> Express App listener",
            "Route matching -> Auth Middleware verifies JWT",
            "Zod Schema -> Validates req.body inputs",
            "Controller logic -> Mongoose queries MongoDB",
            "Mongoose returns BSON -> Controller sends HTTP 200/201 JSON",
          ],
        },
      },
      {
        type: "heading",
        level: 2,
        content: "Production CRUD Controller Implementation",
      },
      {
        type: "code",
        filename: "note.controller.ts",
        language: "typescript",
        code: `import { Request, Response } from 'express';
import { Note } from '../models/Note';

// 1. CREATE
export const createNote = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { lessonId, content } = req.body;

  const note = new Note({ userId, lessonId, content });
  await note.save();

  res.status(201).json({ success: true, data: note });
};

// 2. READ (List user notes)
export const getNotes = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const notes = await Note.find({ userId }).sort({ updatedAt: -1 }).lean();

  res.status(200).json({ success: true, data: { notes, total: notes.length } });
};

// 3. UPDATE (Scoped by userId to prevent IDOR vulnerabilities)
export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: id, userId: req.user.id }, // Ownership check!
    { content },
    { new: true, runValidators: true }
  );

  if (!note) return res.status(404).json({ success: false, error: "Note not found" });
  res.status(200).json({ success: true, data: note });
};

// 4. DELETE (Scoped by userId)
export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Note.deleteOne({ _id: id, userId: req.user.id });

  if (result.deletedCount === 0) {
    return res.status(404).json({ success: false, error: "Note not found" });
  }

  res.status(200).json({ success: true, message: "Note deleted successfully" });
};`,
      },
      {
        type: "tip",
        title: "Course Completion Milestone!",
        content:
          "Congratulations! You now understand the full request-response lifecycle, Node.js event loop, Express middleware pipeline, authentication security, and MongoDB database integration!",
      },
    ],
    quiz: [
      {
        id: "crud-q1",
        question: "Which Mongoose method performs an atomic update and returns the updated document when `{ new: true }` is specified?",
        options: ["findOneAndUpdate()", "updateOne()", "update()", "modifyOne()"],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "`findOneAndUpdate(filter, update, { new: true })` updates and returns the updated document.",
      },
      {
        id: "crud-q2",
        question: "Why should update and delete database queries explicitly include `{ userId: req.user.id }` in their filter criteria?",
        options: [
          "To speed up SQL join operations",
          "To enforce resource ownership authorization and prevent IDOR security vulnerabilities",
          "To enable CORS headers",
          "It is required by TypeScript compiler",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Scoping filters by authenticated `userId` ensures users can only modify or delete their own data.",
      },
      {
        id: "crud-q3",
        question: "Which HTTP status code should be returned when `deleteOne()` fails to match any resource ID?",
        options: ["200 OK", "404 Not Found", "500 Server Error", "401 Unauthorized"],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "If no resource matches the target ID, returning 404 Not Found accurately reflects the outcome.",
      },
      {
        id: "crud-q4",
        question: "What is the primary role of Zod or Joi input validation before calling database operations?",
        options: [
          "To format JavaScript strings to uppercase",
          "To reject malformed or malicious client inputs before executing database queries",
          "To create MongoDB collection indexes",
          "To store user cookies",
        ],
        correct: 1,
        correctOptionIndex: 1,
        explanation: "Validating input schemas early guards against invalid data injection and unexpected runtime crashes.",
      },
      {
        id: "crud-q5",
        question: "In a production REST API, what does a client receive upon sending a valid POST request to create a resource?",
        options: [
          "HTTP 201 Created status with the newly created resource payload in JSON format",
          "HTTP 500 Internal Error",
          "A blank HTML page",
          "HTTP 404 Not Found",
        ],
        correct: 0,
        correctOptionIndex: 0,
        explanation: "Successful resource creation returns HTTP 201 Created along with the created data payload.",
      },
    ],
  },
];

export const ALL_REAL_LESSONS: RealLessonDefinition[] = [
  ...COURSE1_LESSONS,
  ...ADDITIONAL_COURSES_LESSONS,
];
