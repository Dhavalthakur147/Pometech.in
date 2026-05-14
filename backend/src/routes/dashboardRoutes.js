import { Router } from "express";
import { clientGrowth, orderStatistics, overview, revenueReport, servicePerformance } from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/overview", overview);
router.get("/revenue-report", revenueReport);
router.get("/client-growth", clientGrowth);
router.get("/service-performance", servicePerformance);
router.get("/order-statistics", orderStatistics);

export default router;
