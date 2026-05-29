"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalDocs: number;
  publishedDocs: number;
  draftDocs: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDocs: 0,
    publishedDocs: 0,
    draftDocs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [usersRes, docsRes, publishedRes, draftRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("knowledge_base").select("id", { count: "exact", head: true }).not("title", "is", null),
        supabase.from("knowledge_base").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("knowledge_base").select("id", { count: "exact", head: true }).eq("status", "draft"),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalDocs: docsRes.count || 0,
        publishedDocs: publishedRes.count || 0,
        draftDocs: draftRes.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px 24px",
    flex: 1,
  };

  const shortcuts = [
    { label: "رفع ملف جديد", href: "/admin/knowledge/upload", desc: "أضف محتوى لقاعدة المعرفة" },
    { label: "إدارة المعرفة", href: "/admin/knowledge", desc: "تعديل وحذف الملفات" },
    { label: "المستخدمون", href: "/admin/users", desc: "إدارة الأدوار والصلاحيات" },
  ];

  return (
    <div style={{ direction: "rtl" as const }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>
          لوحة تحكم سُبُل
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          مرحباً بك — إليك ملخص سريع للمنصة
        </p>
      </div>

      {loading ? (
        <p style={{ fontSize: "14px", color: "#64748b" }}>جاري التحميل...</p>
      ) : (
        <>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" as const }}>
            <div style={cardStyle}>
              <p style={{ fontSize: "28px", fontWeight: 600, color: "#0f172a" }}>{stats.totalUsers}</p>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>إجمالي المستخدمين</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: "28px", fontWeight: 600, color: "#0f172a" }}>{stats.totalDocs}</p>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>ملفات المعرفة</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: "28px", fontWeight: 600, color: "#16a34a" }}>{stats.publishedDocs}</p>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>منشور</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: "28px", fontWeight: 600, color: "#d97706" }}>{stats.draftDocs}</p>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>مسودة</p>
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", marginBottom: "12px" }}>
              روابط سريعة
            </h2>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
              {shortcuts.map((s) => (
                <Link key={s.href} href={s.href} style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  textDecoration: "none",
                  flex: 1,
                  minWidth: "160px",
                  transition: "border-color 0.2s",
                }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a", marginBottom: "4px" }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {s.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
