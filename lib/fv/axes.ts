export interface FVArea {
  id: string;
  nameAr: string;
  nameEn: string;
  weight: number;
  description: string;
  rubric: { score: number; labelAr: string; descriptionAr: string }[];
}

export const FV_AREAS: FVArea[] = [
  {
    id: 'planning',
    nameAr: 'التخطيط والإعداد',
    nameEn: 'Planning & Preparation',
    weight: 20,
    description: 'جودة التخطيط والإعداد للمبادرة',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد تخطيط' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'تخطيط ضعيف جداً' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'تخطيط بسيط محدود' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'تخطيط جيد منظم' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'تخطيط ممتاز شامل' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'تخطيط استثنائي مبتكر' },
    ],
  },
  {
    id: 'execution',
    nameAr: 'التنفيذ والإجراءات',
    nameEn: 'Execution & Procedures',
    weight: 20,
    description: 'جودة التنفيذ والإجراءات المتبعة',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد تنفيذ فعلي' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'تنفيذ ضعيف' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'تنفيذ مقبول' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'تنفيذ جيد ومنظم' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'تنفيذ ممتاز فعال' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'تنفيذ استثنائي يُحتذى' },
    ],
  },
  {
    id: 'monitoring',
    nameAr: 'الرصد والتقييم',
    nameEn: 'Monitoring & Evaluation',
    weight: 15,
    description: 'نظام الرصد والتقييم المتابع للمبادرة',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد رصد' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'رصد ضعيف' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'رصد أساسي' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'نظام رصد جيد' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'نظام رصد ممتاز' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'نظام رصد استثنائي متكامل' },
    ],
  },
  {
    id: 'stakeholders',
    nameAr: 'إدارة أصحاب المصلحة',
    nameEn: 'Stakeholder Management',
    weight: 15,
    description: 'إدارة التعامل مع أصحاب المصلحة والمستفيدين',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد تفاعل' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'تفاعل ضعيف' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'تفاعل أساسي' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'تفاعل جيد منظم' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'تفاعل ممتاز فعال' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'تفاعل استثنائي شامل' },
    ],
  },
  {
    id: 'resources',
    nameAr: 'إدارة الموارد',
    nameEn: 'Resource Management',
    weight: 15,
    description: 'إدارة الموارد البشرية والمالية والتقنية',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد إدارة للموارد' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'إدارة ضعيفة' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'إدارة مقبولة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'إدارة جيدة' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'إدارة ممتازة فعالة' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'إدارة استثنائية مُحسّنة' },
    ],
  },
  {
    id: 'documentation',
    nameAr: 'توثيق المعرفة',
    nameEn: 'Knowledge Documentation',
    weight: 10,
    description: 'جودة التوثيق ونقل المعرفة',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد توثيق' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'توثيق ضعيف' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'توثيق أساسي' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'توثيق جيد منظم' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'توثيق ممتاز شامل' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'توثيق استثنائي مُتكامل' },
    ],
  },
  {
    id: 'integrity',
    nameAr: 'النزاهة والحياد',
    nameEn: 'Integrity & Objectivity',
    weight: 5,
    description: 'النزاهة في التعامل والحياد في الأداء',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'مخالفات جسيمة' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'مخالفات أو شكاوى' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'نزاهة مقبولة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'نزاهة جيدة' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'نزاهة عالية' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'نزاهة استثنائية قدوة' },
    ],
  },
];
