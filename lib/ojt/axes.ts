export interface AxisDefinition {
  id: string;
  nameAr: string;
  nameEn: string;
  weight: number;
  description: string;
  competencies: string[];
  rubric: { score: number; labelAr: string; descriptionAr: string }[];
}

export const OJT_AXES: AxisDefinition[] = [
  {
    id: 'scope',
    nameAr: 'نطاق المهمة والمسؤولية',
    nameEn: 'Scope of Task & Responsibility',
    weight: 15,
    description: 'مدى اتساع المهمة وتأثيرها على المؤسسة',
    competencies: ['C1', 'C2', 'C3'],
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد نطاق محدد للمهمة' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'مهمة محدودة جداً بدون تأثير' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'مهمة ضيقة مع تأثير محدود' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'مهمة واضحة مع تأثير متوسط' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'مهمة واسعة مع تأثير كبير' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'مهمة استراتيجية بتأثير عالي' },
    ],
  },
  {
    id: 'complexity',
    nameAr: 'التحديات التقنية/المعقدة',
    nameEn: 'Technical/Complex Challenges',
    weight: 15,
    description: 'مستوى التعقيد التقني والتحديات المحيطة',
    competencies: ['C4', 'C5'],
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد تحديات تقنية' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'تحديات بسيطة جداً' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'تحديات بسيطة مع بعض التعقيد' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'تحديات تقنية متوسطة' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'تحديات تقنية معقدة' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'تحديات عالية التعقيد واستراتيجية' },
    ],
  },
  {
    id: 'outcome',
    nameAr: 'نتيجة الأداء وتحقيق النتائج',
    nameEn: 'Performance Outcome & Results',
    weight: 20,
    description: 'مدى تحقيق النتائج المحددة بنجاح',
    competencies: ['C6', 'C7', 'C8'],
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا توجد نتائج محققة' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'نتائج ضعيفة جداً' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'نتائج جزئية محدودة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'نتائج جيدة معظم الأهداف محققة' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'نتائج ممتازة كل الأهداف محققة' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'نتائج استثنائية فاقت التوقعات' },
    ],
  },
  {
    id: 'evidence',
    nameAr: 'جودة الأدلة والتوثيق',
    nameEn: 'Evidence Quality & Documentation',
    weight: 15,
    description: 'قوة الأدلة المقدمة ووضوح التوثيق',
    competencies: ['C9'],
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد أدلة أو توثيق' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'أدلة ضعيفة غير كافية' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'أدلة أساسية محدودة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'أدلة جيدة وواضحة' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'أدلة قوية وموثقة جيداً' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'أدلة استثنائية شاملة ودقيقة' },
    ],
  },
  {
    id: 'method',
    nameAr: 'منهجية العمل والإجراءات',
    nameEn: 'Work Methodology & Procedures',
    weight: 15,
    description: 'وضوح المنهجية والإجراءات المستخدمة',
    competencies: ['C10', 'C11'],
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد منهجية واضحة' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'منهجية غير واضحة' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'منهجية بسيطة محدودة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'منهجية واضحة مع إجراءات' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'منهجية ممتازة منظمة' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'منهجية استثنائية مبتكرة' },
    ],
  },
  {
    id: 'impact',
    nameAr: 'الأثر والاستفادة العامة',
    nameEn: 'Impact & General Benefit',
    weight: 10,
    description: 'الأثر على المؤسسة والمستفيدين',
    competencies: ['C6', 'C12'],
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد أثر محسوس' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'أثر ضعيف جداً محدود' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'أثر بسيط على فئة محدودة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'أثر جيد على المؤسسة' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'أثر كبير على المؤسسة والمستفيدين' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'أثر استراتيجي على مستوى وطني' },
    ],
  },
  {
    id: 'timeliness',
    nameAr: 'التوقيت والجودة',
    nameEn: 'Timeliness & Quality',
    weight: 5,
    description: 'الإنجاز في الوقت المحدد مع الحفاظ على الجودة',
    competencies: ['C2', 'C8'],
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'تأخير كبير بدون جودة' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'تأخير كبير مع جودة ضعيفة' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'بعض التأخير مع جودة مقبولة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'إنجاز في الوقت مع جودة جيدة' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'إنجاز مبكر مع جودة عالية' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'إنجاز مبكر جداً مع جودة استثنائية' },
    ],
  },
  {
    id: 'integrity',
    nameAr: 'النزاهة والحياد',
    nameEn: 'Integrity & Objectivity',
    weight: 5,
    description: 'النزاهة في العمل والحياد في التعامل',
    competencies: ['C3', 'C11'],
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'مخالفات جسيمة في النزاهة' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'بعض المخالفات أو الشكوك' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'نزاهة مقبولة مع بعض الملاحظات' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'نزاهة وحياد جيدين' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'نزاهة عالية وحياد تام' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'نزاهة استثنائية قدوة للآخرين' },
    ],
  },
];

export function getAxisById(id: string): AxisDefinition | undefined {
  return OJT_AXES.find((a) => a.id === id);
}
