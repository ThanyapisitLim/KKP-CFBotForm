import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import feedbackRoutes from "./routes/feedback.routes";
import adminRoutes from "./routes/admin.routes";

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));

  // Simple request logger - helps confirm requests are reaching the server
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[req] ${req.method} ${req.originalUrl}`);
    next();
  });

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use("/api/feedback", feedbackRoutes);
  app.use("/api/admin", adminRoutes);

  // 404 fallback
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
