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

type ActivationResult = {
  result: string;
  payment_id?: string;
  user_id?: string;
  plan?: string;
  credits?: number;
  amount_usd?: number;
  expires_at?: string;
  paid_currency?: string;
  paid_amount?: number;
  expected_amount?: number;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ١. قراءة raw body أولاً — ضروري لحساب HMAC بدقة
  const rawBody = await request.text();
  const receivedHmac = request.headers.get('hmac');

  // ٢. التحقق من التوقيع قبل أي معالجة أخرى
  if (!verifyHmacSignature(rawBody, receivedHmac)) {
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

    // ٤. بناء خريطة الأرصدة من lib/plans.ts — مصدر الحقيقة الوحيد
    const planCredits = {
      starter: getPlanInfo('starter')?.credits ?? null,
      plus: getPlanInfo('plus')?.credits ?? null,
      pro: getPlanInfo('pro')?.credits ?? null,
    };

    // ٥. استدعاء الدالة الذرّية — كل المنطق المالي داخل معاملة واحدة
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'activate_oxapay_payment',
      {
        p_track_id: String(trackId),
        p_paid_amount: Number(body.amount),
        p_paid_currency: String(body.currency || ''),
        p_plan_credits: planCredits,
      }
    );

    if (rpcError) {
      // خطأ نقل/قاعدة بيانات عابر — ندع OxaPay يعيد المحاولة
      console.error('RPC error:', rpcError);
      await sendCriticalAlert(
        'oxapay_rpc_error',
        rpcError,
        { track_id: trackId }
      );
      return NextResponse.json({ error: 'rpc failed' }, { status: 500 });
    }

    const activation = rpcData as ActivationResult;

    // ٦. التعامل مع نتيجة الدالة حسب جدول القرارات المعتمد
    switch (activation.result) {

      case 'already_processed':
        // متوقّع من إعادة محاولات OxaPay — لا حاجة لأي إشعار
        return NextResponse.json({ success: true });

      case 'not_found':
        // مؤكَّد أنه لنا (مرّ HMAC) لكن الصف مفقود — تنبيه حرج واحد، لا إعادة محاولة
        await sendCriticalAlert(
          'oxapay_payment_not_found',
          new Error('دفعة مؤكَّدة من OxaPay غير موجودة في قاعدتنا'),
          { track_id: trackId }
        );
        return NextResponse.json({ success: true });

      case 'currency_mismatch':
        await sendCriticalAlert(
          'oxapay_unexpected_currency',
          new Error('عملة غير متوقعة في webhook'),
          {
            payment_id: activation.payment_id,
            track_id: trackId,
            currency: activation.paid_currency,
          }
        );
        return NextResponse.json({ success: true });

      case 'amount_mismatch':
        await sendCriticalAlert(
          'oxapay_amount_mismatch',
          new Error('المبلغ المستلم لا يطابق المتوقع'),
          {
            payment_id: activation.payment_id,
            track_id: trackId,
            paid_amount: activation.paid_amount,
            expected_amount: activation.expected_amount,
          }
        );
        return NextResponse.json({ success: true });

      case 'invalid_expected_amount':
        await sendCriticalAlert(
          'oxapay_invalid_expected_amount',
          new Error('المبلغ المتوقع للدفعة غير صالح أو صفري'),
          { payment_id: activation.payment_id, track_id: trackId }
        );
        return NextResponse.json({ success: true });

      case 'unknown_plan':
        await sendCriticalAlert(
          'oxapay_unknown_plan',
          new Error('خطة غير معروفة في خريطة الأرصدة'),
          { payment_id: activation.payment_id, track_id: trackId, plan: activation.plan }
        );
        return NextResponse.json({ success: true });

      case 'activated':
        // نجاح — نكمل بالتأثيرات الجانبية (الإيميل وتيليجرام)
        break;

      default:
        // نتيجة غير متوقعة من الدالة — لا يجب أن يحدث، لكن نتعامل بأمان
        await sendCriticalAlert(
          'oxapay_unknown_rpc_result',
          new Error(`نتيجة غير معروفة من الدالة: ${activation.result}`),
          { track_id: trackId }
        );
        return NextResponse.json({ success: true });
    }

    // ٧. التأثيرات الجانبية — تُنفَّذ فقط بعد نجاح التفعيل الفعلي
    const userId = activation.user_id!;
    const plan = activation.plan!;
    const credits = activation.credits!;
    const paymentId = activation.payment_id!;
    const expiresAt = new Date(activation.expires_at!);

    // تسجيل الأحداث
    await trackEvent('payment_completed', userId, {
      plan,
      amount: activation.amount_usd,
      payment_method: 'oxapay',
      track_id: trackId,
    });

    await trackEvent('subscription_activated', userId, {
      plan,
      payment_method: 'oxapay',
      expires_at: activation.expires_at,
    });

    // إيميل التفعيل مع Idempotency (نفس منطق سابق، يبقى كما هو خارج الدالة لأنه يتعامل مع Resend وليس DB)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('activation_email_sent_at')
      .eq('user_id', userId)
      .single();

    if (!subscription?.activation_email_sent_at) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(userId);
        const userEmail = userData?.user?.email;
        const userName = userData?.user?.user_metadata?.full_name;

        if (!userEmail) {
          await sendTelegramNotification(
            `⚠️ تفعيل OxaPay بدون إيميل\nالمستخدم: ${userId}\nالخطة: ${plan}`
          );
        } else if (!isValidEmail(userEmail)) {
          await sendTelegramNotification(
            `⚠️ تنسيق إيميل خاطئ — OxaPay\nالمستخدم: ${userId}\nالإيميل: ${userEmail}`
          );
        } else {
          const planInfo = getPlanInfo(plan);
          await sendSubscriptionActivatedEmail(
            userEmail,
            plan,
            credits,
            userName,
            planInfo?.priceUsd,
            expiresAt
          );
          await supabase
            .from('subscriptions')
            .update({ activation_email_sent_at: new Date().toISOString() })
            .eq('user_id', userId);
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        await sendTelegramNotification(
          `🚨 فشل إرسال إيميل تفعيل — OxaPay\nالمستخدم: ${userId}\nالخطة: ${plan}\nالسبب: ${emailError instanceof Error ? emailError.message : 'خطأ غير معروف'}\n\nاذهب للوحة الأدمن وأعد المحاولة يدوياً`
        );
      }
    }

    await sendTelegramNotification(`
✅ <b>دفع مكتمل — USDT</b>

📦 <b>الخطة:</b> ${plan}
💵 <b>المبلغ:</b> ${activation.amount_usd}$
🆔 <b>رقم التتبع:</b> ${trackId}
⚡ تم تفعيل الاشتراك تلقائياً عبر RPC ذرّي
    `.trim());

    return NextResponse.json({ success: true });

  } catch (error) {
    // خطأ غير متوقع تماماً (مثل فشل الاتصال بـ Supabase نفسه قبل استدعاء RPC)
    console.error('خطأ في webhook:', error);
    await sendCriticalAlert(
      '/api/webhooks/oxapay',
      error,
      { context: 'oxapay_webhook_unhandled' }
    );
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 });
  }
}