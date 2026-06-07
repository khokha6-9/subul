"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PLAN_NAMES: Record<string, string> = {
  starter: "ستارتر",
  plus: "بلس",
  pro: "برو",
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "بانتظار المراجعة", color: "#92620a", bg: "#fef3c7" },
  approved: { label: "مقبول", color: "#166534", bg: "#dcfce7" },
  rejected: { label: "مرفوض", color: "#991b1b", bg: "#fee2e2" },
  expired: { label: "منتهي", color: "#6b7280", bg: "#f3f4f6" },
};

type Payment = {
  id: string;
  user_id: string;
  plan: string;
  amount_usd: number;
  payment_method: string;
  status: string;
  transaction_id: string;
  notes: string | null;
  created_at: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("pending");

  const fetchPayments = async () => {
    setLoading(true);
    const query = supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query.eq("status", filter);
    }

    const { data } = await query;
    setPayments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) fetchPayments();
    }
    load();
    return () => { ignore = true; };
  }, [filter]);

  async function handleApprove(payment: Payment) {
    setActionLoading(payment.id);
    try {
      const res = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: payment.id }),
      });
      if (res.ok) fetchPayments();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(payment: Payment) {
    setActionLoading(payment.id);
    try {
      await supabase
        .from("payments")
        .update({ status: "rejected" })
        .eq("id", payment.id);
      fetchPayments();
    } finally {
      setActionLoading(null);
    }
  }

  const filters = [
    { key: "pending", label: "بانتظار المراجعة" },
    { key: "approved", label: "مقبول" },
    { key: "rejected", label: "مرفوض" },
    { key: "all", label: "الكل" },
  ];

  return (
    <div
      style={{
        padding: "2rem",
        direction: "rtl",
        color: "#111",
        minHeight: "100vh",
        background: "#f9fafb",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>
            طلبات الدفع
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            راجع واقبل أو ارفض طلبات الاشتراك
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "inherit",
                border: filter === f.key ? "1.5px solid #92620a" : "1px solid #e5e7eb",
                background: filter === f.key ? "#fef3c7" : "#fff",
                color: filter === f.key ? "#92620a" : "#6b7280",
                fontWeight: filter === f.key ? 600 : 400,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ fontSize: "13px", color: "#9ca3af" }}>جارٍ التحميل...</p>
        ) : payments.length === 0 ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "3rem",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "13px",
            }}
          >
            لا توجد طلبات
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {payments.map((payment) => {
              const statusInfo = STATUS_LABELS[payment.status] || STATUS_LABELS.pending;
              return (
                <div
                  key={payment.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: "#111" }}>
                        {PLAN_NAMES[payment.plan] || payment.plan}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: statusInfo.color,
                          background: statusInfo.bg,
                          padding: "2px 10px",
                          borderRadius: "20px",
                          fontWeight: 500,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#6b7280" }}>
                      <span>المبلغ: {payment.amount_usd}$</span>
                      <span>الطريقة: {payment.payment_method === "sham_cash" ? "شام كاش" : "USDT"}</span>
                      <span style={{ color: "#111", fontWeight: 500 }}>
                        رقم العملية: {payment.transaction_id}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                      {new Date(payment.created_at).toLocaleString("ar-SY")}
                    </div>
                  </div>

                  {payment.status === "pending" && (
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button
                        onClick={() => handleApprove(payment)}
                        disabled={actionLoading === payment.id}
                        style={{
                          background: "#166534",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 16px",
                          fontSize: "13px",
                          fontFamily: "inherit",
                          cursor: actionLoading === payment.id ? "not-allowed" : "pointer",
                          opacity: actionLoading === payment.id ? 0.6 : 1,
                        }}
                      >
                        قبول ✓
                      </button>
                      <button
                        onClick={() => handleReject(payment)}
                        disabled={actionLoading === payment.id}
                        style={{
                          background: "#fff",
                          color: "#991b1b",
                          border: "1px solid #fca5a5",
                          borderRadius: "8px",
                          padding: "8px 16px",
                          fontSize: "13px",
                          fontFamily: "inherit",
                          cursor: actionLoading === payment.id ? "not-allowed" : "pointer",
                          opacity: actionLoading === payment.id ? 0.6 : 1,
                        }}
                      >
                        رفض ✕
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}