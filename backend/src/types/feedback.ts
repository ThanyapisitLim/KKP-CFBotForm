// Mirrors the shape produced by the frontend SurveyForm (see
// cf-bot-feedback/src/app/components/SurveyForm.tsx -> handleSubmit payload)

export type Lang = "th" | "en";

/**
 * Answers are keyed by question id (e.g. "q1_team", "q9_satisfaction_matrix").
 * Possible value shapes per question type:
 *  - text / textarea / radio / followUp   -> string
 *  - checkbox / checkboxLimit / ranking    -> string[]
 *  - matrix                                -> Record<rowId, 1-5>
 *  - "<questionId>__other" / "<questionId>__spec__<optionId>" -> string (free-text add-ons)
 */
export type AnswerValue = string | string[] | Record<string, number>;

export interface AnswersMap {
  [questionId: string]: AnswerValue;
}

export interface FeedbackSubmission {
  submittedAt: string; // ISO timestamp, set by client
  lang: Lang;
  answers: AnswersMap;
}
