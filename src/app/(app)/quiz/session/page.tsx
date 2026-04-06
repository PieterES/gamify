"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Question } from "@/types/question";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { ResultsSummary } from "@/components/quiz/ResultsSummary";
import { AchievementUnlockOverlay } from "@/components/achievements/AchievementUnlockOverlay";
import { AchievementDef } from "@/types/gamification";

interface SessionResult {
  score: number;
  total: number;
  xpEarned: number;
  streakDays: number;
  leveledUp: boolean;
  newLevel?: number;
  newLevelName?: string;
  achievementsUnlocked: AchievementDef[];
}

function QuizSessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const domain = searchParams.get("domain");
  const topic = searchParams.get("topic") ?? undefined;

  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Achievement overlay queue: achievements to show right now
  const [overlayQueue, setOverlayQueue] = useState<AchievementDef[]>([]);
  // Pending result to show after overlay finishes
  const [pendingResult, setPendingResult] = useState<SessionResult | null>(null);

  useEffect(() => {
    if (!domain) { router.push("/quiz"); return; }

    fetch("/api/quiz/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, topic, mode: "quiz" }),
    })
      .then((r) => r.json())
      .then((data) => {
        setSessionId(data.sessionId);
        setQuestions(data.questions);
        setLoading(false);
        setQuestionStartTime(Date.now());
      });
  }, [domain, topic, router]);

  const handleAnswer = useCallback(async (idx: number) => {
    if (!sessionId || revealed) return;
    const timeSpentMs = Date.now() - questionStartTime;
    setSelectedIndex(idx);
    setRevealed(true);

    const res = await fetch("/api/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        questionId: questions[currentIdx].id,
        selectedIdx: idx,
        timeSpentMs,
      }),
    });
    const result = await res.json();

    // Show overlay immediately for answer-time achievements
    if (result.achievementsUnlocked?.length) {
      setOverlayQueue(result.achievementsUnlocked);
    }
  }, [sessionId, revealed, questions, currentIdx, questionStartTime]);

  const handleNext = useCallback(async () => {
    if (currentIdx + 1 >= questions.length) {
      const res = await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const result = await res.json();

      if (result.achievementsUnlocked?.length) {
        // Show overlay before transitioning to results
        setPendingResult(result);
        setOverlayQueue(result.achievementsUnlocked);
      } else {
        setSessionResult(result);
      }
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedIndex(null);
      setRevealed(false);
      setQuestionStartTime(Date.now());
    }
  }, [currentIdx, questions.length, sessionId]);

  function handleOverlayComplete() {
    setOverlayQueue([]);
    if (pendingResult) {
      setSessionResult(pendingResult);
      setPendingResult(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-cyber-primary font-mono animate-pulse">Loading questions...</div>
      </div>
    );
  }

  if (sessionResult) {
    return <ResultsSummary {...sessionResult} />;
  }

  const question = questions[currentIdx];

  return (
    <>
      <div className="max-w-2xl mx-auto py-6 space-y-4">
        <QuestionCard
          question={question}
          questionNumber={currentIdx + 1}
          totalQuestions={questions.length}
          selectedIndex={selectedIndex}
          revealed={revealed}
          onAnswer={handleAnswer}
        />

        {revealed && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="bg-cyber-primary text-cyber-bg font-semibold px-6 py-2 rounded hover:bg-cyber-primary/90 transition-colors"
            >
              {currentIdx + 1 >= questions.length ? "See Results" : "Next Question →"}
            </button>
          </div>
        )}
      </div>

      {/* Achievement overlay — shown on top of everything */}
      <AnimatePresence>
        {overlayQueue.length > 0 && (
          <AchievementUnlockOverlay
            achievements={overlayQueue}
            onComplete={handleOverlayComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function QuizSessionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="text-cyber-primary font-mono animate-pulse">Loading...</div></div>}>
      <QuizSessionContent />
    </Suspense>
  );
}
