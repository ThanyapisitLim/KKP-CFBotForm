"use client";

import { useEffect, useState } from "react";
import { fetchAllFeedback, fetchFeedbackList } from "../../../lib/api";
import { buildFeedbackCsv, downloadCsv } from "../../../lib/csv";

const TEXT = {
  title: "ส่งออกข้อมูล CSV",
  description: "ดาวน์โหลดคำตอบแบบสอบถามทั้งหมดเป็นไฟล์ CSV (เปิดด้วย Excel/Google Sheets ได้)",
  totalLabel: "จำนวนคำตอบทั้งหมด",
  items: "รายการ",
  download: "ดาวน์โหลด CSV",
  preparing: "กำลังเตรียมไฟล์...",
  loading: "กำลังโหลด...",
  noData: "ยังไม่มีข้อมูลให้ส่งออก",
  error: "โหลดข้อมูลไม่สำเร็จ กรุณาตรวจสอบว่า backend ทำงานอยู่",
} as const;

export default function ExportPage() {
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFeedbackList(1, 1);
        if (cancelled) return;
        setTotal(data.total);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load feedback total", err);
        setError(TEXT.error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleExport = async () => {
    setExporting(true);
    setError(null);

    try {
      const items = await fetchAllFeedback();
      const csv = buildFeedbackCsv(items, "th");

      const today = new Date().toISOString().slice(0, 10);
      downloadCsv(csv, `cf-bot-feedback-${today}.csv`);
    } catch (err) {
      console.error("Failed to export feedback", err);
      setError(TEXT.error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-foreground">{TEXT.title}</h1>
        <p className="text-sm text-cf-gray">{TEXT.description}</p>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-cf-gray-light bg-white p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-sm font-medium text-cf-gray">{TEXT.totalLabel}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-cf-purple-dark">
                {loading ? "—" : (total ?? 0).toLocaleString()}
              </span>
              <span className="text-sm text-cf-gray">{TEXT.items}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={loading || exporting || (total ?? 0) === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-cf-purple px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cf-purple-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
            />
          </svg>
          {exporting ? TEXT.preparing : TEXT.download}
        </button>

        {!loading && (total ?? 0) === 0 && (
          <p className="mt-4 text-sm text-cf-gray">{TEXT.noData}</p>
        )}
      </div>
    </div>
  );
}
