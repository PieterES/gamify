"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Question, Domain } from "@/types/question";
import { selectFlashcards } from "@/lib/questions/selector";
import { getDomainLabel } from "@/lib/utils";

export default function FlashcardSessionPage() {
  const params = useParams();
  const router = useRouter();
  const domain = params.domain as Domain;

  const [cards, setCards] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [studying, setStudying] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const questions = selectFlashcards(domain, 20);
    setCards(questions);
  }, [domain]);

  function handleKnow() {
    setKnown((k) => k + 1);
    next();
  }

  function handleStudyAgain() {
    setStudying((s) => s + 1);
    next();
  }

  function next() {
    if (currentIdx + 1 >= cards.length) {
      setDone(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setFlipped(false);
    }
  }

  if (cards.length === 0) return <div className="text-cyber-muted p-8">Loading...</div>;

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 space-y-6">
        <div className="text-3xl font-mono font-bold text-cyber-primary">Deck Complete!</div>
        <div className="cyber-card p-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-cyber-success">Got it</span>
            <span className="font-mono text-cyber-success">{known}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cyber-warning">Study again</span>
            <span className="font-mono text-cyber-warning">{studying}</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setCurrentIdx(0); setFlipped(false); setKnown(0); setStudying(0); setDone(false); setCards(selectFlashcards(domain, 20)); }}
            className="bg-cyber-surface border border-cyber-border px-6 py-2 rounded text-cyber-text hover:border-cyber-primary transition-colors"
          >
            Shuffle Again
          </button>
          <button
            onClick={() => router.push("/flashcards")}
            className="bg-cyber-primary text-cyber-bg font-semibold px-6 py-2 rounded hover:bg-cyber-primary/90 transition-colors"
          >
            Pick Domain
          </button>
        </div>
      </div>
    );
  }

  const card = cards[currentIdx];

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-cyber-text">{getDomainLabel(domain)}</h1>
        <span className="text-cyber-muted text-sm font-mono">{currentIdx + 1}/{cards.length}</span>
      </div>

      {/* Progress */}
      <div className="w-full h-1 bg-cyber-border rounded-full">
        <div
          className="h-full bg-cyber-accent rounded-full transition-all"
          style={{ width: `${((currentIdx) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="relative cursor-pointer"
        style={{ perspective: "1200px", minHeight: "260px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="cyber-card p-8 border-cyber-primary/30 min-h-[260px] flex flex-col justify-between"
            >
              <div className="text-xs text-cyber-muted mb-2">{card.topic}</div>
              <p className="text-cyber-text text-base leading-relaxed">{card.question}</p>
              <div className="text-cyber-muted text-xs text-center mt-4">Tap to reveal answer</div>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="cyber-card p-8 border-cyber-success/30 bg-cyber-success/5 min-h-[260px] flex flex-col justify-between"
            >
              <div className="text-xs text-cyber-success mb-2">Answer</div>
              <div>
                <p className="text-cyber-success font-semibold mb-3">{card.options[card.correctIndex]}</p>
                <p className="text-cyber-text text-sm leading-relaxed">{card.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons — only show after flip */}
      {flipped && (
        <div className="flex gap-3">
          <button
            onClick={handleStudyAgain}
            className="flex-1 border border-cyber-warning/50 text-cyber-warning py-3 rounded-lg hover:bg-cyber-warning/10 transition-colors font-semibold"
          >
            Study Again
          </button>
          <button
            onClick={handleKnow}
            className="flex-1 border border-cyber-success/50 text-cyber-success py-3 rounded-lg hover:bg-cyber-success/10 transition-colors font-semibold"
          >
            Got It ✓
          </button>
        </div>
      )}
    </div>
  );
}
