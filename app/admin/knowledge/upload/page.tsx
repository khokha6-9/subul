"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [chunkCount, setChunkCount] = useState(0);
  const [step, setStep] = useState<"form" | "preview" | "uploading" | "done">("form");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    outline: "none",
    transition: "border 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "6px",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError("");
    }
  };

  const handlePreview = async () => {
    if (!file || !title) {
      setError("العنوان والملف مطلوبان");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("preview", "true");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ في المعالجة");
      setPreview(data.chunks.slice(0, 3));
      setChunkCount(data.totalChunks);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ غير معروف");
    }
  };

  const handleConfirm = async () => {
    if (!file) return;
    setStep("uploading");
    setProgress(10);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("country", country);
    formData.append("category", category);
    try {
      setProgress(40);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ في الرفع");
      setProgress(100);
      setChunkCount(data.totalChunks);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ غير معروف");
      setStep("preview");
    }
  };

  if (step === "done") {
    return (
      <div style={{ direction: "rtl", maxWidth: "520px", margin: "60px auto", textAlign: "center" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: "24px",
        }}>✓</div>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>
          تم الرفع بنجاح
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "32px" }}>
          تمت معالجة {chunkCount} قسم وحفظها في قاعدة المعرفة
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={() => router.push("/admin/knowledge")}
            style={{
              backgroundColor: "#0f172a", color: "#fff",
              padding: "10px 20px", borderRadius: "8px",
              border: "none", fontSize: "14px", cursor: "pointer", fontWeight: 500,
            }}
          >
            عرض القائمة
          </button>
          <button
            onClick={() => { setStep("form"); setTitle(""); setCountry(""); setCategory(""); setFile(null); }}
            style={{
              backgroundColor: "#fff", color: "#374151",
              padding: "10px 20px", borderRadius: "8px",
              border: "1px solid #e2e8f0", fontSize: "14px", cursor: "pointer",
            }}
          >
            رفع ملف آخر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ direction: "rtl", maxWidth: "600px" }}>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <Link href="/admin/knowledge" style={{ color: "#94a3b8", fontSize: "14px", textDecoration: "none" }}>
          إدارة المعرفة
        </Link>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: 500 }}>رفع ملف جديد</span>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        {["بيانات الملف", "معاينة المحتوى", "تأكيد الرفع"].map((s, i) => {
          const stepIndex = step === "form" ? 0 : step === "preview" ? 1 : 2;
          const isActive = i === stepIndex;
          const isDone = i < stepIndex;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%",
                backgroundColor: isDone ? "#0f172a" : isActive ? "#0f172a" : "#f1f5f9",
                color: isDone || isActive ? "#fff" : "#94a3b8",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 600, flexShrink: 0,
              }}>
                {isDone ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: "13px", color: isActive ? "#0f172a" : "#94a3b8", fontWeight: isActive ? 500 : 400 }}>
                {s}
              </span>
              {i < 2 && <span style={{ color: "#e2e8f0", margin: "0 4px" }}>—</span>}
            </div>
          );
        })}
      </div>

      {step === "form" && (
        <div style={{
          backgroundColor: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "12px", padding: "24px",
          display: "flex", flexDirection: "column", gap: "18px",
        }}>
          <div>
            <label style={labelStyle}>العنوان <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: منحة DAAD الدراسية في ألمانيا"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>الدولة</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} style={inputStyle}>
                <option value="">اختر الدولة</option>
                <option value="germany">ألمانيا</option>
                <option value="turkey">تركيا</option>
                <option value="canada">كندا</option>
                <option value="usa">الولايات المتحدة</option>
                <option value="uk">المملكة المتحدة</option>
                <option value="general">عام</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>التصنيف</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                <option value="">اختر التصنيف</option>
                <option value="scholarship">منح دراسية</option>
                <option value="visa">تأشيرة وإقامة</option>
                <option value="work">عمل وتوظيف</option>
                <option value="asylum">لجوء</option>
                <option value="education">تعليم</option>
                <option value="health">صحة</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>الملف <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{
              border: "1px dashed #cbd5e1", borderRadius: "8px",
              padding: "20px", textAlign: "center", backgroundColor: "#f8fafc",
            }}>
              <input
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-input"
              />
              <label htmlFor="file-input" style={{ cursor: "pointer" }}>
                {file ? (
                  <div>
                    <p style={{ fontSize: "14px", color: "#0f172a", fontWeight: 500 }}>{file.name}</p>
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: "14px", color: "#64748b" }}>اضغط لاختيار ملف</p>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>PDF, TXT, MD</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "10px 14px",
            }}>
              <p style={{ fontSize: "13px", color: "#dc2626" }}>{error}</p>
            </div>
          )}

          <button
            onClick={handlePreview}
            style={{
              backgroundColor: "#0f172a", color: "#fff",
              padding: "11px 20px", borderRadius: "8px",
              border: "none", fontSize: "14px", cursor: "pointer",
              fontWeight: 500, alignSelf: "flex-start",
            }}
          >
            معاينة المحتوى ←
          </button>
        </div>
      )}

      {step === "preview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            backgroundColor: "#fff", border: "1px solid #e2e8f0",
            borderRadius: "12px", padding: "20px",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "16px",
            }}>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
                معاينة المحتوى
              </p>
              <span style={{
                backgroundColor: "#f0fdf4", color: "#16a34a",
                fontSize: "12px", padding: "3px 10px", borderRadius: "20px",
                border: "1px solid #bbf7d0",
              }}>
                {chunkCount} قسم
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
              أول 3 أقسام من الملف:
            </p>
            {preview.map((chunk, i) => (
              <div key={i} style={{
                backgroundColor: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: "8px", padding: "12px", marginBottom: "8px",
              }}>
                <span style={{
                  fontSize: "11px", color: "#94a3b8", fontWeight: 500,
                  display: "block", marginBottom: "6px",
                }}>
                  القسم {i + 1}
                </span>
                <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.7", margin: 0 }}>
                  {chunk.slice(0, 200)}...
                </p>
              </div>
            ))}
          </div>

          {error && (
            <div style={{
              backgroundColor: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "10px 14px",
            }}>
              <p style={{ fontSize: "13px", color: "#dc2626" }}>{error}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleConfirm}
              style={{
                backgroundColor: "#0f172a", color: "#fff",
                padding: "11px 20px", borderRadius: "8px",
                border: "none", fontSize: "14px", cursor: "pointer", fontWeight: 500,
              }}
            >
              تأكيد الرفع
            </button>
            <button
              onClick={() => setStep("form")}
              style={{
                backgroundColor: "#fff", color: "#374151",
                padding: "11px 20px", borderRadius: "8px",
                border: "1px solid #e2e8f0", fontSize: "14px", cursor: "pointer",
              }}
            >
              رجوع
            </button>
          </div>
        </div>
      )}

      {step === "uploading" && (
        <div style={{
          backgroundColor: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "12px", padding: "40px 24px", textAlign: "center",
        }}>
          <p style={{ fontSize: "15px", color: "#0f172a", fontWeight: 500, marginBottom: "8px" }}>
            جاري المعالجة والرفع...
          </p>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>
            يتم توليد الـ embeddings وحفظها في قاعدة المعرفة
          </p>
          <div style={{
            width: "100%", height: "6px",
            backgroundColor: "#f1f5f9", borderRadius: "3px",
          }}>
            <div style={{
              width: `${progress}%`, height: "100%",
              backgroundColor: "#0f172a", borderRadius: "3px",
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}