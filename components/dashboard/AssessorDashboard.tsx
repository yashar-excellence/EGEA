'use client';

import Link from 'next/link';
import {
  ClipboardCheck, MapPin, Presentation,
  CheckCircle2, Clock, ChevronRight, User,
  AlertTriangle, Target,
} from 'lucide-react';
import { Header } from '@/components/landing/Header';

interface Candidate {
  id: string;
  code: string;
  name: string;
  organization: string;
  phase: number;
}

interface Submission {
  candidate_id: string;
  total_score: number | null;
  status: string;
}

interface Props {
  candidates: Candidate[];
  ojtSubmissions: Submission[];
  fepSubmissions: Submission[];
  fvSubmissions: Submission[];
  assessorName?: string;
}

export function AssessorDashboard({ candidates, ojtSubmissions, fepSubmissions, fvSubmissions, assessorName = 'المقيّم' }: Props) {
  const getStatus = (id: string, subs: Submission[]) =>
    subs.find(s => s.candidate_id === id)?.status ?? null;
  const getScore = (id: string, subs: Submission[]) =>
    subs.find(s => s.candidate_id === id)?.total_score ?? null;
  const isSubmitted = (st: string | null) => st === 'submitted' || st === 'approved';

  const phase2 = candidates.filter(c => c.phase === 2);

  const tasks = phase2.flatMap(c => {
    const items = [];
    const ojtSt = getStatus(c.id, ojtSubmissions);
    const fepSt = getStatus(c.id, fepSubmissions);
    const fvSt = getStatus(c.id, fvSubmissions);

    if (!isSubmitted(ojtSt))
      items.push({ candidate: c, tool: 'OJT', label: 'تقييم الأداء الفعلي', href: `/ojt?candidateId=${c.id}`, status: ojtSt, color: 'text-blue-400', border: 'border-blue-500/20', icon: ClipboardCheck, weight: '10%' });
    if (!isSubmitted(fepSt))
      items.push({ candidate: c, tool: 'FEP', label: 'العرض النهائي للتميز', href: `/fep?candidateId=${c.id}`, status: fepSt, color: 'text-gold-400', border: 'border-gold-500/20', icon: Presentation, weight: '15%' });
    if (!isSubmitted(fvSt))
      items.push({ candidate: c, tool: 'FV', label: 'الزيارة الميدانية', href: `/fv?candidateId=${c.id}`, status: fvSt, color: 'text-emerald-400', border: 'border-emerald-500/20', icon: MapPin, weight: '25%' });
    return items;
  });

  const doneCount = phase2.reduce((acc, c) => {
    return acc
      + (isSubmitted(getStatus(c.id, ojtSubmissions)) ? 1 : 0)
      + (isSubmitted(getStatus(c.id, fepSubmissions)) ? 1 : 0)
      + (isSubmitted(getStatus(c.id, fvSubmissions)) ? 1 : 0);
  }, 0);

  const totalTasks = phase2.length * 3;
  const pct = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gold-400/60 text-sm mb-1">
            <Target className="w-4 h-4" />
            <span>لوحة المقيّم · الدورة الثانية</span>
          </div>
          <h1 className="text-3xl font-bold text-white">مرحباً، {assessorName}</h1>
          <p className="text-white/40 mt-1">مهامك المعيّنة ومتابعة التقييمات</p>
        </div>

        {/* Progress Summary */}
        <div className="glass-crystal rounded-2xl p-6 mb-8 border border-gold-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white font-bold">تقدمك الإجمالي</div>
              <div className="text-white/40 text-sm">{doneCount} من {totalTasks} تقييم مكتمل</div>
            </div>
            <div className="text-3xl font-bold text-gold-400">{pct}%</div>
          </div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-amber-400 transition-all"
              style={{ width: `${pct}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-5">
            {[
              { tool: 'OJT', subs: ojtSubmissions, color: 'text-blue-400', border: 'border-blue-500/20' },
              { tool: 'FEP', subs: fepSubmissions, color: 'text-gold-400', border: 'border-gold-500/20' },
              { tool: 'FV', subs: fvSubmissions, color: 'text-emerald-400', border: 'border-emerald-500/20' },
            ].map(t => {
              const done = phase2.filter(c => isSubmitted(getStatus(c.id, t.subs))).length;
              return (
                <div key={t.tool} className={`rounded-xl p-3 border ${t.border} text-center`}>
                  <div className={`text-xl font-bold ${t.color}`}>{done}/{phase2.length}</div>
                  <div className="text-white/40 text-xs mt-1">{t.tool}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Tasks */}
        {tasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              المهام المتبقية ({tasks.length})
            </h2>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={i} className={`glass-crystal rounded-xl p-4 border ${task.border} flex items-center gap-4 hover:bg-white/[0.03] transition-all group`}>
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 ${task.color}`}>
                    <task.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-white/10 font-bold ${task.color}`}>{task.tool}</span>
                      <span className="text-xs text-white/30">{task.weight}</span>
                      {task.status === null && (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                          <AlertTriangle className="w-3 h-3" /> لم يبدأ
                        </span>
                      )}
                      {task.status === 'draft' && (
                        <span className="text-xs text-amber-400">مسودة</span>
                      )}
                    </div>
                    <div className="text-white font-medium text-sm mt-0.5">{task.candidate.name}</div>
                    <div className="text-white/30 text-xs">{task.candidate.organization} · {task.candidate.code}</div>
                  </div>
                  <Link href={task.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border ${task.border} ${task.color} text-sm font-medium hover:bg-white/5 transition-all flex-shrink-0`}>
                    {task.status === null ? 'ابدأ التقييم' : 'متابعة'}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {phase2.length > 0 && (
          <div>
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              تقييمات مكتملة
            </h2>
            <div className="glass-crystal rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['المرشح', 'OJT', 'FEP', 'FV'].map(h => (
                      <th key={h} className="text-right text-white/40 text-xs font-medium px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {phase2.filter(c =>
                    isSubmitted(getStatus(c.id, ojtSubmissions)) ||
                    isSubmitted(getStatus(c.id, fepSubmissions)) ||
                    isSubmitted(getStatus(c.id, fvSubmissions))
                  ).map(c => {
                    const ScoreCell = ({ subs }: { subs: Submission[] }) => {
                      const st = getStatus(c.id, subs);
                      const sc = getScore(c.id, subs);
                      if (!isSubmitted(st)) return <span className="text-white/20 text-xs">—</span>;
                      return (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {sc?.toFixed(1) ?? '—'}
                        </span>
                      );
                    };
                    return (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="text-white font-medium text-sm">{c.name}</div>
                          <div className="text-white/30 text-xs">{c.code}</div>
                        </td>
                        <td className="px-5 py-3.5"><ScoreCell subs={ojtSubmissions} /></td>
                        <td className="px-5 py-3.5"><ScoreCell subs={fepSubmissions} /></td>
                        <td className="px-5 py-3.5"><ScoreCell subs={fvSubmissions} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {phase2.length === 0 && (
          <div className="text-center py-20 glass-crystal rounded-2xl">
            <User className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <div className="text-white/40">لا يوجد مرشحون معيّنون لك بعد</div>
          </div>
        )}

      </div>
    </div>
  );
}
