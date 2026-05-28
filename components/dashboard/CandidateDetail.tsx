'use client';

import Link from 'next/link';
import {
  ArrowRight, User, Building2, Award, ClipboardCheck,
  Presentation, MapPin, TrendingUp, CheckCircle2, Clock,
  AlertCircle, BarChart2, Star,
} from 'lucide-react';
import { Header } from '@/components/landing/Header';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';

interface Phase1Scores {
  epr: number | null; apt: number | null; b5: number | null;
  sjt: number | null; cbi: number | null; total: number | null;
}
interface Assessment360 { score: number | null; provider: string | null; }
interface Submission { total_score: number | null; status: string; data: any; }
interface Candidate {
  id: string; code: string; name: string; role: string;
  organization: string; category: string; level: string;
  cycle: string; phase: number;
  phase1_scores?: Phase1Scores[];
  assessment_360?: Assessment360[];
}
interface Props {
  candidate: Candidate;
  ojt: Submission | null;
  fep: Submission | null;
  fv: Submission | null;
}

function ScoreBar({ label, score, max, weight, color, gradient }: {
  label: string; score: number | null; max: number; weight: number; color: string; gradient: string;
}) {
  const pct = score != null ? Math.min((score / max) * 100, 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{label} <span className="text-white/30 text-xs">({weight}%)</span></span>
        <span className={`font-bold tabular-nums ${color}`}>{score != null ? score.toFixed(1) : '—'}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="flex items-center gap-1 text-white/30 text-xs"><AlertCircle className="w-3 h-3" />لم يبدأ</span>;
  if (status === 'submitted' || status === 'approved') return <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold"><CheckCircle2 className="w-3 h-3" />مكتمل</span>;
  return <span className="flex items-center gap-1 text-amber-400 text-xs"><Clock className="w-3 h-3" />مسودة</span>;
}

function EIGauge({ value, max = 100 }: { value: number | null; max?: number }) {
  const pct = value != null ? Math.min(value / max, 1) : 0;
  const r = 60;
  const cx = 90;
  const cy = 80;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  // Arc goes from 180° (left) to 0° (right) counter-clockwise on top
  const sweepAngle = pct * 180;
  const startDeg = 180;
  const endDeg = 180 - sweepAngle;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const largeArc = sweepAngle > 180 ? 1 : 0;
  const color = value === null ? '#334155' : value >= 85 ? '#34d399' : value >= 70 ? '#f59e0b' : '#f87171';

  return (
    <svg width="180" height="100" viewBox="0 0 180 100">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round"
      />
      {/* Value arc */}
      {pct > 0 && (
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`}
          fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        />
      )}
      {/* Value text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color} fontSize="24" fontWeight="bold" fontFamily="Cairo, sans-serif">
        {value !== null ? value.toFixed(1) : '—'}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="Cairo, sans-serif">Excellence Index / 100</text>
      <text x={cx - r + 4} y={cy + 20} fill="#475569" fontSize="9" fontFamily="Cairo, sans-serif">0</text>
      <text x={cx + r - 12} y={cy + 20} fill="#475569" fontSize="9" fontFamily="Cairo, sans-serif">100</text>
    </svg>
  );
}

export function CandidateDetail({ candidate, ojt, fep, fv }: Props) {
  const p1 = candidate.phase1_scores?.[0];
  const s360 = candidate.assessment_360?.[0];

  const p1Weighted = p1?.total != null ? p1.total : null;
  const s360Weighted = s360?.score != null ? (s360.score / 100) * 10 : null;
  const ojtWeighted = ojt?.total_score != null ? (ojt.total_score / 100) * 10 : null;
  const fepWeighted = fep?.total_score != null ? (fep.total_score / 100) * 15 : null;
  const fvWeighted = fv?.total_score != null ? (fv.total_score / 100) * 25 : null;

  const ei = (p1Weighted !== null || s360Weighted !== null)
    ? (p1Weighted ?? 0) + (s360Weighted ?? 0) + (ojtWeighted ?? 0) + (fepWeighted ?? 0) + (fvWeighted ?? 0)
    : null;

  const grade = ei === null ? null : ei >= 85 ? { label: 'ممتاز', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    : ei >= 70 ? { label: 'جيد جداً', color: 'text-gold-400', bg: 'bg-gold-500/20' }
    : ei >= 55 ? { label: 'جيد', color: 'text-blue-400', bg: 'bg-blue-500/20' }
    : { label: 'يحتاج تطوير', color: 'text-red-400', bg: 'bg-red-500/20' };

  const radarData = [
    { subject: 'Phase 1', value: p1Weighted != null ? (p1Weighted / 40) * 100 : 0, fullMark: 100 },
    { subject: '360°', value: s360?.score ?? 0, fullMark: 100 },
    { subject: 'OJT', value: ojt?.total_score ?? 0, fullMark: 100 },
    { subject: 'FEP', value: fep?.total_score ?? 0, fullMark: 100 },
    { subject: 'FV', value: fv?.total_score ?? 0, fullMark: 100 },
  ];

  const timeline = [
    { label: 'تسجيل المرشح', done: true, date: '' },
    { label: 'إدخال Phase 1', done: p1 != null, date: '' },
    { label: 'تقييم 360°', done: s360 != null, date: '' },
    { label: 'OJT', done: ojt?.status === 'submitted' || ojt?.status === 'approved', date: '' },
    { label: 'FEP', done: fep?.status === 'submitted' || fep?.status === 'approved', date: '' },
    { label: 'FV', done: fv?.status === 'submitted' || fv?.status === 'approved', date: '' },
    { label: 'النتيجة النهائية', done: ei !== null && [ojt, fep, fv].every(s => s?.status === 'submitted' || s?.status === 'approved'), date: '' },
  ];

  const completedSteps = timeline.filter(t => t.done).length;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">

        <Link href="/admin" className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition w-fit">
          <ArrowRight className="w-4 h-4" />
          <span className="text-sm">العودة للوحة التحكم</span>
        </Link>

        {/* ── Hero Card ── */}
        <div className="glass-crystal rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500/30 to-amber-600/20 flex items-center justify-center text-gold-400 text-3xl font-bold flex-shrink-0">
                {candidate.name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{candidate.name}</h1>
                <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-white/50">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{candidate.role}</span>
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{candidate.organization}</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" />{candidate.code}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${candidate.phase === 2 ? 'bg-gold-500/20 text-gold-400' : 'bg-white/10 text-white/50'}`}>مرحلة {candidate.phase}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/10 text-white/50">{candidate.cycle}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/10 text-white/50">{candidate.level}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <EIGauge value={ei} />
              {grade && (
                <div className="text-center">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${grade.bg} ${grade.color}`}>
                    {grade.label}
                  </span>
                  <div className="text-white/30 text-xs mt-2">{completedSteps}/{timeline.length} مراحل مكتملة</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Progress Timeline ── */}
        <div className="glass-crystal rounded-2xl p-5 mb-6 border border-white/10">
          <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-400" /> مسار التقييم
          </h2>
          <div className="flex items-center gap-0 overflow-x-auto pb-1">
            {timeline.map((step, i) => (
              <div key={i} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step.done ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/30'}`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : <span>{i + 1}</span>}
                  </div>
                  <span className={`text-xs whitespace-nowrap ${step.done ? 'text-white/70' : 'text-white/25'}`}>{step.label}</span>
                </div>
                {i < timeline.length - 1 && (
                  <div className={`h-0.5 w-8 md:w-12 mx-1 mb-5 rounded ${step.done && timeline[i + 1].done ? 'bg-emerald-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* ── Radar Chart ── */}
          <div className="glass-crystal rounded-2xl p-5 border border-white/10 flex flex-col">
            <h2 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-gold-400" /> مخطط الأداء
            </h2>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Radar dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Weighted Scores Summary ── */}
          <div className="glass-crystal rounded-2xl p-5 border border-white/10 md:col-span-2">
            <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-400" /> توزيع النقاط المرجّحة
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Phase 1 — Outsource', score: p1Weighted, max: 40, gradient: 'from-amber-500 to-gold-400', color: 'text-gold-400' },
                { label: 'تقييم 360° — LEVID', score: s360Weighted, max: 10, gradient: 'from-purple-500 to-pink-400', color: 'text-purple-400' },
                { label: 'OJT — الأداء الوظيفي', score: ojtWeighted, max: 10, gradient: 'from-emerald-500 to-green-400', color: 'text-emerald-400' },
                { label: 'FEP — العرض النهائي', score: fepWeighted, max: 15, gradient: 'from-blue-500 to-cyan-400', color: 'text-blue-400' },
                { label: 'FV — الزيارة الميدانية', score: fvWeighted, max: 25, gradient: 'from-rose-500 to-pink-400', color: 'text-rose-400' },
              ].map(row => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{row.label}</span>
                    <span className={`font-bold tabular-nums ${row.color}`}>
                      {row.score != null ? `${row.score.toFixed(1)} / ${row.max}` : `— / ${row.max}`}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${row.gradient} transition-all duration-700`}
                      style={{ width: row.score != null ? `${(row.score / row.max) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-white/60 font-medium">مجموع EI</span>
                <span className={`text-xl font-bold tabular-nums ${ei === null ? 'text-white/20' : ei >= 85 ? 'text-emerald-400' : ei >= 70 ? 'text-gold-400' : 'text-red-400'}`}>
                  {ei !== null ? `${ei.toFixed(1)} / 100` : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tools Grid ── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Phase 1 */}
          <div className="glass-crystal rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold-400" />
                المرحلة الأولى — Outsource (40%)
              </h2>
              <span className={`text-lg font-bold tabular-nums ${p1?.total != null ? 'text-gold-400' : 'text-white/20'}`}>
                {p1?.total != null ? `${p1.total.toFixed(1)} / 40` : '—'}
              </span>
            </div>
            <div className="space-y-3">
              <ScoreBar label="EPR — مراجعة ملف الأدلة" score={p1?.epr ?? null} max={5} weight={5} color="text-gold-400" gradient="from-amber-500 to-gold-400" />
              <ScoreBar label="APT — اختبار القدرات" score={p1?.apt ?? null} max={5} weight={5} color="text-gold-400" gradient="from-amber-500 to-gold-400" />
              <ScoreBar label="B5 — الشخصية" score={p1?.b5 ?? null} max={5} weight={5} color="text-gold-400" gradient="from-amber-500 to-gold-400" />
              <ScoreBar label="SJT — الحكم الموقفي" score={p1?.sjt ?? null} max={10} weight={10} color="text-gold-400" gradient="from-amber-500 to-gold-400" />
              <ScoreBar label="CBI — مقابلة الكفاءات" score={p1?.cbi ?? null} max={15} weight={15} color="text-gold-400" gradient="from-amber-500 to-gold-400" />
            </div>
          </div>

          {/* 360 */}
          <div className="glass-crystal rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                تقييم 360° — LEVID (10%)
              </h2>
              <span className={`text-lg font-bold tabular-nums ${s360?.score != null ? 'text-purple-400' : 'text-white/20'}`}>
                {s360?.score != null ? `${s360.score.toFixed(1)} / 100` : '—'}
              </span>
            </div>
            <ScoreBar label="تقييم 360 درجة" score={s360?.score ?? null} max={100} weight={10} color="text-purple-400" gradient="from-purple-500 to-pink-400" />
            {s360?.provider && <p className="text-white/30 text-xs mt-4">المزود: {s360.provider}</p>}
            {!s360 && <p className="text-white/20 text-sm mt-6 text-center">لم يُستورد بعد</p>}
          </div>

          {/* OJT */}
          <div className="glass-crystal rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                OJT — الأداء الوظيفي (10%)
              </h2>
              <StatusBadge status={ojt?.status ?? null} />
            </div>
            <ScoreBar label="نتيجة OJT" score={ojt?.total_score ?? null} max={100} weight={10} color="text-emerald-400" gradient="from-emerald-500 to-green-400" />
            <Link href={`/ojt?candidateId=${candidate.id}`}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition text-sm font-medium">
              <ClipboardCheck className="w-4 h-4" />
              {ojt ? 'عرض / تعديل التقييم' : 'بدء التقييم'}
            </Link>
          </div>

          {/* FEP */}
          <div className="glass-crystal rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Presentation className="w-5 h-5 text-blue-400" />
                FEP — العرض النهائي (15%)
              </h2>
              <StatusBadge status={fep?.status ?? null} />
            </div>
            <ScoreBar label="نتيجة FEP" score={fep?.total_score ?? null} max={100} weight={15} color="text-blue-400" gradient="from-blue-500 to-cyan-400" />
            <Link href={`/fep?candidateId=${candidate.id}`}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-sm font-medium">
              <Presentation className="w-4 h-4" />
              {fep ? 'عرض / تعديل التقييم' : 'بدء التقييم'}
            </Link>
          </div>

          {/* FV */}
          <div className="glass-crystal rounded-2xl p-6 border border-white/10 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-400" />
                FV — الزيارة الميدانية (25%)
              </h2>
              <StatusBadge status={fv?.status ?? null} />
            </div>
            <ScoreBar label="نتيجة الزيارة الميدانية" score={fv?.total_score ?? null} max={100} weight={25} color="text-rose-400" gradient="from-rose-500 to-pink-400" />
            <Link href={`/fv?candidateId=${candidate.id}`}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition text-sm font-medium">
              <MapPin className="w-4 h-4" />
              {fv ? 'عرض / تعديل التقييم' : 'بدء الزيارة الميدانية'}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
