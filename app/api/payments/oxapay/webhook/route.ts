import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramNotification } from '@/lib/telegram';
import { trackEvent } from '@/lib/events';
import { sendSubscriptionActivatedEmail } from '@/lib/email';
import { getPlanInfo, isValidEmail } from '@/lib/plans';
import { sendCriticalAlert } from '@/lib/monitoring';
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

    // تفعيل الاشتراك
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

    // تحديث الرصيد
    await supabase
      .from('users_credits')
      .update({
        plan: payment.plan,
        credits_remaining: PLAN_QUESTIONS[payment.plan] || 100,
        is_plus: payment.plan !== 'starter',
      })
      .eq('user_id', payment.user_id);

    // تحديث حالة الدفعة
    await supabase
      .from('payments')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    // تسجيل الأحداث
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

    // إرسال إيميل التفعيل مع Idempotency
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('activation_email_sent_at')
      .eq('user_id', payment.user_id)
      .single();

    if (!subscription?.activation_email_sent_at) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(
          payment.user_id
        );

        const userEmail = userData?.user?.email;
        const userName = userData?.user?.user_metadata?.full_name;

        if (!userEmail) {
          await sendTelegramNotification(
            `⚠️ تفعيل OxaPay بدون إيميل\nالمستخدم: ${payment.user_id}\nالخطة: ${payment.plan}`
          );
        } else if (!isValidEmail(userEmail)) {
          await sendTelegramNotification(
            `⚠️ تنسيق إيميل خاطئ — OxaPay\nالمستخدم: ${payment.user_id}\nالإيميل: ${userEmail}`
          );
        } else {
          const planInfo = getPlanInfo(payment.plan);

         await sendSubscriptionActivatedEmail(
    userEmail,
    payment.plan,
    planInfo?.credits || 100,
    userName,
    planInfo?.priceUsd,
    expiresAt
);

          await supabase
            .from('subscriptions')
            .update({ activation_email_sent_at: new Date().toISOString() })
            .eq('user_id', payment.user_id);
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        await sendTelegramNotification(
          `🚨 فشل إرسال إيميل تفعيل — OxaPay\nالمستخدم: ${payment.user_id}\nالخطة: ${payment.plan}\nالسبب: ${emailError instanceof Error ? emailError.message : 'خطأ غير معروف'}\n\nاذهب للوحة الأدمن وأعد المحاولة يدوياً`
        );
      }
    }

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
    await sendCriticalAlert(
      '/api/webhooks/oxapay',
      error,
      { context: 'oxapay_webhook' }
    );
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
}
}