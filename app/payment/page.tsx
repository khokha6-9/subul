"use client";
import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

const PLANS: Record<string, { name: string; price: number; questions: number }> = {
  starter: { name: "سُبُل ستارتر", price: 1, questions: 100 },
  plus: { name: "سُبُل بلس", price: 3, questions: 400 },
  pro: { name: "سُبُل برو", price: 7, questions: 1200 },
};

const USDT_WALLET = "TQeXxxxxxxxxxxxxxxxxxxxxxxxxxxx";

type Method = "usdt" | "sham_cash" | null;
type Step = "method" | "form" | "success";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const planKey = searchParams.get("plan") || "starter";
  const plan = PLANS[planKey] || PLANS.starter;

  const [method, setMethod] = useState<Method>(null);
  const [step, setStep] = useState<Step>("method");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState("");
async function handleUsdtPayment() {
  if (!user) {
    router.push("/login");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/payments/oxapay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        userEmail: user.email,
        userName: user.email?.split("@")[0] || "مستخدم",
        plan: planKey,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "حدث خطأ، حاول مجدداً");
      return;
    }

    window.location.href = data.payLink;

  } catch {
    setError("حدث خطأ في الاتصال، حاول مجدداً");
  } finally {
    setLoading(false);
  }
}
  

  async function handleSubmit() {
    if (!transactionId.trim()) {
      setError("الرجاء إدخال رقم العملية");
      return;
    }
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/sham-cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          userName: user.email?.split("@")[0] || "مستخدم",
          plan: planKey,
          transactionId: transactionId.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ، حاول مجدداً");
        return;
      }

      setPaymentId(data.paymentId);
      setStep("success");
    } catch {
      setError("حدث خطأ في الاتصال، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        direction: "rtl",
        padding: "5rem 1.5rem 4rem",
        fontFamily: "inherit",
      }}
    >
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>

        {/* ملخص الخطة */}
        <div
          style={{
            background: "#111",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>
            الخطة المختارة
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "16px", fontWeight: 500 }}>{plan.name}</span>
            <span style={{ fontSize: "22px", fontWeight: 500, color: "#C9A84C" }}>
              {plan.price}$
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem" }}>
            {plan.questions} سؤال شهرياً
          </p>
        </div>

        {/* اختيار طريقة الدفع */}
        {step === "method" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>
              اختر طريقة الدفع
            </p>

            <button
             onClick={handleUsdtPayment}
              style={{
                background: "#111",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "1.25rem 1.5rem",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "14px", fontWeight: 500 }}>USDT</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                  تحويل مباشر — TRC20 أو BEP20
                </p>
              </div>
              <span style={{ fontSize: "20px" }}>₮</span>
            </button>

            <button
              onClick={() => { setMethod("sham_cash"); setStep("form"); }}
              style={{
                background: "#111",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "1.25rem 1.5rem",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "14px", fontWeight: 500 }}>شام كاش</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                 الدفع عبر شام كاش
                </p>
              </div>
              <span style={{ fontSize: "20px" }}>🏦</span>
            </button>
          </div>
        )}

        {/* نموذج USDT */}
        {step === "form" && method === "usdt" && (
          <div
            style={{
              background: "#111",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              حوّل المبلغ لهذه المحفظة
            </p>
            <div
              style={{
                background: "rgba(201,168,76,0.08)",
                border: "0.5px solid rgba(201,168,76,0.2)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                fontSize: "12px",
                color: "#C9A84C",
                wordBreak: "break-all",
                direction: "ltr",
                textAlign: "left",
              }}
            >
              {USDT_WALLET}
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              بعد التحويل، أدخل رقم العملية
            </p>
            <input
              type="text"
              placeholder="رقم العملية / Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
                direction: "ltr",
              }}
            />
            {error && (
              <p style={{ fontSize: "12px", color: "#ff6b6b" }}>{error}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: "#C9A84C",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "8px",
                padding: "11px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "جارٍ الإرسال..." : "أرسل الطلب ←"}
            </button>
          </div>
        )}

        {/* نموذج شام كاش */}
        {step === "form" && method === "sham_cash" && (
          <div
            style={{
              background: "#111",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                background: "rgba(201,168,76,0.08)",
                border: "0.5px solid rgba(201,168,76,0.2)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                fontSize: "13px",
                color: "#C9A84C",
                lineHeight: 1.7,
              }}
            >
             حوّل مبلغ {plan.price}$ عبر شام كاش
              <br />
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                سيتم تزويدك برقم الحساب عبر الدعم
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              بعد التحويل، أدخل رقم العملية
            </p>
            <input
              type="text"
              placeholder="رقم العملية من شام كاش"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
              }}
            />
            {error && (
              <p style={{ fontSize: "12px", color: "#ff6b6b" }}>{error}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: "#C9A84C",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "8px",
                padding: "11px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "جارٍ الإرسال..." : "أرسل الطلب ←"}
            </button>
          </div>
        )}

        {/* نجاح */}
        {step === "success" && (
          <div
            style={{
              background: "#111",
              border: "0.5px solid rgba(201,168,76,0.3)",
              borderRadius: "16px",
              padding: "2rem 1.5rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "36px" }}>✅</div>
            <h2 style={{ fontSize: "18px", fontWeight: 500 }}>تم استلام طلبك</h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              سيتم مراجعة طلبك وتفعيل اشتراكك خلال 24 ساعة
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
              رقم الطلب: {paymentId}
            </p>
            <button
              onClick={() => router.push("/")}
              style={{
                marginTop: "0.5rem",
                background: "transparent",
                border: "0.5px solid rgba(255,255,255,0.15)",
                borderRadius: "8px",
                padding: "9px 20px",
                color: "#fff",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              العودة للرئيسية
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
export default function PaymentPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>جارٍ التحميل...</p>
      </main>
    }>
      <PaymentContent />
    </Suspense>
  );
}