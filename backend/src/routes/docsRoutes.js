import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    name: "Pomegranate Technology API",
    version: "1.0.0",
    auth: "Use Authorization: Bearer <JWT> for protected routes.",
    pagination: "Use ?page=1&limit=20&search=term&sortBy=created_at&sortOrder=desc",
    endpoints: {
      auth: ["POST /api/auth/login", "POST /api/auth/logout", "POST /api/auth/forgot-password", "POST /api/auth/reset-password", "GET /api/auth/session"],
      services: ["GET /api/services", "POST /api/services", "PUT /api/services/:id", "DELETE /api/services/:id"],
      portfolio: ["GET /api/portfolio", "POST /api/portfolio", "PUT /api/portfolio/:id", "DELETE /api/portfolio/:id"],
      clients: ["GET /api/clients", "POST /api/clients", "PUT /api/clients/:id", "DELETE /api/clients/:id"],
      orders: ["GET /api/orders", "POST /api/orders", "PATCH /api/orders/:id/status", "DELETE /api/orders/:id"],
      messages: ["POST /api/messages", "GET /api/messages", "POST /api/messages/:id/reply"],
      payments: ["GET /api/payments", "POST /api/payments", "PATCH /api/payments/:id/status"],
      uploads: ["POST /api/uploads multipart/form-data file=<image> type=portfolio|services|clients|profiles"],
      dashboard: ["GET /api/dashboard/overview", "GET /api/dashboard/revenue-report", "GET /api/dashboard/client-growth", "GET /api/dashboard/service-performance", "GET /api/dashboard/order-statistics"]
    }
  });
});

export default router;
