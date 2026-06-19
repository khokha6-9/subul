import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'crypto';
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

// التحقق من صحة HMAC بأمان (مقاوم لـ timing attacks)
function verifyHmacSignature(rawBody: string, receivedHmac: string | null): boolean {
  if (!receivedHmac) return false;

  const apiKey = process.env.OXAPAY_API_KEY;
  if (!apiKey) {
    console.error('OXAPAY_API_KEY مفقود من متغيرات البيئة');
    return false;
  }

  const calculatedHmac = createHmac('sha512', apiKey)
    .update(rawBody)
    .digest('hex');

  if (calculatedHmac.length !== receivedHmac.length) return false;

  try {
    return timingSafeEqual(
      Buffer.from(calculatedHmac, 'utf8'),
      Buffer.from(receivedHmac, 'utf8')
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // مرجع للدفعة المقفولة — يُستخدم في catch الخارجي لإصلاح M1
  let lockedPaymentId: string | null = null;

  // ١. قراءة raw body أولاً — ضروري لحساب HMAC بدقة
  const rawBody = await request.text();
  const receivedHmac = request.headers.get('hmac');

  // ٢. التحقق من التوقيع قبل أي معالجة أخرى — فئة 1، رفض فوري
  const isValidSignature = verifyHmacSignature(rawBody, receivedHmac);

  if (!isValidSignature) {
    console.warn('OxaPay webhook: توقيع HMAC غير صالح');
    await sendCriticalAlert(
      'oxapay_invalid_signature',
      new Error('توقيع HMAC غير صالح في webhook OxaPay'),
      { ip: request.headers.get('x-forwarded-for') || 'unknown' }
    );
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ٣. تحويل لـ JSON بعد التأكد من صحة المصدر
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const status = body.status as string;
    const trackId = body.track_id as string;

    if (!trackId) {
      return NextResponse.json({ error: 'track_id مفقود' }, { status: 400 });
    }

    // معالجة صريحة لحالة "Paying" — قبل التأكيد النهائي
    if (status === 'Paying') {
      await trackEvent('payment_initiated', null, {
        track_id: trackId,
        payment_method: 'oxapay',
        stage: 'awaiting_confirmation',
      });
      return NextResponse.json({ success: true });
    }

    if (status !== 'Paid') {
      return NextResponse.json({ success: true });
    }

    // ٤. Atomic Update لمنع Race Condition
    const { data: lockedPayment, error: lockError } = await supabase
      .from('payments')
      .update({ status: 'processing' })
      .eq('transaction_id', String(trackId))
      .eq('status', 'pending')
      .select()
      .single();

    if (lockError || !lockedPayment) {
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id, status')
        .eq('transaction_id', String(trackId))
        .single();

      if (!existingPayment) {
        await sendCriticalAlert(
          'oxapay_payment_not_found',
          new Error(`دفعة مؤكدة من OxaPay غير موجودة في قاعدتنا`),
          { track_id: trackId }
        );
        return NextResponse.json({ error: 'الدفعة غير موجودة' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    const payment = lockedPayment;
    // تسجيل مرجع الدفعة المقفولة — يُستخدم لاحقاً في catch الخارجي إن حدث استثناء
    lockedPaymentId = payment.id;
const expectedAmount = Number(payment.amount_usd);

    if (isNaN(expectedAmount) || expectedAmount <= 0) {
      await sendCriticalAlert(
        'oxapay_invalid_expected_amount',
        new Error('المبلغ المتوقع للدفعة غير صالح أو صفري'),
        { payment_id: payment.id, track_id: trackId, stored_amount: payment.amount_usd }
      );
      await supabase.from('payments').update({ status: 'pending' }).eq('id', payment.id);
      return NextResponse.json({ error: 'invalid expected amount' }, { status: 400 });
    }

    const paidCurrency = String(body.currency || '').toUpperCase();
    if (paidCurrency !== 'USDT') {
      await sendCriticalAlert(
        'oxapay_unexpected_currency',
        new Error('عملة غير متوقعة في webhook'),
        { payment_id: payment.id, track_id: trackId, currency: paidCurrency }
      );
      await supabase.from('payments').update({ status: 'pending' }).eq('id', payment.id);
      return NextResponse.json({ error: 'unexpected currency' }, { status: 400 });
    }

    const paidAmount = Number(body.amount);
    const ALLOWED_DIFFERENCE = 0.01;

    if (isNaN(paidAmount) || paidAmount + ALLOWED_DIFFERENCE < expectedAmount) {
      await sendCriticalAlert(
        'oxapay_amount_mismatch',
        new Error('المبلغ المستلم أقل من المتوقع'),
        {
          payment_id: payment.id,
          track_id: trackId,
          paid_amount: paidAmount,
          expected_amount: expectedAmount,
        }
      );
      await supabase.from('payments').update({ status: 'pending' }).eq('id', payment.id);
      return NextResponse.json({ error: 'amount mismatch' }, { status: 400 });
    }
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // ٥. تفعيل الاشتراك
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: payment.user_id,
        plan: payment.plan,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_method: 'oxapay',
      }, { onConflict: 'user_id' });

    if (subError) {
      await sendCriticalAlert(
        'oxapay_subscription_activation_failed',
        subError,
        { payment_id: payment.id, track_id: trackId, user_id: payment.user_id }
      );
      await supabase.from('payments').update({ status: 'pending' }).eq('id', payment.id);
      return NextResponse.json({ error: 'فشل تفعيل الاشتراك' }, { status: 500 });
    }

    // ٦. تحديث الرصيد
    const { error: creditsError } = await supabase
      .from('users_credits')
      .update({
        plan: payment.plan,
        credits_remaining: PLAN_QUESTIONS[payment.plan] || 100,
        is_plus: payment.plan !== 'starter',
      })
      .eq('user_id', payment.user_id);

    if (creditsError) {
      await sendCriticalAlert(
        'oxapay_credits_update_failed_inconsistent_state',
        creditsError,
        {
          payment_id: payment.id,
          user_id: payment.user_id,
          note: 'الاشتراك مفعّل لكن الرصيد لم يُحدَّث — يحتاج تدخل يدوي فوري',
        }
      );
    }

    // ٧. تأكيد حالة الدفعة النهائية
    await supabase
      .from('payments')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    // ٨. تسجيل الأحداث
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

    // ٩. إيميل التفعيل مع Idempotency
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('activation_email_sent_at')
      .eq('user_id', payment.user_id)
      .single();

    if (!subscription?.activation_email_sent_at) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(payment.user_id);
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

    // إصلاح M1: إعادة الدفعة من processing إلى pending إن كانت عالقة بسبب استثناء غير متوقع
    if (lockedPaymentId) {
      await supabase
        .from('payments')
        .update({ status: 'pending' })
        .eq('id', lockedPaymentId)
        .eq('status', 'processing');
    }

    await sendCriticalAlert(
      '/api/webhooks/oxapay',
      error,
      { context: 'oxapay_webhook_unhandled' }
    );
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 });
  }
}