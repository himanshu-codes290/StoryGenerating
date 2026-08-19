import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getTextStreamKey, redisClient } from "../infrastructure/redis/textStream.redis.js";
import { writeSSE } from "../utils/writeSSE.js";
import type { StreamEvent } from "../infrastructure/redis/streamChannels.js";
import { textQueue } from "../infrastructure/bullmq/bullmq.textGeneration.queue.js";
import { env } from "../config/env.js";
import { JobIdParamsSchema } from "../schemas/index.js";
import { validateParams } from "../middleware/validate.js";

export async function streamTextRoute(app: FastifyInstance) {
  app.get(
    "/stream/:jobId/text",
    { preHandler: [validateParams(JobIdParamsSchema)] },
    async (
      request: FastifyRequest<{ Params: { jobId: string } }>,
      reply: FastifyReply
    ) => {
      const { jobId } = request.params;

      const job = await textQueue.getJob(jobId);

      if (!job) {
        return reply.code(404).send({
          message: "Job not found",
        });
      }

      const state = await job.getState();

      if (state === "failed") {
        return reply.code(409).send({
          message: job.failedReason ?? "Job failed",
        });
      }

      const completed = state === "completed";


      // The SSE routes call reply.raw.writeHead() which bypasses @fastify/cors.
      // We must manually add CORS headers here so the browser doesn't block the stream.
      const corsOrigin = (env.FRONTEND_ORIGIN.split(",")[0] ?? "*").trim();

      if (completed) {
        reply.raw.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": corsOrigin,
        });

        reply.raw.flushHeaders();
        reply.hijack();

        const result = job.returnvalue;

        writeSSE(reply, {
          type: "token",
          data: result.textResult,
        });

        writeSSE(reply, {
          type: "complete",
        });

        reply.raw.end();
        return;
      }

      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": corsOrigin,
      });

      reply.raw.flushHeaders();
      reply.hijack();

      const redis = redisClient.duplicate();
      let lastId = "0-0";
      let closed = false;

      request.raw.on("close", () => {
        closed = true;
        redis.disconnect();
      });

      const streamKey = getTextStreamKey(jobId);

      try {
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

              const eventIndex = fields.indexOf("event");

              if (eventIndex === -1) continue;

              const rawEvent = fields[eventIndex + 1];

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
      } finally {
        redis.disconnect();

      }

    }
  );
}