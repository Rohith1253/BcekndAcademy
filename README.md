# Backend Learning Platform

A production-ready, security-hardened backend built with Next.js App Router, TypeScript, and MongoDB Mongoose. Features authentication, lesson management, interactive quizzes, coding challenges, progress tracking, user notes, bookmarks, rate limiting, and automated test suites.

---

## 🚀 Key Features & Architectural Highlights

- **Authentication & Security:** JWT authentication supporting dual extraction (`Authorization: Bearer <token>` header or HTTP-only `token` cookie), bcrypt password hashing, sliding-window rate limiting (`lib/rate-limit.ts`), NoSQL injection parameter stripping (`sanitizeStringParam`), ObjectId format validation (`isValidObjectId`), and HTTP security headers.
- **Data Integrity & Persistence:** Mongoose MongoDB models with compound unique indexes (`Bookmark`, `Progress`, `Achievement`), user resource ownership isolation, and database `E11000` duplicate key handling.
- **Business Logic Protection:** Server-validated quiz scoring with division-by-zero guards, server-controlled challenge rewards, and single-pass XP replay protection (0 additional XP on repeated completions).
- **Performance & Reliability:** MongoDB query projections (`.select({ content: 0 })`), standardized pagination metadata (`page`, `limit`, `total`, `totalPages`, `hasMore`), process-local `TTLCache` (`lib/cache.ts`), `AbortController` fetch timeouts (`lib/http.ts`), and lightweight health check monitoring (`GET /api/health`).
- **Comprehensive Automated Testing:** 65 automated tests across Unit, Authorization, Database, Integration, Security, and Performance suites with measured code coverage report.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Runtime:** Node.js (>= 18.0.0)
- **Language:** TypeScript 5
- **Database:** MongoDB & Mongoose 9
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation:** Zod 4
- **Testing:** Custom Automated Suite (`tests/run-tests.ts`)
- **Containerization:** Docker (Multi-stage Alpine image)

---

## 📂 Project Structure

```text
backend-learning-platform/
├── app/
│   └── api/                  # Next.js App Router API endpoints (17 routes)
│       ├── achievements/     # User badges API
│       ├── auth/             # Login, register, logout, me endpoints
│       ├── bookmarks/        # MongoDB persistent bookmark endpoints
│       ├── challenges/       # Challenge catalog and submission API
│       ├── health/           # System status & database health monitoring
│       ├── lessons/          # Paginated lesson catalog API
│       ├── notes/            # User note CRUD API
│       ├── progress/         # Lesson progress API
│       └── quiz/             # Quiz evaluation & scoring API
├── data/                     # Authoritative lesson & challenge definitions
├── lib/                      # Core helpers (auth, mongodb, validation, rate-limit, cache, http)
├── models/                   # Mongoose schemas (User, Lesson, Quiz, Challenge, Progress, Note, Bookmark, Achievement)
├── tests/                    # Automated regression test suites
│   ├── unit/                 # Auth, Zod validation, and utility tests
│   ├── authorization/        # Cross-user resource ownership tests
│   ├── database/             # Mongoose schemas & compound unique index tests
│   ├── integration/          # Quiz scoring & challenge reward integrity tests
│   ├── security/             # Rate limit 429, NoSQL injection, ObjectId & header tests
│   ├── performance/          # Query projection, pagination & TTLCache benchmark tests
│   └── run-tests.ts          # Central test runner & coverage engine
├── API.md                    # Detailed API specification documentation
├── Dockerfile                # Production multi-stage Alpine Dockerfile
└── README.md                 # Project documentation
```

---

## ⚡ Quick Start & Development

### 1. Environment Configuration

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/backend-learning-platform
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
PORT=3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

---

## 🧪 Testing & Production Verification

Run the automated test suite executing 65 regression tests:

```bash
# Run complete test suite
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:security
npm run test:database
npm run test:performance

# Run code coverage report
npm run test:coverage
```

### Production Build & Type Check

```bash
# TypeScript type check (0 errors required)
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm start
```

---

## 📖 API Documentation

Complete API endpoint documentation is available in [API.md](file:///c:/Django/backend-learning-platform/API.md).

Quick Summary of Core Routes:
- `GET /api/health` — System status & database connectivity check
- `POST /api/auth/register` — Register account
- `POST /api/auth/login` — Login user (HTTP-only cookie + Bearer JWT)
- `GET /api/lessons` — Paginated lesson catalog
- `POST /api/quiz/submit` — Submit quiz answers
- `POST /api/challenges/submit` — Submit coding challenge solution

---

## 🐳 Docker Deployment

Build and run using Docker:

```bash
# Build multi-stage production Docker image
docker build -t backend-learning-platform .

# Run container
docker run -p 3000:3000 --env-file .env backend-learning-platform
```

---

## 📄 License

MIT License
