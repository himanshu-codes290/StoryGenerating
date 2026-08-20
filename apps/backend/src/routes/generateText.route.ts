import type { FastifyInstance } from "fastify";
import { successResponse } from "../utils/apiResponse.js";
import { enqueueTextGeneration } from "../services/enqueueTextGenerationJob.service.js";
import { TextBodySchema } from "../schemas/index.js";
import { validateBody } from "../middleware/validate.js";
import type { TextBody } from "../schemas/text.schema.js";

export async function generateTextRoutes(app: FastifyInstance) {
  app.post(
    "/generate/text",
    { preHandler: [validateBody(TextBodySchema)] },
    async (request, reply) => {
      const body = request.body as TextBody;

      const job = await enqueueTextGeneration(body);

      return reply.send(
        successResponse({
          jobId: job.id,
          status: "queued",
          streamUrl: `/api/v1/stream/${job.id}/text`,
        })
      );
    }
  );
}