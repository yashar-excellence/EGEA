import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const AssessorWorkspace = dynamic(
  () => import('@/components/ojt/AssessorWorkspace').then(mod => mod.AssessorWorkspace),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-gold-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>جاري تحميل أداة OJT...</span>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function OJTPage({ searchParams }: { searchParams: { candidate?: string } }) {
  return <AssessorWorkspace candidateId={searchParams.candidate} />;
}
