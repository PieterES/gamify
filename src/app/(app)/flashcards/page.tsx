"use client";

import { useRouter } from "next/navigation";
import { getDomainColor, getDomainLabel } from "@/lib/utils";
import { Domain } from "@/types/question";
import { Layers } from "lucide-react";

const DOMAINS: Domain[] = ["identity", "networking", "compute", "defender"];

export default function FlashcardsHubPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cyber-text flex items-center gap-2">
          <Layers size={24} className="text-cyber-accent" />
          Flashcards
        </h1>
        <p className="text-cyber-muted text-sm mt-1">Flip through cards to review key concepts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOMAINS.map((domain) => {
          const color = getDomainColor(domain);
          return (
            <button
              key={domain}
              onClick={() => router.push(`/flashcards/${domain}`)}
              className="cyber-card cyber-card-hover p-6 text-left"
            >
              <div className="font-semibold text-cyber-text mb-1">{getDomainLabel(domain)}</div>
              <div className="text-xs text-cyber-muted">Flip cards to test recall</div>
              <div className="w-full h-1 rounded-full mt-4" style={{ backgroundColor: `${color}33` }}>
                <div className="h-full w-full rounded-full opacity-50" style={{ backgroundColor: color }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
