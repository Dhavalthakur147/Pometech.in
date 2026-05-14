import { Router } from "express";
import authRoutes from "./authRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import portfolioRoutes from "./portfolioRoutes.js";
import clientRoutes from "./clientRoutes.js";
import orderRoutes from "./orderRoutes.js";
import messageRoutes from "./messageRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import docsRoutes from "./docsRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/clients", clientRoutes);
router.use("/orders", orderRoutes);
router.use("/messages", messageRoutes);
router.use("/payments", paymentRoutes);
router.use("/uploads", uploadRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/docs", docsRoutes);

export default router;
