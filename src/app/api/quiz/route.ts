import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { selectQuestionsForQuiz } from "@/lib/questions/selector";
import { Domain } from "@/types/question";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain") as Domain | null;
  const topic = searchParams.get("topic") ?? undefined;
  const count = parseInt(searchParams.get("count") ?? "10", 10);

  if (!domain) {
    return NextResponse.json({ error: "domain is required" }, { status: 400 });
  }

  const questions = selectQuestionsForQuiz({ domain, topic, count });
  return NextResponse.json({ questions });
}
