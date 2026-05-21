import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function GET(
    req: NextRequest,
    { params }: { params: { conversationId: string } }
) {
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

        const { conversationId } = params;

        // التحقق من ملكية المحادثة
        const { data: conversation, error: convError } = await userSupabase
            .from("conversations")
            .select("*")
            .eq("id", conversationId)
            .eq("user_id", user.id)
            .single();

        if (convError || !conversation) {
            return NextResponse.json(
                { error: "المحادثة غير موجودة أو ليس لديك صلاحية" },
                { status: 404 }
            );
        }

        // جلب الرسائل
        const { data: messages, error: messagesError } = await userSupabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

        if (messagesError) {
            console.error("Error fetching messages:", messagesError);
            return NextResponse.json(
                { error: "فشل جلب الرسائل" },
                { status: 500 }
            );
        }

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Get messages error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في الخادم" },
            { status: 500 }
        );
    }
}
