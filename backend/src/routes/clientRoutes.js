import { Router } from "express";
import { createCrudController } from "../controllers/crudController.js";
import { createModel } from "../models/baseModel.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { clientSchema, idSchema } from "../validators/schemas.js";

const router = Router();
const controller = createCrudController(createModel("clients", ["name", "business_name", "phone", "email", "service", "status"]));

router.use(requireAuth);
router.get("/", controller.list);
router.get("/:id", validate(idSchema), controller.get);
router.post("/", requireRole("super_admin", "admin"), validate(clientSchema), controller.create);
router.put("/:id", requireRole("super_admin", "admin"), validate(idSchema), validate(clientSchema), controller.update);
router.delete("/:id", requireRole("super_admin"), validate(idSchema), controller.remove);

export default router;
