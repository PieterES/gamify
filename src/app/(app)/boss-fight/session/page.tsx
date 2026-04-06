"use client";

import { useState, useEffect, useCallback } from "react";
import { Question } from "@/types/question";
import { ResultsSummary } from "@/components/quiz/ResultsSummary";
import { AchievementDef } from "@/types/gamification";
import { cn } from "@/lib/utils";

interface FinalResult {
  score: number;
  total: number;
  xpEarned: number;
  streakDays: number;
  leveledUp: boolean;
  newLevel?: number;
  newLevelName?: string;
  achievementsUnlocked: AchievementDef[];
}

interface ReviewItem {
  question: Question;
  selected: number;
  correct: boolean;
}

export default function BossFightSessionPage() {
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<FinalResult | null>(null);
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    fetch("/api/quiz/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "boss" }),
    })
      .then((r) => r.json())
      .then((data) => {
        setSessionId(data.sessionId);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(null));
        setLoading(false);
      });
  }, []);

  const handleSelect = useCallback((idx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = idx;
      return next;
    });
  }, [currentIdx]);

  async function handleSubmit() {
    if (!sessionId) return;
    setSubmitted(true);

    const reviewItems: ReviewItem[] = [];

    // Submit all answers
    for (let i = 0; i < questions.length; i++) {
      const selected = answers[i] ?? 0;
      const res = await fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, questionId: questions[i].id, selectedIdx: selected }),
      });
      const data = await res.json();
      reviewItems.push({ question: questions[i], selected, correct: data.isCorrect });
    }

    setReview(reviewItems);

    // Complete session
    const completeRes = await fetch("/api/quiz/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const finalResult = await completeRes.json();
    setResult(finalResult);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-cyber-danger font-mono animate-pulse">Preparing boss encounter...</div>
      </div>
    );
  }

  if (result && !showReview) {
    return (
      <div>
        <ResultsSummary {...result} isBossFight />
        <div className="max-w-lg mx-auto mt-4">
          <button
            onClick={() => setShowReview(true)}
            className="w-full border border-cyber-border text-cyber-muted py-2 rounded hover:border-cyber-primary hover:text-cyber-text transition-colors text-sm"
          >
            Review All Answers
          </button>
        </div>
      </div>
    );
  }

  if (showReview) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-4">
        <h2 className="text-xl font-bold text-cyber-text">Answer Review</h2>
        {review.map(({ question, selected, correct }, i) => (
          <div key={question.id} className={cn("cyber-card p-4 border", correct ? "border-cyber-success/30" : "border-cyber-danger/30")}>
            <div className="text-sm font-medium text-cyber-text mb-2">{i + 1}. {question.question}</div>
            <div className={`text-sm ${correct ? "text-cyber-success" : "text-cyber-danger"}`}>
              Your answer: {question.options[selected]}
            </div>
            {!correct && (
              <div className="text-cyber-success text-sm mt-1">
                Correct: {question.options[question.correctIndex]}
              </div>
            )}
            <div className="text-cyber-muted text-xs mt-2">{question.explanation}</div>
          </div>
        ))}
      </div>
    );
  }

  const question = questions[currentIdx];
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-cyber-danger font-mono font-bold">BOSS FIGHT</div>
        <div className="text-cyber-muted text-sm font-mono">
          {answeredCount}/{questions.length} answered
        </div>
      </div>

      {/* Mini progress dots */}
      <div className="flex flex-wrap gap-1">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={cn(
              "w-5 h-5 rounded text-xs font-mono",
              i === currentIdx ? "bg-cyber-danger text-white" :
              answers[i] !== null ? "bg-cyber-border text-cyber-success" :
              "bg-cyber-border text-cyber-muted hover:bg-cyber-border/80"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="cyber-card p-6">
        <div className="flex justify-between text-xs text-cyber-muted mb-4">
          <span>{question.topic}</span>
          <span className="capitalize">{question.difficulty}</span>
        </div>
        <p className="text-cyber-text leading-relaxed">{question.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={cn(
              "w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3",
              answers[currentIdx] === idx
                ? "border-cyber-danger bg-cyber-danger/10"
                : "border-cyber-border bg-cyber-surface hover:border-cyber-danger/40 cursor-pointer"
            )}
          >
            <span className={cn(
              "flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono",
              answers[currentIdx] === idx ? "border-cyber-danger text-cyber-danger" : "border-cyber-border text-cyber-muted"
            )}>
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="text-sm text-cyber-text">{option}</span>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="border border-cyber-border px-4 py-2 rounded text-cyber-muted hover:text-cyber-text hover:border-cyber-primary disabled:opacity-30 transition-colors"
        >
          ← Prev
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
            className="border border-cyber-border px-4 py-2 rounded text-cyber-muted hover:text-cyber-text hover:border-cyber-primary transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="bg-cyber-danger text-white font-bold px-6 py-2 rounded hover:bg-cyber-danger/90 disabled:opacity-50 transition-colors"
          >
            {submitted ? "Submitting..." : `Submit (${answeredCount}/${questions.length})`}
          </button>
        )}
      </div>
    </div>
  );
}
