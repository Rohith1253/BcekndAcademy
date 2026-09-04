export interface LevelDefinition {
  level: number;
  title: string;
  minXP: number;
  nextLevelXP: number;
}

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  { level: 1, title: "Backend Novice", minXP: 0, nextLevelXP: 100 },
  { level: 2, title: "Syntax Apprentice", minXP: 100, nextLevelXP: 250 },
  { level: 3, title: "Endpoint Builder", minXP: 250, nextLevelXP: 450 },
  { level: 4, title: "Route Navigator", minXP: 450, nextLevelXP: 700 },
  { level: 5, title: "API Explorer", minXP: 700, nextLevelXP: 1000 },
  { level: 6, title: "Middleware Crafter", minXP: 1000, nextLevelXP: 1400 },
  { level: 7, title: "Database Integrator", minXP: 1400, nextLevelXP: 1900 },
  { level: 8, title: "Async Architect", minXP: 1900, nextLevelXP: 2500 },
  { level: 9, title: "Pipeline Optimizer", minXP: 2500, nextLevelXP: 3200 },
  { level: 10, title: "Backend Developer", minXP: 3200, nextLevelXP: 4000 },
  { level: 11, title: "Concurrency Craftsman", minXP: 4000, nextLevelXP: 5000 },
  { level: 12, title: "Schema Strategist", minXP: 5000, nextLevelXP: 6200 },
  { level: 13, title: "Microservice Engineer", minXP: 6200, nextLevelXP: 7600 },
  { level: 14, title: "Distributed Specialist", minXP: 7600, nextLevelXP: 9200 },
  { level: 15, title: "Advanced Backend Engineer", minXP: 9200, nextLevelXP: 11000 },
  { level: 16, title: "System Scaler", minXP: 11000, nextLevelXP: 13200 },
  { level: 17, title: "Fault-Tolerance Master", minXP: 13200, nextLevelXP: 15800 },
  { level: 18, title: "Cloud Backend Principal", minXP: 15800, nextLevelXP: 18800 },
  { level: 19, title: "High-Throughput Guru", minXP: 18800, nextLevelXP: 22200 },
  { level: 20, title: "Backend Master Architect", minXP: 22200, nextLevelXP: 26000 },
  { level: 21, title: "Polyglot Systems Legend", minXP: 26000, nextLevelXP: 30500 },
  { level: 22, title: "Kernel & Runtime Maestro", minXP: 30500, nextLevelXP: 36000 },
  { level: 23, title: "Enterprise Platform Titan", minXP: 36000, nextLevelXP: 43000 },
  { level: 24, title: "Grandmaster of Backends", minXP: 43000, nextLevelXP: 52000 },
  { level: 25, title: "Supreme System Deity", minXP: 52000, nextLevelXP: 65000 },
];

export interface UserLevelInfo {
  level: number;
  levelName: string;
  title: string;
  currentLevel: number;
  currentTitle: string;
  totalXP: number;
  currentLevelXP: number;
  xpForNextLevel: number;
  neededXP: number;
  progressPercentage: number;
  isMaxLevel: boolean;
  nextTitle: string;
}

export class LevelService {
  /**
   * Calculates user level progression metadata from total XP.
   */
  static getLevelInfo(totalXP: number = 0): UserLevelInfo {
    const xp = Math.max(0, totalXP);
    let levelDef = LEVEL_DEFINITIONS[0];

    for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_DEFINITIONS[i].minXP) {
        levelDef = LEVEL_DEFINITIONS[i];
        break;
      }
    }

    const nextLevelIndex = LEVEL_DEFINITIONS.findIndex((l) => l.level === levelDef.level + 1);
    const nextLevelDef = nextLevelIndex !== -1 ? LEVEL_DEFINITIONS[nextLevelIndex] : null;

    if (!nextLevelDef) {
      // Max level reached
      return {
        level: levelDef.level,
        levelName: levelDef.title,
        title: levelDef.title,
        currentLevel: levelDef.level,
        currentTitle: levelDef.title,
        totalXP: xp,
        currentLevelXP: xp - levelDef.minXP,
        xpForNextLevel: levelDef.minXP,
        neededXP: 0,
        progressPercentage: 100,
        isMaxLevel: true,
        nextTitle: "Maximum Mastery",
      };
    }

    const span = nextLevelDef.minXP - levelDef.minXP;
    const currentProgressInLevel = xp - levelDef.minXP;
    const progressPercentage = Math.min(100, Math.max(0, Math.round((currentProgressInLevel / span) * 100)));

    return {
      level: levelDef.level,
      levelName: levelDef.title,
      title: levelDef.title,
      currentLevel: levelDef.level,
      currentTitle: levelDef.title,
      totalXP: xp,
      currentLevelXP: currentProgressInLevel,
      xpForNextLevel: nextLevelDef.minXP,
      neededXP: Math.max(0, nextLevelDef.minXP - xp),
      progressPercentage,
      isMaxLevel: false,
      nextTitle: nextLevelDef.title,
    };
  }

  /**
   * Checks if XP increase triggers one or more level ups.
   */
  static checkLevelUp(oldXP: number, newXP: number): {
    isLevelUp: boolean;
    oldLevel: number;
    newLevel: number;
    newTitle: string;
  } {
    const oldInfo = this.getLevelInfo(oldXP);
    const newInfo = this.getLevelInfo(newXP);

    return {
      isLevelUp: newInfo.currentLevel > oldInfo.currentLevel,
      oldLevel: oldInfo.currentLevel,
      newLevel: newInfo.currentLevel,
      newTitle: newInfo.currentTitle,
    };
  }
}
