import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
async function getAdminClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
}

export async function GET() {
  try {
    const supabase = await getAdminClient();

    // التحقق من الأدمن
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // تواريخ
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    const [
      totalEventsRes,
      eventsThisMonthRes,
      eventsLastMonthRes,
      recentEventsRes,
      activeUsersRes,
    ] = await Promise.all([
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('event_type, event_category')
        .gte('created_at', startOfMonth),
      supabase.from('events').select('id', { count: 'exact', head: true })
        .gte('created_at', startOfLastMonth)
        .lte('created_at', endOfLastMonth),
      supabase.from('events').select('event_type, event_category, created_at')
        .gte('created_at', sevenDaysAgo)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.from('events').select('user_id')
        .gte('created_at', startOfMonth),
    ]);

    const eventsThisMonth = eventsThisMonthRes.data?.length || 0;
    const eventsLastMonth = eventsLastMonthRes.count || 0;
    const activityGrowth = eventsLastMonth === 0
      ? null
      : Math.round(((eventsThisMonth - eventsLastMonth) / eventsLastMonth) * 100);

    // توزيع أنواع الأحداث
    const eventTypeDist: Record<string, number> = {};
    eventsThisMonthRes.data?.forEach((e) => {
      eventTypeDist[e.event_type] = (eventTypeDist[e.event_type] || 0) + 1;
    });

    // توزيع فئات الأحداث
    const categoryDist: Record<string, number> = {};
    eventsThisMonthRes.data?.forEach((e) => {
      categoryDist[e.event_category] = (categoryDist[e.event_category] || 0) + 1;
    });

    // المستخدمون النشطون هذا الشهر
    const uniqueActiveUsers = new Set(
      activeUsersRes.data?.map((e) => e.user_id).filter(Boolean)
    ).size;

    return NextResponse.json({
      totalEvents: totalEventsRes.count || 0,
      eventsThisMonth,
      eventsLastMonth,
      activityGrowth,
      uniqueActiveUsers,
      eventTypeDist,
      categoryDist,
      recentEvents: recentEventsRes.data || [],
    });

  } catch (error) {
    console.error('Analytics activity error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}