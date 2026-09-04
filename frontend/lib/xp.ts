export interface XPData {
  currentXP: number;
  totalXP: number;
  level: number;
}

const LEVEL_CONFIG = {
  1: { name: "Beginner", threshold: 0 },
  2: { name: "Explorer", threshold: 500 },
  3: { name: "Learner", threshold: 1500 },
  4: { name: "Developer", threshold: 3500 },
  5: { name: "Backend Engineer", threshold: 6500 },
  6: { name: "API Master", threshold: 10500 },
  7: { name: "Database Architect", threshold: 15500 },
  8: { name: "Cloud Engineer", threshold: 21500 },
  9: { name: "System Designer", threshold: 28500 },
  10: { name: "Backend Legend", threshold: 36500 },
} as const;

export const XP_REWARDS = {
  LOGIN: 20,
  READ_LESSON: 50,
  COMPLETE_LESSON: 100,
  QUIZ_PASS: 150,
  PROJECT_COMPLETE: 500,
} as const;

export function calculateLevel(totalXP: number): number {
  let level = 1;
  for (let i = 10; i >= 1; i--) {
    if (totalXP >= LEVEL_CONFIG[i as keyof typeof LEVEL_CONFIG].threshold) {
      level = i;
      break;
    }
  }
  return level;
}

export function getLevelName(level: number): string {
  return LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG]?.name || "Beginner";
}

export function getXPForNextLevel(currentLevel: number): number {
  const nextLevel = (currentLevel + 1) as keyof typeof LEVEL_CONFIG;
  if (!LEVEL_CONFIG[nextLevel]) return 0;
  return LEVEL_CONFIG[nextLevel].threshold;
}

export function getCurrentLevelXPRequirement(level: number): number {
  return LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG].threshold;
}

export function getXPProgress(totalXP: number): { currentLevelXP: number; nextLevelXP: number; percentage: number } {
  const level = calculateLevel(totalXP);
  const currentLevelThreshold = getCurrentLevelXPRequirement(level);
  const nextLevelThreshold = getXPForNextLevel(level);

  const currentLevelXP = totalXP - currentLevelThreshold;
  const nextLevelXP = nextLevelThreshold - currentLevelThreshold;
  const percentage = (currentLevelXP / nextLevelXP) * 100;

  return { currentLevelXP, nextLevelXP, percentage };
}

export function willLevelUp(currentTotalXP: number, xpToAdd: number): boolean {
  const currentLevel = calculateLevel(currentTotalXP);
  const newTotalXP = currentTotalXP + xpToAdd;
  const newLevel = calculateLevel(newTotalXP);
  return newLevel > currentLevel;
}

export function getNewLevelAfterXP(currentTotalXP: number, xpToAdd: number): number {
  return calculateLevel(currentTotalXP + xpToAdd);
}
