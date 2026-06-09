import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET() {
  try {
    await sendWelcomeEmail('khaderalkhader2017@gmail.com', 'خضر');
    return NextResponse.json({ success: true, message: 'تم إرسال الإيميل' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}