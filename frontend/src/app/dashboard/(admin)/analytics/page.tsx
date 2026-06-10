"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchFeedbackList } from "../../../lib/api";

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const data = await fetchFeedbackList(1, 1000);
        if (cancelled) return;

        const dateMap: Record<string, number> = {};
        data.items.forEach((item) => {
          const date = new Date(item.submittedAt).toLocaleDateString("en-CA");
          dateMap[date] = (dateMap[date] || 0) + 1;
        });

        const timeline = Object.entries(dateMap)
          .map(([date, count]) => ({
            date: new Date(date).toLocaleDateString("th-TH", {
              month: "short",
              day: "numeric",
            }),
            responses: count,
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        let cumulative = 0;
        const cumulativeTimeline = timeline.map((item) => {
          cumulative += item.responses;
          return { ...item, cumulative };
        });

        setChartData(cumulativeTimeline);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load analytics", err);
          setError("ไม่สามารถโหลดข้อมูลได้");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          การวิเคราะห์
        </h1>
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        การวิเคราะห์
      </h1>
      <p className="mb-8 text-cf-gray">แนวโน้มและกราฟการตอบรับแบบสอบถาม</p>

      {loading ? (
        <div className="rounded-lg border border-cf-gray-light bg-white p-12 text-center">
          <p className="text-cf-gray">กำลังโหลดข้อมูล...</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="rounded-lg border border-cf-gray-light bg-white p-12 text-center">
          <p className="text-cf-gray">ยังไม่มีข้อมูลเพียงพอ</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border border-cf-gray-light bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">
              การตอบรับรายวัน
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="responses" fill="#6d6fae" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-cf-gray-light bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">
              การตอบรับสะสม
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#6d6fae"
                  strokeWidth={2}
                  dot={{ fill: "#6d6fae", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
