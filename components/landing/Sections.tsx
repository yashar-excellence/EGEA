'use client';

import Link from 'next/link';
import { ClipboardCheck, MapPin, Presentation, Award, ExternalLink, Sparkles, Cloud, Laptop, CheckCircle2 } from 'lucide-react';

// Phase 1: OUTSOURCE TOOLS (40%)
const phase1Tools = [
  { id: 'epr', name: 'مراجعة محفظة الأدلة', nameEn: 'Evidence Portfolio Review', weight: 5, icon: Award, desc: 'تقييم الأدلة المؤيدة للإنجازات المقدمة', provider: 'مركز تقييم معتمد' },
  { id: 'apt', name: 'اختبار القدرات', nameEn: 'Aptitude Test', weight: 5, icon: ClipboardCheck, desc: 'قياس القدرات العقلية والمعرفية', provider: 'مركز تقييم معتمد' },
  { id: 'b5', name: 'تقييم الشخصية (Big-5)', nameEn: 'Big-5 Personality', weight: 5, icon: ClipboardCheck, desc: 'تحليل السمات الشخصية والسلوكية', provider: 'مركز تقييم معتمد' },
  { id: 'sjt', name: 'اختبار الحكم الموقفي', nameEn: 'Situational Judgement', weight: 10, icon: ClipboardCheck, desc: 'تقييم اتخاذ القرارات في مواقف العمل', provider: 'مركز تقييم معتمد' },
  { id: 'cbi', name: 'المقابلة المعتمدة على الجدارات', nameEn: 'Competency-Based Interview', weight: 15, icon: ClipboardCheck, desc: 'مقابلة تنظيمية لقياس 12 جدارة', provider: 'مقابلات CBI' },
];

// Phase 2: Mixed Outsource + Platform (60%)
const phase2Tools = [
  { id: '360', name: 'تقييم 360 درجة', nameEn: '360-Degree Assessment', weight: 10, icon: Award, desc: 'تقييم متعدد المصادر', outsource: true, provider: 'LEVID 360' },
  { id: 'ojt', name: 'تقييم الأداء الفعلي (OJT)', nameEn: 'On-the-Job Virtual', weight: 10, icon: ClipboardCheck, desc: '3 إنجازات × 8 محاور', platform: true, href: '/ojt' },
  { id: 'fep', name: 'العرض النهائي للتميز (FEP)', nameEn: 'Final Excellence Presentation', weight: 15, icon: Presentation, desc: 'عرض نهائي أمام لجنة التقييم', platform: true, href: '/fep' },
  { id: 'fv', name: 'الزيارة الميدانية (FV)', nameEn: 'Field Visit Assessment', weight: 25, icon: MapPin, desc: 'زيارة ميدانية + Checklist', platform: true, href: '/fv' },
];

export function LandingSections() {
  return (
    <section id="tools" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>بطارية التقييم المتكاملة</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">أدوات تقييم EGEA</h2>
          <p className="text-white/60 text-lg max-w-3xl mx-auto">
            9 أدوات تقييم: <span className="text-emerald-400 font-bold">Outsource (50%)</span> + <span className="text-gold-400 font-bold">Platform (50%)</span>
          </p>
        </div>

        {/* Phase 1: Outsource (40%) */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 px-6 py-4 rounded-2xl border border-emerald-500/30">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Cloud className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">المرحلة الأولى</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-emerald-400 font-bold text-lg">Outsource</span>
                  <span className="text-white/50">|</span>
                  <span className="text-emerald-400 font-bold">40%</span>
                </div>
              </div>
            </div>
            <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          </div>
          
          <p className="text-center text-white/50 mb-8 max-w-2xl mx-auto">
            <span className="text-emerald-400 font-bold">ملاحظة:</span> تقييم خارجي من <span className="text-white font-bold">مراكز معتمدة</span>
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phase1Tools.map((tool, index) => (
              <div key={tool.id} className="group glass-crystal rounded-2xl p-6 hover:bg-emerald-500/5 transition-all border border-emerald-500/20 hover:border-emerald-500/40">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/10 flex items-center justify-center">
                    <tool.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">
                    {tool.weight}%
                  </span>
                </div>
                <h4 className="text-white font-bold text-lg mb-1">{tool.name}</h4>
                <p className="text-emerald-400/70 text-xs mb-2">{tool.nameEn}</p>
                <p className="text-white/60 text-sm">{tool.desc}</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs">
                    <Cloud className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400/80">{tool.provider}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 2: Mixed (60%) */}
        <div>
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <div className="flex items-center gap-4 bg-gradient-to-r from-gold-500/20 to-amber-600/10 px-6 py-4 rounded-2xl border border-gold-500/30">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
                <Laptop className="w-7 h-7 text-slate-950" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">المرحلة الثانية</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gold-400 font-bold text-lg">Mixed</span>
                  <span className="text-white/50">|</span>
                  <span className="text-gold-400 font-bold">60%</span>
                </div>
              </div>
            </div>
            <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          </div>
          
          <p className="text-center text-white/50 mb-8 max-w-2xl mx-auto">
            <span className="text-gold-400 font-bold">360° Outsource</span> + <span className="text-white font-bold">3 أدوات Platform</span>
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phase2Tools.map((tool, index) => (
              <div key={tool.id} className={`group rounded-2xl p-6 transition-all ${tool.href ? 'glass-crystal hover:bg-gold-500/5 border border-gold-500/20' : 'glass border border-emerald-500/20'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${tool.outsource ? 'bg-gradient-to-br from-emerald-500/30 to-emerald-600/10' : 'bg-gradient-to-br from-gold-500/30 to-amber-600/10'}`}>
                    <tool.icon className={`w-7 h-7 ${tool.outsource ? 'text-emerald-400' : 'text-gold-400'}`} />
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${tool.outsource ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-gold-500/20 text-gold-400 border-gold-500/30'}`}>
                    {tool.weight}%
                  </span>
                </div>
                <h4 className="text-white font-bold text-lg mb-1">{tool.name}</h4>
                <p className={`text-xs mb-2 ${tool.outsource ? 'text-emerald-400/70' : 'text-gold-400/70'}`}>{tool.nameEn}</p>
                <p className="text-white/60 text-sm">{tool.desc}</p>
                
                {tool.href && (
                  <Link href={tool.href} className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-gold-400 hover:text-gold-300">
                    <span className="text-sm font-bold">فتح الأداة</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
                
                {tool.outsource && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs">
                      <Cloud className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400/80">{tool.provider}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-16 glass-crystal rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">ملخص التقييم</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">6</div>
              <div className="text-white/70">أدوات Outsource</div>
              <div className="text-emerald-400/70 text-sm">50%</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold-400 mb-2">3</div>
              <div className="text-white/70">أدوات Platform</div>
              <div className="text-gold-400/70 text-sm">50%</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100</div>
              <div className="text-white/70">الدرجة الكلية</div>
              <div className="text-white/50 text-sm">100% EI</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
