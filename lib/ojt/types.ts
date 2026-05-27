export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

export interface AxisScore {
  axisId: string;
  rating: Rating;
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  context: string;
  metrics: string[];
  scores: Record<string, number>;
  assessorNotes: string;
}

export interface OJTSubmission {
  candidateCode: string;
  candidateName: string;
  candidateRole: string;
  organization: string;
  assessorName: string;
  cycle: string;
  achievements: Achievement[];
  axesNotes: Record<string, string>;
  submittedAt?: string;
}

export interface AxisRollup {
  axisId: string;
  nameAr: string;
  nameEn: string;
  weight: number;
  avgRating: number;
  score: number;
  maxPossible: number;
  normalizedScore: number;
  notes?: string;
}

export interface OJTResult {
  totalScore: number;
  maxPossible: number;
  percentage: number;
  rating: 'exceptional' | 'strong' | 'meets' | 'needs' | 'weak';
  ratingLabelAr: string;
  axesRollups: AxisRollup[];
  redFlags: string[];
}
