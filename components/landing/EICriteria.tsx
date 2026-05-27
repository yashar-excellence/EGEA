'use client';

import { useState } from 'react';
import { Target, Award, TrendingUp, Shield, Lightbulb, Scale, Leaf, Users, CheckCircle2, Info, BarChart2, GitBranch } from 'lucide-react';

const eiCriteria = [
  {
    id: 'EI1', name: 'Category Fit', nameAr: 'ملاءمة الفئة', icon: Target, weight: 10,
    desc: 'الانتماء الوظيفي والقطاعي للمرشح',
    details: 'يقيس مدى انتماء المرشح الوظيفي والقطاعي للفئة المتقدم إليها. يتحقق من أن الإنجازات المقدمة تعكس طبيعة الدور الفعلي.',
    tools: ['EPR', 'CBI', 'FV'],
    color: 'from-amber-500/30 to-yellow-600/10',
  },
  {
    id: 'EI2', name: 'Beyond Routine', nameAr: 'ما وراء الروتين', icon: Award, weight: 15,
    desc: 'إنجازات تتجاوز المهام الروتينية',
    details: 'يقيس قدرة المرشح على تقديم إنجازات استثنائية تتخطى حدود المهام اليومية المعتادة وتُظهر قيمة مضافة حقيقية.',
    tools: ['OJT', 'FEP', 'CBI'],
    color: 'from-gold-500/30 to-amber-600/10',
  },
  {
    id: 'EI3', name: 'Measurable Impact', nameAr: 'أثر قابل للقياس', icon: TrendingUp, weight: 15,
    desc: 'نتائج ملموسة بمؤشرات كمية',
    details: 'يتحقق من أن نتائج المرشح قابلة للقياس الكمي والنوعي بمؤشرات واضحة وموثقة تعكس الأثر الفعلي على الجهة والمواطن.',
    tools: ['EPR', 'FV', 'FEP'],
    color: 'from-emerald-500/30 to-green-600/10',
  },
  {
    id: 'EI4', name: 'Ownership', nameAr: 'المسؤولية والملكية', icon: Shield, weight: 10,
    desc: 'الإحساس بالملكية والمسؤولية',
    details: 'يقيس مدى تحمل المرشح للمسؤولية الكاملة عن إنجازاته وقراراته دون تحويل المسؤولية للآخرين، مع إظهار ملكية حقيقية للعمل.',
    tools: ['CBI', 'OJT', '360°'],
    color: 'from-blue-500/30 to-cyan-600/10',
  },
  {
    id: 'EI5', name: 'Strategic Value', nameAr: 'القيمة الاستراتيجية', icon: Lightbulb, weight: 15,
    desc: 'الاندماج مع الأهداف الاستراتيجية',
    details: 'يقيس مدى ارتباط إنجازات المرشح بالأهداف الاستراتيجية للجهة والدولة، وكيفية مساهمته في رؤية مصر 2030.',
    tools: ['FEP', 'FV', 'EPR'],
    color: 'from-purple-500/30 to-violet-600/10',
  },
  {
    id: 'EI6', name: 'Integrity/Governance', nameAr: 'النزاهة والحوكمة', icon: Scale, weight: 10,
    desc: 'الامتثال والنزاهة في الأداء',
    details: 'يتحقق من التزام المرشح بمعايير النزاهة والحوكمة الرشيدة في جميع تصرفاته وقراراته. درجة أقل من 70 تستوجب مراجعة إلزامية.',
    tools: ['CBI', '360°', 'FV'],
    color: 'from-rose-500/30 to-red-600/10',
    gate: 'Integrity < 70 → مراجعة إلزامية',
  },
  {
    id: 'EI7', name: 'Sustainability', nameAr: 'الاستدامة', icon: Leaf, weight: 10,
    desc: 'استمرارية الأثر والنتائج',
    details: 'يقيس مدى استدامة الأثر الذي أحدثه المرشح، وهل النتائج التي حققها مستمرة ومتجذرة أم مؤقتة.',
    tools: ['FV', 'EPR'],
    color: 'from-teal-500/30 to-emerald-600/10',
  },
  {
    id: 'EI8', name: 'Multi-Source Validation', nameAr: 'التحقق متعدد المصادر', icon: Users, weight: 10,
    desc: 'تأكيد من مصادر متعددة',
    details: 'يضمن توافق نتائج المرشح عبر مصادر تقييم متعددة ومستقلة: المقيّمون، الرؤساء، الزملاء، والمرؤوسون.',
    tools: ['360°', 'OJT', 'FEP', 'FV'],
    color: 'from-indigo-500/30 to-blue-600/10',
  },
  {
    id: 'EI9', name: 'Tool Consistency', nameAr: 'اتساق الأدوات', icon: CheckCircle2, weight: 5,
    desc: 'اتساق النتائج عبر الأدوات',
    details: 'يقيس مدى تناسق وتوافق النتائج عبر الأدوات المختلفة للتقييم. التباين الكبير قد يشير إلى تحيز أو عدم موثوقية.',
    tools: ['جميع الأدوات'],
    color: 'from-orange-500/30 to-amber-600/10',
  },
];

const competencies = [
  { id: 'C1', name: 'الإلهام والتأثير', desc: 'Influence & Inspiration', detail: 'القدرة على تحفيز الآخرين وإلهامهم نحو تحقيق أهداف مشتركة', tools: ['CBI', '360°'], weight: 10 },
  { id: 'C2', name: 'التحليل الاستراتيجي', desc: 'Strategic Analysis', detail: 'تحليل البيئة الداخلية والخارجية واتخاذ قرارات مبنية على بيانات', tools: ['SJT', 'FEP'], weight: 10 },
  { id: 'C3', name: 'إدارة العلاقات', desc: 'Relationship Management', detail: 'بناء شبكة علاقات فعّالة مع أصحاب المصلحة داخلياً وخارجياً', tools: ['360°', 'FV'], weight: 8 },
  { id: 'C4', name: 'التفكير الابتكاري', desc: 'Innovative Thinking', detail: 'القدرة على توليد أفكار جديدة وإيجاد حلول مبتكرة للتحديات', tools: ['SJT', 'OJT'], weight: 9 },
  { id: 'C5', name: 'التواصل الفعّال', desc: 'Effective Communication', detail: 'التعبير الواضح والمقنع شفهياً وكتابياً مع مختلف الجهات', tools: ['FEP', 'CBI'], weight: 8 },
  { id: 'C6', name: 'قيادة التغيير', desc: 'Change Leadership', detail: 'قيادة مبادرات التحول المؤسسي وإدارة مقاومة التغيير', tools: ['OJT', 'FV'], weight: 9 },
  { id: 'C7', name: 'التركيز على النتائج', desc: 'Results Focus', detail: 'التوجه نحو تحقيق الأهداف بكفاءة وفاعلية مع قياس الإنجاز', tools: ['EPR', 'OJT'], weight: 10 },
  { id: 'C8', name: 'التخطيط والتنظيم', desc: 'Planning & Organization', detail: 'وضع خطط عمل واضحة وتوزيع الموارد بشكل أمثل لتحقيق الأهداف', tools: ['FEP', 'SJT'], weight: 8 },
  { id: 'C9', name: 'التطوير المستمر', desc: 'Continuous Development', detail: 'الالتزام بالتعلم المستمر وتطوير الكفاءات الذاتية والمؤسسية', tools: ['360°', 'B5'], weight: 7 },
  { id: 'C10', name: 'اتخاذ القرار', desc: 'Decision Making', detail: 'اتخاذ قرارات سليمة وسريعة في ظل ضغط الوقت وعدم اليقين', tools: ['SJT', 'CBI'], weight: 9 },
  { id: 'C11', name: 'النزاهة والموثوقية', desc: 'Integrity & Reliability', detail: 'الالتزام بأعلى معايير الأخلاق المهنية والنزاهة في جميع الأحوال', tools: ['360°', 'CBI', 'FV'], weight: 6 },
  { id: 'C12', name: 'خدمة المواطن', desc: 'Citizen Service', detail: 'التوجه الحقيقي نحو تحسين حياة المواطن وتقديم خدمة حكومية استثنائية', tools: ['FV', 'EPR'], weight: 6 },
];

export function EICriteria() {
  const [hoveredEI, setHoveredEI] = useState<string | null>(null);
  const [hoveredComp, setHoveredComp] = useState<string | null>(null);

  const activeEI = eiCriteria.find(c => c.id === hoveredEI);
  const activeComp = competencies.find(c => c.id === hoveredComp);

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
          <p className="text-white/60 text-lg max-w-3xl mx-auto">9 معايير للتميز الفردي + 12 جدارة أساسية</p>
        </div>

        {/* EI Criteria Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">معايير Excellence Index</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eiCriteria.map((criteria) => (
              <div
                key={criteria.id}
                className="relative group glass-crystal rounded-2xl p-5 cursor-pointer transition-all duration-300 border border-gold-500/20 hover:border-gold-500/50 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold-500/10"
                onMouseEnter={() => setHoveredEI(criteria.id)}
                onMouseLeave={() => setHoveredEI(null)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${criteria.color} flex items-center justify-center shrink-0`}>
                    <criteria.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gold-400 font-bold text-xs bg-gold-500/10 px-2 py-0.5 rounded-full">{criteria.id}</span>
                        <h4 className="text-white font-bold text-sm">{criteria.nameAr}</h4>
                      </div>
                      <span className="text-gold-400 font-bold text-sm shrink-0">{criteria.weight}%</span>
                    </div>
                    <p className="text-gold-400/60 text-xs mb-1">{criteria.name}</p>
                    <p className="text-white/50 text-xs">{criteria.desc}</p>
                    {/* Weight bar */}
                    <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-amber-400 transition-all duration-500"
                        style={{ width: `${(criteria.weight / 15) * 100}%` }} />
                    </div>
                  </div>
                </div>
                {/* Info icon */}
                <Info className="absolute top-3 left-3 w-3.5 h-3.5 text-white/20 group-hover:text-gold-400/60 transition-colors" />

                {/* Hover Tooltip Panel */}
                {hoveredEI === criteria.id && (
                  <div className="absolute z-50 bottom-full right-0 mb-3 w-80 pointer-events-none">
                    <div data-tooltip-panel className="bg-slate-900 border border-gold-500/40 rounded-2xl p-5 shadow-2xl shadow-black/60">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${criteria.color} flex items-center justify-center`}>
                          <criteria.icon className="w-5 h-5 text-gold-400" />
                        </div>
                        <div>
                          <div className="text-white font-bold">{criteria.nameAr}</div>
                          <div className="text-gold-400/70 text-xs">{criteria.name} · وزن {criteria.weight}%</div>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed mb-3">{criteria.details}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {criteria.tools.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30">{t}</span>
                        ))}
                      </div>
                      {criteria.gate && (
                        <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                          ⚠️ {criteria.gate}
                        </div>
                      )}
                      {/* Weight visualization */}
                      <div className="mt-3 flex items-center gap-2">
                        <BarChart2 className="w-3.5 h-3.5 text-gold-400/60" />
                        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-amber-400"
                            style={{ width: `${(criteria.weight / 15) * 100}%` }} />
                        </div>
                        <span className="text-gold-400 text-xs font-bold">{criteria.weight}%</span>
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-slate-900 border-r border-b border-gold-500/40 rotate-45 absolute -bottom-1.5 right-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Competencies */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">الجدارات الـ 12 (C1-C12)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {competencies.map((comp) => (
              <div
                key={comp.id}
                className="relative group glass rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/5 hover:border-gold-500/30 hover:scale-[1.03] hover:shadow-lg hover:shadow-gold-500/10"
                onMouseEnter={() => setHoveredComp(comp.id)}
                onMouseLeave={() => setHoveredComp(null)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {comp.id}
                  </span>
                  <h4 className="text-white font-bold text-sm leading-tight">{comp.name}</h4>
                </div>
                <p className="text-white/40 text-xs">{comp.desc}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden mr-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-gold-500/60 to-amber-400/60"
                      style={{ width: `${(comp.weight / 10) * 100}%` }} />
                  </div>
                  <span className="text-white/30 text-[10px]">{comp.weight}%</span>
                </div>

                {/* Hover Tooltip */}
                {hoveredComp === comp.id && (
                  <div className="absolute z-50 bottom-full right-0 mb-3 w-72 pointer-events-none">
                    <div data-tooltip-panel className="bg-slate-900 border border-gold-500/30 rounded-2xl p-4 shadow-2xl shadow-black/60">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">{comp.id}</span>
                        <div>
                          <div className="text-white font-bold text-sm">{comp.name}</div>
                          <div className="text-gold-400/60 text-xs">{comp.desc}</div>
                        </div>
                      </div>
                      <p className="text-white/70 text-xs leading-relaxed mb-3">{comp.detail}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {comp.tools.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <GitBranch className="w-3 h-3 text-gold-400/50" />
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-amber-400"
                            style={{ width: `${(comp.weight / 10) * 100}%` }} />
                        </div>
                        <span className="text-gold-400 text-xs">{comp.weight}%</span>
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-slate-900 border-r border-b border-gold-500/30 rotate-45 absolute -bottom-1.5 right-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gate Rules */}
        <div className="mt-16 glass-crystal rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 text-center">قواعد Gate (ضوابط التقييم)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <div>
                  <span className="text-red-400 font-bold">FV {'<'} 60</span>
                  <p className="text-white/50 text-sm mt-0.5">تقييم "يحتاج مراجعة" كحد أقصى</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                <div>
                  <span className="text-orange-400 font-bold">Integrity {'<'} 70</span>
                  <p className="text-white/50 text-sm mt-0.5">مراجعة إلزامية</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <span className="text-emerald-400 font-bold">EI {'≥'} 85</span>
                  <p className="text-white/50 text-sm mt-0.5">موصى به بقوة</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gold-500/5 border border-gold-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-gold-500 mt-1.5 shrink-0" />
                <div>
                  <span className="text-gold-400 font-bold">70 {'≤'} EI {'<'} 85</span>
                  <p className="text-white/50 text-sm mt-0.5">موصى به مع ملاحظات</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
