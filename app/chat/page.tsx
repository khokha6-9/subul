"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import {
    Send, Loader2, Trash2, Download, Copy, Check,
    PanelLeftOpen, PanelLeftClose, Plus, MessageSquare, Search
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import OnboardingModal from "@/components/OnboardingModal";
interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface Conversation {
    id: number;
    title: string;
    message_count: number;
    last_message_at: string | null;
    created_at: string;
    updated_at: string;
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
    const [showOnboarding, setShowOnboarding] = useState(false);

    // الشريط الجانبي
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { user, loading } = useAuth();

    // جلب الرصيد
    const fetchCredits = useCallback(async () => {
        if (!user) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) return;
            const response = await fetch("/api/credits", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setCredits(data.credits);
            }
        } catch (err) {
            console.error("Error fetching credits:", err);
        }
    }, [user]);

    // جلب قائمة المحادثات
    const fetchConversations = useCallback(async () => {
        if (!user) return;
        setLoadingConversations(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) return;
            const response = await fetch("/api/conversations", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setConversations(data.conversations ?? []);
            }
        } catch (err) {
            console.error("Error fetching conversations:", err);
        } finally {
            setLoadingConversations(false);
        }
    }, [user]);
    const checkOnboarding = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
        .from("profiles")
        .select("onboarding_status")
        .eq("id", user.id)
        .single();
    if (data?.onboarding_status === "pending") {
        setShowOnboarding(true);
    }
}, [user]);

    // فتح محادثة قديمة
    const openConversation = useCallback(async (conv: Conversation) => {
        if (!user) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) return;
            const response = await fetch(`/api/conversations/${conv.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                const loadedMessages: Message[] = data.messages.map((m: {
                    role: "user" | "assistant";
                    content: string;
                    created_at: string;
                }) => ({
                    role: m.role,
                    content: m.content,
                    timestamp: new Date(m.created_at),
                }));
                setMessages(loadedMessages);
                setActiveConversationId(conv.id);
                setError(null);
            }
        } catch (err) {
            console.error("Error opening conversation:", err);
        }
    }, [user]);

    // محادثة جديدة
    const startNewConversation = useCallback(() => {
        setMessages([]);
        setActiveConversationId(null);
        setError(null);
        setInput("");
        inputRef.current?.focus();
    }, []);

    // حذف (أرشفة) محادثة
    const deleteConversation = useCallback(async (id: number) => {
        if (!user) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) return;
            await fetch(`/api/conversations/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setConversations((prev) => prev.filter((c) => c.id !== id));
            if (activeConversationId === id) {
                startNewConversation();
            }
        } catch (err) {
            console.error("Error deleting conversation:", err);
        } finally {
            setConfirmDeleteId(null);
        }
    }, [user, activeConversationId, startNewConversation]);

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
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error("انتهت جلستك، يرجى تسجيل الدخول مجدداً");

            const apiMessages = messages
                .concat(userMessage)
                .map((m) => ({ role: m.role, content: m.content }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    messages: apiMessages,
                    conversationId: activeConversationId,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "حدث خطأ في الإرسال");

            const assistantMessage: Message = {
                role: "assistant",
                content: data.reply || "لم أستطع الحصول على رد",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (data.creditsRemaining !== undefined) setCredits(data.creditsRemaining);

            // تحديث الـ conversationId إذا كانت محادثة جديدة
            if (data.conversationId && !activeConversationId) {
                setActiveConversationId(data.conversationId);
                await fetchConversations();
            }

        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "حدث خطأ، حاول مرة أخرى";
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: errorMsg,
                timestamp: new Date(),
            }]);
            setError(errorMsg);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
            inputRef.current?.focus();
        }
    }, [input, isLoading, user, messages, activeConversationId, fetchConversations]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "اليوم";
        if (days === 1) return "أمس";
        if (days < 7) return `منذ ${days} أيام`;
        return date.toLocaleDateString("ar-SA");
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredConversations = conversations.filter((c) =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

   useEffect(() => {
    if (user) {
        const timer = setTimeout(() => {
            fetchCredits();
            fetchConversations();
            checkOnboarding();
        }, 0);
        return () => clearTimeout(timer);
    }
}, [user, fetchCredits, fetchConversations, checkOnboarding]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isMounted) inputRef.current?.focus();
    }, [isMounted]);

    if (!isMounted || loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#c9a84c] mx-auto mb-4" />
                    <p className="text-white/60">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        يجب تسجيل الدخول أولاً
                    </h2>
                    <Link
                        href="/login"
                        className="bg-[#c9a84c] text-black px-6 py-2 rounded-lg hover:opacity-90 transition font-medium"
                    >
                        تسجيل الدخول
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
            {showOnboarding && user && (
    <OnboardingModal
        userId={user.id}
        onComplete={() => setShowOnboarding(false)}
    />
)}

            {/* الشريط الجانبي */}
            <div className={`
                flex flex-col border-l border-white/10 bg-[#0f0f0f]
                transition-all duration-300 ease-in-out shrink-0
                ${sidebarOpen ? "w-72" : "w-0 overflow-hidden"}
            `}>
                {/* رأس الشريط */}
                <div className="p-4 border-b border-white/10">
                    <button
                        onClick={startNewConversation}
                        type="button"
                        className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] text-black font-bold py-2.5 px-4 rounded-xl hover:opacity-90 transition"
                    >
                        <Plus className="w-4 h-4" />
                        محادثة جديدة
                    </button>
                </div>

                {/* البحث */}
                <div className="px-3 py-2 border-b border-white/10">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-white/30 shrink-0" />
                        <input
                            type="text"
                            placeholder="بحث في المحادثات..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
                        />
                    </div>
                </div>

                {/* قائمة المحادثات */}
                <div className="flex-1 overflow-y-auto py-2">
                    {loadingConversations ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-white/30" />
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="text-center py-8 px-4">
                            <MessageSquare className="w-8 h-8 text-white/20 mx-auto mb-2" />
                            <p className="text-white/30 text-sm">لا توجد محادثات</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <div
                                key={conv.id}
                                className={`
                                    group relative mx-2 mb-1 rounded-xl px-3 py-2.5 cursor-pointer transition
                                    ${activeConversationId === conv.id
                                        ? "bg-[#c9a84c]/15 border border-[#c9a84c]/30"
                                        : "hover:bg-white/5 border border-transparent"
                                    }
                                `}
                                onClick={() => openConversation(conv)}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm text-white/80 truncate flex-1 leading-snug">
                                        {conv.title || "محادثة بدون عنوان"}
                                    </p>
                                    {/* زر الحذف */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirmDeleteId(conv.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-white/30 hover:text-red-400 transition rounded shrink-0"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-white/30">
                                        {formatDate(conv.last_message_at ?? conv.created_at)}
                                    </span>
                                    {conv.message_count > 0 && (
                                        <span className="text-xs text-white/20">
                                            · {conv.message_count} رسالة
                                        </span>
                                    )}
                                </div>

                                {/* تأكيد الحذف */}
                                {confirmDeleteId === conv.id && (
                                    <div
                                        className="absolute inset-0 bg-[#0f0f0f] border border-red-500/30 rounded-xl flex items-center justify-center gap-2 p-2"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span className="text-xs text-white/70">حذف المحادثة؟</span>
                                        <button
                                            type="button"
                                            onClick={() => deleteConversation(conv.id)}
                                            className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30 transition"
                                        >
                                            نعم
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmDeleteId(null)}
                                            className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded hover:bg-white/20 transition"
                                        >
                                            لا
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* المنطقة الرئيسية */}
            <div className="flex flex-col flex-1 min-w-0">

                {/* Header */}
                <div className="bg-[#0f0f0f] border-b border-white/10 p-4 shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen((v) => !v)}
                                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition"
                                title={sidebarOpen ? "إخفاء الشريط" : "إظهار الشريط"}
                            >
                                {sidebarOpen
                                    ? <PanelLeftClose className="w-5 h-5" />
                                    : <PanelLeftOpen className="w-5 h-5" />
                                }
                            </button>
                            <h1 className="text-xl font-bold text-[#c9a84c]">سُبُل الذكي ✨</h1>
                            {error && (
                                <span className="text-sm text-red-400 bg-red-500/10 px-3 py-1 rounded">
                                    ⚠️ {error}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-sm bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 px-4 py-2 rounded-full font-medium">
                                الرصيد: {credits} ⭐
                            </div>
                            {messages.length > 0 && (
                                <button
                                    onClick={handleExportChat}
                                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition"
                                    title="تصدير المحادثة"
                                    type="button"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* الرسائل */}
                <div className="flex-1 overflow-y-auto p-4 bg-[#0a0a0a]">
                    <div className="max-w-3xl mx-auto space-y-4">
                        {messages.length === 0 && (
                            <div className="flex justify-start">
                                <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-white">
                                    <div className="prose prose-invert max-w-none text-sm">
                                        <ReactMarkdown>
                                            {`مرحباً! أنا **مستشار سُبُل** ✨\n\nيمكنني مساعدتك في:\n- 📄 تجديد الجواز والوثائق الرسمية\n- ✈️ الفيز والتأشيرات\n- 🎓 المنح الدراسية\n- 🏠 لمّ الشمل والإقامة\n- 📜 الاعتراف بالشهادات\n- 💼 فرص العمل في أوروبا\n\nكيف يمكنني مساعدتك اليوم؟`}
                                        </ReactMarkdown>
                                    </div>
                                    <span className="text-xs text-white/40 mt-2 block">مستشار سُبُل</span>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={`${msg.timestamp}-${index}`}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                    msg.role === "user"
                                        ? "bg-gradient-to-br from-[#c9a84c] to-[#a88838] text-black"
                                        : "bg-white/5 border border-white/10 text-white"
                                }`}>
                                    <div className="prose prose-invert max-w-none text-sm break-words">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 gap-2">
                                        <span className={`text-xs ${msg.role === "user" ? "text-black/60" : "text-white/40"}`}>
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
                                            {copiedIndex === index
                                                ? <Check className="w-4 h-4" />
                                                : <Copy className="w-4 h-4" />
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="bg-[#0f0f0f] border-t border-white/10 p-4 shrink-0">
                    <div className="flex gap-3 max-w-3xl mx-auto">
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
                            {isLoading
                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                : <Send className="w-5 h-5" />
                            }
                            <span className="font-medium">إرسال</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}