import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { query, limit = 5, threshold = 0.5 } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "السؤال مطلوب" },
        { status: 400 }
      );
    }

    // توليد embedding للسؤال
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // البحث في knowledge_base
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      console.error("Supabase search error:", error);
      return NextResponse.json(
        { error: "فشل البحث في قاعدة البيانات" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      results: data,
      count: data?.length || 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Search API error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}