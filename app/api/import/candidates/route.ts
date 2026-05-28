import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST body: { rows: Array<{ code, name, role, organization, category, level, cycle, phase }> }
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { rows } = await req.json();
    if (!Array.isArray(rows) || rows.length === 0)
      return NextResponse.json({ error: 'لا يوجد بيانات' }, { status: 400 });

    const { data, error } = await supabase
      .from('candidates')
      .upsert(rows, { onConflict: 'code' })
      .select();

    if (error) throw error;
    return NextResponse.json({ inserted: data?.length ?? 0, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
