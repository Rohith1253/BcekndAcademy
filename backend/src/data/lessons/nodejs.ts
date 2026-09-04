import type { LessonData } from "@/data/lessons/types";

export const nodejsLesson: LessonData = {
  id: "nodejs-001",
  slug: "nodejs",
  title: "Node.js Runtime",
  description: "Build backend servers with Node.js, the JavaScript runtime that powers modern web development.",
  difficulty: "Intermediate",
  duration: 45,
  xpReward: 200,
  moduleId: 5,
  moduleName: "Node.js",
  prerequisites: ["HTTP & HTTPS", "Client-Server Architecture"],
  skillsLearned: ["Node.js Basics", "Event Loop", "Modules", "File System"],
  content: [
    {
      type: "heading",
      level: 1,
      content: "Node.js: Running JavaScript on the Backend",
    },
    {
      type: "paragraph",
      content:
        "Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows you to run JavaScript outside the browser, making it possible to build backend servers and CLI tools.",
    },
    {
      type: "heading",
      level: 2,
      content: "Why Node.js?",
    },
    {
      type: "practice",
      items: [
        "Event-driven, non-blocking I/O model",
        "Single-threaded but highly scalable",
        "Large ecosystem via npm",
        "Full-stack JavaScript development",
        "Fast execution with V8 engine",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "Your First Node.js Script",
    },
    {
      type: "code",
      language: "javascript",
      filename: "hello.js",
      code: `console.log("Hello, Node.js!");

const name = "Backend Developer";
console.log(\`Welcome, \${name}!\`);
`,
    },
    {
      type: "tip",
      title: "Running Node Scripts",
      content: "Save the code above as hello.js and run it with: node hello.js",
    },
    {
      type: "heading",
      level: 2,
      content: "The Event Loop",
    },
    {
      type: "paragraph",
      content:
        "Node.js uses an event-driven, non-blocking I/O model. The event loop allows Node to handle multiple requests concurrently without blocking.",
    },
    {
      type: "diagram",
      title: "Node.js Event Loop",
      data: {
        phases: ["timers", "pending callbacks", "idle/prepare", "poll", "check", "close callbacks"],
      },
    },
    {
      type: "heading",
      level: 2,
      content: "Modules and require()",
    },
    {
      type: "code",
      language: "javascript",
      filename: "app.js",
      code: `// Import built-in module
const fs = require('fs');

// Read a file
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
`,
    },
    {
      type: "warning",
      title: "Asynchronous Operations",
      content:
        "Many Node.js operations are asynchronous. Use callbacks, promises, or async/await to handle results.",
    },
    {
      type: "example",
      title: "Building a Simple Server",
      content:
        "Node.js comes with a built-in 'http' module. You can create a basic HTTP server in just a few lines of code.",
    },
  ],
  quiz: [
    {
      id: "q1",
      question: "What engine powers Node.js?",
      options: ["SpiderMonkey", "JavaScriptCore", "V8", "Chakra"],
      correct: 2,
      explanation: "Node.js uses Chrome's V8 engine to execute JavaScript.",
    },
    {
      id: "q2",
      question: "How do you run a Node.js script?",
      options: ["npm script.js", "node script.js", "javascript script.js", "run script.js"],
      correct: 1,
      explanation: "Use the 'node' command followed by the script filename: node script.js",
    },
    {
      id: "q3",
      question: "Which module is used to read files in Node.js?",
      options: ["http", "fs", "path", "events"],
      correct: 1,
      explanation: "The 'fs' (file system) module is used to read, write, and manipulate files.",
    },
    {
      id: "q4",
      question: "Is Node.js single-threaded?",
      options: ["Yes, always", "No, multi-threaded", "Yes, but the event loop makes it scalable", "Depends on OS"],
      correct: 2,
      explanation: "Node.js is single-threaded, but the event loop and non-blocking I/O make it highly scalable.",
    },
    {
      id: "q5",
      question: "What is the 'require()' function used for?",
      options: [
        "Creating new files",
        "Importing modules",
        "Running scripts",
        "Installing packages",
      ],
      correct: 1,
      explanation: "'require()' is used to import modules and make their exports available in your code.",
    },
  ],
};
