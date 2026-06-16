import { createClient } from '@supabase/supabase-js';
import { sendTelegramNotification } from '@/lib/telegram';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const THROTTLE_MINUTES = 5;
const MAX_RETRIES = 3;

// اقتطاع user_id لحماية الخصوصية
function truncateUserId(userId: string): string {
  if (!userId || userId.length < 8) return '***';
  return `${userId.slice(0, 3)}-***-${userId.slice(-3)}`;
}

// تنسيق الوقت
function formatTime(): string {
  return new Date().toLocaleString('ar-SA', {
    timeZone: 'Asia/Beirut',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// التحقق من الـ Throttling
async function isThrottled(context: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('monitoring_throttle')
      .select('last_sent_at, count')
      .eq('context', context)
      .single();

    if (!data) return false;

    const lastSent = new Date(data.last_sent_at);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSent.getTime()) / (1000 * 60);

    return diffMinutes < THROTTLE_MINUTES;
  } catch {
    return false;
  }
}

// تحديث الـ Throttle
async function updateThrottle(context: string): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from('monitoring_throttle')
      .select('count')
      .eq('context', context)
      .single();

    await supabase
      .from('monitoring_throttle')
      .upsert({
        context,
        last_sent_at: new Date().toISOString(),
        count: (existing?.count || 0) + 1,
      });
  } catch (error) {
    console.error('Throttle update error:', error);
  }
}

// حفظ الإشعار في DB كـ fallback
async function saveAlertToDB(
  context: string,
  severity: string,
  message: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    await supabase.from('monitoring_alerts').insert({
      context,
      severity,
      message,
      metadata,
      status: 'pending',
    });
  } catch (error) {
    console.error('Failed to save alert to DB:', error);
  }
}

// إرسال عبر تيليغرام مع Fallback
async function sendAlert(
  context: string,
  severity: string,
  message: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    await sendTelegramNotification(message);

    // تحديث حالة الإشعار لـ sent
    await supabase
      .from('monitoring_alerts')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('context', context)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

  } catch (telegramError) {
    console.error('Telegram failed, saving to DB:', telegramError);

    // حفظ في DB للمراجعة اليدوية
    await saveAlertToDB(context, severity, message, metadata);

    // إعادة المحاولة بعد دقيقة
    setTimeout(async () => {
      try {
        const { data: pendingAlerts } = await supabase
          .from('monitoring_alerts')
          .select('*')
          .eq('status', 'pending')
          .lt('retry_count', MAX_RETRIES)
          .order('created_at', { ascending: true })
          .limit(5);

        for (const alert of pendingAlerts || []) {
          try {
            await sendTelegramNotification(alert.message);
            await supabase
              .from('monitoring_alerts')
              .update({ status: 'sent', sent_at: new Date().toISOString() })
              .eq('id', alert.id);
          } catch {
            await supabase
              .from('monitoring_alerts')
              .update({
                retry_count: alert.retry_count + 1,
                status: alert.retry_count + 1 >= MAX_RETRIES ? 'failed' : 'pending',
              })
              .eq('id', alert.id);
          }
        }
      } catch (retryError) {
        console.error('Retry failed:', retryError);
      }
    }, 60 * 1000);
  }
}

// ═══════════════════════════════
// الدوال العامة
// ═══════════════════════════════

export async function sendCriticalAlert(
  context: string,
  error: unknown,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const throttled = await isThrottled(`critical:${context}`);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // اقتطاع user_id إذا موجود
    if (metadata.user_id && typeof metadata.user_id === 'string') {
      metadata.user_id = truncateUserId(metadata.user_id);
    }

    if (throttled) {
      // حفظ في DB بدون إرسال تيليغرام
      await saveAlertToDB(`critical:${context}`, 'critical', errorMessage, metadata);
      return;
    }

    const message = `
🚨 <b>CRITICAL — ${context}</b>
━━━━━━━━━━━━━━━━━━━━
❌ ${errorMessage}
${Object.entries(metadata).map(([k, v]) => `• ${k}: ${v}`).join('\n')}
⏰ ${formatTime()}
━━━━━━━━━━━━━━━━━━━━
⚠️ سيتم تجميع الإشعارات المتكررة لـ ${THROTTLE_MINUTES} دقائق
🔗 vercel.com/subul/logs
    `.trim();

    await updateThrottle(`critical:${context}`);
    await sendAlert(`critical:${context}`, 'critical', message, metadata);

  } catch (monitoringError) {
    console.error('Monitoring error:', monitoringError);
  }
}

export async function sendWarningAlert(
  context: string,
  message: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const throttled = await isThrottled(`warning:${context}`);

    if (metadata.user_id && typeof metadata.user_id === 'string') {
      metadata.user_id = truncateUserId(metadata.user_id);
    }

    if (throttled) {
      await saveAlertToDB(`warning:${context}`, 'warning', message, metadata);
      return;
    }

    const formattedMessage = `
⚠️ <b>WARNING — ${context}</b>
━━━━━━━━━━━━━━━━━━━━
${message}
${Object.entries(metadata).map(([k, v]) => `• ${k}: ${v}`).join('\n')}
⏰ ${formatTime()}
    `.trim();

    await updateThrottle(`warning:${context}`);
    await sendAlert(`warning:${context}`, 'warning', formattedMessage, metadata);

  } catch (monitoringError) {
    console.error('Monitoring warning error:', monitoringError);
  }
}

// جلب عدد الإشعارات المعلّقة للـ Badge
export async function getPendingAlertsCount(): Promise<number> {
  try {
    const { count } = await supabase
      .from('monitoring_alerts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    return count || 0;
  } catch {
    return 0;
  }
}