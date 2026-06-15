import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { searchKnowledgeBase, buildContextFromResults } from "./search";
import { trackEvent } from '@/lib/events';
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT_BASE = `أنت "مستشار سُبُل" — خبير قانوني وإداري سوري متخصص في شؤون السوريين حول العالم.

جمهورك:
- السوريون في دول الشتات (ألمانيا، تركيا، لبنان، الأردن وغيرها)
- السوريون في الداخل الذين يخططون للسفر أو الهجرة
- الطلاب والخريجون الباحثون عن منح أو فرص خارج سوريا

تخصصاتك:
1. الوثائق الرسمية: جواز السفر، الإقامات، الجنسية، لمّ الشمل
2. الفيز والتأشيرات: الدراسة، العمل، السياحة، اللجوء
3. المنح الدراسية: DAAD، Erasmus، Chevening، Fulbright
4. الهجرة والعودة: قوانين الهجرة، برامج العودة الطوعية
5. الاعتراف بالشهادات في ألمانيا والدول الأخرى
6. سوق العمل: فيز العمل، Blue Card، فرص الخليج

قواعدك:
- اعتمد على المعلومات المرفقة أولاً قبل أي معلومة عامة
- إجاباتك دقيقة وعملية ومختصرة
- اذكر الروابط الرسمية والأسعار بدقة عند توفرها
- إذا لم تجد الإجابة في المعلومات المرفقة، اعترف بذلك واقترح الجهة الرسمية
- اقترح دائماً التحقق من المصادر الرسمية لأن القوانين تتغير
- كن متعاطفاً ومحترماً
- استخدم العربية البسيطة الواضحة
- نسّق إجاباتك بنقاط عند الحاجة
- اختم كل إجابة بـ: "نحن في سُبُل، طريقك للبداية الجديدة 🌟"`;

type Message = {
    role: "user" | "assistant";
    content: string;
};

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول للاستفادة من المساعد الذكي" },
                { status: 401 }
            );
        }

        const token = authHeader.replace("Bearer ", "");

        const userSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: { Authorization: `Bearer ${token}` },
                },
            }
        );

        const { data: { user }, error: authError } = await userSupabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: "جلسة غير صالحة. يرجى تسجيل الدخول مجدداً" },
                { status: 401 }
            );
        }

        // التحقق من الرصيد مع التجديد التلقائي
        const { data: creditsData, error: creditsError } = await userSupabase
            .from("users_credits")
            .select("credits_remaining, total_used, is_plus, plan, last_reset")
            .eq("user_id", user.id)
            .single();

        if (creditsError || !creditsData) {
            return NextResponse.json(
                { error: "خطأ في جلب الرصيد" },
                { status: 500 }
            );
        }

        // التحقق من التجديد الشهري
        const lastReset = new Date(creditsData.last_reset);
        const today = new Date();
        const daysSinceReset = Math.floor(
            (today.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
        );

        let currentCredits = creditsData.credits_remaining;

        if (daysSinceReset >= 30) {
            const newCredits =
                creditsData.plan === "pro" ? 1200 :
                creditsData.plan === "plus" ? 400 :
                creditsData.plan === "starter" ? 100 : 15;

            await userSupabase
                .from("users_credits")
                .update({
                    credits_remaining: newCredits,
                    last_reset: today.toISOString().split("T")[0],
                })
                .eq("user_id", user.id);
            currentCredits = newCredits;
        }

        if (currentCredits <= 0) {
            return NextResponse.json(
                {
                    error: "نفد رصيدك من الرسائل الشهرية",
                    message: "اشترك في Plus للحصول على 400 رسالة شهرياً بـ 3$ فقط",
                    showUpgrade: true,
                },
                { status: 403 }
            );
        }

        // التغيير الأول - تغيير اسم المتغير
        const { messages, conversationId: existingConversationId } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "الرسائل فارغة" },
                { status: 400 }
            );
        }

        const userMessage = messages[messages.length - 1];

        // التغيير الثاني - إنشاء محادثة جديدة أو استخدام الموجودة
        let conversationId = existingConversationId;

        if (!conversationId) {
            const title = userMessage.content.slice(0, 60);

            const { data: newConv, error: convError } = await userSupabase
                .from("conversations")
                .insert({
                    user_id: user.id,
                    title,
                })
                .select("id")
                .single();

            if (convError || !newConv) {
                return NextResponse.json(
                    { error: "خطأ في إنشاء المحادثة" },
                    { status: 500 }
                );
            }

            conversationId = newConv.id;
        }
        // أرشفة المحادثات القديمة إذا تجاوز الحد
const limits: Record<string, number> = {
    free: 20,
    starter: 50,
    plus: 200,
    pro: Infinity,
};

const plan = creditsData.plan ?? "free";
const limit = limits[plan] ?? 20;

if (limit !== Infinity) {
    const { data: allConvs } = await userSupabase
        .from("conversations")
        .select("id, created_at")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("last_message_at", { ascending: true, nullsFirst: true });

    if (allConvs && allConvs.length > limit) {
        const toArchive = allConvs.slice(0, allConvs.length - limit);
        const idsToArchive = toArchive.map((c) => c.id);

        await userSupabase
            .from("conversations")
            .update({ is_archived: true })
            .in("id", idsToArchive);
    }
}

        // جلب آخر 10 رسائل من هذه المحادثة كـ context
        let contextMessages: Message[] = [];

        if (conversationId) {
            const { data: prevMessages } = await userSupabase
                .from("messages")
                .select("role, content")
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: false })
                .limit(10);

            if (prevMessages && prevMessages.length > 0) {
                contextMessages = prevMessages.reverse() as Message[];
            }
        }

        // البحث في knowledge_base
        const searchResults = await searchKnowledgeBase(
            userMessage.content,
            userSupabase
        );

        const context = buildContextFromResults(searchResults);

        // بناء الـ system prompt مع السياق
        const systemPrompt = context
            ? `${SYSTEM_PROMPT_BASE}\n\n══════════════════════════════════════\nمعلومات ذات صلة من قاعدة المعرفة:\n══════════════════════════════════════\n${context}`
            : `${SYSTEM_PROMPT_BASE}\n\n(لا توجد معلومات محددة في قاعدة المعرفة لهذا السؤال — أجب من معرفتك العامة وأشر إلى الجهات الرسمية)`;

        // حفظ رسالة المستخدم
        await userSupabase.from("messages").insert({
            conversation_id: conversationId,
            role: "user",
            content: userMessage.content,
        });

        // التغيير الثالث - دمج السياق السابق مع الرسالة الحالية
        const allMessages = contextMessages.length > 0
            ? [
                ...contextMessages,
                { role: userMessage.role, content: userMessage.content },
              ]
            : messages.map((m: Message) => ({
                role: m.role,
                content: m.content,
              }));

        // استدعاء Claude
        const response = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1500,
            system: systemPrompt,
            messages: allMessages,
        });

        const reply =
            response.content[0].type === "text" ? response.content[0].text : "";

        // حفظ رد المساعد
        await userSupabase.from("messages").insert({
            conversation_id: conversationId,
            role: "assistant",
            content: reply,
        });

       // خصم رسالة من الرصيد
await userSupabase
    .from("users_credits")
    .update({
        credits_remaining: currentCredits - 1,
        total_used: creditsData.total_used + 1,
    })
    .eq("user_id", user.id);

// تسجيل الأحداث
await trackEvent('question_asked', user.id, {
    plan: creditsData.plan,
    credits_remaining: currentCredits - 1,
    conversation_id: conversationId,
});

if (!existingConversationId) {
    await trackEvent('conversation_created', user.id, {
        conversation_id: conversationId,
    });
}

if (currentCredits - 1 === 0) {
    await trackEvent('credits_depleted', user.id, {
        plan: creditsData.plan,
    });
}

        // التغيير الرابع - إرجاع conversationId
        return NextResponse.json({
            reply,
            creditsRemaining: currentCredits - 1,
            conversationId,
        });

    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في المساعد" },
            { status: 500 }
        );
    }
}