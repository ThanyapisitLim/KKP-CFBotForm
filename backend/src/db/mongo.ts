import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectDB(): Promise<void> {
  // In serverless environments this can be called on every invocation of a
  // warm function instance - skip reconnecting if already connected
  // (readyState 1) or in the process of connecting (readyState 2).
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.mongoUri);
    console.log("[db] Connected to MongoDB");
  } catch (err) {
    console.error("[db] Failed to connect to MongoDB", err);
    throw err;
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected");
  });
}
