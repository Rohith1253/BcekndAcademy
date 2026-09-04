export const LEVEL_CONFIG: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 3500,
  8: 6000,
  9: 10000,
  10: 16000,
};

export const LEVEL_NAMES = [
  "Novice",
  "Apprentice",
  "Learner",
  "Developer",
  "Senior Dev",
  "Tech Lead",
  "Architect",
  "Principal",
  "Master",
  "Legend",
] as const;

export function calculateLevel(xp: number): number {
  const safeXP = Math.max(0, xp || 0);
  for (let level = 10; level >= 1; level--) {
    if (safeXP >= (LEVEL_CONFIG[level] || 0)) {
      return level;
    }
  }
  return 1;
}

export function getNextLevelXP(level: number): number {
  const nextLevel = Math.min(level + 1, 10);
  return LEVEL_CONFIG[nextLevel] || LEVEL_CONFIG[10];
}

export function getXPForLevel(level: number): number {
  return LEVEL_CONFIG[level] || 0;
}

export function calculateLevelProgress(totalXP: number) {
  const currentXP = Math.max(0, totalXP || 0);
  const currentLevel = calculateLevel(currentXP);
  const levelStart = getXPForLevel(currentLevel);
  const nextLevelXP = getNextLevelXP(currentLevel);

  const currentLevelXP = currentXP - levelStart;
  const neededXP = nextLevelXP - levelStart;
  const progressPercentage =
    neededXP > 0 ? Math.min(100, Math.round((currentLevelXP / neededXP) * 100)) : 100;

  return {
    level: currentLevel,
    levelName: LEVEL_NAMES[currentLevel - 1] || "Developer",
    totalXP: currentXP,
    currentLevelXP,
    nextLevelXP,
    neededXP,
    progressPercentage,
  };
}

export function calculateXPProgress(currentXP: number, currentLevel: number) {
  return calculateLevelProgress(currentXP);
}

export function addXP(currentXP: number, xpToAdd: number) {
  const safeCurrent = Math.max(0, currentXP || 0);
  const safeAdd = Math.max(0, xpToAdd || 0);
  const newXP = safeCurrent + safeAdd;
  const oldLevel = calculateLevel(safeCurrent);
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;

  return {
    newXP,
    oldLevel,
    newLevel,
    leveledUp,
    xpGained: safeAdd,
  };
}
