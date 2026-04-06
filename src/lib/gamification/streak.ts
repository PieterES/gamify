function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function calcNewStreak(lastStudiedAt: Date | null | undefined, streakDays: number): {
  newStreakDays: number;
  newLastStudiedAt: Date;
} {
  const today = startOfDay(new Date());
  const newLastStudiedAt = today;

  if (!lastStudiedAt) {
    return { newStreakDays: 1, newLastStudiedAt };
  }

  const lastDay = startOfDay(lastStudiedAt);
  const diffMs = today.getTime() - lastDay.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already studied today — no change
    return { newStreakDays: streakDays, newLastStudiedAt: lastStudiedAt };
  } else if (diffDays === 1) {
    // Consecutive day — increment
    return { newStreakDays: streakDays + 1, newLastStudiedAt };
  } else {
    // Streak broken — reset
    return { newStreakDays: 1, newLastStudiedAt };
  }
}
