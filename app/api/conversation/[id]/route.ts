import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
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

        const { id } = params;

        // حذف المحادثة (الرسائل تنحذف تلقائياً بسبب ON DELETE CASCADE)
        const { error: deleteError } = await userSupabase
            .from("conversations")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (deleteError) {
            console.error("Error deleting conversation:", deleteError);
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
