'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Save, FileText, Users, Award, TrendingUp, AlertTriangle, CheckCircle2, User, Loader2 } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { FEP_AREAS } from '@/lib/fep/axes';
import { createSampleFEPSubmission, createBlankFEPEvaluation } from '@/lib/fep/sample';
import { aggregateFEPScores, calculateEvaluatorScore } from '@/lib/fep/scoring';
import type { FEPSubmission, FEPEvaluation } from '@/lib/fep/types';

interface Props { candidateId?: string; }

export function FEPPanelWorkspace({ candidateId }: Props) {
  const router = useRouter();
  const [submission, setSubmission] = useState<FEPSubmission>(createSampleFEPSubmission());
  const [activeEvaluatorIndex, setActiveEvaluatorIndex] = useState(0);
  const [showAggregated, setShowAggregated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (!candidateId) return;
    Promise.all([
      fetch(`/api/candidates/${candidateId}`).then(r => r.json()),
      fetch(`/api/submissions/fep?candidate_id=${candidateId}`).then(r => r.json()),
    ]).then(([candidateRes, fepRes]) => {
      const c = candidateRes.data;
      if (c) {
        setSubmission(prev => ({
          ...(fepRes.data?.[0]?.data ?? prev),
          candidateName: c.name,
          candidateCode: c.code,
          candidateRole: c.role,
          organization: c.organization,
        }));
      }
    });
  }, [candidateId]);

  const handleSave = useCallback(async (status: 'draft' | 'submitted' = 'draft') => {
    if (!candidateId) return;
    setSaving(true);
    try {
      const result = aggregateFEPScores(submission);
      await fetch('/api/submissions/fep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId, data: submission, total_score: result.percentage, status }),
      });
      setSaveMsg(status === 'submitted' ? '✅ تم رفع التقييم' : '✅ تم الحفظ');
      if (status === 'submitted' && candidateId) {
        setTimeout(() => router.push(`/dashboard/candidates/${candidateId}`), 1200);
      }
    } catch { setSaveMsg('❌ خطأ في الحفظ'); }
    finally { setSaving(false); if (status !== 'submitted') setTimeout(() => setSaveMsg(''), 3000); }
  }, [candidateId, submission, router]);

  const result = useMemo(() => aggregateFEPScores(submission), [submission]);
  const activeEvaluation = submission.evaluations[activeEvaluatorIndex];

  const updateEvaluationScore = (evalIndex: number, areaId: string, rating: number) => {
    const newEvaluations = [...submission.evaluations];
    newEvaluations[evalIndex] = {
      ...newEvaluations[evalIndex],
      scores: {
        ...newEvaluations[evalIndex].scores,
        [areaId]: rating,
      },
    };
    setSubmission({ ...submission, evaluations: newEvaluations });
  };

  const updateEvaluationNotes = (evalIndex: number, notes: string) => {
    const newEvaluations = [...submission.evaluations];
    newEvaluations[evalIndex] = {
      ...newEvaluations[evalIndex],
      notes,
    };
    setSubmission({ ...submission, evaluations: newEvaluations });
  };

  const addEvaluator = () => {
    const newEval = createBlankFEPEvaluation(
      `eval-${submission.evaluations.length + 1}`,
      `مقيّم ${submission.evaluations.length + 1}`
    );
    setSubmission({
      ...submission,
      evaluations: [...submission.evaluations, newEval],
    });
    setActiveEvaluatorIndex(submission.evaluations.length);
  };

  const getScoreFor = (evalIndex: number, areaId: string): number => {
    return submission.evaluations[evalIndex]?.scores?.[areaId] || 0;
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-12">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href={candidateId ? `/dashboard/candidates/${candidateId}` : '/admin'}
              className="text-white/50 hover:text-white flex items-center gap-2 mb-2 transition">
              <ArrowRight className="w-4 h-4" />
              {candidateId ? 'العودة لملف المرشح' : 'العودة للوحة التحكم'}
            </Link>
            <h1 className="text-3xl font-bold text-white">FEP — العرض النهائي للتميز</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAggregated(!showAggregated)}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-white hover:bg-white/10 transition"
            >
              <TrendingUp className="w-4 h-4" />
              {showAggregated ? 'إخفاء النتائج' : 'عرض النتائج'}
            </button>
            {saveMsg && <span className="text-sm font-medium text-emerald-400">{saveMsg}</span>}
            {candidateId ? (
              <>
                <button onClick={() => handleSave('draft')} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-white hover:bg-white/10 transition disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span className="hidden sm:inline">حفظ مسودة</span>
                </button>
                <button onClick={() => handleSave('submitted')} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 rounded-lg font-bold hover:bg-gold-400 transition disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  رفع التقييم
                </button>
              </>
            ) : (
              <span className="text-amber-400 text-sm glass px-3 py-2 rounded-lg">وضع المعاينة</span>
            )}
          </div>
        </div>

        {/* Candidate Info */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-white/50 text-sm mb-1">المرشح</div>
              <div className="text-white font-bold text-lg">{submission.candidateName}</div>
              <div className="text-white/50 text-sm">{submission.candidateRole}</div>
            </div>
            <div>
              <div className="text-white/50 text-sm mb-1">عنوان العرض</div>
              <div className="text-white font-medium">{submission.presentationTitle}</div>
              <div className="text-white/50 text-sm mt-2">{submission.organization}</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gold-400">{result.percentage.toFixed(1)}%</div>
              <div className="text-white/50 text-sm">{result.ratingLabelAr}</div>
              <div className="text-white/30 text-xs mt-1">{submission.evaluations.length} مقيّم</div>
            </div>
          </div>
        </div>

        {/* Aggregated Results */}
        {showAggregated && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-400" />
              النتائج المجمعة
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  {result.areaScores.map((area) => (
                    <div key={area.areaId} className="flex items-center justify-between">
                      <div className="text-white/70 text-sm">{area.nameAr}</div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-500 rounded-full"
                            style={{ width: `${(area.avgScore / 5) * 100}%` }}
                          />
                        </div>
                        <div className="text-gold-400 font-bold w-12 text-right">{area.avgScore.toFixed(1)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-bold">الإجمالي</div>
                    <div className="text-gold-400 font-bold text-xl">{result.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
              <div>
                {result.redFlags.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                    <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      تحذيرات
                    </h4>
                    <ul className="space-y-1">
                      {result.redFlags.map((flag, i) => (
                        <li key={i} className="text-red-300 text-sm">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="glass rounded-xl p-4">
                  <h4 className="text-white font-bold mb-3">تقييمات أعضاء اللجنة</h4>
                  <div className="space-y-2">
                    {submission.evaluations.map((evaluation, idx) => (
                      <div key={evaluation.evaluatorId} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                        <div className="text-white/70 text-sm">{evaluation.evaluatorName}</div>
                        <div className="text-gold-400 font-bold">{calculateEvaluatorScore(evaluation).toFixed(1)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Evaluator Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {submission.evaluations.map((evaluation, idx) => (
            <button
              key={evaluation.evaluatorId}
              onClick={() => {
                setActiveEvaluatorIndex(idx);
                setShowAggregated(false);
              }}
              className={`px-5 py-3 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-2 ${
                activeEvaluatorIndex === idx && !showAggregated
                  ? 'bg-gold-500 text-slate-950'
                  : 'glass text-white/70 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{evaluation.evaluatorName}</span>
              {calculateEvaluatorScore(evaluation) > 0 && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {calculateEvaluatorScore(evaluation).toFixed(1)}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={addEvaluator}
            className="px-5 py-3 rounded-xl font-bold transition whitespace-nowrap glass text-white/50 hover:text-white border border-dashed border-white/30"
          >
            + إضافة مقيّم
          </button>
        </div>

        {/* Scoring Workspace */}
        {!showAggregated && activeEvaluation && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">تقييم: {activeEvaluation.evaluatorName}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {FEP_AREAS.map((area) => {
                const score = getScoreFor(activeEvaluatorIndex, area.id);
                return (
                  <div key={area.id} className="glass rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-bold">{area.nameAr}</h4>
                        <p className="text-white/50 text-sm">{area.description}</p>
                        <span className="text-[10px] px-2 py-0.5 bg-gold-500/20 text-gold-400 rounded-full mt-2 inline-block">
                          وزن: {area.weight}%
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gold-400">{score.toFixed(1)}</div>
                        <div className="text-white/30 text-xs">/ 5.0</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-1 mb-3">
                      {area.rubric.map((r) => (
                        <button
                          key={r.score}
                          onClick={() => updateEvaluationScore(activeEvaluatorIndex, area.id, r.score)}
                          className={`p-2 rounded-lg text-xs transition ${
                            score === r.score
                              ? 'bg-gold-500 text-slate-950 font-bold'
                              : 'bg-white/5 text-white/50 hover:bg-white/10'
                          }`}
                        >
                          <div className="font-bold">{r.score}</div>
                          <div className="text-[10px] truncate">{r.labelAr}</div>
                        </button>
                      ))}
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={score}
                      onChange={(e) => updateEvaluationScore(activeEvaluatorIndex, area.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500 mb-3"
                    />

                    {score > 0 && (
                      <div className="bg-gold-500/10 rounded-lg p-3">
                        <div className="text-gold-400 text-sm font-bold mb-1">
                          {area.rubric.find((r) => r.score === Math.floor(score))?.labelAr}
                        </div>
                        <div className="text-white/70 text-sm">
                          {area.rubric.find((r) => r.score === Math.floor(score))?.descriptionAr}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <h4 className="text-white font-bold mb-3">ملاحظات المقيّم</h4>
              <textarea
                value={activeEvaluation.notes}
                onChange={(e) => updateEvaluationNotes(activeEvaluatorIndex, e.target.value)}
                placeholder="أضف ملاحظاتك الشاملة..."
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400"
                rows={4}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
