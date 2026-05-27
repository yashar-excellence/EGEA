import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard · لوحة التحكم',
};

export default async function DashboardPage() {
  const supabase = createClient();

  const [candidatesRes, ojtRes, fepRes, fvRes] = await Promise.all([
    supabase.from('candidates').select('*, phase1_scores(*), assessment_360(*)').order('created_at', { ascending: false }),
    supabase.from('ojt_submissions').select('candidate_id, total_score, status'),
    supabase.from('fep_submissions').select('candidate_id, total_score, status'),
    supabase.from('fv_submissions').select('candidate_id, total_score, status'),
  ]);

  const candidates = candidatesRes.data ?? [];
  const ojt = ojtRes.data ?? [];
  const fep = fepRes.data ?? [];
  const fv = fvRes.data ?? [];

  return (
    <DashboardClient
      candidates={candidates}
      ojtSubmissions={ojt}
      fepSubmissions={fep}
      fvSubmissions={fv}
    />
  );
}
