import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (role === 'admin') redirect('/admin');
  if (role === 'chief_assessor') redirect('/dashboard/chief');
  if (role === 'assessor') redirect('/dashboard/assessor');
  if (role === 'award_admin') redirect('/dashboard/award');

  redirect('/login');
}
