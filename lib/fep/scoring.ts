import { FEP_AREAS, getFEPAreaById } from './axes';
import type { FEPSubmission, FEPEvaluation, FEPResult, AreaScore } from './types';

export function aggregateFEPScores(submission: FEPSubmission): FEPResult {
  const evaluations = submission.evaluations;
  
  if (evaluations.length === 0) {
    return {
      totalScore: 0,
      maxPossible: 50,
      percentage: 0,
      rating: 'weak',
      ratingLabelAr: 'ضعيف',
      areaScores: [],
      redFlags: [],
      confidence: 'low',
    };
  }

  // Calculate average for each area
  const areaScores: AreaScore[] = FEP_AREAS.map((area) => {
    let sum = 0;
    let count = 0;
    
    evaluations.forEach((evaluation) => {
      const score = evaluation.scores[area.id] || 0;
      sum += score;
      count++;
    });
    
    const avgScore = count > 0 ? sum / count : 0;
    const normalizedScore = (avgScore / 5) * area.weight;
    
    return {
      areaId: area.id,
      nameAr: area.nameAr,
      weight: area.weight,
      avgScore,
      normalizedScore,
    };
  });

  const totalScore = areaScores.reduce((sum, a) => sum + a.normalizedScore, 0);
  const maxPossible = FEP_AREAS.reduce((sum, a) => sum + a.weight, 0);
  const percentage = (totalScore / maxPossible) * 100;

  const ratingInfo = scoreToFEPRating(percentage);
  const redFlags = detectFEPRedFlags(areaScores, evaluations);
  
  // Calculate confidence based on number of evaluators
  let confidence: FEPResult['confidence'] = 'low';
  if (evaluations.length >= 5) confidence = 'high';
  else if (evaluations.length >= 3) confidence = 'medium';

  return {
    totalScore,
    maxPossible,
    percentage,
    rating: ratingInfo.rating,
    ratingLabelAr: ratingInfo.labelAr,
    areaScores,
    redFlags,
    confidence,
  };
}

export function scoreToFEPRating(percentage: number): {
  rating: FEPResult['rating'];
  labelAr: string;
  color: string;
} {
  if (percentage >= 90) {
    return { rating: 'exceptional', labelAr: 'استثنائي', color: '#22c55e' };
  }
  if (percentage >= 80) {
    return { rating: 'strong', labelAr: 'قوي جداً', color: '#84cc16' };
  }
  if (percentage >= 60) {
    return { rating: 'meets', labelAr: 'يلبي التوقعات', color: '#eab308' };
  }
  if (percentage >= 40) {
    return { rating: 'needs', labelAr: 'يحتاج تطوير', color: '#f97316' };
  }
  return { rating: 'weak', labelAr: 'ضعيف', color: '#ef4444' };
}

function detectFEPRedFlags(areaScores: AreaScore[], evaluations: FEPEvaluation[]): string[] {
  const flags: string[] = [];

  // Check if integrity/presentation scores are too low
  const presentation = areaScores.find((a) => a.areaId === 'presentation');
  if (presentation && presentation.avgScore < 2) {
    flags.push('جودة العرض ضعيفة جداً');
  }

  // High variance between evaluators
  if (evaluations.length >= 2) {
    const totalScores = evaluations.map((e) => {
      return Object.values(e.scores).reduce((sum, s) => sum + (s || 0), 0);
    });
    const avg = totalScores.reduce((a, b) => a + b, 0) / totalScores.length;
    const variance = totalScores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / totalScores.length;
    if (variance > 4) {
      flags.push('تباين كبير بين تقييمات أعضاء اللجنة');
    }
  }

  return flags;
}

export function calculateEvaluatorScore(evaluation: FEPEvaluation): number {
  return Object.values(evaluation.scores).reduce((sum, s) => sum + (s || 0), 0);
}
