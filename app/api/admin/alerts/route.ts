import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getPendingAlertsCount } from '@/lib/monitoring';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const count = await getPendingAlertsCount();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}