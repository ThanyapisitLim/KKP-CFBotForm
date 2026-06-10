import { Router } from "express";
import { loginAdmin } from "../controllers/admin.controller";

const router = Router();

// POST /api/admin/login - verify admin credentials (called from the
// dashboard's Next.js API route, not directly from the browser)
router.post("/login", loginAdmin);

export default router;
