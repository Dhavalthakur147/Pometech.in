import { env } from "../config/env.js";
import { mailer } from "../config/mail.js";
import { logger } from "../utils/logger.js";

function getMailFrom() {
  if (env.SMTP_HOST.includes("gmail") && env.SMTP_USER) {
    return `Pomegranate Technology <${env.SMTP_USER}>`;
  }
  return env.MAIL_FROM;
}

export async function sendEmail({ to, subject, html, text, replyTo }) {
  if (!mailer) {
    logger.warn(`Email skipped because SMTP_HOST is not configured: ${subject}`);
    return { skipped: true };
  }

  return mailer.sendMail({
    from: getMailFrom(),
    to,
    replyTo,
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
  const recipients = [...new Set([env.ADMIN_EMAIL, env.SMTP_USER].filter(Boolean))];
  return sendEmail({
    to: recipients,
    replyTo: message.email || undefined,
    subject: "New Pomegranate Technology contact lead",
    html: `<h2>New Contact Lead</h2><p><b>Name:</b> ${escapeHtml(message.name)}</p><p><b>Phone:</b> ${escapeHtml(message.phone || "N/A")}</p><p><b>Email:</b> ${escapeHtml(message.email || "N/A")}</p><p><b>Service:</b> ${escapeHtml(message.service || "N/A")}</p><p><b>Message:</b><br>${safeMessage}</p>`,
    text: `Name: ${message.name}\nPhone: ${message.phone || "N/A"}\nEmail: ${message.email || "N/A"}\nService: ${message.service || "N/A"}\n\n${message.message}`
  });
}
