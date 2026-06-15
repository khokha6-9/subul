import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramNotification } from '@/lib/telegram';
import { trackEvent } from '@/lib/events';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_PRICES: Record<string, number> = {
  starter: 1,
  plus: 3,
  pro: 7,
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId, userEmail, userName, plan } = await request.json();

    if (!userId || !userEmail || !plan) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    if (!PLAN_PRICES[plan]) {
      return NextResponse.json(
        { error: 'خطة غير صحيحة' },
        { status: 400 }
      );
    }

    const amount = PLAN_PRICES[plan];
    const apiKey = process.env.OXAPAY_API_KEY!;

    const oxaResponse = await fetch('https://api.oxapay.com/v1/payment/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant_api_key': apiKey,
      },
      body: JSON.stringify({
        amount,
        lifetime: 30,
        fee_paid_by_payer: 0,
        under_paid_coverage: 2.5,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/oxapay/webhook`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        description: `اشتراك سُبُل ${plan} - ${userEmail}`,
        order_id: `${plan}-${Date.now()}`.slice(0, 50),
      }),
    });

    const rawText = await oxaResponse.text();
    console.log('OxaPay Raw Response:', rawText);

    let oxaData;
    try {
      oxaData = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: 'خطأ في قراءة رد OxaPay' },
        { status: 500 }
      );
    }

    if (oxaData.status !== 200 || !oxaData.data?.payment_url) {
      console.error('OxaPay Error:', oxaData);
      return NextResponse.json(
        { error: oxaData.message || 'خطأ في إنشاء طلب الدفع' },
        { status: 500 }
      );
    }

    const trackId = oxaData.data.track_id;
    const paymentUrl = oxaData.data.payment_url;

    const { data: payment } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        plan,
        amount_usd: amount,
        payment_method: 'oxapay',
        status: 'pending',
        transaction_id: String(trackId),
        notes: paymentUrl,
      })
      .select()
      .single();
await trackEvent('payment_initiated', userId, {
    plan,
    amount,
    payment_method: 'oxapay',
    track_id: trackId,
    payment_id: payment?.id,
});
    await sendTelegramNotification(`
🔔 <b>طلب دفع جديد — USDT</b>

👤 <b>المستخدم:</b> ${userName || 'غير محدد'}
📧 <b>الإيميل:</b> ${userEmail}
📦 <b>الخطة:</b> ${plan}
💵 <b>المبلغ:</b> ${amount}$
🆔 <b>رقم التتبع:</b> ${trackId}
    `.trim());

    return NextResponse.json({
      success: true,
      payLink: paymentUrl,
      trackId,
      paymentId: payment?.id,
    });

  } catch (error) {
    console.error('خطأ عام:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}