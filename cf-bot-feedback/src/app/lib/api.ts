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
