"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setSavingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("فشل التحديث");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      alert("حدث خطأ أثناء تحديث الدور");
    }
    setSavingId(null);
  };

  const getRoleColor = (role: string) => {
    if (role === "admin") return { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" };
    if (role === "editor") return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" };
    return { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" };
  };

  const getRoleLabel = (role: string) => {
    if (role === "admin") return "مشرف";
    if (role === "editor") return "محرر";
    return "مستخدم";
  };

  const inputStyle: React.CSSProperties = {
    padding: "5px 10px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "13px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    cursor: "pointer",
  };

  return (
    <div style={{ direction: "rtl" as const }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#0f172a" }}>
          المستخدمون
        </h1>
        <div style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "14px",
          color: "#64748b",
        }}>
          الإجمالي: {users.length}
        </div>
      </div>

      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
      }}>
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "16px 20px",
          flex: 1,
          textAlign: "center" as const,
        }}>
          <p style={{ fontSize: "24px", fontWeight: 600, color: "#0f172a" }}>
            {users.filter((u) => u.role === "admin").length}
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>مشرف</p>
        </div>
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "16px 20px",
          flex: 1,
          textAlign: "center" as const,
        }}>
          <p style={{ fontSize: "24px", fontWeight: 600, color: "#0f172a" }}>
            {users.filter((u) => u.role === "editor").length}
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>محرر</p>
        </div>
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "16px 20px",
          flex: 1,
          textAlign: "center" as const,
        }}>
          <p style={{ fontSize: "24px", fontWeight: 600, color: "#0f172a" }}>
            {users.filter((u) => u.role === "user").length}
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>مستخدم</p>
        </div>
      </div>

      {loading && (
        <p style={{ fontSize: "14px", color: "#64748b" }}>جاري التحميل...</p>
      )}

      {!loading && users.length > 0 && (
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#374151" }}>
                  المستخدم
                </th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#374151" }}>
                  الدور الحالي
                </th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#374151" }}>
                  تغيير الدور
                </th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#374151" }}>
                  تاريخ التسجيل
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const rc = getRoleColor(user.role);
                return (
                  <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "#f1f5f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#374151",
                          flexShrink: 0,
                        }}>
                          {user.full_name ? user.full_name[0] : "؟"}
                        </div>
                        <div>
                          <p style={{ fontSize: "14px", color: "#0f172a", fontWeight: 500, margin: 0 }}>
                            {user.full_name || "بدون اسم"}
                          </p>
                          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, marginTop: "2px" }}>
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        backgroundColor: rc.bg,
                        color: rc.text,
                        border: `1px solid ${rc.border}`,
                      }}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {savingId === user.id ? (
                        <span style={{ fontSize: "13px", color: "#94a3b8" }}>جاري الحفظ...</span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          style={inputStyle}
                        >
                          <option value="user">مستخدم</option>
                          <option value="editor">محرر</option>
                          <option value="admin">مشرف</option>
                        </select>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: "13px" }}>
                      {new Date(user.created_at).toLocaleDateString("ar-SA")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}