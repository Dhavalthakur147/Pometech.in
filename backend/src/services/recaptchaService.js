import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export async function verifyRecaptcha(token, remoteIp) {
  if (!env.RECAPTCHA_SECRET_KEY) {
    logger.warn("reCAPTCHA skipped because RECAPTCHA_SECRET_KEY is not configured.");
    return { configured: false, success: true };
  }

  if (!token) {
    return { configured: true, success: false, reason: "missing-token" };
  }

  const body = new URLSearchParams({
    secret: env.RECAPTCHA_SECRET_KEY,
    response: token
  });

  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch(env.RECAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    return { configured: true, success: false, reason: "verify-request-failed" };
  }

  const result = await response.json();
  return {
    configured: true,
    success: Boolean(result.success),
    score: result.score,
    action: result.action,
    errors: result["error-codes"] || []
  };
}
