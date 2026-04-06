"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AchievementDef } from "@/types/gamification";

interface ResultsSummaryProps {
  score: number;
  total: number;
  xpEarned: number;
  streakDays: number;
  leveledUp: boolean;
  newLevel?: number;
  newLevelName?: string;
  achievementsUnlocked: AchievementDef[];
  isBossFight?: boolean;
}

export function ResultsSummary({
  score, total, xpEarned, streakDays, leveledUp, newLevel, newLevelName,
  achievementsUnlocked, isBossFight,
}: ResultsSummaryProps) {
  const router = useRouter();
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = pct >= 70;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto space-y-6 py-8"
    >
      {/* Score circle */}
      <div className="text-center">
        <div className={`text-6xl font-mono font-bold mb-1 ${passed ? "text-cyber-success text-glow-cyan" : "text-cyber-danger"}`}>
          {pct}%
        </div>
        <div className="text-cyber-muted text-sm">{score} / {total} correct</div>
        {isBossFight && (
          <div className={`mt-2 text-sm font-semibold ${passed ? "text-cyber-success" : "text-cyber-danger"}`}>
            {passed ? "BOSS DEFEATED" : "BOSS ESCAPED"}
          </div>
        )}
      </div>

      {/* XP earned */}
      <div className="cyber-card p-4 text-center">
        <div className="text-cyber-primary font-mono text-2xl font-bold">+{xpEarned} XP</div>
        {streakDays > 1 && (
          <div className="text-cyber-warning text-sm mt-1">🔥 {streakDays}-day streak active!</div>
        )}
      </div>

      {/* Level up */}
      {leveledUp && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-4 border-cyber-accent/50 glow-purple text-center"
        >
          <div className="text-cyber-accent font-bold text-lg">LEVEL UP!</div>
          <div className="text-cyber-text">Level {newLevel}: {newLevelName}</div>
        </motion.div>
      )}

      {/* Achievements */}
      {achievementsUnlocked.length > 0 && (
        <div className="cyber-card p-4">
          <h3 className="text-cyber-warning text-sm font-semibold mb-3">Achievements Unlocked!</h3>
          <div className="space-y-2">
            {achievementsUnlocked.map((a) => (
              <div key={a.key} className="flex items-center justify-between">
                <div>
                  <div className="text-cyber-text text-sm font-medium">{a.name}</div>
                  <div className="text-cyber-muted text-xs">{a.description}</div>
                </div>
                <div className="text-cyber-warning text-sm font-mono">+{a.xpReward} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => router.push("/quiz")}>
          New Quiz
        </Button>
        <Button variant="primary" className="flex-1" onClick={() => router.push("/dashboard")}>
          Dashboard
        </Button>
      </div>
    </motion.div>
  );
}
