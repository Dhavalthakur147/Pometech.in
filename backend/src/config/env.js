import dotenv from "dotenv";

dotenv.config();

const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] Missing ${key}. Add it to backend/.env before production.`);
  }
}

const splitOrigins = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:5000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  ADMIN_FRONTEND_URL: process.env.ADMIN_FRONTEND_URL || "http://localhost:3000",
  CORS_ORIGINS: splitOrigins(process.env.CORS_ORIGINS || `${process.env.FRONTEND_URL || "http://localhost:3000"},${process.env.ADMIN_FRONTEND_URL || "http://localhost:3000"}`),
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || "pomotech-uploads",
  JWT_SECRET: process.env.JWT_SECRET || "dev-only-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  RESET_TOKEN_EXPIRES_MINUTES: Number(process.env.RESET_TOKEN_EXPIRES_MINUTES || 15),
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  MAIL_FROM: process.env.MAIL_FROM || "Pomegranate Technology <no-reply@pomotech.in>",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@pomotech.in",
  WHATSAPP_PHONE: process.env.WHATSAPP_PHONE || "919875294387"
};
