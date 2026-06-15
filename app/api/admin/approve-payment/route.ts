import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'رقم الدفعة مطلوب' },
        { status: 400 }
      );
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'الدفعة غير موجودة' },
        { status: 404 }
      );
    }

    if (payment.status !== 'pending') {
      return NextResponse.json(
        { error: 'هذه الدفعة تمت معالجتها مسبقاً' },
        { status: 400 }
      );
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: payment.user_id,
        plan: payment.plan,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_method: payment.payment_method,
      });

    if (subError) {
      return NextResponse.json(
        { error: 'خطأ في تفعيل الاشتراك' },
        { status: 500 }
      );
    }

    const { error: creditsError } = await supabase
      .from('users_credits')
      .update({
        plan: payment.plan,
        credits_remaining: PLAN_QUESTIONS[payment.plan] || 100,
        is_plus: payment.plan !== 'starter',
      })
      .eq('user_id', payment.user_id);

    if (creditsError) {
      return NextResponse.json(
        { error: 'خطأ في تحديث الرصيد' },
        { status: 500 }
      );
    }

   await supabase
      .from('payments')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

await trackEvent('payment_completed', payment.user_id, {
    plan: payment.plan,
    amount: payment.amount_usd,
    payment_method: 'sham_cash',
    payment_id: paymentId,
});

await trackEvent('subscription_activated', payment.user_id, {
    plan: payment.plan,
    payment_method: 'sham_cash',
    expires_at: expiresAt.toISOString(),
});

return NextResponse.json({ success: true });

  } catch (error) {
    console.error('خطأ في قبول الدفعة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}