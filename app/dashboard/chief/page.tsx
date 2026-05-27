import { createClient } from '@/lib/supabase/server';
import { ChiefDashboard } from '@/components/dashboard/ChiefDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة رئيس المقيّمين · جائزة مصر للتميز الحكومي',
};

export default async function ChiefPage() {
  const supabase = createClient();
  const [candidatesRes, ojtRes, fepRes, fvRes] = await Promise.all([
    supabase.from('candidates').select('*, phase1_scores(*), assessment_360(*)').order('created_at', { ascending: false }),
    supabase.from('ojt_submissions').select('candidate_id, total_score, status'),
    supabase.from('fep_submissions').select('candidate_id, total_score, status'),
    supabase.from('fv_submissions').select('candidate_id, total_score, status'),
  ]);

  return (
    <ChiefDashboard
      candidates={candidatesRes.data ?? []}
      ojtSubmissions={ojtRes.data ?? []}
      fepSubmissions={fepRes.data ?? []}
      fvSubmissions={fvRes.data ?? []}
    />
  );
}
