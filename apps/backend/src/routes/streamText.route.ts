import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getTextStreamKey, redisClient } from "../infrastructure/redis/textStream.redis.js";
import { writeSSE } from "../utils/writeSSE.js";
import type { StreamEvent } from "../infrastructure/redis/streamChannels.js";

export async function streamTextRoute(app: FastifyInstance) {
  app.get(
    "/stream/:jobId/text",
    async (
      request: FastifyRequest<{ Params: { jobId: string } }>,
      reply: FastifyReply
    ) => {
      const { jobId } = request.params;

      if (!jobId) {
        return reply.code(400).send({
          message: "Job Id is required",
        });
      }

      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      reply.raw.flushHeaders();
      reply.hijack();

      writeSSE(reply, {
        type: "connected",
      });

      const redis = redisClient.duplicate();

      let lastId = "0-0";
      let closed = false;

      request.raw.on("close", () => {
        closed = true;
        redis.disconnect();
      });

      const streamKey = getTextStreamKey(jobId);

      while (!closed) {
        const response = await redis.xread(
          "BLOCK",
          0,
          "STREAMS",
          streamKey,
          lastId
        );

        if (!response) {
          continue;
        }

        for (const [, entries] of response) {
          for (const [id, fields] of entries) {
            lastId = id;

            const rawEvent = fields[1];

            if (!rawEvent)
                continue
            const event = JSON.parse(rawEvent) as StreamEvent;

            writeSSE(reply, event);

            if (
              event.type === "complete" ||
              event.type === "error"
            ) {
              reply.raw.end();
              return;
            }
          }
        }
      }
    }
  );
}