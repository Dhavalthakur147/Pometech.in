import dotenv from "dotenv";

dotenv.config();

const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] Missing ${key}. Add it to backend/.env before production.`);
  }
}

const normalizeOrigin = (value) => value.trim().replace(/\/+$/, "");
const splitOrigins = (value) => value.split(",").map(normalizeOrigin).filter(Boolean);

const defaultFrontendUrl = "https://pometech-in.vercel.app";
const defaultAdminFrontendUrl = "https://pometech-in.vercel.app";
const defaultCorsOrigins = [
  process.env.FRONTEND_URL || defaultFrontendUrl,
  process.env.ADMIN_FRONTEND_URL || defaultAdminFrontendUrl,
  "https://pometech-in-git-main-dhavalthakur147s-projects.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
].map(normalizeOrigin);

const corsOrigins = [
  ...(process.env.CORS_ORIGINS ? splitOrigins(process.env.CORS_ORIGINS) : []),
  ...defaultCorsOrigins
];

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  API_BASE_URL: process.env.API_BASE_URL || "https://pometech-in.onrender.com",
  FRONTEND_URL: normalizeOrigin(process.env.FRONTEND_URL || defaultFrontendUrl),
  ADMIN_FRONTEND_URL: normalizeOrigin(process.env.ADMIN_FRONTEND_URL || defaultAdminFrontendUrl),
  CORS_ORIGINS: [...new Set(corsOrigins)],
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
  SMTP_TIMEOUT_MS: Number(process.env.SMTP_TIMEOUT_MS || 10000),
  MAIL_FROM: process.env.MAIL_FROM || "Pomegranate Technology <no-reply@pomotech.in>",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@pomotech.in",
  WHATSAPP_PHONE: process.env.WHATSAPP_PHONE || "919875294387"
};
