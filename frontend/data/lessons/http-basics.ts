import type { LessonData } from "@/data/lessons/types";

export const httpBasicsLesson: LessonData = {
  id: "http-basics-001",
  slug: "http-basics",
  title: "HTTP Basics",
  description: "Learn the fundamentals of HTTP, requests, responses, and how the web communicates.",
  difficulty: "Beginner",
  duration: 40,
  xpReward: 150,
  moduleId: 3,
  moduleName: "HTTP & HTTPS",
  prerequisites: ["Internet Basics"],
  skillsLearned: ["HTTP Methods", "Status Codes", "Headers", "Request/Response"],
  content: [
    {
      type: "heading",
      level: 1,
      content: "Understanding HTTP: The Foundation of Web Communication",
    },
    {
      type: "paragraph",
      content:
        "HTTP (HyperText Transfer Protocol) is the backbone of the web. It's a stateless protocol that allows clients to communicate with servers. Every time you visit a website, send a form, or fetch data, HTTP is at work.",
    },
    {
      type: "heading",
      level: 2,
      content: "What is HTTP?",
    },
    {
      type: "paragraph",
      content:
        "HTTP is a request-response protocol. A client (usually a browser) sends an HTTP request to a server, and the server responds with an HTTP response. This communication follows specific rules and formats.",
    },
    {
      type: "tip",
      title: "Key Concept",
      content: "HTTP is stateless, meaning each request is independent. The server doesn't retain information about previous requests unless explicitly stored.",
    },
    {
      type: "heading",
      level: 2,
      content: "HTTP Request Structure",
    },
    {
      type: "code",
      language: "http",
      filename: "request.http",
      code: `GET /api/users HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json

`,
    },
    {
      type: "paragraph",
      content:
        "An HTTP request consists of a request line, headers, and an optional body. The request line includes the HTTP method, the path, and the protocol version.",
    },
    {
      type: "heading",
      level: 2,
      content: "HTTP Methods",
    },
    {
      type: "paragraph",
      content: "HTTP defines several methods that indicate the desired action:",
    },
    {
      type: "practice",
      items: [
        "GET - Retrieve data from a server",
        "POST - Submit data to a server",
        "PUT - Replace a resource on the server",
        "DELETE - Remove a resource from the server",
        "PATCH - Partially update a resource",
      ],
    },
    {
      type: "heading",
      level: 2,
      content: "HTTP Status Codes",
    },
    {
      type: "paragraph",
      content:
        "Server responses include status codes that indicate the outcome of the request. Status codes are grouped into five categories:",
    },
    {
      type: "practice",
      items: [
        "1xx - Informational (request received, continuing)",
        "2xx - Success (request succeeded)",
        "3xx - Redirection (further action needed)",
        "4xx - Client Error (request malformed or unauthorized)",
        "5xx - Server Error (server failed to fulfill valid request)",
      ],
    },
    {
      type: "warning",
      title: "Common Status Codes",
      content:
        "200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error",
    },
    {
      type: "heading",
      level: 2,
      content: "Request-Response Cycle",
    },
    {
      type: "diagram",
      title: "HTTP Communication Flow",
      data: {
        flow: ["Browser", "DNS Lookup", "TCP Connection", "HTTP Request", "Server Processing", "HTTP Response", "Render Page"],
      },
    },
    {
      type: "example",
      title: "Real-World Example",
      content: "When you load a webpage, your browser sends an HTTP GET request to the server. The server processes it and returns a 200 OK response with the HTML content.",
    },
  ],
  quiz: [
    {
      id: "q1",
      question: "What does HTTP stand for?",
      options: [
        "HyperText Transfer Protocol",
        "High Transfer Text Protocol",
        "HyperTransmission Text Protocol",
        "Hyperlink Technology Protocol",
      ],
      correct: 0,
      explanation: "HTTP stands for HyperText Transfer Protocol, the foundation of web communication.",
    },
    {
      id: "q2",
      question: "Which HTTP method is used to retrieve data?",
      options: ["POST", "PUT", "GET", "DELETE"],
      correct: 2,
      explanation: "GET is the HTTP method used to retrieve data from a server.",
    },
    {
      id: "q3",
      question: "What does a 404 status code mean?",
      options: ["Success", "Redirect", "Not Found", "Internal Server Error"],
      correct: 2,
      explanation: "404 means the requested resource was not found on the server.",
    },
    {
      id: "q4",
      question: "Is HTTP stateful or stateless?",
      options: ["Stateful", "Stateless", "Both", "Neither"],
      correct: 1,
      explanation: "HTTP is stateless, meaning each request is independent and the server doesn't retain information between requests.",
    },
    {
      id: "q5",
      question: "Which status code indicates a successful request?",
      options: ["100", "200", "300", "400"],
      correct: 1,
      explanation: "2xx status codes indicate a successful request. 200 OK is the most common.",
    },
  ],
};
