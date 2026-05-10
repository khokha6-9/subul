'use client';

import { useRouter } from 'next/navigation';

export default function SyriaPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="px-6 pt-24 pb-16 max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="text-[#c9a84c] mb-8 hover:underline text-sm"
        >
          ← الرجوع للرئيسية
        </button>

        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          أنا في <span className="text-[#c9a84c]">سوريا</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
          دليلك الشامل لكل خيارات المستقبل من سوريا
        </p>
      </section>
    </div>
  );
}