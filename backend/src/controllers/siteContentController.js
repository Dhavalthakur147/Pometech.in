import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const listSiteContent = asyncHandler(async (_req, res) => {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("key", { ascending: true });

  if (error) throw new ApiError(400, error.message);
  res.json({ success: true, data });
});

export const saveSiteContent = asyncHandler(async (req, res) => {
  const payload = {
    key: req.body.key,
    value: req.body.value,
    label: req.body.label || req.body.key,
    type: req.body.type || "text",
    updated_by: req.admin.id,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("site_content")
    .upsert(payload, { onConflict: "key" })
    .select("*")
    .single();

  if (error) throw new ApiError(400, error.message);
  res.json({ success: true, data });
});

export const deleteSiteContent = asyncHandler(async (req, res) => {
  const { error } = await supabase.from("site_content").delete().eq("key", req.params.key);
  if (error) throw new ApiError(400, error.message);
  res.json({ success: true, data: { key: req.params.key } });
});
