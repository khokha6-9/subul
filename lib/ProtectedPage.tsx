"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./useAuth";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            // حفظ الصفحة المطلوبة لإرجاع المستخدم لها بعد التسجيل
            sessionStorage.setItem("redirectAfterLogin", pathname);
        }
    }, [loading, user, pathname]);

    // أثناء التحميل
    if (loading) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center" dir="rtl">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a88838] flex items-center justify-center shadow-lg shadow-[#c9a84c]/20 animate-pulse">
                        <span className="text-black font-bold text-xl">س</span>
                    </div>
                    <p className="text-white/60 text-sm">جاري التحميل...</p>
                </div>
            </main>
        );
    }

    // إذا لم يكن مسجل دخول
    if (!user) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 relative overflow-hidden" dir="rtl">

                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/[0.05] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c9a84c]/[0.08] rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-md w-full">

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <a href="/" className="inline-flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a88838] flex items-center justify-center shadow-lg shadow-[#c9a84c]/20">
                                <span className="text-black font-bold text-2xl">س</span>
                            </div>
                            <h1 className="text-3xl font-bold text-[#c9a84c]">سُبُل</h1>
                        </a>
                    </div>

                    {/* Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm text-center">

                        <div className="text-5xl mb-4">🔐</div>

                        <h2 className="text-2xl font-bold mb-3">المحتوى للمسجّلين</h2>
                        <p className="text-white/60 text-sm mb-6 leading-relaxed">
                            لمشاهدة هذا الدليل المفصّل والاستفادة من المعلومات الكاملة، يرجى تسجيل الدخول مجاناً
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => router.push("/login")}
                                className="w-full bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-[#c9a84c]/30"
                            >
                                إنشاء حساب مجاني
                            </button>

                            <button
                                onClick={() => router.push("/login")}
                                className="w-full bg-white/5 border border-white/10 hover:border-[#c9a84c]/30 text-white font-bold py-3 rounded-xl transition"
                            >
                                تسجيل الدخول
                            </button>

                            <button
                                onClick={() => router.push("/")}
                                className="w-full text-white/50 hover:text-white/80 text-sm transition mt-4"
                            >
                                ← العودة للصفحة الرئيسية
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-white/40 text-xs">
                                ✨ تسجيل مجاني • معلومات موثّقة • محتوى محدّث
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        );
    }

    // إذا كان مسجل دخول، أظهر المحتوى
    return <>{children}</>;
}