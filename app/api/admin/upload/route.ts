import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 150;

function chunkText(text: string): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let i = 0;

  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(" ");
    if (chunk.trim()) chunks.push(chunk.trim());
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.name.endsWith(".pdf")) {
    const { extractText: extract } = await import("unpdf");
    const result = await extract(new Uint8Array(buffer));
    return result.text.join(" ");
  }

  return buffer.toString("utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const isPreview = formData.get("preview") === "true";

    if (!file) {
      return NextResponse.json({ error: "الملف مطلوب" }, { status: 400 });
    }

    const text = await extractText(file);
    const chunks = chunkText(text);

    if (isPreview) {
      return NextResponse.json({
        chunks: chunks.slice(0, 3),
        totalChunks: chunks.length,
      });
    }

    const title = formData.get("title") as string;
    const country = formData.get("country") as string;
    const category = formData.get("category") as string;

    if (!title) {
      return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
    }

    let successCount = 0;
    const errors: number[] = [];

    for (let i = 0; i < chunks.length; i++) {
      try {
        const embeddingRes = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunks[i],
        });

        const embedding = embeddingRes.data[0].embedding;

        const { error } = await supabase.from("knowledge_base").insert({
          title: `${title} — القسم ${i + 1}`,
          content: chunks[i],
          embedding,
          country: country || null,
          category: category || null,
          status: "published",
          file_path: file.name,
        });

        if (error) throw error;
        successCount++;
      } catch {
        errors.push(i + 1);
      }
    }

    return NextResponse.json({
      success: true,
      totalChunks: chunks.length,
      successCount,
      failedChunks: errors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ غير معروف";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}