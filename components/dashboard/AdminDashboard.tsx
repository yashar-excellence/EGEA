'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Users, ClipboardCheck, MapPin, Presentation, Award,
  Search, TrendingUp, Shield, Bell, Settings,
  CheckCircle2, Clock, AlertTriangle, BarChart2,
  UserCheck, UserPlus, Activity, ChevronRight, Eye,
} from 'lucide-react';
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

const recentActivity = [
  { user: 'محمد علي', action: 'أكمل تقييم OJT', tool: 'OJT', time: 'منذ 5 دقائق', color: 'text-blue-400' },
  { user: 'أحمد حسن', action: 'رفع تقييم FEP', tool: 'FEP', time: 'منذ 15 دقيقة', color: 'text-gold-400' },
  { user: 'سارة أحمد', action: 'أنهت الزيارة الميدانية', tool: 'FV', time: 'منذ ساعة', color: 'text-emerald-400' },
  { user: 'خالد محمود', action: 'انتقل للمرحلة الثانية', tool: 'Phase 2', time: 'منذ ساعتين', color: 'text-purple-400' },
  { user: 'منى إبراهيم', action: 'أضيف كمرشح جديد', tool: 'إدارة', time: 'منذ 3 ساعات', color: 'text-gold-400' },
];

export function AdminDashboard({ candidates, ojtSubmissions, fepSubmissions, fvSubmissions }: Props) {
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'candidates' | 'tools' | 'activity'>('candidates');

  const getScore = (id: string, subs: Submission[]) =>
    subs.find(s => s.candidate_id === id)?.total_score ?? null;
  const getStatus = (id: string, subs: Submission[]) =>
    subs.find(s => s.candidate_id === id)?.status ?? null;

  const calcEI = (c: Candidate) => {
    const p1 = c.phase1_scores?.[0]?.total ?? null;
    const s360 = c.assessment_360?.[0]?.score ?? null;
    const ojt = getScore(c.id, ojtSubmissions);
    const fep = getScore(c.id, fepSubmissions);
    const fv = getScore(c.id, fvSubmissions);
    if (p1 === null && s360 === null) return null;
    return [p1 ?? 0, s360 ?? 0, ojt ?? 0, fep ?? 0, fv ?? 0]
      .reduce((acc, s, i) => acc + s * [0.40, 0.10, 0.10, 0.15, 0.25][i], 0);
  };

  const filtered = candidates.filter(c => {
    const matchSearch = c.name.includes(search) || c.code.includes(search) || c.organization.includes(search);
    const matchPhase = phaseFilter === 'all' || c.phase === phaseFilter;
    return matchSearch && matchPhase;
  });

  const submitted = (subs: Submission[]) => subs.filter(s => s.status === 'submitted' || s.status === 'approved').length;

  const tools = [
    { label: 'OJT', nameAr: 'الأداء الفعلي', done: submitted(ojtSubmissions), total: candidates.filter(c => c.phase === 2).length, color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/5', href: '/ojt' },
    { label: 'FEP', nameAr: 'العرض النهائي', done: submitted(fepSubmissions), total: candidates.filter(c => c.phase === 2).length, color: 'text-gold-400', bg: 'from-gold-500/20 to-gold-600/5', href: '/fep' },
    { label: 'FV', nameAr: 'الزيارة الميدانية', done: submitted(fvSubmissions), total: candidates.filter(c => c.phase === 2).length, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-600/5', href: '/fv' },
  ];

  const eiScores = candidates.map(c => calcEI(c)).filter((s): s is number => s !== null);
  const avgEI = eiScores.length ? (eiScores.reduce((a, b) => a + b, 0) / eiScores.length).toFixed(1) : '—';
  const topCount = eiScores.filter(s => s >= 85).length;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-gold-400/60 text-sm mb-1">
              <Shield className="w-4 h-4" />
              <span>لوحة الإدارة · الدورة الثانية</span>
            </div>
            <h1 className="text-3xl font-bold text-white">مرحباً، مدير النظام</h1>
            <p className="text-white/40 mt-1">إدارة شاملة لجائزة مصر للتميز الحكومي</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/candidates/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-bold hover:opacity-90 transition-all shadow-lg shadow-gold-500/20">
              <UserPlus className="w-4 h-4" />
              إضافة مرشح
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'إجمالي المرشحين', value: candidates.length, sub: `${candidates.filter(c => c.phase === 2).length} في المرحلة 2`, color: 'text-gold-400', bg: 'from-gold-500/15 to-transparent', border: 'border-gold-500/20' },
            { icon: UserCheck, label: 'متوسط EI Score', value: avgEI, sub: `${topCount} مرشح استثنائي`, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-transparent', border: 'border-emerald-500/20' },
            { icon: ClipboardCheck, label: 'تقييمات مكتملة', value: submitted(ojtSubmissions) + submitted(fepSubmissions) + submitted(fvSubmissions), sub: 'OJT + FEP + FV', color: 'text-blue-400', bg: 'from-blue-500/15 to-transparent', border: 'border-blue-500/20' },
            { icon: Activity, label: 'نشاط اليوم', value: 12, sub: '5 تقييمات جديدة', color: 'text-purple-400', bg: 'from-purple-500/15 to-transparent', border: 'border-purple-500/20' },
          ].map((s) => (
            <div key={s.label} className={`relative rounded-2xl p-5 bg-gradient-to-br ${s.bg} border ${s.border} overflow-hidden`}>
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/[0.02] -translate-y-6 translate-x-6" />
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-white/60 text-sm mt-1">{s.label}</div>
              <div className="text-white/30 text-xs mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tools Progress */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {tools.map(t => {
            const pct = t.total > 0 ? Math.round((t.done / t.total) * 100) : 0;
            return (
              <div key={t.label} className={`glass-crystal rounded-2xl p-5 bg-gradient-to-br ${t.bg}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`text-sm font-bold ${t.color}`}>{t.label}</div>
                    <div className="text-white/40 text-xs">{t.nameAr}</div>
                  </div>
                  <div className={`text-2xl font-bold ${t.color}`}>{pct}%</div>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                  <div className={`h-full rounded-full bg-gradient-to-r ${
                    t.label === 'OJT' ? 'from-blue-500 to-blue-400' :
                    t.label === 'FEP' ? 'from-gold-500 to-amber-400' :
                    'from-emerald-500 to-emerald-400'
                  } transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-xs">{t.done} / {t.total} مكتمل</span>
                  <Link href={t.href} className={`text-xs ${t.color} hover:opacity-80 flex items-center gap-1`}>
                    فتح <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 glass rounded-xl w-fit">
          {([
            { key: 'candidates', label: 'المرشحون', icon: Users },
            { key: 'tools', label: 'أدوات التقييم', icon: ClipboardCheck },
            { key: 'activity', label: 'آخر النشاطات', icon: Activity },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-gold-500 text-slate-950' : 'text-white/60 hover:text-white'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Candidates */}
        {activeTab === 'candidates' && (
          <div className="glass-crystal rounded-2xl overflow-hidden">
            {/* Table Filters */}
            <div className="flex flex-wrap gap-3 p-4 border-b border-white/10">
              <div className="relative flex-1 min-w-56">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" placeholder="بحث بالاسم أو الكود أو الجهة..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-400/50" />
              </div>
              <div className="flex gap-2">
                {(['all', 1, 2] as const).map(p => (
                  <button key={p} onClick={() => setPhaseFilter(p)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      phaseFilter === p ? 'bg-gold-500 text-slate-950' : 'glass text-white/60 hover:text-white'
                    }`}>
                    {p === 'all' ? 'الكل' : `مرحلة ${p}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['المرشح', 'الجهة', 'المرحلة', 'Phase 1', 'OJT', 'FEP', 'FV', 'EI Score', ''].map(h => (
                      <th key={h} className="text-right text-white/40 text-xs font-medium px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} className="text-center text-white/20 py-16 text-sm">لا يوجد مرشحون</td></tr>
                  ) : filtered.map((c) => {
                    const ei = calcEI(c);
                    const p1 = c.phase1_scores?.[0]?.total;
                    const ScoreBadge = ({ subs }: { subs: Submission[] }) => {
                      const st = getStatus(c.id, subs);
                      const sc = getScore(c.id, subs);
                      if (!st) return <span className="text-white/20 text-xs">—</span>;
                      if (st === 'submitted' || st === 'approved')
                        return <span className="text-emerald-400 font-bold text-sm">{sc?.toFixed(1) ?? '—'}</span>;
                      return <span className="inline-flex items-center gap-1 text-amber-400 text-xs"><Clock className="w-3 h-3" />مسودة</span>;
                    };
                    return (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-white text-sm">{c.name}</div>
                          <div className="text-white/30 text-xs">{c.code}</div>
                        </td>
                        <td className="px-5 py-3.5 text-white/50 text-sm">{c.organization}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            c.phase === 2 ? 'bg-gold-500/20 text-gold-400' : 'bg-white/10 text-white/40'
                          }`}>مرحلة {c.phase}</span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {p1 != null ? <span className="text-emerald-400 font-bold text-sm">{p1.toFixed(1)}</span> : <span className="text-white/20 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-center"><ScoreBadge subs={ojtSubmissions} /></td>
                        <td className="px-5 py-3.5 text-center"><ScoreBadge subs={fepSubmissions} /></td>
                        <td className="px-5 py-3.5 text-center"><ScoreBadge subs={fvSubmissions} /></td>
                        <td className="px-5 py-3.5 text-center">
                          {ei != null ? (
                            <span className={`font-bold text-base ${ei >= 85 ? 'text-emerald-400' : ei >= 70 ? 'text-gold-400' : 'text-red-400'}`}>
                              {ei.toFixed(1)}
                            </span>
                          ) : <span className="text-white/20 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <Link href={`/dashboard/candidates/${c.id}`}
                            className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-3.5 h-3.5" /> عرض
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Tools */}
        {activeTab === 'tools' && (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'OJT', nameAr: 'تقييم الأداء الفعلي', weight: '10%', href: '/ojt', color: 'text-blue-400', border: 'border-blue-500/20', desc: '3 إنجازات × 8 محاور تقييم', subs: ojtSubmissions },
              { label: 'FEP', nameAr: 'العرض النهائي للتميز', weight: '15%', href: '/fep', color: 'text-gold-400', border: 'border-gold-500/20', desc: 'عرض أمام لجنة التقييم', subs: fepSubmissions },
              { label: 'FV', nameAr: 'الزيارة الميدانية', weight: '25%', href: '/fv', color: 'text-emerald-400', border: 'border-emerald-500/20', desc: 'زيارة ميدانية + Checklist', subs: fvSubmissions },
            ].map(t => {
              const done = submitted(t.subs);
              const phase2 = candidates.filter(c => c.phase === 2).length;
              const pct = phase2 > 0 ? Math.round((done / phase2) * 100) : 0;
              const avg = t.subs.filter(s => s.total_score !== null).length > 0
                ? (t.subs.filter(s => s.total_score !== null).reduce((a, s) => a + (s.total_score ?? 0), 0) / t.subs.filter(s => s.total_score !== null).length).toFixed(1)
                : '—';
              return (
                <div key={t.label} className={`glass-crystal rounded-2xl p-6 border ${t.border}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className={`text-xl font-bold ${t.color}`}>{t.label}</div>
                      <div className="text-white/60 text-sm">{t.nameAr}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/10 ${t.color}`}>{t.weight}</span>
                  </div>
                  <p className="text-white/40 text-sm mb-4">{t.desc}</p>
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">الإكمال</span>
                      <span className={t.color}>{pct}% ({done}/{phase2})</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-current transition-all" style={{ width: `${pct}%`, color: 'currentColor' }} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">متوسط الدرجات</span>
                      <span className={`font-bold ${t.color}`}>{avg}</span>
                    </div>
                  </div>
                  <Link href={t.href}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border ${t.border} ${t.color} text-sm font-medium hover:bg-white/5 transition-all`}>
                    فتح أداة التقييم <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab: Activity */}
        {activeTab === 'activity' && (
          <div className="glass-crystal rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="text-white font-bold">آخر النشاطات</h3>
            </div>
            <div className="divide-y divide-white/5">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {item.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">{item.user}</div>
                    <div className="text-white/40 text-xs">{item.action}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${item.color} font-medium flex-shrink-0`}>{item.tool}</span>
                  <span className="text-white/20 text-xs flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
