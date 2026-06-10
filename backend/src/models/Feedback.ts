import { Schema, model, Document } from "mongoose";
import { AnswersMap, Lang } from "../types/feedback";

export interface FeedbackDocument extends Document {
  lang: Lang;
  answers: AnswersMap;
  submittedAt: Date;
  receivedAt: Date;
  userAgent?: string;
  ip?: string;
}

const FeedbackSchema = new Schema<FeedbackDocument>(
  {
    lang: { type: String, enum: ["th", "en"], required: true },
    // Flexible: answers shape follows SECTIONS in src/app/data/survey.ts
    // (string | string[] | Record<string, number> per question id)
    answers: { type: Schema.Types.Mixed, required: true },
    submittedAt: { type: Date, required: true },
    receivedAt: { type: Date, default: () => new Date() },
    userAgent: { type: String },
    ip: { type: String },
  },
  {
    collection: "feedback_responses",
    timestamps: false,
  }
);

export const Feedback = model<FeedbackDocument>("Feedback", FeedbackSchema);
