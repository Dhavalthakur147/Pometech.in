import { Router } from "express";
import { deleteSiteContent, listSiteContent, saveSiteContent } from "../controllers/siteContentController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { siteContentSchema } from "../validators/schemas.js";

const router = Router();

router.get("/", listSiteContent);
router.post("/", requireAuth, requireRole("super_admin", "admin"), validate(siteContentSchema), saveSiteContent);
router.delete("/:key", requireAuth, requireRole("super_admin"), deleteSiteContent);

export default router;
