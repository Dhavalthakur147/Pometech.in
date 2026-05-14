import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToStorage } from "../services/storageService.js";

export const uploadFile = asyncHandler(async (req, res) => {
  const folder = req.body.type || req.query.type || "general";
  const data = await uploadToStorage(req.file, folder);
  res.status(201).json({ success: true, data });
});
