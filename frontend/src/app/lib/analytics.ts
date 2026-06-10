import { FeedbackItem } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface AnalyticsData {
  totalResponses: number;
  responsesByDate: Array<{ date: string; count: number }>;
  questionResponseRates: Array<{
    questionId: string;
    questionNumber: number;
    responseRate: number;
  }>;
  answerDistribution: Record<
    string,
    Array<{ label: string; count: number; percentage: number }>
  >;
}

/**
 * Fetch all feedback items to calculate analytics.
 * In a real app, this would be done server-side with aggregation.
 */
export async function fetchAnalytics(): Promise<AnalyticsData> {
  try {
    // Fetch all feedback with a high limit to get complete data
    const res = await fetch(
      `${API_URL}/api/feedback?page=1&limit=1000`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error(`Failed to fetch analytics: ${res.status}`);

    const data = await res.json();
    const items: FeedbackItem[] = data.items || [];

    // Calculate response rate by date
    const responsesByDate: Record<string, number> = {};
    items.forEach((item) => {
      const date = new Date(item.submittedAt).toLocaleDateString("en-CA"); // YYYY-MM-DD
      responsesByDate[date] = (responsesByDate[date] || 0) + 1;
    });

    const responsesByDateArray = Object.entries(responsesByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate answer distribution (requires knowing question structure)
    // This is a simplified version - in production you'd have proper typing
    const answerDistribution: Record<
      string,
      Array<{ label: string; count: number; percentage: number }>
    > = {};

    return {
      totalResponses: items.length,
      responsesByDate: responsesByDateArray,
      questionResponseRates: [],
      answerDistribution,
    };
  } catch (error) {
    console.error("Failed to fetch analytics", error);
    return {
      totalResponses: 0,
      responsesByDate: [],
      questionResponseRates: [],
      answerDistribution: {},
    };
  }
}
