import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");

        // إنشاء client مع توكن المستخدم نفسه
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: { Authorization: `Bearer ${token}` },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const { data, error } = await supabase
            .from("users_credits")
            .select("credits_remaining, total_used, is_plus")
            .eq("user_id", user.id)
            .single();

        if (error) {
            console.error("DB error:", error);
            return NextResponse.json({
                error: "Credits not found",
                details: error.message
            }, { status: 404 });
        }

        return NextResponse.json({
            credits: data.credits_remaining,
            used: data.total_used,
            isPlus: data.is_plus,
        });
    } catch (error) {
        console.error("Credits API error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}