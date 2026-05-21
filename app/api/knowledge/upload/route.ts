import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { content, metadata } = await req.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "المحتوى مطلوب" },
        { status: 400 }
      );
    }

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });

    const embedding = embeddingResponse.data[0].embedding;

    const { data, error } = await supabase
      .from("knowledge_base")
      .insert({
        content,
        embedding,
        metadata: metadata || {},
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "فشل الحفظ في قاعدة البيانات" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      created_at: data.created_at,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Upload API error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}