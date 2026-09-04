export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "social" | "learning" | "milestone" | "challenge" | "streak";
  earned: boolean;
  earnedDate?: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

export const ACHIEVEMENTS: Record<string, Omit<Achievement, "earned">> = {
  first_login: {
    id: "first_login",
    title: "Welcome Aboard",
    description: "Complete your first login",
    icon: "🚀",
    category: "social",
    rarity: "common",
  },
  first_lesson: {
    id: "first_lesson",
    title: "First Step",
    description: "Finish your first lesson",
    icon: "📚",
    category: "learning",
    rarity: "common",
  },
  first_quiz: {
    id: "first_quiz",
    title: "Quiz Taker",
    description: "Complete your first quiz",
    icon: "✏️",
    category: "learning",
    rarity: "common",
  },
  http_master: {
    id: "http_master",
    title: "HTTP Master",
    description: "Complete all HTTP lessons",
    icon: "🌐",
    category: "learning",
    rarity: "uncommon",
  },
  node_explorer: {
    id: "node_explorer",
    title: "Node Explorer",
    description: "Complete Node.js module",
    icon: "⚙️",
    category: "learning",
    rarity: "uncommon",
  },
  api_builder: {
    id: "api_builder",
    title: "API Builder",
    description: "Build 5 API projects",
    icon: "🔌",
    category: "milestone",
    rarity: "rare",
  },
  mongo_master: {
    id: "mongo_master",
    title: "Mongo Master",
    description: "Become proficient with MongoDB",
    icon: "🍃",
    category: "learning",
    rarity: "uncommon",
  },
  quiz_champion: {
    id: "quiz_champion",
    title: "Quiz Champion",
    description: "Score 100% on 10 quizzes",
    icon: "🏆",
    category: "challenge",
    rarity: "rare",
  },
  perfect_score: {
    id: "perfect_score",
    title: "Perfect Score",
    description: "Get 100% on any quiz",
    icon: "⭐",
    category: "milestone",
    rarity: "uncommon",
  },
  week_warrior: {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Learn 7 days in a row",
    icon: "⚔️",
    category: "streak",
    rarity: "rare",
  },
  streak_30: {
    id: "streak_30",
    title: "30-Day Legend",
    description: "Maintain a 30-day streak",
    icon: "🔥",
    category: "streak",
    rarity: "epic",
  },
  docker_pro: {
    id: "docker_pro",
    title: "Docker Pro",
    description: "Master containerization",
    icon: "🐳",
    category: "learning",
    rarity: "rare",
  },
  database_wizard: {
    id: "database_wizard",
    title: "Database Wizard",
    description: "Complete SQL & NoSQL modules",
    icon: "🧙",
    category: "learning",
    rarity: "rare",
  },
  auth_specialist: {
    id: "auth_specialist",
    title: "Auth Specialist",
    description: "Master authentication systems",
    icon: "🔐",
    category: "learning",
    rarity: "uncommon",
  },
  speedrunner: {
    id: "speedrunner",
    title: "Speedrunner",
    description: "Complete a lesson in under 15 minutes",
    icon: "⚡",
    category: "challenge",
    rarity: "uncommon",
  },
  project_launcher: {
    id: "project_launcher",
    title: "Project Launcher",
    description: "Complete your first project",
    icon: "🚀",
    category: "milestone",
    rarity: "rare",
  },
  backend_legend: {
    id: "backend_legend",
    title: "Backend Legend",
    description: "Reach level 10",
    icon: "👑",
    category: "milestone",
    rarity: "legendary",
  },
  xp_collector: {
    id: "xp_collector",
    title: "XP Collector",
    description: "Earn 10,000 total XP",
    icon: "💎",
    category: "milestone",
    rarity: "epic",
  },
  lesson_lover: {
    id: "lesson_lover",
    title: "Lesson Lover",
    description: "Complete 50 lessons",
    icon: "💖",
    category: "milestone",
    rarity: "rare",
  },
  bookmarkaholic: {
    id: "bookmarkaholic",
    title: "Bookmarkaholic",
    description: "Bookmark 20 lessons",
    icon: "🔖",
    category: "social",
    rarity: "uncommon",
  },
  night_owl: {
    id: "night_owl",
    title: "Night Owl",
    description: "Learn after 11 PM",
    icon: "🌙",
    category: "challenge",
    rarity: "common",
  },
  early_bird: {
    id: "early_bird",
    title: "Early Bird",
    description: "Learn before 7 AM",
    icon: "🌅",
    category: "challenge",
    rarity: "common",
  },
  code_reviewer: {
    id: "code_reviewer",
    title: "Code Reviewer",
    description: "Review 5 peer projects",
    icon: "👀",
    category: "social",
    rarity: "uncommon",
  },
  helper: {
    id: "helper",
    title: "Helper",
    description: "Answer 10 community questions",
    icon: "🤝",
    category: "social",
    rarity: "uncommon",
  },
};

export function getAchievementsList(): Achievement[] {
  return Object.entries(ACHIEVEMENTS).map(([, achievement]) => ({
    ...achievement,
    earned: Math.random() > 0.6,
  }));
}

export function filterAchievementsByCategory(category: Achievement["category"]): Achievement[] {
  return Object.entries(ACHIEVEMENTS)
    .filter(([, achievement]) => achievement.category === category)
    .map(([, achievement]) => ({
      ...achievement,
      earned: Math.random() > 0.5,
    }));
}
