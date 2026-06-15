import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { trackEvent } from '@/lib/events';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  CLIENT_ALLOWED_EVENTS,
  ClientEventType,
  validateEventMetadata,
} from '@/lib/event-schemas';

function getIpAddress(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '0.0.0.0'
  );
}

export async function POST(request: NextRequest) {
  try {
    // التحقق من الـ token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user } } = await userSupabase.auth.getUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate Limiting
    const ipAddress = getIpAddress(request);
    const rateLimitResult = await checkRateLimit(user.id, ipAddress);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'طلبات كثيرة جداً، حاول لاحقاً' },
        { status: 429 }
      );
    }

    // التحقق من الـ body
    const body = await request.json();
    const { eventType, metadata = {}, sessionId } = body;

    // التحقق من eventType
    if (!CLIENT_ALLOWED_EVENTS.includes(eventType as ClientEventType)) {
      return NextResponse.json(
        { error: 'هذا الحدث غير مسموح به' },
        { status: 403 }
      );
    }

    // التحقق من metadata
    const validation = validateEventMetadata(
      eventType as ClientEventType,
      metadata
    );
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // تسجيل الـ event
    await trackEvent(
      eventType as ClientEventType,
      user.id,
      metadata,
      {
        ipAddress,
        userAgent: request.headers.get('user-agent') || undefined,
        sessionId: sessionId || undefined,
        source: 'web',
      }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}