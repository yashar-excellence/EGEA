import type { FEPSubmission, FEPEvaluation } from './types';

export function createSampleFEPSubmission(candidateCode: string = 'C-2025-0014'): FEPSubmission {
  const evaluations: FEPEvaluation[] = [
    {
      evaluatorId: 'eval-1',
      evaluatorName: 'د. أحمد محمد',
      scores: {
        strategic: 4,
        results: 5,
        methodology: 4,
        presentation: 4,
        innovation: 5,
        impact: 4,
        scalability: 4,
      },
      notes: 'عرض متميز بشكل عام، ابتكار قوي في المنهجية',
      submittedAt: new Date().toISOString(),
    },
    {
      evaluatorId: 'eval-2',
      evaluatorName: 'م. سارة أحمد',
      scores: {
        strategic: 4,
        results: 4,
        methodology: 4,
        presentation: 5,
        innovation: 4,
        impact: 4,
        scalability: 3,
      },
      notes: 'أداء عرض ممتاز، قابلية توسع محدودة',
      submittedAt: new Date().toISOString(),
    },
    {
      evaluatorId: 'eval-3',
      evaluatorName: 'د. خالد إبراهيم',
      scores: {
        strategic: 5,
        results: 5,
        methodology: 5,
        presentation: 4,
        innovation: 5,
        impact: 5,
        scalability: 5,
      },
      notes: 'عمل استثنائي بكل المقاييس',
      submittedAt: new Date().toISOString(),
    },
  ];

  return {
    candidateCode,
    candidateName: 'مؤمن الأحمري - سعاينة',
    candidateRole: 'أخصائي موارد حكومي',
    organization: 'وزارة المالية',
    cycle: '2025',
    presentationTitle: 'نظام التحول الرقمي الشامل للإيرادات الحكومية',
    summary: 'مبادرة متكاملة لتحويل الإيرادات الحكومية إلى نظام رقمي موحد',
    evaluations,
  };
}

export function createBlankFEPEvaluation(evaluatorId: string, evaluatorName: string): FEPEvaluation {
  return {
    evaluatorId,
    evaluatorName,
    scores: {},
    notes: '',
  };
}

export function createBlankFEPSubmission(): FEPSubmission {
  return {
    candidateCode: '',
    candidateName: '',
    candidateRole: '',
    organization: '',
    cycle: '2025',
    presentationTitle: '',
    summary: '',
    evaluations: [],
  };
}
