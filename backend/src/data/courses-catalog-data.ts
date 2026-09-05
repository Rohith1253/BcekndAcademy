export interface CourseCatalogDefinition {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: "Foundations" | "JavaScript" | "Node.js" | "TypeScript" | "Express" | "Framework" | "Database" | "Security" | "Architecture" | "Python" | "FastAPI" | "Go" | "Gin" | "Java" | "Spring Boot" | "Rust" | "Axum" | "Backend";
  difficulty: "beginner" | "intermediate" | "advanced";
  level: string;
  instructor: string;
  estimatedHours: number;
  totalModules: number;
  totalLessons: number;
  totalXP: number;
  tags: string[];
  prerequisites: string[];
  published: boolean;
  order: number;
}

export const FIVE_COURSES: CourseCatalogDefinition[] = [
  {
    title: "JavaScript Foundations & Core Syntax",
    slug: "javascript-foundations",
    description: "Master variables, data types, control flow, functions, objects, and scope before entering backend programming.",
    shortDescription: "The essential starting point: variables, functions, and core programming concepts for absolute beginners.",
    category: "Foundations",
    difficulty: "beginner",
    level: "Level 1: Beginner",
    instructor: "Foundations Engineering Team",
    estimatedHours: 6,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1500,
    tags: ["JavaScript", "Variables", "Functions", "Objects", "Arrays", "Control Flow"],
    prerequisites: [],
    published: true,
    order: 1,
  },
  {
    title: "Programming Logic & Problem Solving",
    slug: "programming-logic",
    description: "Learn how to break complex problems into algorithmic steps, handle edge cases, and design clean data flows.",
    shortDescription: "Develop developer intuition: data manipulation, error boundary planning, and algorithmic thinking.",
    category: "Foundations",
    difficulty: "beginner",
    level: "Level 2: Beginner",
    instructor: "Algorithms & Logic Team",
    estimatedHours: 6,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1600,
    tags: ["Logic", "Data Structures", "Algorithms", "Array Methods", "Edge Cases"],
    prerequisites: ["javascript-foundations"],
    published: true,
    order: 2,
  },
  {
    title: "Modern & Asynchronous JavaScript",
    slug: "async-javascript",
    description: "Understand the JavaScript Event Loop, Promises, Async/Await, error handling, and asynchronous data streams.",
    shortDescription: "Master non-blocking I/O, Promises, async/await, and the JavaScript runtime event loop.",
    category: "JavaScript",
    difficulty: "beginner",
    level: "Level 3: Beginner",
    instructor: "Runtime Architecture Team",
    estimatedHours: 7,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1700,
    tags: ["Async", "Promises", "Event Loop", "Callbacks", "Error Handling"],
    prerequisites: ["programming-logic"],
    published: true,
    order: 3,
  },
  {
    title: "Backend Development with Node.js",
    slug: "backend-node-js",
    description: "Master real-world backend engineering with Node.js, Express, MongoDB, REST APIs, and System Design.",
    shortDescription: "Complete production-grade backend roadmap from HTTP basics to database scaling.",
    category: "Node.js",
    difficulty: "beginner",
    level: "Level 4: Beginner to Intermediate",
    instructor: "Backend Engineering Team",
    estimatedHours: 8,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1770,
    tags: ["Node.js", "Express", "MongoDB", "HTTP", "REST", "Backend"],
    prerequisites: ["async-javascript"],
    published: true,
    order: 4,
  },
  {
    title: "REST API Development with Express.js",
    slug: "express-rest-api",
    description: "Design, build, and deploy production-ready RESTful web services with Express, middleware pipelines, error handling, and rate limiting.",
    shortDescription: "Professional API engineering from controller separation to logging and documentation.",
    category: "Express",
    difficulty: "intermediate",
    level: "Level 5: Intermediate",
    instructor: "API Infrastructure Team",
    estimatedHours: 8,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1860,
    tags: ["Express", "REST APIs", "Middleware", "Pagination", "Rate Limiting"],
    prerequisites: ["backend-node-js"],
    published: true,
    order: 5,
  }
];

export function getCatalogCourses(): CourseCatalogDefinition[] {
  return FIVE_COURSES;
}

export function getCourseBySlug(slug: string): CourseCatalogDefinition | undefined {
  return FIVE_COURSES.find((c) => c.slug === slug);
}
