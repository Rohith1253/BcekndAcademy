export interface RewardEvent {
  type: "xp" | "coin" | "achievement" | "level_up";
  amount: number;
  title: string;
  icon: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  reward: { xp: number; coins: number };
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: { xp: number; coins: number };
  icon: string;
}

export const DAILY_GOALS: DailyGoal[] = [
  {
    id: "read_lesson",
    title: "Read One Lesson",
    description: "Complete any lesson",
    completed: true,
    reward: { xp: 50, coins: 10 },
  },
  {
    id: "complete_quiz",
    title: "Complete Quiz",
    description: "Finish a module quiz",
    completed: false,
    reward: { xp: 100, coins: 25 },
  },
  {
    id: "earn_xp",
    title: "Earn 200 XP",
    description: "Accumulate 200 XP today",
    completed: false,
    reward: { xp: 0, coins: 50 },
  },
  {
    id: "project_work",
    title: "Work on Project",
    description: "Spend time on a project",
    completed: false,
    reward: { xp: 200, coins: 100 },
  },
];

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: "rest_api",
    title: "Build a REST API",
    description: "Create a functional REST API with CRUD operations",
    progress: 75,
    maxProgress: 100,
    reward: { xp: 500, coins: 200 },
    icon: "🔌",
  },
  {
    id: "database_design",
    title: "Design Database Schema",
    description: "Create a normalized database schema for a real-world scenario",
    progress: 40,
    maxProgress: 100,
    reward: { xp: 400, coins: 150 },
    icon: "🗄️",
  },
  {
    id: "microservices",
    title: "Microservices Challenge",
    description: "Build two independent microservices that communicate",
    progress: 0,
    maxProgress: 100,
    reward: { xp: 600, coins: 250 },
    icon: "🔄",
  },
  {
    id: "docker_deploy",
    title: "Docker & Deploy",
    description: "Containerize and deploy an application to the cloud",
    progress: 25,
    maxProgress: 100,
    reward: { xp: 550, coins: 220 },
    icon: "🐳",
  },
];

export function calculateRewardPopupData(
  level: number,
  xpGained: number,
  coinsGained: number,
  newBadges: string[]
): RewardEvent[] {
  const events: RewardEvent[] = [];

  events.push({
    type: "xp",
    amount: xpGained,
    title: `+${xpGained} XP Earned`,
    icon: "✨",
  });

  events.push({
    type: "coin",
    amount: coinsGained,
    title: `+${coinsGained} Coins`,
    icon: "💰",
  });

  if (newBadges.length > 0) {
    events.push({
      type: "achievement",
      amount: newBadges.length,
      title: `${newBadges.length} New Badge${newBadges.length > 1 ? "s" : ""}`,
      icon: "🏆",
    });
  }

  events.push({
    type: "level_up",
    amount: level,
    title: `Reached Level ${level}!`,
    icon: "🎉",
  });

  return events;
}
