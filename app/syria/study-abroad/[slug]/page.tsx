import { notFound } from 'next/navigation';
import { getGuideBySlug } from '@/lib/content/queries';
import GuideDisplay from '@/components/content/GuideDisplay';
import { ProtectedPage } from '@/lib/ProtectedPage';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO : توليد meta tags ديناميكياً من DB
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'غير موجود | سُبُل',
    };
  }

  return {
    title: guide.meta_title || `${guide.title} | سُبُل`,
    description: guide.meta_description || guide.description || undefined,
  };
}

export default async function StudyAbroadGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <ProtectedPage>
      <GuideDisplay
        guide={guide}
        backHref="/syria/study-abroad"
        backLabel="← الرجوع لقائمة المنح"
      />
    </ProtectedPage>
  );
}