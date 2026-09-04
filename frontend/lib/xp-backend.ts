// XP and level calculations - already in lib/xp.ts but ensuring exports are correct

export const LEVEL_CONFIG = {
  1: 0,
  2: 500,
  3: 1500,
  4: 3000,
  5: 6000,
  6: 10000,
  7: 15000,
  8: 21000,
  9: 28000,
  10: 36500,
} as const;

export const LEVEL_NAMES = [
  "Novice",
  "Apprentice",
  "Learner",
  "Developer",
  "Senior Dev",
  "Tech Lead",
  "Architect",
  "Master",
  "Sage",
  "Legend",
] as const;

export function calculateLevel(xp: number): number {
  for (let level = 10; level >= 1; level--) {
    if (xp >= LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG]) {
      return level;
    }
  }
  return 1;
}

export function getNextLevelXP(level: number): number {
  const nextLevel = Math.min(level + 1, 10);
  return LEVEL_CONFIG[nextLevel as keyof typeof LEVEL_CONFIG];
}

export function getXPForLevel(level: number): number {
  return LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || 0;
}

export function calculateXPProgress(currentXP: number, currentLevel: number) {
  const levelStart = getXPForLevel(currentLevel);
  const levelEnd = getNextLevelXP(currentLevel);
  const progress = currentXP - levelStart;
  const needed = levelEnd - levelStart;
  const percentage = (progress / needed) * 100;

  return {
    currentXP,
    currentLevel,
    levelStart,
    levelEnd,
    progress,
    needed,
    percentage: Math.min(percentage, 100),
  };
}

export function addXP(currentXP: number, xpToAdd: number) {
  const newXP = currentXP + xpToAdd;
  const oldLevel = calculateLevel(currentXP);
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;

  return {
    newXP,
    oldLevel,
    newLevel,
    leveledUp,
    xpGained: xpToAdd,
  };
}
