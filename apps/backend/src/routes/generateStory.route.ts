import type{FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import {generateStory, type storyGenerateObj} from "../services/generateStory.service.js"
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { AppError } from "../errors/appError.js";
import type { StoryJobData } from "../types/storyJob.type.js";
import { storyQueue } from "../infrastructure/bullmq.queue.js";


// 1. Enqueue Request Route
export async function generateStoryRoutes(app : FastifyInstance) {
    // app.post("/generate-story",async (request : FastifyRequest<{Body : storyGenerateObj}>, reply : FastifyReply) => {
    
    //     const story = await generateStory(request.body);
        
    //     return reply.send(successResponse({story}));
    // });

    app.post('/stories/generate', async (request: FastifyRequest<{ Body: StoryJobData }>, reply: FastifyReply) => {
        const { prompt } = request.body || {};

        if (!prompt) {
        return reply.status(400).send({ error: 'Prompt is required' });
        }

        const job = await storyQueue.add('generate-story', { prompt });

        return reply.send(successResponse({jobId: job.id,
        streamUrl: `api/v1/stories/stream/${job.id}`,}))
    });
}