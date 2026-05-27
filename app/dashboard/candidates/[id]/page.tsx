import { createClient } from '@/lib/supabase/server';
import { CandidateDetail } from '@/components/dashboard/CandidateDetail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'ملف المرشح · Candidate Profile' };

export default async function CandidateDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [candidateRes, ojtRes, fepRes, fvRes] = await Promise.all([
    supabase
      .from('candidates')
      .select('*, phase1_scores(*), assessment_360(*)')
      .eq('id', params.id)
      .single(),
    supabase.from('ojt_submissions').select('*').eq('candidate_id', params.id).maybeSingle(),
    supabase.from('fep_submissions').select('*').eq('candidate_id', params.id).maybeSingle(),
    supabase.from('fv_submissions').select('*').eq('candidate_id', params.id).maybeSingle(),
  ]);

  if (candidateRes.error || !candidateRes.data) notFound();

  return (
    <CandidateDetail
      candidate={candidateRes.data}
      ojt={ojtRes.data}
      fep={fepRes.data}
      fv={fvRes.data}
    />
  );
}
