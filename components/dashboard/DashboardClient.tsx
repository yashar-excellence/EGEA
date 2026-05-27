'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Users, ClipboardCheck, MapPin, Presentation, Award, Search, Filter, TrendingUp, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/landing/Header';

interface Candidate {
  id: string;
  code: string;
  name: string;
  role: string;
  organization: string;
  category: string;
  level: string;
  cycle: string;
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

export function DashboardClient({ candidates, ojtSubmissions, fepSubmissions, fvSubmissions }: Props) {
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<number | 'all'>('all');

  const getScore = (candidateId: string, submissions: Submission[]) =>
    submissions.find(s => s.candidate_id === candidateId)?.total_score ?? null;

  const getStatus = (candidateId: string, submissions: Submission[]) =>
    submissions.find(s => s.candidate_id === candidateId)?.status ?? null;

  const calcEI = (c: Candidate, candidateId: string) => {
    const p1 = c.phase1_scores?.[0]?.total ?? null;
    const s360 = c.assessment_360?.[0]?.score ?? null;
    const ojt = getScore(candidateId, ojtSubmissions);
    const fep = getScore(candidateId, fepSubmissions);
    const fv = getScore(candidateId, fvSubmissions);
    if (p1 === null && s360 === null) return null;
    const scores = [p1 ?? 0, s360 ?? 0, ojt ?? 0, fep ?? 0, fv ?? 0];
    const weights = [0.40, 0.10, 0.10, 0.15, 0.25];
    return scores.reduce((acc, s, i) => acc + s * weights[i], 0);
  };

  const filtered = candidates.filter(c => {
    const matchSearch = c.name.includes(search) || c.code.includes(search) || c.organization.includes(search);
    const matchPhase = phaseFilter === 'all' || c.phase === phaseFilter;
    return matchSearch && matchPhase;
  });

  const stats = {
    total: candidates.length,
    phase2: candidates.filter(c => c.phase === 2).length,
    ojtDone: ojtSubmissions.filter(s => s.status === 'submitted').length,
    fvDone: fvSubmissions.filter(s => s.status === 'submitted').length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-white/50 mt-1">إدارة المرشحين وتقدم التقييم</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'إجمالي المرشحين', value: stats.total, color: 'text-gold-400', bg: 'from-gold-500/20 to-gold-600/5' },
            { icon: TrendingUp, label: 'في المرحلة الثانية', value: stats.phase2, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-600/5' },
            { icon: ClipboardCheck, label: 'OJT مكتمل', value: stats.ojtDone, color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/5' },
            { icon: MapPin, label: 'FV مكتمل', value: stats.fvDone, color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/5' },
          ].map((s) => (
            <div key={s.label} className={`glass-crystal rounded-2xl p-5 bg-gradient-to-br ${s.bg}`}>
              <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="بحث بالاسم أو الكود..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 1, 2] as const).map(p => (
              <button
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  phaseFilter === p
                    ? 'bg-gold-500 text-slate-950'
                    : 'glass text-white/70 hover:text-white'
                }`}
              >
                {p === 'all' ? 'الكل' : `المرحلة ${p}`}
              </button>
            ))}
          </div>
          <Link
            href="/dashboard/candidates/new"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-bold hover:opacity-90 transition-all"
          >
            + إضافة مرشح
          </Link>
        </div>

        {/* Candidates Table */}
        <div className="glass-crystal rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-right text-white/50 text-sm font-medium px-6 py-4">المرشح</th>
                  <th className="text-right text-white/50 text-sm font-medium px-6 py-4">الجهة</th>
                  <th className="text-right text-white/50 text-sm font-medium px-6 py-4">المرحلة</th>
                  <th className="text-center text-white/50 text-sm font-medium px-6 py-4">Phase 1</th>
                  <th className="text-center text-white/50 text-sm font-medium px-6 py-4">OJT</th>
                  <th className="text-center text-white/50 text-sm font-medium px-6 py-4">FEP</th>
                  <th className="text-center text-white/50 text-sm font-medium px-6 py-4">FV</th>
                  <th className="text-center text-white/50 text-sm font-medium px-6 py-4">EI Score</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-white/30 py-12">
                      لا يوجد مرشحون
                    </td>
                  </tr>
                ) : filtered.map((c) => {
                  const ei = calcEI(c, c.id);
                  const ojtStatus = getStatus(c.id, ojtSubmissions);
                  const fepStatus = getStatus(c.id, fepSubmissions);
                  const fvStatus = getStatus(c.id, fvSubmissions);
                  const p1 = c.phase1_scores?.[0]?.total;

                  const StatusBadge = ({ status, score }: { status: string | null; score: number | null }) => {
                    if (!status) return <span className="text-white/20 text-xs">—</span>;
                    if (status === 'submitted' || status === 'approved')
                      return <span className="text-emerald-400 font-bold text-sm">{score?.toFixed(1) ?? '—'}</span>;
                    return <span className="text-amber-400 text-xs">مسودة</span>;
                  };

                  return (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{c.name}</div>
                        <div className="text-white/40 text-xs">{c.code}</div>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">{c.organization}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          c.phase === 2 ? 'bg-gold-500/20 text-gold-400' : 'bg-white/10 text-white/50'
                        }`}>
                          مرحلة {c.phase}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {p1 != null
                          ? <span className="text-emerald-400 font-bold text-sm">{p1.toFixed(1)}</span>
                          : <span className="text-white/20 text-xs">—</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={ojtStatus} score={getScore(c.id, ojtSubmissions)} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={fepStatus} score={getScore(c.id, fepSubmissions)} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={fvStatus} score={getScore(c.id, fvSubmissions)} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        {ei != null ? (
                          <span className={`font-bold text-lg ${
                            ei >= 85 ? 'text-emerald-400' : ei >= 70 ? 'text-gold-400' : 'text-red-400'
                          }`}>
                            {ei.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-white/20 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/candidates/${c.id}`}
                          className="text-gold-400 hover:text-gold-300 text-sm font-medium"
                        >
                          عرض
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
