"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../components/Logo";
import LangToggle from "../components/LangToggle";
import { Lang } from "../data/survey";
import { FeedbackItem, fetchFeedbackList } from "../lib/api";
import { formatSubmission } from "../lib/answerFormat";

const PAGE_SIZE = 20;

export default function DashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("th");
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFeedbackList(page, PAGE_SIZE);
        if (cancelled) return;
        setItems(data.items);
        setTotalPages(Math.max(1, data.totalPages));
        setTotal(data.total);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load feedback", err);
        setError("โหลดข้อมูลไม่สำเร็จ กรุณาตรวจสอบว่า backend ทำงานอยู่");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/dashboard/login");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-cf-purple-lighter">
      <header className="sticky top-0 z-10 border-b border-cf-gray-light bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <LangToggle lang={lang} onChange={setLang} />
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-xl border border-cf-gray-light bg-white px-4 py-2 text-sm font-semibold text-cf-gray transition hover:border-cf-purple/50 hover:text-cf-purple-dark disabled:opacity-60"
            >
              {loggingOut ? "..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="mb-1 text-xl font-bold text-foreground sm:text-2xl">
          CF BOT Feedback — Submissions
        </h1>
        <p className="mb-6 text-sm text-cf-gray">
          {loading ? "กำลังโหลด..." : `ทั้งหมด ${total.toLocaleString()} รายการ`}
        </p>

        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {!error && !loading && items.length === 0 && (
          <p className="rounded-xl border border-cf-gray-light bg-white px-4 py-6 text-center text-sm text-cf-gray">
            ยังไม่มีข้อมูลแบบสอบถาม
          </p>
        )}

        <div className="flex flex-col gap-3">
          {items.map((item, idx) => {
            const isExpanded = expandedId === item._id;
            const rowNumber = (page - 1) * PAGE_SIZE + idx + 1;

            return (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border border-cf-gray-light bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item._id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-cf-purple-lighter sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cf-purple-light text-xs font-semibold text-cf-purple-darker">
                      {rowNumber}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {new Date(item.submittedAt).toLocaleString(lang === "th" ? "th-TH" : "en-US")}
                      </p>
                      <p className="truncate text-xs text-cf-gray">{item._id}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-cf-purple-dark">{isExpanded ? "▲" : "▼"}</span>
                </button>

                {isExpanded && (
                  <div className="border-t border-cf-gray-light px-4 py-4 sm:px-6">
                    {formatSubmission(item.answers, lang).map((section) => (
                      <div key={section.id} className="mb-5 last:mb-0">
                        <h3 className="mb-2 text-sm font-bold text-cf-purple-darker">
                          {section.title}
                        </h3>
                        <dl className="space-y-2">
                          {section.items.map((entry) => (
                            <div key={entry.id} className="text-sm">
                              <dt className="font-medium text-foreground">
                                {entry.number}. {entry.question}
                              </dt>
                              <dd className="mt-0.5 whitespace-pre-wrap text-cf-gray">
                                {entry.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="rounded-xl border border-cf-gray-light bg-white px-4 py-2 text-sm font-semibold text-cf-gray transition hover:border-cf-purple/50 hover:text-cf-purple-dark disabled:opacity-50"
            >
              {lang === "th" ? "ก่อนหน้า" : "Prev"}
            </button>
            <span className="text-sm text-cf-gray">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="rounded-xl border border-cf-gray-light bg-white px-4 py-2 text-sm font-semibold text-cf-gray transition hover:border-cf-purple/50 hover:text-cf-purple-dark disabled:opacity-50"
            >
              {lang === "th" ? "ถัดไป" : "Next"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
