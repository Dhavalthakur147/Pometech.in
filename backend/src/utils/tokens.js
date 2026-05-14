import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(admin) {
  return jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function createResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + env.RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000).toISOString();
  return { token, tokenHash, expiresAt };
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
