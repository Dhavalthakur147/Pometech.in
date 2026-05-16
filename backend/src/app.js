import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.CORS_ORIGINS.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));
app.options("*", cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(apiLimiter);
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => {
  res.json({ message: "Pomegranate Technology API", docs: "/api/docs", health: "/health" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
