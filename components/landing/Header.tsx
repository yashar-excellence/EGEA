'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, User, LogOut, Settings, ChevronDown, Sun, Moon } from 'lucide-react';
import { LogoLink } from '@/components/Logo';

export function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const user = session?.user;

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setLightMode(true);
      document.documentElement.classList.add('light-mode');
      document.body.style.background = '#FAF6ED';
      document.body.style.color = '#1C150A';
    }
  }, []);

  const applyTheme = (isLight: boolean) => {
    if (isLight) {
      document.documentElement.classList.add('light-mode');
      document.body.style.background = '#FAF6ED';
      document.body.style.color = '#1C150A';
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.body.style.background = '';
      document.body.style.color = '';
      localStorage.setItem('theme', 'dark');
    }
  };

  const toggleTheme = () => {
    const next = !lightMode;
    setLightMode(next);
    applyTheme(next);
  };

  const getDashboardForRole = (role: string) => {
    if (role === 'admin') return '/admin';
    if (role === 'chief_assessor') return '/dashboard/chief';
    if (role === 'assessor') return '/dashboard/assessor';
    return '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <LogoLink />

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg glass hover:bg-white/10 transition text-white/60 hover:text-gold-400"
            title={lightMode ? 'الوضع الداكن' : 'الوضع الفاتح'}
          >
            {lightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {status === 'loading' ? (
            <div className="w-6 h-6 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
          ) : isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 transition"
              >
                <User className="w-5 h-5 text-gold-400" />
                <span className="text-white text-sm">{user.name}</span>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-gold-500/30 rounded-xl shadow-xl z-50 p-2">
                  <div className="px-3 py-2 border-b border-white/10 mb-2">
                    <div className="text-sm font-bold text-white">{user.name}</div>
                    <div className="text-xs text-white/60">{user.email}</div>
                    <div className="text-[10px] text-gold-400 mt-1">{user.role}</div>
                  </div>

                  <Link
                    href={getDashboardForRole(user.role || '')}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm text-white/90"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{user.role === 'admin' ? 'مدير النظام' : 'لوحة التحكم'}</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition text-sm text-red-400 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition"
            >
              <User className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
