export interface MasterAchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "social" | "learning" | "milestone" | "challenge" | "streak";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  criteria: {
    type: "lessons_completed" | "quizzes_completed" | "challenges_completed" | "streak_days" | "languages_completed" | "xp_earned" | "course_completed" | "perfect_quizzes";
    count: number;
    courseSlug?: string;
    language?: string;
  };
}

export const MASTER_ACHIEVEMENTS: MasterAchievementDefinition[] = [
  // Beginner
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first lesson in the backend academy.",
    icon: "GraduationCap",
    category: "learning",
    rarity: "common",
    criteria: { type: "lessons_completed", count: 1 },
  },
  {
    id: "quiz-rookie",
    title: "Quiz Rookie",
    description: "Complete your first quiz with a passing score.",
    icon: "Award",
    category: "learning",
    rarity: "common",
    criteria: { type: "quizzes_completed", count: 1 },
  },
  {
    id: "code-runner",
    title: "Code Runner",
    description: "Submit and pass your first backend coding challenge.",
    icon: "Code2",
    category: "challenge",
    rarity: "common",
    criteria: { type: "challenges_completed", count: 1 },
  },

  // Backend Courses
  {
    id: "http-master",
    title: "HTTP Explorer",
    description: "Complete the Web & HTTP Fundamentals module.",
    icon: "Globe",
    category: "learning",
    rarity: "uncommon",
    criteria: { type: "course_completed", count: 1, courseSlug: "backend-node-js" },
  },
  {
    id: "node-navigator",
    title: "Node Navigator",
    description: "Complete the Backend Development with Node.js course.",
    icon: "Server",
    category: "learning",
    rarity: "uncommon",
    criteria: { type: "course_completed", count: 1, courseSlug: "backend-node-js" },
  },
  {
    id: "python-engineer",
    title: "Python Engineer",
    description: "Complete a Python backend course.",
    icon: "Terminal",
    category: "learning",
    rarity: "uncommon",
    criteria: { type: "course_completed", count: 1, courseSlug: "python-backend-fundamentals" },
  },
  {
    id: "go-concurrency",
    title: "Go Concurrency Pioneer",
    description: "Complete the Go Concurrency & Backend Fundamentals course.",
    icon: "Zap",
    category: "learning",
    rarity: "uncommon",
    criteria: { type: "course_completed", count: 1, courseSlug: "go-backend-fundamentals" },
  },
  {
    id: "rust-systems",
    title: "Rust Systems Architect",
    description: "Complete the Rust Memory Safety & Backend Foundations course.",
    icon: "ShieldAlert",
    category: "learning",
    rarity: "rare",
    criteria: { type: "course_completed", count: 1, courseSlug: "rust-backend-fundamentals" },
  },
  {
    id: "enterprise-java",
    title: "Enterprise Java Expert",
    description: "Complete the Building Resilient Microservices with Spring Boot course.",
    icon: "Cpu",
    category: "learning",
    rarity: "rare",
    criteria: { type: "course_completed", count: 1, courseSlug: "spring-boot-microservices" },
  },
  {
    id: "dotnet-core",
    title: ".NET Cloud Engineer",
    description: "Complete the High-Performance Web APIs with ASP.NET Core course.",
    icon: "Layers",
    category: "learning",
    rarity: "uncommon",
    criteria: { type: "course_completed", count: 1, courseSlug: "aspnet-core-web-apis" },
  },

  // Language & Polyglot
  {
    id: "polyglot-starter",
    title: "Polyglot Beginner",
    description: "Complete lessons in at least 3 different backend languages.",
    icon: "Sparkles",
    category: "learning",
    rarity: "uncommon",
    criteria: { type: "languages_completed", count: 3 },
  },
  {
    id: "polyglot-pro",
    title: "Backend Polyglot",
    description: "Complete lessons in at least 5 different backend languages.",
    icon: "Workflow",
    category: "learning",
    rarity: "rare",
    criteria: { type: "languages_completed", count: 5 },
  },
  {
    id: "polyglot-master",
    title: "Polyglot Master",
    description: "Complete lessons in all 11 backend languages.",
    icon: "Crown",
    category: "milestone",
    rarity: "legendary",
    criteria: { type: "languages_completed", count: 11 },
  },

  // Streak & Consistency
  {
    id: "streak-3",
    title: "3-Day Streak",
    description: "Learn 3 consecutive days in a row.",
    icon: "Flame",
    category: "streak",
    rarity: "common",
    criteria: { type: "streak_days", count: 3 },
  },
  {
    id: "streak-7",
    title: "7-Day Streak",
    description: "Learn 7 consecutive days in a row.",
    icon: "Flame",
    category: "streak",
    rarity: "uncommon",
    criteria: { type: "streak_days", count: 7 },
  },
  {
    id: "streak-30",
    title: "30-Day Master Streak",
    description: "Maintain an unbroken 30-day learning streak.",
    icon: "Flame",
    category: "streak",
    rarity: "epic",
    criteria: { type: "streak_days", count: 30 },
  },

  // Coding Challenges
  {
    id: "challenge-beginner",
    title: "Challenge Beginner",
    description: "Solve 5 coding challenges.",
    icon: "CheckCircle2",
    category: "challenge",
    rarity: "common",
    criteria: { type: "challenges_completed", count: 5 },
  },
  {
    id: "challenge-solver",
    title: "Challenge Solver",
    description: "Solve 15 coding challenges.",
    icon: "CheckCircle2",
    category: "challenge",
    rarity: "rare",
    criteria: { type: "challenges_completed", count: 15 },
  },
  {
    id: "challenge-master",
    title: "Challenge Master",
    description: "Solve 30 coding challenges across the platform.",
    icon: "Trophy",
    category: "challenge",
    rarity: "epic",
    criteria: { type: "challenges_completed", count: 30 },
  },

  // Quizzes & XP Milestones
  {
    id: "quiz-master",
    title: "Perfect Score Ace",
    description: "Score 100% on at least 5 different quizzes.",
    icon: "Star",
    category: "learning",
    rarity: "rare",
    criteria: { type: "perfect_quizzes", count: 5 },
  },
  {
    id: "xp-milestone-1k",
    title: "1,000 XP Club",
    description: "Earn a total of 1,000 XP across all activities.",
    icon: "Zap",
    category: "milestone",
    rarity: "uncommon",
    criteria: { type: "xp_earned", count: 1000 },
  },
  {
    id: "xp-milestone-5k",
    title: "5,000 XP Architect",
    description: "Earn a total of 5,000 XP across all activities.",
    icon: "Zap",
    category: "milestone",
    rarity: "epic",
    criteria: { type: "xp_earned", count: 5000 },
  },
];
