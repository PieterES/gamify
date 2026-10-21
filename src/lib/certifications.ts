import { CertId, Domain } from "@/types/question";

export interface DomainConfig {
  id: Domain;
  label: string;
  color: string;
  /** Official exam weight range, shown on domain cards */
  weight: string;
  /** Number of questions this domain gets in a 50-question Boss Fight */
  bossCount: number;
  /** Emoji used for the domain master achievement */
  emoji: string;
}

export interface CertConfig {
  id: CertId;
  code: string;
  name: string;
  subtitle: string;
  domains: DomainConfig[];
  /** Achievement key for mastering every domain of this cert */
  masterKey: string;
}

export const CERTIFICATIONS: Record<CertId, CertConfig> = {
  az500: {
    id: "az500",
    code: "AZ-500",
    name: "Azure Security Engineer Associate",
    subtitle: "Security Training Arena",
    masterKey: "all_domains_mastered",
    domains: [
      { id: "identity", label: "Identity & Access", color: "#7c3aed", weight: "15–20%", bossCount: 9, emoji: "🛡️" },
      { id: "networking", label: "Secure Networking", color: "#00d4ff", weight: "20–25%", bossCount: 13, emoji: "🌐" },
      { id: "compute", label: "Compute, Storage & DB", color: "#ffb800", weight: "20–25%", bossCount: 12, emoji: "💻" },
      { id: "defender", label: "Defender & Sentinel", color: "#00ff88", weight: "30–35%", bossCount: 16, emoji: "⚔️" },
    ],
  },
  ai300: {
    id: "ai300",
    code: "AI-300",
    name: "MLOps Engineer Associate",
    subtitle: "MLOps Training Arena",
    masterKey: "ai300_all_domains_mastered",
    domains: [
      { id: "mlops-infra", label: "MLOps Infrastructure", color: "#38bdf8", weight: "15–20%", bossCount: 9, emoji: "🏗️" },
      { id: "ml-lifecycle", label: "ML Model Lifecycle", color: "#f472b6", weight: "25–30%", bossCount: 14, emoji: "🔁" },
      { id: "genaiops-infra", label: "GenAIOps Infrastructure", color: "#a78bfa", weight: "20–25%", bossCount: 11, emoji: "🧠" },
      { id: "genai-quality", label: "GenAI Quality & Observability", color: "#34d399", weight: "10–15%", bossCount: 8, emoji: "🔭" },
      { id: "genai-optimize", label: "GenAI Optimization", color: "#fbbf24", weight: "10–15%", bossCount: 8, emoji: "⚙️" },
    ],
  },
};

export const CERT_IDS = Object.keys(CERTIFICATIONS) as CertId[];
export const DEFAULT_CERT: CertId = "az500";

export function isCertId(value: unknown): value is CertId {
  return typeof value === "string" && value in CERTIFICATIONS;
}

export function getCert(id: CertId): CertConfig {
  return CERTIFICATIONS[id];
}

export function getDomainConfig(domain: string): DomainConfig | undefined {
  for (const cert of Object.values(CERTIFICATIONS)) {
    const found = cert.domains.find((d) => d.id === domain);
    if (found) return found;
  }
  return undefined;
}

export function getCertForDomain(domain: string): CertConfig | undefined {
  return Object.values(CERTIFICATIONS).find((c) => c.domains.some((d) => d.id === domain));
}
