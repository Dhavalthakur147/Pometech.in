import bcrypt from "bcryptjs";
import { z } from "zod";
import { env } from "../config/env.js";
import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { createResetToken, hashToken, signToken } from "../utils/tokens.js";
import { sendEmail } from "../services/emailService.js";

export const loginSchema = z.object({
  body: z.object({ email: z.string().email(), password: z.string().min(6) })
});

export const forgotSchema = z.object({
  body: z.object({ email: z.string().email() })
});

export const resetSchema = z.object({
  body: z.object({ token: z.string().min(20), password: z.string().min(8) })
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { data: admin, error } = await supabase.from("admin_users").select("*").eq("email", email.toLowerCase()).single();
  if (error || !admin) throw new ApiError(401, "Invalid email or password");

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) throw new ApiError(401, "Invalid email or password");

  const token = signToken(admin);
  res.json({
    success: true,
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: "Logout successful. Delete the token on the client." });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { data: admin } = await supabase.from("admin_users").select("id,email,name").eq("email", email.toLowerCase()).single();
  if (!admin) return res.json({ success: true, message: "If the email exists, reset instructions were sent." });

  const { token, tokenHash, expiresAt } = createResetToken();
  await supabase.from("admin_users").update({ reset_token: tokenHash, reset_token_expires_at: expiresAt }).eq("id", admin.id);

  const resetUrl = `${env.ADMIN_FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: admin.email,
    subject: "Reset your Pomegranate Technology admin password",
    html: `<p>Hello ${admin.name},</p><p>Reset your password here: <a href="${resetUrl}">${resetUrl}</a></p>`,
    text: `Reset your password: ${resetUrl}`
  });

  res.json({ success: true, message: "If the email exists, reset instructions were sent." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const tokenHash = hashToken(token);
  const { data: admin, error } = await supabase.from("admin_users").select("*").eq("reset_token", tokenHash).single();
  if (error || !admin || new Date(admin.reset_token_expires_at) < new Date()) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await supabase.from("admin_users").update({
    password: passwordHash,
    reset_token: null,
    reset_token_expires_at: null
  }).eq("id", admin.id);

  res.json({ success: true, message: "Password reset successful" });
});
