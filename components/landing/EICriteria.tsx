'use client';

import { Target, Award, TrendingUp, Shield, Lightbulb, Scale, Leaf, Users, CheckCircle2 } from 'lucide-react';

const eiCriteria = [
  { id: 'EI1', name: 'Category Fit', nameAr: 'ملاءمة الفئة', desc: 'الانتماء الوظيفي والقطاعي للمرشح', icon: Target },
  { id: 'EI2', name: 'Beyond Routine', nameAr: 'ما وراء الروتين', desc: 'إنجازات تتجاوز المهام الروتينية', icon: Award },
  { id: 'EI3', name: 'Measurable Impact', nameAr: 'أثر قابل للقياس', desc: 'نتائج ملموسة بمؤشرات كمية', icon: TrendingUp },
  { id: 'EI4', name: 'Ownership', nameAr: 'المسؤولية والملكية', desc: 'الإحساس بالملكية والمسؤولية', icon: Shield },
  { id: 'EI5', name: 'Strategic Value', nameAr: 'القيمة الاستراتيجية', desc: 'الاندماج مع الأهداف الاستراتيجية', icon: Lightbulb },
  { id: 'EI6', name: 'Integrity/Governance', nameAr: 'النزاهة والحوكمة', desc: 'الامتثال والنزاهة في الأداء', icon: Scale },
  { id: 'EI7', name: 'Sustainability', nameAr: 'الاستدامة', desc: 'استمرارية الأثر والنتائج', icon: Leaf },
  { id: 'EI8', name: 'Multi-Source Validation', nameAr: 'التحقق متعدد المصادر', desc: 'تأكيد من مصادر متعددة', icon: Users },
  { id: 'EI9', name: 'Tool Consistency', nameAr: 'اتساق الأدوات', desc: 'اتساق النتائج عبر الأدوات', icon: CheckCircle2 },
];

const competencies = [
  { id: 'C1', name: 'الإلهام والتأثير', desc: 'Influence & Inspiration' },
  { id: 'C2', name: 'التحليل الاستراتيجي', desc: 'Strategic Analysis' },
  { id: 'C3', name: 'إدارة العلاقات', desc: 'Relationship Management' },
  { id: 'C4', name: 'التفكير الابتكاري', desc: 'Innovative Thinking' },
  { id: 'C5', name: 'التواصل الفعّال', desc: 'Effective Communication' },
  { id: 'C6', name: 'قيادة التغيير', desc: 'Change Leadership' },
  { id: 'C7', name: 'التركيز على النتائج', desc: 'Results Focus' },
  { id: 'C8', name: 'التخطيط والتنظيم', desc: 'Planning & Organization' },
  { id: 'C9', name: 'التطوير المستمر', desc: 'Continuous Development' },
  { id: 'C10', name: 'اتخاذ القرار', desc: 'Decision Making' },
  { id: 'C11', name: 'النزاهة والموثوقية', desc: 'Integrity & Reliability' },
  { id: 'C12', name: 'خدمة المواطن', desc: 'Citizen Service' },
];

export function EICriteria() {
  return (
    <section id="ei-criteria" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-600/10 border border-gold-500/30 text-gold-400 text-sm mb-6">
            <Target className="w-4 h-4" />
            <span>Excellence Index · مؤشر التميز</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">معايير التميز (EI)</h2>
          <p className="text-white/60 text-lg max-w-3xl mx-auto">
            9 معايير للتميز الفردي + 12 جدارة أساسية
          </p>
        </div>

        {/* EI Criteria Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">معايير Excellence Index</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eiCriteria.map((criteria) => (
              <div key={criteria.id} className="glass-crystal rounded-2xl p-6 hover:bg-gold-500/5 transition-all border border-gold-500/20 hover:border-gold-500/40">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/30 to-amber-600/10 flex items-center justify-center shrink-0">
                    <criteria.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gold-400 font-bold text-sm">{criteria.id}</span>
                      <h4 className="text-white font-bold">{criteria.nameAr}</h4>
                    </div>
                    <p className="text-gold-400/70 text-xs mb-1">{criteria.name}</p>
                    <p className="text-white/50 text-sm">{criteria.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competencies */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">الجدارات الـ 12 (C1-C12)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {competencies.map((comp) => (
              <div key={comp.id} className="glass rounded-xl p-4 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">
                    {comp.id}
                  </span>
                  <h4 className="text-white font-bold text-sm">{comp.name}</h4>
                </div>
                <p className="text-white/40 text-xs">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gate Rules */}
        <div className="mt-16 glass-crystal rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 text-center">قواعد Gate (ضوابط التقييم)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <div>
                  <span className="text-red-400 font-bold">FV {'<'} 60</span>
                  <p className="text-white/50 text-sm">تقييم "يحتاج مراجعة" كحد أقصى</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                <div>
                  <span className="text-orange-400 font-bold">Integrity {'<'} 70</span>
                  <p className="text-white/50 text-sm">مراجعة إلزامية</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                <div>
                  <span className="text-emerald-400 font-bold">EI {'≥'} 85</span>
                  <p className="text-white/50 text-sm">موصى به بقوة</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gold-500 mt-2" />
                <div>
                  <span className="text-gold-400 font-bold">70 {'≤'} EI {'<'} 85</span>
                  <p className="text-white/50 text-sm">موصى به مع ملاحظات</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
