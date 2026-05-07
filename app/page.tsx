"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export default function Home() {
    const [question, setQuestion] = useState("");
    const router = useRouter();
    const { user, signOut } = useAuth();

    const handleAsk = () => {
        if (question.trim()) {
            router.push(`/chat?q=${encodeURIComponent(question)}`);
        } else {
            router.push("/chat");
        }
    };

    const quickQuestions = [
        "كيف أجدد جواز سفري السوري؟",
        "ما شروط الجنسية الألمانية؟",
        "كيف أحصل على منحة دراسية؟",
        "ما هي خطوات لمّ شمل العائلة؟",
    ];

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden" dir="rtl">

            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/[0.07] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c9a84c]/[0.08] rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c9a84c]/[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: "10s" }} />

            {/* Live Updates Bar */}
            <div className="relative z-20 bg-gradient-to-l from-[#c9a84c]/10 via-[#c9a84c]/5 to-transparent border-b border-[#c9a84c]/20 overflow-hidden">
                <div className="flex items-center gap-3 py-2.5 px-4 md:px-12">
                    <span className="flex items-center gap-2 shrink-0">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        <span className="text-[#c9a84c] text-xs font-bold hidden sm:inline">مباشر</span>
                    </span>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex gap-12 animate-scroll whitespace-nowrap">
                            <span className="text-white/70 text-xs">📌 آخر تحديث: قانون الجنسية الألمانية الجديد StaRModG ساري المفعول</span>
                            <span className="text-white/70 text-xs">🇩🇪 السوريون احتلوا المركز الأول بـ 75,000+ متجنس في 2024</span>
                            <span className="text-white/70 text-xs">⚠️ تعليق لمّ شمل الحماية الفرعية حتى يوليو 2027</span>
                            <span className="text-white/70 text-xs">✈️ برنامج REAG/GARP يدعم العائدين بـ 1,000 يورو منحة بدء</span>
                            <span className="text-white/70 text-xs">📌 آخر تحديث: قانون الجنسية الألمانية الجديد StaRModG ساري المفعول</span>
                            <span className="text-white/70 text-xs">🇩🇪 السوريون احتلوا المركز الأول بـ 75,000+ متجنس في 2024</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center px-4 md:px-12 py-4 md:py-5 border-b border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a88838] flex items-center justify-center shadow-lg shadow-[#c9a84c]/20">
                        <span className="text-black font-bold text-lg md:text-xl">س</span>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-[#c9a84c] leading-none">سُبُل</h1>
                        <p className="text-[10px] md:text-xs text-white/40 mt-0.5">للسوريين، من السوريين</p>
                    </div>
                </div>
                {user ? (
                    <div className="flex items-center gap-2">
                        <span className="text-white/60 text-xs md:text-sm hidden sm:inline">
                            {user.email?.split("@")[0]}
                        </span>
                        <button
                            onClick={signOut}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-400/30 rounded-full px-3 md:px-4 py-1.5 md:py-2 text-white/80 hover:text-white text-xs md:text-sm transition-all"
                        >
                            خروج
                        </button>
                    </div>
                ) : (

                    <a href="/login"
                        className="bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black font-bold rounded-full px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm transition-all hover:opacity-90"
                    >
                        تسجيل الدخول
                    </a>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative z-10 px-4 md:px-6 pt-12 md:pt-20 pb-8 md:pb-12 max-w-4xl mx-auto text-center">

                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-6 md:mb-8 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-white/70 text-[11px] md:text-xs">معلومات موثّقة • تحديث مستمر</span>
                </div>

                {/* Main Headline */}
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-[1.1] tracking-tight">
                    طريقك<br />
                    <span className="text-[#c9a84c]">للوثائق والفرص</span>
                </h2>

                <p className="text-white/60 text-base md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
                    مساعدك الذكي للحصول على وثائقك الرسمية، الفيز، المنح الدراسية — أينما كنت
                </p>

                {/* AI Chat Box - The Star */}
                <div className="max-w-2xl mx-auto mb-3 px-2">
                    <div className="relative bg-white/5 border-2 border-white/10 rounded-2xl p-1.5 md:p-2 backdrop-blur-sm hover:border-[#c9a84c]/40 transition-all shadow-2xl shadow-[#c9a84c]/5">

                        {/* AI Indicator on Top */}
                        <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#c9a84c] to-[#a88838] text-black text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <span>✨</span>
                            <span>المساعد الذكي</span>
                        </div>

                        <div className="flex items-center gap-1 md:gap-2">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                                placeholder="اكتب سؤالك هنا..."
                                className="flex-1 bg-transparent px-3 md:px-4 py-3.5 md:py-4 text-white placeholder:text-white/40 focus:outline-none text-sm md:text-base"
                            />
                            <button
                                onClick={handleAsk}
                                className="bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black px-4 md:px-6 py-3 md:py-4 rounded-xl font-bold hover:opacity-90 transition shrink-0 shadow-lg shadow-[#c9a84c]/30 text-sm md:text-base"
                            >
                                اسأل ←
                            </button>
                        </div>
                    </div>

                    <p className="text-white/40 text-[11px] md:text-xs mt-3 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        <span>محادثة فورية • مدعوم بـ Claude AI</span>
                    </p>
                </div>

                {/* Quick Questions */}
                <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto mt-6 md:mt-8 px-2">
                    {quickQuestions.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => router.push(`/chat?q=${encodeURIComponent(q)}`)}
                            className="bg-white/5 border border-white/10 hover:border-[#c9a84c]/50 hover:bg-white/10 rounded-full px-3 md:px-4 py-2 text-[11px] md:text-sm text-white/70 hover:text-white transition-all"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </section>

            {/* Divider */}
            <div className="relative z-10 max-w-3xl mx-auto px-6 my-12 md:my-16">
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-white/40 text-xs md:text-sm">أو تصفّح حسب وضعك</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>
            </div>

            {/* Two Categories */}
            <section className="relative z-10 px-4 md:px-6 pb-16 md:pb-20 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">

                    {/* Outside Syria */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:border-[#c9a84c]/30 transition-all">
                        <div className="mb-5 md:mb-6">
                            <h3 className="text-xl md:text-2xl font-bold mb-1">خارج سوريا</h3>
                            <p className="text-white/50 text-xs md:text-sm">للسوريين في دول الإقامة واللجوء</p>
                        </div>

                        <div className="space-y-2">
                            <a href="/germany" className="block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a84c]/40 rounded-xl p-3 md:p-4 transition-all group">
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm md:text-base font-medium">ألمانيا</span>
                                    <span className="text-[#c9a84c] text-xs md:text-sm group-hover:translate-x-[-4px] transition-transform">دليل كامل ←</span>
                                </div>
                            </a>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 md:p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/50 text-sm md:text-base">تركيا</span>
                                    <span className="text-white/30 text-[10px] md:text-xs">قريباً</span>
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 md:p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/50 text-sm md:text-base">لبنان</span>
                                    <span className="text-white/30 text-[10px] md:text-xs">قريباً</span>
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 md:p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/50 text-sm md:text-base">الأردن</span>
                                    <span className="text-white/30 text-[10px] md:text-xs">قريباً</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inside Syria */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:border-[#c9a84c]/30 transition-all">
                        <div className="mb-5 md:mb-6">
                            <h3 className="text-xl md:text-2xl font-bold mb-1">داخل سوريا</h3>
                            <p className="text-white/50 text-xs md:text-sm">للراغبين في السفر والدراسة والهجرة</p>
                        </div>

                        <div className="space-y-2">
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 md:p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/50 text-sm md:text-base">الدراسة بالخارج</span>
                                    <span className="text-white/30 text-[10px] md:text-xs">قريباً</span>
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 md:p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/50 text-sm md:text-base">السفر والفيز</span>
                                    <span className="text-white/30 text-[10px] md:text-xs">قريباً</span>
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 md:p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/50 text-sm md:text-base">اللجوء</span>
                                    <span className="text-white/30 text-[10px] md:text-xs">قريباً</span>
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 md:p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/50 text-sm md:text-base">العمل بالخارج</span>
                                    <span className="text-white/30 text-[10px] md:text-xs">قريباً</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8 md:py-10 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a88838] flex items-center justify-center shadow-lg shadow-[#c9a84c]/20">
                        <span className="text-black font-bold text-xl">س</span>
                    </div>
                    <p className="text-white/60 text-sm md:text-base font-bold mb-2">سُبُل</p>
                    <p className="text-white/40 text-xs md:text-sm mb-4">منصة مستقلة غير ربحية لخدمة السوريين أينما كانوا</p>
                    <p className="text-white/30 text-[11px] md:text-xs">
                        المعلومات للإرشاد فقط • تحقق دائماً من المصادر الرسمية
                    </p>
                </div>
            </footer>

        </main >
    );
}