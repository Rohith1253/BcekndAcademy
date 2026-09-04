export interface CourseCatalogDefinition {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: "Node.js" | "TypeScript" | "Express" | "Database" | "Security" | "Backend";
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
    title: "Backend Development with Node.js",
    slug: "backend-node-js",
    description: "Master real-world backend engineering with Node.js, Express, MongoDB, REST APIs, and System Design.",
    shortDescription: "Complete production-grade backend roadmap from HTTP basics to database scaling.",
    category: "Node.js",
    difficulty: "beginner",
    level: "Beginner to Intermediate",
    instructor: "Backend Engineering Team",
    estimatedHours: 14,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1770,
    tags: ["Node.js", "Express", "MongoDB", "HTTP", "REST", "Backend"],
    prerequisites: [],
    published: true,
    order: 1,
  },
  {
    title: "TypeScript for Backend Development",
    slug: "typescript-backend",
    description: "Build robust, strongly-typed Node.js microservices and REST APIs using modern TypeScript features, generics, and design patterns.",
    shortDescription: "Scale server-side applications with strict type inference, interfaces, and architecture.",
    category: "TypeScript",
    difficulty: "beginner",
    level: "Beginner to Intermediate",
    instructor: "TypeScript Engineering Lead",
    estimatedHours: 16,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1800,
    tags: ["TypeScript", "Node.js", "Generics", "DTOs", "Type Safety"],
    prerequisites: ["backend-node-js"],
    published: true,
    order: 2,
  },
  {
    title: "REST API Development with Express.js",
    slug: "express-rest-api",
    description: "Design, build, and deploy production-ready RESTful web services with Express, middleware pipelines, error handling, and rate limiting.",
    shortDescription: "Professional API engineering from controller separation to logging and documentation.",
    category: "Express",
    difficulty: "intermediate",
    level: "Intermediate",
    instructor: "API Infrastructure Team",
    estimatedHours: 15,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1850,
    tags: ["Express", "REST APIs", "Middleware", "Pagination", "Rate Limiting"],
    prerequisites: ["typescript-backend"],
    published: true,
    order: 3,
  },
  {
    title: "MongoDB & Database Engineering",
    slug: "mongodb-database",
    description: "Master NoSQL document modeling, indexing strategies, aggregation pipelines, transactions, and Mongoose ODM optimization.",
    shortDescription: "High-performance database engineering with indexing, aggregations, and data validation.",
    category: "Database",
    difficulty: "intermediate",
    level: "Intermediate",
    instructor: "Data Platform Engineering",
    estimatedHours: 18,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 1900,
    tags: ["MongoDB", "Mongoose", "NoSQL", "Indexing", "Aggregations"],
    prerequisites: ["express-rest-api"],
    published: true,
    order: 4,
  },
  {
    title: "Backend Authentication & Security",
    slug: "backend-auth-security",
    description: "Harden Node.js backends against OWASP Top 10 vulnerabilities, JWT token rotation, bcrypt hashing, NoSQL injection, and RBAC authorization.",
    shortDescription: "Enterprise security architecture from password hashing to RBAC and defense-in-depth.",
    category: "Security",
    difficulty: "intermediate",
    level: "Intermediate to Advanced",
    instructor: "Security Systems Team",
    estimatedHours: 20,
    totalModules: 4,
    totalLessons: 12,
    totalXP: 2000,
    tags: ["Security", "JWT", "Authentication", "RBAC", "OWASP", "bcrypt"],
    prerequisites: ["mongodb-database"],
    published: true,
    order: 5,
  },
];
