import { Router } from "express";
import { createCrudController } from "../controllers/crudController.js";
import { createModel } from "../models/baseModel.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idSchema, serviceSchema } from "../validators/schemas.js";

const router = Router();
const controller = createCrudController(createModel("services", ["title", "description"]));

router.get("/", controller.list);
router.get("/:id", validate(idSchema), controller.get);
router.post("/", requireAuth, requireRole("super_admin", "admin"), validate(serviceSchema), controller.create);
router.put("/:id", requireAuth, requireRole("super_admin", "admin"), validate(idSchema), validate(serviceSchema), controller.update);
router.delete("/:id", requireAuth, requireRole("super_admin"), validate(idSchema), controller.remove);

export default router;
