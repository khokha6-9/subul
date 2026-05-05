"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [question, setQuestion] = useState("");
    const router = useRouter();

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

            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c9a84c]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c9a84c]/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a88838] flex items-center justify-center shadow-lg shadow-[#c9a84c]/20">
                        <span className="text-black font-bold text-lg">س</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#c9a84c]">سُبُل</h1>
                </div>
                <a
                    href="/chat"
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a84c]/30 rounded-full px-4 py-2 text-white/80 hover:text-white text-sm transition-all"
                >
                    ✨ المساعد الذكي
                </a>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 px-6 pt-20 pb-12 max-w-4xl mx-auto text-center">

                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-white/70 text-xs">مدعوم بالذكاء الاصطناعي • معلومات موثّقة</span>
                </div>

                {/* Main Headline */}
                <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    طريقك<br />
                    <span className="text-[#c9a84c]">للوثائق والفرص</span>
                </h2>

                <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                    مساعدك الذكي للحصول على وثائقك الرسمية، الفيز، المنح الدراسية، وكل ما تحتاجه — أينما كنت
                </p>

                {/* Search/Ask Box */}
                <div className="max-w-2xl mx-auto mb-3">
                    <div className="relative bg-white/5 border-2 border-white/10 rounded-2xl p-2 backdrop-blur-sm hover:border-[#c9a84c]/40 transition-all shadow-2xl shadow-[#c9a84c]/5">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl pr-3">✨</span>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                                placeholder="اسأل المساعد الذكي... مثلاً: كيف أحصل على فيزا دراسة؟"
                                className="flex-1 bg-transparent px-2 py-4 text-white placeholder:text-white/40 focus:outline-none text-sm md:text-base"
                            />
                            <button
                                onClick={handleAsk}
                                className="bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black px-6 py-4 rounded-xl font-bold hover:opacity-90 transition shrink-0 shadow-lg shadow-[#c9a84c]/30"
                            >
                                اسأل ←
                            </button>
                        </div>
                    </div>
                    <p className="text-white/40 text-xs mt-3 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        محادثة مباشرة مع مساعد سُبُل الذكي • مدعوم بـ Claude AI
                    </p>
                </div>
                {/* Quick Questions */}
                <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                    {quickQuestions.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setQuestion(q);
                                router.push(`/chat?q=${encodeURIComponent(q)}`);
                            }}
                            className="bg-white/5 border border-white/10 hover:border-[#c9a84c]/50 hover:bg-white/10 rounded-full px-4 py-2 text-xs md:text-sm text-white/70 hover:text-white transition-all"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </section>

            {/* Divider */}
            <div className="relative z-10 max-w-3xl mx-auto px-6 my-16">
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-white/40 text-sm">أو تصفّح حسب وضعك</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>
            </div>

            {/* Two Main Categories */}
            <section className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Outside Syria */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:border-[#c9a84c]/30 transition-all">
                        <div className="text-4xl mb-4">🌍</div>
                        <h3 className="text-2xl font-bold mb-2">أنا خارج سوريا</h3>
                        <p className="text-white/50 text-sm mb-6">للسوريين في دول الإقامة واللجوء</p>

                        <div className="space-y-2">
                            <a href="/germany" className="block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c9a84c]/30 rounded-xl p-4 transition-all">
                                <div className="flex items-center justify-between">
                                    <span className="text-white">🇩🇪 ألمانيا</span>
                                    <span className="text-[#c9a84c] text-sm">دليل كامل ←</span>
                                </div>
                            </a>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-white">🇹🇷 تركيا</span>
                                    <span className="text-white/40 text-xs">قريباً</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-white">🇱🇧 لبنان</span>
                                    <span className="text-white/40 text-xs">قريباً</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-white">🇯🇴 الأردن</span>
                                    <span className="text-white/40 text-xs">قريباً</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inside Syria */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:border-[#c9a84c]/30 transition-all">
                        <div className="mb-4">
                            <svg className="w-14 h-14 text-[#c9a84c]" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M89.6,184.3l3.6-9.3l9.3-7.8l-1.6-7.8l-7.8-3.6l-3.6-7.8l1.6-13.5l9.3-3.6l13.5-1.6l9.3-3.6l13.5-9.3l21.3-3.6l27.5-13.5l43.5-21.3l54.4-9.3l65.3,1.6l54.4,9.3l43.5,13.5l32.7,21.3l21.3,21.3l13.5,21.3l7.8,21.3l3.6,21.3l-1.6,21.3l-7.8,32.7l-13.5,32.7l-21.3,32.7l-27.5,27.5l-32.7,21.3l-43.5,13.5l-54.4,7.8l-65.3-1.6l-54.4-7.8l-43.5-13.5l-32.7-21.3l-21.3-21.3l-13.5-21.3l-7.8-32.7l-1.6-32.7l3.6-21.3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">أنا في سوريا</h3>
                        <p className="text-white/50 text-sm mb-6">للراغبين في السفر، الدراسة، أو الهجرة</p>

                        <div className="space-y-2">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-white">🎓 الدراسة بالخارج</span>
                                    <span className="text-white/40 text-xs">قريباً</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-white">✈️ السفر والفيز</span>
                                    <span className="text-white/40 text-xs">قريباً</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-white">🏛️ اللجوء</span>
                                    <span className="text-white/40 text-xs">قريباً</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-white">💼 العمل بالخارج</span>
                                    <span className="text-white/40 text-xs">قريباً</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
                <p className="text-white/30 text-xs mb-2">
                    سُبُل — منصة مستقلة غير ربحية لخدمة السوريين
                </p>
                <p className="text-white/20 text-xs">
                    المعلومات للإرشاد فقط • تحقق دائماً من المصادر الرسمية
                </p>
            </footer>

        </main>
    );
}