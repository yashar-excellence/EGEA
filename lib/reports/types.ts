export type ReportType = 'full_results' | 'candidate_profile' | 'executive_summary';

export interface ReportCandidate {
  id: string;
  code: string;
  name: string;
  role: string;
  organization: string;
  category: string;
  level: string;
  cycle: string;
  phase: number;
  p1Total: number | null;
  s360: number | null;
  ojt: number | null;
  fep: number | null;
  fv: number | null;
  ei: number | null;
  ojtStatus: string | null;
  fepStatus: string | null;
  fvStatus: string | null;
}

export interface ReportMeta {
  type: ReportType;
  title: string;
  subtitle: string;
  generatedBy: string;
  generatedAt: string; // ISO string
  cycle: string;
  totalCandidates: number;
}

export interface ReportData {
  meta: ReportMeta;
  candidates: ReportCandidate[];
  stats: {
    avgEI: number | null;
    excellent: number;
    veryGood: number;
    good: number;
    needsDev: number;
    completed: number;
    phase2Count: number;
  };
}
