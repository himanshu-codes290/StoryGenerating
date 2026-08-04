import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { TTSRequest, TTSResult} from "@repo/types/speech/tts.types"
import { generateSpeech } from "../services/generateTextToSpeech.service.js";

export async function generateSpeechRoute(app : FastifyInstance)
{
    app.post("/generate/speech", async (request : FastifyRequest<{Body : TTSRequest }>, reply : FastifyReply) => {
        
        const { text, provider, language, voice } = request.body;

        if (!text.trim()) {
        return reply.code(400).send({ message: "Text is required" });
        }

        if (!provider) {
        return reply.code(400).send({ message: "Provider is required" });
        }

        if (!language) {
        return reply.code(400).send({ message: "Language is required" });
        }

        if (!voice) {
        return reply.code(400).send({ message: "Voice is required" });
        }

        
        const result = await generateSpeech(request.body);

        reply.header("Content-Type", result.contentType);

        return reply.send(result.stream);
    })
}
