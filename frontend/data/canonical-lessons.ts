/**
 * canonical-lessons.ts
 *
 * Rich educational lesson definitions structured around the 10-part pedagogical schema:
 * 1. Title & What is it?
 * 2. Why does it matter?
 * 3. Real-world analogy
 * 4. Simple explanation
 * 5. Conceptual example
 * 6. Technical explanation
 * 7. Code example / Snippet
 * 8. Common mistakes / confusions
 * 9. Mini practice
 * 10. Quick recap
 */

import type { CurriculumLesson } from "@/lib/curriculum-types";

export const CANONICAL_LESSONS: CurriculumLesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LEVEL 0: COMPUTER & SOFTWARE FOUNDATIONS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "l0-hardware-cpu-ram",
    slug: "computer-hardware-cpu-ram",
    title: "How Computers Work: Hardware, CPU, RAM & Storage",
    description: "Understand the physical and electrical components inside a computer and how they compute instructions.",
    courseSlug: "computer-software-foundations",
    moduleSlug: "hardware-computation",
    language: "agnostic",
    level: "Level 0",
    levelOrder: 0,
    courseOrder: 0,
    moduleOrder: 1,
    lessonOrder: 1,
    estimatedMinutes: 15,
    difficulty: "foundation",
    prerequisites: [],
    learningObjectives: [
      "Understand the distinct roles of the CPU, RAM, and Persistent Storage",
      "Learn how electrical switches (transistors) represent binary states (0 and 1)",
      "Explain why RAM is temporary (volatile) and storage is permanent"
    ],
    concepts: ["CPU", "RAM", "Volatile Memory", "Solid State Storage", "Binary Logic"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "Backend servers are real physical machines. When an API server crashes due to 'Out of Memory', you need to know why RAM is limited and how memory leaks happen.",
    realWorldAnalogy: "Imagine an office desk: The CPU is the worker's brain. The RAM is the top of the desk where documents are kept while being worked on. The Storage (Hard Drive) is the filing cabinet across the room where files are saved permanently.",
    codeSnippet: "// Conceptual Model:\nCPU.clockCycle -> Fetch Instruction -> Decode -> Execute -> Write to RAM/Register",
    commonMistakes: [
      "Confusing RAM with Hard Drive Storage (RAM loses all data when power is turned off; storage retains it).",
      "Assuming the CPU can read directly from a hard drive at high speeds without loading into RAM first."
    ],
    quickRecap: [
      "CPU performs calculations and processes instructions billions of times per second.",
      "RAM holds active program state and variables for immediate ultra-fast access.",
      "Storage (SSD/HDD) retains files permanently even after reboot."
    ],
    starterCode: `// Log a message showing how memory values are calculated in CPU
const ramSlotA = 25;
const ramSlotB = 15;
const cpuResult = ramSlotA + ramSlotB;
console.log("Computation in CPU:", cpuResult);`,
    solutionCode: `const ramSlotA = 25;
const ramSlotB = 15;
const cpuResult = ramSlotA + ramSlotB;
console.log("Computation in CPU:", cpuResult);`
  },
  {
    id: "l0-operating-systems",
    slug: "operating-systems-software",
    title: "Operating Systems, Kernels & Processes",
    description: "Learn what an Operating System does: managing CPU time, allocating memory, and isolating processes.",
    courseSlug: "computer-software-foundations",
    moduleSlug: "software-architecture",
    language: "agnostic",
    level: "Level 0",
    levelOrder: 0,
    courseOrder: 0,
    moduleOrder: 2,
    lessonOrder: 2,
    estimatedMinutes: 15,
    difficulty: "foundation",
    prerequisites: ["computer-hardware-cpu-ram"],
    learningObjectives: [
      "Understand what the Operating System Kernel manages",
      "Learn the difference between a Program (code on disk) and a Process (running program in memory)",
      "Understand system calls (syscalls) for file and network access"
    ],
    concepts: ["Operating System", "Kernel", "Processes", "Threads", "System Calls"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "Backend apps run as operating system processes (like a Node.js or Python process) on Linux servers. Understanding processes is essential for production deployment.",
    realWorldAnalogy: "The Operating System is like an air traffic control tower. It decides which airplane (process) gets runway time (CPU), assigns parking gates (RAM), and prevents crashes.",
    codeSnippet: "// Process state lifecycle:\nDisk (Binary file) -> OS Loader -> Memory (Allocated Heap/Stack) -> Active Process PID",
    commonMistakes: [
      "Believing software talks directly to the hardware without going through the OS Kernel.",
      "Thinking multiple programs running at once means a single CPU core is doing everything simultaneously (it rapidly switches time slices)."
    ],
    quickRecap: [
      "The Kernel is the core of the OS that bridges applications with hardware.",
      "A process is an isolated instance of an executing program with its own memory space.",
      "Servers typically run on Linux operating systems."
    ],
    starterCode: `// Inspect simulated process information
const mockProcess = {
  pid: 4028,
  memoryUsageMb: 48.5,
  status: "running"
};
console.log("Process ID:", mockProcess.pid);
console.log("Memory Allocated:", mockProcess.memoryUsageMb + "MB");`,
    solutionCode: `const mockProcess = { pid: 4028, memoryUsageMb: 48.5, status: "running" };
console.log("Process ID:", mockProcess.pid);
console.log("Memory Allocated:", mockProcess.memoryUsageMb + "MB");`
  },
  {
    id: "l0-what-is-programming",
    slug: "what-is-programming-code",
    title: "What is Programming? Giving Instructions to Machines",
    description: "Understand what code actually is: unambiguous step-by-step instructions that tell a computer how to manipulate data.",
    courseSlug: "computer-software-foundations",
    moduleSlug: "programming-foundations",
    language: "agnostic",
    level: "Level 0",
    levelOrder: 0,
    courseOrder: 0,
    moduleOrder: 3,
    lessonOrder: 3,
    estimatedMinutes: 15,
    difficulty: "foundation",
    prerequisites: ["operating-systems-software"],
    learningObjectives: [
      "Define what a programming language is and why human languages don't work for computers",
      "Understand precision and syntax rules in software development",
      "Learn the concept of Inputs, Processing, and Outputs (IPO model)"
    ],
    concepts: ["Instructions", "Syntax", "IPO Model", "Determinism", "Algorithms"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "Computers have zero intuition. If you miss a semicolon, forget a closing bracket, or give an ambiguous command, the computer stops.",
    realWorldAnalogy: "A recipe for baking a cake: If the recipe says 'add some sugar', a human might guess. A computer will crash because 'some' is not a defined quantity.",
    codeSnippet: "// Input -> Process -> Output\nconst userInput = 'alex@example.com';\nconst isValid = userInput.includes('@');\nconsole.log('Email Valid:', isValid);",
    commonMistakes: [
      "Assuming computers can understand intent or guess what you meant.",
      "Getting discouraged by syntax errors (syntax errors simply mean the grammar wasn't exact)."
    ],
    quickRecap: [
      "Programming is writing precise, unambiguous instructions.",
      "The IPO model: Every program receives Input, Performs computation, and produces Output.",
      "Syntax is the grammatical rules of a programming language."
    ],
    starterCode: `// 1. Input
const orderAmount = 100;
const shippingCost = 15;

// 2. Process
const total = orderAmount + shippingCost;

// 3. Output
console.log("Order Total: $" + total);`,
    solutionCode: `const orderAmount = 100;
const shippingCost = 15;
const total = orderAmount + shippingCost;
console.log("Order Total: $" + total);`
  },
  {
    id: "l0-compilers-interpreters",
    slug: "how-code-runs-compilers-interpreters",
    title: "How Code Runs: Compilers, Interpreters & Runtimes",
    description: "Learn how human-readable source code is translated into machine binary (0s and 1s) by compilers and interpreters.",
    courseSlug: "computer-software-foundations",
    moduleSlug: "runtime-systems",
    language: "agnostic",
    level: "Level 0",
    levelOrder: 0,
    courseOrder: 0,
    moduleOrder: 4,
    lessonOrder: 4,
    estimatedMinutes: 20,
    difficulty: "foundation",
    prerequisites: ["what-is-programming-code"],
    learningObjectives: [
      "Differentiate between Ahead-Of-Time (AOT) Compilers and Interpreters",
      "Understand Just-In-Time (JIT) compilation in modern runtimes (V8, JVM)",
      "Learn what machine code / binary is"
    ],
    concepts: ["Compiler", "Interpreter", "Bytecode", "JIT Compiler", "Machine Code"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "Different backend languages execute differently. Go is compiled directly to native binary; Node.js and Python use runtimes with JIT engines.",
    realWorldAnalogy: "A compiler is like translating a whole book into another language before printing it. An interpreter is like a live translator speaking sentence-by-sentence during a speech.",
    codeSnippet: "// Compilation pipeline:\nSource Code (.ts / .go / .java) -> AST -> Bytecode/Machine Code -> CPU Execution",
    commonMistakes: [
      "Thinking all programming languages run at the same speed (compiled languages like Go/C++ avoid runtime interpretation overhead).",
      "Confusing a source code file (.js, .py) with the executable program."
    ],
    quickRecap: [
      "Compilers translate all code to binary before running (e.g. Go, Rust, C++).",
      "Interpreters execute code line-by-line via a runtime engine (e.g. Python, PHP).",
      "JIT runtimes combine both approaches for maximum performance (e.g. Node.js V8, Java JVM)."
    ],
    starterCode: `// Demonstrating runtime execution speed
const start = Date.now();
let count = 0;
for (let i = 0; i < 100000; i++) {
  count += 1;
}
const duration = Date.now() - start;
console.log("Calculated 100,000 operations in: " + duration + "ms");`,
    solutionCode: `const start = Date.now();
let count = 0;
for (let i = 0; i < 100000; i++) {
  count += 1;
}
const duration = Date.now() - start;
console.log("Calculated 100,000 operations in: " + duration + "ms");`
  },
  {
    id: "l0-developer-tools",
    slug: "developer-tools-terminals",
    title: "Developer Tools: Filesystems, Code Editors & Terminals",
    description: "Familiarize yourself with directory structures, file paths, code editors, and the command-line terminal.",
    courseSlug: "computer-software-foundations",
    moduleSlug: "developer-tooling",
    language: "agnostic",
    level: "Level 0",
    levelOrder: 0,
    courseOrder: 0,
    moduleOrder: 5,
    lessonOrder: 5,
    estimatedMinutes: 20,
    difficulty: "foundation",
    prerequisites: ["how-code-runs-compilers-interpreters"],
    learningObjectives: [
      "Understand directory trees, absolute paths, and relative paths",
      "Learn basic terminal commands (`cd`, `ls`/`dir`, `pwd`, `mkdir`)",
      "Understand the role of IDEs (VS Code) and code linters"
    ],
    concepts: ["Filesystem", "Relative Path", "Absolute Path", "CLI / Terminal", "IDE"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "Backend developers do not use graphical buttons on production cloud servers. Everything is configured and deployed via the Linux terminal.",
    realWorldAnalogy: "A filesystem is like a filing cabinet with folders inside folders. An absolute path is a full mailing address with country, state, and street. A relative path is directions from where you are standing right now.",
    codeSnippet: "// Path concepts:\n// Absolute: /var/www/api/server.js\n// Relative: ./routes/auth.js",
    commonMistakes: [
      "Mixing up relative paths (e.g. `./config.json` vs `../config.json`).",
      "Fearing the terminal: the terminal is simply a text-based way to talk to the operating system."
    ],
    quickRecap: [
      "Filesystems organize files into hierarchical trees.",
      "The terminal is the developer's primary control panel for running scripts and deploying servers.",
      "Code editors provide syntax highlighting, linting, and error detection."
    ],
    starterCode: `// Simulating path resolution in backend engineering
const basePath = "/var/www/api";
const relativeRoute = "controllers/userController.js";
const fullPath = basePath + "/" + relativeRoute;
console.log("Target Module Path:", fullPath);`,
    solutionCode: `const basePath = "/var/www/api";
const relativeRoute = "controllers/userController.js";
const fullPath = basePath + "/" + relativeRoute;
console.log("Target Module Path:", fullPath);`
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEVEL 1: UNIVERSAL PROGRAMMING FUNDAMENTALS (LANGUAGE INDEPENDENT)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "l1-logic-thinking",
    slug: "logic-step-by-step",
    title: "Programming Logic & Step-by-Step Thinking",
    description: "Learn how to think like a programmer: breaking complex goals into small, sequential, deterministic steps.",
    courseSlug: "universal-programming-fundamentals",
    moduleSlug: "programming-logic",
    language: "agnostic",
    level: "Level 1",
    levelOrder: 1,
    courseOrder: 1,
    moduleOrder: 1,
    lessonOrder: 1,
    estimatedMinutes: 15,
    difficulty: "foundation",
    prerequisites: ["developer-tools-terminals"],
    learningObjectives: [
      "Master linear step-by-step problem decomposition",
      "Understand why sequence and ordering matter in execution",
      "Learn to identify missing intermediate steps in logic"
    ],
    concepts: ["Sequential Logic", "Problem Decomposition", "Determinism"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "Backend bugs usually aren't syntax errors; they are logic errors where steps were performed in the wrong order (e.g. charging a card before checking inventory).",
    realWorldAnalogy: "Putting on shoes: You must put on socks BEFORE shoes. If you reverse the sequence, the outcome fails even though both actions were valid.",
    codeSnippet: "STEP 1: Verify user credentials\nSTEP 2: Query database for balance\nSTEP 3: Deduct payment\nSTEP 4: Send confirmation receipt",
    commonMistakes: [
      "Trying to solve the whole problem in one giant leap instead of breaking it into 4-5 atomic steps."
    ],
    quickRecap: [
      "All code executes in strict sequential order unless altered by control flow.",
      "Decomposition is the skill of turning a big problem into manageable sub-tasks."
    ],
    starterCode: `// Step 1: User request
const requestedSeats = 2;
let availableSeats = 5;

// Step 2: Validation
if (availableSeats >= requestedSeats) {
  // Step 3: Deduction
  availableSeats -= requestedSeats;
  console.log("Booking Confirmed. Remaining seats:", availableSeats);
} else {
  console.log("Booking Failed: Insufficient seats.");
}`,
    solutionCode: `const requestedSeats = 2;
let availableSeats = 5;
if (availableSeats >= requestedSeats) {
  availableSeats -= requestedSeats;
  console.log("Booking Confirmed. Remaining seats:", availableSeats);
} else {
  console.log("Booking Failed: Insufficient seats.");
}`
  },
  {
    id: "l1-algorithms",
    slug: "algorithms-computational-steps",
    title: "Algorithms: The Step-by-Step Recipe for Solutions",
    description: "Understand what an algorithm is: a well-defined sequence of steps that takes an input and produces a correct output.",
    courseSlug: "universal-programming-fundamentals",
    moduleSlug: "algorithms",
    language: "agnostic",
    level: "Level 1",
    levelOrder: 1,
    courseOrder: 1,
    moduleOrder: 2,
    lessonOrder: 2,
    estimatedMinutes: 15,
    difficulty: "foundation",
    prerequisites: ["logic-step-by-step"],
    learningObjectives: [
      "Define what makes an algorithm correct and efficient",
      "Understand common algorithmic patterns (searching, sorting, filtering)",
      "Learn how to trace algorithms with pencil and paper"
    ],
    concepts: ["Algorithm", "Correctness", "Efficiency", "Searching", "Filtering"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "Every backend endpoint runs algorithms: calculating shipping tax, searching for products, or sorting database query results.",
    realWorldAnalogy: "Looking up a word in a dictionary: You don't read every page from start to finish. You open to the middle and check if your word is earlier or later (binary search).",
    codeSnippet: "ALGORITHM FindMax(numbers):\n  SET max = numbers[0]\n  FOR EACH n IN numbers:\n    IF n > max THEN max = n\n  RETURN max",
    commonMistakes: [
      "Thinking algorithms are complex mathematics. An algorithm is simply a step-by-step procedure."
    ],
    quickRecap: [
      "An algorithm is a finite sequence of well-defined steps.",
      "A good algorithm is correct, predictable, and handles edge cases."
    ],
    starterCode: `// Algorithmic search for active user
const users = [
  { id: 1, name: "Sam", active: false },
  { id: 2, name: "Alex", active: true },
  { id: 3, name: "Jordan", active: false }
];

let firstActive = null;
for (const u of users) {
  if (u.active) {
    firstActive = u;
    break; // stop searching once found
  }
}
console.log("First Active User:", firstActive.name);`,
    solutionCode: `const users = [{ id: 1, name: "Sam", active: false }, { id: 2, name: "Alex", active: true }, { id: 3, name: "Jordan", active: false }];
let firstActive = null;
for (const u of users) { if (u.active) { firstActive = u; break; } }
console.log("First Active User:", firstActive.name);`
  },
  {
    id: "l1-variables-data",
    slug: "variables-concept-memory",
    title: "Variables & Memory: Storing and Labeling Data",
    description: "Understand variables as labeled storage slots in memory that hold numbers, strings, and booleans.",
    courseSlug: "universal-programming-fundamentals",
    moduleSlug: "variables-types",
    language: "agnostic",
    level: "Level 1",
    levelOrder: 1,
    courseOrder: 1,
    moduleOrder: 3,
    lessonOrder: 3,
    estimatedMinutes: 15,
    difficulty: "foundation",
    prerequisites: ["algorithms-computational-steps"],
    learningObjectives: [
      "Understand variable declaration vs assignment",
      "Differentiate between mutable (changeable) and immutable (constant) values",
      "Learn how variable naming conventions communicate intent"
    ],
    concepts: ["Variables", "Constants", "Assignment", "Memory Address", "Naming Conventions"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "Backend servers constantly track state: current database connections, session tokens, request headers, and cache counters.",
    realWorldAnalogy: "A labeled storage box: The box has a label on the outside ('userScore') and a value inside (100). You can inspect the box or swap the item inside.",
    codeSnippet: "DECLARE CONSTANT API_VERSION = 'v1'\nDECLARE VARIABLE userCount = 0\nuserCount = userCount + 1",
    commonMistakes: [
      "Confusing the assignment operator `=` with mathematical equality `==`.",
      "Using single-letter vague names (e.g. `x`, `y`) instead of descriptive names (`userEmail`, `totalPrice`)."
    ],
    quickRecap: [
      "Variables allocate a named slot in computer memory.",
      "Use constants for values that never change during program execution.",
      "Clear naming makes code readable and self-documenting."
    ],
    starterCode: `// Declare constants and variables
const SERVER_PORT = 8080;
let activeConnections = 12;

// Update state
activeConnections += 1;

console.log("Server listening on port:", SERVER_PORT);
console.log("Active Client Connections:", activeConnections);`,
    solutionCode: `const SERVER_PORT = 8080;
let activeConnections = 12;
activeConnections += 1;
console.log("Server listening on port:", SERVER_PORT);
console.log("Active Client Connections:", activeConnections);`
  },
  {
    id: "l1-conditions-logic",
    slug: "conditions-branching-logic",
    title: "Conditions & Decision Making: If / Else Logic",
    description: "Control the path of program execution using Boolean logic: evaluating true or false conditions to make decisions.",
    courseSlug: "universal-programming-fundamentals",
    moduleSlug: "control-flow",
    language: "agnostic",
    level: "Level 1",
    levelOrder: 1,
    courseOrder: 1,
    moduleOrder: 4,
    lessonOrder: 4,
    estimatedMinutes: 15,
    difficulty: "foundation",
    prerequisites: ["variables-concept-memory"],
    learningObjectives: [
      "Master `if`, `else if`, and `else` branching",
      "Understand comparison operators (`>`, `<`, `==`, `!=`, `>=`, `<=`)",
      "Combine conditions using logical AND (`&&`) and logical OR (`||`)"
    ],
    concepts: ["Boolean Logic", "Branching", "Comparison Operators", "Logical Operators"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "Authentication, authorization, validation, and error boundaries all rely entirely on conditions (e.g. 'If user is admin, allow delete; else return 403 Forbidden').",
    realWorldAnalogy: "A traffic light: IF light is green THEN proceed; ELSE IF light is yellow THEN slow down; ELSE stop.",
    codeSnippet: "IF userRole == 'admin' AND isAuthenticated == true THEN\n  ALLOW access\nELSE\n  DENY access\nEND IF",
    commonMistakes: [
      "Forgetting that `else` catches all cases where the preceding condition evaluated to false.",
      "Confusing `&&` (both must be true) with `||` (at least one must be true)."
    ],
    quickRecap: [
      "Conditions evaluate expressions to either `true` or `false`.",
      "Branching allows code to execute different paths based on runtime data."
    ],
    starterCode: `const userRole = "admin";
const isAccountActive = true;

if (userRole === "admin" && isAccountActive) {
  console.log("Status: 200 OK — Admin Dashboard Access Granted");
} else {
  console.log("Status: 403 Forbidden — Access Restricted");
}`,
    solutionCode: `const userRole = "admin";
const isAccountActive = true;
if (userRole === "admin" && isAccountActive) {
  console.log("Status: 200 OK — Admin Dashboard Access Granted");
} else {
  console.log("Status: 403 Forbidden — Access Restricted");
}`
  },
  {
    id: "l1-functions-procedures",
    slug: "functions-reusable-procedures",
    title: "Functions: Reusable Procedures, Inputs & Outputs",
    description: "Package repeatable logic into named functions that accept parameters and return computed values.",
    courseSlug: "universal-programming-fundamentals",
    moduleSlug: "functions-procedures",
    language: "agnostic",
    level: "Level 1",
    levelOrder: 1,
    courseOrder: 1,
    moduleOrder: 5,
    lessonOrder: 5,
    estimatedMinutes: 20,
    difficulty: "foundation",
    prerequisites: ["conditions-branching-logic"],
    learningObjectives: [
      "Understand function declaration, parameter passing, and return values",
      "Learn the DRY principle (Don't Repeat Yourself)",
      "Understand variable scope inside vs outside a function"
    ],
    concepts: ["Functions", "Parameters", "Return Value", "Scope", "DRY Principle"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "In backend architectures, controllers, middleware, and database queries are all functions. Functions isolate business logic and make systems testable.",
    realWorldAnalogy: "A blender: You put ingredients in (parameters), press a button (function execution), and get a smoothie out (return value).",
    codeSnippet: "FUNCTION CalculateTax(subtotal, taxRate):\n  DECLARE tax = subtotal * taxRate\n  RETURN subtotal + tax\nEND FUNCTION",
    commonMistakes: [
      "Confusing `console.log()` with `return` (`console.log` only prints to the screen; `return` gives the value back to the caller).",
      "Calling a function without saving or using its return value."
    ],
    quickRecap: [
      "Functions encapsulate reusable tasks.",
      "Parameters are the inputs given to the function.",
      "The `return` keyword hands the computed result back to the caller."
    ],
    starterCode: `// Write a pure utility function
function calculateInvoiceTotal(itemsSubtotal, discountPercent = 0) {
  const discountAmount = itemsSubtotal * (discountPercent / 100);
  return itemsSubtotal - discountAmount;
}

const invoice1 = calculateInvoiceTotal(200, 10); // $200 with 10% off
console.log("Final Invoice Amount: $" + invoice1);`,
    solutionCode: `function calculateInvoiceTotal(itemsSubtotal, discountPercent = 0) {
  const discountAmount = itemsSubtotal * (discountPercent / 100);
  return itemsSubtotal - discountAmount;
}
const invoice1 = calculateInvoiceTotal(200, 10);
console.log("Final Invoice Amount: $" + invoice1);`
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEVEL 2: JAVASCRIPT FOUNDATIONS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "js-variables-es6",
    slug: "js-variables-data-types",
    title: "JavaScript Variables, Data Types & Scope",
    description: "Master `const`, `let`, primitive data types (string, number, boolean, null, undefined, symbol, bigint), and block scope.",
    courseSlug: "javascript-foundations",
    moduleSlug: "js-core-syntax",
    language: "javascript",
    level: "Level 2",
    levelOrder: 2,
    courseOrder: 2,
    moduleOrder: 1,
    lessonOrder: 1,
    estimatedMinutes: 20,
    difficulty: "beginner",
    prerequisites: ["functions-reusable-procedures"],
    learningObjectives: [
      "Understand the difference between `const`, `let`, and legacy `var`",
      "Learn the 7 primitive types and reference types (Objects/Arrays)",
      "Master block scope `{ }` and temporal dead zone (TDZ)"
    ],
    concepts: ["const / let", "Block Scope", "Primitives vs References", "typeof operator"],
    practiceAvailable: true,
    executionSupport: "interactive",
    whyItMatters: "Backend JavaScript (Node.js) relies on strict immutable configuration constants and block-scoped variables to prevent state corruption in concurrent requests.",
    realWorldAnalogy: "A whiteboard in a conference room: `let` is writing in erasable marker; `const` is writing on a permanent placard bolted to the wall.",
    codeSnippet: "const PORT = process.env.PORT || 5000;\nlet requestCount = 0;\nrequestCount += 1;",
    commonMistakes: [
      "Reassigning a `const` variable (throws `TypeError: Assignment to constant variable`).",
      "Assuming `const obj = {}` prevents mutating object properties (it only prevents reassigning the variable binding)."
    ],
    quickRecap: [
      "Use `const` by default for all variables; use `let` only when you must reassign a value.",
      "Primitives are immutable and passed by value; objects/arrays are passed by reference."
    ],
    starterCode: `const API_HOST = "api.backendacademy.org";
let connectedClients = 0;

// Increment client count
connectedClients += 5;

console.log("Host:", API_HOST);
console.log("Connected Clients:", connectedClients);`,
    solutionCode: `const API_HOST = "api.backendacademy.org";
let connectedClients = 0;
connectedClients += 5;
console.log("Host:", API_HOST);
console.log("Connected Clients:", connectedClients);`
  }
];

export function getLessonBySlug(slug: string): CurriculumLesson | undefined {
  return CANONICAL_LESSONS.find((l) => l.slug === slug);
}

export function getLessonsForCourse(courseSlug: string): CurriculumLesson[] {
  return CANONICAL_LESSONS.filter((l) => l.courseSlug === courseSlug).sort(
    (a, b) => a.lessonOrder - b.lessonOrder
  );
}
