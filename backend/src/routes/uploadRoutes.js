import { Router } from "express";
import { uploadFile } from "../controllers/uploadController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", requireAuth, requireRole("super_admin", "admin", "editor"), upload.single("file"), uploadFile);

export default router;
