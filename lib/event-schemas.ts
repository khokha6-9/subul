export type ClientEventType =
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'pricing_page_viewed'
  | 'session_started'
  | 'payment_initiated';

type FieldType = 'string' | 'number' | 'boolean';

interface FieldSchema {
  type: FieldType;
  required: boolean;
}

type EventSchema = Record<string, FieldSchema>;

const SCHEMAS: Record<ClientEventType, EventSchema> = {
  onboarding_started: {},
  onboarding_completed: {
    location:         { type: 'string',  required: false },
    goal:             { type: 'string',  required: false },
    experience_level: { type: 'string',  required: false },
    country:          { type: 'string',  required: false },
  },
  onboarding_skipped: {
    step: { type: 'number', required: false },
  },
  pricing_page_viewed: {},
  session_started: {},
  payment_initiated: {
    plan:           { type: 'string', required: true  },
    amount:         { type: 'number', required: true  },
    payment_method: { type: 'string', required: true  },
  },
};

const MAX_METADATA_BYTES = 2048; // 2 KB

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEventMetadata(
  eventType: ClientEventType,
  metadata: Record<string, unknown>
): ValidationResult {
  // التحقق من الحجم
  const metadataStr = JSON.stringify(metadata);
  if (Buffer.byteLength(metadataStr, 'utf8') > MAX_METADATA_BYTES) {
    return { valid: false, error: 'metadata أكبر من الحد المسموح (2KB)' };
  }

  const schema = SCHEMAS[eventType];

  // التحقق من الحقول المطلوبة
  for (const [field, rules] of Object.entries(schema)) {
    if (rules.required && !(field in metadata)) {
      return { valid: false, error: `الحقل ${field} مطلوب` };
    }
  }

  // التحقق من عدم وجود حقول غير مسموحة
  for (const key of Object.keys(metadata)) {
    if (!(key in schema)) {
      return { valid: false, error: `الحقل ${key} غير مسموح به` };
    }
  }

  // التحقق من الأنواع
  for (const [key, value] of Object.entries(metadata)) {
    const fieldSchema = schema[key];
    if (!fieldSchema) continue;
    if (typeof value !== fieldSchema.type) {
      return {
        valid: false,
        error: `الحقل ${key} يجب أن يكون من نوع ${fieldSchema.type}`,
      };
    }
  }

  return { valid: true };
}

export const CLIENT_ALLOWED_EVENTS = Object.keys(SCHEMAS) as ClientEventType[];