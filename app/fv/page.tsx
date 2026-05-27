import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const FVAssessorWorkspace = dynamic(
  () => import('@/components/fv/FVAssessorWorkspace').then(mod => mod.FVAssessorWorkspace),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-gold-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>جاري تحميل أداة FV...</span>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export const metadata: Metadata = {
  title: 'FV — الزيارة الميدانية',
  description: 'أداة تقييم الزيارة الميدانية',
};

export default function FieldVisitPage({ searchParams }: { searchParams: { candidate?: string } }) {
  return <FVAssessorWorkspace candidateId={searchParams.candidate} />;
}
