import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { sendWelcomeEmail } from '@/lib/email';

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret) {
      console.error('WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500 }
      );
    }

    const providedSecret = authHeader?.replace('Bearer ', '') || '';

    if (!safeCompare(providedSecret, secret)) {
      console.warn('Invalid webhook secret attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const { type, table, record } = payload;

    if (type !== 'INSERT') {
      return NextResponse.json({ skipped: 'not insert' });
    }

    if (table !== 'users') {
      return NextResponse.json({ skipped: 'wrong table' });
    }

    if (!record?.email) {
      return NextResponse.json(
        { error: 'No email in record' },
        { status: 400 }
      );
    }

    try {
      await sendWelcomeEmail(
        record.email,
        record.raw_user_meta_data?.full_name
      );
      console.log('Welcome email sent to:', record.email);
      return NextResponse.json({ success: true });
   } catch (emailError: unknown) {
      console.error('Email failed for user:', record.id, emailError);

      const isPermanentError =
  emailError instanceof Error &&
  ('code' in emailError
    ? (emailError as NodeJS.ErrnoException).code === 'INVALID_EMAIL'
    : false);

      if (isPermanentError) {
        return NextResponse.json({ logged: 'permanent failure' });
      }

      return NextResponse.json(
        { error: 'temporary failure' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}