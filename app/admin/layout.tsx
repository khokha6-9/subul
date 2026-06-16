"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingAlerts, setPendingAlerts] = useState(0);

  useEffect(() => {
    fetch('/api/admin/alerts')
      .then((r) => r.json())
      .then((d) => setPendingAlerts(d.count || 0))
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: "/admin/analytics", label: "التحليلات" },
    { href: "/admin/knowledge", label: "إدارة المعرفة" },
    { href: "/admin/users", label: "المستخدمون" },
    { href: "/admin/payments", label: "المدفوعات" },
  ];

  return (
    <div style={{
      display: "flex" as const,
      minHeight: "100vh",
      fontFamily: "sans-serif",
      direction: "rtl" as const,
      backgroundColor: "#0a0a0a",
    }}>
      <aside style={{
        width: "220px",
        borderLeft: "1px solid #1a1a1a",
        padding: "24px 12px",
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: "4px",
        backgroundColor: "#0f0f0f",
        flexShrink: 0,
      }}>
        <p style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#c9a84c",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "1px solid #1a1a1a",
          paddingRight: "12px",
          letterSpacing: "1px",
        }}>
          سُبُل — أدمن
        </p>

        {/* الرئيسية مع Badge */}
        <Link
          href="/admin"
          style={{
            fontSize: "13px",
            color: "#aaaaaa",
            textDecoration: "none",
            padding: "9px 12px",
            borderRadius: "8px",
            transition: "all 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1a1a1a";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#aaaaaa";
          }}
        >
          الرئيسية
          {pendingAlerts > 0 && (
            <span style={{
              background: "#ef4444",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "bold",
              borderRadius: "10px",
              padding: "2px 6px",
              minWidth: "18px",
              textAlign: "center",
            }}>
              {pendingAlerts}
            </span>
          )}
        </Link>

        {/* باقي الروابط */}
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontSize: "13px",
              color: "#aaaaaa",
              textDecoration: "none",
              padding: "9px 12px",
              borderRadius: "8px",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1a1a1a";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#aaaaaa";
            }}
          >
            {link.label}
          </Link>
        ))}
      </aside>

      <main style={{
        flex: 1,
        padding: "32px",
        backgroundColor: "#0a0a0a",
        overflowY: "auto" as const,
      }}>
        {children}
      </main>
    </div>
  );
}