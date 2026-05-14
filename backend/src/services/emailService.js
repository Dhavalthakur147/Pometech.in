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

export async function notifyAdminOfContact(message) {
  return sendEmail({
    to: env.ADMIN_EMAIL,
    subject: "New Pomegranate Technology contact lead",
    html: `<h2>New Contact Lead</h2><p><b>Name:</b> ${message.name}</p><p><b>Phone:</b> ${message.phone || "N/A"}</p><p><b>Email:</b> ${message.email || "N/A"}</p><p>${message.message}</p>`,
    text: `${message.name} - ${message.phone || ""} - ${message.email || ""}: ${message.message}`
  });
}
