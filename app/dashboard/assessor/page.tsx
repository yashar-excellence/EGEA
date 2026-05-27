import { createClient } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { AssessorDashboard } from '@/components/dashboard/AssessorDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة المقيّم · جائزة مصر للتميز الحكومي',
};

export default async function AssessorPage() {
  const session = await getServerSession(authOptions);
  const supabase = createClient();

  const [candidatesRes, ojtRes, fepRes, fvRes] = await Promise.all([
    supabase.from('candidates').select('id, code, name, organization, phase').order('created_at', { ascending: false }),
    supabase.from('ojt_submissions').select('candidate_id, total_score, status'),
    supabase.from('fep_submissions').select('candidate_id, total_score, status'),
    supabase.from('fv_submissions').select('candidate_id, total_score, status'),
  ]);

  return (
    <AssessorDashboard
      candidates={candidatesRes.data ?? []}
      ojtSubmissions={ojtRes.data ?? []}
      fepSubmissions={fepRes.data ?? []}
      fvSubmissions={fvRes.data ?? []}
      assessorName={session?.user?.name ?? 'المقيّم'}
    />
  );
}
