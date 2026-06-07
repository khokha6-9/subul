const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function sendTelegramNotification(message: string): Promise<void> {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('خطأ في إرسال إشعار تيليغرام:', error);
  }
}

export function formatShamCashNotification(data: {
  userName: string;
  userEmail: string;
  plan: string;
  amount: number;
  transactionId: string;
  paymentId: string;
}): string {
  const planNames: Record<string, string> = {
    starter: 'سُبُل ستارتر — 1$',
    plus: 'سُبُل بلس — 3$',
    pro: 'سُبُل برو — 7$',
  };

  return `
🔔 <b>طلب دفع جديد — شام كاش</b>

👤 <b>المستخدم:</b> ${data.userName}
📧 <b>الإيميل:</b> ${data.userEmail}
📦 <b>الخطة:</b> ${planNames[data.plan] || data.plan}
💵 <b>المبلغ:</b> ${data.amount}$
🧾 <b>رقم العملية:</b> ${data.transactionId}
🆔 <b>رقم الطلب:</b> ${data.paymentId}

⏳ في انتظار مراجعتك على لوحة الأدمن.
  `.trim();
}