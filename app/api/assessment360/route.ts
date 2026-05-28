import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const body = await req.json();
    // body: { candidate_id, score, provider }
    const { data, error } = await supabase
      .from('assessment_360')
      .upsert(
        { candidate_id: body.candidate_id, score: body.score, provider: body.provider ?? 'LEVID 360' },
        { onConflict: 'candidate_id' }
      )
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
    let query = supabase.from('assessment_360').select('*, candidates(name, code)');
    if (candidateId) query = query.eq('candidate_id', candidateId);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
