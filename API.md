# Backend Learning Platform — API Specification Documentation

Complete API specification for `backend-learning-platform`. All endpoints return standardized JSON responses adhering to the format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message string"
}
```

Or on error:

```json
{
  "success": false,
  "error": "Error description string"
}
```

---

## 1. Service Health & System

### GET `/api/health`
- **Description:** System status and database connectivity check.
- **Auth Required:** No
- **Query Params:** None
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "status": "ok",
      "timestamp": "2026-08-30T13:00:00.000Z",
      "database": "connected",
      "uptime": 1420
    }
  }
  ```
- **Error Responses:** `503 Service Unavailable`

---

## 2. Authentication API

### POST `/api/auth/register`
- **Description:** Register a new user account with email and password.
- **Auth Required:** No (Rate limited: 5 requests / hour / IP)
- **Body Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "Alex Dev"
  }
  ```
- **Success Response (200 OK):** Sets `token` HTTP-only cookie and returns user data + JWT string.
- **Error Responses:** `400 Bad Request` (Email registered / validation error), `429 Too Many Requests`

### POST `/api/auth/login`
- **Description:** Authenticate user credentials and establish session.
- **Auth Required:** No (Rate limited: 5 attempts / 15 mins / IP)
- **Body Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response (200 OK):** Sets `token` HTTP-only cookie and returns user object + token.
- **Error Responses:** `401 Unauthorized` (Invalid credentials), `400 Bad Request`, `429 Too Many Requests`

### POST `/api/auth/logout`
- **Description:** Terminate user session and clear authentication cookie.
- **Auth Required:** No
- **Success Response (200 OK):** Clears `token` cookie.

### GET `/api/auth/me`
- **Description:** Retrieve current authenticated user profile.
- **Auth Required:** Yes (Authorization Header `Bearer <token>` or HTTP-only `token` cookie)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "email": "user@example.com",
        "name": "Alex Dev",
        "totalXP": 350,
        "currentLevel": 2
      }
    }
  }
  ```
- **Error Responses:** `401 Unauthorized`

---

## 3. Educational Content & Quiz API

### GET `/api/lessons`
- **Description:** Retrieve paginated lesson catalog with field projection.
- **Auth Required:** No
- **Query Params:** `category`, `difficulty`, `page` (default 1), `limit` (default 20, max 100)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "lessons": [...],
      "total": 12,
      "pagination": { "page": 1, "limit": 20, "total": 12, "totalPages": 1, "hasMore": false }
    }
  }
  ```

### GET `/api/lessons/[slug]`
- **Description:** Retrieve single lesson details with full markdown content and quiz questions.
- **Auth Required:** No
- **Success Response (200 OK):** Lesson object.
- **Error Responses:** `404 Not Found`

### POST `/api/quiz/submit`
- **Description:** Submit quiz answers, evaluate score, and award XP.
- **Auth Required:** Yes (Rate limited: 10 requests / min / IP)
- **Body Payload:**
  ```json
  {
    "lessonId": "507f1f77bcf86cd799439011",
    "answers": [{ "questionId": "q1", "selectedOptionIndex": 1 }],
    "timeSpent": 45
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "result": { "score": 80, "correctAnswers": 4, "totalQuestions": 5, "xpEarned": 100, "alreadyCompleted": false }
    }
  }
  ```
- **Error Responses:** `400 Bad Request` (Invalid ID format / empty answers), `401 Unauthorized`, `404 Not Found`

---

## 4. Coding Challenges API

### GET `/api/challenges`
- **Description:** Retrieve list of available coding challenges (cached).
- **Auth Required:** No
- **Query Params:** `category`, `difficulty`
- **Success Response (200 OK):** Array of challenge objects.

### GET `/api/challenges/[id]`
- **Description:** Retrieve single challenge details.
- **Auth Required:** No
- **Success Response (200 OK):** Challenge object.
- **Error Responses:** `404 Not Found`

### POST `/api/challenges/submit`
- **Description:** Submit challenge code solution for evaluation.
- **Auth Required:** Yes (Rate limited: 10 requests / min / IP)
- **Body Payload:**
  ```json
  {
    "challengeId": "create_http_server",
    "code": "const http = require('http'); ...",
    "testsPassed": 2,
    "totalTests": 2,
    "timeSpent": 120
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { "success": true, "testsPassed": 2, "totalTests": 2, "xpEarned": 100, "alreadyCompleted": false }
  }
  ```
- **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

---

## 5. User Notes API

### GET `/api/notes`
- **Description:** Retrieve user's saved lesson notes.
- **Auth Required:** Yes
- **Query Params:** `lessonId`, `isPinned`, `page`, `limit`
- **Success Response (200 OK):** Array of note objects + pagination object.

### POST `/api/notes`
- **Description:** Create a new lesson note.
- **Auth Required:** Yes
- **Body Payload:** `{ "lessonId": "507f1f77bcf86cd799439011", "content": "Note content..." }`

### PUT `/api/notes/[id]`
- **Description:** Update an existing note (enforces user ownership).
- **Auth Required:** Yes
- **Body Payload:** `{ "content": "Updated note content..." }`
- **Error Responses:** `400 Bad Request` (Invalid ID), `403 Forbidden` (Not owner), `404 Not Found`

### DELETE `/api/notes/[id]`
- **Description:** Delete a note (enforces user ownership).
- **Auth Required:** Yes

---

## 6. User Bookmarks API

### GET `/api/bookmarks`
- **Description:** Get user's bookmarked lesson IDs.
- **Auth Required:** Yes

### POST `/api/bookmarks`
- **Description:** Bookmark a lesson (MongoDB persistent).
- **Auth Required:** Yes
- **Body Payload:** `{ "lessonId": "507f1f77bcf86cd799439011" }`
- **Success Response (200 OK):** Lesson bookmarked message (gracefully handles duplicate POSTs).

### DELETE `/api/bookmarks/[lessonId]`
- **Description:** Remove a bookmarked lesson.
- **Auth Required:** Yes

---

## 7. Progress & Achievements API

### GET `/api/progress`
- **Description:** Retrieve user lesson progress.
- **Auth Required:** Yes
- **Query Params:** `lessonId`, `status`, `page`, `limit`

### POST `/api/progress`
- **Description:** Create or update lesson progress.
- **Auth Required:** Yes
- **Body Payload:** `{ "lessonId": "507f1f77bcf86cd799439011", "status": "completed", "progressPercentage": 100, "timeSpent": 300 }`

### GET `/api/achievements`
- **Description:** Get user's earned achievement badges.
- **Auth Required:** Yes
- **Query Params:** `category`, `rarity`, `page`, `limit`
