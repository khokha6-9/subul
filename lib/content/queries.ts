// ==================================================
// Content Queries - دوال قراءة المحتوى من Supabase
// ==================================================

import { supabase } from '@/lib/supabase';
import type { GuideWithCountry, Country } from '@/lib/types/content';

/**
 * جلب دليل واحد عبر slug
 * مثال : getGuideBySlug('daad-germany')
 */
export async function getGuideBySlug(slug: string): Promise<GuideWithCountry | null> {
  const { data, error } = await supabase
    .from('guides')
    .select(`
      *,
      country:countries(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching guide:', error);
    return null;
  }

  return data as GuideWithCountry;
}

/**
 * جلب كل الأدلة المنشورة
 * مع فلترة اختيارية حسب الدولة و الفئة
 */
export async function getGuides(filters?: {
  countrySlug?: string;
  category?: string;
  audience?: 'abroad' | 'inside';
  featuredOnly?: boolean;
}): Promise<GuideWithCountry[]> {
  let query = supabase
    .from('guides')
    .select(`
      *,
      country:countries(*)
    `)
    .eq('status', 'published')
    .order('display_order', { ascending: true });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.audience) {
    query = query.eq('audience', filters.audience);
  }

  if (filters?.featuredOnly) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching guides:', error);
    return [];
  }

  let guides = (data || []) as GuideWithCountry[];

  // فلترة حسب slug الدولة ( بعد الجلب لأنها relation )
  if (filters?.countrySlug) {
    guides = guides.filter((g) => g.country?.slug === filters.countrySlug);
  }

  return guides;
}

/**
 * جلب كل الدول النشطة
 */
export async function getCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching countries:', error);
    return [];
  }

  return data || [];
}