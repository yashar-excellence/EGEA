import type { OJTSubmission, Achievement } from './types';

export function createSampleOJTSubmission(candidateCode: string = 'C-2025-0014'): OJTSubmission {
  const achievements: Achievement[] = [
    {
      id: 'ach-1',
      title: 'تطوير نظام إدارة المخزون الرقمي',
      description: 'قيادة مشروع تحول رقمي لإدارة المخازن باستخدام IoT والذكاء الاصطناعي',
      context: 'قطاع التمويل والإدارة',
      metrics: ['تقليل الهدر بنسبة 35%', 'زيادة الدقة إلى 98%', 'توفير 2M جنيه سنوياً'],
      scores: {
        scope: 4,
        complexity: 5,
        outcome: 5,
        evidence: 4,
        method: 4,
        impact: 5,
        timeliness: 4,
        integrity: 5,
      },
      assessorNotes: 'إنجاز استثنائي بتأثير كبير على المؤسسة',
    },
    {
      id: 'ach-2',
      title: 'تصميم برنامج تدريبي متخصص',
      description: 'إنشاء برنامج تدريبي متكامل للموظفين الجدد في مجال الخدمة الرقمية',
      context: 'قطاع الموارد البشرية',
      metrics: ['تخفيض وقت التأهيل بنسبة 50%', 'تحسن NPS بـ 20 نقطة', 'تدريب 150 موظف'],
      scores: {
        scope: 3,
        complexity: 3,
        outcome: 4,
        evidence: 4,
        method: 4,
        impact: 4,
        timeliness: 5,
        integrity: 5,
      },
      assessorNotes: 'عمل متميز في مجال التدريب والتطوير',
    },
    {
      id: 'ach-3',
      title: 'تحسين إجراءات خدمة العملاء',
      description: 'إعادة هندسة إجراءات خدمة العملاء لتقليل وقت الاستجابة',
      context: 'قطاع خدمة العملاء',
      metrics: ['تقليل وقت الانتظار بنسبة 60%', 'رفع CSAT إلى 92%', 'معالجة 5000+ شكوى'],
      scores: {
        scope: 3,
        complexity: 3,
        outcome: 4,
        evidence: 3,
        method: 4,
        impact: 4,
        timeliness: 4,
        integrity: 5,
      },
      assessorNotes: 'تحسن ملحوظ في رضا العملاء',
    },
  ];

  return {
    candidateCode,
    candidateName: 'مؤمن الأحمري - سعاينة',
    candidateRole: 'أخصائي موارد حكومي',
    organization: 'وزارة المالية',
    assessorName: 'د. أحمد محمد',
    cycle: '2025',
    achievements,
    axesNotes: {
      scope: 'نطاق واسع وتأثير استراتيجي',
      complexity: 'تحديات تقنية معقدة تم التغلب عليها',
      outcome: 'نتائج ممتازة فاقت التوقعات',
    },
    submittedAt: new Date().toISOString(),
  };
}

export function createBlankAchievement(id: string, index: number): Achievement {
  return {
    id,
    title: `إنجاز ${index + 1}`,
    description: '',
    context: '',
    metrics: [],
    scores: {},
    assessorNotes: '',
  };
}

export function createBlankOJTSubmission(): OJTSubmission {
  return {
    candidateCode: '',
    candidateName: '',
    candidateRole: '',
    organization: '',
    assessorName: '',
    cycle: '2025',
    achievements: [
      createBlankAchievement('ach-1', 0),
      createBlankAchievement('ach-2', 1),
      createBlankAchievement('ach-3', 2),
    ],
    axesNotes: {},
  };
}
