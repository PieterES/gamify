import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getDomainConfig } from "./certifications";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function getPercentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getDomainLabel(domain: string): string {
  return getDomainConfig(domain)?.label ?? domain;
}

export function getDomainColor(domain: string): string {
  return getDomainConfig(domain)?.color ?? "#64748b";
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
