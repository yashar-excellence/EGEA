import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST body: { rows: Array<{ candidate_code, score, provider? }> }
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { rows } = await req.json();
    if (!Array.isArray(rows) || rows.length === 0)
      return NextResponse.json({ error: 'لا يوجد بيانات' }, { status: 400 });

    const codes = rows.map((r: any) => r.candidate_code);
    const { data: candidates, error: cErr } = await supabase
      .from('candidates')
      .select('id, code')
      .in('code', codes);

    if (cErr) throw cErr;

    const codeToId = Object.fromEntries((candidates ?? []).map((c: any) => [c.code, c.id]));

    const upsertRows = rows
      .filter((r: any) => codeToId[r.candidate_code])
      .map((r: any) => ({
        candidate_id: codeToId[r.candidate_code],
        score: parseFloat(r.score) || 0,
        provider: r.provider ?? 'LEVID 360',
      }));

    const notFound = rows
      .filter((r: any) => !codeToId[r.candidate_code])
      .map((r: any) => r.candidate_code);

    if (upsertRows.length === 0)
      return NextResponse.json({ error: 'لا يوجد مرشحون مطابقون', notFound }, { status: 400 });

    const { data, error } = await supabase
      .from('assessment_360')
      .upsert(upsertRows, { onConflict: 'candidate_id' })
      .select();

    if (error) throw error;
    return NextResponse.json({ inserted: data?.length ?? 0, notFound, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
