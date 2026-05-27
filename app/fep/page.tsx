import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const FEPPanelWorkspace = dynamic(
  () => import('@/components/fep/FEPPanelWorkspace').then(mod => mod.FEPPanelWorkspace),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-gold-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>جاري تحميل أداة FEP...</span>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export const metadata: Metadata = {
  title: 'FEP — العرض النهائي للتميز',
  description: 'أداة تقييم العرض النهائي للتميز',
};

export default function FEPPage({ searchParams }: { searchParams: { candidate?: string } }) {
  return <FEPPanelWorkspace candidateId={searchParams.candidate} />;
}
