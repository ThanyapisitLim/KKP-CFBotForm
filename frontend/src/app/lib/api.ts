import { AnswersMap } from "../components/QuestionField";
import { Lang } from "../data/survey";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface FeedbackPayload {
  submittedAt: string;
  lang: Lang;
  answers: AnswersMap;
}

/**
 * Sends the survey payload to the backend API (POST /api/feedback).
 * Throws if the request fails or the response is not ok.
 */
export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  const res = await fetch(`${API_URL}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore JSON parse errors, fall back to default message
    }
    throw new Error(message);
  }
}

export interface FeedbackItem {
  _id: string;
  answers: AnswersMap;
  submittedAt: string;
}

export interface FeedbackListResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: FeedbackItem[];
}

/**
 * Fetches a page of feedback submissions from the backend
 * (GET /api/feedback?page=&limit=). Used by the admin dashboard.
 */
export async function fetchFeedbackList(page = 1, limit = 20): Promise<FeedbackListResponse> {
  const res = await fetch(`${API_URL}/api/feedback?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore JSON parse errors, fall back to default message
    }
    throw new Error(message);
  }

  return res.json();
}

/**
 * Fetches every feedback submission by paging through the backend
 * (the backend caps `limit` at 100 per request). Used for CSV export.
 */
export async function fetchAllFeedback(): Promise<FeedbackItem[]> {
  const limit = 100;
  const first = await fetchFeedbackList(1, limit);

  const items = [...first.items];
  for (let page = 2; page <= first.totalPages; page++) {
    const next = await fetchFeedbackList(page, limit);
    items.push(...next.items);
  }

  return items;
}
