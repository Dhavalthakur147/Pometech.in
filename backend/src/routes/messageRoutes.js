import { Router } from "express";
import { deleteMessage, listMessages, replyMessage, saveContactForm } from "../controllers/messageController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idSchema, messageSchema, replySchema } from "../validators/schemas.js";

const router = Router();

router.post("/", validate(messageSchema), saveContactForm);
router.get("/", requireAuth, listMessages);
router.post("/:id/reply", requireAuth, requireRole("super_admin", "admin", "editor"), validate(idSchema), validate(replySchema), replyMessage);
router.delete("/:id", requireAuth, requireRole("super_admin", "admin"), validate(idSchema), deleteMessage);

export default router;
