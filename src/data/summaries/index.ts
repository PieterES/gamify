import { CertId } from "@/types/question";
import { DomainSummary } from "./types";
import { ai300Summaries } from "./ai300";
import { clfSummaries, deaSummaries, mlaSummaries } from "./aws";

export const SUMMARIES: Partial<Record<CertId, DomainSummary[]>> = {
  ai300: ai300Summaries,
  clf: clfSummaries,
  dea: deaSummaries,
  mla: mlaSummaries,
};

export type { DomainSummary, NoteSection } from "./types";
