import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcSessionCompletionBonus, checkLevelUp } from "@/lib/gamification/xp";
import { calcNewStreak } from "@/lib/gamification/streak";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";
import { getXPForNextLevel } from "@/lib/gamification/levelNames";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { sessionId } = await req.json();

  const quizSession = await prisma.quizSession.findUnique({
    where: { id: sessionId },
    include: { answers: true },
  });
  if (!quizSession || quizSession.userId !== userId) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const score = quizSession.answers.filter((a) => a.isCorrect).length;
  const total = quizSession.answers.length;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Streak
  const { newStreakDays, newLastStudiedAt } = calcNewStreak(user.lastStudiedAt, user.streakDays);

  // Completion bonus XP
  const isBossFight = quizSession.mode === "boss";
  const completionXP = calcSessionCompletionBonus({
    score, total, streakDays: newStreakDays, isBossFight,
  });

  const oldXP = user.xp;
  const newXP = oldXP + completionXP;
  const levelUpResult = checkLevelUp(oldXP, newXP);
  const newLevel = levelUpResult.leveledUp ? levelUpResult.newLevel! : user.level;

  // Update session
  await prisma.quizSession.update({
    where: { id: sessionId },
    data: { completedAt: new Date(), score, total, xpEarned: completionXP },
  });

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      level: newLevel,
      streakDays: newStreakDays,
      lastStudiedAt: newLastStudiedAt,
    },
  });

  // Check count/streak-based achievements
  const achievementsUnlocked = await checkSessionAchievements(userId, {
    score, total, streakDays: newStreakDays, isBossFight,
    timeUsedMs: quizSession.completedAt
      ? new Date().getTime() - quizSession.startedAt.getTime()
      : undefined,
  });

  const { current, next, progress } = getXPForNextLevel(newXP);

  return NextResponse.json({
    score,
    total,
    xpEarned: completionXP,
    streakDays: newStreakDays,
    leveledUp: levelUpResult.leveledUp,
    newLevel,
    newLevelName: levelUpResult.newLevelName ?? current.name,
    levelProgress: progress,
    nextLevelXP: next?.xpRequired,
    achievementsUnlocked,
  });
}

async function checkSessionAchievements(
  userId: string,
  ctx: { score: number; total: number; streakDays: number; isBossFight: boolean; timeUsedMs?: number }
) {
  const existing = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });
  const earnedKeys = new Set(existing.map((ua) => ua.achievement.key));

  const toUnlock: string[] = [];

  // Streak achievements
  if (!earnedKeys.has("streak_7") && ctx.streakDays >= 7) toUnlock.push("streak_7");
  if (!earnedKeys.has("streak_30") && ctx.streakDays >= 30) toUnlock.push("streak_30");

  // Boss Fight achievements
  if (ctx.isBossFight) {
    const pct = ctx.total > 0 ? ctx.score / ctx.total : 0;
    if (!earnedKeys.has("boss_slayer") && pct >= 0.7) toUnlock.push("boss_slayer");
    if (!earnedKeys.has("perfect_boss") && pct === 1) toUnlock.push("perfect_boss");
    if (!earnedKeys.has("speed_run") && ctx.timeUsedMs && ctx.timeUsedMs < 20 * 60 * 1000) {
      toUnlock.push("speed_run");
    }
  }

  // Centurion
  const totalAnswers = await prisma.userAnswer.count({ where: { userId } });
  if (!earnedKeys.has("centurion") && totalAnswers >= 100) toUnlock.push("centurion");

  // Domain masters
  const domainProgress = await prisma.domainProgress.findMany({ where: { userId } });
  for (const dp of domainProgress) {
    const key = `domain_master_${dp.domain}`;
    if (!earnedKeys.has(key) && dp.totalAnswered >= 20 && dp.totalCorrect / dp.totalAnswered >= 0.9) {
      toUnlock.push(key);
    }
  }

  // All domains mastered
  if (!earnedKeys.has("all_domains_mastered")) {
    const allMasterKeys = ["domain_master_identity", "domain_master_networking", "domain_master_compute", "domain_master_defender"];
    const allEarned = allMasterKeys.every((k) => earnedKeys.has(k) || toUnlock.includes(k));
    if (allEarned) toUnlock.push("all_domains_mastered");
  }

  // Unlock in DB
  const unlocked = [];
  for (const key of toUnlock) {
    const achDef = ACHIEVEMENTS.find((a) => a.key === key);
    if (!achDef) continue;

    let achievement = await prisma.achievement.findUnique({ where: { key } });
    if (!achievement) {
      achievement = await prisma.achievement.create({
        data: {
          key: achDef.key,
          name: achDef.name,
          description: achDef.description,
          iconPath: achDef.iconPath,
          xpReward: achDef.xpReward,
          rarity: achDef.rarity,
        },
      });
    }

    await prisma.userAchievement.create({
      data: { userId, achievementId: achievement.id },
    }).catch(() => {});

    await prisma.user.update({ where: { id: userId }, data: { xp: { increment: achDef.xpReward } } });

    unlocked.push(achDef);
  }

  return unlocked;
}
