import { Question, Domain, CertId } from "@/types/question";
import { DEFAULT_CERT, getCert } from "@/lib/certifications";
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

// Boss Fight: 50 questions weighted by each domain's exam weight
export function selectBossFightQuestions(certId: CertId = DEFAULT_CERT): Question[] {
  const selected: Question[] = [];
  for (const { id, bossCount } of getCert(certId).domains) {
    const pool = shuffle(getQuestionsByDomain(id));
    selected.push(...pool.slice(0, bossCount));
  }
  return shuffle(selected);
}

export function selectFlashcards(domain: Domain, count?: number): Question[] {
  const pool = getQuestionsByDomain(domain);
  return shuffle(pool).slice(0, count ?? 20);
}
