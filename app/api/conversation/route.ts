import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
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
                { error: "جلسة غير صالحة" },
                { status: 401 }
            );
        }

        // جلب المحادثات
        const { data: conversations, error: conversationsError } = await userSupabase
            .from("conversations")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (conversationsError) {
            console.error("Error fetching conversations:", conversationsError);
            return NextResponse.json(
                { error: "فشل جلب المحادثات" },
                { status: 500 }
            );
        }

        if (!conversations || conversations.length === 0) {
            return NextResponse.json({ conversations: [] });
        }

        // جلب آخر رسالة لكل محادثة
        const conversationIds = conversations.map(c => c.id);
        
        const { data: messages, error: messagesError } = await userSupabase
            .from("messages")
            .select("conversation_id, content, created_at")
            .in("conversation_id", conversationIds)
            .order("created_at", { ascending: false });

        if (messagesError) {
            console.error("Error fetching messages:", messagesError);
        }

        // إنشاء map لآخر رسالة لكل محادثة
        const lastMessagesMap = new Map();
        messages?.forEach(msg => {
            if (!lastMessagesMap.has(msg.conversation_id)) {
                lastMessagesMap.set(msg.conversation_id, msg);
            }
        });

        // تنسيق البيانات
        const formattedConversations = conversations.map(conv => {
            const lastMsg = lastMessagesMap.get(conv.id);
            return {
                id: conv.id,
                title: conv.title,
                user_id: conv.user_id,
                created_at: conv.created_at,
                updated_at: conv.updated_at,
                lastMessage: lastMsg?.content || null,
                lastMessageAt: lastMsg?.created_at || conv.created_at,
            };
        });

        return NextResponse.json({ conversations: formattedConversations });
    } catch (error) {
        console.error("Get conversations error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في الخادم" },
            { status: 500 }
        );
    }
}
