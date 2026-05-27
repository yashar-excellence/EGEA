import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('users').select('count').single();
    if (error) throw error;
    return NextResponse.json({ status: 'connected', data });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
