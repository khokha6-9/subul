import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex" as const,
      minHeight: "100vh",
      fontFamily: "sans-serif",
      direction: "rtl" as const,
    }}>
      <aside style={{
        width: "240px",
        borderLeft: "0.5px solid #e5e5e5",
        padding: "24px 16px",
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: "8px",
        backgroundColor: "#fafafa",
      }}>
        <p style={{
          fontSize: "16px",
          fontWeight: 500,
          marginBottom: "16px",
          paddingBottom: "16px",
          borderBottom: "0.5px solid #e5e5e5",
        }}>
          لوحة سُبُل
        </p>
        <Link href="/admin" style={{
          fontSize: "14px",
          color: "#333",
          textDecoration: "none",
          padding: "8px 12px",
          borderRadius: "6px",
        }}>
          الرئيسية
        </Link>
        <Link href="/admin/knowledge" style={{
          fontSize: "14px",
          color: "#333",
          textDecoration: "none",
          padding: "8px 12px",
          borderRadius: "6px",
        }}>
          إدارة المعرفة
        </Link>
        <Link href="/admin/users" style={{
          fontSize: "14px",
          color: "#333",
          textDecoration: "none",
          padding: "8px 12px",
          borderRadius: "6px",
        }}>
          المستخدمون
        </Link>
      </aside>
      <main style={{
        flex: 1,
        padding: "32px",
        backgroundColor: "#ffffff",
      }}>
        {children}
      </main>
    </div>
  );
}