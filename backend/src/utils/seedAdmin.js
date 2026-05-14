import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { supabase } from "../config/supabase.js";

dotenv.config();

const name = process.env.SEED_ADMIN_NAME || "Super Admin";
const email = (process.env.SEED_ADMIN_EMAIL || "admin@pomotech.in").toLowerCase();
const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

const passwordHash = await bcrypt.hash(password, 12);

const { data, error } = await supabase
  .from("admin_users")
  .upsert({ name, email, password: passwordHash, role: "super_admin" }, { onConflict: "email" })
  .select("id,email,role")
  .single();

if (error) {
  console.error(error);
  console.error("\nSeed failed. Make sure backend/database/schema.sql has been run in your Supabase SQL Editor for this exact project.");
  process.exitCode = 1;
} else {
  console.log("Seeded admin:", data);
}
