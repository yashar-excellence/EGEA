export interface FEPArea {
  id: string;
  nameAr: string;
  nameEn: string;
  weight: number;
  description: string;
  rubric: { score: number; labelAr: string; descriptionAr: string }[];
}

export const FEP_AREAS: FEPArea[] = [
  {
    id: 'strategic',
    nameAr: 'الربط الاستراتيجي مع الأهداف الوطنية',
    nameEn: 'Strategic Alignment with National Goals',
    weight: 20,
    description: 'مدى ارتباط المبادرة بالأهداف الاستراتيجية للدولة والوزارة',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد ربط استراتيجي' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'ربط ضعيف غير واضح' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'ربط جزئي محدود' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'ربط جيد مع الأهداف' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'ربط قوي وواضح' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'ربط استراتيجي استثنائي' },
    ],
  },
  {
    id: 'results',
    nameAr: 'النتائج المؤثرة والمؤثرة',
    nameEn: 'Impactful & Influential Results',
    weight: 20,
    description: 'قوة النتائج المحققة وتأثيرها على المستفيدين',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا توجد نتائج' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'نتائج ضعيفة جداً' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'نتائج محدودة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'نتائج جيدة وملموسة' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'نتائج مؤثرة بشكل كبير' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'نتائج استثنائية مؤثرة جداً' },
    ],
  },
  {
    id: 'methodology',
    nameAr: 'منهجية الإنجاز والتنفيذ',
    nameEn: 'Methodology of Achievement & Implementation',
    weight: 15,
    description: 'وضوح المنهجية وفعالية إجراءات التنفيذ',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا توجد منهجية' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'منهجية غير واضحة' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'منهجية بسيطة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'منهجية واضحة ومنظمة' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'منهجية ممتازة وفعالة' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'منهجية استثنائية مبتكرة' },
    ],
  },
  {
    id: 'presentation',
    nameAr: 'أداء العرض والإقناع',
    nameEn: 'Presentation Performance & Persuasion',
    weight: 15,
    description: 'جودة تقديم العرض والقدرة على الإقناع والتواصل',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'عرض ضعيف جداً' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'أداء ضعيف' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'أداء مقبول' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'عرض جيد وواضح' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'عرض ممتاز ومقنع' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'أداء استثنائي يأسر الانتباه' },
    ],
  },
  {
    id: 'innovation',
    nameAr: 'الابتكار والإبداع',
    nameEn: 'Innovation & Creativity',
    weight: 15,
    description: 'درجة الابتكار والإبداع في المبادرة والحلول',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد ابتكار' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'ابتكار ضعيف جداً' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'بعض العناصر المبتكرة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'ابتكار جيد في بعض الجوانب' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'ابتكار ملحوظ ومؤثر' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'ابتكار استثنائي فريد' },
    ],
  },
  {
    id: 'impact',
    nameAr: 'الأثر المستدام',
    nameEn: 'Sustainable Impact',
    weight: 10,
    description: 'استدامة الأثر وقابلية التوسع والاستمرارية',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يوجد أثر مستدام' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'أثر قصير المدى جداً' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'أثر محدود المدة' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'أثر متوسط المدى' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'أثر طويل المدى' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'أثر استراتيجي مستدام' },
    ],
  },
  {
    id: 'scalability',
    nameAr: 'قابلية التوسع والنقل',
    nameEn: 'Scalability & Replicability',
    weight: 5,
    description: 'إمكانية توسع المبادرة أو نقلها لجهات أخرى',
    rubric: [
      { score: 0, labelAr: 'غير ملائم', descriptionAr: 'لا يمكن النقل أو التوسع' },
      { score: 1, labelAr: 'ضعيف', descriptionAr: 'صعوبة كبيرة في النقل' },
      { score: 2, labelAr: 'مقبول', descriptionAr: 'نقل محدود ممكن' },
      { score: 3, labelAr: 'جيد', descriptionAr: 'قابلية جيدة للتوسع' },
      { score: 4, labelAr: 'جيد جداً', descriptionAr: 'سهولة في النقل والتوسع' },
      { score: 5, labelAr: 'متميز', descriptionAr: 'نموذج يمكن تطبيقه على نطاق واسع' },
    ],
  },
];

export function getFEPAreaById(id: string): FEPArea | undefined {
  return FEP_AREAS.find((a) => a.id === id);
}
