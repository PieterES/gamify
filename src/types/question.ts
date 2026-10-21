export type CertId = "az500" | "ai300" | "clf" | "dea" | "mla";

export type Az500Domain = "identity" | "networking" | "compute" | "defender";
export type Ai300Domain =
  | "mlops-infra"
  | "ml-lifecycle"
  | "genaiops-infra"
  | "genai-quality"
  | "genai-optimize";

export type ClfDomain = "cloud-concepts" | "security-compliance" | "cloud-tech" | "billing-support";
export type DeaDomain = "data-ingestion" | "data-store" | "data-ops" | "data-governance";
export type MlaDomain = "ml-data-prep" | "ml-model-dev" | "ml-deploy" | "ml-operate-secure";

export type Domain = Az500Domain | Ai300Domain | ClfDomain | DeaDomain | MlaDomain;
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
