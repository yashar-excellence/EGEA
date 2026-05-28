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

// ── System Roles Section ───────────────────────────────────────
const roles = [
  {
    icon: '🛡️', title: 'مدير النظام', titleEn: 'System Admin',
    color: 'from-gold-500/20 to-gold-600/5', border: 'border-gold-500/30', badge: 'text-gold-400 bg-gold-500/15',
    perms: ['إدارة المرشحين كاملاً', 'استيراد بيانات Phase 1 و360°', 'متابعة كل مراحل التقييم', 'الوصول لكل التقارير'],
    login: 'admin@egea.gov.eg',
  },
  {
    icon: '👑', title: 'رئيس المقيّمين', titleEn: 'Chief Assessor',
    color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/30', badge: 'text-emerald-400 bg-emerald-500/15',
    perms: ['مراجعة تقييمات الفريق', 'متابعة التقدم الكلي', 'الاطلاع على النتائج'],
    login: 'chief@egea.gov.eg',
  },
  {
    icon: '📋', title: 'المقيّم', titleEn: 'Assessor',
    color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/30', badge: 'text-blue-400 bg-blue-500/15',
    perms: ['تقييم OJT للمرشحين', 'إجراء FEP و FV', 'حفظ ورفع التقييمات'],
    login: 'assessor@egea.gov.eg',
  },
  {
    icon: '🏆', title: 'هيئة الجائزة', titleEn: 'Award Committee',
    color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/30', badge: 'text-purple-400 bg-purple-500/15',
    perms: ['عرض النتائج النهائية', 'ترتيب المرشحين بـ EI Score', 'طباعة تقارير رسمية'],
    login: 'award@egea.gov.eg',
  },
];

export function SystemRolesSection() {
  return (
    <section id="roles" className="py-24 relative bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-white/70 text-sm mb-6">
            <Laptop className="w-4 h-4" />
            <span>هيكل الصلاحيات</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">أدوار المنصة</h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            كل دور له بيئة عمل مخصصة وصلاحيات محددة لضمان أمان وكفاءة عملية التقييم
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {roles.map(r => (
            <div key={r.title} className={`glass-crystal rounded-2xl p-5 border ${r.border} bg-gradient-to-br ${r.color} flex flex-col`}>
              <div className="text-3xl mb-3">{r.icon}</div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit mb-3 ${r.badge}`}>{r.titleEn}</div>
              <h3 className="text-white font-bold text-lg mb-3">{r.title}</h3>
              <ul className="space-y-2 flex-1">
                {r.perms.map(p => (
                  <li key={p} className="flex items-start gap-2 text-white/60 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-white/25 text-xs font-mono">{r.login}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow */}
        <div className="glass-crystal rounded-2xl p-8 border border-white/10">
          <h3 className="text-xl font-bold text-white text-center mb-8">مسار التقييم الكامل</h3>
          <div className="flex flex-wrap items-center justify-center gap-0">
            {[
              { step: '١', label: 'تسجيل المرشحين', sub: 'Admin / Import CSV', color: 'bg-gold-500' },
              { step: '٢', label: 'Phase 1 Outsource', sub: 'EPR+APT+B5+SJT+CBI', color: 'bg-emerald-500' },
              { step: '٣', label: 'تقييم 360°', sub: 'LEVID 360', color: 'bg-purple-500' },
              { step: '٤', label: 'OJT + FEP + FV', sub: 'Platform أدوات', color: 'bg-blue-500' },
              { step: '٥', label: 'EI Score النهائي', sub: 'Excellence Index /100', color: 'bg-amber-500' },
              { step: '٦', label: 'تقرير الجائزة', sub: 'هيئة الجائزة', color: 'bg-rose-500' },
            ].map((s, i, arr) => (
              <div key={s.step} className="flex items-center">
                <div className="flex flex-col items-center text-center px-2">
                  <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center text-white font-bold text-sm mb-2`}>
                    {s.step}
                  </div>
                  <span className="text-white/80 text-xs font-bold w-20 leading-tight">{s.label}</span>
                  <span className="text-white/30 text-xs mt-1 w-20 leading-tight">{s.sub}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-8 h-px bg-white/20 mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
