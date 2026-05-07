"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage("تم التسجيل! تحقق من بريدك لتأكيد الحساب.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : "خطأ غير معروف";
            setMessage(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            });
            if (error) throw error;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : "خطأ غير معروف";
            setMessage(errMsg);
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 relative overflow-hidden" dir="rtl">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/[0.05] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c9a84c]/[0.08] rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <a href="/" className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a88838] flex items-center justify-center shadow-lg shadow-[#c9a84c]/20">
                            <span className="text-black font-bold text-2xl">س</span>
                        </div>
                        <h1 className="text-3xl font-bold text-[#c9a84c]">سُبُل</h1>
                    </a>
                    <p className="text-white/50 text-sm">للسوريين، من السوريين</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">

                    <h2 className="text-2xl font-bold mb-2 text-center">
                        {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
                    </h2>
                    <p className="text-white/50 text-sm text-center mb-6">
                        {isSignUp ? "ابدأ رحلتك مع سُبُل" : "أهلاً بعودتك"}
                    </p>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-3 mb-4 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        تسجيل الدخول بـ Google
                    </button>

                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-white/40 text-xs">أو</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleAuth} className="space-y-3">
                        <div>
                            <label className="block text-white/70 text-sm mb-1">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]"
                                placeholder="example@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-1">كلمة السر</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]"
                                placeholder="6 حروف على الأقل"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? "جاري..." : isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}
                        </button>
                    </form>

                    {message && (
                        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                            <p className="text-white/80 text-sm">{message}</p>
                        </div>
                    )}

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setMessage("");
                            }}
                            className="text-white/60 hover:text-[#c9a84c] text-sm transition"
                        >
                            {isSignUp ? "لديك حساب؟ تسجيل الدخول" : "ليس لديك حساب؟ إنشاء حساب جديد"}
                        </button>
                    </div>
                </div>

                <p className="text-white/30 text-xs text-center mt-6">
                    باستخدام سُبُل، أنت توافق على شروط الاستخدام وسياسة الخصوصية
                </p>

            </div>
        </main>
    );
}