import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div style={{
      display: "flex" as const,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      minHeight: "100vh",
      gap: "16px",
      fontFamily: "sans-serif",
      direction: "rtl" as const,
    }}>
      <h1 style={{ fontSize: "24px", fontWeight: 500 }}>
        غير مصرح لك بالدخول
      </h1>
      <p style={{ color: "#666", fontSize: "14px" }}>
        هذه الصفحة مخصصة للمشرفين فقط
      </p>
      <Link href="/" style={{ fontSize: "14px", color: "#0070f3" }}>
        العودة للرئيسية
      </Link>
    </div>
  );
}