import { Router } from "express";
import { forgotPassword, forgotSchema, login, loginSchema, logout, resetPassword, resetSchema } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", requireAuth, logout);
router.post("/forgot-password", authLimiter, validate(forgotSchema), forgotPassword);
router.post("/reset-password", authLimiter, validate(resetSchema), resetPassword);
router.get("/session", requireAuth, (req, res) => res.json({ success: true, admin: req.admin }));

export default router;
