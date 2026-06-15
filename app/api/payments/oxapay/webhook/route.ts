import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramNotification } from '@/lib/telegram';
import { trackEvent } from '@/lib/events';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_QUESTIONS: Record<string, number> = {
  starter: 100,
  plus: 400,
  pro: 1200,
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (body.status !== 'Paid') {
      return NextResponse.json({ success: true });
    }

    const trackId = body.trackId;

    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', String(trackId))
      .single();

    if (!payment) {
      return NextResponse.json({ error: 'الدفعة غير موجودة' }, { status: 404 });
    }

    if (payment.status === 'approved') {
      return NextResponse.json({ success: true });
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await supabase
      .from('subscriptions')
      .upsert({
        user_id: payment.user_id,
        plan: payment.plan,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_method: 'oxapay',
      });

    await supabase
      .from('users_credits')
      .update({
        plan: payment.plan,
        credits_remaining: PLAN_QUESTIONS[payment.plan] || 100,
        is_plus: payment.plan !== 'starter',
      })
      .eq('user_id', payment.user_id);

    await supabase
      .from('payments')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', payment.id);
await trackEvent('payment_completed', payment.user_id, {
    plan: payment.plan,
    amount: payment.amount_usd,
    payment_method: 'oxapay',
    track_id: trackId,
});

await trackEvent('subscription_activated', payment.user_id, {
    plan: payment.plan,
    payment_method: 'oxapay',
    expires_at: expiresAt.toISOString(),
});
    await sendTelegramNotification(`
✅ <b>دفع مكتمل — USDT</b>

📦 <b>الخطة:</b> ${payment.plan}
💵 <b>المبلغ:</b> ${payment.amount_usd}$
🆔 <b>رقم التتبع:</b> ${trackId}
⚡ تم تفعيل الاشتراك تلقائياً
    `.trim());

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('خطأ في webhook:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}