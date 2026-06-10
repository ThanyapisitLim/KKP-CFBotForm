import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../src/app";
import { connectDB } from "../src/db/mongo";

// Reused across warm invocations of the same serverless function instance.
const app = createApp();
let dbReady: Promise<void> | null = null;

function ensureDB(): Promise<void> {
  if (!dbReady) {
    dbReady = connectDB().catch((err) => {
      // Allow the next request to retry instead of caching a failed connection forever.
      dbReady = null;
      throw err;
    });
  }
  return dbReady;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await ensureDB();
  } catch (err) {
    console.error("[api] Database connection failed", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Database connection failed" }));
    return;
  }

  // Express's Request/Response types add properties (params, query, body, ...)
  // that are populated at runtime by its internal middleware, so a plain
  // IncomingMessage/ServerResponse pair is safe to pass through here.
  app(req as never, res as never);
}
