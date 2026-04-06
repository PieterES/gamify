"use client";

import { useRouter } from "next/navigation";
import { Swords, Clock } from "lucide-react";

export default function BossFightIntroPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8 text-center">
      {/* Boss icon */}
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full border-2 border-cyber-danger/50 flex items-center justify-center glow-red">
          <Swords size={48} className="text-cyber-danger" />
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold text-cyber-danger font-mono mb-2">BOSS FIGHT</h1>
        <p className="text-cyber-muted">Face the full AZ-500 exam simulation</p>
      </div>

      {/* Rules */}
      <div className="cyber-card p-6 text-left space-y-4">
        <h2 className="text-cyber-text font-semibold">Rules of Engagement</h2>
        <div className="space-y-3">
          {[
            { icon: "📝", text: "50 questions across all 4 exam domains" },
            { icon: "⚖️", text: "Questions weighted by exam percentage (identity 18%, networking 26%, compute 24%, defender 32%)" },
            { icon: "🚫", text: "No explanations until all questions are answered" },
            { icon: "💰", text: "All XP is doubled during Boss Fight" },
            { icon: "🏆", text: "Score 70% or higher to defeat the boss" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-3 text-sm text-cyber-muted">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-cyber-warning text-sm">
        <Clock size={16} />
        <span>No time limit — take your time</span>
      </div>

      <button
        onClick={() => router.push("/boss-fight/session")}
        className="w-full bg-cyber-danger text-white font-bold py-4 rounded-lg hover:bg-cyber-danger/90 transition-all glow-red text-lg"
      >
        Enter the Arena
      </button>
    </div>
  );
}
