'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, Target, Building2, Crown } from 'lucide-react';

function useIsLight() {
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    const check = () => setIsLight(document.documentElement.classList.contains('light-mode'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isLight;
}

const EIRadarChart = dynamic(
  () => import('./EIRadarChart').then((mod) => mod.EIRadarChart),
  { ssr: false, loading: () => <div className="w-80 h-80 rounded-full bg-gradient-to-br from-gold-500/20 to-transparent animate-pulse" /> }
);

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="relative max-w-7xl mx-auto px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Award Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-600/10 border border-gold-500/30 text-gold-400 text-sm backdrop-blur-sm">
              <Crown className="w-4 h-4" />
              <span>جائزة مصر للتميز الحكومي · الدورة الثانية</span>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                فئة التميز
                <span className="bg-gradient-to-r from-gold-400 to-amber-300 bg-clip-text text-transparent"> الفردي</span>
              </h1>
              <p className="text-xl text-white/60 leading-relaxed max-w-xl">
                نظام تقييم شامل لقياس الأداء الفردي المتميز في الجهاز الإداري للدولة
              </p>
            </div>

            {/* Award Details */}
            <div className="glass-crystal rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-gold-400">
                <Building2 className="w-5 h-5" />
                <span className="font-bold">عن الجائزة</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                جائزة مصر للتميز الحكومي تُمنح للعاملين المتميزين في الجهاز الإداري للدولة 
                الذين أسهموا بشكل فعّال في تحسين الأداء الحكومي وتقديم خدمات متميزة للمواطنين.
                تتكون من <span className="text-gold-400 font-bold">9 أدوات تقييم</span> موزعة على 
                <span className="text-gold-400 font-bold"> مرحلتين</span>:
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white/70">6 أدوات Outsource (50%)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  <span className="text-white/70">3 أدوات Platform (50%)</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Users, label: 'مرشح', value: '150+' },
                { icon: Target, label: 'مقيّم', value: '65' },
                { icon: TrendingUp, label: 'تقييم مكتمل', value: '85' },
              ].map((stat) => (
                <div key={stat.label} className="glass-strong rounded-xl p-4 text-center hover:bg-white/5 transition-colors">
                  <stat.icon className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="#tools"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-bold hover:from-gold-400 hover:to-amber-400 transition-all shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40"
              >
                استعراض أدوات التقييم
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass text-white font-bold hover:bg-white/10 transition-all border border-white/20"
              >
                دخول المقيّمين
              </Link>
            </div>
          </div>

          {/* Right: Radar Chart Preview */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/30 to-emerald-500/30 blur-3xl rounded-full" />
              
              {/* Chart Container — always dark, premium look */}
              <div
                className="relative rounded-3xl p-8"
                style={{
                  background: 'linear-gradient(145deg, #1a2540 0%, #0f172a 60%, #111827 100%)',
                  border: '1.5px solid rgba(212,160,23,0.45)',
                  boxShadow: '0 0 0 1px rgba(212,160,23,0.1), 0 20px 60px rgba(0,0,0,0.45), 0 0 40px rgba(212,160,23,0.08)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* EI Score badge */}
                <div
                  className="absolute -top-4 -right-4 px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#d4a017,#f59e0b)', color: '#0f172a' }}
                >
                  EI Score
                </div>

                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,160,23,0.08) 0%, transparent 70%)' }} />

                <EIRadarChart />

                <div className="mt-6 text-center">
                  <div className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>Excellence Index</div>
                  <div className="text-5xl font-bold" style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    86.0
                  </div>
                  <div className="text-sm mt-2 font-semibold" style={{ color: '#34d399' }}>مستوى: استثنائي</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
