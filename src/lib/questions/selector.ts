import { Question, Domain } from "@/types/question";
import { getQuestionsByDomain } from "./loader";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function selectQuestionsForQuiz(opts: {
  domain: Domain;
  topic?: string;
  count?: number;
  excludeIds?: string[];
}): Question[] {
  let pool = getQuestionsByDomain(opts.domain);
  if (opts.topic) pool = pool.filter((q) => q.topic === opts.topic);
  if (opts.excludeIds?.length) pool = pool.filter((q) => !opts.excludeIds!.includes(q.id));
  return shuffle(pool).slice(0, opts.count ?? 10);
}

// Boss Fight: 50 questions weighted by domain exam weight
export function selectBossFightQuestions(): Question[] {
  const weights: Record<Domain, number> = {
    identity: 9,
    networking: 13,
    compute: 12,
    defender: 16,
  };

  const selected: Question[] = [];
  for (const [domain, count] of Object.entries(weights) as [Domain, number][]) {
    const pool = shuffle(getQuestionsByDomain(domain));
    selected.push(...pool.slice(0, count));
  }
  return shuffle(selected);
}

export function selectFlashcards(domain: Domain, count?: number): Question[] {
  const pool = getQuestionsByDomain(domain);
  return shuffle(pool).slice(0, count ?? 20);
}
