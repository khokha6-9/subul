"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export default function Pricing() {
    const { user } = useAuth();
    const router = useRouter();
    const [showSoonModal, setShowSoonModal] = useState(false);

    const handleSubscribe = (plan: string) => {
        if (!user) {
            router.push("/login");
            return;
        }
        setShowSoonModal(true);
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden" dir="rtl">

            <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/[0.05] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c9a84c]/[0.08] rounded-full blur-[120px] pointer-events-none" />

            <header className="relative z-10 flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/5 backdrop-blur-sm">
                <a href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a88838] flex items-center justify-center shadow-lg shadow-[#c9a84c]/20">
                        <span className="text-black font-bold text-lg">س</span>
                    </div>
                    <h1 className="text-xl font-bold text-[#c9a84c]">سُبُل</h1>
                </a>
                <a href="/" className="text-white/60 hover:text-white text-sm transition">← الرئيسية</a>
            </header>

            <section className="relative z-10 px-6 pt-16 pb-8 max-w-4xl mx-auto text-center">

                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-white/70 text-xs">اختر الخطة المناسبة لك</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    خطط بسيطة<br />
                    <span className="text-[#c9a84c]">لاحتياجات الجميع</span>
                </h2>

                <p className="text-white/60 text-base md:text-lg mb-12 max-w-xl mx-auto">
                    ابدأ مجاناً ، وارقِ خطتك عندما تحتاج المزيد من المساعدة
                </p>
            </section>

            <section className="relative z-10 px-4 md:px-6 pb-16 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-4 md:gap-6">

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-2">المجاني</h3>
                            <p className="text-white/50 text-sm">ابدأ تجربتك مع سُبُل</p>
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-bold">0$</span>
                            <span className="text-white/50 text-sm"> / شهر</span>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>15 رسالة شهرياً</span>
                            </li>
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>الوصول لكل المحتوى</span>
                            </li>
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>محادثات محفوظة</span>
                            </li>
                            <li className="flex items-center gap-2 text-white/40 text-sm">
                                <span className="text-white/30">✗</span>
                                <span>أولوية في الردود</span>
                            </li>
                            <li className="flex items-center gap-2 text-white/40 text-sm">
                                <span className="text-white/30">✗</span>
                                <span>ميزات حصرية</span>
                            </li>
                        </ul>

                        <button
                            disabled
                            className="w-full bg-white/5 border border-white/10 text-white/50 font-bold py-3 rounded-xl cursor-not-allowed"
                        >
                            خطتك الحالية
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-[#c9a84c]/10 to-[#a88838]/5 border-2 border-[#c9a84c]/40 rounded-2xl p-6 md:p-8 backdrop-blur-sm flex flex-col relative shadow-2xl shadow-[#c9a84c]/10">

                        <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-gradient-to-r from-[#c9a84c] to-[#a88838] text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                            الأكثر شعبية
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-2 text-[#c9a84c]">Plus</h3>
                            <p className="text-white/50 text-sm">للاستخدام اليومي</p>
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-bold text-[#c9a84c]">2$</span>
                            <span className="text-white/50 text-sm"> / شهر</span>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span><strong>300 رسالة شهرياً</strong></span>
                            </li>
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>كل ميزات المجاني</span>
                            </li>
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>ردود أسرع</span>
                            </li>
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>بدون إعلانات</span>
                            </li>
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>دعم فني</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleSubscribe("plus")}
                            className="w-full bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-[#c9a84c]/30"
                        >
                            اشترك في Plus
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-2">Pro</h3>
                            <p className="text-white/50 text-sm">للاستخدام المكثف</p>
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-bold">4$</span>
                            <span className="text-white/50 text-sm"> / شهر</span>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span><strong>1500 رسالة شهرياً</strong></span>
                            </li>
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>كل ميزات Plus</span>
                            </li>
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>أولوية في الدعم</span>
                            </li>
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>ميزات حصرية قادمة</span>
                            </li>
                            <li className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="text-[#c9a84c]">✓</span>
                                <span>وصول مبكر للجديد</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleSubscribe("pro")}
                            className="w-full bg-white/5 border border-white/10 hover:border-[#c9a84c]/30 text-white font-bold py-3 rounded-xl transition"
                        >
                            اشترك في Pro
                        </button>
                    </div>

                </div>
            </section>

            <section className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">أسئلة شائعة</h3>
                    <p className="text-white/50 text-sm">إجابات سريعة على ما يدور في بالك</p>
                </div>

                <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="font-bold mb-2">هل يمكنني الإلغاء في أي وقت ؟</h4>
                        <p className="text-white/60 text-sm leading-relaxed">نعم ، يمكنك إلغاء اشتراكك في أي وقت بدون أي رسوم خفية</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="font-bold mb-2">ما طرق الدفع المتاحة ؟</h4>
                        <p className="text-white/60 text-sm leading-relaxed">سندعم قريباً البطاقات البنكية ، USDT ( Binance ) ، Wish Money ، و Sham Cash</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="font-bold mb-2">ماذا يحدث إذا تجاوزت حد الرسائل ؟</h4>
                        <p className="text-white/60 text-sm leading-relaxed">سيتم إيقاف البوت مؤقتاً حتى الشهر القادم ، أو يمكنك الترقية فوراً للحصول على المزيد</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h4 className="font-bold mb-2">هل أستطيع تغيير خطتي لاحقاً ؟</h4>
                        <p className="text-white/60 text-sm leading-relaxed">طبعاً ، يمكنك الترقية أو التخفيض في أي وقت</p>
                    </div>
                </div>
            </section>

            <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
                <p className="text-white/30 text-xs">
                    سُبُل — منصة مستقلة لخدمة السوريين أينما كانوا
                </p>
            </footer>

            {showSoonModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                    onClick={() => setShowSoonModal(false)}
                >
                    <div
                        className="relative bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowSoonModal(false)}
                            className="absolute top-4 left-4 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition"
                        >
                            ✕
                        </button>

                        <div className="text-5xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold mb-3 text-[#c9a84c]">قريباً جداً !</h2>
                        <p className="text-white/70 text-sm mb-6 leading-relaxed">
                            نحن نعمل على تفعيل نظام الدفع الآمن . سنعلن عن إطلاق الاشتراكات قريباً
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                            <p className="text-white/60 text-xs">
                                💡 يمكنك الآن الاستمتاع بـ <strong className="text-[#c9a84c]">15 رسالة مجانية</strong> شهرياً
                            </p>
                        </div>

                        <button
                            onClick={() => setShowSoonModal(false)}
                            className="w-full bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
                        >
                            فهمت
                        </button>
                    </div>
                </div>
            )}

        </main>
    );
}