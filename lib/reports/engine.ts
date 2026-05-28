import type { ReportData, ReportCandidate } from './types';

export function gradeLabel(ei: number | null): string {
  if (ei === null) return '—';
  if (ei >= 85) return 'ممتاز';
  if (ei >= 70) return 'جيد جداً';
  if (ei >= 55) return 'جيد';
  return 'يحتاج تطوير';
}

export function gradeColor(ei: number | null): string {
  if (ei === null) return '#64748b';
  if (ei >= 85) return '#34d399';
  if (ei >= 70) return '#f59e0b';
  if (ei >= 55) return '#60a5fa';
  return '#f87171';
}

export function buildReportData(
  candidates: any[],
  ojtSubs: any[],
  fepSubs: any[],
  fvSubs: any[],
  generatedBy: string,
): ReportData {
  const getScore = (id: string, subs: any[]) =>
    subs.find(s => s.candidate_id === id)?.total_score ?? null;
  const getStatus = (id: string, subs: any[]) =>
    subs.find(s => s.candidate_id === id)?.status ?? null;

  const rows: ReportCandidate[] = candidates.map(c => {
    const p1 = c.phase1_scores?.[0]?.total ?? null;
    const s360 = c.assessment_360?.[0]?.score ?? null;
    const ojt = getScore(c.id, ojtSubs);
    const fep = getScore(c.id, fepSubs);
    const fv  = getScore(c.id, fvSubs);
    const ei  = (p1 !== null || s360 !== null)
      ? (p1 ?? 0) + ((s360 ?? 0) / 100) * 10 + ((ojt ?? 0) / 100) * 10 + ((fep ?? 0) / 100) * 15 + ((fv ?? 0) / 100) * 25
      : null;
    return {
      id: c.id, code: c.code, name: c.name, role: c.role,
      organization: c.organization, category: c.category,
      level: c.level, cycle: c.cycle, phase: c.phase,
      p1Total: p1, s360, ojt, fep, fv, ei,
      ojtStatus: getStatus(c.id, ojtSubs),
      fepStatus: getStatus(c.id, fepSubs),
      fvStatus:  getStatus(c.id, fvSubs),
    };
  }).sort((a, b) => (b.ei ?? -1) - (a.ei ?? -1));

  const eiScores = rows.map(r => r.ei).filter((e): e is number => e !== null);
  const avgEI = eiScores.length ? eiScores.reduce((a, b) => a + b, 0) / eiScores.length : null;

  return {
    meta: {
      type: 'full_results',
      title: 'تقرير نتائج التقييم',
      subtitle: 'جائزة مصر للتميز الحكومي — فئة التميز الفردي',
      generatedBy,
      generatedAt: new Date().toISOString(),
      cycle: candidates[0]?.cycle ?? 'الدورة الثانية',
      totalCandidates: candidates.length,
    },
    candidates: rows,
    stats: {
      avgEI,
      excellent: eiScores.filter(e => e >= 85).length,
      veryGood:  eiScores.filter(e => e >= 70 && e < 85).length,
      good:      eiScores.filter(e => e >= 55 && e < 70).length,
      needsDev:  eiScores.filter(e => e < 55).length,
      completed: rows.filter(r =>
        ['submitted','approved'].includes(r.ojtStatus ?? '') &&
        ['submitted','approved'].includes(r.fepStatus ?? '') &&
        ['submitted','approved'].includes(r.fvStatus ?? '')
      ).length,
      phase2Count: candidates.filter(c => c.phase === 2).length,
    },
  };
}
