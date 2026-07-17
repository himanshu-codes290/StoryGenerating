import Fastify from "fastify";
import {healthRoutes} from "./routes/health.js";
import {generateStoryRoutes} from "./routes/generateStory.js";

export function buildApp() {
  const app = Fastify({
    logger: true
  });
  app.register(healthRoutes,{
    prefix : "/api/v1"
  });
  app.register(generateStoryRoutes,{
    prefix : "/api/v1"
  });
  

  return app;
}
