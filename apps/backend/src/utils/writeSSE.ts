import type { FastifyReply } from "fastify";
import type { StreamEvent } from "../infrastructure/redis/streamChannels.js";



export function writeSSE(
    reply: FastifyReply,
    event: StreamEvent
) {
     reply.raw.write(
        `event: ${event.type}\n`
    );

    reply.raw.write(
        `data: ${JSON.stringify(event)}\n\n`
    );
}