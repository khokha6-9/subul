import OpenAI from "openai";
import { SupabaseClient } from "@supabase/supabase-js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type SearchResult = {
    content: string;
    metadata: Record<string, unknown>;
    similarity: number;
};

export async function searchKnowledgeBase(
    query: string,
    supabaseClient: SupabaseClient,
    matchCount: number = 5
): Promise<SearchResult[]> {
    try {
        // تحويل السؤال إلى embedding
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: query,
        });

        const queryEmbedding = embeddingResponse.data[0].embedding;

        // البحث في Supabase باستخدام match_documents
        const { data, error } = await supabaseClient.rpc("match_documents", {
            query_embedding: queryEmbedding,
            match_threshold: 0.5,
            match_count: matchCount,
        });

        if (error) {
            console.error("Supabase search error:", error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        return data as SearchResult[];
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}

export function buildContextFromResults(results: SearchResult[]): string {
    if (results.length === 0) {
        return "";
    }

    const contextParts = results.map((result, index) => {
        const country = result.metadata?.country ?? "غير محدد";
        const topic = result.metadata?.topic ?? "عام";
        return `[مصدر ${index + 1} — ${country} — ${topic}]\n${result.content}`;
    });

    return contextParts.join("\n\n---\n\n");
}