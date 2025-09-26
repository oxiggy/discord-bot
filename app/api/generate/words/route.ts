import { NextRequest, NextResponse } from 'next/server'
import { getOverwatchWords } from '@/lib/openai/getOverwatchWords'
import { supabaseAdmin } from '@/lib/supabase/adminServer'


export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  return runRefresh();
}

async function runRefresh() {
  try {
    const words = await getOverwatchWords();
    if (words.length === 0) {
      return NextResponse.json({ ok: false, error: 'Empty list from AI' }, { status: 502 });
    }

    const del = await supabaseAdmin.from('words')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (del.error) throw del.error;

    const payload = words.map(content => ({ content }));
    const ins = await supabaseAdmin.from('words').insert(payload);
    if (ins.error) throw ins.error;

    return NextResponse.json({ ok: true, count: words.length });
  } catch (e: unknown) {
    console.error('[words/refresh] error:', e);
    return NextResponse.json({ ok: false, error: 'Refresh error' }, { status: 500 });
  }
}
