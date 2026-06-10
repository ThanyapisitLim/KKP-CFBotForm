"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { fetchAllFeedback } from "@/app/lib/api";
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

// ----- Types ใช้ภายในหน้านี้สำหรับสรุปผลแต่ละประเภทคำถาม -----
interface DistributionEntry {
  label: string;
  value: number;
  percentage: number;
}

interface MatrixRowSummary {
  id: string;
  label: string;
  average: number;
  count: number;
}

interface MatrixSummary {
  rows: MatrixRowSummary[];
  overallAverage: number;
}

interface RankingSummary {
  text: string;
  score: number;
  counts: number[];
}

interface TextSummary {
  count: number;
  recent: { text: string; submittedAt: string }[];
}

// ----- Card ย่อยสำหรับแต่ละประเภทคำถาม -----

function QuestionCardShell({
  number,
  title,
  description,
  span,
  children,
}: {
  number: number | string;
  title: string;
  description?: string;
  span?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border border-cf-gray-light bg-white p-6 flex flex-col justify-between ${
        span ? "md:col-span-2" : ""
      }`}
    >
      <div>
        <div className="mb-4 flex items-start gap-2">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6d6fae] text-xs font-semibold text-white">
            {number}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-snug">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-cf-gray">{description}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-8 text-center text-xs text-cf-gray">ยังไม่มีข้อมูลการตอบกลับจากทีมนี้</div>
  );
}

function ChoiceDistributionCard({
  number,
  title,
  hasData,
  options,
}: {
  number: number;
  title: string;
  hasData: boolean;
  options: DistributionEntry[];
}) {
  return (
    <QuestionCardShell number={number} title={title}>
      {!hasData ? (
        <EmptyState />
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
              <div className="h-2 w-full rounded-full bg-cf-gray-light/30">
                <div
                  className="h-full rounded-full bg-[#6d6fae] transition-all"
                  style={{ width: `${opt.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </QuestionCardShell>
  );
}

function MatrixSummaryCard({
  number,
  title,
  description,
  hasData,
  summary,
}: {
  number: number;
  title: string;
  description?: string;
  hasData: boolean;
  summary: MatrixSummary;
}) {
  return (
    <QuestionCardShell number={number} title={title} description={description} span>
      {!hasData ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          <div className="flex items-baseline gap-2 rounded-lg bg-cf-purple-lighter/40 px-4 py-2">
            <span className="text-xs font-medium text-cf-gray">คะแนนเฉลี่ยรวม</span>
            <span className="text-2xl font-bold text-[#6d6fae]">
              {summary.overallAverage.toFixed(2)}
            </span>
            <span className="text-xs text-cf-gray">/ 5</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {summary.rows.map((row) => (
              <div key={row.id} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-foreground">
                  <span className="truncate pr-4">{row.label}</span>
                  <span className="shrink-0 text-cf-gray">
                    {row.count > 0 ? row.average.toFixed(2) : "—"} / 5
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-cf-gray-light/30">
                  <div
                    className="h-full rounded-full bg-[#6d6fae] transition-all"
                    style={{ width: `${(row.average / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </QuestionCardShell>
  );
}

function RankingSummaryCard({
  number,
  title,
  hasData,
  items,
}: {
  number: number;
  title: string;
  hasData: boolean;
  items: RankingSummary[];
}) {
  const maxScore = items.length > 0 ? items[0].score : 0;

  return (
    <QuestionCardShell
      number={number}
      title={title}
      description="คะแนนถ่วงน้ำหนัก: อันดับ 1 = 3 คะแนน, อันดับ 2 = 2 คะแนน, อันดับ 3 = 1 คะแนน"
      span
    >
      {!hasData || items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {items.slice(0, 8).map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-foreground">
                <span className="truncate pr-4">
                  {idx + 1}. {item.text}
                </span>
                <span className="shrink-0 text-cf-gray">
                  {item.score} คะแนน (อันดับ1: {item.counts[0] ?? 0}, อันดับ2: {item.counts[1] ?? 0},
                  อันดับ3: {item.counts[2] ?? 0})
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-cf-gray-light/30">
                <div
                  className="h-full rounded-full bg-[#6d6fae] transition-all"
                  style={{ width: `${maxScore > 0 ? (item.score / maxScore) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </QuestionCardShell>
  );
}

function TextResponsesCard({
  number,
  title,
  hasData,
  summary,
}: {
  number: number | string;
  title: string;
  hasData: boolean;
  summary: TextSummary;
}) {
  return (
    <QuestionCardShell
      number={number}
      title={title}
      description={`มีผู้ตอบทั้งหมด ${summary.count} คน`}
      span
    >
      {!hasData || summary.recent.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {summary.recent.map((entry, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-cf-gray-light/70 bg-cf-purple-lighter/20 px-3 py-2"
            >
              <p className="text-xs text-foreground whitespace-pre-line">{entry.text}</p>
              <p className="mt-1 text-[10px] text-cf-gray">
                {new Date(entry.submittedAt).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                  year: "2-digit",
                })}
              </p>
            </div>
          ))}
          {summary.count > summary.recent.length && (
            <Link
              href="/dashboard/responses"
              className="inline-block text-xs font-medium text-[#6d6fae] hover:underline"
            >
              ดูคำตอบทั้งหมดในหน้าคำตอบ →
            </Link>
          )}
        </div>
      )}
    </QuestionCardShell>
  );
}

// ----- หน้าหลัก -----

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
        const items = await fetchAllFeedback();
        if (cancelled) return;
        setRawItems(items || []);
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

  // 4. คำนวณการกระจายของคำตอบ (Answer Distributions) ของคำถามแบบเลือกตอบ
  const answerDistributions = useMemo(() => {
    const distributions: Record<string, DistributionEntry[]> = {};
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

        filteredItems.forEach((item) => {
          const answer = item.answers?.[q.id];
          if (answer) {
            // กรณีตอบข้อความเดียว (Radio, Select)
            if (typeof answer === "string") {
              const matchedOpt = q.options?.find((opt) => opt.id === answer);
              const label = matchedOpt ? matchedOpt.label.th : answer;
              distribution[label] = (distribution[label] || 0) + 1;
            }
            // กรณีเลือกตอบได้หลายข้อ (Checkbox)
            else if (Array.isArray(answer)) {
              answer.forEach((ansId) => {
                const matchedOpt = q.options?.find((opt) => opt.id === ansId);
                const label = matchedOpt ? matchedOpt.label.th : ansId;
                distribution[label] = (distribution[label] || 0) + 1;
              });
            }
          }
        });

        // บันทึกและคำนวณสัดส่วนเปอร์เซ็นต์ โดยอิงจากจำนวนผู้ตอบทั้งหมดของกลุ่มข้อมูลที่กรอง
        distributions[q.id] = Object.entries(distribution)
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

  // 5. คำนวณคะแนนเฉลี่ยรายข้อย่อยของคำถามแบบ Matrix (Q9, Q13)
  const matrixSummaries = useMemo(() => {
    const result: Record<string, MatrixSummary> = {};
    const matrixQuestions = SECTIONS.flatMap((s) => s.questions).filter((q) => q.type === "matrix");

    matrixQuestions.forEach((q) => {
      const rows = q.rows ?? [];
      let totalSum = 0;
      let totalCount = 0;

      const rowSummaries: MatrixRowSummary[] = rows.map((row) => {
        let sum = 0;
        let count = 0;

        filteredItems.forEach((item) => {
          const value = item.answers?.[q.id]?.[row.id];
          if (typeof value === "number" && value > 0) {
            sum += value;
            count += 1;
          }
        });

        totalSum += sum;
        totalCount += count;

        return {
          id: row.id,
          label: row.label.th,
          average: count > 0 ? Math.round((sum / count) * 100) / 100 : 0,
          count,
        };
      });

      result[q.id] = {
        rows: rowSummaries,
        overallAverage: totalCount > 0 ? Math.round((totalSum / totalCount) * 100) / 100 : 0,
      };
    });

    return result;
  }, [filteredItems]);

  // 6. คำนวณคะแนนถ่วงน้ำหนักของคำถามแบบ Ranking (Q12)
  const rankingSummaries = useMemo(() => {
    const result: Record<string, RankingSummary[]> = {};
    const rankingQuestions = SECTIONS.flatMap((s) => s.questions).filter((q) => q.type === "ranking");

    rankingQuestions.forEach((q) => {
      const totalRanks = q.rankLabels?.length ?? 3;
      const agg: Record<string, { score: number; counts: number[] }> = {};

      filteredItems.forEach((item) => {
        const value = (item.answers?.[q.id] as string[] | undefined) ?? [];
        value.forEach((text, idx) => {
          const trimmed = (text || "").trim();
          if (!trimmed) return;

          const weight = totalRanks - idx;
          if (!agg[trimmed]) agg[trimmed] = { score: 0, counts: new Array(totalRanks).fill(0) };
          agg[trimmed].score += weight;
          agg[trimmed].counts[idx] += 1;
        });
      });

      result[q.id] = Object.entries(agg)
        .map(([text, data]) => ({ text, score: data.score, counts: data.counts }))
        .sort((a, b) => b.score - a.score);
    });

    return result;
  }, [filteredItems]);

  // 7. รวบรวมคำตอบปลายเปิด (Q8 เหตุผล, Q16, Q17) ล่าสุด 5 รายการต่อข้อ
  const textSummaries = useMemo(() => {
    const result: Record<string, TextSummary> = {};
    const textFieldIds: string[] = [];

    SECTIONS.flatMap((s) => s.questions).forEach((q) => {
      if (q.type === "textarea") textFieldIds.push(q.id);
      if (q.followUp) textFieldIds.push(q.followUp.id);
    });

    textFieldIds.forEach((id) => {
      const answered = filteredItems
        .filter((item) => {
          const v = item.answers?.[id];
          return typeof v === "string" && v.trim().length > 0;
        })
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      result[id] = {
        count: answered.length,
        recent: answered.slice(0, 5).map((item) => ({
          text: (item.answers[id] as string).trim(),
          submittedAt: item.submittedAt,
        })),
      };
    });

    return result;
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
              <span className="text-4xl font-bold text-[#6d6fae]">{filteredItems.length}</span>
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

          {/* สรุปคำตอบทุกข้อ แบ่งตามส่วนของแบบสอบถาม */}
          {SECTIONS.map((section) => (
            <div key={section.id} className="space-y-6">
              <h2 className="text-xl font-bold text-foreground border-b pb-2">
                {section.title.th}{" "}
                <span className="text-sm font-normal text-cf-gray">
                  ({selectedTeam === "all"
                    ? "ทุกทีม"
                    : `เฉพาะทีม ${teamOptions.find((opt) => opt.id === selectedTeam)?.label.th || selectedTeam}`}
                  )
                </span>
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {section.questions.flatMap((q) => {
                  const cards: React.ReactNode[] = [];

                  switch (q.type) {
                    case "radio":
                    case "checkbox":
                    case "select":
                    case "checkboxLimit":
                      cards.push(
                        <ChoiceDistributionCard
                          key={q.id}
                          number={q.number}
                          title={q.title.th}
                          hasData={filteredItems.length > 0}
                          options={answerDistributions[q.id] || []}
                        />
                      );
                      break;

                    case "matrix":
                      cards.push(
                        <MatrixSummaryCard
                          key={q.id}
                          number={q.number}
                          title={q.title.th}
                          description={q.description?.th}
                          hasData={filteredItems.length > 0}
                          summary={
                            matrixSummaries[q.id] || { rows: [], overallAverage: 0 }
                          }
                        />
                      );
                      break;

                    case "ranking":
                      cards.push(
                        <RankingSummaryCard
                          key={q.id}
                          number={q.number}
                          title={q.title.th}
                          hasData={filteredItems.length > 0}
                          items={rankingSummaries[q.id] || []}
                        />
                      );
                      break;

                    case "textarea":
                      cards.push(
                        <TextResponsesCard
                          key={q.id}
                          number={q.number}
                          title={q.title.th}
                          hasData={filteredItems.length > 0}
                          summary={textSummaries[q.id] || { count: 0, recent: [] }}
                        />
                      );
                      break;

                    default:
                      break;
                  }

                  // คำถามตามมา (follow-up) เช่น เหตุผลของ Q8
                  if (q.followUp) {
                    cards.push(
                      <TextResponsesCard
                        key={q.followUp.id}
                        number={`${q.number}b`}
                        title={q.followUp.title.th}
                        hasData={filteredItems.length > 0}
                        summary={textSummaries[q.followUp.id] || { count: 0, recent: [] }}
                      />
                    );
                  }

                  return cards;
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
