export interface LevelInfo {
  level: number;
  name: string;
  xpRequired: number;
  xpForNext: number;
}

export interface XPAwardResult {
  xpEarned: number;
  newTotalXp: number;
  leveledUp: boolean;
  newLevel?: number;
  newLevelName?: string;
}

export interface AchievementDef {
  key: string;
  name: string;
  description: string;
  iconPath: string;
  xpReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface SessionStats {
  score: number;
  total: number;
  xpEarned: number;
  streakDays: number;
  leveledUp: boolean;
  newLevel?: number;
  newLevelName?: string;
  achievementsUnlocked: AchievementDef[];
}
