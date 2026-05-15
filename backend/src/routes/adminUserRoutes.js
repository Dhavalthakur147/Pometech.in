import { Router } from "express";
import { createAdminUser, deleteAdminUser, listAdminUsers, updateAdminUser } from "../controllers/adminUserController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { adminUserSchema, idSchema } from "../validators/schemas.js";

const router = Router();

router.use(requireAuth, requireRole("super_admin"));
router.get("/", listAdminUsers);
router.post("/", validate(adminUserSchema), createAdminUser);
router.put("/:id", validate(idSchema), validate(adminUserSchema), updateAdminUser);
router.delete("/:id", validate(idSchema), deleteAdminUser);

export default router;
