"use client";
import { useState } from "react";

export default function TestPage() {
  const [uploadResult, setUploadResult] = useState("");
  const [searchResult, setSearchResult] = useState("");

  async function testUpload() {
    const res = await fetch("/api/knowledge/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "للحصول على الجنسية الالمانية يجب الاقامة 5 سنوات على الاقل",
        metadata: { country: "germany", topic: "citizenship" },
      }),
    });
    const data = await res.json();
    setUploadResult(JSON.stringify(data, null, 2));
  }

  async function testSearch() {
    const res = await fetch("/api/knowledge/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "كم سنة اقامة للجنسية الالمانية",
        limit: 3,
      }),
    });
    const data = await res.json();
    setSearchResult(JSON.stringify(data, null, 2));
  }

  return (
    <div style={{ padding: "2rem", direction: "rtl" }}>
      <h2>اختبار Upload</h2>
      <button onClick={testUpload}>رفع محتوى</button>
      <pre>{uploadResult}</pre>

      <hr />

      <h2>اختبار Search</h2>
      <button onClick={testSearch}>بحث</button>
      <pre>{searchResult}</pre>
    </div>
  );
}