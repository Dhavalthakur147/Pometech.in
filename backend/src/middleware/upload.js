import multer from "multer";
import { ApiError } from "../utils/apiError.js";

const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowed.includes(file.mimetype)) {
      return cb(new ApiError(400, "Invalid file type. Use JPG, PNG, WEBP, GIF, or PDF."));
    }
    cb(null, true);
  }
});
