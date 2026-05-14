import { Router } from "express";
import { createCrudController } from "../controllers/crudController.js";
import { createModel } from "../models/baseModel.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idSchema, orderSchema, orderStatusSchema } from "../validators/schemas.js";

const router = Router();
const controller = createCrudController(createModel("orders", ["service", "payment_status", "order_status"]));

router.use(requireAuth);
router.get("/", controller.list);
router.get("/:id", validate(idSchema), controller.get);
router.post("/", requireRole("super_admin", "admin"), validate(orderSchema), controller.create);
router.put("/:id", requireRole("super_admin", "admin"), validate(idSchema), validate(orderSchema), controller.update);
router.patch("/:id/status", requireRole("super_admin", "admin", "editor"), validate(idSchema), validate(orderStatusSchema), controller.update);
router.delete("/:id", requireRole("super_admin"), validate(idSchema), controller.remove);

export default router;
