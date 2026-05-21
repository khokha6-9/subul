import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function POST(req: NextRequest) {
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

        const { title } = await req.json();

        // إنشاء محادثة جديدة
        const { data: conversation, error: conversationError } = await userSupabase
            .from("conversations")
            .insert({
                user_id: user.id,
                title: title || "محادثة جديدة",
            })
            .select()
            .single();

        if (conversationError) {
            console.error("Error creating conversation:", conversationError);
            return NextResponse.json(
                { error: "فشل إنشاء المحادثة" },
                { status: 500 }
            );
        }

        return NextResponse.json({ conversation });
    } catch (error) {
        console.error("Create conversation error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في الخادم" },
            { status: 500 }
        );
    }
}
