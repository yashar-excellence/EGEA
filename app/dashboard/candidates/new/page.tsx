'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { Header } from '@/components/landing/Header';

export default function NewCandidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    code: '', name: '', role: '', organization: '',
    category: 'individual', level: 'director', cycle: '2025',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/dashboard/candidates/${data.data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder = '' }: { label: string; name: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-white/70 text-sm mb-2">{label}</label>
      <input
        type={type}
        value={form[name as keyof typeof form]}
        onChange={e => set(name, e.target.value)}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400 transition"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition w-fit">
          <ArrowRight className="w-4 h-4" /><span className="text-sm">العودة</span>
        </Link>

        <div className="glass-crystal rounded-2xl p-8 border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-gold-400" /> إضافة مرشح جديد
          </h1>

          {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="كود المرشح" name="code" placeholder="EG-2025-001" />
              <Field label="الاسم الكامل" name="name" placeholder="أحمد محمد علي" />
            </div>
            <Field label="الوظيفة الحالية" name="role" placeholder="مدير إدارة" />
            <Field label="الجهة / الوزارة" name="organization" placeholder="وزارة التنمية المحلية" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">الفئة</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-400">
                  <option value="individual">فردي</option>
                  <option value="team">فريق</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">المستوى</label>
                <select value={form.level} onChange={e => set('level', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-400">
                  <option value="director">مدير</option>
                  <option value="manager">مدير عام</option>
                  <option value="specialist">متخصص</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">الدورة</label>
                <select value={form.cycle} onChange={e => set('cycle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-400">
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              {loading ? 'جاري الحفظ...' : 'إضافة المرشح'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
