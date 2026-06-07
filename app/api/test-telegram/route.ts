import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function GET(): Promise<NextResponse> {
  await sendTelegramNotification(`
🧪 <b>اختبار بوت سُبُل</b>

✅ البوت يعمل بشكل صحيح
🚀 جاهز لاستقبال إشعارات شام كاش
  `.trim());

  return NextResponse.json({ success: true, message: 'تم إرسال رسالة الاختبار' });
}