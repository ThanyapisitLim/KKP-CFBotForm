// Builds a CSV export of feedback submissions for the admin dashboard.

import { FeedbackItem } from "./api";
import { formatSubmission } from "./answerFormat";
import { Lang } from "../data/survey";

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Converts a list of feedback submissions into a CSV string.
 * One row per submission; one column per survey question (plus follow-ups),
 * using the question titles in the given language as headers.
 */
export function buildFeedbackCsv(items: FeedbackItem[], lang: Lang): string {
  const idLabel = lang === "th" ? "รหัสคำตอบ" : "Response ID";
  const dateLabel = lang === "th" ? "วันที่ส่ง" : "Submitted At";

  // Use an empty answers map to derive a stable list of question
  // headers/order from SECTIONS in survey.ts.
  const headerSections = formatSubmission({}, lang);
  const headers = [
    idLabel,
    dateLabel,
    ...headerSections.flatMap((section) =>
      section.items.map((entry) => `Q${entry.number} ${entry.question}`)
    ),
  ];

  const rows = items.map((item) => {
    const sections = formatSubmission(item.answers, lang);
    return [
      item._id,
      new Date(item.submittedAt).toLocaleString(lang === "th" ? "th-TH" : "en-US"),
      ...sections.flatMap((section) => section.items.map((entry) => entry.value)),
    ];
  });

  const lines = [headers, ...rows].map((row) => row.map(escapeCsvField).join(","));

  // Prepend a UTF-8 BOM so Excel opens Thai text correctly.
  return "﻿" + lines.join("\r\n");
}

/**
 * Triggers a browser download of the given CSV content.
 */
export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
