"use client";

import { useEffect, useState } from "react";
import { getDomainColor, getDomainLabel } from "@/lib/utils";
import { User } from "lucide-react";

interface ProgressData {
  user: { email: string; name?: string; level: number; levelName: string; xp: number; streakDays: number; lastStudiedAt?: string };
  levelInfo: { progress: number };
  domainProgress: { domain: string; totalAnswered: number; totalCorrect: number; percentage: number }[];
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  achievements: { key: string; name: string; rarity: string; unlockedAt: string }[];
  recentSessions: { id: string; domain?: string; mode: string; score?: number; total?: number; xpEarned: number; startedAt: string; completedAt?: string }[];
}

export default function ProfilePage() {
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    fetch("/api/user/progress").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <div className="text-cyber-muted p-8 animate-pulse">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-cyber-primary flex items-center justify-center">
          <User size={32} className="text-cyber-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-cyber-text">{data.user.name ?? "Operative"}</h1>
          <div className="text-cyber-muted text-sm">{data.user.email}</div>
          <div className="text-cyber-accent text-sm mt-1">Level {data.user.level}: {data.user.levelName}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total XP", value: data.user.xp.toLocaleString(), color: "text-cyber-accent" },
          { label: "Streak", value: `${data.user.streakDays}d`, color: "text-cyber-warning" },
          { label: "Answered", value: data.totalAnswered, color: "text-cyber-primary" },
          { label: "Accuracy", value: `${data.accuracy}%`, color: "text-cyber-success" },
        ].map(({ label, value, color }) => (
          <div key={label} className="cyber-card p-4 text-center">
            <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
            <div className="text-cyber-muted text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Domain breakdown */}
      <div className="cyber-card p-5">
        <h2 className="text-sm font-semibold text-cyber-text mb-4">Domain Breakdown</h2>
        <div className="space-y-3">
          {["identity", "networking", "compute", "defender"].map((domain) => {
            const dp = data.domainProgress.find((d) => d.domain === domain);
            const color = getDomainColor(domain);
            return (
              <div key={domain}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cyber-muted">{getDomainLabel(domain)}</span>
                  <span className="font-mono" style={{ color }}>{dp?.percentage ?? 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-cyber-border rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${dp?.percentage ?? 0}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <h2 className="text-sm font-semibold text-cyber-text mb-3">Session History</h2>
        <div className="space-y-2">
          {data.recentSessions.map((s) => (
            <div key={s.id} className="cyber-card p-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="text-cyber-muted font-mono text-xs">
                  {new Date(s.startedAt).toLocaleDateString()}
                </span>
                <span className="text-cyber-text">
                  {s.mode === "boss" ? "Boss Fight" : s.domain ? getDomainLabel(s.domain) : "Mixed"}
                </span>
                {s.score !== null && s.total && (
                  <span className="text-cyber-muted text-xs">
                    {s.score}/{s.total}
                  </span>
                )}
              </div>
              <span className="text-cyber-primary font-mono">+{s.xpEarned} XP</span>
            </div>
          ))}
          {data.recentSessions.length === 0 && (
            <div className="text-cyber-muted text-sm text-center py-4">No sessions yet — start studying!</div>
          )}
        </div>
      </div>
    </div>
  );
}
