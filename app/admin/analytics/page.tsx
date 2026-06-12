"use client";

import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════
// الأنواع
// ═══════════════════════════════

interface UsersData {
  total: number;
  newThisMonth: number;
  newLastMonth: number;
  growthPercent: number | null;
  onboardingDist: Record<string, number>;
  locationDist: Record<string, number>;
  topCountries: { country: string; count: number }[];
  goalDist: Record<string, number>;
  experienceDist: Record<string, number>;
}

interface RevenueData {
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueGrowth: number | null;
  totalRevenue: number;
  activeSubscriptions: number;
  methodDist: Record<string, number>;
  planDist: Record<string, number>;
}

interface ActivityData {
  totalEvents: number;
  eventsThisMonth: number;
  eventsLastMonth: number;
  activityGrowth: number | null;
  uniqueActiveUsers: number;
  eventTypeDist: Record<string, number>;
  categoryDist: Record<string, number>;
}

// ═══════════════════════════════
// مساعدات
// ═══════════════════════════════

const GOAL_LABELS: Record<string, string> = {
  study_abroad: "دراسة في الخارج",
  work_abroad: "عمل في الخارج",
  travel_visa: "تأشيرة سفر",
  asylum_legal: "لجوء وضع قانوني",
  document_recognition: "تعديل شهادات",
  family_reunion: "لمّ شمل",
  return_to_syria: "العودة لسوريا",
  general_info: "معلومات عامة",
  other: "أخرى",
};

const COUNTRY_LABELS: Record<string, string> = {
  turkey: "تركيا",
  lebanon: "لبنان",
  jordan: "الأردن",
  germany: "ألمانيا",
  sweden: "السويد",
  netherlands: "هولندا",
  canada: "كندا",
  usa: "أمريكا",
  saudi_arabia: "السعودية",
  uae: "الإمارات",
  other: "أخرى",
};

function GrowthBadge({ value }: { value: number | null }) {
  if (value === null) return <span style={{ color: "#555", fontSize: "12px" }}>لا يوجد بيانات سابقة</span>;
  const isPositive = value >= 0;
  return (
    <span style={{
      fontSize: "12px",
      fontWeight: 600,
      color: isPositive ? "#4ade80" : "#f87171",
      background: isPositive ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
      padding: "2px 8px",
      borderRadius: "20px",
    }}>
      {isPositive ? "↑" : "↓"} {Math.abs(value)}% من الشهر الماضي
    </span>
  );
}

function StatCard({
  label,
  value,
  growth,
  accent = false,
}: {
  label: string;
  value: string | number;
  growth?: number | null;
  accent?: boolean;
}) {
  return (
    <div style={{
      background: "#111",
      border: accent ? "1px solid rgba(201,168,76,0.4)" : "1px solid #1e1e1e",
      borderRadius: "12px",
      padding: "20px 24px",
      flex: 1,
      minWidth: "160px",
    }}>
      <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>{label}</p>
      <p style={{
        fontSize: "28px",
        fontWeight: 700,
        color: accent ? "#c9a84c" : "#fff",
        letterSpacing: "-0.5px",
        marginBottom: growth !== undefined ? "8px" : "0",
      }}>{value}</p>
      {growth !== undefined && <GrowthBadge value={growth ?? null} />}
    </div>
  );
}

function DistBar({
  label,
  count,
  total,
  color = "#c9a84c",
}: {
  label: string;
  count: number;
  total: number;
  color?: string;
}) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "13px", color: "#aaa" }}>{label}</span>
        <span style={{ fontSize: "13px", color: "#666" }}>{count} ({pct}%)</span>
      </div>
      <div style={{ background: "#1e1e1e", borderRadius: "4px", height: "6px" }}>
        <div style={{
          background: color,
          borderRadius: "4px",
          height: "6px",
          width: `${pct}%`,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#fff", margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>{subtitle}</p>}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p style={{ fontSize: "13px", color: "#444", textAlign: "center", padding: "24px 0" }}>
      {message}
    </p>
  );
}

function LoadingCard() {
  return (
    <div style={{
      background: "#111",
      border: "1px solid #1e1e1e",
      borderRadius: "12px",
      padding: "32px",
      textAlign: "center",
    }}>
      <p style={{ color: "#444", fontSize: "13px" }}>جاري التحميل...</p>
    </div>
  );
}

// ═══════════════════════════════
// الصفحة الرئيسية
// ═══════════════════════════════

export default function AnalyticsPage() {
  const [users, setUsers] = useState<UsersData | null>(null);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    try {
      const [u, r, a] = await Promise.all([
        fetch("/api/admin/analytics/users").then((res) => res.json()),
        fetch("/api/admin/analytics/revenue").then((res) => res.json()),
        fetch("/api/admin/analytics/activity").then((res) => res.json()),
      ]);
      setUsers(u);
      setRevenue(r);
      setActivity(a);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setRefreshing(false);
    }
}, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
        if (!cancelled) await fetchAll();
    };

    load();

    const interval = setInterval(() => {
        if (!cancelled) fetchAll();
    }, 5 * 60 * 1000);

    return () => {
        cancelled = true;
        clearInterval(interval);
    };
}, [fetchAll]);

  // North Star Metric
  const conversionRate =
    users && revenue && users.newThisMonth > 0
      ? ((revenue.activeSubscriptions / users.newThisMonth) * 100).toFixed(1)
      : null;

  const conversionLabel =
    conversionRate === null ? "—"
    : Number(conversionRate) >= 5 ? "ممتاز 🎯"
    : Number(conversionRate) >= 3 ? "جيد جداً"
    : Number(conversionRate) >= 1 ? "عادي"
    : "يحتاج تحسين";

  const s: React.CSSProperties = { direction: "rtl" };

  return (
    <div style={s}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#fff", margin: 0 }}>التحليلات</h1>
          {lastUpdated && (
            <p style={{ fontSize: "12px", color: "#444", marginTop: "4px" }}>
              آخر تحديث: {lastUpdated.toLocaleTimeString("ar-SA")}
            </p>
          )}
        </div>
        <button
          onClick={fetchAll}
          disabled={refreshing}
          style={{
            background: "transparent",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            padding: "8px 16px",
            color: refreshing ? "#444" : "#aaa",
            fontSize: "13px",
            cursor: refreshing ? "not-allowed" : "pointer",
          }}
        >
          {refreshing ? "جاري التحديث..." : "↻ تحديث"}
        </button>
      </div>

      {/* North Star Metric */}
      <div style={{
        background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))",
        border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: "16px",
        padding: "28px 32px",
        marginBottom: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div>
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>
            مقياس النجاح الرئيسي
          </p>
          <h2 style={{ fontSize: "14px", color: "#ccc", margin: "0 0 4px" }}>
            نسبة التحويل — مستخدم جديد → مشترك
          </h2>
          <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>
            أقل من 1% يحتاج تحسين · 1-3% عادي · 3-5% جيد · +5% ممتاز
          </p>
        </div>
        <div style={{ textAlign: "left" }}>
          <p style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#c9a84c",
            margin: 0,
            letterSpacing: "-1px",
            lineHeight: 1,
          }}>
            {conversionRate !== null ? `${conversionRate}%` : "—"}
          </p>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "6px", textAlign: "center" }}>
            {conversionLabel}
          </p>
        </div>
      </div>

      {/* قسم المستخدمين */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title="المستخدمون" subtitle="بيانات الشهر الحالي" />
        {!users ? <LoadingCard /> : (
          <>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <StatCard label="إجمالي المستخدمين" value={users.total} />
              <StatCard label="جدد هذا الشهر" value={users.newThisMonth} growth={users.growthPercent} accent />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", flexWrap: "wrap" }}>

              {/* Onboarding */}
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px" }}>حالة الـ Onboarding</p>
                {users.total === 0 ? <EmptyState message="لا يوجد مستخدمون بعد" /> : (
                  <>
                    <DistBar label="أكمل" count={users.onboardingDist.completed || 0} total={users.total} color="#4ade80" />
                    <DistBar label="تخطى" count={users.onboardingDist.skipped || 0} total={users.total} color="#f59e0b" />
                    <DistBar label="لم يبدأ" count={users.onboardingDist.pending || 0} total={users.total} color="#555" />
                  </>
                )}
              </div>

              {/* الموقع */}
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px" }}>الموقع الجغرافي</p>
                {users.total === 0 ? <EmptyState message="لا يوجد بيانات" /> : (
                  <>
                    <DistBar label="خارج سوريا" count={users.locationDist.outside_syria || 0} total={users.total} color="#c9a84c" />
                    <DistBar label="داخل سوريا" count={users.locationDist.inside_syria || 0} total={users.total} color="#60a5fa" />
                    <DistBar label="غير محدد" count={users.locationDist.unknown || 0} total={users.total} color="#333" />
                  </>
                )}
              </div>

              {/* الأهداف */}
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px" }}>ما يبحث عنه المستخدمون</p>
                {Object.keys(users.goalDist).length === 0 ? <EmptyState message="لا يوجد بيانات بعد" /> : (
                  Object.entries(users.goalDist)
                    .sort((a, b) => b[1] - a[1])
                    .map(([goal, count]) => (
                      <DistBar
                        key={goal}
                        label={GOAL_LABELS[goal] || goal}
                        count={count}
                        total={users.total}
                        color="#c9a84c"
                      />
                    ))
                )}
              </div>

              {/* أكثر الدول */}
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px" }}>أكثر الدول تكراراً</p>
                {users.topCountries.length === 0 ? <EmptyState message="لا يوجد مستخدمون خارج سوريا بعد" /> : (
                  users.topCountries.map(({ country, count }) => (
                    <DistBar
                      key={country}
                      label={COUNTRY_LABELS[country] || country}
                      count={count}
                      total={users.total}
                      color="#60a5fa"
                    />
                  ))
                )}
              </div>

            </div>
          </>
        )}
      </div>

      {/* قسم الإيرادات */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title="الإيرادات" subtitle="بيانات الشهر الحالي" />
        {!revenue ? <LoadingCard /> : (
          <>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <StatCard label="إيرادات هذا الشهر" value={`$${revenue.revenueThisMonth}`} growth={revenue.revenueGrowth} accent />
              <StatCard label="إجمالي الإيرادات" value={`$${revenue.totalRevenue}`} />
              <StatCard label="اشتراكات نشطة" value={revenue.activeSubscriptions} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

              {/* طرق الدفع */}
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px" }}>طرق الدفع</p>
                {Object.keys(revenue.methodDist).length === 0
                  ? <EmptyState message="لا توجد مدفوعات هذا الشهر — ابدأ التسويق" />
                  : Object.entries(revenue.methodDist).map(([method, count]) => (
                    <DistBar
                      key={method}
                      label={method === "oxapay" ? "USDT" : method === "sham_cash" ? "شام كاش" : method}
                      count={count}
                      total={Object.values(revenue.methodDist).reduce((a, b) => a + b, 0)}
                      color="#c9a84c"
                    />
                  ))
                }
              </div>

              {/* توزيع الخطط */}
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px" }}>توزيع الخطط</p>
                {Object.keys(revenue.planDist).length === 0
                  ? <EmptyState message="لا توجد اشتراكات بعد" />
                  : Object.entries(revenue.planDist).map(([plan, count]) => (
                    <DistBar
                      key={plan}
                      label={plan === "starter" ? "ستارتر" : plan === "plus" ? "بلس" : plan === "pro" ? "برو" : plan}
                      count={count}
                      total={Object.values(revenue.planDist).reduce((a, b) => a + b, 0)}
                      color="#a78bfa"
                    />
                  ))
                }
              </div>

            </div>
          </>
        )}
      </div>

      {/* قسم النشاط */}
      <div style={{ marginBottom: "32px" }}>
        <SectionHeader title="النشاط" subtitle="من جدول events" />
        {!activity ? <LoadingCard /> : (
          <>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <StatCard label="إجمالي الأحداث" value={activity.totalEvents} />
              <StatCard label="أحداث هذا الشهر" value={activity.eventsThisMonth} growth={activity.activityGrowth} accent />
              <StatCard label="مستخدمون نشطون" value={activity.uniqueActiveUsers} />
            </div>

            {activity.totalEvents === 0 ? (
              <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
                <p style={{ color: "#444", fontSize: "14px", marginBottom: "8px" }}>لا توجد أحداث مسجّلة بعد</p>
                <p style={{ color: "#333", fontSize: "12px" }}>ستظهر البيانات هنا عند بدء استخدام المنصة</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "20px 24px" }}>
                  <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px" }}>أنواع الأحداث</p>
                  {Object.entries(activity.eventTypeDist)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <DistBar key={type} label={type} count={count} total={activity.eventsThisMonth} color="#c9a84c" />
                    ))}
                </div>
                <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "20px 24px" }}>
                  <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px" }}>فئات الأحداث</p>
                  {Object.entries(activity.categoryDist)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, count]) => (
                      <DistBar key={cat} label={cat} count={count} total={activity.eventsThisMonth} color="#60a5fa" />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}