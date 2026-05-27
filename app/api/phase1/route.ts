import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Import Phase 1 outsource scores
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const body = await req.json();
    // body: { candidate_id, epr, apt, b5, sjt, cbi }
    const total = (body.epr ?? 0) + (body.apt ?? 0) + (body.b5 ?? 0) + (body.sjt ?? 0) + (body.cbi ?? 0);
    const { data, error } = await supabase
      .from('phase1_scores')
      .upsert({ ...body, total }, { onConflict: 'candidate_id' })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const candidateId = req.nextUrl.searchParams.get('candidate_id');
    let query = supabase.from('phase1_scores').select('*, candidates(name, code, organization)');
    if (candidateId) query = query.eq('candidate_id', candidateId);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
