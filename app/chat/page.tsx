"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function Chat() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [credits, setCredits] = useState<number | null>(null);

    useEffect(() => {
        if (user && !loading) {
            setTimeout(() => fetchCredits(), 500);
        }
    }, [user, loading]);

    const fetchCredits = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch("/api/credits", {
                headers: { "Authorization": `Bearer ${session?.access_token}` },
            });
            const data = await res.json();
            if (data.credits !== undefined) {
                setCredits(data.credits);
            }
        } catch (err) {
            console.error("Error fetching credits:", err);
        }
    };

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "مرحباً! أنا سُبُل، مساعدك الذكي. اسألني عن الوثائق، الفيز، المنح الدراسية، أو أي شيء يخص السوريين في الداخل والخارج. كيف أقدر أساعدك؟",
        },
    ]);
    const [input, setInput] = useState("");
    const [sendingLoading, setSendingLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || sendingLoading) return;

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const userMessage: Message = { role: "user", content: input.trim() };
        const newMessages = [...messages, userMessage];

        setInput("");
        setMessages(newMessages);
        setSendingLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    messages: newMessages.filter(m => m.role !== "assistant" || newMessages.indexOf(m) !== 0)
                }),
            });

            const data = await res.json();

            if (data.reply) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
                if (data.creditsRemaining !== undefined) {
                    setCredits(data.creditsRemaining);
                }
            } else if (data.showUpgrade) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: "🎯 نفد رصيدك من الرسائل الشهرية\n\nاشترك في Plus للحصول على :\n✨ 300 رسالة شهرياً\n⚡ ردود أسرع\n🌟 ميزات حصرية\n\nبسعر 2$ فقط شهرياً\n\n👈 شاهد الخطط : /pricing"
                    },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.error || "عذراً، حدث خطأ. حاول مرة أخرى." },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "عذراً، فشل الاتصال. تأكد من إنترنتك." },
            ]);
        } finally {
            setSendingLoading(false);
        }
    };

    const quickQuestions = [
        "كيف أجدد جواز سفري السوري في ألمانيا؟",
        "ما شروط الجنسية الألمانية الجديدة؟",
        "كيف أحضّر لاختبار B1؟",
        "ما برامج العودة لسوريا؟",
    ];

    const askQuick = (q: string) => {
        if (!user) {
            setInput(q);
            setShowLoginModal(true);
            return;
        }
        setInput(q);
    };

    const goToLogin = () => {
        sessionStorage.setItem("redirectAfterLogin", "/chat");
        router.push("/login");
    };

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

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col" dir="rtl">

            <header className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-white/10 shrink-0">
                <a href="/" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a88838] flex items-center justify-center">
                        <span className="text-black font-bold">س</span>
                    </div>
                    <span className="text-xl font-bold text-[#c9a84c]">سُبُل</span>
                </a>
                <div className="flex items-center gap-2">
                    {user && credits !== null && (
                        <>
                            <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-full px-3 py-1.5 text-xs">
                                <span className="text-[#c9a84c] font-bold">{credits}</span>
                                <span className="text-white/60"> / 15</span>
                            </div>

                            <a href="/pricing"
                                className="bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black font-bold rounded-full px-3 py-1.5 text-xs hover:opacity-90 transition shadow-lg shadow-[#c9a84c]/20"
                            >
                                ⚡ ترقية
                            </a>
                        </>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-5 py-3 ${msg.role === "user"
                                        ? "bg-[#c9a84c] text-black"
                                        : "bg-white/5 border border-white/10 text-white"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))}

                    {sendingLoading && (
                        <div className="flex justify-end">
                            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                                    <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.length === 1 && (
                        <div className="pt-4">
                            <p className="text-white/50 text-xs mb-3 text-center">أسئلة سريعة:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {quickQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => askQuick(q)}
                                        className="bg-white/5 border border-white/10 hover:border-[#c9a84c] rounded-xl px-4 py-3 text-sm text-white/80 text-right transition-all"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="border-t border-white/10 px-4 py-4 shrink-0">
                <div className="max-w-3xl mx-auto flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder={user ? "اكتب سؤالك هنا..." : "اكتب سؤالك... (يتطلب تسجيل دخول)"}
                        disabled={sendingLoading}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#c9a84c] disabled:opacity-50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={sendingLoading || !input.trim()}
                        className="bg-[#c9a84c] text-black px-6 py-3 rounded-xl font-bold disabled:opacity-50 hover:opacity-90 transition"
                    >
                        {user ? "إرسال" : "🔐 إرسال"}
                    </button>
                </div>
                <p className="text-white/30 text-xs text-center mt-3">
                    {user
                        ? "المعلومات للإرشاد فقط — تحقق دائماً من المصادر الرسمية"
                        : "✨ سجّل دخول للحصول على 15 رسالة مجانية شهرياً"}
                </p>
            </div>

            {
                showLoginModal && (
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                        onClick={() => setShowLoginModal(false)}
                    >
                        <div
                            className="relative bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="absolute top-4 left-4 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition"
                            >
                                ✕
                            </button>

                            <div className="text-center">
                                <div className="text-5xl mb-4">✨</div>

                                <h2 className="text-2xl font-bold mb-2 text-[#c9a84c]">
                                    المساعد الذكي للمسجّلين
                                </h2>
                                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                                    للاستفادة من المساعد الذكي، يرجى تسجيل الدخول مجاناً
                                </p>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-right">
                                    <ul className="space-y-2 text-white/80 text-sm">
                                        <li className="flex items-center gap-2">
                                            <span className="text-[#c9a84c]">✓</span>
                                            <span>15 رسالة مجانية شهرياً</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-[#c9a84c]">✓</span>
                                            <span>الوصول لكل المحتوى الكامل</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-[#c9a84c]">✓</span>
                                            <span>محادثات محفوظة</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-[#c9a84c]">✓</span>
                                            <span>معلومات موثّقة ومحدّثة</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={goToLogin}
                                        className="w-full bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-[#c9a84c]/30"
                                    >
                                        إنشاء حساب مجاني
                                    </button>

                                    <button
                                        onClick={goToLogin}
                                        className="w-full bg-white/5 border border-white/10 hover:border-[#c9a84c]/30 text-white font-bold py-3 rounded-xl transition"
                                    >
                                        تسجيل الدخول
                                    </button>
                                </div>

                                <p className="text-white/40 text-xs mt-4">
                                    مجاناً للأبد — بدون بطاقة ائتمان
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }

        </main >
    );
}