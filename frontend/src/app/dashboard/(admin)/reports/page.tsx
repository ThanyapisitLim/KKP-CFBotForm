"use client";

import { useEffect, useState } from "react";
import { fetchFeedbackList } from "../../../lib/api";
import { SECTIONS } from "../../../data/survey";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetchFeedbackList(1, 1000);
        if (cancelled) return;

        const allQuestions = SECTIONS.flatMap((section) => section.questions);

        // Get answer distributions for radio/checkbox questions only
        const answerDistributions: Record<string, any[]> = {};

        allQuestions.forEach((q) => {
          if ((q.type === "radio" || q.type === "checkbox") && q.options) {
            const distribution: Record<string, number> = {};

            q.options.forEach((opt) => {
              distribution[opt.label.th] = 0;
            });

            response.items.forEach((item) => {
              const answer = item.answers[q.id];
              if (answer) {
                if (typeof answer === "string") {
                  distribution[answer] = (distribution[answer] || 0) + 1;
                } else if (Array.isArray(answer)) {
                  answer.forEach((a) => {
                    distribution[a] = (distribution[a] || 0) + 1;
                  });
                }
              }
            });

            answerDistributions[`Q${q.number}`] = Object.entries(distribution)
              .filter(([, count]) => count > 0)
              .map(([label, count]) => ({
                label,
                value: count,
                percentage: Math.round(
                  (count / response.items.length) * 100 * 100
                ) / 100,
              }))
              .sort((a, b) => b.value - a.value);
          }
        });

        setData({
          totalResponses: response.total,
          answerDistributions,
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load reports", err);
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

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-foreground">รายงาน</h1>
      <p className="mb-8 text-cf-gray">
        สรุปการตอบและข้อเสนอแนะจากผู้ตอบแบบสอบถาม
      </p>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-lg border border-cf-gray-light bg-white p-12 text-center">
          <p className="text-cf-gray">กำลังโหลดข้อมูล...</p>
        </div>
      ) : !data ? (
        <div className="rounded-lg border border-cf-gray-light bg-white p-12 text-center">
          <p className="text-cf-gray">ไม่พบข้อมูล</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="rounded-lg border border-cf-gray-light bg-white p-6">
            <p className="mb-2 text-sm font-medium text-cf-gray">
              รวมการตอบรับ
            </p>
            <p className="text-4xl font-bold text-foreground">
              {data.totalResponses}
            </p>
          </div>

          {Object.entries(data.answerDistributions).map(
            ([questionId, options]: [string, any]) => {
              const hasMultipleOptions = (options as any[]).length > 1;

              return (
                <div key={questionId} className="rounded-lg border border-cf-gray-light bg-white p-6">
                  <h3 className="mb-6 font-semibold text-foreground">
                    {questionId}
                  </h3>

                  {hasMultipleOptions ? (
                    <div className="space-y-4">
                      {(options as any[]).map((opt: any, idx: number) => (
                        <div key={idx}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">
                              {opt.label}
                            </span>
                            <span className="text-cf-gray">
                              {opt.value} ({opt.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-cf-gray-light">
                            <div
                              className="h-full bg-[#6d6fae] transition-all"
                              style={{
                                width: `${opt.percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {(options as any[])[0]?.label}
                      </span>
                      <span className="text-2xl font-bold text-[#6d6fae]">
                        {(options as any[])[0]?.value}
                      </span>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}