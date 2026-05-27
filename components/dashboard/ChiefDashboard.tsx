'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Users, ClipboardCheck, MapPin, Presentation,
  TrendingUp, ChevronRight, Eye, Clock,
  CheckCircle2, AlertTriangle, BarChart2, Crown,
} from 'lucide-react';
import { Header } from '@/components/landing/Header';

interface Candidate {
  id: string;
  code: string;
  name: string;
  organization: string;
  phase: number;
  phase1_scores?: { total: number | null }[];
  assessment_360?: { score: number | null }[];
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
}

export function ChiefDashboard({ candidates, ojtSubmissions, fepSubmissions, fvSubmissions }: Props) {
  const [activeTab, setActiveTab] = useState<'pending' | 'done'>('pending');

  const getScore = (id: string, subs: Submission[]) =>
    subs.find(s => s.candidate_id === id)?.total_score ?? null;
  const getStatus = (id: string, subs: Submission[]) =>
    subs.find(s => s.candidate_id === id)?.status ?? null;

  const isSubmitted = (st: string | null) => st === 'submitted' || st === 'approved';
  const submitted = (subs: Submission[]) => subs.filter(s => isSubmitted(s.status)).length;

  const phase2 = candidates.filter(c => c.phase === 2);

  const pending = phase2.filter(c =>
    !isSubmitted(getStatus(c.id, ojtSubmissions)) ||
    !isSubmitted(getStatus(c.id, fepSubmissions)) ||
    !isSubmitted(getStatus(c.id, fvSubmissions))
  );

  const completed = phase2.filter(c =>
    isSubmitted(getStatus(c.id, ojtSubmissions)) &&
    isSubmitted(getStatus(c.id, fepSubmissions)) &&
    isSubmitted(getStatus(c.id, fvSubmissions))
  );

  const tools = [
    { label: 'OJT', nameAr: 'الأداء الفعلي', weight: '10%', done: submitted(ojtSubmissions), href: '/ojt', color: 'text-blue-400', bar: 'from-blue-500 to-blue-400', border: 'border-blue-500/20' },
    { label: 'FEP', nameAr: 'العرض النهائي', weight: '15%', done: submitted(fepSubmissions), href: '/fep', color: 'text-gold-400', bar: 'from-gold-500 to-amber-400', border: 'border-gold-500/20' },
    { label: 'FV', nameAr: 'الزيارة الميدانية', weight: '25%', done: submitted(fvSubmissions), href: '/fv', color: 'text-emerald-400', bar: 'from-emerald-500 to-emerald-400', border: 'border-emerald-500/20' },
  ];

  const displayed = activeTab === 'pending' ? pending : completed;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-gold-400/60 text-sm mb-1">
              <Crown className="w-4 h-4" />
              <span>رئيس المقيّمين · الدورة الثانية</span>
            </div>
            <h1 className="text-3xl font-bold text-white">متابعة التقييمات</h1>
            <p className="text-white/40 mt-1">إشراف على تقدم أدوات المرحلة الثانية</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'مرشحو المرحلة 2', value: phase2.length, sub: 'في انتظار التقييم', color: 'text-gold-400', border: 'border-gold-500/20' },
            { label: 'اكتمل تقييمهم', value: completed.length, sub: `${phase2.length > 0 ? Math.round((completed.length / phase2.length) * 100) : 0}% من المرحلة 2`, color: 'text-emerald-400', border: 'border-emerald-500/20' },
            { label: 'في انتظار إكمال', value: pending.length, sub: 'تقييم واحد أو أكثر', color: 'text-amber-400', border: 'border-amber-500/20' },
            { label: 'إجمالي التقييمات', value: submitted(ojtSubmissions) + submitted(fepSubmissions) + submitted(fvSubmissions), sub: 'OJT + FEP + FV', color: 'text-blue-400', border: 'border-blue-500/20' },
          ].map(s => (
            <div key={s.label} className={`glass-crystal rounded-2xl p-5 border ${s.border}`}>
              <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-white/60 text-sm">{s.label}</div>
              <div className="text-white/30 text-xs mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tools Progress */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {tools.map(t => {
            const pct = phase2.length > 0 ? Math.round((t.done / phase2.length) * 100) : 0;
            return (
              <div key={t.label} className={`glass-crystal rounded-2xl p-5 border ${t.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className={`font-bold ${t.color}`}>{t.label}</span>
                    <span className="text-white/40 text-sm mr-2">{t.nameAr}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${t.color}`}>{t.weight}</span>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-white/30 text-xs">{t.done} / {phase2.length}</span>
                  <span className={`text-xl font-bold ${t.color}`}>{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                  <div className={`h-full rounded-full bg-gradient-to-r ${t.bar} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <Link href={t.href}
                  className={`flex items-center justify-center gap-1 w-full py-2 rounded-lg border ${t.border} ${t.color} text-xs font-medium hover:bg-white/5 transition-all`}>
                  فتح الأداة <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Candidates Tabs */}
        <div className="flex gap-1 mb-4 p-1 glass rounded-xl w-fit">
          <button onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'pending' ? 'bg-amber-500 text-slate-950' : 'text-white/60 hover:text-white'
            }`}>
            <Clock className="w-4 h-4" />
            في الانتظار ({pending.length})
          </button>
          <button onClick={() => setActiveTab('done')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'done' ? 'bg-emerald-500 text-slate-950' : 'text-white/60 hover:text-white'
            }`}>
            <CheckCircle2 className="w-4 h-4" />
            مكتمل ({completed.length})
          </button>
        </div>

        <div className="glass-crystal rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['المرشح', 'الجهة', 'OJT', 'FEP', 'FV', 'الإجراء'].map(h => (
                    <th key={h} className="text-right text-white/40 text-xs font-medium px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-white/20 py-16 text-sm">
                    {activeTab === 'pending' ? 'لا يوجد تقييمات معلقة 🎉' : 'لا يوجد تقييمات مكتملة بعد'}
                  </td></tr>
                ) : displayed.map(c => {
                  const ToolCell = ({ subs, href }: { subs: Submission[]; href: string }) => {
                    const st = getStatus(c.id, subs);
                    const sc = getScore(c.id, subs);
                    if (!st) return (
                      <Link href={`${href}?candidateId=${c.id}`}
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300">
                        <AlertTriangle className="w-3 h-3" /> لم يبدأ
                      </Link>
                    );
                    if (isSubmitted(st)) return (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {sc?.toFixed(1)}
                      </span>
                    );
                    return <span className="text-amber-400 text-xs">مسودة</span>;
                  };
                  return (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        <div className="text-white/30 text-xs">{c.code}</div>
                      </td>
                      <td className="px-5 py-3.5 text-white/50 text-sm">{c.organization}</td>
                      <td className="px-5 py-3.5"><ToolCell subs={ojtSubmissions} href="/ojt" /></td>
                      <td className="px-5 py-3.5"><ToolCell subs={fepSubmissions} href="/fep" /></td>
                      <td className="px-5 py-3.5"><ToolCell subs={fvSubmissions} href="/fv" /></td>
                      <td className="px-5 py-3.5">
                        <Link href={`/dashboard/candidates/${c.id}`}
                          className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300">
                          <Eye className="w-3.5 h-3.5" /> ملف المرشح
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
