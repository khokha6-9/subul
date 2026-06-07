"use client";

import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        direction: "rtl",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "#111",
          border: "0.5px solid rgba(201,168,76,0.3)",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ fontSize: "48px" }}>✅</div>

        <h1 style={{ fontSize: "20px", fontWeight: 500 }}>
          تم استلام دفعتك
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7,
          }}
        >
          سيتم تفعيل اشتراكك تلقائياً بعد تأكيد الشبكة
          <br />
          عادةً خلال بضع دقائق
        </p>

        <div
          style={{
            background: "rgba(201,168,76,0.08)",
            border: "0.5px solid rgba(201,168,76,0.2)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            fontSize: "13px",
            color: "#C9A84C",
            width: "100%",
          }}
        >
          نحن في سُبُل، طريقك للبداية الجديدة 🌟
        </div>

        <button
          onClick={() => router.push("/")}
          style={{
            marginTop: "0.5rem",
            background: "#C9A84C",
            color: "#0a0a0a",
            border: "none",
            borderRadius: "8px",
            padding: "11px 24px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          العودة للرئيسية ←
        </button>
      </div>
    </main>
  );
}