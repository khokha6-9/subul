import { getGuides } from '@/lib/content/queries';
import ScholarshipsList from '@/components/content/ScholarshipsList';
import { ProtectedPage } from '@/lib/ProtectedPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المنح الدراسية للسوريين 2026 | سُبُل',
  description:
    'دليل شامل و موثّق لكل المنح الدراسية المتاحة للسوريين : DAAD , Erasmus , Türkiye Bursları , Chevening , Fulbright و المزيد . معلومات محدّثة و روابط رسمية',
};

export const revalidate = 60;

export default async function StudyAbroadPage() {
  const scholarships = await getGuides({
    category: 'study',
    audience: 'inside',
  });

  return (
    <ProtectedPage>
      <ScholarshipsList scholarships={scholarships} />
    </ProtectedPage>
  );
}