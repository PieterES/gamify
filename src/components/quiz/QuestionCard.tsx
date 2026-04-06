"use client";

import { Question } from "@/types/question";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedIndex: number | null;
  revealed: boolean;
  onAnswer: (index: number) => void;
}

const difficultyColors = {
  associate: "text-cyber-success border-cyber-success/30 bg-cyber-success/10",
  professional: "text-cyber-warning border-cyber-warning/30 bg-cyber-warning/10",
  expert: "text-cyber-danger border-cyber-danger/30 bg-cyber-danger/10",
};

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  revealed,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-cyber-muted text-sm">
            {questionNumber}/{totalQuestions}
          </span>
          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-mono", difficultyColors[question.difficulty])}>
            {question.difficulty}
          </span>
        </div>
        <span className="text-xs text-cyber-muted truncate max-w-48">{question.topic}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-cyber-border rounded-full">
        <div
          className="h-full bg-cyber-primary rounded-full transition-all duration-300"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="cyber-card p-6">
        <p className="text-cyber-text text-base leading-relaxed">{question.question}</p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          let state: "default" | "correct" | "wrong" | "missed" = "default";
          if (revealed) {
            if (idx === question.correctIndex) state = "correct";
            else if (idx === selectedIndex) state = "wrong";
          }

          return (
            <button
              key={idx}
              onClick={() => !revealed && onAnswer(idx)}
              disabled={revealed}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all duration-200",
                "flex items-start gap-3",
                {
                  "border-cyber-border bg-cyber-surface hover:border-cyber-primary/50 hover:bg-cyber-surface-2 cursor-pointer":
                    state === "default",
                  "border-cyber-success bg-cyber-success/10 glow-green": state === "correct",
                  "border-cyber-danger bg-cyber-danger/10": state === "wrong",
                  "border-cyber-border bg-cyber-surface opacity-50 cursor-default": revealed && state === "default",
                }
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono font-bold",
                  {
                    "border-cyber-border text-cyber-muted": state === "default",
                    "border-cyber-success text-cyber-success": state === "correct",
                    "border-cyber-danger text-cyber-danger": state === "wrong",
                  }
                )}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className={cn("text-sm leading-relaxed", {
                "text-cyber-text": state === "default",
                "text-cyber-success": state === "correct",
                "text-cyber-danger": state === "wrong",
              })}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "p-4 rounded-lg border text-sm leading-relaxed",
              selectedIndex === question.correctIndex
                ? "border-cyber-success/30 bg-cyber-success/5 text-cyber-text"
                : "border-cyber-danger/30 bg-cyber-danger/5 text-cyber-text"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={selectedIndex === question.correctIndex ? "text-cyber-success" : "text-cyber-danger"}>
                {selectedIndex === question.correctIndex ? "✓ Correct!" : "✗ Incorrect"}
              </span>
            </div>
            <p>{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
