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
        const userSupabase = createUserSupabase(token);

        const { data: { user }, error: authError } =
            await userSupabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: "جلسة غير صالحة" },
                { status: 401 }
            );
        }

        const { data: conversations, error } = await userSupabase
            .from("conversations")
            .select("id, title, message_count, last_message_at, created_at, updated_at")
            .eq("user_id", user.id)
            .eq("is_archived", false)
            .order("last_message_at", { ascending: false, nullsFirst: false });

        if (error) {
            console.error("Error fetching conversations:", error);
            return NextResponse.json(
                { error: "فشل جلب المحادثات" },
                { status: 500 }
            );
        }

        return NextResponse.json({ conversations: conversations ?? [] });

    } catch (error) {
        console.error("Get conversations error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في الخادم" },
            { status: 500 }
        );
    }
}