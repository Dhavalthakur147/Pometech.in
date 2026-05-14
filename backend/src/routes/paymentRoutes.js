import { Router } from "express";
import { createCrudController } from "../controllers/crudController.js";
import { createModel } from "../models/baseModel.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idSchema, paymentSchema } from "../validators/schemas.js";

const router = Router();
const controller = createCrudController(createModel("payments", ["payment_method", "transaction_id", "payment_status"]));

router.use(requireAuth);
router.get("/", controller.list);
router.post("/", requireRole("super_admin", "admin"), validate(paymentSchema), controller.create);
router.put("/:id", requireRole("super_admin", "admin"), validate(idSchema), validate(paymentSchema), controller.update);
router.patch("/:id/status", requireRole("super_admin", "admin"), validate(idSchema), controller.update);

export default router;
