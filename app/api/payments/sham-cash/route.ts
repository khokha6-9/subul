import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramNotification, formatShamCashNotification } from '@/lib/telegram';

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
    const body = await request.json();
    const { userId, userEmail, userName, plan, transactionId } = body;

    if (!userId || !userEmail || !plan || !transactionId) {
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

    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        plan,
        amount_usd: PLAN_PRICES[plan],
        payment_method: 'sham_cash',
        status: 'pending',
        transaction_id: transactionId,
      })
      .select()
      .single();

    if (error) {
      console.error('خطأ في حفظ الدفعة:', error);
      return NextResponse.json(
        { error: 'حدث خطأ، حاول مجدداً' },
        { status: 500 }
      );
    }

    const message = formatShamCashNotification({
      userName: userName || 'غير محدد',
      userEmail,
      plan,
      amount: PLAN_PRICES[plan],
      transactionId,
      paymentId: payment.id,
    });

    await sendTelegramNotification(message);

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      message: 'تم استلام طلبك، سيتم تفعيل اشتراكك خلال 24 ساعة',
    });

  } catch (error) {
    console.error('خطأ عام:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}