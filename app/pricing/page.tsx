"use client";

import Link from "next/link";

const plans = [
  {
    name: "سُبُل ستارتر",
    price: 1,
    questions: 100,
    featured: false,
    features: [
      { text: "المستشار الذكي كامل", included: true },
      { text: "قاعدة معلومات موثّقة", included: true },
      { text: "تحديثات مستمرة", included: true },
      { text: "أولوية في الردود", included: false },
      { text: "دعم مباشر", included: false },
    ],
    cta: "ابدأ الآن",
    plan: "starter",
  },
  {
    name: "سُبُل بلس",
    price: 3,
    questions: 400,
    featured: true,
    features: [
      { text: "المستشار الذكي كامل", included: true },
      { text: "قاعدة معلومات موثّقة", included: true },
      { text: "تحديثات مستمرة", included: true },
      { text: "أولوية في الردود", included: true },
      { text: "دعم مباشر", included: false },
    ],
    cta: "اشترك الآن",
    plan: "plus",
  },
  {
    name: "سُبُل برو",
    price: 7,
    questions: 1200,
    featured: false,
    features: [
      { text: "المستشار الذكي كامل", included: true },
      { text: "قاعدة معلومات موثّقة", included: true },
      { text: "تحديثات مستمرة", included: true },
      { text: "أولوية في الردود", included: true },
      { text: "دعم مباشر", included: true },
    ],
    cta: "ابدأ الآن",
    plan: "pro",
  },
];

export default function PricingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        direction: "rtl",
        padding: "5rem 1.5rem 4rem",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(201,168,76,0.1)",
              border: "0.5px solid rgba(201,168,76,0.25)",
              color: "#C9A84C",
              fontSize: "12px",
              padding: "5px 14px",
              borderRadius: "20px",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#C9A84C",
              }}
            />
            خطط مرنة للجميع
          </div>

          <h1
            style={{
              fontSize: "38px",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "0.5rem",
              lineHeight: 1.3,
            }}
          >
            غيّر حياتك{" "}
            <span style={{ color: "#C9A84C" }}>بدولار واحد</span>
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "420px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            شريكك للوصول لهدفك
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.plan}
              style={{
                background: "#111",
                border: plan.featured
                  ? "1.5px solid #C9A84C"
                  : "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "1.75rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                position: "relative",
              }}
            >
              {plan.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: "-13px",
                    right: "50%",
                    transform: "translateX(50%)",
                    background: "#C9A84C",
                    color: "#0a0a0a",
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "3px 16px",
                    borderRadius: "20px",
                    whiteSpace: "nowrap",
                  }}
                >
                  الأكثر طلباً
                </div>
              )}

              <div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {plan.name}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "3px",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "38px", fontWeight: 500, color: "#fff" }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)" }}>
                    $
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                    / شهرياً
                  </span>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "rgba(201,168,76,0.08)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    color: "#C9A84C",
                    fontSize: "12px",
                    padding: "4px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {plan.questions} سؤال شهرياً
                </div>
              </div>

              <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "11px", flex: 1 }}>
                {plan.features.map((feat, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      fontSize: "13px",
                      color: feat.included ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    <span style={{ color: feat.included ? "#C9A84C" : "rgba(255,255,255,0.2)" }}>
                      {feat.included ? "✓" : "✕"}
                    </span>
                    {feat.text}
                  </div>
                ))}
              </div>

              <Link
                href={`/payment?plan=${plan.plan}`}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "11px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  textAlign: "center",
                  textDecoration: "none",
                  border: plan.featured ? "none" : "0.5px solid rgba(255,255,255,0.15)",
                  background: plan.featured ? "#C9A84C" : "transparent",
                  color: plan.featured ? "#0a0a0a" : "#fff",
                  fontWeight: plan.featured ? 500 : 400,
                }}
              >
                {plan.cta} ←
              </Link>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            لا رسوم خفية — يمكن إلغاء الاشتراك في أي وقت
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            {["USDT", "شام كاش"].map((m) => (
              <span
                key={m}
                style={{
                  fontSize: "11px",
                  background: "rgba(255,255,255,0.05)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.4)",
                  padding: "3px 10px",
                  borderRadius: "5px",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}