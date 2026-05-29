"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface KnowledgeItem {
  id: string;
  title: string;
  country?: string;
  category?: string;
  status: string;
  created_at: string;
}

interface EditForm {
  title: string;
  country: string;
  category: string;
  status: string;
}

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<KnowledgeItem | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ title: "", country: "", category: "", status: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCountry, setFilterCountry] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    let query = supabase
      .from("knowledge_base")
      .select("id, title, country, category, status, created_at")
      .not("title", "is", null)
      .order("created_at", { ascending: false });

    if (filterStatus) query = query.eq("status", filterStatus);
    if (filterCountry) query = query.eq("country", filterCountry);

    const { data, error } = await query;
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [filterStatus, filterCountry]);

  const getStatusLabel = (status: string) => {
    if (status === "published") return "منشور";
    if (status === "draft") return "مسودة";
    return "قديم";
  };

  const getStatusColor = (status: string) => {
    if (status === "published") return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" };
    if (status === "draft") return { bg: "#fffbeb", text: "#d97706", border: "#fde68a" };
    return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" };
  };

  const handleEdit = (item: KnowledgeItem) => {
    setEditItem(item);
    setEditForm({
      title: item.title,
      country: item.country || "",
      category: item.category || "",
      status: item.status || "published",
    });
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/knowledge/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("فشل الحفظ");
      setEditItem(null);
      fetchItems();
    } catch {
      alert("حدث خطأ أثناء الحفظ");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/knowledge/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل الحذف");
      setDeleteId(null);
      fetchItems();
    } catch {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
  };

  return (
    <div style={{ direction: "rtl" as const }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#0f172a" }}>إدارة المعرفة</h1>
        <Link href="/admin/knowledge/upload" style={{
          backgroundColor: "#0f172a", color: "#fff",
          padding: "9px 18px", borderRadius: "8px",
          fontSize: "14px", textDecoration: "none", fontWeight: 500,
        }}>
          رفع ملف جديد
        </Link>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: "160px" }}>
          <option value="">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="outdated">قديم</option>
        </select>
        <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} style={{ ...inputStyle, width: "160px" }}>
          <option value="">كل الدول</option>
          <option value="germany">ألمانيا</option>
          <option value="turkey">تركيا</option>
          <option value="canada">كندا</option>
          <option value="usa">الولايات المتحدة</option>
          <option value="uk">المملكة المتحدة</option>
          <option value="general">عام</option>
        </select>
      </div>

      {loading && <p style={{ fontSize: "14px", color: "#64748b" }}>جاري التحميل...</p>}

      {!loading && items.length === 0 && (
        <p style={{ fontSize: "14px", color: "#64748b" }}>لا توجد ملفات</p>
      )}

      {!loading && items.length > 0 && (
        <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#374151" }}>العنوان</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#374151" }}>الدولة</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#374151" }}>التصنيف</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#374151" }}>الحالة</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#374151" }}>التاريخ</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#374151" }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const sc = getStatusColor(item.status);
                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 16px", color: "#0f172a", maxWidth: "240px" }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.title}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{item.country || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{item.category || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                        backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                      }}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "13px" }}>
                      {new Date(item.created_at).toLocaleDateString("ar-SA")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleEdit(item)} style={{
                          padding: "5px 12px", borderRadius: "6px", fontSize: "13px",
                          backgroundColor: "#f8fafc", color: "#374151",
                          border: "1px solid #e2e8f0", cursor: "pointer",
                        }}>
                          تعديل
                        </button>
                        <button onClick={() => setDeleteId(item.id)} style={{
                          padding: "5px 12px", borderRadius: "6px", fontSize: "13px",
                          backgroundColor: "#fef2f2", color: "#dc2626",
                          border: "1px solid #fecaca", cursor: "pointer",
                        }}>
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editItem && (
        <div style={{
          position: "fixed" as const, inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50,
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "12px",
            padding: "24px", width: "480px", direction: "rtl" as const,
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", marginBottom: "20px" }}>
              تعديل الملف
            </h2>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "5px" }}>العنوان</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "5px" }}>الدولة</label>
                  <select value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} style={inputStyle}>
                    <option value="">اختر</option>
                    <option value="germany">ألمانيا</option>
                    <option value="turkey">تركيا</option>
                    <option value="canada">كندا</option>
                    <option value="usa">الولايات المتحدة</option>
                    <option value="uk">المملكة المتحدة</option>
                    <option value="general">عام</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "5px" }}>التصنيف</label>
                  <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} style={inputStyle}>
                    <option value="">اختر</option>
                    <option value="scholarship">منح دراسية</option>
                    <option value="visa">تأشيرة وإقامة</option>
                    <option value="work">عمل وتوظيف</option>
                    <option value="asylum">لجوء</option>
                    <option value="education">تعليم</option>
                    <option value="health">صحة</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", marginBottom: "5px" }}>الحالة</label>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} style={inputStyle}>
                  <option value="published">منشور</option>
                  <option value="draft">مسودة</option>
                  <option value="outdated">قديم</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={handleSave} disabled={saving} style={{
                backgroundColor: "#0f172a", color: "#fff",
                padding: "9px 20px", borderRadius: "8px",
                border: "none", fontSize: "14px", cursor: "pointer", fontWeight: 500,
              }}>
                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
              <button onClick={() => setEditItem(null)} style={{
                backgroundColor: "#fff", color: "#374151",
                padding: "9px 20px", borderRadius: "8px",
                border: "1px solid #e2e8f0", fontSize: "14px", cursor: "pointer",
              }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div style={{
          position: "fixed" as const, inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50,
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "12px",
            padding: "24px", width: "380px", direction: "rtl" as const, textAlign: "center" as const,
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              backgroundColor: "#fef2f2", border: "1px solid #fecaca",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontSize: "20px",
            }}>
              !
            </div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>
              تأكيد الحذف
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={handleDelete} style={{
                backgroundColor: "#dc2626", color: "#fff",
                padding: "9px 20px", borderRadius: "8px",
                border: "none", fontSize: "14px", cursor: "pointer", fontWeight: 500,
              }}>
                نعم، احذف
              </button>
              <button onClick={() => setDeleteId(null)} style={{
                backgroundColor: "#fff", color: "#374151",
                padding: "9px 20px", borderRadius: "8px",
                border: "1px solid #e2e8f0", fontSize: "14px", cursor: "pointer",
              }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}