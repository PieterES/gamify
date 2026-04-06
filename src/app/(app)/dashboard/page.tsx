"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, Layers, Swords, Trophy } from "lucide-react";
import { getDomainColor, getDomainLabel } from "@/lib/utils";

interface ProgressData {
  user: { name?: string; level: number; levelName: string; xp: number; streakDays: number };
  levelInfo: { current: { name: string }; next: { xpRequired: number } | null; progress: number };
  domainProgress: { domain: string; totalAnswered: number; totalCorrect: number; percentage: number }[];
  totalAnswered: number;
  accuracy: number;
  achievements: { key: string; name: string }[];
  recentSessions: { id: string; domain?: string; mode: string; score?: number; total?: number; xpEarned: number; startedAt: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    fetch("/api/user/progress").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-cyber-primary font-mono animate-pulse">Loading your arena...</div>
      </div>
    );
  }

  const domains = ["identity", "networking", "compute", "defender"];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-cyber-text">
          Welcome back, <span className="text-cyber-primary">{data.user.name ?? "Operative"}</span>
        </h1>
        <p className="text-cyber-muted text-sm mt-1">Level {data.user.level}: {data.user.levelName}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "XP Total", value: data.user.xp.toLocaleString(), color: "text-cyber-accent" },
          { label: "Streak", value: `${data.user.streakDays}d`, color: "text-cyber-warning" },
          { label: "Questions", value: data.totalAnswered, color: "text-cyber-primary" },
          { label: "Accuracy", value: `${data.accuracy}%`, color: "text-cyber-success" },
        ].map(({ label, value, color }) => (
          <div key={label} className="cyber-card p-4 text-center">
            <div className={`text-2xl font-mono font-bold ${color}`}>{value}</div>
            <div className="text-cyber-muted text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* XP Bar */}
      <div className="cyber-card p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-cyber-accent font-semibold">Level {data.user.level}: {data.user.levelName}</span>
          <span className="text-cyber-muted font-mono">{data.levelInfo.progress}%</span>
        </div>
        <div className="w-full h-3 bg-cyber-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyber-accent to-cyber-primary rounded-full transition-all duration-700"
            style={{ width: `${data.levelInfo.progress}%` }}
          />
        </div>
        {data.levelInfo.next && (
          <div className="text-right text-xs text-cyber-muted font-mono mt-1">
            {data.levelInfo.next.xpRequired.toLocaleString()} XP to next level
          </div>
        )}
      </div>

      {/* Domain Progress */}
      <div>
        <h2 className="text-lg font-semibold text-cyber-text mb-4">Domain Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domains.map((domain) => {
            const dp = data.domainProgress.find((d) => d.domain === domain);
            const pct = dp?.percentage ?? 0;
            const color = getDomainColor(domain);
            return (
              <div key={domain} className="cyber-card cyber-card-hover p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-cyber-text">{getDomainLabel(domain)}</span>
                  <span className="font-mono text-sm font-bold" style={{ color }}>{pct}%</span>
                </div>
                <div className="w-full h-2 bg-cyber-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <div className="text-cyber-muted text-xs mt-2">
                  {dp?.totalAnswered ?? 0} answered · {dp?.totalCorrect ?? 0} correct
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-cyber-text mb-4">Quick Start</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: "/quiz", label: "Start Quiz", icon: Brain, color: "border-cyber-primary/30 hover:border-cyber-primary" },
            { href: "/flashcards", label: "Flashcards", icon: Layers, color: "border-cyber-accent/30 hover:border-cyber-accent" },
            { href: "/boss-fight", label: "Boss Fight", icon: Swords, color: "border-cyber-danger/30 hover:border-cyber-danger" },
            { href: "/achievements", label: "Achievements", icon: Trophy, color: "border-cyber-warning/30 hover:border-cyber-warning" },
          ].map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={`cyber-card ${color} border p-4 flex flex-col items-center gap-2 transition-all hover:scale-105`}
            >
              <Icon size={24} className="text-cyber-muted" />
              <span className="text-sm text-cyber-text">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {data.recentSessions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-cyber-text mb-4">Recent Sessions</h2>
          <div className="space-y-2">
            {data.recentSessions.slice(0, 5).map((s) => (
              <div key={s.id} className="cyber-card p-3 flex items-center justify-between">
                <div>
                  <span className="text-cyber-text text-sm">
                    {s.domain ? getDomainLabel(s.domain) : "Boss Fight"}
                  </span>
                  {s.score != null && s.total != null && (
                    <span className="text-cyber-muted text-xs ml-2">
                      {s.score}/{s.total} ({Math.round((s.score / s.total) * 100)}%)
                    </span>
                  )}
                </div>
                <span className="text-cyber-primary text-sm font-mono">+{s.xpEarned} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
