import type{FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import { successResponse } from "../utils/apiResponse.js";

import type { generateTextRequest } from "@repo/types"
import { enqueueTextGeneration } from "../services/enqueueTextGenerationJob.service.js";



export async function generateTextRoutes(app : FastifyInstance) {
   
    app.post('/generate/text', async (request: FastifyRequest<{ Body: generateTextRequest }>, reply: FastifyReply) => {
        const { text, task, tone } = request.body || {};

       
      if (!text?.trim()) {
        return reply.status(400).send({
          error: "Text is required",
        });
      }

      if (!task) {
        return reply.status(400).send({
          error: "Task is required",
        });
      }

        const job = await enqueueTextGeneration(request.body);
        
        return reply.send(successResponse({jobId: job.id,
            status : "queued",
            streamUrl: `api/v1/stream/${job.id}/text`,}))
    });
}