import type{FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import {generateStory, type storyGenerateObj} from "../services/generateStoryService.js"

export async function generateStoryRoutes(app : FastifyInstance) {
    app.post("/generate-story",async (request : FastifyRequest<{Body : storyGenerateObj}>, reply : FastifyReply) => {
    
        const story = await generateStory(request.body);
        
        return reply.send({
            story: story.choices[0]?.message.content
        });

    });
}
