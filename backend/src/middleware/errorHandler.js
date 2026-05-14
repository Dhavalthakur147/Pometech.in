import { ApiError } from "../utils/apiError.js";
import { logger } from "../utils/logger.js";

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  if (status >= 500) logger.error(err);
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    details: err.details || undefined
  });
}
