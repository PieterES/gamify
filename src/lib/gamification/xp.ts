import { Difficulty } from "@/types/question";
import { getLevelFromXP } from "./levelNames";

const BASE_CORRECT_XP = 10;
const DIFFICULTY_BONUS: Record<Difficulty, number> = {
  associate: 0,
  professional: 5,
  expert: 10,
};
const SPEED_BONUS_THRESHOLD_MS = 15000;
const SPEED_BONUS = 3;

export function calcAnswerXP(opts: {
  isCorrect: boolean;
  difficulty: Difficulty;
  timeSpentMs?: number;
  isBossFight?: boolean;
}): number {
  if (!opts.isCorrect) return 0;
  let xp = BASE_CORRECT_XP + DIFFICULTY_BONUS[opts.difficulty];
  if (opts.timeSpentMs !== undefined && opts.timeSpentMs < SPEED_BONUS_THRESHOLD_MS) {
    xp += SPEED_BONUS;
  }
  if (opts.isBossFight) xp *= 2;
  return xp;
}

export function calcSessionCompletionBonus(opts: {
  score: number;
  total: number;
  streakDays: number;
  isBossFight?: boolean;
}): number {
  const base = Math.floor((opts.score / opts.total) * 50);
  const streakMultiplier = getStreakMultiplier(opts.streakDays);
  let bonus = Math.round(base * streakMultiplier);
  if (opts.isBossFight) bonus *= 2;
  return bonus;
}

function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 2.0;
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7) return 1.25;
  return 1.0;
}

export function checkLevelUp(oldXP: number, newXP: number): { leveledUp: boolean; newLevel?: number; newLevelName?: string } {
  const oldLevel = getLevelFromXP(oldXP);
  const newLevel = getLevelFromXP(newXP);
  if (newLevel.level > oldLevel.level) {
    return { leveledUp: true, newLevel: newLevel.level, newLevelName: newLevel.name };
  }
  return { leveledUp: false };
}
