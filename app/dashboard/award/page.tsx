import { createClient } from '@/lib/supabase/server';
import { AwardDashboard } from '@/components/dashboard/AwardDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'هيئة الجائزة · نتائج التقييم' };

export default async function AwardDashboardPage() {
  const supabase = createClient();

  const [candidatesRes, ojtRes, fepRes, fvRes] = await Promise.all([
    supabase
      .from('candidates')
      .select('*, phase1_scores(*), assessment_360(*)')
      .order('created_at', { ascending: false }),
    supabase.from('ojt_submissions').select('candidate_id, total_score, status'),
    supabase.from('fep_submissions').select('candidate_id, total_score, status'),
    supabase.from('fv_submissions').select('candidate_id, total_score, status'),
  ]);

  return (
    <AwardDashboard
      candidates={candidatesRes.data ?? []}
      ojtSubmissions={ojtRes.data ?? []}
      fepSubmissions={fepRes.data ?? []}
      fvSubmissions={fvRes.data ?? []}
    />
  );
}
