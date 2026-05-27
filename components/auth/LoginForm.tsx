'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2 } from 'lucide-react';
import { LogoSmall } from '@/components/Logo';

const quickLogins = [
  { label: 'مدير النظام', email: 'admin@egea.gov.eg', password: 'admin123', color: 'text-gold-400' },
  { label: 'رئيس المقيّمين', email: 'chief@egea.gov.eg', password: 'chief123', color: 'text-emerald-400' },
  { label: 'مقيّم', email: 'assessor@egea.gov.eg', password: 'assessor123', color: 'text-blue-400' },
];

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const doLogin = async (e: string, p: string) => {
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { email: e, password: p, redirect: false });
    if (result?.error) {
      setError('البريد أو كلمة المرور غير صحيحة');
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doLogin(email, password);
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <LogoSmall />
      </div>

      <div className="p-8 rounded-2xl glass-crystal border border-white/10">
        <h1 className="text-2xl font-bold text-white text-center mb-2">دخول المقيّمين</h1>
        <p className="text-white/40 text-sm text-center mb-6">منصة التميز الحكومي المصري</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-white/70 text-sm mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400 transition"
              placeholder="admin@egea.gov.eg"
              required
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400 transition"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        {/* Quick Login */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/30 text-xs text-center mb-3">دخول سريع (تجريبي)</p>
          <div className="grid grid-cols-3 gap-2">
            {quickLogins.map((q) => (
              <button
                key={q.email}
                onClick={() => doLogin(q.email, q.password)}
                disabled={loading}
                className="py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-center disabled:opacity-50"
              >
                <span className={`text-xs font-bold ${q.color}`}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
