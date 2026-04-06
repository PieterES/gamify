import { Question, Domain } from "@/types/question";
import { identityQuestions } from "@/data/questions/domain1-identity";
import { networkingQuestions } from "@/data/questions/domain2-networking";
import { computeQuestions } from "@/data/questions/domain3-compute";
import { defenderQuestions } from "@/data/questions/domain4-defender";

export const ALL_QUESTIONS: Question[] = [
  ...identityQuestions,
  ...networkingQuestions,
  ...computeQuestions,
  ...defenderQuestions,
];

export function getQuestionsByDomain(domain: Domain): Question[] {
  return ALL_QUESTIONS.filter((q) => q.domain === domain);
}

export function getQuestionsByTopic(domain: Domain, topic: string): Question[] {
  return ALL_QUESTIONS.filter((q) => q.domain === domain && q.topic === topic);
}

export function getTopicsForDomain(domain: Domain): string[] {
  const questions = getQuestionsByDomain(domain);
  return Array.from(new Set(questions.map((q) => q.topic)));
}

export function getAllTopics(): string[] {
  return Array.from(new Set(ALL_QUESTIONS.map((q) => q.topic)));
}

export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}
