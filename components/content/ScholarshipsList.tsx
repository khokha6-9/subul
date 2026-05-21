'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Award,
  MapPin,
  Calendar,
  ArrowUpLeft,
  Sparkles,
  X,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import type { GuideWithCountry } from '@/lib/types/content';

type Props = {
  scholarships: GuideWithCountry[];
};

export default function ScholarshipsList({ scholarships }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const uniqueCountries = useMemo(() => {
    const countriesMap = new Map<string, { slug: string; name: string; flag: string }>();
    scholarships.forEach((s) => {
      if (s.country) {
        countriesMap.set(s.country.slug, {
          slug: s.country.slug,
          name: s.country.name_ar,
          flag: s.country.flag,
        });
      }
    });
    return Array.from(countriesMap.values());
  }, [scholarships]);

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.country?.name_ar.includes(searchQuery);

      const matchesCountry =
        selectedCountry === null || s.country?.slug === selectedCountry;

      return matchesSearch && matchesCountry;
    });
  }, [scholarships, searchQuery, selectedCountry]);

  const featuredCount = scholarships.filter((s) => s.is_featured).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <HeroSection
        totalCount={scholarships.length}
        featuredCount={featuredCount}
        countriesCount={uniqueCountries.length}
        onBack={() => router.push('/syria')}
      />

      <FiltersSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        countries={uniqueCountries}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        resultsCount={filteredScholarships.length}
      />

      <ScholarshipsGrid
        scholarships={filteredScholarships}
        onScholarshipClick={(slug) => router.push(`/syria/study-abroad/${slug}`)}
      />

      <TipsSection />

      <CtaSection onChatClick={() => router.push('/chat')} />
    </div>
  );
}

function HeroSection({
  totalCount,
  featuredCount,
  countriesCount,
  onBack,
}: {
  totalCount: number;
  featuredCount: number;
  countriesCount: number;
  onBack: () => void;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(201, 168, 76, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="px-6 pt-12 pb-12 max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-sm text-white/50 hover:text-[#c9a84c] transition-colors"
          >
            ← الرجوع لقسم سوريا
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
            <span className="text-xs font-medium text-[#c9a84c]">
              محدّث لعام 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6"
          >
            <span className="block text-white">المنح الدراسية</span>
            <span className="block bg-gradient-to-r from-[#c9a84c] via-[#e9b831] to-[#c9a84c] bg-clip-text text-transparent">
              المتاحة للسوريين
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-white/60 max-w-2xl mb-10"
          >
            دليل شامل و موثّق لكل المنح المتاحة , مع شروط دقيقة و مواعيد محدّثة
            و روابط رسمية للتقديم
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/5 w-full max-w-2xl"
          >
            <StatBox icon={Award} value={totalCount} label="منحة متاحة" />
            <div className="w-px bg-white/5" />
            <StatBox
              icon={Sparkles}
              value={featuredCount}
              label="منحة مميّزة"
            />
            <div className="w-px bg-white/5" />
            <StatBox icon={MapPin} value={countriesCount} label="دولة مستهدفة" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatBox({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-[#c9a84c]" />
        <span className="text-3xl font-bold text-white">+{value}</span>
      </div>
      <div className="text-xs text-white/40 tracking-wider">{label}</div>
    </div>
  );
}

function FiltersSection({
  searchQuery,
  onSearchChange,
  countries,
  selectedCountry,
  onCountryChange,
  resultsCount,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  countries: { slug: string; name: string; flag: string }[];
  selectedCountry: string | null;
  onCountryChange: (slug: string | null) => void;
  resultsCount: number;
}) {
  return (
    <section className="px-6 py-8 max-w-6xl mx-auto border-t border-white/5">
      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
       <input
  id="search-input"           // ✅ ضفت id
  name="search"               // ✅ ضفت name
  type="text"
  value={searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
  placeholder="ابحث عن منحة , دولة , أو تخصص ..."
  autoComplete="off"          // ✅ ضفت autocomplete
  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-white/50 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
  // ✅ غيّرت placeholder-white/30 → placeholder-white/50 (أوضح)
/>
{searchQuery && (

          <button
            onClick={() => onSearchChange('')}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 hover:text-white/60"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-4 h-4 text-white/40" />
        <span className="text-sm text-white/60">فلترة حسب الدولة :</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <CountryChip
          flag="🌍"
          name="كل الدول"
          isSelected={selectedCountry === null}
          onClick={() => onCountryChange(null)}
        />
        {countries.map((country) => (
          <CountryChip
            key={country.slug}
            flag={country.flag}
            name={country.name}
            isSelected={selectedCountry === country.slug}
            onClick={() => onCountryChange(country.slug)}
          />
        ))}
      </div>

      <div className="text-sm text-white/40">
        {resultsCount} نتيجة
      </div>
    </section>
  );
}

function CountryChip({
  flag,
  name,
  isSelected,
  onClick,
}: {
  flag: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const className = isSelected
    ? 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/40 text-[#c9a84c] text-sm font-medium transition-all'
    : 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 hover:border-white/20 transition-all';

  return (
    <button onClick={onClick} className={className}>
      <span>{flag}</span>
      <span>{name}</span>
    </button>
  );
}

function ScholarshipsGrid({
  scholarships,
  onScholarshipClick,
}: {
  scholarships: GuideWithCountry[];
  onScholarshipClick: (slug: string) => void;
}) {
  if (scholarships.length === 0) {
    return (
      <section className="px-6 py-20 max-w-6xl mx-auto text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold mb-2">ما لقينا نتائج</h3>
        <p className="text-white/50">جرّب كلمات بحث مختلفة أو امسح الفلاتر</p>
      </section>
    );
  }

  return (
    <section className="px-6 pb-16 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scholarships.map((scholarship, index) => (
          <ScholarshipCard
            key={scholarship.slug}
            scholarship={scholarship}
            index={index}
            onClick={() => onScholarshipClick(scholarship.slug)}
          />
        ))}
      </div>
    </section>
  );
}

function ScholarshipCard({
  scholarship,
  index,
  onClick,
}: {
  scholarship: GuideWithCountry;
  index: number;
  onClick: () => void;
}) {
  const accent = scholarship.accent_color || '#c9a84c';

  const glowStyle: CSSProperties = {
    background: `radial-gradient(circle at 50% 0%, ${accent}30, transparent 70%)`,
  };

  const deadlineFromContent = (scholarship.content as { deadlines?: { items?: { date: string }[] } })?.deadlines?.items?.[0]?.date;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={glowStyle}
      />

      <div className="relative h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-all duration-300 group-hover:border-white/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{scholarship.hero_emoji || '🎓'}</span>
            {scholarship.country && (
              <span className="text-2xl opacity-80">{scholarship.country.flag}</span>
            )}
          </div>

          {scholarship.is_featured && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#c9a84c] text-black tracking-wide">
              الأبرز
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {scholarship.title}
        </h3>

        {scholarship.subtitle && (
          <p className="text-xs mb-3" style={{ color: accent }}>
            {scholarship.subtitle}
          </p>
        )}

        <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-3">
          {scholarship.description}
        </p>

        {deadlineFromContent && (
          <div className="flex items-center gap-2 text-xs text-white/40 mb-4 pt-4 border-t border-white/5">
            <Calendar className="w-3.5 h-3.5" />
            <span>أقرب موعد : {deadlineFromContent}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: accent }}>
          <span>عرض التفاصيل</span>
          <ArrowUpLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
}

function TipsSection() {
  const tips = [
    {
      number: '01',
      title: 'ابدأ مبكراً',
      description:
        'الترجمة المحلّفة بتاخد 2-4 أسابيع و امتحانات اللغة بتحجز سريعاً . اللي بيبدأ متأخر بيخسر الفرص الذهبية .',
    },
    {
      number: '02',
      title: 'خطاب الدافع هو الأهم',
      description:
        'لا تنسخ من نماذج جاهزة . احكي قصتك الشخصية كسوري , تحدياتك , و ليش هاد البرنامج بالذات سيغيّر حياتك .',
    },
    {
      number: '03',
      title: 'قدّم على عدة منح بنفس الوقت',
      description:
        'لا تعتمد على منحة واحدة . قدّم على 5-7 منح في وقت واحد . احتمال القبول بيزيد كتير و بتقدر تختار الأفضل .',
    },
    {
      number: '04',
      title: 'تواصل مع الأساتذة قبل التقديم',
      description:
        'خاصة للماجستير و الدكتوراه , إيميل لأستاذ في الجامعة بتعريف عن نفسك و اهتماماتك ممكن يفرق كتير في القبول .',
    },
  ];

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto border-t border-white/5">
      <div className="mb-12">
        <div className="text-xs font-medium text-[#c9a84c] tracking-[0.2em] uppercase mb-3">
          قبل التقديم
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          نصائح <span className="text-[#c9a84c]">ذهبية</span> لزيادة فرصك
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#c9a84c]/30 transition-colors"
          >
            <div className="text-4xl font-bold text-[#c9a84c]/30 mb-3">
              {tip.number}
            </div>
            <h3 className="text-lg font-bold mb-2">{tip.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              {tip.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CtaSection({ onChatClick }: { onChatClick: () => void }) {
  const ctaStyle: CSSProperties = {
    background:
      'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.05))',
    borderColor: 'rgba(201, 168, 76, 0.3)',
  };

  const buttonStyle: CSSProperties = {
    backgroundColor: '#c9a84c',
    color: '#000',
  };

  return (
    <section className="px-6 pb-20 max-w-4xl mx-auto">
      <div className="rounded-3xl border p-10 md:p-14 text-center" style={ctaStyle}>
        <Sparkles className="w-8 h-8 text-[#c9a84c] mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          ما لقيت الجواب اللي بتدوّر عليه ؟
        </h2>
        <p className="text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
          المساعد الذكي عندو معلومات تفصيلية عن كل المنح , و بيقدر يساعدك تختار
          المنحة المناسبة لحالتك و يوجّهك خطوة بخطوة
        </p>
        <button
          onClick={onChatClick}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-opacity hover:opacity-90"
          style={buttonStyle}
        >
          <span>اسأل المساعد الذكي</span>
          <ArrowUpLeft className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}