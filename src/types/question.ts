export type CertId = "az500" | "ai300";

export type Az500Domain = "identity" | "networking" | "compute" | "defender";
export type Ai300Domain =
  | "mlops-infra"
  | "ml-lifecycle"
  | "genaiops-infra"
  | "genai-quality"
  | "genai-optimize";

export type Domain = Az500Domain | Ai300Domain;
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
