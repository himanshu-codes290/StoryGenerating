import Fastify from "fastify";
import cors from "@fastify/cors";
import { healthRoutes } from "./routes/health.js";
import { generateStoryRoutes } from "./routes/generateStory.route.js";
import { errorHandler } from "./utils/errorHandler.js";
import { streamStoryRoute } from "./routes/streamStory.route.js";
import { generateSpeechRoute } from "./routes/generateSpeechFromText.route.js";
import { generateTextRoutes } from "./routes/generateText.route.js";
import { streamTextRoute } from "./routes/streamText.route.js";
import { env } from "./config/env.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // ── CORS ─────────────────────────────────────────────────────────────────
  // Allowed origins come from FRONTEND_ORIGIN env var (comma-separated).
  // Default: http://localhost:5173 (Vite dev server).
  const allowedOrigins = env.FRONTEND_ORIGIN
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  app.register(cors, {
    origin: (origin, cb) => {
      // Allow same-origin requests (origin is undefined) and requests from
      // any of the configured frontend domains.
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error(`CORS: origin '${origin}' is not allowed`), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials:false is intentional — EventSource (SSE) doesn't support credentials
    credentials: false,
  });
  // ─────────────────────────────────────────────────────────────────────────

  errorHandler(app);

  app.register(healthRoutes, { prefix: "/api/v1" });
  app.register(generateStoryRoutes, { prefix: "/api/v1" });
  app.register(streamStoryRoute, { prefix: "/api/v1" });
  app.register(generateSpeechRoute, { prefix: "/api/v1" });
  app.register(generateTextRoutes, { prefix: "/api/v1" });
  app.register(streamTextRoute, { prefix: "/api/v1" });

  return app;
}
