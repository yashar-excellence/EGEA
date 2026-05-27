'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Save, FileText, MapPin, Users, ClipboardCheck, CheckCircle2, AlertTriangle, Calendar, User, Loader2 } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { FV_AREAS } from '@/lib/fv/axes';
import { computeFV } from '@/lib/fv/scoring';
import type { FVSubmission, ChecklistItem, InterviewRecord } from '@/lib/fv/types';

interface Props { candidateId?: string; }

const defaultChecklist: ChecklistItem[] = [
  { id: 'c1', textAr: 'الإجراءات موثقة بشكل واضح', category: 'تنفيذ', status: 'not_checked' },
  { id: 'c2', textAr: 'المؤشرات يتم رصدها بانتظام', category: 'رصد', status: 'not_checked' },
  { id: 'c3', textAr: 'الميزانية مستغلة بشكل فعال', category: 'موارد', status: 'not_checked' },
  { id: 'c4', textAr: 'التقارير الدورية موجودة', category: 'توثيق', status: 'not_checked' },
  { id: 'c5', textAr: 'أصحاب المصلحة راضون', category: 'مستفيدين', status: 'not_checked' },
  { id: 'c6', textAr: 'النتائج تُقاس بشكل كمي', category: 'نتائج', status: 'not_checked' },
  { id: 'c7', textAr: 'الموظفين مدربون جيداً', category: 'موارد بشرية', status: 'not_checked' },
  { id: 'c8', textAr: 'الأثر واضح ومُقاس', category: 'أثر', status: 'not_checked' },
];

export function FVAssessorWorkspace({ candidateId }: Props) {
  const [submission, setSubmission] = useState<FVSubmission>({
    candidateCode: 'C-2025-0014',
    candidateName: 'مؤمن الأحمري - سعاينة',
    candidateRole: 'أخصائي موارد حكومي',
    organization: 'وزارة المالية',
    assessorName: 'د. أحمد محمد',
    visitDate: new Date().toISOString().split('T')[0],
    cycle: '2025',
    scores: {},
    checklist: defaultChecklist,
    interviews: [],
    overallNotes: '',
    redFlags: [],
  });

  const [activeTab, setActiveTab] = useState<'scoring' | 'checklist' | 'interviews'>('scoring');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (!candidateId) return;
    Promise.all([
      fetch(`/api/candidates/${candidateId}`).then(r => r.json()),
      fetch(`/api/submissions/fv?candidate_id=${candidateId}`).then(r => r.json()),
    ]).then(([candidateRes, fvRes]) => {
      const c = candidateRes.data;
      if (c) {
        setSubmission(prev => ({
          ...(fvRes.data?.[0]?.data ?? prev),
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
      const result = computeFV(submission);
      await fetch('/api/submissions/fv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId, data: submission, total_score: result.percentage, status }),
      });
      setSaveMsg(status === 'submitted' ? '✅ تم رفع التقييم' : '✅ تم الحفظ');
    } catch { setSaveMsg('❌ خطأ في الحفظ'); }
    finally { setSaving(false); setTimeout(() => setSaveMsg(''), 3000); }
  }, [candidateId, submission]);
  const [newInterview, setNewInterview] = useState({ stakeholderName: '', role: '', keyPoints: '', satisfaction: 3 as number });

  const updateScore = (areaId: string, rating: number) => {
    setSubmission({ ...submission, scores: { ...submission.scores, [areaId]: rating } });
  };

  const updateChecklistItem = (id: string, status: ChecklistItem['status']) => {
    const newChecklist = submission.checklist.map((item) =>
      item.id === id ? { ...item, status } : item
    );
    setSubmission({ ...submission, checklist: newChecklist });
  };

  const addInterview = () => {
    if (!newInterview.stakeholderName) return;
    const interview: InterviewRecord = {
      id: `int-${Date.now()}`,
      stakeholderName: newInterview.stakeholderName,
      role: newInterview.role,
      keyPoints: newInterview.keyPoints.split('\n').filter(Boolean),
      satisfaction: newInterview.satisfaction as any,
      notes: '',
    };
    setSubmission({ ...submission, interviews: [...submission.interviews, interview] });
    setNewInterview({ stakeholderName: '', role: '', keyPoints: '', satisfaction: 3 });
  };

  const totalScore = useMemo(() => {
    return Object.values(submission.scores).reduce((sum, s) => sum + (s || 0), 0);
  }, [submission.scores]);

  const checkedCount = submission.checklist.filter((i) => i.status === 'checked').length;
  const checklistProgress = (checkedCount / submission.checklist.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 pb-12">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/dashboard" className="text-white/50 hover:text-white flex items-center gap-2 mb-2 transition">
              <ArrowRight className="w-4 h-4" />
              العودة للوحة التحكم
            </Link>
            <h1 className="text-3xl font-bold text-white">FV — الزيارة الميدانية</h1>
          </div>
          <div className="flex items-center gap-3">
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
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <div className="text-white/50 text-sm">المرشح</div>
                <div className="text-white font-bold">{submission.candidateName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <div className="text-white/50 text-sm">المؤسسة</div>
                <div className="text-white font-bold">{submission.organization}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <div className="text-white/50 text-sm">تاريخ الزيارة</div>
                <div className="text-white font-bold">{submission.visitDate}</div>
              </div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gold-400">{totalScore.toFixed(1)}</div>
              <div className="text-white/50 text-sm">من 35 نقطة</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'scoring', label: 'التقييم', icon: ClipboardCheck },
            { id: 'checklist', label: 'قائمة الفحص', icon: CheckCircle2 },
            { id: 'interviews', label: 'المقابلات', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gold-500 text-slate-950'
                  : 'glass text-white/70 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scoring Tab */}
        {activeTab === 'scoring' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">محاور تقييم الزيارة الميدانية</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {FV_AREAS.map((area) => {
                const score = submission.scores[area.id] || 0;
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
                          onClick={() => updateScore(area.id, r.score)}
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
                      onChange={(e) => updateScore(area.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">قائمة فحص الزيارة</h3>
              <div className="glass px-4 py-2 rounded-lg">
                <span className="text-white/50">تم الفحص: </span>
                <span className="text-gold-400 font-bold">{checkedCount}/{submission.checklist.length}</span>
                <span className="text-white/30 text-sm mr-2">({checklistProgress.toFixed(0)}%)</span>
              </div>
            </div>
            <div className="space-y-3">
              {submission.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 glass rounded-xl">
                  <div className="flex gap-2">
                    {[
                      { status: 'checked', color: 'bg-emerald-500', icon: CheckCircle2 },
                      { status: 'partial', color: 'bg-yellow-500', icon: AlertTriangle },
                      { status: 'not_checked', color: 'bg-red-500', icon: AlertTriangle },
                      { status: 'na', color: 'bg-gray-500', icon: AlertTriangle },
                    ].map((option) => (
                      <button
                        key={option.status}
                        onClick={() => updateChecklistItem(item.id, option.status as any)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                          item.status === option.status
                            ? option.color
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <option.icon className={`w-4 h-4 ${item.status === option.status ? 'text-white' : 'text-white/30'}`} />
                      </button>
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{item.textAr}</div>
                    <div className="text-white/50 text-sm">{item.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interviews Tab */}
        {activeTab === 'interviews' && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">إضافة مقابلة جديدة</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="اسم صاحب المصلحة"
                  value={newInterview.stakeholderName}
                  onChange={(e) => setNewInterview({ ...newInterview, stakeholderName: e.target.value })}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="الدور/المنصب"
                  value={newInterview.role}
                  onChange={(e) => setNewInterview({ ...newInterview, role: e.target.value })}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold-400 outline-none"
                />
                <div className="md:col-span-2">
                  <textarea
                    placeholder="النقاط الرئيسية (سطر لكل نقطة)"
                    value={newInterview.keyPoints}
                    onChange={(e) => setNewInterview({ ...newInterview, keyPoints: e.target.value })}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold-400 outline-none"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/50">الراضاة:</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={newInterview.satisfaction}
                    onChange={(e) => setNewInterview({ ...newInterview, satisfaction: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                  <span className="text-gold-400 font-bold w-8">{newInterview.satisfaction}</span>
                </div>
                <button
                  onClick={addInterview}
                  className="px-6 py-3 bg-gold-500 text-slate-950 rounded-lg font-bold hover:bg-gold-400 transition"
                >
                  إضافة مقابلة
                </button>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                المقابلات المُجراة ({submission.interviews.length})
              </h3>
              <div className="space-y-3">
                {submission.interviews.map((interview) => (
                  <div key={interview.id} className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-gold-400" />
                        </div>
                        <div>
                          <div className="text-white font-bold">{interview.stakeholderName}</div>
                          <div className="text-white/50 text-sm">{interview.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/50">الراضاة:</span>
                        <span className="text-gold-400 font-bold">{interview.satisfaction}/5</span>
                      </div>
                    </div>
                    {interview.keyPoints.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {interview.keyPoints.map((point, i) => (
                          <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                {submission.interviews.length === 0 && (
                  <div className="text-center py-8 text-white/50">
                    لا توجد مقابلات مسجلة
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
