import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const publicColumns = "id,name,email,role,created_at";

export const listAdminUsers = asyncHandler(async (_req, res) => {
  const { data, error } = await supabase
    .from("admin_users")
    .select(publicColumns)
    .order("created_at", { ascending: false });

  if (error) throw new ApiError(400, error.message);
  res.json({ success: true, data });
});

export const createAdminUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!password) throw new ApiError(400, "Password is required for a new admin user");

  const passwordHash = await bcrypt.hash(password, 12);
  const { data, error } = await supabase
    .from("admin_users")
    .insert({ name, email: email.toLowerCase(), password: passwordHash, role })
    .select(publicColumns)
    .single();

  if (error) throw new ApiError(400, error.message);
  res.status(201).json({ success: true, data });
});

export const updateAdminUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const payload = { name, email: email.toLowerCase(), role };
  if (password) payload.password = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("admin_users")
    .update(payload)
    .eq("id", req.params.id)
    .select(publicColumns)
    .single();

  if (error) throw new ApiError(400, error.message);
  res.json({ success: true, data });
});

export const deleteAdminUser = asyncHandler(async (req, res) => {
  if (req.admin.id === req.params.id) {
    throw new ApiError(400, "You cannot delete your own root account while logged in");
  }

  const { error } = await supabase.from("admin_users").delete().eq("id", req.params.id);
  if (error) throw new ApiError(400, error.message);
  res.json({ success: true, data: { id: req.params.id } });
});
