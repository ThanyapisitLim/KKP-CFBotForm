import { Router } from "express";
import { createFeedback, listFeedback } from "../controllers/feedback.controller";

const router = Router();

// POST /api/feedback - submit a survey response (called from SurveyForm)
router.post("/", createFeedback);

// GET /api/feedback - list submissions (for internal/admin use)
router.get("/", listFeedback);

export default router;
