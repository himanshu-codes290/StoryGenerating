import Fastify from "fastify";
import {healthRoutes} from "./routes/health.js";
import {generateStoryRoutes} from "./routes/generateStory.route.js";
import { errorHandler } from "./utils/errorHandler.js";
import { streamStoryRoute } from "./routes/streamStory.route.js";

export function buildApp() {
  const app = Fastify({
    logger: true
  });
  errorHandler(app)

  app.register(healthRoutes,{
    prefix : "/api/v1"
  });
  app.register(generateStoryRoutes,{
    prefix : "/api/v1"
  });
  app.register(streamStoryRoute,{
    prefix : "/api/v1"
  });
  
  return app;
}
