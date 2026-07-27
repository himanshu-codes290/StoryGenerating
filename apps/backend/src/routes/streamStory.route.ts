import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { storyQueue, queueEvents } from "../infrastructure/bullmq.queue.js";


// 2. Real-time SSE Streaming Route
export function streamStoryRoute(app : FastifyInstance){
    app.get(
    '/stories/stream/:jobId',
    async (request: FastifyRequest<{ Params: { jobId: string } }>, reply: FastifyReply) => {
        const { jobId } = request.params;
        const job = await storyQueue.getJob(jobId);

        if (!job) {
        return reply.status(404).send({ error: 'Job not found' });
        }

        // Set proper HTTP headers for SSE
        reply.raw.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        });

        // Helper to send formatted SSE messages
        const sendSSE = (event: string, data: object) => {
        reply.raw.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        // If job was ALREADY finished before the client opened SSE connection
        const state = await job.getState();
        if (state === 'completed') {
        sendSSE('completed', job.returnvalue);
        return reply.raw.end();
        }

        sendSSE('status', { status: state });

        // Handle job completion in real-time
        const onCompleted = async (args: { jobId: string; returnvalue: string }) => {
        if (args.jobId === jobId) {
            // Parsed returnvalue from BullMQ QueueEvents
            const result = typeof args.returnvalue === 'string' 
            ? JSON.parse(args.returnvalue) 
            : args.returnvalue;

            sendSSE('completed', result);
            cleanup();
            reply.raw.end();
        }
        };

        const onFailed = (args: { jobId: string; failedReason: string }) => {
        if (args.jobId === jobId) {
            sendSSE('error', { error: args.failedReason });
            cleanup();
            reply.raw.end();
        }
        };

        const cleanup = () => {
        queueEvents.off('completed', onCompleted);
        queueEvents.off('failed', onFailed);
        };

        // Attach listeners
        queueEvents.on('completed', onCompleted);
        queueEvents.on('failed', onFailed);

        // Clean up if the client closes the browser tab early
        request.raw.on('close', () => {
        cleanup();
        });
    });
}