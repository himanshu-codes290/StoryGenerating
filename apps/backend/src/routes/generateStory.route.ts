import type{FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import { successResponse } from "../utils/apiResponse.js";

import type { StoryJobData } from "../types/storyJob.type.js";
import { storyQueue } from "../infrastructure/bullmq/bullmq.storyQueue.js";


// 1. Enqueue Request Route
export async function generateStoryRoutes(app : FastifyInstance) {

    app.post('/generate/stories', async (request: FastifyRequest<{ Body: StoryJobData }>, reply: FastifyReply) => {
        const { prompt } = request.body || {};

        if (!prompt) {
        return reply.status(400).send({ error: 'Prompt is required' });
        }

        const job = await storyQueue.add('generate-story', { prompt });

        return reply.send(successResponse({
          jobId: job.id,
          streamUrl: `/api/v1/stories/stream/${job.id}`,
        }));
    });
}