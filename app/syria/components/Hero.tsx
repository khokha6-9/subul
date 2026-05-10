'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        {/* Top right glow */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(201, 168, 76, 0.4) 0%, transparent 70%)',
          }}
        />
        {/* Bottom left glow */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(201, 168, 76, 0.6) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative px-6 pt-32 pb-20 max-w-6xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onClick={() => router.push('/')}
          className="group inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#c9a84c] transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>الرجوع للرئيسية</span>
        </motion.button>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
          <span className="text-xs font-medium text-[#c9a84c] tracking-wide">
            دليل شامل و محدّث
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          <span className="block text-white">أنا في</span>
          <span className="block bg-gradient-to-r from-[#c9a84c] via-[#e9b831] to-[#c9a84c] bg-clip-text text-transparent">
            سوريا
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-10"
        >
          دليلك الشامل لكل خيارات المستقبل من سوريا — الدراسة بالخارج ، فرص العمل ،
          السفر ، و المسارات القانونية للهجرة و اللجوء
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap gap-8 pt-8 border-t border-white/5"
        >
          <div>
            <div className="text-3xl font-bold text-white mb-1">+50</div>
            <div className="text-xs text-white/40 tracking-wider uppercase">منحة دراسية</div>
          </div>
          <div className="w-px bg-white/5" />
          <div>
            <div className="text-3xl font-bold text-white mb-1">12</div>
            <div className="text-xs text-white/40 tracking-wider uppercase">دولة مستهدفة</div>
          </div>
          <div className="w-px bg-white/5" />
          <div>
            <div className="text-3xl font-bold text-white mb-1">2026</div>
            <div className="text-xs text-white/40 tracking-wider uppercase">محدّث</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}