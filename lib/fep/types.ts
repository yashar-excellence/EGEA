export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

export interface FEPEvaluation {
  evaluatorId: string;
  evaluatorName: string;
  scores: Record<string, number>;
  notes: string;
  submittedAt?: string;
}

export interface FEPSubmission {
  candidateCode: string;
  candidateName: string;
  candidateRole: string;
  organization: string;
  cycle: string;
  presentationTitle: string;
  summary: string;
  evaluations: FEPEvaluation[];
  aggregated?: FEPResult;
}

export interface FEPResult {
  totalScore: number;
  maxPossible: number;
  percentage: number;
  rating: 'exceptional' | 'strong' | 'meets' | 'needs' | 'weak';
  ratingLabelAr: string;
  areaScores: AreaScore[];
  redFlags: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface AreaScore {
  areaId: string;
  nameAr: string;
  weight: number;
  avgScore: number;
  normalizedScore: number;
}
