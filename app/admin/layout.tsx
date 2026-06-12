"use client";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
    { href: "/admin", label: "الرئيسية" },
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
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} style={{
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