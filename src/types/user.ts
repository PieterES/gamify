export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  xp: number;
  level: number;
  streakDays: number;
  lastStudiedAt?: Date | null;
}

export interface DomainProgressData {
  domain: string;
  totalAnswered: number;
  totalCorrect: number;
  percentage: number;
}

export interface UserProgressResponse {
  user: UserProfile;
  domainProgress: DomainProgressData[];
  recentSessions: RecentSession[];
  totalAnswered: number;
  totalCorrect: number;
}

export interface RecentSession {
  id: string;
  domain?: string | null;
  topic?: string | null;
  mode: string;
  score?: number | null;
  total?: number | null;
  xpEarned: number;
  startedAt: Date;
  completedAt?: Date | null;
}
