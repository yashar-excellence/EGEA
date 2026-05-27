import { OJT_AXES, getAxisById } from './axes';
import type { OJTSubmission, Achievement, OJTResult, AxisRollup } from './types';

export function achievementScore(a: Achievement): number {
  const sum = Object.values(a.scores).reduce((acc, r) => acc + (r || 0), 0);
  const count = OJT_AXES.length;
  return sum / count;
}

export function buildAxisRollup(
  axisId: string,
  submissions: OJTSubmission[]
): AxisRollup {
  const axis = getAxisById(axisId)!;
  let sum = 0;
  let count = 0;

  submissions.forEach((sub) => {
    sub.achievements.forEach((ach) => {
      const score = ach.scores[axisId] || 0;
      sum += score;
      count++;
    });
  });

  const avgRating = count > 0 ? sum / count : 0;
  const maxPossible = 5;
  const normalizedScore = (avgRating / maxPossible) * axis.weight;

  return {
    axisId,
    nameAr: axis.nameAr,
    nameEn: axis.nameEn,
    weight: axis.weight,
    avgRating,
    score: avgRating,
    maxPossible,
    normalizedScore,
    notes: submissions[0]?.axesNotes?.[axisId],
  };
}

export function computeOJT(submission: OJTSubmission): OJTResult {
  const axesRollups = OJT_AXES.map((ax) => buildAxisRollup(ax.id, [submission]));
  const totalScore = axesRollups.reduce((sum, r) => sum + r.normalizedScore, 0);
  const maxPossible = OJT_AXES.reduce((sum, a) => sum + a.weight, 0);
  const percentage = (totalScore / maxPossible) * 100;

  const ratingInfo = scoreToRating(percentage);
  const redFlags = detectRedFlags(submission, axesRollups);

  return {
    totalScore,
    maxPossible,
    percentage,
    rating: ratingInfo.rating,
    ratingLabelAr: ratingInfo.labelAr,
    axesRollups,
    redFlags,
  };
}

export function scoreToRating(percentage: number): {
  rating: OJTResult['rating'];
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

export function ratingTone(rating: OJTResult['rating']): string {
  const tones: Record<string, string> = {
    exceptional: 'positive',
    strong: 'positive',
    meets: 'neutral',
    needs: 'caution',
    weak: 'negative',
  };
  return tones[rating] || 'neutral';
}

function detectRedFlags(
  submission: OJTSubmission,
  rollups: AxisRollup[]
): string[] {
  const flags: string[] = [];

  // Check integrity axis
  const integrity = rollups.find((r) => r.axisId === 'integrity');
  if (integrity && integrity.avgRating < 2) {
    flags.push('درجة النزاهة منخفضة جداً - يتطلب مراجعة');
  }

  // Check if all achievements have low scores
  const allLow = rollups.every((r) => r.avgRating < 2);
  if (allLow) {
    flags.push('جميع المحاور بدرجات منخفضة');
  }

  // Check evidence quality
  const evidence = rollups.find((r) => r.axisId === 'evidence');
  if (evidence && evidence.avgRating < 1.5) {
    flags.push('جودة الأدلة ضعيفة جداً');
  }

  return flags;
}
