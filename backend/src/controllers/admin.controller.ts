import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AdminUser } from "../models/AdminUser";

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  const body = req.body as { username?: unknown; password?: unknown };
  const { username, password } = body ?? {};

  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    res.status(400).json({ error: "Fields 'username' and 'password' are required" });
    return;
  }

  try {
    const user = await AdminUser.findOne({ username });
    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    res.json({ status: "ok", username: user.username });
  } catch (err) {
    console.error("[admin] Login failed", err);
    res.status(500).json({ error: "Login failed" });
  }
}
