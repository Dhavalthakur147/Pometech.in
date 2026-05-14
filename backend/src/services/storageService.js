import { nanoid } from "nanoid";
import { env } from "../config/env.js";
import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/apiError.js";

export async function uploadToStorage(file, folder = "general") {
  if (!file) throw new ApiError(400, "File is required");

  const extension = file.originalname.split(".").pop();
  const path = `${folder}/${Date.now()}-${nanoid(10)}.${extension}`;

  const { error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw new ApiError(400, error.message);

  const { data } = supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl, mimetype: file.mimetype, size: file.size };
}
