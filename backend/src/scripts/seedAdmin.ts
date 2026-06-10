import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { AdminUser } from "../models/AdminUser";

// Usage:
//   npm run seed:admin -- <username> <password>
// or set ADMIN_USERNAME / ADMIN_PASSWORD in the environment / .env file.
//
// Upserts an admin user with a bcrypt-hashed password into the
// `admin_users` collection.

async function main(): Promise<void> {
  const [, , argUsername, argPassword] = process.argv;

  const username = argUsername ?? process.env.ADMIN_USERNAME;
  const password = argPassword ?? process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error(
      "Usage: npm run seed:admin -- <username> <password>\n" +
        "(or set ADMIN_USERNAME / ADMIN_PASSWORD env vars)"
    );
    process.exit(1);
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  console.log("[seed:admin] Connected to MongoDB");

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await AdminUser.findOneAndUpdate(
      { username },
      { username, passwordHash },
      { upsert: true, new: true }
    );

    console.log(`[seed:admin] Admin user "${result.username}" is ready.`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error("[seed:admin] Failed:", err);
  process.exit(1);
});
