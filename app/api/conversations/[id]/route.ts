import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createUserSupabase(token: string) {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: { Authorization: `Bearer ${token}` },
            },
        }
    );
}

async function getUser(token: string, userSupabase: ReturnType<typeof createUserSupabase>) {
    const { data: { user }, error } = await userSupabase.auth.getUser(token);
    return { user, error };
}

// جلب رسائل محادثة واحدة
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
)
{
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            );
        }

        const token = authHeader.replace("Bearer ", "");
        const userSupabase = createUserSupabase(token);
        const { user, error: authError } = await getUser(token, userSupabase);

        if (authError || !user) {
            return NextResponse.json(
                { error: "جلسة غير صالحة" },
                { status: 401 }
            );
        }

      const { id } = await params;

       
     // التحقق إن المحادثة تخص هذا المستخدم
     
        const { data: conversation, error: convError } = await userSupabase
            .from("conversations")
            .select("id, title, message_count, created_at")
            .eq("id", id)
            .eq("user_id", user.id)
            .eq("is_archived", false)
            .single();

        if (convError || !conversation) {
            return NextResponse.json(
                { error: "المحادثة غير موجودة" },
                { status: 404 }
            );
        }

        // جلب الرسائل
        const { data: messages, error: messagesError } = await userSupabase
            .from("messages")
            .select("id, role, content, created_at")
            .eq("conversation_id", id)
            .order("created_at", { ascending: true });

        if (messagesError) {
            return NextResponse.json(
                { error: "فشل جلب الرسائل" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            conversation,
            messages: messages ?? [],
        });

    } catch (error) {
        console.error("Get conversation error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في الخادم" },
            { status: 500 }
        );
    }
}

// أرشفة المحادثة بدل الحذف الحقيقي
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
)
 {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "يجب تسجيل الدخول" },
                { status: 401 }
            );
        }

        const token = authHeader.replace("Bearer ", "");
        const userSupabase = createUserSupabase(token);
        const { user, error: authError } = await getUser(token, userSupabase);

        if (authError || !user) {
            return NextResponse.json(
                { error: "جلسة غير صالحة" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const { error: archiveError } = await userSupabase
            .from("conversations")
            .update({ is_archived: true })
            .eq("id", id)
            .eq("user_id", user.id);

        if (archiveError) {
            console.error("Error archiving conversation:", archiveError);
            return NextResponse.json(
                { error: "فشل حذف المحادثة" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete conversation error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في الخادم" },
            { status: 500 }
        );
    }
}