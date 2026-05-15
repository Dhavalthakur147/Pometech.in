import { Router } from "express";
import { createCrudController } from "../controllers/crudController.js";
import { createModel } from "../models/baseModel.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { demoWorkSchema, idSchema } from "../validators/schemas.js";

const router = Router();
const controller = createCrudController(createModel("demo_work", ["title", "category", "description"]));

router.get("/", controller.list);
router.get("/:id", validate(idSchema), controller.get);
router.post("/", requireAuth, requireRole("super_admin", "admin", "editor"), validate(demoWorkSchema), controller.create);
router.put("/:id", requireAuth, requireRole("super_admin", "admin", "editor"), validate(idSchema), validate(demoWorkSchema), controller.update);
router.delete("/:id", requireAuth, requireRole("super_admin", "admin"), validate(idSchema), controller.remove);

export default router;
