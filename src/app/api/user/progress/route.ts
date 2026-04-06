import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getXPForNextLevel } from "@/lib/gamification/levelNames";
import { getPercentage } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const domainProgress = await prisma.domainProgress.findMany({ where: { userId } });
  const recentSessions = await prisma.quizSession.findMany({
    where: { userId, completedAt: { not: null } },
    orderBy: { startedAt: "desc" },
    take: 10,
  });
  const achievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: "desc" },
  });

  const { current, next, progress } = getXPForNextLevel(user.xp);

  const totalAnswered = domainProgress.reduce((sum, dp) => sum + dp.totalAnswered, 0);
  const totalCorrect = domainProgress.reduce((sum, dp) => sum + dp.totalCorrect, 0);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      xp: user.xp,
      level: user.level,
      levelName: current.name,
      streakDays: user.streakDays,
      lastStudiedAt: user.lastStudiedAt,
    },
    levelInfo: { current, next, progress },
    domainProgress: domainProgress.map((dp) => ({
      domain: dp.domain,
      totalAnswered: dp.totalAnswered,
      totalCorrect: dp.totalCorrect,
      percentage: getPercentage(dp.totalCorrect, dp.totalAnswered),
    })),
    recentSessions,
    achievements: achievements.map((ua) => ({
      key: ua.achievement.key,
      name: ua.achievement.name,
      description: ua.achievement.description,
      iconPath: ua.achievement.iconPath,
      xpReward: ua.achievement.xpReward,
      rarity: ua.achievement.rarity,
      unlockedAt: ua.unlockedAt,
    })),
    totalAnswered,
    totalCorrect,
    accuracy: getPercentage(totalCorrect, totalAnswered),
  });
}
