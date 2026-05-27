import { FV_AREAS } from './axes';
import type { FVSubmission, FVResult, AreaScore } from './types';

export function computeFV(submission: FVSubmission): FVResult {
  const areaScores: AreaScore[] = FV_AREAS.map((area) => {
    const score = submission.scores[area.id] ?? 0;
    const normalizedScore = (score / 5) * area.weight;
    return { areaId: area.id, nameAr: area.nameAr, weight: area.weight, score, maxPossible: area.weight, normalizedScore };
  });

  const totalScore = areaScores.reduce((sum, a) => sum + a.normalizedScore, 0);
  const maxPossible = FV_AREAS.reduce((sum, a) => sum + a.weight, 0);
  const percentage = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;

  const checked = submission.checklist.filter(c => c.status === 'checked').length;
  const checklistCompletion = submission.checklist.length > 0
    ? (checked / submission.checklist.length) * 100 : 0;

  const redFlags: string[] = [];
  areaScores.forEach(a => { if (a.score < 2) redFlags.push(`${a.nameAr}: درجة منخفضة جداً`); });

  let rating: FVResult['rating'] = 'weak';
  let ratingLabelAr = 'ضعيف';
  if (percentage >= 90) { rating = 'exceptional'; ratingLabelAr = 'استثنائي'; }
  else if (percentage >= 80) { rating = 'strong'; ratingLabelAr = 'قوي جداً'; }
  else if (percentage >= 60) { rating = 'meets'; ratingLabelAr = 'يلبي التوقعات'; }
  else if (percentage >= 40) { rating = 'needs'; ratingLabelAr = 'يحتاج تطوير'; }

  return {
    totalScore, maxPossible, percentage, rating, ratingLabelAr,
    areaScores, checklistCompletion, interviewCount: submission.interviews.length,
    redFlags, recommendations: [],
  };
}
