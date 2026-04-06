export type Domain = "identity" | "networking" | "compute" | "defender";
export type Difficulty = "associate" | "professional" | "expert";

export interface Question {
  id: string;
  domain: Domain;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags?: string[];
}
