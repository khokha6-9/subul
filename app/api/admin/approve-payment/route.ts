import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { trackEvent } from '@/lib/events';
import { sendSubscriptionActivatedEmail } from '@/lib/email';
import { sendTelegramNotification } from '@/lib/telegram';
import { getPlanInfo, isValidEmail } from '@/lib/plans';

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

    // تفعيل الاشتراك
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

    // تحديث الرصيد
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

    // تحديث حالة الدفعة
    await supabase
      .from('payments')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    // تسجيل الأحداث
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

    // إرسال إيميل التفعيل
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('activation_email_sent_at')
      .eq('user_id', payment.user_id)
      .single();

    if (!subscription?.activation_email_sent_at) {
      try {
        // جلب بيانات المستخدم
        const { data: userData } = await supabase.auth.admin.getUserById(
          payment.user_id
        );

        const userEmail = userData?.user?.email;
        const userName = userData?.user?.user_metadata?.full_name;

        // التحقق من الإيميل
        if (!userEmail) {
          await sendTelegramNotification(
            `⚠️ تفعيل بدون إيميل\nالمستخدم: ${payment.user_id}\nالخطة: ${payment.plan}`
          );
        } else if (!isValidEmail(userEmail)) {
          await sendTelegramNotification(
            `⚠️ تنسيق إيميل خاطئ\nالمستخدم: ${payment.user_id}\nالإيميل: ${userEmail}`
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

          // تحديث activation_email_sent_at
          await supabase
            .from('subscriptions')
            .update({ activation_email_sent_at: new Date().toISOString() })
            .eq('user_id', payment.user_id);
        }
      } catch (emailError) {
        // الإيميل فشل — نُشعر ولا نوقف العملية
        console.error('Email error:', emailError);
        await sendTelegramNotification(
          `🚨 فشل إرسال إيميل تفعيل\nالمستخدم: ${payment.user_id}\nالخطة: ${payment.plan}\nالسبب: ${emailError instanceof Error ? emailError.message : 'خطأ غير معروف'}\n\nاذهب للوحة الأدمن وأعد المحاولة يدوياً`
        );
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('خطأ في قبول الدفعة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}