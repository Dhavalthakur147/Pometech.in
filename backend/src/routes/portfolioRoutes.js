import { Router } from "express";
import { createCrudController } from "../controllers/crudController.js";
import { createModel } from "../models/baseModel.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idSchema, portfolioSchema } from "../validators/schemas.js";

const router = Router();
const controller = createCrudController(createModel("portfolio", ["title", "category", "description"]));

router.get("/", controller.list);
router.get("/:id", validate(idSchema), controller.get);
router.post("/", requireAuth, requireRole("super_admin", "admin", "editor"), validate(portfolioSchema), controller.create);
router.put("/:id", requireAuth, requireRole("super_admin", "admin", "editor"), validate(idSchema), validate(portfolioSchema), controller.update);
router.delete("/:id", requireAuth, requireRole("super_admin", "admin"), validate(idSchema), controller.remove);

export default router;
