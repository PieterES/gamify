"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface UserAchievement { key: string; name: string; unlockedAt: string }

const rarityColors: Record<string, string> = {
  common: "border-cyber-border",
  rare: "border-blue-500/50",
  epic: "border-cyber-accent/50",
  legendary: "border-cyber-warning/70",
};
const rarityBg: Record<string, string> = {
  common: "",
  rare: "bg-blue-500/5",
  epic: "bg-cyber-accent/5",
  legendary: "bg-cyber-warning/5",
};

export default function AchievementsPage() {
  const [earned, setEarned] = useState<Set<string>>(new Set());
  const [earnedMap, setEarnedMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/user/progress")
      .then((r) => r.json())
      .then((data) => {
        const keys = new Set<string>(data.achievements.map((a: UserAchievement) => a.key));
        const map: Record<string, string> = {};
        data.achievements.forEach((a: UserAchievement) => { map[a.key] = a.unlockedAt; });
        setEarned(keys);
        setEarnedMap(map);
      });
  }, []);

  const earnedCount = earned.size;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cyber-text flex items-center gap-2">
            <Trophy size={24} className="text-cyber-warning" />
            Achievements
          </h1>
          <p className="text-cyber-muted text-sm mt-1">
            {earnedCount} / {ACHIEVEMENTS.length} unlocked
          </p>
        </div>
        <div className="text-cyber-warning font-mono font-bold text-2xl">{Math.round((earnedCount / ACHIEVEMENTS.length) * 100)}%</div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-cyber-border rounded-full">
        <div
          className="h-full bg-cyber-warning rounded-full transition-all duration-700"
          style={{ width: `${(earnedCount / ACHIEVEMENTS.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((a) => {
          const isEarned = earned.has(a.key);
          return (
            <div
              key={a.key}
              className={cn(
                "cyber-card p-4 border transition-all",
                isEarned ? rarityColors[a.rarity] + " " + rarityBg[a.rarity] : "border-cyber-border opacity-50",
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-2xl">{isEarned ? "🏅" : "🔒"}</div>
                <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize",
                  a.rarity === "legendary" ? "bg-cyber-warning/20 text-cyber-warning" :
                  a.rarity === "epic" ? "bg-cyber-accent/20 text-cyber-accent" :
                  a.rarity === "rare" ? "bg-blue-500/20 text-blue-400" :
                  "bg-cyber-border text-cyber-muted"
                )}>
                  {a.rarity}
                </span>
              </div>
              <div className="font-semibold text-cyber-text text-sm">{a.name}</div>
              <div className="text-cyber-muted text-xs mt-1">{a.description}</div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-cyber-warning text-xs font-mono">+{a.xpReward} XP</span>
                {isEarned && earnedMap[a.key] && (
                  <span className="text-cyber-muted text-xs">
                    {new Date(earnedMap[a.key]).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
