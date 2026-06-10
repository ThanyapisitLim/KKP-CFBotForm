import { createApp } from "./app";
import { connectDB } from "./db/mongo";
import { env } from "./config/env";

async function main() {
  await connectDB();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[server] CF BOT feedback API listening on port ${env.port}`);
  });
}

main().catch((err) => {
  console.error("[server] Fatal startup error", err);
  process.exit(1);
});
