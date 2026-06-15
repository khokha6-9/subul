"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

// ═══════════════════════════════
// Session ID
// ═══════════════════════════════

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem('subul_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('subul_session_id', sessionId);
  }
  return sessionId;
}

// ═══════════════════════════════
// Client Event Tracker
// ═══════════════════════════════

async function trackClientEvent(
  eventType: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        eventType,
        metadata,
        sessionId: getSessionId(),
      }),
    });
  } catch (error) {
    console.error('Track event error:', error);
  }
}

// ═══════════════════════════════
// الأنواع
// ═══════════════════════════════

type OnboardingData = {
  location: string;
  current_country: string;
  goal: string;
  experience_level: string;
};

const COUNTRIES = [
  { value: "turkey", label: "تركيا" },
  { value: "lebanon", label: "لبنان" },
  { value: "jordan", label: "الأردن" },
  { value: "germany", label: "ألمانيا" },
  { value: "sweden", label: "السويد" },
  { value: "netherlands", label: "هولندا" },
  { value: "canada", label: "كندا" },
  { value: "usa", label: "أمريكا" },
  { value: "saudi_arabia", label: "السعودية" },
  { value: "uae", label: "الإمارات" },
  { value: "other", label: "دولة أخرى" },
];

const GOALS = [
  { value: "study_abroad", label: "الدراسة في الخارج" },
  { value: "work_abroad", label: "العمل في الخارج" },
  { value: "travel_visa", label: "تأشيرة سفر" },
  { value: "asylum_legal", label: "اللجوء والوضع القانوني" },
  { value: "document_recognition", label: "تعديل الشهادات والوثائق" },
  { value: "family_reunion", label: "لمّ شمل العائلة" },
  { value: "return_to_syria", label: "العودة لسوريا" },
  { value: "general_info", label: "معلومات عامة" },
  { value: "other", label: "أخرى" },
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "مبتدئ", desc: "ما أعرف من أين أبدأ" },
  { value: "intermediate", label: "متوسط", desc: "أعرف الأساسيات" },
  { value: "advanced", label: "متقدم", desc: "عندي خبرة سابقة" },
];

type Props = {
  userId: string;
  onComplete: () => void;
};

// ═══════════════════════════════
// الـ Modal
// ═══════════════════════════════

export default function OnboardingModal({ userId, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    location: "",
    current_country: "",
    goal: "",
    experience_level: "",
  });

  const handleSkip = async () => {
    setLoading(true);
    await supabase
      .from("profiles")
      .update({ onboarding_status: "skipped" })
      .eq("id", userId);
    await trackClientEvent('onboarding_skipped', { step });
    setLoading(false);
    onComplete();
  };

  const handleComplete = async () => {
    setLoading(true);
    await supabase
      .from("profiles")
      .update({
        onboarding_status: "completed",
        onboarding_completed_at: new Date().toISOString(),
        location: data.location,
        current_country: data.location === "outside_syria" ? data.current_country : null,
        goal: data.goal,
        experience_level: data.experience_level,
      })
      .eq("id", userId);
    await trackClientEvent('onboarding_completed', {
      location: data.location,
      country: data.current_country || '',
      goal: data.goal,
      experience_level: data.experience_level,
    });
    setLoading(false);
    onComplete();
  };

  const canProceed = () => {
    if (step === 2) {
      if (data.location === '') return false;
      if (data.location === 'outside_syria' && data.current_country === '') return false;
      return true;
    }
    if (step === 3) return data.goal !== "";
    if (step === 4) return data.experience_level !== "";
    return true;
  };

  // ═══════════════════════════════
  // الأنماط
  // ═══════════════════════════════

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(4px)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  };

  const cardStyle: React.CSSProperties = {
    background: "#111111",
    border: "1px solid #222222",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "480px",
    padding: "32px",
    direction: "rtl",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const optionStyle = (selected: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: selected ? "1px solid #c9a84c" : "1px solid #222222",
    background: selected ? "rgba(201,168,76,0.1)" : "#1a1a1a",
    color: selected ? "#c9a84c" : "#aaaaaa",
    cursor: "pointer",
    textAlign: "right",
    fontSize: "14px",
    transition: "all 0.15s",
    marginBottom: "8px",
  });

  const btnPrimaryStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #c9a84c, #a88838)",
    color: "#000000",
    border: "none",
    borderRadius: "10px",
    padding: "12px 28px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
  };

  const btnSkipStyle: React.CSSProperties = {
    background: "transparent",
    color: "#555555",
    border: "none",
    fontSize: "13px",
    cursor: "pointer",
    padding: "8px",
  };

  const navRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    alignItems: "center",
  };

  const nextBtnStyle: React.CSSProperties = {
    ...btnPrimaryStyle,
    opacity: !canProceed() || loading ? 0.4 : 1,
    cursor: !canProceed() ? "not-allowed" : "pointer",
  };

  // ═══════════════════════════════
  // الـ JSX
  // ═══════════════════════════════

  return (
    <div
      style={overlayStyle}
      onClick={handleSkip}
      onKeyDown={(e) => e.key === 'Escape' && handleSkip()}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>

        {/* Progress */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              background: s <= step ? "#c9a84c" : "#222222",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* Step 1 — ترحيب */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <h1 style={{ fontSize: "28px", color: "#c9a84c", margin: "0 0 8px", letterSpacing: "2px" }}>
                سُبُل
              </h1>
              <h2 style={{ fontSize: "20px", color: "#ffffff", margin: "0 0 12px" }}>
                أهلاً بك 👋
              </h2>
              <p style={{ color: "#aaaaaa", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                سُبُل هو مستشارك الذكي للوصول لهدفك — منح دراسية، تأشيرات، وثائق، ولجوء.
                سنطرح عليك 3 أسئلة سريعة لنخصص تجربتك.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                style={btnPrimaryStyle}
                onClick={() => {
                  trackClientEvent('onboarding_started');
                  setStep(2);
                }}
              >
                يلا نبدأ ←
              </button>
              <button style={btnSkipStyle} onClick={handleSkip} disabled={loading}>
                للموقع الآن بدون تخصيص
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — الموقع */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: "18px", color: "#ffffff", margin: "0 0 6px" }}>
              أين أنت حالياً؟
            </h2>
            <p style={{ color: "#666666", fontSize: "13px", margin: "0 0 20px" }}>
              يساعدنا هذا في تقديم معلومات دقيقة لوضعك
            </p>
            <button
              style={optionStyle(data.location === "inside_syria")}
              onClick={() => setData({ ...data, location: "inside_syria", current_country: "" })}
            >
              🇸🇾 داخل سوريا
            </button>
            <button
              style={optionStyle(data.location === "outside_syria")}
              onClick={() => setData({ ...data, location: "outside_syria" })}
            >
              ✈️ خارج سوريا
            </button>
            {data.location === "outside_syria" && (
              <div style={{ marginTop: "12px" }}>
                <p style={{ color: "#888888", fontSize: "13px", marginBottom: "8px" }}>في أي دولة؟</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.value}
                      style={optionStyle(data.current_country === c.value)}
                      onClick={() => setData({ ...data, current_country: c.value })}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={navRow}>
              <button style={btnSkipStyle} onClick={handleSkip} disabled={loading}>تخطي</button>
              <button
                style={nextBtnStyle}
                onClick={() => canProceed() && setStep(3)}
                disabled={!canProceed() || loading}
              >
                التالي ←
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — الهدف */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: "18px", color: "#ffffff", margin: "0 0 6px" }}>
              ما الذي يهمك؟
            </h2>
            <p style={{ color: "#666666", fontSize: "13px", margin: "0 0 20px" }}>
              اختر الموضوع الأهم بالنسبة لك الآن
            </p>
            {GOALS.map((g) => (
              <button
                key={g.value}
                style={optionStyle(data.goal === g.value)}
                onClick={() => setData({ ...data, goal: g.value })}
              >
                {g.label}
              </button>
            ))}
            <div style={navRow}>
              <button style={btnSkipStyle} onClick={handleSkip} disabled={loading}>تخطي</button>
              <button
                style={nextBtnStyle}
                onClick={() => canProceed() && setStep(4)}
                disabled={!canProceed() || loading}
              >
                التالي ←
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — مستوى الخبرة */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: "18px", color: "#ffffff", margin: "0 0 6px" }}>
              ما مستوى خبرتك؟
            </h2>
            <p style={{ color: "#666666", fontSize: "13px", margin: "0 0 20px" }}>
              سنكيّف أسلوب الإجابة حسب مستواك
            </p>
            {EXPERIENCE_LEVELS.map((e) => (
              <button
                key={e.value}
                style={optionStyle(data.experience_level === e.value)}
                onClick={() => setData({ ...data, experience_level: e.value })}
              >
                <div style={{ fontWeight: "bold", marginBottom: "2px" }}>{e.label}</div>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>{e.desc}</div>
              </button>
            ))}
            <div style={navRow}>
              <button style={btnSkipStyle} onClick={handleSkip} disabled={loading}>تخطي</button>
              <button
                style={nextBtnStyle}
                onClick={() => canProceed() && setStep(5)}
                disabled={!canProceed() || loading}
              >
                التالي ←
              </button>
            </div>
          </div>
        )}

        {/* Step 5 — يلا نبدأ */}
        {step === 5 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
            <h2 style={{ fontSize: "20px", color: "#ffffff", margin: "0 0 12px" }}>
              جاهز للانطلاق!
            </h2>
            <p style={{ color: "#aaaaaa", fontSize: "14px", lineHeight: "1.7", margin: "0 0 28px" }}>
              سُبُل جاهز لمساعدتك. اسأل أي سؤال وستحصل على إجابة دقيقة من مصادر موثوقة.
            </p>
            <button
              style={{ ...btnPrimaryStyle, width: "100%", padding: "14px" }}
              onClick={handleComplete}
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : "يلا نبدأ ←"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}