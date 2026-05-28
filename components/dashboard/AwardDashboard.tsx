'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  Award, Users, TrendingUp, BarChart2, Search,
  Printer, Download, CheckCircle2, Clock, AlertCircle,
  Star, Crown, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Header } from '@/components/landing/Header';

interface Candidate {
  id: string; code: string; name: string; role: string;
  organization: string; category: string; level: string;
  cycle: string; phase: number;
  phase1_scores?: { epr: number|null; apt: number|null; b5: number|null; sjt: number|null; cbi: number|null; total: number|null }[];
  assessment_360?: { score: number|null; provider: string|null }[];
}
interface Submission { candidate_id: string; total_score: number|null; status: string; }

interface Props {
  candidates: Candidate[];
  ojtSubmissions: Submission[];
  fepSubmissions: Submission[];
  fvSubmissions: Submission[];
}

function getScore(id: string, subs: Submission[]) {
  return subs.find(s => s.candidate_id === id)?.total_score ?? null;
}
function getStatus(id: string, subs: Submission[]) {
  return subs.find(s => s.candidate_id === id)?.status ?? null;
}

function calcEI(c: Candidate, ojt: number|null, fep: number|null, fv: number|null): number|null {
  const p1 = c.phase1_scores?.[0]?.total ?? null;
  const s360 = c.assessment_360?.[0]?.score ?? null;
  if (p1 === null && s360 === null) return null;
  return (p1 ?? 0)
    + ((s360 ?? 0) / 100) * 10
    + ((ojt ?? 0) / 100) * 10
    + ((fep ?? 0) / 100) * 15
    + ((fv ?? 0) / 100) * 25;
}

function grade(ei: number|null) {
  if (ei === null) return { label: '—', color: 'text-white/20', bg: '' };
  if (ei >= 85) return { label: 'ممتاز', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' };
  if (ei >= 70) return { label: 'جيد جداً', color: 'text-gold-400', bg: 'bg-gold-500/15 border-gold-500/30' };
  if (ei >= 55) return { label: 'جيد', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' };
  return { label: 'يحتاج تطوير', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' };
}

type SortKey = 'ei' | 'name' | 'p1' | 's360';

export function AwardDashboard({ candidates, ojtSubmissions, fepSubmissions, fvSubmissions }: Props) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('ei');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [phaseFilter, setPhaseFilter] = useState<number | 'all'>('all');

  const rows = useMemo(() => candidates.map(c => {
    const ojt = getScore(c.id, ojtSubmissions);
    const fep = getScore(c.id, fepSubmissions);
    const fv  = getScore(c.id, fvSubmissions);
    const ei  = calcEI(c, ojt, fep, fv);
    const p1  = c.phase1_scores?.[0]?.total ?? null;
    const s360 = c.assessment_360?.[0]?.score ?? null;
    return { c, ojt, fep, fv, ei, p1, s360 };
  }), [candidates, ojtSubmissions, fepSubmissions, fvSubmissions]);

  const filtered = useMemo(() => {
    let r = rows.filter(({ c }) => {
      const q = search.toLowerCase();
      const match = c.name.includes(search) || c.code.includes(search) || c.organization.includes(search);
      const phase = phaseFilter === 'all' || c.phase === phaseFilter;
      return match && phase;
    });
    r = [...r].sort((a, b) => {
      let va = 0, vb = 0;
      if (sortKey === 'ei')   { va = a.ei ?? -1; vb = b.ei ?? -1; }
      if (sortKey === 'p1')   { va = a.p1 ?? -1; vb = b.p1 ?? -1; }
      if (sortKey === 's360') { va = a.s360 ?? -1; vb = b.s360 ?? -1; }
      if (sortKey === 'name') return sortDir === 'asc'
        ? a.c.name.localeCompare(b.c.name)
        : b.c.name.localeCompare(a.c.name);
      return sortDir === 'desc' ? vb - va : va - vb;
    });
    return r;
  }, [rows, search, sortKey, sortDir, phaseFilter]);

  const eiScores = rows.map(r => r.ei).filter((e): e is number => e !== null);
  const avgEI = eiScores.length ? (eiScores.reduce((a,b) => a+b, 0) / eiScores.length) : 0;
  const excellent = eiScores.filter(e => e >= 85).length;
  const completed = rows.filter(r =>
    getStatus(r.c.id, ojtSubmissions) === 'submitted' &&
    getStatus(r.c.id, fepSubmissions) === 'submitted' &&
    getStatus(r.c.id, fvSubmissions)  === 'submitted'
  ).length;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
    : null;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-purple-400/60 text-sm mb-1">
              <Crown className="w-4 h-4" />
              <span>هيئة الجائزة · متابعة النتائج</span>
            </div>
            <h1 className="text-3xl font-bold text-white">نتائج جائزة مصر للتميز الحكومي</h1>
            <p className="text-white/40 mt-1">عرض شامل لنتائج جميع المرشحين — للقراءة والطباعة فقط</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold hover:opacity-90 transition shadow-lg shadow-purple-500/20 print:hidden"
          >
            <Printer className="w-4 h-4" />
            طباعة التقرير
          </button>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:grid-cols-4">
          {[
            { icon: Users, label: 'إجمالي المرشحين', value: candidates.length, sub: `${candidates.filter(c => c.phase === 2).length} في المرحلة الثانية`, color: 'text-gold-400', bg: 'from-gold-500/15' },
            { icon: TrendingUp, label: 'متوسط EI Score', value: avgEI ? avgEI.toFixed(1) : '—', sub: 'الوسط الحسابي الكلي', color: 'text-emerald-400', bg: 'from-emerald-500/15' },
            { icon: Star, label: 'تقييم ممتاز (≥85)', value: excellent, sub: `من ${eiScores.length} لديهم نتائج`, color: 'text-amber-400', bg: 'from-amber-500/15' },
            { icon: CheckCircle2, label: 'مكتملو التقييم', value: completed, sub: 'أكملوا OJT+FEP+FV', color: 'text-blue-400', bg: 'from-blue-500/15' },
          ].map(k => (
            <div key={k.label} className={`glass-crystal rounded-2xl p-5 border border-white/10 bg-gradient-to-br ${k.bg} to-transparent`}>
              <k.icon className={`w-6 h-6 ${k.color} mb-3`} />
              <div className={`text-3xl font-black tabular-nums ${k.color}`}>{k.value}</div>
              <div className="text-white/70 text-sm font-medium mt-1">{k.label}</div>
              <div className="text-white/30 text-xs mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Filters (hide on print) ── */}
        <div className="flex flex-wrap gap-3 mb-5 print:hidden">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث باسم أو كود أو الجهة..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-400/50" />
          </div>
          {(['all', 1, 2] as const).map(p => (
            <button key={p} onClick={() => setPhaseFilter(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                phaseFilter === p ? 'bg-purple-500 text-white' : 'glass text-white/60 hover:text-white'
              }`}>
              {p === 'all' ? 'الكل' : `مرحلة ${p}`}
            </button>
          ))}
        </div>

        {/* ── Results Table ── */}
        <div className="glass-crystal rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-right text-white/40 text-xs font-medium px-5 py-3">المرشح</th>
                  <th className="text-right text-white/40 text-xs font-medium px-5 py-3">الجهة</th>
                  <th className="text-right text-white/40 text-xs font-medium px-5 py-3">المرحلة</th>
                  <th className="text-center text-white/40 text-xs font-medium px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('p1')}>
                    <span className="flex items-center justify-center gap-1">Phase 1 /40 <SortIcon k="p1" /></span>
                  </th>
                  <th className="text-center text-white/40 text-xs font-medium px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('s360')}>
                    <span className="flex items-center justify-center gap-1">360° /100 <SortIcon k="s360" /></span>
                  </th>
                  <th className="text-center text-white/40 text-xs font-medium px-4 py-3">OJT</th>
                  <th className="text-center text-white/40 text-xs font-medium px-4 py-3">FEP</th>
                  <th className="text-center text-white/40 text-xs font-medium px-4 py-3">FV</th>
                  <th className="text-center text-white/40 text-xs font-medium px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('ei')}>
                    <span className="flex items-center justify-center gap-1">EI Score <SortIcon k="ei" /></span>
                  </th>
                  <th className="text-center text-white/40 text-xs font-medium px-4 py-3">التقدير</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="text-center text-white/20 py-16 text-sm">لا يوجد مرشحون</td></tr>
                ) : filtered.map(({ c, ojt, fep, fv, ei, p1, s360 }, rank) => {
                  const g = grade(ei);
                  return (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {rank < 3 && ei !== null && (
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                              rank === 0 ? 'bg-gold-500 text-slate-950'
                              : rank === 1 ? 'bg-slate-400 text-slate-950'
                              : 'bg-amber-700 text-white'
                            }`}>{rank + 1}</span>
                          )}
                          <div>
                            <div className="font-bold text-white text-sm">{c.name}</div>
                            <div className="text-white/30 text-xs">{c.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-white/50 text-sm">{c.organization}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.phase === 2 ? 'bg-gold-500/20 text-gold-400' : 'bg-white/10 text-white/40'}`}>
                          مرحلة {c.phase}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={p1 != null ? 'text-amber-400 font-bold text-sm' : 'text-white/20 text-xs'}>
                          {p1 != null ? p1.toFixed(1) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={s360 != null ? 'text-purple-400 font-bold text-sm' : 'text-white/20 text-xs'}>
                          {s360 != null ? s360.toFixed(1) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={ojt != null ? 'text-emerald-400 font-bold text-sm' : 'text-white/20 text-xs'}>
                          {ojt != null ? ojt.toFixed(1) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={fep != null ? 'text-blue-400 font-bold text-sm' : 'text-white/20 text-xs'}>
                          {fep != null ? fep.toFixed(1) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={fv != null ? 'text-rose-400 font-bold text-sm' : 'text-white/20 text-xs'}>
                          {fv != null ? fv.toFixed(1) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`font-black text-lg tabular-nums ${g.color}`}>
                          {ei != null ? ei.toFixed(1) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {ei != null && (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${g.bg} ${g.color}`}>
                            {g.label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/30">
            <span>إجمالي: {filtered.length} مرشح</span>
            <span>مرتب حسب: {sortKey === 'ei' ? 'EI Score' : sortKey === 'p1' ? 'Phase 1' : sortKey === 's360' ? '360°' : 'الاسم'}</span>
          </div>
        </div>

        {/* ── Print Footer ── */}
        <div className="hidden print:block mt-8 text-center text-white/40 text-xs border-t border-white/10 pt-4">
          <p>جائزة مصر للتميز الحكومي — تقرير نتائج رسمي</p>
          <p className="mt-1">تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .glass-crystal, .glass, .glass-strong { background: white !important; border: 1px solid #e2e8f0 !important; }
          .text-white { color: #1e293b !important; }
          .text-white\\/40, .text-white\\/50, .text-white\\/60, .text-white\\/70 { color: #64748b !important; }
          .bg-slate-950 { background: white !important; }
          header { display: none !important; }
        }
      `}</style>
    </div>
  );
}
