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
  /** Name of the domain master achievement (generated certs only) */
  badgeName?: string;
}

export interface CertConfig {
  id: CertId;
  provider: "Microsoft Azure" | "AWS";
  code: string;
  name: string;
  subtitle: string;
  domains: DomainConfig[];
  /** Achievement key for mastering every domain of this cert */
  masterKey: string;
  masterName: string;
  masterEmoji: string;
}

export const CERTIFICATIONS: Record<CertId, CertConfig> = {
  az500: {
    id: "az500",
    provider: "Microsoft Azure",
    code: "AZ-500",
    name: "Azure Security Engineer Associate",
    subtitle: "Security Training Arena",
    masterKey: "all_domains_mastered",
    masterName: "Azure Security God",
    masterEmoji: "👑",
    domains: [
      { id: "identity", label: "Identity & Access", color: "#7c3aed", weight: "15–20%", bossCount: 9, emoji: "🛡️" },
      { id: "networking", label: "Secure Networking", color: "#00d4ff", weight: "20–25%", bossCount: 13, emoji: "🌐" },
      { id: "compute", label: "Compute, Storage & DB", color: "#ffb800", weight: "20–25%", bossCount: 12, emoji: "💻" },
      { id: "defender", label: "Defender & Sentinel", color: "#00ff88", weight: "30–35%", bossCount: 16, emoji: "⚔️" },
    ],
  },
  ai300: {
    id: "ai300",
    provider: "Microsoft Azure",
    code: "AI-300",
    name: "MLOps Engineer Associate",
    subtitle: "MLOps Training Arena",
    masterKey: "ai300_all_domains_mastered",
    masterName: "MLOps Overlord",
    masterEmoji: "🤖",
    domains: [
      { id: "mlops-infra", label: "MLOps Infrastructure", color: "#38bdf8", weight: "15–20%", bossCount: 9, emoji: "🏗️", badgeName: "Infra Architect" },
      { id: "ml-lifecycle", label: "ML Model Lifecycle", color: "#f472b6", weight: "25–30%", bossCount: 14, emoji: "🔁", badgeName: "Lifecycle Master" },
      { id: "genaiops-infra", label: "GenAIOps Infrastructure", color: "#a78bfa", weight: "20–25%", bossCount: 11, emoji: "🧠", badgeName: "GenAIOps Master" },
      { id: "genai-quality", label: "GenAI Quality & Observability", color: "#34d399", weight: "10–15%", bossCount: 8, emoji: "🔭", badgeName: "Eval Master" },
      { id: "genai-optimize", label: "GenAI Optimization", color: "#fbbf24", weight: "10–15%", bossCount: 8, emoji: "⚙️", badgeName: "Optimization Master" },
    ],
  },
  clf: {
    id: "clf",
    provider: "AWS",
    code: "CLF-C02",
    name: "AWS Certified Cloud Practitioner",
    subtitle: "Cloud Basics Arena",
    masterKey: "clf_all_domains_mastered",
    masterName: "Cloud Practitioner Supreme",
    masterEmoji: "☁️",
    domains: [
      { id: "cloud-concepts", label: "Cloud Concepts", color: "#60a5fa", weight: "24%", bossCount: 12, emoji: "💡", badgeName: "Cloud Thinker" },
      { id: "security-compliance", label: "Security & Compliance", color: "#f87171", weight: "30%", bossCount: 15, emoji: "🔐", badgeName: "Shared Responsibility Hero" },
      { id: "cloud-tech", label: "Cloud Technology & Services", color: "#fb923c", weight: "34%", bossCount: 17, emoji: "🧰", badgeName: "Service Catalogue" },
      { id: "billing-support", label: "Billing, Pricing & Support", color: "#4ade80", weight: "12%", bossCount: 6, emoji: "💶", badgeName: "Cost Whisperer" },
    ],
  },
  dea: {
    id: "dea",
    provider: "AWS",
    code: "DEA-C01",
    name: "AWS Certified Data Engineer – Associate",
    subtitle: "Data Pipeline Arena",
    masterKey: "dea_all_domains_mastered",
    masterName: "Lakehouse Legend",
    masterEmoji: "🌊",
    domains: [
      { id: "data-ingestion", label: "Ingestion & Transformation", color: "#22d3ee", weight: "34%", bossCount: 17, emoji: "🚰", badgeName: "Pipeline Plumber" },
      { id: "data-store", label: "Data Store Management", color: "#c084fc", weight: "26%", bossCount: 13, emoji: "🗄️", badgeName: "Storage Sage" },
      { id: "data-ops", label: "Data Operations & Support", color: "#facc15", weight: "22%", bossCount: 11, emoji: "🛠️", badgeName: "Ops Operator" },
      { id: "data-governance", label: "Security & Governance", color: "#f43f5e", weight: "18%", bossCount: 9, emoji: "🏛️", badgeName: "Data Guardian" },
    ],
  },
  mla: {
    id: "mla",
    provider: "AWS",
    code: "MLA-C02",
    name: "AWS Certified Machine Learning Engineer – Associate",
    subtitle: "SageMaker & Bedrock Arena",
    masterKey: "mla_all_domains_mastered",
    masterName: "SageMaker Sensei",
    masterEmoji: "🦾",
    domains: [
      { id: "ml-data-prep", label: "Data Preparation for ML & AI", color: "#2dd4bf", weight: "28%", bossCount: 14, emoji: "🧪", badgeName: "Feature Forger" },
      { id: "ml-model-dev", label: "ML & Foundation Model Development", color: "#818cf8", weight: "24%", bossCount: 12, emoji: "🧬", badgeName: "Model Maker" },
      { id: "ml-deploy", label: "Deployment & Orchestration", color: "#fb7185", weight: "24%", bossCount: 12, emoji: "🚀", badgeName: "Deployment Ace" },
      { id: "ml-operate-secure", label: "Operate, Monitor & Secure", color: "#a3e635", weight: "24%", bossCount: 12, emoji: "📡", badgeName: "Production Guardian" },
    ],
  },
};

export const CERT_IDS = Object.keys(CERTIFICATIONS) as CertId[];
export const DEFAULT_CERT: CertId = "az500";

export const PROVIDERS = Array.from(new Set(Object.values(CERTIFICATIONS).map((c) => c.provider)));

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

/** Emoji for a cert-generated achievement key (domain master or cert master) */
export function getCertAchievementEmoji(key: string): string | undefined {
  if (key.startsWith("domain_master_")) return getDomainConfig(key.slice("domain_master_".length))?.emoji;
  return Object.values(CERTIFICATIONS).find((c) => c.masterKey === key)?.masterEmoji;
}
