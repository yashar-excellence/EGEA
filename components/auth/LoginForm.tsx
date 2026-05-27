'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('البريد أو كلمة المرور غير صحيحة');
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl glass-strong">
      <h1 className="text-2xl font-bold text-white text-center mb-6">
        تسجيل الدخول
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/70 text-sm mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400"
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
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold-400"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gold-500 text-slate-950 font-bold hover:bg-gold-400 transition disabled:opacity-50"
        >
          {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>

      <div className="mt-6 p-4 rounded-lg bg-white/5 text-xs text-white/50">
        <p className="font-medium mb-2">حسابات تجريبية:</p>
        <p>admin@egea.gov.eg / admin123</p>
        <p>assessor@egea.gov.eg / assessor123</p>
      </div>
    </div>
  );
}
