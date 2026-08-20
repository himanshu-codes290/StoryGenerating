import type { FastifyInstance } from "fastify";
import { generateSpeechBuffer } from "../services/generateTextToSpeech.service.js";
import { storeAudio, getAudio, getAudioKey } from "../infrastructure/redis/audioStore.redis.js";
import { randomUUID } from "node:crypto";
import { TTSBodySchema, AudioKeyParamsSchema } from "../schemas/index.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import type { TTSBody } from "../schemas/tts.schema.js";
import type { TTSRequest } from "@repo/types";

export async function generateSpeechRoute(app: FastifyInstance) {
  /**
   * POST /generate/speech
   * Validate body with Zod, generate audio, cache in Redis, return buffer.
   */
  app.post(
    "/generate/speech",
    { preHandler: [validateBody(TTSBodySchema)] },
    async (request, reply) => {
      const body = request.body as TTSBody;

      // TTSBody is structurally compatible with TTSRequest
      const result = await generateSpeechBuffer(body as TTSRequest);

      // Store in Redis with a single SET command
      const audioKey = getAudioKey(randomUUID());
      await storeAudio(audioKey, result.audio);

      reply.header("Content-Type", result.contentType);
      // Send the buffer directly — no streaming
      return reply.send(result.audio);
    }
  );

  /**
   * GET /speech/:key
   * Retrieve cached audio by key — single GET command from Redis.
   * Useful if you store the key and want to replay without re-generating.
   */
  app.get(
    "/speech/:key",
    { preHandler: [validateParams(AudioKeyParamsSchema)] },
    async (request, reply) => {
      const { key } = request.params as { key: string };
      const audio = await getAudio(getAudioKey(key));

      if (!audio) {
        return reply.code(404).send({ message: "Audio not found or expired" });
      }

      reply.header("Content-Type", "audio/mpeg");
      return reply.send(audio);
    }
  );
}
