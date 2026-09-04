import type { Challenge } from "./http";

export const MONGODB_CHALLENGES: Record<string, Challenge> = {
  connect_mongodb: {
    id: "connect_mongodb",
    title: "Connect to MongoDB",
    description: "Connect to a MongoDB database and verify the connection.",
    difficulty: "beginner",
    xpReward: 100,
    category: "MongoDB",
    timeEstimate: 15,
    starterCode: `const mongoose = require('mongoose');

// TODO: Connect to MongoDB
// TODO: Use connection string: mongodb://localhost:27017/myapp
// TODO: Handle connection events

console.log('Attempting connection...');`,
    expectedOutput: `Attempting connection...
Successfully connected to MongoDB`,
    hints: [
      "Use mongoose.connect() to establish connection",
      "Listen to 'connected' event",
      "Listen to 'error' event for failures",
    ],
    solution: `const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp').then(() => {
  console.log('Successfully connected to MongoDB');
}).catch((err) => {
  console.error('Connection failed:', err);
});

console.log('Attempting connection...');`,
    testCases: [
      { name: "Connection string is valid", expectedOutput: "mongodb" },
      { name: "Handles connection event", expectedOutput: "connected" },
      { name: "Error handling exists", expectedOutput: "error" },
    ],
    learningPoints: ["Mongoose connection", "MongoDB basics", "async operations"],
  },

  create_schema: {
    id: "create_schema",
    title: "Create a MongoDB Schema",
    description: "Create a Mongoose schema for a User collection.",
    difficulty: "beginner",
    xpReward: 150,
    category: "MongoDB",
    timeEstimate: 20,
    starterCode: `const mongoose = require('mongoose');

// TODO: Create a User schema with:
// - name (String, required)
// - email (String, unique, required)
// - age (Number)
// - createdAt (Date, default to now)

const userSchema = new mongoose.Schema({
  // Your fields here
});

const User = mongoose.model('User', userSchema);

module.exports = User;`,
    expectedOutput: `User schema created with 4 fields`,
    hints: [
      "Use mongoose.Schema() to create schema",
      "Add required validation with { type: String, required: true }",
      "Set unique constraint with { unique: true }",
    ],
    solution: `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: Number,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;`,
    testCases: [
      { name: "Schema has name field", expectedOutput: "name" },
      { name: "Schema has email field", expectedOutput: "email" },
      { name: "Schema has validation", expectedOutput: "required" },
    ],
    learningPoints: ["Schema creation", "Field validation", "Data types"],
  },

  crud_operations: {
    id: "crud_operations",
    title: "CRUD Operations with MongoDB",
    description: "Perform Create, Read, Update, Delete operations on a MongoDB collection.",
    difficulty: "intermediate",
    xpReward: 250,
    category: "MongoDB",
    timeEstimate: 30,
    starterCode: `const mongoose = require('mongoose');
const User = require('./user-model');

// TODO: Create a new user
// TODO: Read all users
// TODO: Update a user
// TODO: Delete a user

async function run() {
  // Your code here
}`,
    expectedOutput: `Created: John
All users: [John, Jane]
Updated: John (age: 30)
Deleted: John`,
    hints: [
      "Use User.create() or new User() + .save()",
      "Use User.find() to read all documents",
      "Use User.findByIdAndUpdate() to update",
      "Use User.findByIdAndDelete() to delete",
    ],
    solution: `const mongoose = require('mongoose');
const User = require('./user-model');

async function run() {
  const user = await User.create({ name: 'John', email: 'john@example.com' });
  console.log('Created:', user.name);
  
  const users = await User.find();
  console.log('All users:', users.map(u => u.name));
  
  const updated = await User.findByIdAndUpdate(user._id, { age: 30 }, { new: true });
  console.log('Updated:', updated.name, '(age:', updated.age + ')');
  
  await User.findByIdAndDelete(user._id);
  console.log('Deleted:', user.name);
}`,
    testCases: [
      { name: "Create operation works", expectedOutput: "Created" },
      { name: "Read operation works", expectedOutput: "find" },
      { name: "Update operation works", expectedOutput: "Updated" },
      { name: "Delete operation works", expectedOutput: "Deleted" },
    ],
    learningPoints: ["CRUD operations", "async/await", "MongoDB queries"],
  },
};
