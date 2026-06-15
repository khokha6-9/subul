import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const WINDOW_MS = 60 * 1000; // دقيقة واحدة
const USER_LIMIT = 60;       // 60 طلب / دقيقة لكل مستخدم
const IP_LIMIT = 100;        // 100 طلب / دقيقة لكل IP
const BLOCK_MS = 5 * 60 * 1000; // حظر 5 دقائق

function hashKey(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

interface RateLimitResult {
  allowed: boolean;
  reason?: string;
}

async function checkLimit(key: string, limit: number): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);
  const blockedUntil = new Date(now.getTime() + BLOCK_MS);

  try {
    // جلب السجل الحالي
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('key', key)
      .single();

    // إذا كان محظوراً
    if (existing?.blocked_until && new Date(existing.blocked_until) > now) {
      return { allowed: false, reason: 'too_many_requests' };
    }

    // إذا انتهت النافذة الزمنية — إعادة تعيين
    if (!existing || new Date(existing.window_start) < windowStart) {
      await supabase
        .from('rate_limits')
        .upsert({
          key,
          count: 1,
          window_start: now.toISOString(),
          blocked_until: null,
        });
      return { allowed: true };
    }

    // إذا تجاوز الحد
    if (existing.count >= limit) {
      await supabase
        .from('rate_limits')
        .update({ blocked_until: blockedUntil.toISOString() })
        .eq('key', key);
      return { allowed: false, reason: 'too_many_requests' };
    }

    // زيادة العداد
    await supabase
      .from('rate_limits')
      .update({ count: existing.count + 1 })
      .eq('key', key);

    return { allowed: true };

  } catch (error) {
    // عند فشل rate limiting — نسمح بالطلب ولا نوقف الخدمة
    console.error('Rate limit check error:', error);
    return { allowed: true };
  }
}

export async function checkRateLimit(
  userId: string,
  ipAddress: string
): Promise<RateLimitResult> {
  const userKey = `user:${hashKey(userId)}`;
  const ipKey = `ip:${hashKey(ipAddress)}`;

  // فحص المستخدم أولاً
  const userResult = await checkLimit(userKey, USER_LIMIT);
  if (!userResult.allowed) return userResult;

  // فحص الـ IP
  const ipResult = await checkLimit(ipKey, IP_LIMIT);
  if (!ipResult.allowed) return ipResult;

  return { allowed: true };
}