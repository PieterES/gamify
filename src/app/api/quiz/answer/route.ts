import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getQuestionById } from "@/lib/questions/loader";
import { calcAnswerXP, checkLevelUp } from "@/lib/gamification/xp";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { sessionId, questionId, selectedIdx, timeSpentMs } = await req.json();

  const question = getQuestionById(questionId);
  if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

  const quizSession = await prisma.quizSession.findUnique({ where: { id: sessionId } });
  if (!quizSession || quizSession.userId !== userId) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const isCorrect = selectedIdx === question.correctIndex;
  const isBossFight = quizSession.mode === "boss";

  const xpEarned = calcAnswerXP({
    isCorrect,
    difficulty: question.difficulty,
    timeSpentMs,
    isBossFight,
  });

  // Record the answer
  await prisma.userAnswer.create({
    data: { userId, sessionId, questionId, selectedIdx, isCorrect, timeSpentMs: timeSpentMs ?? null },
  });

  // Update user XP and domain progress
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const oldXP = user.xp;
  const newXP = oldXP + xpEarned;

  const levelUpResult = checkLevelUp(oldXP, newXP);
  const newLevel = levelUpResult.leveledUp ? levelUpResult.newLevel! : user.level;

  await prisma.user.update({
    where: { id: userId },
    data: { xp: newXP, level: newLevel },
  });

  // Update domain progress
  await prisma.domainProgress.upsert({
    where: { userId_domain: { userId, domain: question.domain } },
    create: {
      userId,
      domain: question.domain,
      totalAnswered: 1,
      totalCorrect: isCorrect ? 1 : 0,
    },
    update: {
      totalAnswered: { increment: 1 },
      totalCorrect: isCorrect ? { increment: 1 } : undefined,
    },
  });

  // Check achievements
  const achievementsUnlocked = await checkAndUnlockAchievements(userId, { isCorrect, timeSpentMs, question });

  return NextResponse.json({
    isCorrect,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    xpEarned,
    newTotalXp: newXP,
    leveledUp: levelUpResult.leveledUp,
    newLevel: levelUpResult.newLevel,
    newLevelName: levelUpResult.newLevelName,
    achievementsUnlocked,
  });
}

async function checkAndUnlockAchievements(
  userId: string,
  ctx: { isCorrect: boolean; timeSpentMs?: number; question: ReturnType<typeof getQuestionById> }
) {
  const existingAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });
  const earnedKeys = new Set(existingAchievements.map((ua) => ua.achievement.key));

  const toUnlock: string[] = [];

  // first_blood
  if (!earnedKeys.has("first_blood") && ctx.isCorrect) {
    toUnlock.push("first_blood");
  }

  // speed_demon
  if (!earnedKeys.has("speed_demon") && ctx.isCorrect && ctx.timeSpentMs && ctx.timeSpentMs < 5000) {
    toUnlock.push("speed_demon");
  }

  // night_owl
  const hour = new Date().getUTCHours();
  if (!earnedKeys.has("night_owl") && (hour < 5 || hour >= 23)) {
    toUnlock.push("night_owl");
  }

  // streak-based and count-based achievements require session context — handled at session complete
  // For now, return newly unlocked achievements
  const unlocked = [];
  for (const key of toUnlock) {
    const achDef = ACHIEVEMENTS.find((a) => a.key === key);
    if (!achDef) continue;

    // Get or create the achievement in DB
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
    }).catch(() => {}); // ignore duplicate

    await prisma.user.update({ where: { id: userId }, data: { xp: { increment: achDef.xpReward } } });

    unlocked.push(achDef);
  }

  return unlocked;
}
