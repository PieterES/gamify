"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDomainColor, getDomainLabel } from "@/lib/utils";
import { getTopicsForDomain } from "@/lib/questions/loader";
import { Domain } from "@/types/question";
import { Brain } from "lucide-react";

const DOMAINS: Domain[] = ["identity", "networking", "compute", "defender"];
const DOMAIN_WEIGHTS: Record<Domain, string> = {
  identity: "15–20%",
  networking: "20–25%",
  compute: "20–25%",
  defender: "30–35%",
};

export default function QuizHubPage() {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const topics = selectedDomain ? getTopicsForDomain(selectedDomain) : [];

  function startQuiz() {
    if (!selectedDomain) return;
    const params = new URLSearchParams({ domain: selectedDomain });
    if (selectedTopic) params.set("topic", selectedTopic);
    router.push(`/quiz/session?${params.toString()}`);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cyber-text flex items-center gap-2">
          <Brain size={24} className="text-cyber-primary" />
          Quiz Mode
        </h1>
        <p className="text-cyber-muted text-sm mt-1">Select a domain to start a 10-question quiz</p>
      </div>

      {/* Domain cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOMAINS.map((domain) => {
          const color = getDomainColor(domain);
          const isSelected = selectedDomain === domain;
          return (
            <button
              key={domain}
              onClick={() => { setSelectedDomain(domain); setSelectedTopic(""); }}
              className={`cyber-card p-5 text-left transition-all border ${
                isSelected ? "border-opacity-100 glow-cyan" : "cyber-card-hover border-cyber-border"
              }`}
              style={isSelected ? { borderColor: color } : {}}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-cyber-text">{getDomainLabel(domain)}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full border" style={{ color, borderColor: color }}>
                  {DOMAIN_WEIGHTS[domain]}
                </span>
              </div>
              <div
                className="w-full h-1 rounded-full mt-3"
                style={{ backgroundColor: `${color}33` }}
              >
                <div className="h-full w-0 rounded-full" style={{ backgroundColor: color }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Topic filter */}
      {selectedDomain && topics.length > 0 && (
        <div>
          <label className="block text-sm text-cyber-muted mb-2">Filter by topic (optional)</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full bg-cyber-surface border border-cyber-border rounded px-3 py-2 text-cyber-text text-sm focus:outline-none focus:border-cyber-primary"
          >
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={startQuiz}
        disabled={!selectedDomain}
        className="w-full bg-cyber-primary text-cyber-bg font-bold py-3 rounded-lg hover:bg-cyber-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-lg"
      >
        {selectedDomain ? `Start Quiz: ${getDomainLabel(selectedDomain)}` : "Select a domain"}
      </button>
    </div>
  );
}
