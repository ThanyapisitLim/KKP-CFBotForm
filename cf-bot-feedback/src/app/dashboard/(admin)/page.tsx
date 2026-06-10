"use client";

import { useEffect, useState } from "react";
import { fetchFeedbackList } from "../../lib/api";

// 1. ✅ ย้าย StatCard ออกมาไว้นอก Component หลักตรงนี้
interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

const StatCard = ({ label, value, unit }: StatCardProps) => (
  <div className="rounded-lg border border-slate-200 bg-white p-6">
    <p className="mb-2 text-sm font-medium text-slate-600">{label}</p>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    {unit && <p className="mt-1 text-xs text-slate-500">{unit}</p>}
  </div>
);

// 2. Component หลักสำหรับแสดงหน้าเพจ
export default function OverviewPage() {
  const [stats, setStats] = useState<{
    total: number;
    thisWeek: number;
    avgPerDay: number;
  }>({ total: 0, thisWeek: 0, avgPerDay: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const data = await fetchFeedbackList(1, 1000);
        if (cancelled) return;

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const thisWeek = data.items.filter(
          (item) => new Date(item.submittedAt) > weekAgo
        ).length;

        // ตรงนี้พอยิง Mock Data ย้อนหลังหลายๆ วันเข้ามา ตัว dates.size จะนับได้ถูกต้องแล้วครับ
        const dates = new Set(
          data.items.map((item) => new Date(item.submittedAt).toDateString())
        );
        const avgPerDay =
          data.total > 0
            ? Math.round((data.total / (Math.max(1, dates.size) || 30)) * 100) /
              100
            : 0;

        setStats({
          total: data.total,
          thisWeek,
          avgPerDay,
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load stats", err);
          setError("ไม่สามารถโหลดข้อมูลได้");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        ภาพรวมฟีดแบ็ก
      </h1>
      <p className="mb-8 text-slate-600">
        ข้อมูลสรุปสถิติหลักของการตอบรับแบบสอบถาม
      </p>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        {/* เรียกใช้งานได้ปกติ ปลอดภัย ไร้กังวล */}
        <StatCard
          label="รับรองแบบสอบถามทั้งหมด"
          value={loading ? "..." : stats.total}
          unit="รายการ"
        />
        <StatCard
          label="รับรองในสัปดาห์นี้"
          value={loading ? "..." : stats.thisWeek}
          unit="รายการ"
        />
        <StatCard
          label="เฉลี่ยต่อวัน"
          value={loading ? "..." : stats.avgPerDay}
          unit="รายการ"
        />
      </div>
    </div>
  );
}