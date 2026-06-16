import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendCriticalAlert } from '@/lib/monitoring';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'RESEND_API_KEY',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
  'WEBHOOK_SECRET',
];

export async function GET() {
  const results: Record<string, boolean> = {};
  const errors: string[] = [];

  // التحقق من متغيرات البيئة
  const missingEnvVars = REQUIRED_ENV_VARS.filter(
    (v) => !process.env[v]
  );

  results.env_vars = missingEnvVars.length === 0;
  if (missingEnvVars.length > 0) {
    errors.push(`متغيرات بيئة ناقصة: ${missingEnvVars.join(', ')}`);
  }

  // التحقق من Supabase
  try {
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    results.supabase = !error;
    if (error) errors.push(`Supabase: ${error.message}`);
  } catch (err) {
    results.supabase = false;
    errors.push(`Supabase: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
  }

  const allHealthy = Object.values(results).every(Boolean);

  // إرسال إشعار عند وجود مشكلة
  if (!allHealthy) {
    await sendCriticalAlert(
      '/api/health',
      new Error(errors.join(' | ')),
      { checks: JSON.stringify(results) }
    );
  }

  return NextResponse.json({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: results,
    errors: errors.length > 0 ? errors : undefined,
  }, {
    status: allHealthy ? 200 : 503,
  });
}