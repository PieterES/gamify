import { Domain } from "@/types/question";

export interface NoteSection {
  heading: string;
  points: string[];
}

export interface DomainSummary {
  domain: Domain;
  overview: string;
  sections: NoteSection[];
  examTips: string[];
}
