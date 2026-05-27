import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('candidates')
      .select('*, phase1_scores(*), assessment_360(*), ojt_submissions(*), fep_submissions(*), fv_submissions(*)')
      .eq('id', params.id)
      .single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const body = await req.json();
    const { data, error } = await supabase
      .from('candidates')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
