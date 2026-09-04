export interface LearningPathStep {
  slug: string;
  step: number; // 1 to 5
  positionLabel: string; // 'Step 1 of 5'
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  levelNumber: 1 | 2 | 3;
  levelGroup: 'Level 1 — Foundations' | 'Level 2 — Data & Databases' | 'Level 3 — Security & Authentication';
  levelColor: {
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    dotColor: string;
  };
  isStartHere: boolean;
  whyLearn: string;
  whatYouWillLearn: string[];
  whereYouWillUseThis: string[];
  whatYouCanBuild: string;
  prerequisites: {
    title: string;
    slug?: string;
  } | null;
  nextCourse: {
    title: string;
    slug: string;
  } | null;
  // Conveniences
  courseSlug: string;
  courseTitle: string;
  stepNumber: number;
  levelName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  skillsGained: string[];
  realWorldBuild: string;
  nextCourseSlug?: string;
  nextCourseTitle?: string;
}

export const BACKEND_LEARNING_PATH: LearningPathStep[] = [
  {
    slug: 'backend-node-js',
    step: 1,
    positionLabel: 'Step 1 of 5',
    title: 'Backend Development with Node.js',
    level: 'Beginner',
    levelNumber: 1,
    levelGroup: 'Level 1 — Foundations',
    levelColor: {
      badgeBg: 'bg-emerald-500/10',
      badgeBorder: 'border-emerald-500/30',
      badgeText: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
    },
    isStartHere: true,
    whyLearn: 'Learn why backend systems exist, how the Node.js event loop operates, and how servers process and respond to HTTP client requests.',
    whatYouWillLearn: [
      'HTTP request-response lifecycle & status codes',
      'Node.js runtime, modules, and event-driven architecture',
      'NPM package management and semantic versioning',
      'Building your first Express server with routing',
    ],
    whereYouWillUseThis: [
      'Backend Web Servers',
      'API Microservices',
      'Full-Stack Web Applications',
      'Server-Side Utilities & Tooling',
    ],
    whatYouCanBuild: 'A working Node.js HTTP server that handles client requests, serves JSON data, and parses URL parameters.',
    prerequisites: null,
    nextCourse: {
      title: 'TypeScript for Backend Development',
      slug: 'typescript-backend',
    },
    courseSlug: 'backend-node-js',
    courseTitle: 'Backend Development with Node.js',
    stepNumber: 1,
    levelName: 'Level 1 — Foundations',
    difficulty: 'Beginner',
    estimatedHours: 12,
    skillsGained: [
      'HTTP request-response lifecycle & status codes',
      'Node.js runtime, modules, and event-driven architecture',
      'NPM package management and semantic versioning',
      'Building your first Express server with routing',
    ],
    realWorldBuild: 'A working Node.js HTTP server that handles client requests, serves JSON data, and parses URL parameters.',
    nextCourseSlug: 'typescript-backend',
    nextCourseTitle: 'TypeScript for Backend Development',
  },
  {
    slug: 'typescript-backend',
    step: 2,
    positionLabel: 'Step 2 of 5',
    title: 'TypeScript for Backend Development',
    level: 'Beginner',
    levelNumber: 1,
    levelGroup: 'Level 1 — Foundations',
    levelColor: {
      badgeBg: 'bg-blue-500/10',
      badgeBorder: 'border-blue-500/30',
      badgeText: 'text-blue-400',
      dotColor: 'bg-blue-400',
    },
    isStartHere: false,
    whyLearn: 'Eliminate runtime type errors, define clear API contracts with DTOs, and write maintainable code that scales with large engineering teams.',
    whatYouWillLearn: [
      'Strict type inference & primitive vs structural types',
      'Interfaces, Generics, and reusable DTO schemas',
      'Typing Express Request, Response, and custom middleware',
      'TypeScript compiler (tsc) configuration & build pipelines',
    ],
    whereYouWillUseThis: [
      'Enterprise Backend Systems',
      'Type-Safe Microservices',
      'Production Express & Nest.js Apps',
      'Large Scale Distributed Codebases',
    ],
    whatYouCanBuild: 'A strongly typed backend API service with compile-time type guarantees and self-documenting data models.',
    prerequisites: {
      title: 'Backend Development with Node.js',
      slug: 'backend-node-js',
    },
    nextCourse: {
      title: 'REST API Development with Express.js',
      slug: 'express-rest-api',
    },
    courseSlug: 'typescript-backend',
    courseTitle: 'TypeScript for Backend Development',
    stepNumber: 2,
    levelName: 'Level 1 — Foundations',
    difficulty: 'Beginner',
    estimatedHours: 14,
    skillsGained: [
      'Strict type inference & primitive vs structural types',
      'Interfaces, Generics, and reusable DTO schemas',
      'Typing Express Request, Response, and custom middleware',
      'TypeScript compiler (tsc) configuration & build pipelines',
    ],
    realWorldBuild: 'A strongly typed backend API service with compile-time type guarantees and self-documenting data models.',
    nextCourseSlug: 'express-rest-api',
    nextCourseTitle: 'REST API Development with Express.js',
  },
  {
    slug: 'express-rest-api',
    step: 3,
    positionLabel: 'Step 3 of 5',
    title: 'REST API Development with Express.js',
    level: 'Intermediate',
    levelNumber: 1,
    levelGroup: 'Level 1 — Foundations',
    levelColor: {
      badgeBg: 'bg-cyan-500/10',
      badgeBorder: 'border-cyan-500/30',
      badgeText: 'text-cyan-400',
      dotColor: 'bg-cyan-400',
    },
    isStartHere: false,
    whyLearn: 'Master the professional architecture of REST APIs: modular routers, controller separation, centralized error handling, and rate limiting.',
    whatYouWillLearn: [
      'Controller and Service Layer separation pattern',
      'Express middleware execution order & pipeline design',
      'Zod request payload validation & sanitization',
      'Pagination, cursor queries, and API rate limiting',
    ],
    whereYouWillUseThis: [
      'Production REST APIs',
      'SaaS Web Services',
      'Mobile App Backend APIs',
      'Third-Party Developer Integrations',
    ],
    whatYouCanBuild: 'A production-ready REST API featuring clean controller separation, input validation, and pagination support.',
    prerequisites: {
      title: 'TypeScript for Backend Development',
      slug: 'typescript-backend',
    },
    nextCourse: {
      title: 'MongoDB & Database Engineering',
      slug: 'mongodb-database',
    },
    courseSlug: 'express-rest-api',
    courseTitle: 'REST API Development with Express.js',
    stepNumber: 3,
    levelName: 'Level 1 — Foundations',
    difficulty: 'Intermediate',
    estimatedHours: 16,
    skillsGained: [
      'Controller and Service Layer separation pattern',
      'Express middleware execution order & pipeline design',
      'Zod request payload validation & sanitization',
      'Pagination, cursor queries, and API rate limiting',
    ],
    realWorldBuild: 'A production-ready REST API featuring clean controller separation, input validation, and pagination support.',
    nextCourseSlug: 'mongodb-database',
    nextCourseTitle: 'MongoDB & Database Engineering',
  },
  {
    slug: 'mongodb-database',
    step: 4,
    positionLabel: 'Step 4 of 5',
    title: 'MongoDB & Database Engineering',
    level: 'Intermediate',
    levelNumber: 2,
    levelGroup: 'Level 2 — Data & Databases',
    levelColor: {
      badgeBg: 'bg-amber-500/10',
      badgeBorder: 'border-amber-500/30',
      badgeText: 'text-amber-400',
      dotColor: 'bg-amber-400',
    },
    isStartHere: false,
    whyLearn: 'Applications require reliable data persistence. Learn schema design, compound indexing, aggregation pipelines, and multi-document ACID transactions.',
    whatYouWillLearn: [
      'NoSQL Document modeling (Embedding vs Referencing)',
      'Single, Compound, and TTL Indexes for high-speed queries',
      'Mongoose ODM Schemas, Virtuals, and Middleware hooks',
      'Aggregation pipeline stages ($match, $group, $lookup)',
    ],
    whereYouWillUseThis: [
      'Database Architecture & Design',
      'High-Performance Query Systems',
      'Data Analytics & Aggregations',
      'Scalable Document Storage',
    ],
    whatYouCanBuild: 'A persistent database tier with optimized indexes, lean queries, and relational population for e-commerce or social platforms.',
    prerequisites: {
      title: 'REST API Development with Express.js',
      slug: 'express-rest-api',
    },
    nextCourse: {
      title: 'Backend Authentication & Security',
      slug: 'backend-auth-security',
    },
    courseSlug: 'mongodb-database',
    courseTitle: 'MongoDB & Database Engineering',
    stepNumber: 4,
    levelName: 'Level 2 — Data & Databases',
    difficulty: 'Intermediate',
    estimatedHours: 15,
    skillsGained: [
      'NoSQL Document modeling (Embedding vs Referencing)',
      'Single, Compound, and TTL Indexes for high-speed queries',
      'Mongoose ODM Schemas, Virtuals, and Middleware hooks',
      'Aggregation pipeline stages ($match, $group, $lookup)',
    ],
    realWorldBuild: 'A persistent database tier with optimized indexes, lean queries, and relational population for e-commerce or social platforms.',
    nextCourseSlug: 'backend-auth-security',
    nextCourseTitle: 'Backend Authentication & Security',
  },
  {
    slug: 'backend-auth-security',
    step: 5,
    positionLabel: 'Step 5 of 5',
    title: 'Backend Authentication & Security',
    level: 'Advanced',
    levelNumber: 3,
    levelGroup: 'Level 3 — Security & Authentication',
    levelColor: {
      badgeBg: 'bg-rose-500/10',
      badgeBorder: 'border-rose-500/30',
      badgeText: 'text-rose-400',
      dotColor: 'bg-rose-400',
    },
    isStartHere: false,
    whyLearn: 'A backend is only as good as its defense. Protect systems against OWASP Top 10 vulnerabilities, session hijacking, and unauthorized access.',
    whatYouWillLearn: [
      'Cryptographic password hashing with bcrypt & salts',
      'Stateless JWT authentication & short/long token rotation',
      'Role-Based Access Control (RBAC) & permission matrices',
      'OWASP defenses: CSRF, XSS, and NoSQL injection mitigation',
    ],
    whereYouWillUseThis: [
      'Secure User Authentication Systems',
      'Fintech & Payment Platforms',
      'Enterprise Role-Based Access Portals',
      'Production Security Compliance & Audits',
    ],
    whatYouCanBuild: 'An enterprise-grade authentication service featuring JWT rotation, HttpOnly SameSite cookies, and role-based route guards.',
    prerequisites: {
      title: 'MongoDB & Database Engineering',
      slug: 'mongodb-database',
    },
    nextCourse: null,
    courseSlug: 'backend-auth-security',
    courseTitle: 'Backend Authentication & Security',
    stepNumber: 5,
    levelName: 'Level 3 — Security & Authentication',
    difficulty: 'Advanced',
    estimatedHours: 18,
    skillsGained: [
      'Cryptographic password hashing with bcrypt & salts',
      'Stateless JWT authentication & short/long token rotation',
      'Role-Based Access Control (RBAC) & permission matrices',
      'OWASP defenses: CSRF, XSS, and NoSQL injection mitigation',
    ],
    realWorldBuild: 'An enterprise-grade authentication service featuring JWT rotation, HttpOnly SameSite cookies, and role-based route guards.',
  },
];

export function getLearningPathStep(slug: string): LearningPathStep | undefined {
  return BACKEND_LEARNING_PATH.find((item) => item.slug === slug);
}

export function getLearningPathLevels() {
  return [
    {
      levelNumber: 1,
      title: 'Level 1 — Foundations',
      description: 'Master the core runtime, strong typing, and professional REST API architecture.',
      badgeColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      steps: BACKEND_LEARNING_PATH.filter((s) => s.levelNumber === 1),
    },
    {
      levelNumber: 2,
      title: 'Level 2 — Data & Databases',
      description: 'Build persistent, high-performance database tiers with NoSQL indexing and aggregations.',
      badgeColor: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      steps: BACKEND_LEARNING_PATH.filter((s) => s.levelNumber === 2),
    },
    {
      levelNumber: 3,
      title: 'Level 3 — Security & Authentication',
      description: 'Harden backends against real-world vulnerabilities with JWT rotation, bcrypt, and RBAC.',
      badgeColor: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
      steps: BACKEND_LEARNING_PATH.filter((s) => s.levelNumber === 3),
    },
  ];
}
