import type { Challenge } from "./http";

export const AUTHENTICATION_CHALLENGES: Record<string, Challenge> = {
  password_hashing: {
    id: "password_hashing",
    title: "Hash User Passwords",
    description: "Use bcrypt to hash and compare user passwords securely.",
    difficulty: "intermediate",
    xpReward: 200,
    category: "Authentication",
    timeEstimate: 20,
    starterCode: `const bcrypt = require('bcrypt');

// TODO: Hash a password
const password = 'mySecurePassword123';
// const hashedPassword = await bcrypt.hash(password, 10);

// TODO: Compare password with hash
// const isMatch = await bcrypt.compare(password, hashedPassword);
// console.log('Password match:', isMatch); // true`,
    expectedOutput: `Password hashed successfully
Password match: true`,
    hints: [
      "Use bcrypt.hash() with salt rounds (10 is common)",
      "Use bcrypt.compare() to verify passwords",
      "Both methods are async - use await or .then()",
    ],
    solution: `const bcrypt = require('bcrypt');

async function main() {
  const password = 'mySecurePassword123';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Password hashed successfully');
  
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Password match:', isMatch);
}

main();`,
    testCases: [
      { name: "Hash function works", expectedOutput: "hash" },
      { name: "Compare function works", expectedOutput: "compare" },
      { name: "Correct password matches", expectedOutput: "true" },
    ],
    learningPoints: ["Password hashing", "bcrypt", "Security best practices"],
  },

  jwt_authentication: {
    id: "jwt_authentication",
    title: "Generate and Verify JWT Tokens",
    description: "Create JWT tokens for user authentication and verify them.",
    difficulty: "intermediate",
    xpReward: 250,
    category: "Authentication",
    timeEstimate: 25,
    starterCode: `const jwt = require('jsonwebtoken');

const secret = 'your-secret-key';

// TODO: Create a JWT token with user data
const userData = { userId: 1, username: 'john_doe' };
// const token = jwt.sign(userData, secret, { expiresIn: '1h' });

// TODO: Verify and decode the token
// const decoded = jwt.verify(token, secret);
// console.log('Decoded:', decoded);`,
    expectedOutput: `Token created: eyJhbGci...
Decoded: { userId: 1, username: 'john_doe' }`,
    hints: [
      "Use jwt.sign() to create tokens",
      "Include an expiresIn option for token expiry",
      "Use jwt.verify() to validate and decode tokens",
      "Always use environment variables for secrets",
    ],
    solution: `const jwt = require('jsonwebtoken');

const secret = 'your-secret-key';

const userData = { userId: 1, username: 'john_doe' };
const token = jwt.sign(userData, secret, { expiresIn: '1h' });
console.log('Token created:', token);

const decoded = jwt.verify(token, secret);
console.log('Decoded:', decoded);`,
    testCases: [
      { name: "Token creation works", expectedOutput: "token" },
      { name: "Token format is valid", expectedOutput: "eyJ" },
      { name: "Verification works", expectedOutput: "verified" },
    ],
    learningPoints: ["JWT tokens", "Token expiry", "Authentication flow"],
  },

  session_management: {
    id: "session_management",
    title: "Implement Session Management",
    description: "Create an Express server with session management using middleware.",
    difficulty: "advanced",
    xpReward: 300,
    category: "Authentication",
    timeEstimate: 35,
    starterCode: `const express = require('express');
const session = require('express-session');

const app = express();

// TODO: Configure session middleware
// app.use(session({
//   secret: 'your-secret',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false, maxAge: 1000 * 60 * 60 }
// }));

// TODO: Create login route that sets session
// app.post('/login', (req, res) => {
//   req.session.userId = 1;
//   res.send('Logged in');
// });

// TODO: Create protected route that checks session
// app.get('/protected', (req, res) => {
//   if (req.session.userId) {
//     res.send('Access granted');
//   } else {
//     res.send('Access denied');
//   }
// });`,
    expectedOutput: `POST /login -> Logged in
GET /protected -> Access granted`,
    hints: [
      "Configure express-session middleware",
      "Store user data in req.session",
      "Check req.session to verify authentication",
      "Use middleware to protect routes",
    ],
    solution: `const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 }
}));

app.post('/login', (req, res) => {
  req.session.userId = 1;
  res.send('Logged in');
});

app.get('/protected', (req, res) => {
  if (req.session.userId) {
    res.send('Access granted');
  } else {
    res.send('Access denied');
  }
});

app.listen(3000);`,
    testCases: [
      { name: "Session middleware configured", expectedOutput: "session" },
      { name: "Login sets session", expectedOutput: "Logged in" },
      { name: "Protected route works", expectedOutput: "Access granted" },
    ],
    learningPoints: ["Session management", "Authentication middleware", "Express security"],
  },
};
