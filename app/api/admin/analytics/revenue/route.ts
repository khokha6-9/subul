import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const revalidate = 300;

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
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    const [
      paymentsThisMonthRes,
      paymentsLastMonthRes,
      allPaymentsRes,
      subscriptionsRes,
      activeSubsRes,
    ] = await Promise.all([
      supabase.from('payments')
        .select('amount, currency, payment_method')
        .eq('status', 'completed')
        .gte('created_at', startOfMonth),
      supabase.from('payments')
        .select('amount, currency, payment_method')
        .eq('status', 'completed')
        .gte('created_at', startOfLastMonth)
        .lte('created_at', endOfLastMonth),
      supabase.from('payments')
        .select('amount, currency, payment_method, status'),
      supabase.from('subscriptions')
        .select('plan, status'),
      supabase.from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active'),
    ]);

    // إجمالي الإيرادات هذا الشهر
    const revenueThisMonth = paymentsThisMonthRes.data?.reduce(
      (sum, p) => sum + (Number(p.amount) || 0), 0
    ) || 0;

    const revenueLastMonth = paymentsLastMonthRes.data?.reduce(
      (sum, p) => sum + (Number(p.amount) || 0), 0
    ) || 0;

    const revenueGrowth = revenueLastMonth === 0
      ? null
      : Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100);

    // توزيع طرق الدفع
    const methodDist: Record<string, number> = {};
    paymentsThisMonthRes.data?.forEach((p) => {
      const method = p.payment_method || 'unknown';
      methodDist[method] = (methodDist[method] || 0) + 1;
    });

    // توزيع الخطط
    const planDist: Record<string, number> = {};
    subscriptionsRes.data?.forEach((s) => {
      if (s.plan) planDist[s.plan] = (planDist[s.plan] || 0) + 1;
    });

    // إجمالي كل الدفعات
    const totalRevenue = allPaymentsRes.data
      ?.filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

    return NextResponse.json({
      revenueThisMonth,
      revenueLastMonth,
      revenueGrowth,
      totalRevenue,
      activeSubscriptions: activeSubsRes.count || 0,
      methodDist,
      planDist,
    });

  } catch (error) {
    console.error('Analytics revenue error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}