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

    // تواريخ الشهر الحالي والسابق
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    const [
      totalRes,
      newThisMonthRes,
      newLastMonthRes,
      onboardingRes,
      locationRes,
      countryRes,
      goalRes,
      experienceRes,
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth),
      supabase.from('profiles').select('id', { count: 'exact', head: true })
        .gte('created_at', startOfLastMonth)
        .lte('created_at', endOfLastMonth),
      supabase.from('profiles').select('onboarding_status'),
      supabase.from('profiles').select('location'),
      supabase.from('profiles').select('current_country'),
      supabase.from('profiles').select('goal'),
      supabase.from('profiles').select('experience_level'),
    ]);

    const newThisMonth = newThisMonthRes.count || 0;
    const newLastMonth = newLastMonthRes.count || 0;
    const growthPercent = newLastMonth === 0
      ? null
      : Math.round(((newThisMonth - newLastMonth) / newLastMonth) * 100);

    // تجميع البيانات
    const onboardingDist = { completed: 0, skipped: 0, pending: 0 };
    onboardingRes.data?.forEach((p) => {
      const s = p.onboarding_status as keyof typeof onboardingDist;
      if (s in onboardingDist) onboardingDist[s]++;
    });

    const locationDist = { inside_syria: 0, outside_syria: 0, unknown: 0 };
    locationRes.data?.forEach((p) => {
      if (p.location === 'inside_syria') locationDist.inside_syria++;
      else if (p.location === 'outside_syria') locationDist.outside_syria++;
      else locationDist.unknown++;
    });

    const countryCount: Record<string, number> = {};
    countryRes.data?.forEach((p) => {
      if (p.current_country) {
        countryCount[p.current_country] = (countryCount[p.current_country] || 0) + 1;
      }
    });
    const topCountries = Object.entries(countryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    const goalCount: Record<string, number> = {};
    goalRes.data?.forEach((p) => {
      if (p.goal) goalCount[p.goal] = (goalCount[p.goal] || 0) + 1;
    });

    const experienceCount: Record<string, number> = {};
    experienceRes.data?.forEach((p) => {
      if (p.experience_level) {
        experienceCount[p.experience_level] = (experienceCount[p.experience_level] || 0) + 1;
      }
    });

    return NextResponse.json({
      total: totalRes.count || 0,
      newThisMonth,
      newLastMonth,
      growthPercent,
      onboardingDist,
      locationDist,
      topCountries,
      goalDist: goalCount,
      experienceDist: experienceCount,
    });

  } catch (error) {
    console.error('Analytics users error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}