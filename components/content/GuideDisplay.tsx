'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties } from 'react';
import type { GuideWithCountry } from '@/lib/types/content';

type Props = {
  guide: GuideWithCountry;
  backHref?: string;
  backLabel?: string;
};

export default function GuideDisplay({
  guide,
  backHref = '/',
  backLabel = '← الرجوع',
}: Props) {
  const router = useRouter();
  const content = guide.content;
  const accent = guide.accent_color || '#c9a84c';

  const buttonStyle: CSSProperties = {
    backgroundColor: accent,
    color: '#000',
  };

  const heroCardStyle: CSSProperties = {
    borderColor: accent + '4D',
    background: 'linear-gradient(135deg, ' + accent + '1A, transparent)',
  };

  const ctaCardStyle: CSSProperties = {
    borderColor: accent + '4D',
    background: 'linear-gradient(135deg, ' + accent + '33, transparent)',
  };

  const accentTextStyle: CSSProperties = {
    color: accent,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => router.push(backHref)}
          className="text-sm hover:underline mb-8"
          style={accentTextStyle}
        >
          {backLabel}
        </button>

        <div
          className="rounded-2xl border p-8 md:p-12 mb-8"
          style={heroCardStyle}
        >
          <div className="flex items-start gap-4 mb-6">
            {guide.hero_emoji && (
              <span className="text-5xl">{guide.hero_emoji}</span>
            )}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {guide.title}
              </h1>
              {guide.subtitle && (
                <p className="text-lg" style={accentTextStyle}>
                  {guide.subtitle}
                </p>
              )}
            </div>
          </div>

          {content.intro && (
            <p className="text-gray-300 leading-relaxed text-base md:text-lg">
              {content.intro}
            </p>
          )}
        </div>

        {content.amounts && (
          <Section
            title={content.amounts.title}
            icon={content.amounts.icon}
            accent={accent}
          >
            <ul className="space-y-2 text-gray-300">
              {content.amounts.items.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </Section>
        )}

        {content.requirements && (
          <Section
            title={content.requirements.title}
            icon={content.requirements.icon}
            accent={accent}
          >
            <ul className="space-y-2 text-gray-300">
              {content.requirements.items.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </Section>
        )}

        {content.deadlines && (
          <Section
            title={content.deadlines.title}
            icon={content.deadlines.icon}
            accent={accent}
          >
            <div className="space-y-3">
              {content.deadlines.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                >
                  <span
                    className="font-bold min-w-[120px]"
                    style={accentTextStyle}
                  >
                    {item.date}
                  </span>
                  <span className="text-gray-300">{item.description}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {content.steps && (
          <Section
            title={content.steps.title}
            icon={content.steps.icon}
            accent={accent}
          >
            <ol className="space-y-2 text-gray-300 list-decimal list-inside">
              {content.steps.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </Section>
        )}

        {guide.source_url && (
          <div className="mt-8">
            <a
              href={guide.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
              style={buttonStyle}
            >
              {guide.source_name || 'الرابط الرسمي'} ←
            </a>
          </div>
        )}

        {guide.last_verified_at && (
          <p className="text-xs text-gray-500 mt-8 pt-8 border-t border-white/5">
            آخر تحقّق من المعلومات :{' '}
            {new Date(guide.last_verified_at).toLocaleDateString('ar-SY', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        <div
          className="rounded-2xl border p-8 mt-12 text-center"
          style={ctaCardStyle}
        >
          <h2 className="text-2xl font-bold mb-3">عندك سؤال محدد ؟</h2>
          <p className="text-gray-300 mb-6">
            المساعد الذكي بيقدر يجاوب على أسئلتك التفصيلية
          </p>
          <Link
            href="/chat"
            className="inline-block px-6 py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
            style={buttonStyle}
          >
            اسأل المساعد الذكي ←
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  accent,
  children,
}: {
  title: string;
  icon: string;
  accent: string;
  children: React.ReactNode;
}) {
  const headingStyle: CSSProperties = {
    color: accent,
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 mb-4">
      <h2
        className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2"
        style={headingStyle}
      >
        <span>{icon}</span>
        <span>{title}</span>
      </h2>
      {children}
    </div>
  );
}
