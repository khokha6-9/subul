import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type EventType =
  | 'user_registered'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'question_asked'
  | 'conversation_created'
  | 'pricing_page_viewed'
  | 'payment_initiated'
  | 'payment_completed'
  | 'subscription_activated'
  | 'credits_depleted'
  | 'session_started';

const EVENT_META: Record<EventType, { category: string; is_user_visible: boolean }> = {
  user_registered:        { category: 'system',     is_user_visible: false },
  onboarding_started:     { category: 'engagement', is_user_visible: false },
  onboarding_completed:   { category: 'engagement', is_user_visible: true  },
  onboarding_skipped:     { category: 'engagement', is_user_visible: false },
  question_asked:         { category: 'engagement', is_user_visible: true  },
  conversation_created:   { category: 'engagement', is_user_visible: true  },
  pricing_page_viewed:    { category: 'engagement', is_user_visible: false },
  payment_initiated:      { category: 'billing',    is_user_visible: false },
  payment_completed:      { category: 'billing',    is_user_visible: true  },
  subscription_activated: { category: 'billing',    is_user_visible: true  },
  credits_depleted:       { category: 'system',     is_user_visible: false },
  session_started:        { category: 'system',     is_user_visible: false },
};

const SALT = process.env.WEBHOOK_SECRET || 'subul-default-salt';

export function hashIp(ip: string): string {
  return createHash('sha256')
    .update(ip + SALT)
    .digest('hex')
    .slice(0, 32);
}

export interface TrackEventOptions {
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  source?: 'web' | 'mobile' | 'api';
}

export async function trackEvent(
  eventType: EventType,
  userId: string | null,
  metadata: Record<string, unknown> = {},
  options: TrackEventOptions = {}
): Promise<void> {
  try {
    const meta = EVENT_META[eventType];
    await supabaseService.from('events').insert({
      event_type: eventType,
      event_category: meta.category,
      is_user_visible: meta.is_user_visible,
      user_id: userId,
      metadata,
      ip_hash: options.ipAddress ? hashIp(options.ipAddress) : null,
      user_agent: options.userAgent || null,
      session_id: options.sessionId || null,
      source: options.source || 'web',
    });
  } catch (error) {
    console.error(`Failed to track event [${eventType}]:`, error);
  }
}