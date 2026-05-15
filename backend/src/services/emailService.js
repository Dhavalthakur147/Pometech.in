import { env } from "../config/env.js";
import { mailer } from "../config/mail.js";
import { logger } from "../utils/logger.js";

export async function sendEmail({ to, subject, html, text }) {
  if (!mailer) {
    logger.warn(`Email skipped: ${subject}`);
    return { skipped: true };
  }

  return mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
    text
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function notifyAdminOfContact(message) {
  const safeMessage = escapeHtml(message.message || "").replace(/\n/g, "<br>");
  return sendEmail({
    to: env.ADMIN_EMAIL,
    subject: "New Pomegranate Technology contact lead",
    html: `<h2>New Contact Lead</h2><p><b>Name:</b> ${escapeHtml(message.name)}</p><p><b>Phone:</b> ${escapeHtml(message.phone || "N/A")}</p><p><b>Email:</b> ${escapeHtml(message.email || "N/A")}</p><p>${safeMessage}</p>`,
    text: `${message.name} - ${message.phone || ""} - ${message.email || ""}: ${message.message}`
  });
}
