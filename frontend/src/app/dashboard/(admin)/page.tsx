"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchFeedbackList } from "@/app/lib/api";
import { SECTIONS } from "@/app/data/survey";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function ReportsPage() {
  const [rawItems, setRawItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State สำหรับบันทึกฟิลเตอร์ทีมที่ต้องการดูสรุปรายงาน ("all" = ทุกทีม)
  const [selectedTeam, setSelectedTeam] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetchFeedbackList(1, 1000);
        if (cancelled) return;
        setRawItems(response.items || []);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load reports data", err);
          setError("เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน");
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

  // 1. ดึงรายชื่อตัวเลือกทีมทั้งหมดจากข้อคำถาม q1_team ใน survey.ts โดยตรง
  const teamOptions = useMemo(() => {
    const q1Question = SECTIONS.flatMap((s) => s.questions).find((q) => q.id === "q1_team");
    return q1Question?.options || [];
  }, []);

  // 2. คัดกรองข้อมูลฟีดแบ็กตามทีมที่เลือกจาก Dropdown
  const filteredItems = useMemo(() => {
    if (selectedTeam === "all") return rawItems;
    return rawItems.filter((item) => item.answers?.q1_team === selectedTeam);
  }, [rawItems, selectedTeam]);

  // 3. คำนวณชาร์ตการตอบกลับสะสมรายวันตามกลุ่มข้อมูลที่ถูกกรอง
  const chartData = useMemo(() => {
    const dailyCounts: Record<string, number> = {};
    
    // เรียงลำดับวันตามเวลาส่งแบบสอบถาม
    const sortedItems = [...filteredItems].sort(
      (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );

    sortedItems.forEach((item) => {
      const dateStr = new Date(item.submittedAt).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
      });
      dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
    });

    let cumulative = 0;
    return Object.entries(dailyCounts).map(([date, count]) => {
      cumulative += count;
      return {
        date,
        responses: count,
        cumulative,
      };
    });
  }, [filteredItems]);

  // 4. คำนวณการกระจายของคำตอบ (Answer Distributions) ของคำถามทุกข้อแยกตามฟิลเตอร์ทีม
  const answerDistributions = useMemo(() => {
    const distributions: Record<string, any[]> = {};
    const allQuestions = SECTIONS.flatMap((section) => section.questions);

    allQuestions.forEach((q) => {
      // วิเคราะห์ข้อมูลเฉพาะคำถามแบบเลือกตอบ (Radio, Checkbox, Dropdown Select)
      if (
        (q.type === "radio" ||
          q.type === "checkbox" ||
          q.type === "select" ||
          q.type === "checkboxLimit") &&
        q.options
      ) {
        const distribution: Record<string, number> = {};

        // กำหนดให้ทุกตัวเลือกเริ่มต้นที่ 0 คะแนน
        q.options.forEach((opt) => {
          distribution[opt.label.th] = 0;
        });

        let totalAnswersForQuestion = 0;

        filteredItems.forEach((item) => {
          const answer = item.answers?.[q.id];
          if (answer) {
            // กรณีตอบข้อความเดียว (Radio, Select)
            if (typeof answer === "string") {
              const matchedOpt = q.options?.find((opt) => opt.id === answer);
              const label = matchedOpt ? matchedOpt.label.th : answer;
              distribution[label] = (distribution[label] || 0) + 1;
              totalAnswersForQuestion++;
            }
            // กรณีเลือกตอบได้หลายข้อ (Checkbox)
            else if (Array.isArray(answer)) {
              answer.forEach((ansId) => {
                const matchedOpt = q.options?.find((opt) => opt.id === ansId);
                const label = matchedOpt ? matchedOpt.label.th : ansId;
                distribution[label] = (distribution[label] || 0) + 1;
                totalAnswersForQuestion++;
              });
            }
          }
        });

        // บันทึกและคำนวณสัดส่วนเปอร์เซ็นต์ โดยอิงจากจำนวนผู้ตอบทั้งหมดของกลุ่มข้อมูลที่กรอง
        distributions[`Q${q.number}`] = Object.entries(distribution)
          .filter(([, count]) => count >= 0) // แสดงทุกหัวข้อเพื่อเห็นภาพรวม แม้จะเป็น 0
          .map(([label, count]) => ({
            label,
            value: count,
            percentage:
              filteredItems.length > 0
                ? Math.round((count / filteredItems.length) * 100 * 100) / 100
                : 0,
          }))
          .sort((a, b) => b.value - a.value); // เรียงตัวเลือกที่ตอบมากที่สุดไปน้อยสุด
      }
    });

    return distributions;
  }, [filteredItems]);

  return (
    <div className="space-y-6">
      {/* ส่วนหัวรายงานและ Dropdown ตัวเลือกกรองทีม */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">รายงานและสถิติคำตอบ</h1>
          <p className="mt-1 text-sm text-cf-gray">วิเคราะห์เจาะลึกคำตอบของแบบสอบถาม</p>
        </div>

        {/* Dropdown เลือกคัดกรองตามทีม */}
        <div className="w-full sm:w-72">
          <label className="mb-1.5 block text-xs font-semibold text-cf-gray">
            คัดกรองรายงานตามทีม / หน่วยงาน
          </label>
          <div className="relative">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full rounded-xl border border-cf-gray-light bg-white px-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-cf-purple focus:border-cf-purple cursor-pointer appearance-none pr-10"
            >
              <option value="all">ทุกทีม / ภาพรวมทั้งหมด</option>
              {teamOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label.th}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-cf-gray/60">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="py-20 text-center text-cf-gray">กำลังประมวลผลข้อมูล...</div>
      ) : (
        <div className="space-y-8">
          {/* ข้อมูลสะสมภาพรวมสำหรับการกรองขั้นต้น */}
          <div className="rounded-lg border border-cf-gray-light bg-white p-6">
            <span className="text-sm font-medium text-cf-gray">จำนวนผู้ตอบที่นำมาวิเคราะห์</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#6d6fae]">
                {filteredItems.length}
              </span>
              <span className="text-sm text-cf-gray">คน</span>
            </div>
          </div>

          {/* ชาร์ตแสดงการส่งแบบสอบถามรายวัน */}
          {chartData.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-cf-gray-light bg-white p-6">
                <h2 className="mb-4 text-base font-bold text-foreground">จำนวนตอบกลับรายวัน</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="responses" fill="#6d6fae" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg border border-cf-gray-light bg-white p-6">
                <h2 className="mb-4 text-base font-bold text-foreground">จำนวนการตอบกลับสะสม</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
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
                      dot={{ fill: "#6d6fae", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* การกระจายของคำตอบแยกตามหัวข้อคำถาม (Radio / Checkbox / Select) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground border-b pb-2">
              สัดส่วนคำตอบแยกทีละข้อคำถาม ({selectedTeam === "all" ? "ทุกทีม" : `เฉพาะทีม ${teamOptions.find(opt => opt.id === selectedTeam)?.label.th || selectedTeam}`})
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {SECTIONS.flatMap((s) => s.questions)
                .filter(
                  (q) =>
                    q.type === "radio" ||
                    q.type === "checkbox" ||
                    q.type === "select" ||
                    q.type === "checkboxLimit"
                )
                .map((q) => {
                  const options = answerDistributions[`Q${q.number}`] || [];

                  return (
                    <div
                      key={q.id}
                      className="rounded-lg border border-cf-gray-light bg-white p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="mb-4 flex items-start gap-2">
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6d6fae] text-xs font-semibold text-white">
                            {q.number}
                          </span>
                          <h3 className="text-sm font-semibold text-foreground leading-snug">
                            {q.title.th}
                          </h3>
                        </div>

                        {filteredItems.length === 0 ? (
                          <div className="py-8 text-center text-xs text-cf-gray">
                            ยังไม่มีข้อมูลการตอบกลับจากทีมนี้
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {options.map((opt, oIdx) => (
                              <div key={oIdx} className="space-y-1">
                                <div className="flex justify-between text-xs font-medium text-foreground">
                                  <span className="truncate pr-4">{opt.label}</span>
                                  <span className="shrink-0 text-cf-gray">
                                    {opt.value} คน ({opt.percentage}%)
                                  </span>
                                </div>
                                {/* หลอดสัดส่วนแสดงผล */}
                                <div className="h-2 w-full rounded-full bg-cf-gray-light/30">
                                  <div
                                    className="h-full rounded-full bg-[#6d6fae] transition-all"
                                    style={{
                                      width: `${opt.percentage}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}