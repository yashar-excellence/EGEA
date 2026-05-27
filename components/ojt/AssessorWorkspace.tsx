'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Save, FileText, Download, AlertTriangle, CheckCircle2, User, Building2, Award } from 'lucide-react';
import { OJT_AXES, getAxisById } from '@/lib/ojt/axes';
import { createSampleOJTSubmission, createBlankAchievement } from '@/lib/ojt/sample';
import { computeOJT, scoreToRating, achievementScore } from '@/lib/ojt/scoring';
import type { OJTSubmission, Achievement } from '@/lib/ojt/types';

export function AssessorWorkspace() {
  const [submission, setSubmission] = useState<OJTSubmission>(createSampleOJTSubmission());
  const [activeAchievementIndex, setActiveAchievementIndex] = useState(0);
  const [activeAxisId, setActiveAxisId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const result = useMemo(() => computeOJT(submission), [submission]);
  const activeAchievement = submission.achievements[activeAchievementIndex];

  const updateAchievementScore = (achievementIndex: number, axisId: string, rating: number) => {
    const newAchievements = [...submission.achievements];
    newAchievements[achievementIndex] = {
      ...newAchievements[achievementIndex],
      scores: {
        ...newAchievements[achievementIndex].scores,
        [axisId]: rating,
      },
    };
    setSubmission({ ...submission, achievements: newAchievements });
  };

  const updateAssessorNotes = (achievementIndex: number, note: string) => {
    const newAchievements = [...submission.achievements];
    newAchievements[achievementIndex] = {
      ...newAchievements[achievementIndex],
      assessorNotes: note,
    };
    setSubmission({ ...submission, achievements: newAchievements });
  };

  const updateAxisNotes = (axisId: string, note: string) => {
    setSubmission({
      ...submission,
      axesNotes: { ...submission.axesNotes, [axisId]: note },
    });
  };

  const getScoreFor = (achievementIndex: number, axisId: string): number => {
    return submission.achievements[achievementIndex]?.scores?.[axisId] || 0;
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/" className="text-white/50 hover:text-white flex items-center gap-2 mb-2 transition">
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </Link>
            <h1 className="text-3xl font-bold text-white">أداة OJT — تقييم الأداء الفعلي الافتراضي</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-white hover:bg-white/10 transition">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">تصدير JSON</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 rounded-lg font-bold hover:bg-gold-400 transition">
              <Save className="w-4 h-4" />
              حفظ التقييم
            </button>
          </div>
        </div>

        {/* Candidate Info Card */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <div className="text-white/50 text-sm">المرشح</div>
                <div className="text-white font-bold">{submission.candidateName}</div>
                <div className="text-white/50 text-xs">{submission.candidateCode}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <div className="text-white/50 text-sm">المؤسسة</div>
                <div className="text-white font-bold">{submission.organization}</div>
                <div className="text-white/50 text-xs">{submission.candidateRole}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <div className="text-white/50 text-sm">المقيّم</div>
                <div className="text-white font-bold">{submission.assessorName}</div>
                <div className="text-white/50 text-xs">Cycle {submission.cycle}</div>
              </div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gold-400">{result.percentage.toFixed(1)}%</div>
              <div className="text-white/50 text-sm">{result.ratingLabelAr}</div>
            </div>
          </div>
        </div>

        {/* Achievement Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {submission.achievements.map((ach, idx) => (
            <button
              key={ach.id}
              onClick={() => setActiveAchievementIndex(idx)}
              className={`px-5 py-3 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-2 ${
                activeAchievementIndex === idx
                  ? 'bg-gold-500 text-slate-950'
                  : 'glass text-white/70 hover:text-white'
              }`}
            >
              <span>إنجاز {idx + 1}</span>
              {achievementScore(ach) > 0 && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {achievementScore(ach).toFixed(1)}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Achievement Details */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-400" />
                تفاصيل الإنجاز
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-sm block mb-1">عنوان الإنجاز</label>
                  <div className="text-white font-medium">{activeAchievement.title}</div>
                </div>
                <div>
                  <label className="text-white/50 text-sm block mb-1">الوصف</label>
                  <p className="text-white/70 text-sm leading-relaxed">{activeAchievement.description}</p>
                </div>
                <div>
                  <label className="text-white/50 text-sm block mb-1">السياق</label>
                  <div className="text-white/70 text-sm">{activeAchievement.context}</div>
                </div>
                <div>
                  <label className="text-white/50 text-sm block mb-1">المؤشرات</label>
                  <ul className="space-y-1">
                    {activeAchievement.metrics.map((m, i) => (
                      <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Scoring Summary */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-4">ملخص التقييم</h3>
              <div className="space-y-3">
                {result.axesRollups.map((rollup) => (
                  <div key={rollup.axisId} className="flex items-center justify-between">
                    <div className="text-white/70 text-sm">{rollup.nameAr}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-gold-400 font-bold">{rollup.avgRating.toFixed(1)}</div>
                      <div className="text-white/30 text-xs">/5</div>
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

            {/* Red Flags */}
            {result.redFlags.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  تحذيرات
                </h3>
                <ul className="space-y-2">
                  {result.redFlags.map((flag, i) => (
                    <li key={i} className="text-red-300 text-sm flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Scoring Workspace */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">محاور التقييم</h3>
              <div className="space-y-4">
                {OJT_AXES.map((axis) => {
                  const score = getScoreFor(activeAchievementIndex, axis.id);
                  return (
                    <div key={axis.id} className="glass rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-white font-bold">{axis.nameAr}</h4>
                          <p className="text-white/50 text-sm">{axis.description}</p>
                          <div className="flex gap-2 mt-2">
                            {axis.competencies.map((c) => (
                              <span key={c} className="text-[10px] px-2 py-0.5 bg-gold-500/20 text-gold-400 rounded-full">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gold-400">{score.toFixed(1)}</div>
                          <div className="text-white/30 text-xs">/ 5.0</div>
                        </div>
                      </div>

                      {/* Rubric */}
                      <div className="grid grid-cols-6 gap-1 mb-3">
                        {axis.rubric.map((r) => (
                          <button
                            key={r.score}
                            onClick={() => updateAchievementScore(activeAchievementIndex, axis.id, r.score)}
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

                      {/* Slider */}
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={score}
                        onChange={(e) => updateAchievementScore(activeAchievementIndex, axis.id, parseFloat(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500 mb-3"
                      />

                      {/* Selected Rubric Description */}
                      {score > 0 && (
                        <div className="bg-gold-500/10 rounded-lg p-3">
                          <div className="text-gold-400 text-sm font-bold mb-1">
                            {axis.rubric.find((r) => r.score === Math.floor(score))?.labelAr}
                          </div>
                          <div className="text-white/70 text-sm">
                            {axis.rubric.find((r) => r.score === Math.floor(score))?.descriptionAr}
                          </div>
                        </div>
                      )}

                      {/* Axis Notes */}
                      <textarea
                        placeholder="ملاحظات على هذا المحور..."
                        value={submission.axesNotes?.[axis.id] || ''}
                        onChange={(e) => updateAxisNotes(axis.id, e.target.value)}
                        className="w-full mt-3 p-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold-400"
                        rows={2}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Achievement Notes */}
              <div className="mt-6">
                <h4 className="text-white font-bold mb-3">ملاحظات المقيّم على الإنجاز</h4>
                <textarea
                  placeholder="أضف ملاحظاتك الشاملة على هذا الإنجاز..."
                  value={activeAchievement.assessorNotes}
                  onChange={(e) => updateAssessorNotes(activeAchievementIndex, e.target.value)}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
