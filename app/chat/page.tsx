"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "مرحباً! أنا سُبُل، مساعدك الذكي. اسألني عن الوثائق، الفيز، المنح الدراسية، أو أي شيء يخص السوريين في الداخل والخارج. كيف أقدر أساعدك؟",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: "user", content: input.trim() };
        const newMessages = [...messages, userMessage];

        setInput("");
        setMessages(newMessages);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages.filter(m => m.role !== "assistant" || newMessages.indexOf(m) !== 0)
                }),
            });

            const data = await res.json();

            if (data.reply) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: "عذراً، حدث خطأ. حاول مرة أخرى." },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "عذراً، فشل الاتصال. تأكد من إنترنتك." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const quickQuestions = [
        "كيف أجدد جواز سفري السوري في ألمانيا؟",
        "ما شروط الجنسية الألمانية الجديدة؟",
        "كيف أحضّر لاختبار B1؟",
        "ما برامج العودة لسوريا؟",
    ];

    const askQuick = (q: string) => {
        setInput(q);
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col" dir="rtl">

            <header className="flex justify-between items-center px-8 py-5 border-b border-white/10 shrink-0">
                <a href="/" className="text-2xl font-bold text-[#c9a84c]">سُبُل</a>
                <span className="text-white/50 text-sm">🤖 المساعد الذكي</span>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === "user"
                                        ? "bg-[#c9a84c] text-black"
                                        : "bg-white/5 border border-white/10 text-white"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))}

                    {loading && (
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
                        placeholder="اكتب سؤالك هنا..."
                        disabled={loading}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#c9a84c] disabled:opacity-50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="bg-[#c9a84c] text-black px-6 py-3 rounded-xl font-bold disabled:opacity-50 hover:opacity-90 transition"
                    >
                        إرسال
                    </button>
                </div>
                <p className="text-white/30 text-xs text-center mt-3">
                    المعلومات للإرشاد فقط — تحقق دائماً من المصادر الرسمية
                </p>
            </div>

        </main>
    );
}