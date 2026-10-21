import { CertId } from "@/types/question";
import { DomainSummary } from "./types";
import { ai300Summaries } from "./ai300";

export const SUMMARIES: Partial<Record<CertId, DomainSummary[]>> = {
  ai300: ai300Summaries,
};

export type { DomainSummary, NoteSection } from "./types";
