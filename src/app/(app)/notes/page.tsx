"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Lightbulb } from "lucide-react";
import { useCert } from "@/components/CertProvider";
import { SUMMARIES } from "@/data/summaries";
import { Domain } from "@/types/question";
import { cn, getDomainColor, getDomainLabel } from "@/lib/utils";

export default function NotesPage() {
  const { cert } = useCert();
  const summaries = SUMMARIES[cert.id] ?? [];
  const [openDomain, setOpenDomain] = useState<Domain | null>(null);

  // Open the first domain whenever the certificate changes
  useEffect(() => { setOpenDomain(summaries[0]?.domain ?? null); }, [cert.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyber-text flex items-center gap-2">
          <BookOpen size={24} className="text-cyber-primary" />
          Study Notes
        </h1>
        <p className="text-cyber-muted text-sm mt-1">{cert.code} · {cert.name}</p>
      </div>

      {summaries.length === 0 && (
        <div className="cyber-card p-6 text-cyber-muted text-sm">
          No study notes for {cert.code} yet. Switch certificate in the sidebar, or practise with the{" "}
          <Link href="/quiz" className="text-cyber-primary hover:underline">quiz</Link>.
        </div>
      )}

      {summaries.map((s) => {
        const color = getDomainColor(s.domain);
        const weight = cert.domains.find((d) => d.id === s.domain)?.weight;
        const isOpen = openDomain === s.domain;
        return (
          <div key={s.domain} className="cyber-card overflow-hidden border-l-2" style={{ borderLeftColor: color }}>
            <button
              onClick={() => setOpenDomain(isOpen ? null : s.domain)}
              className="w-full p-5 text-left flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-cyber-text">{getDomainLabel(s.domain)}</span>
                  {weight && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full border" style={{ color, borderColor: color }}>
                      {weight}
                    </span>
                  )}
                </div>
                <p className="text-cyber-muted text-sm mt-2 leading-relaxed">{s.overview}</p>
              </div>
              <ChevronDown
                size={18}
                className={cn("text-cyber-muted flex-shrink-0 mt-1 transition-transform", isOpen && "rotate-180")}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 space-y-5">
                {s.sections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="text-sm font-semibold mb-2" style={{ color }}>{section.heading}</h3>
                    <ul className="space-y-2">
                      {section.points.map((p) => (
                        <li key={p} className="text-sm text-cyber-text leading-relaxed flex gap-2">
                          <span className="text-cyber-muted">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="rounded-lg border border-cyber-warning/30 bg-cyber-warning/5 p-4">
                  <div className="flex items-center gap-2 text-cyber-warning text-sm font-semibold mb-2">
                    <Lightbulb size={16} />
                    Exam tips
                  </div>
                  <ul className="space-y-1.5">
                    {s.examTips.map((t) => (
                      <li key={t} className="text-sm text-cyber-text leading-relaxed">{t}</li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/quiz/session?domain=${s.domain}`}
                  className="inline-block text-sm font-semibold px-4 py-2 rounded border transition-colors hover:bg-cyber-surface-2"
                  style={{ color, borderColor: color }}
                >
                  Practise this domain →
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
