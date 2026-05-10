'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Briefcase,
  Plane,
  Shield,
  ArrowUpLeft,
  Clock,
} from 'lucide-react';

type Section = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
  accent: string;
};

const sections: Section[] = [
  {
    title: 'الدراسة بالخارج',
    description:
      'منح DAAD الألمانية ، Erasmus Mundus ، المنح التركية و العربية مع شروط مفصّلة و مواعيد دقيقة',
    href: '/syria/study-abroad',
    icon: GraduationCap,
    available: true,
    accent: '#c9a84c',
  },
  {
    title: 'العمل بالخارج',
    description:
      'عقود عمل في الخليج و أوروبا ، فرص freelance ، منصات عالمية و كيف تطلع براتب جيد',
    href: '/syria/work-abroad',
    icon: Briefcase,
    available: false,
    accent: '#60a5fa',
  },
  {
    title: 'السفر و الفيز',
    description:
      'إجراءات الجوازات ، الفيز السياحية ، متطلبات السفر للسوريين ، و أسهل الدول للزيارة',
    href: '/syria/travel',
    icon: Plane,
    available: false,
    accent: '#a78bfa',
  },
  {
    title: 'اللجوء و الحماية',
    description:
      'مسارات قانونية للحماية الدولية ، فهم نظام اللجوء ، و حقوقك كطالب لجوء',
    href: '/syria/asylum',
    icon: Shield,
    available: false,
    accent: '#34d399',
  },
];

export default function SectionsGrid() {
  const router = useRouter();

  return (
    <section className="relative px-6 py-20 max-w-6xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="text-xs font-medium text-[#c9a84c] tracking-[0.2em] uppercase mb-3">
          الأقسام الرئيسية
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          من وين <span className="text-[#c9a84c]">تحب نبدأ</span> ؟
        </h2>
      </motion.div>

      {/* Cards grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((section, index) => (
          <Card
            key={section.href}
            section={section}
            index={index}
            onClick={() => section.available && router.push(section.href)}
          />
        ))}
      </div>
    </section>
  );
}

function Card({
  section,
  index,
  onClick,
}: {
  section: Section;
  index: number;
  onClick: () => void;
}) {
  const Icon = section.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={section.available ? { y: -4 } : {}}
      onClick={onClick}
      className={`group relative ${
        section.available ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
    >
      {/* Glow effect on hover */}
      {section.available && (
        <div
          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${section.accent}40, transparent 70%)`,
          }}
        />
      )}

      {/* Card content */}
      <div
        className={`relative h-full rounded-2xl border bg-gradient-to-b from-white/[0.04] to-transparent p-8 transition-all duration-300 ${
          section.available
            ? 'border-white/10 group-hover:border-white/20'
            : 'border-white/5 opacity-50'
        }`}
      >
        {/* Top row: icon + status */}
        <div className="flex items-start justify-between mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              background: section.available
                ? `linear-gradient(135deg, ${section.accent}20, ${section.accent}05)`
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${section.available ? section.accent + '30' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <Icon
              className="w-6 h-6"
              style={{ color: section.available ? section.accent : 'rgba(255,255,255,0.3)' }}
            />
          </div>

          {!section.available && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              <Clock className="w-3 h-3 text-white/50" />
              <span className="text-[10px] font-medium text-white/60 tracking-wide">
                قريباً
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
          {section.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed mb-6">
          {section.description}
        </p>

        {/* Footer: CTA */}
        {section.available && (
          <div className="flex items-center gap-2 text-sm font-medium text-[#c9a84c]">
            <span>استكشف القسم</span>
            <ArrowUpLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 group-hover:translate-y-[-2px]" />
          </div>
        )}
      </div>
    </motion.div>
  );
}