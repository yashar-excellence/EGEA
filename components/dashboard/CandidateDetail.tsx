'use client';

import Link from 'next/link';
import { ArrowRight, User, Building2, Award, ClipboardCheck, Presentation, MapPin, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Header } from '@/components/landing/Header';

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

const weights = { epr: 5, apt: 5, b5: 5, sjt: 10, cbi: 15, s360: 10, ojt: 10, fep: 15, fv: 25 };
const p1Max = { epr: 5, apt: 5, b5: 5, sjt: 10, cbi: 15 };

function ScoreBar({ label, score, max, weight, color }: { label: string; score: number | null; max: number; weight: number; color: string }) {
  const pct = score != null ? (score / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{label} <span className="text-white/30">({weight}%)</span></span>
        <span className={`font-bold ${color}`}>{score != null ? score.toFixed(1) : '—'}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${color === 'text-gold-400' ? 'from-gold-500 to-amber-400' : color === 'text-emerald-400' ? 'from-emerald-500 to-green-400' : color === 'text-blue-400' ? 'from-blue-500 to-cyan-400' : color === 'text-purple-400' ? 'from-purple-500 to-pink-400' : 'from-slate-500 to-slate-400'}`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="flex items-center gap-1 text-white/30 text-xs"><AlertCircle className="w-3 h-3" />لم يبدأ</span>;
  if (status === 'submitted' || status === 'approved') return <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold"><CheckCircle2 className="w-3 h-3" />مكتمل</span>;
  return <span className="flex items-center gap-1 text-amber-400 text-xs"><Clock className="w-3 h-3" />مسودة</span>;
}

export function CandidateDetail({ candidate, ojt, fep, fv }: Props) {
  const p1 = candidate.phase1_scores?.[0];
  const s360 = candidate.assessment_360?.[0];

  const calcEI = () => {
    const p1Score = p1?.total != null ? (p1.total / 40) * 40 : null;
    const s360Score = s360?.score != null ? (s360.score / 100) * 10 : null;
    const ojtScore = ojt?.total_score != null ? (ojt.total_score / 100) * 10 : null;
    const fepScore = fep?.total_score != null ? (fep.total_score / 100) * 15 : null;
    const fvScore = fv?.total_score != null ? (fv.total_score / 100) * 25 : null;
    if (p1Score === null && s360Score === null) return null;
    return (p1Score ?? 0) + (s360Score ?? 0) + (ojtScore ?? 0) + (fepScore ?? 0) + (fvScore ?? 0);
  };

  const ei = calcEI();
  const hasAnyData = p1 || s360 || ojt || fep || fv;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">

        {/* Back */}
        <Link href="/admin" className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition w-fit">
          <ArrowRight className="w-4 h-4" />
          <span className="text-sm">العودة للوحة التحكم</span>
        </Link>

        {/* Candidate Header */}
        <div className="glass-crystal rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500/30 to-amber-600/20 flex items-center justify-center text-gold-400 text-2xl font-bold">
                {candidate.name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{candidate.name}</h1>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-white/50">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{candidate.role}</span>
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{candidate.organization}</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" />{candidate.code}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold ${ei === null ? 'text-white/20' : ei >= 85 ? 'text-emerald-400' : ei >= 70 ? 'text-gold-400' : 'text-red-400'}`}>
                {ei !== null ? ei.toFixed(1) : '—'}
              </div>
              <div className="text-white/40 text-sm mt-1">Excellence Index</div>
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${candidate.phase === 2 ? 'bg-gold-500/20 text-gold-400' : 'bg-white/10 text-white/50'}`}>
                مرحلة {candidate.phase}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Phase 1 — Outsource */}
          <div className="glass-crystal rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold-400" />
                المرحلة الأولى — Outsource (40%)
              </h2>
              <span className={`text-lg font-bold ${p1?.total != null ? 'text-gold-400' : 'text-white/20'}`}>
                {p1?.total != null ? p1.total.toFixed(1) : '—'}
              </span>
            </div>
            <div className="space-y-3">
              <ScoreBar label="EPR — مراجعة ملف الأدلة" score={p1?.epr ?? null} max={100} weight={5} color="text-gold-400" />
              <ScoreBar label="APT — اختبار القدرات" score={p1?.apt ?? null} max={100} weight={5} color="text-gold-400" />
              <ScoreBar label="B5 — الشخصية" score={p1?.b5 ?? null} max={100} weight={5} color="text-gold-400" />
              <ScoreBar label="SJT — الحكم الموقفي" score={p1?.sjt ?? null} max={100} weight={10} color="text-gold-400" />
              <ScoreBar label="CBI — مقابلة الكفاءات" score={p1?.cbi ?? null} max={100} weight={15} color="text-gold-400" />
            </div>
          </div>

          {/* Phase 2 — Outsource */}
          <div className="glass-crystal rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                تقييم 360° — LEVID (10%)
              </h2>
              <span className={`text-lg font-bold ${s360?.score != null ? 'text-purple-400' : 'text-white/20'}`}>
                {s360?.score != null ? s360.score.toFixed(1) : '—'}
              </span>
            </div>
            <ScoreBar label="تقييم 360 درجة" score={s360?.score ?? null} max={100} weight={10} color="text-purple-400" />
            {s360?.provider && <p className="text-white/30 text-xs mt-3">المزود: {s360.provider}</p>}
            {!s360 && <p className="text-white/20 text-sm mt-4 text-center">لم يُستورد بعد</p>}
          </div>

          {/* OJT */}
          <div className="glass-crystal rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                OJT — التقييم الميداني الافتراضي (10%)
              </h2>
              <StatusBadge status={ojt?.status ?? null} />
            </div>
            <ScoreBar label="نتيجة OJT" score={ojt?.total_score ?? null} max={100} weight={10} color="text-emerald-400" />
            <Link href={`/ojt?candidateId=${candidate.id}`} className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition text-sm font-medium">
              <ClipboardCheck className="w-4 h-4" />
              {ojt ? 'عرض التقييم' : 'بدء التقييم'}
            </Link>
          </div>

          {/* FEP */}
          <div className="glass-crystal rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Presentation className="w-5 h-5 text-blue-400" />
                FEP — العرض النهائي للتميز (15%)
              </h2>
              <StatusBadge status={fep?.status ?? null} />
            </div>
            <ScoreBar label="نتيجة FEP" score={fep?.total_score ?? null} max={100} weight={15} color="text-blue-400" />
            <Link href={`/fep?candidateId=${candidate.id}`} className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-sm font-medium">
              <Presentation className="w-4 h-4" />
              {fep ? 'عرض التقييم' : 'بدء التقييم'}
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
            <ScoreBar label="نتيجة الزيارة الميدانية" score={fv?.total_score ?? null} max={100} weight={25} color="text-rose-400" />
            <Link href={`/fv?candidateId=${candidate.id}`} className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition text-sm font-medium">
              <MapPin className="w-4 h-4" />
              {fv ? 'عرض التقييم' : 'بدء الزيارة الميدانية'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
