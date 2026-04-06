export interface Level {
  level: number;
  name: string;
  xpRequired: number;
}

export const LEVELS: Level[] = [
  { level: 1, name: "Azure Apprentice", xpRequired: 0 },
  { level: 2, name: "Cloud Cadet", xpRequired: 200 },
  { level: 3, name: "IAM Initiate", xpRequired: 500 },
  { level: 4, name: "Network Sentinel", xpRequired: 1000 },
  { level: 5, name: "Firewall Knight", xpRequired: 1800 },
  { level: 6, name: "Key Vault Keeper", xpRequired: 3000 },
  { level: 7, name: "Defender Operative", xpRequired: 4500 },
  { level: 8, name: "Sentinel Commander", xpRequired: 6500 },
  { level: 9, name: "Security Architect", xpRequired: 9000 },
  { level: 10, name: "Security Sentinel", xpRequired: 12000 },
];

export function getLevelFromXP(xp: number): Level {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  return current;
}

export function getNextLevel(currentLevel: number): Level | null {
  return LEVELS.find((l) => l.level === currentLevel + 1) ?? null;
}

export function getXPForNextLevel(xp: number): { current: Level; next: Level | null; progress: number } {
  const current = getLevelFromXP(xp);
  const next = getNextLevel(current.level);
  if (!next) return { current, next: null, progress: 100 };
  const xpIntoLevel = xp - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  const progress = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));
  return { current, next, progress };
}
