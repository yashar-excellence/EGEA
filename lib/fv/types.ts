export type Rating = 0 | 1 | 2 | 3 | 4 | 5;
export type CheckStatus = 'checked' | 'partial' | 'not_checked' | 'na';

export interface ChecklistItem {
  id: string;
  textAr: string;
  category: string;
  status: CheckStatus;
  notes?: string;
}

export interface InterviewRecord {
  id: string;
  stakeholderName: string;
  role: string;
  keyPoints: string[];
  satisfaction: Rating;
  notes?: string;
}

export interface FVSubmission {
  candidateCode: string;
  candidateName: string;
  candidateRole: string;
  organization: string;
  assessorName: string;
  visitDate: string;
  cycle: string;
  scores: Record<string, number>;
  checklist: ChecklistItem[];
  interviews: InterviewRecord[];
  overallNotes: string;
  redFlags: string[];
  submittedAt?: string;
}

export interface FVResult {
  totalScore: number;
  maxPossible: number;
  percentage: number;
  rating: 'exceptional' | 'strong' | 'meets' | 'needs' | 'weak';
  ratingLabelAr: string;
  areaScores: AreaScore[];
  checklistCompletion: number;
  interviewCount: number;
  redFlags: string[];
  recommendations: string[];
}

export interface AreaScore {
  areaId: string;
  nameAr: string;
  weight: number;
  score: number;
  maxPossible: number;
  normalizedScore: number;
}
