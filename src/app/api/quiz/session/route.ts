import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { selectQuestionsForQuiz, selectBossFightQuestions } from "@/lib/questions/selector";
import { Domain } from "@/types/question";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json();
  const { domain, topic, mode } = body as { domain?: Domain; topic?: string; mode: string };

  let questions;
  if (mode === "boss") {
    questions = selectBossFightQuestions();
  } else if (domain) {
    questions = selectQuestionsForQuiz({ domain, topic, count: 10 });
  } else {
    return NextResponse.json({ error: "domain required for quiz/flashcard mode" }, { status: 400 });
  }

  const quizSession = await prisma.quizSession.create({
    data: {
      userId,
      domain: domain ?? null,
      topic: topic ?? null,
      mode,
      total: questions.length,
    },
  });

  return NextResponse.json({ sessionId: quizSession.id, questions });
}
