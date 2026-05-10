// ==================================================
// Types for Content System
// تعريف هيكل البيانات اللي بنقرأها من Supabase
// ==================================================

export type Country = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string | null;
  flag: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// ==================================================
// محتوى الدليل ( JSONB structure )
// ==================================================

export type GuideListSection = {
  title: string;
  icon: string;
  items: string[];
};

export type GuideDeadlineItem = {
  date: string;
  description: string;
};

export type GuideDeadlinesSection = {
  title: string;
  icon: string;
  items: GuideDeadlineItem[];
};

export type GuideContent = {
  intro?: string;
  amounts?: GuideListSection;
  requirements?: GuideListSection;
  deadlines?: GuideDeadlinesSection;
  steps?: GuideListSection;
  // أي قسم إضافي ممكن نضيفه لاحقاً
  [key: string]: unknown;
};

// ==================================================
// الدليل الكامل
// ==================================================

export type GuideStatus = 'draft' | 'review' | 'published' | 'archived';
export type GuideCategory = 'study' | 'work' | 'travel' | 'asylum' | 'general';
export type GuideAudience = 'abroad' | 'inside';

export type Guide = {
  id: number;
  slug: string;
  country_id: number | null;
  category: GuideCategory;
  audience: GuideAudience;

  title: string;
  subtitle: string | null;
  description: string | null;
  hero_emoji: string | null;
  accent_color: string;

  content: GuideContent;

  source_url: string | null;
  source_name: string | null;

  is_featured: boolean;
  display_order: number;

  status: GuideStatus;
  last_verified_at: string | null;
  next_review_date: string | null;

  meta_title: string | null;
  meta_description: string | null;

  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// مع الدولة المرتبطة ( عند الجلب )
export type GuideWithCountry = Guide & {
  country: Country | null;
};