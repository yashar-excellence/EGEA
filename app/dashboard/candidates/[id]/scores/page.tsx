'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight, Save, CheckCircle2, Loader2, AlertCircle,
  BarChart2, Users, TrendingUp,
} from 'lucide-react';
import { Header } from '@/components/landing/Header';

interface Phase1Form {
  epr: string; apt: string; b5: string; sjt: string; cbi: string;
}
interface Form360 {
  score: string; provider: string;
}

const PHASE1_FIELDS = [
  { key: 'epr', label: 'EPR — Evidence Portfolio Review', max: 5, weight: '5%' },
  { key: 'apt', label: 'APT — Aptitude Test', max: 5, weight: '5%' },
  { key: 'b5',  label: 'B5 — Big-5 Personality', max: 5, weight: '5%' },
  { key: 'sjt', label: 'SJT — Situational Judgment Test', max: 10, weight: '10%' },
  { key: 'cbi', label: 'CBI — Competency-Based Interview', max: 15, weight: '15%' },
] as const;

export default function CandidateScoresPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [p1, setP1] = useState<Phase1Form>({ epr: '', apt: '', b5: '', sjt: '', cbi: '' });
  const [s360, setS360] = useState<Form360>({ score: '', provider: 'LEVID 360' });

  useEffect(() => {
    fetch(`/api/candidates/${id}`)
      .then(r => r.json())
      .then(({ data }) => {
        setCandidate(data);
        if (data?.phase1_scores?.[0]) {
          const s = data.phase1_scores[0];
          setP1({
            epr: s.epr ?? '', apt: s.apt ?? '', b5: s.b5 ?? '',
            sjt: s.sjt ?? '', cbi: s.cbi ?? '',
          });
        }
        if (data?.assessment_360?.[0]) {
          const s = data.assessment_360[0];
          setS360({ score: s.score ?? '', provider: s.provider ?? 'LEVID 360' });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const p1Total = PHASE1_FIELDS.reduce((sum, f) => sum + (parseFloat(p1[f.key]) || 0), 0);
  const eiPreview = p1Total > 0 || s360.score
    ? (
        p1Total +
        (parseFloat(s360.score) / 100) * 10
      ).toFixed(1)
    : null;

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/phase1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidate_id: id,
            epr: parseFloat(p1.epr) || 0,
            apt: parseFloat(p1.apt) || 0,
            b5: parseFloat(p1.b5) || 0,
            sjt: parseFloat(p1.sjt) || 0,
            cbi: parseFloat(p1.cbi) || 0,
          }),
        }),
        s360.score
          ? fetch('/api/assessment360', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                candidate_id: id,
                score: parseFloat(s360.score),
                provider: s360.provider,
              }),
            })
          : Promise.resolve({ ok: true }),
      ]);
      if (!r1.ok) throw new Error('خطأ في حفظ Phase 1');
      setMsg({ type: 'success', text: 'تم الحفظ بنجاح ✓' });
      setTimeout(() => router.push(`/dashboard/candidates/${id}`), 1200);
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">

        <Link href={`/dashboard/candidates/${id}`}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition w-fit">
          <ArrowRight className="w-4 h-4" />
          <span className="text-sm">العودة لملف المرشح</span>
        </Link>

        {/* Candidate Header */}
        {candidate && (
          <div className="glass-crystal rounded-2xl p-5 mb-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg">
                {candidate.name?.[0]}
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">{candidate.name}</h1>
                <p className="text-white/40 text-sm">{candidate.code} · {candidate.organization}</p>
              </div>
              {eiPreview && (
                <div className="mr-auto text-right">
                  <div className="text-white/40 text-xs mb-0.5">EI Preview</div>
                  <div className={`text-2xl font-black tabular-nums ${
                    parseFloat(eiPreview) >= 85 ? 'text-emerald-400'
                    : parseFloat(eiPreview) >= 70 ? 'text-gold-400'
                    : 'text-blue-400'
                  }`}>{eiPreview}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phase 1 */}
        <div className="glass-crystal rounded-2xl p-6 mb-5 border border-white/10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-bold">المرحلة الأولى — Outsource (40%)</h2>
              <p className="text-white/40 text-xs">البيانات من الجهة المنفّذة خارجياً</p>
            </div>
            <div className="mr-auto text-right">
              <div className="text-white/40 text-xs">الإجمالي</div>
              <div className={`text-xl font-bold tabular-nums ${p1Total > 0 ? 'text-amber-400' : 'text-white/20'}`}>
                {p1Total.toFixed(1)} / 40
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {PHASE1_FIELDS.map(f => (
              <div key={f.key} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-white/60 text-sm mb-1">
                    {f.label}
                    <span className="text-white/30 text-xs mr-2">({f.weight} · max {f.max})</span>
                  </label>
                </div>
                <input
                  type="number"
                  min={0}
                  max={f.max}
                  step={0.1}
                  value={p1[f.key]}
                  onChange={e => setP1(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={`0 – ${f.max}`}
                  className="w-28 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-center text-sm font-bold focus:outline-none focus:border-gold-400/50 tabular-nums"
                />
                {/* Mini bar */}
                <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-gold-400 transition-all"
                    style={{ width: `${Math.min(((parseFloat(p1[f.key]) || 0) / f.max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 360 */}
        <div className="glass-crystal rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-bold">تقييم 360° — LEVID (10%)</h2>
              <p className="text-white/40 text-xs">درجة مجمّعة من جهة LEVID 360</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-1">الدرجة (0–100)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={s360.score}
                onChange={e => setS360(prev => ({ ...prev, score: e.target.value }))}
                placeholder="0 – 100"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center text-lg font-bold focus:outline-none focus:border-purple-400/50 tabular-nums"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1">المزود</label>
              <input
                type="text"
                value={s360.provider}
                onChange={e => setS360(prev => ({ ...prev, provider: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400/50"
              />
            </div>
          </div>
          {s360.score && (
            <div className="mt-3 flex items-center gap-2 text-sm text-purple-400">
              <TrendingUp className="w-4 h-4" />
              <span>مساهمة في EI: {((parseFloat(s360.score) / 100) * 10).toFixed(1)} نقطة</span>
            </div>
          )}
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-bold hover:opacity-90 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            حفظ البيانات
          </button>

          {msg && (
            <span className={`flex items-center gap-2 text-sm font-medium ${
              msg.type === 'success' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {msg.type === 'success'
                ? <CheckCircle2 className="w-4 h-4" />
                : <AlertCircle className="w-4 h-4" />}
              {msg.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
