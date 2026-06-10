import { Request, Response } from "express";
import { Feedback } from "../models/Feedback";
import { FeedbackSubmission } from "../types/feedback";

const VALID_LANGS = ["th", "en"];

export async function createFeedback(req: Request, res: Response): Promise<void> {
  const body = req.body as Partial<FeedbackSubmission>;

  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { lang, answers, submittedAt } = body;

  if (!lang || !VALID_LANGS.includes(lang)) {
    res.status(400).json({ error: "Field 'lang' must be 'th' or 'en'" });
    return;
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    res.status(400).json({ error: "Field 'answers' is required and must be an object" });
    return;
  }

  try {
    const doc = await Feedback.create({
      lang,
      answers,
      submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });

    res.status(201).json({ id: doc._id, status: "ok" });
  } catch (err) {
    console.error("[feedback] Failed to save submission", err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
}

export async function listFeedback(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

  try {
    const [items, total] = await Promise.all([
      Feedback.find()
        .sort({ receivedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Feedback.countDocuments(),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    console.error("[feedback] Failed to list submissions", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
}
