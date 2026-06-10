import { Schema, model, Document } from "mongoose";
import { AnswersMap } from "../types/feedback";

export interface FeedbackDocument extends Document {
  answers: AnswersMap;
  submittedAt: Date;
}

const FeedbackSchema = new Schema<FeedbackDocument>(
  {
    // Flexible: answers shape follows SECTIONS in src/app/data/survey.ts
    // (string | string[] | Record<string, number> per question id)
    answers: { type: Schema.Types.Mixed, required: true },
    submittedAt: { type: Date, required: true },
  },
  {
    collection: "feedback_responses",
    timestamps: false,
  }
);

export const Feedback = model<FeedbackDocument>("Feedback", FeedbackSchema);
