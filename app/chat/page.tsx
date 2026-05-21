"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import { Send, Loader2, Trash2, Download, Copy, Check } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [credits, setCredits] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { user, loading } = useAuth();

    const fetchCredits = useCallback(async () => {
        if (!user) return;
        try {
            const response = await fetch(`/api/credits?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setCredits(data.credits);
            }
        } catch (err) {
            console.error("Error fetching credits:", err);
        }
    }, [user]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleCopy = useCallback(async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("فشل النسخ:", err);
        }
    }, []);

    const handleClearChat = useCallback(() => {
        if (window.confirm("هل أنت متأكد من حذف جميع الرسائل؟")) {
            setMessages([]);
            localStorage.removeItem("chatMessages");
        }
    }, []);

    const handleExportChat = useCallback(() => {
        const chatText = messages
            .map((msg) => `${msg.role === "user" ? "أنت" : "المساعد"}: ${msg.content}`)
            .join("\n\n");
        const blob = new Blob([chatText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `chat-${new Date().toISOString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading || !user) return;

        const userMessage: Message = {
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setIsTyping(true);
        setError(null);

        try {
            // جلب الـ token من Supabase
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error("انتهت جلستك، يرجى تسجيل الدخول مجدداً");
            }

            const apiMessages = messages
                .concat(userMessage)
                .map((m) => ({ role: m.role, content: m.content }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ messages: apiMessages }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "حدث خطأ في الإرسال");
            }

            const assistantMessage: Message = {
                role: "assistant",
                content: data.reply || "لم أستطع الحصول على رد",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            if (data.creditsRemaining !== undefined) {
                setCredits(data.creditsRemaining);
            }
        } catch (err: unknown) {
            const errorMsg =
                err instanceof Error ? err.message : "حدث خطأ، حاول مرة أخرى";
            const errorMessage: Message = {
                role: "assistant",
                content: errorMsg,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
            setError(errorMsg);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
            inputRef.current?.focus();
        }
    }, [input, isLoading, user, messages]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
}, []);

    useEffect(() => {
        if (isMounted) {
            const savedMessages = localStorage.getItem("chatMessages");
            if (savedMessages) {
                try {
                    const parsed = JSON.parse(savedMessages);
                    const messagesWithDates = parsed.map((msg: Message) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp),
                    }));
                    setTimeout(() => setMessages(messagesWithDates), 0);
                } catch (err) {
                    console.error("فشل تحميل الرسائل:", err);
                }
            }
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted && messages.length > 0) {
            localStorage.setItem("chatMessages", JSON.stringify(messages));
        }
    }, [messages, isMounted]);

    useEffect(() => {
    if (user) {
        const timer = setTimeout(() => fetchCredits(), 0);
        return () => clearTimeout(timer);
    }
}, [user, fetchCredits]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isMounted) inputRef.current?.focus();
    }, [isMounted]);

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!isMounted || loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        يجب تسجيل الدخول أولاً
                    </h2>
                    <Link
                       href="/login"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        تسجيل الدخول
                    </Link>
                </div>
            </div>
        );
    }

    return (
       <div className="flex flex-col h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
           <div className="bg-[#0f0f0f] border-b border-white/10 p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <h1 className="text-2xl font-bold text-[#c9a84c]">سُبُل الذكي ✨</h1>
                        {error && (
                            <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded">
                                ⚠️ {error}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="text-sm bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 px-4 py-2 rounded-full font-medium">
    الرصيد: {credits} ⭐
</div>
                        {messages.length > 0 && (
                            <>
                                <button
                                    onClick={handleExportChat}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="تصدير المحادثة"
                                    type="button"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleClearChat}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="مسح المحادثة"
                                    type="button"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
           <div className="flex-1 overflow-y-auto p-4 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto space-y-4">
                   {messages.length === 0 && (
    <div className="flex justify-start">
        <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-white">
            <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown>
                    {`مرحباً! أنا **مستشار سُبُل** ✨\n\nيمكنني مساعدتك في:\n- 📄 تجديد الجواز والوثائق الرسمية\n- ✈️ الفيز والتأشيرات\n- 🎓 المنح الدراسية\n- 🏠 لمّ الشمل والإقامة\n- 📜 الاعتراف بالشهادات\n- 💼 فرص العمل في أوروبا\n\nكيف يمكنني مساعدتك اليوم؟`}
                </ReactMarkdown>
            </div>
            <div className="flex items-center justify-between mt-2 gap-2">
                <span className="text-xs text-white/40">مستشار سُبُل</span>
            </div>
        </div>
    </div>
)}

                    {messages.map((msg, index) => (
                        <div
                            key={`${msg.timestamp}-${index}`}
                            className={`flex ${
                                msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
    msg.role === "user"
        ? "bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black"
        : "bg-white/5 border border-white/10 text-white"
}`}
                            >
                                <div className="prose prose-invert max-w-none text-sm break-words">
    <ReactMarkdown>
        {msg.content}
    </ReactMarkdown>
</div>
                                <div className="flex items-center justify-between mt-2 gap-2">
                                    <span
                                        className={`text-xs ${
    msg.role === "user"
        ? "text-black/60"
        : "text-white/40"
}`}
                                    >
                                        {formatTime(msg.timestamp)}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(msg.content, index)}
                                        className={`p-1 rounded transition ${
    msg.role === "user"
        ? "text-black/60 hover:text-black"
        : "text-white/40 hover:text-white"
}`}
                                        title="نسخ"
                                        type="button"
                                    >
                                        {copiedIndex === index ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white rounded-2xl px-4 py-3 shadow-md border">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
           <div className="bg-[#0f0f0f] border-t border-white/10 p-4">
                <div className="flex gap-3 max-w-4xl mx-auto">
                    <input
                        ref={inputRef}
                        id="chat-input"
                        name="message"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="اكتب رسالتك هنا..."
                        autoComplete="off"
                        disabled={isLoading}
                       className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        type="button"
                       className="bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        <span className="font-medium">إرسال</span>
                    </button>
                </div>
            </div>
        </div>
    );
}