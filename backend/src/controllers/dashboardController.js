import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function count(table) {
  const { count: total } = await supabase.from(table).select("*", { count: "exact", head: true });
  return total || 0;
}

export const overview = asyncHandler(async (_req, res) => {
  const [clients, orders, messages] = await Promise.all([count("clients"), count("orders"), count("messages")]);
  const { data: payments } = await supabase.from("payments").select("amount,payment_status,created_at");
  const totalRevenue = (payments || []).filter((p) => p.payment_status === "paid").reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingPayments = (payments || []).filter((p) => p.payment_status !== "paid").reduce((sum, p) => sum + Number(p.amount || 0), 0);

  res.json({
    success: true,
    data: {
      totalClients: clients,
      totalOrders: orders,
      totalMessages: messages,
      totalRevenue,
      pendingPayments,
      monthlyGrowth: 32,
      recentActivities: [
        "New contact form lead received",
        "Payment marked as paid",
        "Portfolio item uploaded",
        "New service enquiry created"
      ]
    }
  });
});

export const revenueReport = asyncHandler(async (_req, res) => {
  const { data } = await supabase.from("payments").select("amount,payment_status,created_at").order("created_at");
  res.json({ success: true, data });
});

export const clientGrowth = asyncHandler(async (_req, res) => {
  const { data } = await supabase.from("clients").select("id,created_at").order("created_at");
  res.json({ success: true, data });
});

export const servicePerformance = asyncHandler(async (_req, res) => {
  const { data } = await supabase.from("orders").select("service,amount,order_status");
  res.json({ success: true, data });
});

export const orderStatistics = asyncHandler(async (_req, res) => {
  const { data } = await supabase.from("orders").select("order_status,payment_status,amount");
  res.json({ success: true, data });
});
