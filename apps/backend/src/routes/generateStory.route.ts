import type { FastifyInstance } from "fastify";
import { successResponse } from "../utils/apiResponse.js";
import { storyQueue } from "../infrastructure/bullmq/bullmq.storyQueue.js";
import { StoryBodySchema } from "../schemas/index.js";
import { validateBody } from "../middleware/validate.js";

// 1. Enqueue Request Route
export async function generateStoryRoutes(app: FastifyInstance) {
  app.post(
    "/generate/stories",
    { preHandler: [validateBody(StoryBodySchema)] },
    async (request, reply) => {
      const { prompt } = request.body as { prompt: string };

      const job = await storyQueue.add("generate-story", { prompt });

      return reply.send(
        successResponse({
          jobId: job.id,
          streamUrl: `/api/v1/stories/stream/${job.id}`,
        })
      );
    }
  );
}