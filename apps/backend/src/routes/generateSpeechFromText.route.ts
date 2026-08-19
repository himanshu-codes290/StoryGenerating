import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { TTSRequest } from "@repo/types"
import { generateSpeechBuffer } from "../services/generateTextToSpeech.service.js";
import { storeAudio, getAudio, getAudioKey } from "../infrastructure/redis/audioStore.redis.js";
import { randomUUID } from "node:crypto";

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

        // Generate the full audio buffer (all chunks concatenated)
        const result = await generateSpeechBuffer(request.body);

        // Store in Redis with a single SET command
        const audioKey = getAudioKey(randomUUID());
        await storeAudio(audioKey, result.audio);

        reply.header("Content-Type", result.contentType);
        // Send the buffer directly — no streaming
        return reply.send(result.audio);
    });

    /**
     * Retrieve cached audio by key — single GET command from Redis.
     * Useful if you store the key and want to replay without re-generating.
     */
    app.get("/speech/:key", async (request : FastifyRequest<{ Params: { key: string }}>, reply: FastifyReply) => {
        const { key } = request.params;
        const audio = await getAudio(getAudioKey(key));

        if (!audio) {
            return reply.code(404).send({ message: "Audio not found or expired" });
        }

        reply.header("Content-Type", "audio/mpeg");
        return reply.send(audio);
    });
}
