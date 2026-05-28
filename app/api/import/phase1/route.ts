import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST body: { rows: Array<{ candidate_code, epr, apt, b5, sjt, cbi }> }
// Looks up candidate by code, then upserts phase1_scores
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { rows } = await req.json();
    if (!Array.isArray(rows) || rows.length === 0)
      return NextResponse.json({ error: 'لا يوجد بيانات' }, { status: 400 });

    // Fetch all candidates to resolve code → id
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
        epr: parseFloat(r.epr) || 0,
        apt: parseFloat(r.apt) || 0,
        b5: parseFloat(r.b5) || 0,
        sjt: parseFloat(r.sjt) || 0,
        cbi: parseFloat(r.cbi) || 0,
        total: (parseFloat(r.epr) || 0) + (parseFloat(r.apt) || 0) + (parseFloat(r.b5) || 0)
             + (parseFloat(r.sjt) || 0) + (parseFloat(r.cbi) || 0),
      }));

    const notFound = rows
      .filter((r: any) => !codeToId[r.candidate_code])
      .map((r: any) => r.candidate_code);

    if (upsertRows.length === 0)
      return NextResponse.json({ error: 'لا يوجد مرشحون مطابقون', notFound }, { status: 400 });

    const { data, error } = await supabase
      .from('phase1_scores')
      .upsert(upsertRows, { onConflict: 'candidate_id' })
      .select();

    if (error) throw error;
    return NextResponse.json({ inserted: data?.length ?? 0, notFound, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
