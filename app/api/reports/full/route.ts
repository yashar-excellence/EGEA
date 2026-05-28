import { createClient } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { NextRequest, NextResponse } from 'next/server';
import { buildReportData } from '@/lib/reports/engine';
import { generateReportHTML } from '@/lib/reports/template';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!user || !['admin', 'award_admin'].includes(user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = createClient();
    const [candidatesRes, ojtRes, fepRes, fvRes] = await Promise.all([
      supabase.from('candidates').select('*, phase1_scores(*), assessment_360(*)').order('created_at', { ascending: false }),
      supabase.from('ojt_submissions').select('candidate_id, total_score, status'),
      supabase.from('fep_submissions').select('candidate_id, total_score, status'),
      supabase.from('fv_submissions').select('candidate_id, total_score, status'),
    ]);

    const generatedBy = user.name ?? 'هيئة الجائزة';
    const reportData = buildReportData(
      candidatesRes.data ?? [],
      ojtRes.data ?? [],
      fepRes.data ?? [],
      fvRes.data ?? [],
      generatedBy,
    );

    const html = generateReportHTML(reportData);

    // Log report generation (fire and forget)
    supabase.from('report_logs').insert({
      generated_by: user.id ?? user.email,
      generated_by_name: generatedBy,
      report_type: 'full_results',
      candidate_count: reportData.meta.totalCandidates,
    }).then(() => {});

    const autoprint = req.nextUrl.searchParams.get('print') === '1';
    const finalHtml = autoprint ? html.replace('?autoprint=1', '').replace("includes('autoprint=1')", 'true') : html;

    return new NextResponse(finalHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
