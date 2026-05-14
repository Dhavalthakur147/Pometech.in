import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/apiError.js";

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new ApiError(401, "Authentication token required");

    const payload = jwt.verify(token, env.JWT_SECRET);
    const { data, error } = await supabase
      .from("admin_users")
      .select("id,name,email,role,created_at")
      .eq("id", payload.id)
      .single();

    if (error || !data) throw new ApiError(401, "Invalid session");
    req.admin = data;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, "Invalid or expired token"));
  }
}

export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.admin?.role)) {
    return next(new ApiError(403, "You do not have permission for this action"));
  }
  next();
};
