import type { Challenge } from "./http";

export const NODE_CHALLENGES: Record<string, Challenge> = {
  create_module: {
    id: "create_module",
    title: "Create and Export a Module",
    description: "Create a JavaScript module that exports a function and import it in another file.",
    difficulty: "beginner",
    xpReward: 100,
    category: "Node.js",
    timeEstimate: 15,
    starterCode: `// math.js
// TODO: Export a function that adds two numbers

// main.js
// TODO: Import the add function and use it
console.log(add(5, 3)); // Should output: 8`,
    expectedOutput: `8`,
    hints: [
      "Use module.exports to export from math.js",
      "Use require() to import in main.js",
      "The function should take two parameters",
    ],
    solution: `// math.js
function add(a, b) {
  return a + b;
}

module.exports = add;

// main.js
const add = require('./math');
console.log(add(5, 3));`,
    testCases: [
      { name: "Function exports correctly", expectedOutput: "function" },
      { name: "Addition works correctly", expectedOutput: "8" },
      { name: "Module can be imported", expectedOutput: "success" },
    ],
    learningPoints: ["Module system", "CommonJS exports", "require() function"],
  },

  read_write_file: {
    id: "read_write_file",
    title: "Read and Write Files",
    description: "Create a program that reads a file, processes it, and writes the result to another file.",
    difficulty: "beginner",
    xpReward: 150,
    category: "Node.js",
    timeEstimate: 20,
    starterCode: `const fs = require('fs');

// TODO: Read data.txt
// TODO: Convert to uppercase
// TODO: Write to output.txt

console.log('File processed successfully');`,
    expectedOutput: `File processed successfully`,
    hints: [
      "Use fs.readFileSync() for synchronous reading",
      "Use fs.writeFileSync() for synchronous writing",
      "Use .toUpperCase() to convert to uppercase",
    ],
    solution: `const fs = require('fs');

const data = fs.readFileSync('data.txt', 'utf-8');
const uppercase = data.toUpperCase();
fs.writeFileSync('output.txt', uppercase);

console.log('File processed successfully');`,
    testCases: [
      { name: "Reads file successfully", expectedOutput: "read" },
      { name: "Writes file successfully", expectedOutput: "write" },
      { name: "Converts to uppercase", expectedOutput: "UPPERCASE" },
    ],
    learningPoints: ["File system operations", "Synchronous I/O", "String methods"],
  },

  event_emitter: {
    id: "event_emitter",
    title: "Create an Event Emitter",
    description: "Create a custom event emitter that can emit and listen to events.",
    difficulty: "intermediate",
    xpReward: 200,
    category: "Node.js",
    timeEstimate: 25,
    starterCode: `const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

// TODO: Create an instance
// TODO: Listen to 'message' event
// TODO: Emit the event

// Output should be: Message received: Hello`,
    expectedOutput: `Message received: Hello`,
    hints: [
      "Extend EventEmitter to create custom emitter",
      "Use .on() to listen to events",
      "Use .emit() to trigger events",
    ],
    solution: `const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter();

emitter.on('message', (msg) => {
  console.log('Message received:', msg);
});

emitter.emit('message', 'Hello');`,
    testCases: [
      { name: "Creates emitter instance", expectedOutput: "instance" },
      { name: "Listens to event", expectedOutput: "listen" },
      { name: "Emits event successfully", expectedOutput: "Hello" },
    ],
    learningPoints: ["Event-driven architecture", "EventEmitter class", "Custom events"],
  },
};
